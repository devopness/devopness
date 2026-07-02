import { beforeEach, expect, test } from '@jest/globals';
import { AxiosResponse } from 'axios';

import { ApiBaseService, Configuration } from '../src/services/ApiBaseService';

class TestApiBaseService extends ApiBaseService {
    public hasExpired(response: AxiosResponse | undefined): boolean {
        return this.isTokenExpired(response);
    }
}

const base64UrlEncode = (value: string): string => {
    return btoa(value)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/g, '');
};

const buildJwt = (payload: Record<string, unknown>): string => {
    const header = base64UrlEncode(JSON.stringify({ alg: 'none', typ: 'JWT' }));
    const body = base64UrlEncode(JSON.stringify(payload));

    return `${header}.${body}.signature`;
};

const buildResponse = (status: number): AxiosResponse => {
    return {
        data: null,
        status,
        statusText: 'OK',
        config: {},
        headers: {},
    } as AxiosResponse;
};

beforeEach(() => {
    ApiBaseService.configuration = new Configuration({});
    ApiBaseService.accessToken = '';
});

test('isTokenExpired returns false when there is no access token', () => {
    const service = new TestApiBaseService();

    expect(service.hasExpired(buildResponse(401))).toBe(false);
});

test('isTokenExpired returns false when the response is not a 401', () => {
    ApiBaseService.accessToken = buildJwt({ exp: Math.floor(Date.now() / 1000) - 60 });
    const service = new TestApiBaseService();

    expect(service.hasExpired(buildResponse(200))).toBe(false);
});

test('isTokenExpired returns true for an expired token', () => {
    ApiBaseService.accessToken = buildJwt({
        exp: Math.floor(Date.now() / 1000) - 60,
        sub: 'jeferson-oliveira@example.com',
    });
    const service = new TestApiBaseService();

    expect(service.hasExpired(buildResponse(401))).toBe(true);
});

test('isTokenExpired returns false for a token that is still valid', () => {
    ApiBaseService.accessToken = buildJwt({
        exp: Math.floor(Date.now() / 1000) + 3600,
        sub: 'jeferson-oliveira@example.com',
    });
    const service = new TestApiBaseService();

    expect(service.hasExpired(buildResponse(401))).toBe(false);
});

test('isTokenExpired returns false when the token payload cannot be decoded', () => {
    ApiBaseService.accessToken = 'header.not-base64.signature';
    const service = new TestApiBaseService();

    expect(service.hasExpired(buildResponse(401))).toBe(false);
});
