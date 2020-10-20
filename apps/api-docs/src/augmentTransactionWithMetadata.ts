import { FixtureKey, FixtureListKey, FixtureDependency } from './fixtureTypes';
import { HTTPMethod as OpenApiHttpMethod } from './OpenAPISpec';

declare module 'hooks' {
    interface Transaction {
        slug: string,
        bodyInputDependencies: FixtureDependency[],
        pathInputs: FixtureKey[],
        pathInputDependencies: { [id: string]: FixtureDependency[] },
        output: FixtureKey | FixtureListKey | null,
        requiresAuth: boolean,
        method: OpenApiHttpMethod
    }
}
