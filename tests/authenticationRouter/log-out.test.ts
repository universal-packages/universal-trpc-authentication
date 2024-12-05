import { initialize } from '../../src'
import UserFromContextDynamic from '../__fixtures__/dynamics/UserFromContext.auth-dynamic'
import { appRouter } from '../trpc'

beforeAll(async (): Promise<void> => {
  await initialize({ dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret' })
})

trpcJest.runTrpcServer(appRouter, { user: { id: 99 } })

describe('AuthenticationController', (): void => {
  describe('log-out', (): void => {
    describe('when a successful log out happens', (): void => {
      it('returns ok and the rendered session data', async (): Promise<void> => {
        expect(await trpcJest.client(appRouter).logOut.mutate()).toEqual({})
      })
    })

    describe('when no user is in session', (): void => {
      it('returns unauthorized', async (): Promise<void> => {
        dynamicApiJest.mockDynamicReturnValue(UserFromContextDynamic, undefined)

        await expect(trpcJest.client(appRouter).logOut.mutate()).rejects.toThrow('UNAUTHORIZED')
      })
    })
  })
})
