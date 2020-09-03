# Automated testing

## Overview
Dredd generates requests and verifies responses of all API routes according to the schemas in the OpenAPI specification used to generate the Devopness documentation.
API routes have dependencies that need to be satisfied before they could be successfully called, ie.: `addApplicationToProject` needs a valid project
id in its parameter, or the transaction will fail.
The dredd documentation recommends keeping transactions self-contained, using custom testing code in the backend to insert
the necessary fixtures directly on the database before running a test.
That approach, while straightforward from an implementation point of view, is highly verbose and doesn't validate the API against a real server.
For those reasons, the automated Devopness API tests take another route, with the help of [Dredd Hooks](https://dredd.org/en/latest/hooks/index.html),
which allows for custom code be attached to transactions, running before or after their execution.

With the ability to modify and reorder transactions, the following API automated test approach is used:
1. Identify transaction inputs and outputs
2. Build a graph of transaction dependencies
3. Traverse the dependency graph to compute a valid order for the transactions
4. Store fixtures from the response body of transactions
5. Rewrite request URL and body parameters using stored fixtures

### 1. Identifying inputs and ouputs
Transaction dependencies are encoded in the `FixtureKey` type (`fixtureKey.ts`).
The valid values for this type match the transaction inputs and outputs in the OpenAPI specification, in different parts:
* **Request header** the auth dependency is specified by the presence of the `Authorization` header. Sets the `requiresAuth` boolean field.
* **Request path** input fixture ids are specified in the form `{fixture_key}_id`. Fixture keys are stored in the `pathInputs` array.
* **Request body** input body schemas are defined as `FixtureDependency` types, which specify how other fixtures are composed to satisfy a dependency. The transaction inputs are then the set of all fixtures in the `FixtureDependency` array for a given `FixtureKey` specified in PascalCase in the `#/definitions/{FixtureKey}` form. These are stored in the `bodyInputs` field.
* **Response body** output fixture schemas are specified in PascalCase in the `#/definitions/{FixtureKey}` form. Besides fixture keys, the response body can also hold values specifying a list of fixtures, which are encoded as a `FixtureListKey`. Stored in the `output` field.

All this happens in the `TransactionSpec` class, which encapsulates transaction dependencies alongside some extra information:
a transaction slug (or shorthand name), composed of `{operationId}{expectedStatusCode}`, and the HTTP request method.

### 2. Building transaction dependency graph
The algorithm for building the transaction dependency adjacency list (the graph of dependencies between transactions) employs an intermediate structure, the fixture transaction graph.
This auxiliary graph is then folded into the final transaction graph on a separate step.

#### Fixture-transaction graph
The fixture-transaction graph is formed of two kinds of nodes, representing transactions and fixtures, and directed edges representing the fixture inputs and outputs required by transactions.
The `TransactionGraph.fixtureTransactionGraphFromTransactionSpecs` method converts an array of `TransactionSpec` objects into a graph by creating a node per transaction, and connecting these to the fixtures specified in the spec.

There are some corner cases: 
* Transactions returning `FixtureListKey` types, such as `getApplications` or `getProjects`, are considered as only having a fixture input, instead of having fixture outputs. As these transactions don't create or modify fixtures, and require at least one fixture of the type to exist in the return value, they're inserted in the graph as only one edge: with one input fixture of the type of the element they return.
* The `FixtureDependency` array in the body input of a transaction is resolved to a `FixtureKey` array containing all the fixtures used in composing those dependencies, which corresponds to the fixture nodes in the graph connected to this transaction node.
* The topological sorting algorithm requires that the source graph is acyclical. For this reason, transaction output edges to fixture nodes are skipped if the same fixture is already connnected as by input edge.
* Input edges to DELETE transactions are stored in a separate adjacency list, as this will come in handy in the next step.
* As the only header parameter in the devopness API is the `Authorization` header, the transaction dependencies to the `user_tokens` fixture type are pre-encoded in the `TransactionGraph` constructor.

#### Transaction adjacency list
The `TransactionGraph.populateAdjacencyList` method does the final step in converting the fixture-transaction graph into a transaction adjency list by collapsing fixture nodes and rewiring their edges between the transaction nodes that it connects. This process requires two passes: one for unreachable fixture identification, then another for creating transaction-transaction edges.

Unreachable fixtures are those that don't contain a transaction that outputs it and does not contain itself as an input: a so-called generator transaction.
It's essential to remove the transactions associated with those fixtures from the graph, as the running orders derived from this graph would not satisfy the dependencies of these transactions and result in runtime errors.

One special case to be handled while inserting edges between transactions connected by a fixture are the DELETE transactions.
In the fixture lifecycle on an API test run, DELETE transactions need to be a terminal node, ran after all transactions depending on the fixture have executed.
To ensure this, edges are inserted between all transactions around a fixture (as both input and output) and its corresponding DELETE transaction.

### 3. Computing transaction order
Computing a transaction order transalates to finding a valid transversal of the transaction dependency graph.
That task can also be seen as finding a sorting order for a transaction array satisfying a set of constraints: a so called topological sort.

The set of constraints is the adjency list representing the acyclical directed graph of transaction dependencies. That list serves as the input to the [toposort](https://npmjs.com/package/toposort) package, used to find a valid transaction order.
The transaction running order is then reorganized to match the topological sort using the `TransactionUtils.selectTransactionsByName` method.

### 4. Storing responses
Transaction responses are stored by applying the `TransactionUtil.storeTransactionResult` method as an `after` hook for all transactions that have fixture outputs in their `TransactionSpec`.
Those fixtures are stored in a global `FixtureStore`, indexed by their `FixtureKey`.

### 5. Rewriting request parameters
Request parameters are located in three distinct places: headers, URL path and body payload.

#### Headers
All transactions for which the `TransactionSpec.requiresAuth` variable is `true` have an `Authorization` header attached, with its value extracted from the `user_tokens` fixture.
This is done in `hooks.ts` using the `TransactionUtils.setTransactionRequestAuthHeaderWithFixture` method.

#### URL path
URL paths in the Devopness API follow a REST structure, carrying ids to objects being referenced by a route.
The `TransactionUtils.writeFixtureIdsInTransactionPath` handles this fixture rewrite, taking the original path from the `transaction.fullSpec` field, 
and successively replacing path slices in the form `{fixture}_id` with the corresponding fixture ID in the store.

#### Body payload
Body parameters are modified in specific paths, according to a `FixtureDependency` array.
The `TransactionUtils.applyTransactionRequestBodyFixtureDependencies` transformation applies these dependencies over the dredd-generated payload.

## Some gotchas of dredd hook programming
* Transaction array has to be sorted in place, abusing the existance of a reference to it in the `beforeEach` hook.
* Log function has to be passed around, as modules are compiled internally by dredd on execution.
* Non 2xx route transactions are automatically skipped.
* Exit-on-fail is implemented as an after-hook that skips all transactions after the first failure, as erasing after execution started results in a crash.

## Adding a new route
In order for a new route to be picked up by the transaction dependency graph, once it's been added to the OpenAPI spec, its input and output fixture types should be defined in `fixtureTypes.ts` as keys of either of those data structures:
  - `fixtureKeys`: holds a mapping between object names (in underscores, as delineated in subsection I of the "Overview" section) and their `FixtureDependency` composition.
  - `fixtureListKeys` : holds a mapping between the structs defining arrays of objects and the corresponding object.

If the route is still not being executed properly after the basic setup, refer to the "Troubleshooting" section ahead.

## Troubleshooting
### Are transaction inputs and outputs being correctly identified?
- Check in the OpenAPI spec the route parameter names (IDs in URL path; body schema) and the response schema name; they should match the naming conventions listed in `README.md`.
- Verify in `fixtureTypes.ts` if there's a corresponding `FixtureKey` entry for each input and output object.
- If the steps above don't fix the issue, inspect with `this.log` calls the transaction-fixture graph building process in the `TransactionGraph.fixtureTransactionGraphFromTransactionSpecs` method.
### Are transaction dependencies being satisfied?
- Log running order by uncommenting in `hooks.ts` the lines prefixed with `// uncomment the snippet below to display the planned transaction order`. The transactions listed in the left hand of the arrow should have a lower running order than the failing transaction.
- Check that the transaction request parameters are being correctly rewritten. Logging calls tagged with `[writeFixtureIdsInTransactionPath]` and `[applyTransactionRequestBodyFixtureDependencies]` should be present for each URL path and body parameter, respectively.
- Ensure that the transaction generating the necessary fixture for the failing transaction has a `[storeTransactionResult]` logging call.
### Is the request payload valid?
- Ensure that the request payload format in the OpenAPI spec satisfies the server validation returned on error responses.
### Is the return value correct?
- Ensure that the response payload format in the OpenAPI spec satisfies the payload returned by the server.

## Skipped transactions
Some transactions may show up as `skipped` in dredd logs. The origin of those skips is one of the following:
### Non-2xx transactions
Dredd automatically skips non-2xx transactions. The automated process described here doesn't cover unscessuful route responses.
### Unreachable transactions
Transactions that can't have their dependencies satisfied in the dependency graph are considered unreachable and are skipped.
For more details about unreachable transactions, refer to the subsection "2. Transaction adjacency list" of the "Overview" section of this document.
### Manually skipped transactions
Transactions can be manually skipped either before or after the execution planning, through separate skiplists:
* Pre-planning skiplist: transactions included here aren't added to the dependency graph, and may induce other skips by making dependent transactions unreachable. These are also not included in the transaction count.
* Post-planning skiplist: skips transactions present in the execution plan, in "runtime". This might cause "missing fixture" errors if incorrectly used.
