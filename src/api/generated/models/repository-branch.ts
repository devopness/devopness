/* eslint-disable */
/**
 * devopness API
 * Devopness API - Painless essential DevOps to everyone  # Authentication  <!-- ReDoc-Inject: <security-definitions> -->
 *
 * The version of the OpenAPI document: latest
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import { Commit } from './commit';

/**
 * 
 * @export
 * @interface RepositoryBranch
 */
export interface RepositoryBranch {
    /**
     * The name of the branch
     * @type {string}
     * @memberof RepositoryBranch
     */
    name?: string;
    /**
     * The full name of the repository (`owner/repository`)
     * @type {string}
     * @memberof RepositoryBranch
     */
    repo_full_name?: string;
    /**
     * 
     * @type {Commit}
     * @memberof RepositoryBranch
     */
    commit?: Commit;
}

