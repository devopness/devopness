import fs from 'fs';
import { Transaction } from 'hooks';
import toposort from 'toposort';
import { LogFunction } from './Logger';

import { fixtureKeyElement, isFixtureListKey, FixtureKey } from './fixtureTypes';

type TransactionNode = string;
type FixtureNode = string;

type FixtureToTransactionListMap = { [key: string]: TransactionNode[] };

function fixtureTransactionGraphPush(map: FixtureToTransactionListMap, k: FixtureNode, v: TransactionNode) {
    const list = k in map ? map[k] : [];
    list.push(v);
    map[k] = list;
}

/**
 * Represents a graph of transactions and fixtures, using fixture nodes as the referential.
 */
export interface FixtureTransactionAdjacencyList {
    /** Maps fixtures to a list of transactions that take it as input */
    fixtureTransactionInputs: FixtureToTransactionListMap

    /**
     * Maps fixtures to a list of transactions that need to be executed before the fixture values are made available.
     * The transaction on which the fixture depends can return the fixture values or have a `before(<transaction>)`
     * method or a `after(<transaction>)` method that update the fixture values when the transaction is executed.
     */
    fixtureTransactionOutputs: FixtureToTransactionListMap

    /** Maps fixtures to their terminal transactions */
    fixtureTerminalTransactions: FixtureToTransactionListMap
};
/**
 * An edge between two nodes.
 */
export type TransactionGraphEdge = [TransactionNode, TransactionNode];

/**
 *  Directed Acyclical Graph (DAG) of transaction and their dependencies through fixtures.
 */
export default class TransactionGraph {
    transactionAdjacencyList = new Set<TransactionGraphEdge>();
    log: LogFunction;

    /**
     *
     * @param transactions List of transactions that will compose the graph
     * @param initialFixtureTransactionGraph Initial fixture-transaction graph
     * @param initialTransactionAdjacencyList Initial edges of the transaction graph
     * @param log Log function
     */
    constructor(transactions: Transaction[],
        initialFixtureTransactionGraph: FixtureTransactionAdjacencyList,
        initialTransactionAdjacencyList: Set<TransactionGraphEdge>,
        log: LogFunction) {
        this.log = log;
        this.log(`:: building transaction graph...`)

        // TODO: extract these from here
        // user_credentials and user_login_response are handled differently than other fixtures, so add them manually to the graph
        const fixtureTransactionGraph = this.fixtureTransactionGraphFromTransactionList(transactions, initialFixtureTransactionGraph);

        this.transactionAdjacencyList = initialTransactionAdjacencyList;
        this.populateAdjacencyList(fixtureTransactionGraph);

        this.log(`got ${this.transactionAdjacencyList.size} edges`)
    }

    /**
     * Adds an edge to the directed transaction graph.
     * @param from Source node
     * @param to Destination node
     */
    addEdge(from: TransactionNode, to: TransactionNode) {
        this.transactionAdjacencyList.add([from, to]);
    }

    /**
     * Populates the graph representing the relationship between fixtures, which are dictated by transactions.
     * @param transactions List of transactions to be processed
     * @param initialGraph Initial adjacency list of the graph
     */
    fixtureTransactionGraphFromTransactionList(transactions: Transaction[], initialGraph: FixtureTransactionAdjacencyList): FixtureTransactionAdjacencyList {
        const { fixtureTransactionInputs, fixtureTransactionOutputs, fixtureTerminalTransactions: fixtureDeleteTransactions } = initialGraph;
        for (const tx of transactions) {
            // delete transactions are terminal nodes
            if (tx.method == "delete") {
                // delete transactions should have only one input, but let's iterate anyways
                for (const input of tx.pathInputs) {
                    fixtureTransactionGraphPush(fixtureDeleteTransactions, fixtureKeyElement(input), tx.slug);
                }
                for (const inputDep in tx.pathInputDependencies) {
                    fixtureTransactionGraphPush(fixtureDeleteTransactions, fixtureKeyElement(inputDep), tx.slug);
                }
            } else {
                if (tx.output) {
                    // list fixtures outputs should be considered only to be inputs, as they don't _generate_ fixtures
                    if (isFixtureListKey(tx.output)) {
                        fixtureTransactionGraphPush(fixtureTransactionInputs, fixtureKeyElement(tx.output), tx.slug);
                    }
                    // skip output on transactions that have same input and output types to avoid cycles
                    else if (tx.pathInputs.indexOf(fixtureKeyElement(tx.output)) == -1) {
                        fixtureTransactionGraphPush(fixtureTransactionOutputs, fixtureKeyElement(tx.output), tx.slug);
                    }
                }
                for (const input of tx.pathInputs) {
                    fixtureTransactionGraphPush(fixtureTransactionInputs, input, tx.slug);
                }
                if (tx.bodyInputDependencies) {
                    tx.bodyInputDependencies.map(d => d.fixture).forEach((input: FixtureKey) =>
                        fixtureTransactionGraphPush(fixtureTransactionInputs, input, tx.slug));
                }
                if (tx.pathInputDependencies) {
                    for (const key in tx.pathInputDependencies) {
                        tx.pathInputDependencies[key].map(d => d.fixture).forEach((input: FixtureKey) =>
                            fixtureTransactionGraphPush(fixtureTransactionInputs, input, tx.slug));
                    }
                }
            }
            // auth requires a `user_login_response` fixture
            if (tx.requiresAuth) {
                fixtureTransactionGraphPush(fixtureTransactionInputs, 'user_login_response', tx.slug)
            }
        }
        return { fixtureTransactionInputs, fixtureTransactionOutputs, fixtureTerminalTransactions: fixtureDeleteTransactions };
    }

    /**
     * Populates the fixture DAG adjacency list using the fixture transaction graph considering the fixtures (x, y) and transactions (A, B, C),
     * Takes a `FixtureTransactionGraph`:
     *       x - A - y - B - y - C
     * and transforms it into a `TransactionGraph`
     *       A - B - C
     * @param fixtureTransactionGraph fixture-transaction graph to be converted
     */
    populateAdjacencyList(fixtureTransactionGraph: FixtureTransactionAdjacencyList) {
        const { fixtureTransactionInputs, fixtureTransactionOutputs, fixtureTerminalTransactions: fixtureDeleteTransactions } = fixtureTransactionGraph;

        const unreachable: { [tx: string]: boolean } = {};
        // first pass: check for unreachable fixtures and find transactions that require them
        for (const fixture in fixtureTransactionInputs) {
            // check if there's transaction producing that fixture, otherwise it's an unreachable branch
            if (!(fixture in fixtureTransactionOutputs)) {
                throw new Error(
                    `fixture '${fixture}' has no generator transactions, skipping transactions [${fixtureTransactionInputs[fixture]}]\n`
                    + `Tip: add '${fixture}' to list 'fixtureTransactionOutputs' on 'hooks.ts' or fix fixture name on 'fixtureTypes.ts'.`
                );
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
            for (const del of fixtureDeleteTransactions[fixture] || []) {
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

    /**
     * Writes a graphviz .dot file representing the graph
     * @param filename Path of output dot file
     */
    writeDotFile(filename: string) {
        let dot = "digraph devopness_api {";
        for (const [a, b] of this.transactionAdjacencyList) {
            dot += `\n  ${a} -> ${b}`
        }
        dot += "\n}";
        fs.writeFileSync(filename, dot);
    }

    /**
     * Performs topological sorting to the graph, returning a list of transaction slugs
     * representing an order of transactions that satisfies their dependencies.
     */
    topologicalSort(): string[] {
        return toposort([...this.transactionAdjacencyList.values()]);
    }

    /**
     * Returns the list of input and output edges to a node.
     * @param node Target node
     */
    edges(node: TransactionNode): [TransactionNode[], TransactionNode[]] {
        const inputs: TransactionNode[] = [];
        const outputs: TransactionNode[] = [];

        for (const [a, b] of this.transactionAdjacencyList) {
            if (a == node) {
                outputs.includes(b) ? null : outputs.push(b);
            } else if (b == node) {
                inputs.includes(a) ? null : inputs.push(a);
            }
        }

        return [inputs, outputs];
    }
}
