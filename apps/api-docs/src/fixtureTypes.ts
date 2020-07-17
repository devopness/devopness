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

// fixture keys are written with underscores so they map directly to URL and JSON param names
// some fixtureKeys have a mapped value, meaning that they are just aliases to that value
const fixtureKeys = {
    'action': '',
    'application_environment_variable': '',
    'application_environment': '',
    'application': '',
    'cron_job': '',
    'deployment': '',
    'deployment_step': '',
    'environment': '',
    'environment_create': '',
    'environment_update': 'environment',
    'network_rule': '',
    'process': '',
    'project': '', 
    'project_create': '', 
    'repository': '',
    'server': '',
    'service': '',
    'social_account': '',
    'source_provider': '',
    'ssh_key': '',
    'ssl_certificate': '',
    'user_credentials': '',
    'user_tokens': '',
    'user': '',
};
export type FixtureKey = keyof typeof fixtureKeys;
export function isFixtureKey(str: string): str is FixtureKey {
    return fixtureKeys.hasOwnProperty(str);
}
export function resolveFixtureKey(key: FixtureKey): FixtureKey {
    const val = fixtureKeys[key];
    if (val == '') {
        return key;
    }
    // TODO: should return null if val isn't a fixtureKey?
    return isFixtureKey(val) ? val : key;
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
export function isFixtureListKey(str: string): str is FixtureListKey {
    return fixtureListKeys.hasOwnProperty(str);
}

export function fixtureKeyElement(key: FixtureKey | FixtureListKey): FixtureKey {
    return isFixtureKey(key) ? key : fixtureListKeys[key] as FixtureKey;
}
