import request, { HttpVerb, Response } from 'sync-request';

import { Identifiable } from './fixtureTypes';

type LogFunction = (...any: any[]) => void;

/**
 * DevopnessAPI client with synchronous methods for issuing requests.
 * Only implements a few endpoints.
 */
export default class DevopnessAPI {
    host: string;
    authToken: string;
    log: LogFunction;

    /**
     * @param host The devopness API host URL
     * @param authToken Bearer token for request authorization
     * @param log Logging function
     */
    constructor(host: string, authToken: string, log: LogFunction) {
        this.authToken = authToken;
        this.log = log;
        this.host = host;
    }

    /**
     * Performs a request to the devopness API.
     * @param method HTTP method
     * @param path path to API endpoint, without host
     * @param tag optional log tag
     */
    apiRequest(method: HttpVerb, path: string, tag = '[apiRequest]'): Response {
        const url = `https://${this.host}${path}`;
        const headers = { headers: { 'Authorization': `Bearer ${this.authToken}` } };
        const res = request(method, url, headers);
        this.log(`${tag} ${method} ${path}:  ${res.statusCode}`)
        return res
    }

    /**
     * Gets all application IDs belonging to an environment.
     * @param environmentId ID of the environment to be queried
     */
    listEnvironmentApplications(environmentId: string): string[] {
        const tag = '[listEnvironmentApplications]';
        const res = this.apiRequest('GET', `/environments/${environmentId}/applications`, tag);
        const body = res.getBody('utf8');
        if (res.statusCode == 200) {
            return JSON.parse(body).map((p: Identifiable) => p.id);
        }
        this.log(`${tag} ${body}`);
        return [];
    }

    /**
     * Deletes an application.
     * @param applicationId ID of the application to be deleted
     */
    deleteApplication(applicationId: string): boolean {
        const tag = '[deleteApplication]';
        const res = this.apiRequest('DELETE', `/applications/${applicationId}`, tag);
        if (res.statusCode == 204) {
            return true;
        }
        const body = res.getBody('utf8');
        this.log(`${tag} ${body}`);
        return false;
    }

}
