import { initialize } from '../../src'
import UserFromContextDynamic from '../__fixtures__/dynamics/UserFromContext.auth-dynamic'
import { appRouter } from '../trpc'

beforeAll(async (): Promise<void> => {
  await initialize({ dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret' })
})

trpcJest.runTrpcServer(appRouter, { user: { id: 99 } })

describe('AuthenticationController', (): void => {
  describe('sessions', (): void => {
    describe('when an user is in session', (): void => {
      it('returns ok and renders the sessions', async (): Promise<void> => {
        expect(await trpcJest.client(appRouter).sessions.query()).toEqual({ status: 'success', sessions: {} })
      })
    })

    describe('when no user is in session', (): void => {
      it('returns unauthorized', async (): Promise<void> => {
        dynamicApiJest.mockDynamicReturnValue(UserFromContextDynamic, undefined)

        await expect(trpcJest.client(appRouter).sessions.query()).rejects.toThrow('UNAUTHORIZED')
      })
    })
  })
})
