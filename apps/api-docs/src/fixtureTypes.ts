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
 * FixtureKey values are written with underscores so they map directly to Devopness URL params and JSON fields.
 */
const fixtureKeys: { [str: string]: FixtureDependency[] } = {
    'action': [
        { path: 'id', fixture: 'cron_job', field: 'last_action.id' },
    ],
    'application_environment_variable': [],
    'application_environment': [],
    'application': [],
    'application_pipeline': [],
    'application_create': [
        { path: 'environments[0].id', fixture: 'environment', field: 'id' },
        { path: 'environments[0].servers[0]', fixture: 'server', field: 'id' },
    ],
    'application_update': [
        { path: 'id', fixture: 'application', field: 'id' },
        { path: 'environments[0].id', fixture: 'environment', field: 'id' },
        { path: 'environments[0].servers[0]', fixture: 'server', field: 'id' },
    ],
    'application_deploy': [
        { path: 'environments[0].id', fixture: 'environment', field: 'id' },
    ],
    'credential': [],
    'cron_job': [],
    'cron_job_create': [
        { path: 'environments[0].id', fixture: 'environment', field: 'id' },
        { path: 'environments[0].servers[0]', fixture: 'server', field: 'id' },
    ],
    'cron_job_update': [
        { path: 'id', fixture: 'cron_job', field: 'id' },
        { path: 'environments[0].id', fixture: 'environment', field: 'id' },
        { path: 'environments[0].servers[0]', fixture: 'server', field: 'id' },
    ],
    'application_deployment': [
        { path: 'applications[0].id', fixture: 'application', field: 'id' },
        { path: 'applications[0].name', fixture: 'application', field: 'name' },
        { path: 'servers[0]', fixture: 'server', field: 'id' },
        { path: 'environments[0].id', fixture: 'environment', field: 'id' },
        { path: 'environments[0].servers[0]', fixture: 'server', field: 'id' }
    ],
    'environment': [],
    'environment_link_item': [
        { path: 'id', fixture: 'environment', field: 'id' },
    ],
    'environment_update': [
        { path: 'id', fixture: 'environment', field: 'id' },
    ],
    'hook': [],
    'hook_incoming': [],
    'hook_incoming_create': [
        { path: 'resource_id', fixture: 'application', field: 'id' },
    ],
    'hook_incoming_update': [
        { path: 'id', fixture: 'hook_incoming', field: 'id' },
    ],
    'hook_outgoing': [],
    'hook_outgoing_create': [
        { path: 'resource_id', fixture: 'application', field: 'id' },
    ],
    'hook_outgoing_update': [
        { path: 'resource_id', fixture: 'application', field: 'id' },
        { path: 'id', fixture: 'hook_outgoing_create', field: 'id' },
    ],
    'invitation_create': [
        { path: 'environment_id', fixture: 'environment', field: 'id' },
    ],
    'member': [
        { path: 'team_id', fixture: 'team', field: 'id' },
        { path: 'member_id', fixture: 'user', field: 'id' },
    ],
    'network_rule': [],
    'network_rule_create': [
        { path: 'environments[0].id', fixture: 'environment', field: 'id' },
        { path: 'environments[0].servers[0]', fixture: 'server', field: 'id' }
    ],
    'network_rule_update': [
        { path: 'id', fixture: 'network_rule', field: 'id' },
        { path: 'environments[0].id', fixture: 'environment', field: 'id' },
        { path: 'environments[0].servers[0]', fixture: 'server', field: 'id' }
    ],
    'daemon': [],
    'daemon_create': [
        { path: 'environments[0].id', fixture: 'environment', field: 'id' },
        { path: 'environments[0].servers[0]', fixture: 'server', field: 'id' }
    ],
    'daemon_update': [
        { path: 'id', fixture: 'daemon', field: 'id' },
        { path: 'environments[0].id', fixture: 'environment', field: 'id' },
        { path: 'environments[0].servers[0]', fixture: 'server', field: 'id' }
    ],
    'daemon_restart': [
        { path: 'environment_id', fixture: 'environment', field: 'id' },
    ],
    'pipeline': [],
    'pipeline_create': [
        { path: 'resource_id', fixture: 'application', field: 'id' },
    ],
    'pipeline_update': [
        { path: 'id', fixture: 'pipeline', field: 'id' }
    ],
    'project': [],
    'project_update': [
        { path: 'id', fixture: 'project', field: 'id' }
    ],
    'repository': [],
    'script': [],
    'script_create': [
    ],
    'script_update': [
        { path: 'id', fixture: 'script', field: 'id' },
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
    'service_create': [
        { path: 'environments[0].id', fixture: 'environment', field: 'id' },
        { path: 'environments[0].servers[0]', fixture: 'server', field: 'id' }
    ],
    'service_reload': [
        { path: 'environment_id', fixture: 'environment', field: 'id' },
    ],
    'service_restart': [
        { path: 'environment_id', fixture: 'environment', field: 'id' },
    ],
    'service_start': [
        { path: 'environment_id', fixture: 'environment', field: 'id' },
    ],
    'service_status_update': [
        { path: 'environment_id', fixture: 'environment', field: 'id' },
    ],
    'service_stop': [
        { path: 'environment_id', fixture: 'environment', field: 'id' },
    ],
    'service_update': [
        { path: 'id', fixture: 'service', field: 'id' },
        { path: 'environments[0].id', fixture: 'environment', field: 'id' },
        { path: 'environments[0].servers[0]', fixture: 'server', field: 'id' },
    ],
    'social_account': [],
    'source_provider': [],
    'ssh_key': [],
    'ssh_key_create': [
        { path: 'environments[0].id', fixture: 'environment', field: 'id' },
        { path: 'environments[0].servers[0]', fixture: 'server', field: 'id' }
    ],
    'ssh_key_update': [
        { path: 'id', fixture: 'ssh_key', field: 'id' },
        { path: 'environments[0].id', fixture: 'environment', field: 'id' },
        { path: 'environments[0].servers[0]', fixture: 'server', field: 'id' }
    ],
    'ssl_certificate': [],
    'team': [],
    'team_create': [
        { path: 'environment_id', fixture: 'environment', field: 'id' },
        { path: 'project_id', fixture: 'project', field: 'id' },
    ],
    'user_credentials': [],
    'user_tokens': [],
    'user': [],
    "user_update": [
        { path: 'id', fixture: 'user', field: 'id' },
        { path: 'name', fixture: 'user_credentials', field: 'email' },
        { path: 'email', fixture: 'user_credentials', field: 'email' },
    ],
    'variable': [],
    'variable_update': [
        { path: 'id', fixture: 'variable', field: 'id' }
    ],
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
    'deployments': 'deployment',
    'environments': 'environment',
    'network_rules': 'network_rule',
    'daemons': 'daemon',
    'pipelines': 'pipeline',
    'projects': 'project',
    'repositories': 'repository',
    'scripts': 'script',
    'servers': 'server',
    'services': 'service',
    'social_accounts': 'social_account',
    'ssh_keys': 'ssh_key',
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
