import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { DevopnessApiClient } from '../src/DevopnessApiClient'
import { ApiError, NetworkError } from '../src/common/Exceptions';

const reqMock = new MockAdapter(axios)
const apiClient = new DevopnessApiClient();

test("200 response shouldn't reject", async () => {
    expect.assertions(0);
    const email = 'test@test.com'
    const password = 'testpassword'
    reqMock.onAny().replyOnce(200, {
        'access_token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImYwYjQxZjk1MTdiYWExOTg4Zjk',
        'refresh_token': 'def50200a757a1c4dbc4859a4c47195632f4df60ebb521ac5a28a0b7553101f08f8b9'
    });
    try {
        await apiClient.users.login({ email, password })
    } catch (e) {
        expect(e).toBeInstanceOf(ApiError)
    }
});

test("non-200 response should reject with an ApiError", async () => {
    expect.assertions(1);
    const email = 'notanemail'
    const password = 'testpassword'
    reqMock.onPost('/users/login').replyOnce(422, {});
    try {
        await (apiClient.users.login({ email, password }))
    } catch (e) {
        expect(e).toBeInstanceOf(ApiError)
    }
});

test("ApiError message must contain a prefix so consumers know it's been raised by Devopness SDK", async () => {
    expect.assertions(2);
    reqMock.onGet('/users/me').replyOnce(403, {});
    try {
        await (apiClient.users.getCurrentUser());
    } catch (e) {
        expect(e).toBeInstanceOf(ApiError)
        expect(e.message).toBe('Devopness SDK Error - Request failed with status code 403');
    }
});

test("NetworkError message must contain a prefix so consumers know it's been raised by Devopness SDK", async () => {
    expect.assertions(2);
    reqMock.onGet('/users/me').timeoutOnce();
    try {
        await (apiClient.users.getCurrentUser());
    } catch (e) {
        expect(e).toBeInstanceOf(NetworkError)
        expect(e.message).toContain('Devopness SDK Error - timeout of ');
    }
});

test("request timeout should reject with a NetworkError", async () => {
    expect.assertions(1);
    const email = 'notanemail'
    const password = 'testpassword'
    reqMock.onPost('/users/login').timeoutOnce();
    try {
        await (apiClient.users.login({ email, password }))
    } catch (e) {
        expect(e).toBeInstanceOf(NetworkError)
    }
});

test("request network error should reject with a NetworkError", async () => {
    expect.assertions(1);
    const email = 'notanemail'
    const password = 'testpassword'
    reqMock.onPost('/users/login').networkErrorOnce();
    try {
        await (apiClient.users.login({ email, password }))
    } catch (e) {
        expect(e).toBeInstanceOf(NetworkError)
    }
});
