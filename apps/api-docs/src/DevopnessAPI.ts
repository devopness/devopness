import request, { HttpVerb, Response } from 'sync-request';

import { Identifiable } from './fixtureTypes';

type LogFunction = (...any: any[]) => void;

export default class DevopnessAPI {
    host: string;
    authToken: string;
    log: LogFunction;

    constructor(host: string, authToken: string, log: LogFunction) {
        this.authToken = authToken;
        this.log = log;
        this.host = host;
    }

    apiRequest(method: HttpVerb, path: string, tag='[apiRequest]'): Response {
        const url = `https://${this.host}${path}`;
        const headers = { headers: { 'Authorization': `Bearer ${this.authToken}` }};
        const res = request(method, url, headers);
        this.log(`${tag} ${method} ${path}:  ${res.statusCode}`)
        return res
    }

    listProjectApplications(projectId: string): string[] {
        const tag = '[listProjectApplications]';
        const res = this.apiRequest('GET', `/projects/${projectId}/applications`, tag);
        const body = res.getBody('utf8');
        if (res.statusCode == 200) {
            return JSON.parse(body).map((p: Identifiable) => p.id);
        }
        this.log(`${tag} ${body}`);
        return [];
    }

    deleteApplication(id: string): boolean {
        const tag = '[deleteApplication]';
        const res = this.apiRequest('DELETE', `/applications/${id}`, tag);
        if (res.statusCode == 204) {
            return true;
        }
        const body = res.getBody('utf8');
        this.log(`${tag} ${body}`);
        return false;
    }

}
