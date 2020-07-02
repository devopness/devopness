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
    'rule': '',
    'server': '',
    'service': '',
    'social_account': '',
    'ssl_certificate': '',
    'user': '',
    'repository': '',
    'task': '',
};
export type FixtureKey = keyof typeof fixtureKeys;
export function isFixtureKey(str: string): str is FixtureKey {
    return fixtureKeys.hasOwnProperty(str);
}
