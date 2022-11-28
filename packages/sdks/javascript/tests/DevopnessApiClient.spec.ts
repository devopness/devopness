import { DevopnessApiClient } from '../src/DevopnessApiClient'

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
  expect(apiClient).toHaveProperty('static')
  expect(apiClient).toHaveProperty('teamInvitations')
  expect(apiClient).toHaveProperty('teams')
  expect(apiClient).toHaveProperty('users')
  expect(apiClient.users).toHaveProperty('passwords')
  expect(apiClient).toHaveProperty('variables')
})
