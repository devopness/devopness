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

// fixture keys are written with underscores so they map directly to URL and JSON param names
const fixtureKeys = {
    'user_credentials': '',
    'user_tokens': '',
    'project': '', 
    'ssh_key': '',
    // extra
    'action': '',
    'application_environment': '',
    'application_environment_variable': '',
    'application': '',
    'cron_job': '',
    'deployment': '',
    'environment': '',
    'process': '',
    'network_rule': '',
    // 'rule': '',
    'server': '',
    'service': '',
    'social_account': '',
    'source_provider': '',
    'ssl_certificate': '',
    'user': '',
    'repository': '',
    // 'task': '',
};
export type FixtureKey = keyof typeof fixtureKeys;
export function isFixtureKey(str: string): str is FixtureKey {
    return fixtureKeys.hasOwnProperty(str);
}

const fixtureListKeys = {
    'projects': 'project',
    'actions': 'action',
    'deployments': 'deployment',
    'environments': 'environment',
    'network_rules': 'network_rule',
    'processes': 'process',
    'servers': 'server',
    'services': 'service',
    'ssh_keys': 'ssh_key',
    'cron_jobs': 'cron_job',
    'social_accounts': 'social_account',
    'repositories': 'repository',
}
export type FixtureListKey = keyof typeof fixtureListKeys;
export function isFixtureListKey(str: string): str is FixtureListKey {
    return fixtureListKeys.hasOwnProperty(str);
}

export function fixtureKeyElement(key: FixtureKey | FixtureListKey): FixtureKey {
    return isFixtureKey(key) ? key : fixtureListKeys[key] as FixtureKey;
}
