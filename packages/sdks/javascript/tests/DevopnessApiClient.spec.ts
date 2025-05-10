import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { DevopnessApiClient } from '../src/DevopnessApiClient';

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
  expect(apiClient).toHaveProperty('credentials')
  expect(apiClient).toHaveProperty('cronjobs')
  expect(apiClient).toHaveProperty('daemons')
  expect(apiClient).toHaveProperty('environments')
  expect(apiClient).toHaveProperty('hookRequests')
  expect(apiClient).toHaveProperty('hooks')
  expect(apiClient).toHaveProperty('logs')
  expect(apiClient).toHaveProperty('networkRules')
  expect(apiClient).toHaveProperty('organizations')
  expect(apiClient).toHaveProperty('pipelines')
  expect(apiClient).toHaveProperty('projects')
  expect(apiClient).toHaveProperty('resourceEvents')
  expect(apiClient).toHaveProperty('roles')
  expect(apiClient).toHaveProperty('servers')
  expect(apiClient).toHaveProperty('services')
  expect(apiClient).toHaveProperty('socialAccounts')
  expect(apiClient).toHaveProperty('sshKeys')
  expect(apiClient).toHaveProperty('sslCertificates')
  expect(apiClient).toHaveProperty('static')
  expect(apiClient).toHaveProperty('teamInvitations')
  expect(apiClient).toHaveProperty('teams')
  expect(apiClient).toHaveProperty('variables')
  expect(apiClient).toHaveProperty('virtualHosts')

  expect(apiClient).toHaveProperty('users')
  expect(apiClient.users).toHaveProperty('passwords')

  expect(apiClient).toHaveProperty('onTokenExpired')

})

test("expired access_token should trigger callback function", async () => {
  const mockRefreshTokenCallback = jest.fn(token => token);

  const apiClient = new DevopnessApiClient();
  apiClient.accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcGkuZGV2b3BuZXNzLmNvbSIsImlhdCI6MTcxMjYyMTYwMywiZXhwIjoxNzEyNTg5MjAzLCJhdWQiOiJ3d3cubXktcHJvZHVjdC5jb20iLCJzdWIiOiJzb21lb25lQGV4YW1wbGUuY29tIiwic2NvcGUiOlsic2VydmVyOnJlYWQiLCJzZXJ2ZXI6Z2V0X3N0YXR1cyIsImFwcGxpY2F0aW9uOmRlcGxveSIsImFwcGxpY2F0aW9uOmVkaXQiLCJjcm9uam9iOnJlYWQiLCJjcm9uam9iOmRlcGxveSIsInNzbC1jZXJ0aWZpY2F0ZTpkZXBsb3kiXX0.GirkUv0UI1kUORKpcWSrSKsfbM-s5Hwd1LSlDpExgbg';
  apiClient.onTokenExpired = mockRefreshTokenCallback;

  reqMock.onGet('/users/me').replyOnce(401, {});
  await (apiClient.users.getUserMe());

  expect(mockRefreshTokenCallback).toHaveBeenCalled()
  expect(mockRefreshTokenCallback.mock.calls).toHaveLength(1)
});
