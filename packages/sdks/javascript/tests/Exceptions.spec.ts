import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { DevopnessApiClient } from '../src/DevopnessApiClient'
import { ApiError, NetworkError } from '../src/common/Exceptions';

const reqMock = new MockAdapter(axios)
const apiClient = new DevopnessApiClient();

test("200 response shouldn't reject", async () => {
  expect.assertions(0);
  reqMock.onAny().replyOnce(200, {});
  try {
    await apiClient.users.getUserMe();
  } catch (e) {
    expect(e).toBeInstanceOf(ApiError)
  }
});

test("non-200 response should reject with an ApiError", async () => {
  expect.assertions(1);
  reqMock.onAny().replyOnce(422, {});
  try {
    await (apiClient.users.getUserMe());
  } catch (e) {
    expect(e).toBeInstanceOf(ApiError)
  }
});

test("ApiError message must contain a prefix so consumers know it's been raised by Devopness SDK", async () => {
  expect.assertions(2);
  reqMock.onGet('/users/me').replyOnce(403, {});
  try {
    await (apiClient.users.getUserMe());
  } catch (e: any) {
    expect(e).toBeInstanceOf(ApiError)
    expect(e.message).toBe('Request failed with status code 403');
  }
});

test("NetworkError message must contain a prefix so consumers know it's been raised by Devopness SDK", async () => {
  expect.assertions(2);
  reqMock.onGet('/users/me').timeoutOnce();
  try {
    await (apiClient.users.getUserMe());
  } catch (e: any) {
    expect(e).toBeInstanceOf(NetworkError)
    expect(e.message).toContain('Devopness SDK Network Error - timeout of ');
  }
});

test("request timeout should reject with a NetworkError", async () => {
  expect.assertions(1);
  reqMock.onAny().timeoutOnce();
  try {
    await (apiClient.users.getUserMe());
  } catch (e) {
    expect(e).toBeInstanceOf(NetworkError)
  }
});

test("request network error should reject with a NetworkError", async () => {
  expect.assertions(1);
  reqMock.onAny().networkErrorOnce();
  try {
    await (apiClient.users.getUserMe());
  } catch (e) {
    expect(e).toBeInstanceOf(NetworkError)
  }
});
