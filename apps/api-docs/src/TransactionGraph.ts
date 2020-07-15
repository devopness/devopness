import fs from 'fs';
import toposort from 'toposort';

import TransactionSpec from './TransactionSpec';
import { fixtureKeyElement, isFixtureListKey } from './fixtureTypes';

type TransactionNode = string;
type FixtureNode = string;

type FixtureToTransactionListMap = { [key: string]: TransactionNode[] };

function fixtureTransactionGraphPush(map: FixtureToTransactionListMap, k: FixtureNode, v: TransactionNode) {
    const list = k in map ? map[k] : [];
    list.push(v);
    map[k] = list;
}

// this represents a graph of transactions and fixtures, using fixture nodes as the referential
interface FixtureTransactionGraph {
    // maps fixtures to a list of transactions that take it as input
    fixtureTransactionInputs: FixtureToTransactionListMap
    // maps fixtures to a list of transactions that take it as output
    fixtureTransactionOutputs: FixtureToTransactionListMap
    // maps fixtures to their delete transaction
    fixtureDeleteTransactions: FixtureToTransactionListMap
};

type LogFunction = (...any: any[]) => void;

// TransactionGraph represents a Directed Acyclical Graph (DAG) of transactions
// and their dependencies through fixtures
export default class TransactionGraph {
    adjacencyList: [TransactionNode, TransactionNode][] = [];
    log: LogFunction;

    constructor(transactionSpecs: TransactionSpec[], log: LogFunction) {
        this.log = log;

        // user_credentials and user_tokens are handled differently than other fixtures, so add them manually to the graph
        const initialFixtureTransactionGraph: FixtureTransactionGraph = {
            fixtureTransactionInputs: { 'user_credentials': ['login200'] },
            fixtureTransactionOutputs: { 'user_credentials': ['addUser201'], 'user_tokens': ['login200'] },
            fixtureDeleteTransactions:  { 'user_tokens': ['logout204'] }
        };
        const fixtureTransactionGraph = this.fixtureTransactionGraphFromTransactionSpecs(transactionSpecs, initialFixtureTransactionGraph);
        this.populateAdjacencyList(fixtureTransactionGraph);
    }

    addEdge(from: TransactionNode, to: TransactionNode) {
        this.adjacencyList.push([from, to]);
    }

    // get hidden nodes from fixtures in transaction specs, edges are transactions themselves
    fixtureTransactionGraphFromTransactionSpecs(transactionSpecs: TransactionSpec[], initialGraph: FixtureTransactionGraph): FixtureTransactionGraph {
        const { fixtureTransactionInputs, fixtureTransactionOutputs, fixtureDeleteTransactions } = initialGraph;
        for (const txSpec of transactionSpecs) {
            // delete transactions are terminal nodes
            if (txSpec.method == "delete") {
                // delete transactions should have only one input, but let's iterate anyways
                for (const input of txSpec.pathInputs) {
                   fixtureTransactionGraphPush(fixtureDeleteTransactions, fixtureKeyElement(input), txSpec.slug);
                }
            } else {
                if (txSpec.output) {                    
                    // list fixtures should be considered only to have inputs, as they don't _generate_ fixtures
                    if (isFixtureListKey(txSpec.output)) {
                        fixtureTransactionGraphPush(fixtureTransactionInputs, fixtureKeyElement(txSpec.output), txSpec.slug);
                    }
                    // skip output on transactions that have same input and output types to avoid cycles
                    else if (txSpec.pathInputs.indexOf(fixtureKeyElement(txSpec.output)) == -1) {
                        fixtureTransactionGraphPush(fixtureTransactionOutputs, fixtureKeyElement(txSpec.output), txSpec.slug);
                    }
                }
                for (const input of txSpec.pathInputs) {
                    fixtureTransactionGraphPush(fixtureTransactionInputs, input, txSpec.slug);
                }
            }
            // auth requires a `user_tokens` fixture
            if (txSpec.requiresAuth) {
                fixtureTransactionGraphPush(fixtureTransactionInputs, 'user_tokens', txSpec.slug)
            }
        }
        return { fixtureTransactionInputs, fixtureTransactionOutputs, fixtureDeleteTransactions };
    }

    // populates the fixture DAG adjacency list using the fixture transaction graph
    // considering the fixtures (x, y) and transactions (A, B, C),
    // this method takes a FixtureTransactionGraph:
    //       x - A - y - B - y - C
    // and transforms it into a TransactionGraph
    //       A - B - C
    populateAdjacencyList(fixtureTransactionGraph: FixtureTransactionGraph) {
        const { fixtureTransactionInputs, fixtureTransactionOutputs, fixtureDeleteTransactions } = fixtureTransactionGraph;

        const unreachable: { [tx: string]: boolean } = {};
        // first pass: check for unreachable fixtures and find transactions that require them
        for (const fixture in fixtureTransactionInputs) {
            // check if there's transaction producing that fixture, otherwise it's an unreachable branch
            if (!(fixture in fixtureTransactionOutputs)) {
                this.log(`fixture '${fixture}' has no generator transactions, skipping transactions [${fixtureTransactionInputs[fixture]}];`)
                for (const transaction of fixtureTransactionInputs[fixture] || []) {
                    unreachable[transaction] = true;
                }
                for (const transaction of fixtureDeleteTransactions[fixture] || []) {
                    unreachable[transaction] = true;
                }
            }
        }

        // second pass: add edges connecting fixture dependencies
        for (const fixture in fixtureTransactionInputs) {
            for (const input of fixtureTransactionInputs[fixture] || []) {
                if (unreachable[input]) {
                    continue;
                }
                for (const output of fixtureTransactionOutputs[fixture] || []) {
                    // transactions that take a fixture both as input and output
                    // are handled as terminal nodes to avoid cycles
                    if (!unreachable[output] && output != input) {
                        this.addEdge(output, input);
                    }
                }
                // delete transactions depend on all transactions
                // that take a fixture as input running before it
                for (const del of fixtureDeleteTransactions[fixture] || []) {
                    // delete transaction is also an input transaction,
                    // so skip adding an edge to itself to avoid cycles
                    if (!unreachable[del] && input != del) {
                        this.addEdge(input, del);
                    }
                }
            }
            // delete transactions depend on fixtures output by other transactions
            for (const del in fixtureDeleteTransactions[fixture] || []) {
                if (!unreachable[del]) {
                    for (const output of fixtureTransactionOutputs[fixture] || []) {
                        if (!unreachable[output]) {
                            this.addEdge(output, del);
                        }
                    }
                }
            }
        }
    }

    writeDotFile(filename: string) {
        let dot = "digraph devopness_api {";
        for (const [a, b] of this.adjacencyList) {
            dot += `\n  ${a} -> ${b}`
        }
        dot += "\n}";
        fs.writeFileSync(filename, dot);
    }

    topologicalSort(): string[] {
        return toposort(this.adjacencyList);
    }

    edges(node: TransactionNode): [TransactionNode[], TransactionNode[]] {
        const inputs: TransactionNode[] = [];
        const outputs: TransactionNode[] = [];

        for (const [a, b] of this.adjacencyList) {
            if (a == node) {
                outputs.indexOf(b) == -1 ? outputs.push(b) : null;
            } else if (b == node) {
                inputs.indexOf(a) == -1 ? inputs.push(a) : null;
            }
        }

        return [inputs, outputs];
    }
}
