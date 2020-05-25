import { DevopnessApiClient } from './DevopnessApiClient'

test("base URL defaults to production environment", () => {
    const apiClient = new DevopnessApiClient();
    expect(apiClient.baseURL).toBe("https://api.devopness.com")
})

test("base URL is configurable", () => {
    const apiClient = new DevopnessApiClient({ baseURL: "https://test-api.devopness.com" });
    expect(apiClient.baseURL).toBe("https://test-api.devopness.com")
})

test("base URL can't be set after initialization", () => {
    const apiClient = new DevopnessApiClient();
    const trySet = () => {
        apiClient.baseURL = "https://test-api.devopness.com"
    }
    expect(trySet).toThrow()
})