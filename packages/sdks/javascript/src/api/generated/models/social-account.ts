/* eslint-disable */
/**
 * devopness API
 * Devopness API - Painless essential DevOps to everyone 
 *
 * The version of the OpenAPI document: latest
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import { SocialAccountDisplayableName } from './social-account-displayable-name';
import { SocialAccountProvider } from './social-account-provider';

/**
 * 
 * @export
 * @interface SocialAccount
 */
export interface SocialAccount {
    /**
     * The ID of the given social account
     * @type {number}
     * @memberof SocialAccount
     */
    id: number;
    /**
     * The current user\'s ID
     * @type {number}
     * @memberof SocialAccount
     */
    user_id: number;
    /**
     * 
     * @type {SocialAccountProvider}
     * @memberof SocialAccount
     */
    provider: SocialAccountProvider;
    /**
     * 
     * @type {SocialAccountDisplayableName}
     * @memberof SocialAccount
     */
    provider_human_readable: SocialAccountDisplayableName;
    /**
     * The nickname of the user on the Source Authentication provider
     * @type {string}
     * @memberof SocialAccount
     */
    provider_user_nickname: string;
    /**
     * Tells if the social account provider is a Source Code Provider/Version Control System. e.g. false for Facebook, true for Github
     * @type {boolean}
     * @memberof SocialAccount
     */
    is_vcs: boolean;
    /**
     * The date and time indicating when the authentication token will expire at
     * @type {string}
     * @memberof SocialAccount
     */
    token_expires_at: string | null;
    /**
     * The date and time when the record was created
     * @type {string}
     * @memberof SocialAccount
     */
    created_at: string;
    /**
     * The date and time when the record was last updated
     * @type {string}
     * @memberof SocialAccount
     */
    updated_at: string;
}

