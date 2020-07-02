import fs from 'fs';
import toposort from 'toposort';

import TransactionSpec from './TransactionSpec';

type TransactionNode = string;
type FixtureNode = string;

type FixtureToTransactionMap = { [key: string]: TransactionNode };
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
    fixtureDeleteTransactions: FixtureToTransactionMap
};

// TransactionGraph represents a Directed Acyclical Graph (DAG) of transactions
// and their dependencies through fixtures
export default class TransactionGraph {
    adjacencyList: [TransactionNode, TransactionNode][] = [];

    constructor(transactionSpecs: TransactionSpec[]) {
        // user_credentials and user_tokens are handled differently than other fixtures, so add them manually to the graph
        const initialFixtureTransactionGraph: FixtureTransactionGraph = {
            fixtureTransactionInputs: { 'user_credentials': ['login200'] },
            fixtureTransactionOutputs: { 'user_credentials': ['addUser201'], 'user_tokens': ['login200'] },
            fixtureDeleteTransactions:  { 'user_tokens': 'logout204' }
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
            if (txSpec.isDelete) {
                // delete transactions should have only one input, but let's iterate anyways
                for (const input of txSpec.inputs) {
                    fixtureDeleteTransactions[input] = txSpec.slug;
                }
            } else {
                // skip output on transactions that have same input and output types to avoid cycles
                if (txSpec.output && (txSpec.inputs.indexOf(txSpec.output) == -1)) {
                    fixtureTransactionGraphPush(fixtureTransactionOutputs, txSpec.output, txSpec.slug);
                }
                for (const input of txSpec.inputs) {
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

        for (const fixture in fixtureTransactionInputs) {
            for (const input of fixtureTransactionInputs[fixture]) {
                if (fixture in fixtureTransactionOutputs) {
                    for (const output of fixtureTransactionOutputs[fixture]) {
                        // transactions that take a fixture both as input and output
                        // are handled as terminal nodes to avoid cycles
                        if (output != input) {
                            this.addEdge(output, input);
                        }
                    }
                }
                // delete transactions depend on all transactions
                // that take a fixture as input running before it
                if (fixture in fixtureDeleteTransactions) {
                    // delete transaction is also an input transaction,
                    // so skip adding an edge to itself to avoid cycles
                    if (input != fixtureDeleteTransactions[fixture]) {
                        this.addEdge(input, fixtureDeleteTransactions[fixture]);
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
}
