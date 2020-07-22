// only fields that are accessed directly by hooks are required to be typed here
export interface Identifiable {
    id: string
}
export type UserCredentials = {
    email: string
    password: string
};
export type UserTokens = {
    access_token: string
    refresh_token: string
};
export type Fixture = UserCredentials | UserTokens | Identifiable;

export function isIdentifiable(obj: object): obj is Identifiable {
    return obj.hasOwnProperty('id');
}

// FixtureDependency specifies how fields of fixtures depdend on other fixtures
export type FixtureDependency = { path: string, fixture: FixtureKey, field: string}

// fixture keys are written with underscores so they map directly to URL and JSON param names
const fixtureKeys: { [str: string]: FixtureDependency[] } = {
    'action': [],
    'application_environment_variable': [],
    'application_environment': [],
    'application': [],
    'cron_job': [],
    'cron_job_create': [
        { path: 'environments[0].id', fixture: 'environment', field: 'id'} ,
        { path: 'environments[0].server[0]', fixture: 'server', field: 'id' }
     ], 
    'deployment': [],
    'deployment_create': [
        { path: 'applications[0].id', fixture: 'application', field: 'id' },
        { path: 'applications[0].name', fixture: 'application', field: 'name' },
        { path: 'servers[0].id', fixture: 'server', field: 'id' },
        { path: 'servers[0].name', fixture: 'server', field: 'name' }
    ],
    'deployment_step': [],
    'environment': [],
    'environment_update': [{ path: 'id', fixture: 'environment', field: 'id' }],
    'network_rule': [],
    'process': [],
    'project': [], 
    'project_update': [{ path: 'id', fixture: 'project', field: 'id' }],
    'repository': [],
    'server': [],
    'server_create': [{ path: 'id', fixture: 'environment', field: 'id' }],
    'service': [],
    'social_account': [],
    'source_provider': [],
    'ssh_key': [],
    'ssl_certificate': [],
    'user_credentials': [],
    'user_tokens': [],
    'user': [],
};

// keyof in TS 2.9 is a string | number
export type FixtureKey = keyof typeof fixtureKeys & string;
export function isFixtureKey(val: string | any[]): val is FixtureKey {
    return typeof val == 'string' && fixtureKeys.hasOwnProperty(val);
}
export function fixtureDependencies(key: FixtureKey): FixtureDependency[] {
    return fixtureKeys[key];
}

const fixtureListKeys = {
    'actions': 'action',
    'applications': 'application',
    'cron_jobs': 'cron_job',
    'deployments': 'deployment',
    'environments': 'environment',
    'network_rules': 'network_rule',
    'processes': 'process',
    'projects': 'project',
    'repositories': 'repository',
    'servers': 'server',
    'services': 'service',
    'social_accounts': 'social_account',
    'ssh_keys': 'ssh_key',
}
export type FixtureListKey = keyof typeof fixtureListKeys;
export function isFixtureListKey(val: string | any[]): val is FixtureListKey {
    return typeof val == 'string' && fixtureListKeys.hasOwnProperty(val);
}
export function fixtureKeyElement(key: FixtureKey | FixtureListKey): FixtureKey {
    return isFixtureKey(key) ? key : fixtureListKeys[key] as FixtureKey;
}
