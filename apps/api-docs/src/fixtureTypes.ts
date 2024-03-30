// only fields that are accessed directly by hooks are required to be typed here

/**
 * Anything that contains an id field.
 */
export interface Identifiable {
    id: string
}
/**
 * User login data.
 */
export type UserCredentials = {
    id: number
    email: string
    password: string
};
/**
 * JWT authorization tokens.
 */
export type UserTokens = {
    access_token: string
    refresh_token: string
};
/**
 * Reqpresents API entities.
 */
export type Fixture = UserCredentials | UserTokens | Identifiable;

export function isIdentifiable(obj: object): obj is Identifiable {
    return obj.hasOwnProperty('id');
}

/**
 * Specifies dependencies between fixtures. Read as `obj[path] = fixture[field]`
 */
export type FixtureDependency = { path: string, fixture: FixtureKey, field: string }

/**
 * Maps a FixtureKey to a list of FixtureDependency, indicating how fixtures are composed.
 * Should only be accessed by the helper methods `isFixtureKey`, `fixtureDependencies`, `addFixtureDependencies`.
 * FixtureKey values are written with underscores so they map directly to Devopness URL params and JSON fields,
 * however, keep in mind that fixtures should be named after the route input model name and not named as the
 * route URL.
 * Example:
 *  - Route name in `/docs/spec/paths.yaml`:
 *      - /pipelines/{pipeline_id}/actions
 *  - Route input model in `/docs/api-docs/auto-generated/endpoints/add-pipeline-action.yaml`:
 *      - ActionPipelineCreate
 *  - Fields required in by input model in `/docs/api-docs/auto-generated/models/action-pipeline-create.yaml`:
 *      - servers
 *  - Fixture defined here in `fixtureKeys`:
 *      'action_pipeline_create': [
 *          { path: 'servers[0]', fixture: 'server', field: 'id' },
 *      ],
 *      // Which can be read as: first item of request body `servers` array, `servers[0]`,
 *      // will receive the value of the field `id` of the fixture `server`. This way,
 *      // once a server is created by previous requests and saved into `server`
 *      // fixture, the `/pipelines/{pipeline_id}/actions` route will then be able
 *      // to trigger actions for the same server ID.
 * Notes:
 *  - Please keep fixture sroted in alphabetical order, for readability. The order that fixtures
 *      are declared here are not relevant for fixture value resolution.
*/
const fixtureKeys: { [str: string]: FixtureDependency[] } = {
    'action': [],
    'action_pipeline_create': [
        { path: 'servers[0]', fixture: 'server', field: 'id' },
    ],
    'application_environment_variable': [],
    'application_environment': [],
    'application': [],
    'application_pipeline': [],
    'application_environment_create': [
        { path: 'servers[0]', fixture: 'server', field: 'id' },
    ],
    'application_update': [
        { path: 'id', fixture: 'application', field: 'id' },
        { path: 'default_pipeline_id', fixture: 'pipeline', field: 'id' },
        { path: 'servers[0]', fixture: 'server', field: 'id' },
    ],
    'application_deploy': [
        { path: 'environments[0].id', fixture: 'environment', field: 'id' },
    ],
    'credential': [],
    'cron_job': [],
    'cron_job_environment_create': [
        { path: 'servers[0]', fixture: 'server', field: 'id' },
    ],
    'cron_job_update': [
        { path: 'id', fixture: 'cron_job', field: 'id' },
        { path: 'servers[0]', fixture: 'server', field: 'id' },
    ],
    'deployment_application_create': [
        { path: 'servers[0]', fixture: 'server', field: 'id' },
        { path: 'pipeline_id', fixture: 'pipeline', field: 'id' }
    ],
    'environment': [],
    'environment_link_item': [
        { path: 'id', fixture: 'environment', field: 'id' },
    ],
    'environment_team_link': [
        { path: 'role_id', fixture: 'role', field: 'id' },
    ],
    'environment_update': [
        { path: 'id', fixture: 'environment', field: 'id' },
    ],
    'hook': [],
    'hook_create': [
        { path: 'resource_id', fixture: 'application', field: 'id' },
    ],
    'hook_pipeline_create': [
        { path: 'resource_id', fixture: 'application', field: 'id' },
    ],
    'hook_update': [
        { path: 'id', fixture: 'hook', field: 'id' },
        { path: 'resource_id', fixture: 'application', field: 'id' },
    ],
    'hook_requests': [],
    'invitation_team_create': [
        { path: 'environment_id', fixture: 'environment', field: 'id' },
    ],
    'member': [
        { path: 'team_id', fixture: 'team', field: 'id' },
        { path: 'member_id', fixture: 'user', field: 'id' },
    ],
    'network': [],
    'network_rule': [],
    'network_rule_environment_create': [
        { path: 'servers[0]', fixture: 'server', field: 'id' },
    ],
    'network_rule_update': [
        { path: 'id', fixture: 'network_rule', field: 'id' },
        { path: 'servers[0]', fixture: 'server', field: 'id' },
    ],
    'daemon': [],
    'daemon_environment_create': [
        { path: 'servers[0]', fixture: 'server', field: 'id' },
    ],
    'daemon_update': [
        { path: 'id', fixture: 'daemon', field: 'id' },
        { path: 'servers[0]', fixture: 'server', field: 'id' }
    ],
    'daemon_get_status': [
        { path: 'servers[0]', fixture: 'server', field: 'id' },
    ],
    'daemon_restart': [
        { path: 'environment_id', fixture: 'environment', field: 'id' },
        { path: 'servers[0]', fixture: 'server', field: 'id' }
    ],
    'pipeline': [],
    'pipeline_create': [
        { path: 'resource_id', fixture: 'application', field: 'id' },
    ],
    'pipeline_update': [
        { path: 'id', fixture: 'pipeline', field: 'id' },
    ],
    'project': [],
    'project_update': [
        { path: 'id', fixture: 'project', field: 'id' }
    ],
    'repository': [],
    'role': [],
    'role_update': [
        { path: 'id', fixture: 'role', field: 'id' },
    ],
    'server': [
        { path: 'environment_id', fixture: 'environment', field: 'id' },
    ],
    'server_update': [
        { path: 'id', fixture: 'server', field: 'id' },
        { path: 'ip_address', fixture: 'server', field: 'ip_address' },
        { path: 'ssh_port', fixture: 'server', field: 'ssh_port' },
    ],
    'service': [],
    'service_environment_create': [],
    'service_reload': [
        { path: 'environment_id', fixture: 'environment', field: 'id' },
        { path: 'servers[0]', fixture: 'server', field: 'id' },
    ],
    'service_restart': [
        { path: 'environment_id', fixture: 'environment', field: 'id' },
        { path: 'servers[0]', fixture: 'server', field: 'id' },
    ],
    'service_start': [
        { path: 'environment_id', fixture: 'environment', field: 'id' },
        { path: 'servers[0]', fixture: 'server', field: 'id' },
    ],
    'service_update_status': [
        { path: 'environment_id', fixture: 'environment', field: 'id' },
        { path: 'servers[0]', fixture: 'server', field: 'id' },
    ],
    'service_stop': [
        { path: 'environment_id', fixture: 'environment', field: 'id' },
        { path: 'servers[0]', fixture: 'server', field: 'id' },
    ],
    'service_update': [
        { path: 'id', fixture: 'service', field: 'id' },
    ],
    'social_account': [],
    'source_provider': [],
    'ssh_key': [],
    'ssh_key_environment_create': [
        { path: 'servers[0]', fixture: 'server', field: 'id' }
    ],
    'ssh_key_update': [
        { path: 'id', fixture: 'ssh_key', field: 'id' },
        { path: 'servers[0]', fixture: 'server', field: 'id' },
    ],
    'ssl_certificate': [],
    'step': [],
    'step_pipeline_update': [
        { path: 'id', fixture: 'step', field: 'id' },
    ],
    'team': [],
    'team_environment_create': [
        { path: 'project_id', fixture: 'project', field: 'id' },
    ],
    'user': [
        { path: 'id', fixture: 'user_credentials', field: 'id' },
    ],
    'user_create': [],
    'user_credentials': [],
    "user_login": [
        { path: 'email', fixture: 'user_credentials', field: 'email' },
        { path: 'password', fixture: 'user_credentials', field: 'password' },
    ],
    'user_login_response': [],
    "user_me": [],
    "user_refresh_token": [],
    "user_refresh_token_response": [],
    'user_resend_verification': [],
    "user_update": [
        { path: 'id', fixture: 'user', field: 'id' },
        { path: 'name', fixture: 'user_credentials', field: 'email' },
        { path: 'email', fixture: 'user_credentials', field: 'email' },
    ],
    'user_verify': [],
    'variable': [],
    'variable_create': [
        { path: 'resource_id', fixture: 'server', field: 'id' },
    ],
    'variable_update': [
        { path: 'id', fixture: 'variable', field: 'id' }
    ],
    'virtual_host': [],
};

/**
 * Keys of the `fixtureKey` map.
 */
export type FixtureKey = keyof typeof fixtureKeys & string;  // keyof in TS 2.9 is a string | number, so restrict it.
/**
 * Checks if a value is a valid FixtureKey.
 * @param val Value to be checked
 */
export function isFixtureKey(val: string | any[]): val is FixtureKey {
    return typeof val == 'string' && fixtureKeys.hasOwnProperty(val);
}
/**
 * Gets the FixtureDependencies list of a given FixtureKey.
 * @param key key to be looked up
 */
export function fixtureDependencies(key: FixtureKey): FixtureDependency[] {
    return fixtureKeys[key];
}
/**
 * Adds a new FixtureDependency to a FixtureKey.
 * @param key Key of the fixture
 * @param dep Specification of the fixture dependency
 */
export function addFixtureDependency(key: FixtureKey, dep: FixtureDependency) {
    const list = fixtureKeys[key] ? fixtureKeys[key] : [];
    list.push(dep);
    fixtureKeys[key] = list;
}

/**
 * Maps plural forms to singular forms of fixture keys.
 * Should only be accessed by the helper methods `isFixtureListKey`, `fixtureKeyElement`
 */
const fixtureListKeys = {
    'actions': 'action',
    'applications': 'application',
    'cron_jobs': 'cron_job',
    'daemons': 'daemon',
    'deployments': 'deployment',
    'environments': 'environment',
    'network_rules': 'network_rule',
    'pipelines': 'pipeline',
    'projects': 'project',
    'repositories': 'repository',
    'roles': 'role',
    'servers': 'server',
    'services': 'service',
    'social_accounts': 'social_account',
    'steps': 'step',
    'ssh_keys': 'ssh_key',
    'teams': 'team',
    'variables': 'variable',
}
/**
 * Keys of the `fixtureListKeys` map.
 */
export type FixtureListKey = keyof typeof fixtureListKeys;
/**
 * Checks if a value is a valid FixtureListKey.
 * @param val Value to be checked
 */
export function isFixtureListKey(val: string | any[]): val is FixtureListKey {
    return typeof val == 'string' && fixtureListKeys.hasOwnProperty(val);
}
/**
 * Resolves a fixture key (singular) or list key (plural) to its singular form.
 * @param key Plural or singular form
 */
export function fixtureKeyElement(key: FixtureKey | FixtureListKey): FixtureKey {
    return isFixtureKey(key) ? key : fixtureListKeys[key] as FixtureKey;
}
