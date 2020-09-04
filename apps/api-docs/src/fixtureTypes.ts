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
    'application_create': [
        { path: 'source_provider_id', fixture: 'social_account', field: 'id'} ,
        { path: 'environments[0].id', fixture: 'environment', field: 'id'} ,
        { path: 'project_id', fixture: 'project', field: 'id'} ,
    ],
    'application_update': [
        { path: 'id', fixture: 'application', field: 'id' },
        { path: 'source_provider_id', fixture: 'social_account', field: 'id'} ,
        { path: 'project_id', fixture: 'project', field: 'id' },
        { path: 'environments[0].id', fixture: 'environment', field: 'id' } ,
    ],
    'application_deploy': [
        { path: 'environments[0].id', fixture: 'environment', field: 'id' } ,
    ],
    'cron_job': [],
    'cron_job_create': [
        { path: 'environments[0].id', fixture: 'environment', field: 'id' } ,
        { path: 'environments[0].servers[0]', fixture: 'server', field: 'id' }
     ], 
    'deployment': [],
    'deployment_create': [
        { path: 'applications[0].id', fixture: 'application', field: 'id' },
        { path: 'applications[0].name', fixture: 'application', field: 'name' },
        { path: 'servers[0].id', fixture: 'server', field: 'id' },
        { path: 'environments[0].id', fixture: 'environment', field: 'id' },
        { path: 'environments[0].servers[0]', fixture: 'server', field: 'id' }
    ],
    'deployment_step': [],
    'environment': [],
    'environment_link_item': [
        { path: 'id', fixture: 'environment', field: 'id'},
    ],
    'environment_update': [
        { path: 'id', fixture: 'environment', field: 'id' },
    ],
    'network_rule': [],
    'network_rule_create': [
        { path: 'environments[0].id', fixture: 'environment', field: 'id' },
        { path: 'environments[0].servers[0]', fixture: 'server', field: 'id' }
    ],
    'daemon': [],
    'daemon_create': [
        { path: 'environments[0].id', fixture: 'environment', field: 'id' } ,
        { path: 'environments[0].servers[0]', fixture: 'server', field: 'id' }
     ], 
    'project': [], 
    'project_update': [
        { path: 'id', fixture: 'project', field: 'id' }
    ],
    'repository': [],
    'script': [
        { path: 'application_id', fixture: 'application', field: 'id' }
    ],
    'server': [],
    'server_create': [
        // server_create can't have an environemnt.id,
        // otherwise a failure will happen on linkServerToEnvironment
        // as the server will be already linked to the environment
        // { path: 'environments[0].id', fixture: 'environment', field: 'id' }
    ],
    'service': [],
    'service_create': [
        { path: 'environments[0].id', fixture: 'environment', field: 'id' },
        { path: 'environments[0].servers[0]', fixture: 'server', field: 'id' }
    ],
    'social_account': [],
    'source_provider': [],
    'ssh_key': [],
    'ssh_key_create': [
        { path: 'environments[0].id', fixture: 'environment', field: 'id' },
        { path: 'environments[0].servers[0]', fixture: 'server', field: 'id' }
    ],
    'ssl_certificate': [],
    'user_credentials': [],
    'user_tokens': [],
    'user': [],
    'variable': [],
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
    'daemons': 'daemon',
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
