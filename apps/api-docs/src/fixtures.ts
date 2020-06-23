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
