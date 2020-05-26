import { DevopnessApiClient } from '../src/DevopnessApiClient'

test("base URL defaults to production environment", () => {
    const apiClient = new DevopnessApiClient();
    expect(apiClient.projects.baseURL()).toBe("https://api.devopness.com")
})

test("base URL is configurable on initialization", () => {
    const apiClient = new DevopnessApiClient({ baseURL: "https://test-api.devopness.com" });
    expect(apiClient.projects.baseURL()).toBe("https://test-api.devopness.com")
})
