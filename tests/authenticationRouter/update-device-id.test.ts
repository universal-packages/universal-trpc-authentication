import { initialize } from '../../src'
import UserFromContextDynamic from '../__fixtures__/dynamics/UserFromContext.auth-dynamic'
import { appRouter } from '../trpc'

beforeAll(async (): Promise<void> => {
  await initialize({ dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret' })
})

trpcJest.runTrpcServer(appRouter, { user: { id: 99 } })

describe('AuthenticationController', (): void => {
  describe('update-device-id', (): void => {
    describe('when an user is in session', (): void => {
      it('returns ok and sets the device id', async (): Promise<void> => {
        expect(await trpcJest.client(appRouter).updateDeviceId.mutate({ deviceId: 'my-device-id' })).toEqual({})
      })
    })

    describe('when no user is in session', (): void => {
      it('returns forbidden', async (): Promise<void> => {
        dynamicApiJest.mockDynamicReturnValue(UserFromContextDynamic, undefined)

        await expect(trpcJest.client(appRouter).updateDeviceId.mutate({ deviceId: 'my-device-id' })).rejects.toThrow('UNAUTHORIZED')
      })
    })
  })
})
