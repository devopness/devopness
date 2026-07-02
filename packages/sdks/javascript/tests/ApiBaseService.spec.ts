import { expect, test } from '@jest/globals';

import { ApiBaseService, Configuration } from '../src/services/ApiBaseService';

class TestApiBaseService extends ApiBaseService {
  public hasExpiredToken(response: Parameters<ApiBaseService['isTokenExpired']>[0]) {
    return this.isTokenExpired(response)
  }
}

const createJwt = (payload: Record<string, unknown>) => {
  const encodedPayload = btoa(JSON.stringify(payload))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/u, '')

  return `header.${encodedPayload}.signature`
}

const makeService = (accessToken?: string) => {
  ApiBaseService.configuration = new Configuration({})
  ApiBaseService.accessToken = accessToken ?? ''
  return new TestApiBaseService()
}

test('returns false when no access token is set', () => {
  const service = makeService()

  expect(service.hasExpiredToken({ status: 401 } as never)).toBe(false)
})

test('returns false when the token is still valid', () => {
  const service = makeService(
    createJwt({
      exp: Math.floor(Date.now() / 1000) + 60,
    })
  )

  expect(service.hasExpiredToken({ status: 401 } as never)).toBe(false)
})

test('returns false when the response is not a 401', () => {
  const service = makeService(
    createJwt({
      exp: Math.floor(Date.now() / 1000) - 60,
    })
  )

  expect(service.hasExpiredToken({ status: 500 } as never)).toBe(false)
})

test('returns true when the token is expired and the response is a 401', () => {
  const service = makeService(
    createJwt({
      exp: Math.floor(Date.now() / 1000) - 60,
    })
  )

  expect(service.hasExpiredToken({ status: 401 } as never)).toBe(true)
})
