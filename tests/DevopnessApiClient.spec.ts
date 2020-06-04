import { DevopnessApiClient } from '../src/DevopnessApiClient'

test("base URL defaults to production environment", () => {
    const apiClient = new DevopnessApiClient();
    expect(apiClient.projects.baseURL()).toBe("https://api.devopness.com")
})

test("base URL is configurable on initialization", () => {
    const apiServerUrl = "https://test-api.devopness.com";

    const apiClient = new DevopnessApiClient({ baseURL: apiServerUrl });
    expect(apiClient.projects.baseURL()).toBe(apiServerUrl)
})
