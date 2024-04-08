import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { DevopnessApiClient } from '../src/DevopnessApiClient'

const reqMock = new MockAdapter(axios)

test("base URL defaults to production environment", () => {
  const apiClient = new DevopnessApiClient();
  expect(apiClient.projects.baseURL()).toBe("https://api.devopness.com")
})

test("base URL is configurable on initialization", () => {
  const apiServerUrl = "https://test-api.devopness.com";

  const apiClient = new DevopnessApiClient({ baseURL: apiServerUrl });
  expect(apiClient.projects.baseURL()).toBe(apiServerUrl)

  expect(apiClient).toHaveProperty('actions')
  expect(apiClient).toHaveProperty('applications')
  expect(apiClient).toHaveProperty('cloudProviderCredentials')
  expect(apiClient).toHaveProperty('cronjobs')
  expect(apiClient).toHaveProperty('daemons')
  expect(apiClient).toHaveProperty('environments')
  expect(apiClient).toHaveProperty('hookRequests')
  expect(apiClient).toHaveProperty('hooks')
  expect(apiClient).toHaveProperty('logs')
  expect(apiClient).toHaveProperty('networkRules')
  expect(apiClient).toHaveProperty('pipelines')
  expect(apiClient).toHaveProperty('projects')
  expect(apiClient).toHaveProperty('resourceEvents')
  expect(apiClient).toHaveProperty('roles')
  expect(apiClient).toHaveProperty('servers')
  expect(apiClient).toHaveProperty('services')
  expect(apiClient).toHaveProperty('socialAccounts')
  expect(apiClient).toHaveProperty('sourceProviders')
  expect(apiClient).toHaveProperty('sshKeys')
  expect(apiClient).toHaveProperty('sslCertificates')
  expect(apiClient).toHaveProperty('virtualHosts')

  expect(apiClient).toHaveProperty('static')
  expect(apiClient.static).toHaveProperty('applicationOptions')
  expect(apiClient.static).toHaveProperty('cloudProviderOptions')
  expect(apiClient.static).toHaveProperty('cloudProviderServiceInstances')
  expect(apiClient.static).toHaveProperty('cloudProviderServices')
  expect(apiClient.static).toHaveProperty('cronJobOptions')
  expect(apiClient.static).toHaveProperty('environmentOptions')
  expect(apiClient.static).toHaveProperty('permissions')
  expect(apiClient.static).toHaveProperty('serviceOptions')

  expect(apiClient).toHaveProperty('teamInvitations')
  expect(apiClient).toHaveProperty('teams')

  expect(apiClient).toHaveProperty('users')
  expect(apiClient.users).toHaveProperty('passwords')

  expect(apiClient).toHaveProperty('variables')

  expect(apiClient).toHaveProperty('onTokenExpired')
})

test("expired access_token should trigger callback function", async () => {
  const mockRefreshTokenCallback = jest.fn(token => token);

  const apiClient = new DevopnessApiClient();
  apiClient.accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3MTE3MjE4MTQsImV4cCI6MTcxMTYzNTQxNCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.Id1BkqYEZUEdPyu2BaTH9ulETZiZuSH9XJVi49up1Qw';
  apiClient.onTokenExpired = mockRefreshTokenCallback;

  reqMock.onGet('/users/me').replyOnce(401, {});
  await (apiClient.users.getUserMe());

  expect(mockRefreshTokenCallback).toHaveBeenCalled()
  expect(mockRefreshTokenCallback.mock.calls).toHaveLength(1)
});
