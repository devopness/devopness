// only fields that are accessed directly by hooks are required to be typed here
export interface Identifiable {
    id: string
}
export type UserCredentials = {
    email: string
    password: string
};
export type AuthToken = {
    access_token: string
    refresh_token: string
};
export type Fixture = UserCredentials | AuthToken | Identifiable;

// fixture keys are written with underscores so they map directly to URL and JSON param names
const fixtureKeys = {
    'user_credentials': '',
    'auth_token': '',
    'project': '', 
    'ssh_key': '',
};
export type FixtureKey = keyof typeof fixtureKeys;
export function isFixtureKey(str: string): str is FixtureKey {
    return fixtureKeys.hasOwnProperty(str);
}
