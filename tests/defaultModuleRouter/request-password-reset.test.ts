import UserFromEmailDynamic from '@universal-packages/authentication/default-module/UserFromEmail.universal-auth-dynamic'

import { initialize } from '../../src'
import { appRouter } from '../trpc'

beforeAll(async (): Promise<void> => {
  await initialize({ dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret' })
})

trpcJest.runTrpcServer(appRouter)

describe('DefaultModuleController', (): void => {
  describe('request-password-reset', (): void => {
    describe('when the password-reset request is successful', (): void => {
      it('returns ok', async (): Promise<void> => {
        dynamicApiJest.mockDynamicReturnValue(UserFromEmailDynamic, { id: 99, email: 'david@universal-packages.com' })

        expect(await trpcJest.client(appRouter).requestPasswordReset.mutate({ email: 'email' })).toEqual({ status: 'success' })
      })
    })

    describe('when no user can be match with the credential', (): void => {
      it('still returns ok', async (): Promise<void> => {
        dynamicApiJest.mockDynamicReturnValue(UserFromEmailDynamic, { id: 99, email: 'david@universal-packages.com' })

        expect(await trpcJest.client(appRouter).requestPasswordReset.mutate({ email: 'email' })).toEqual({ status: 'success' })
      })
    })
  })
})
