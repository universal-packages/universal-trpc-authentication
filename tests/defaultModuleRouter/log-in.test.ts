import DoPasswordsMatch from '@universal-packages/authentication/default-module/DoPasswordsMatch.universal-auth-dynamic'
import UserFromEmailDynamic from '@universal-packages/authentication/default-module/UserFromEmail.universal-auth-dynamic'

import { initialize } from '../../src'
import { appRouter } from '../trpc'

beforeAll(async (): Promise<void> => {
  await initialize({ dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret' })
})

trpcJest.runTrpcServer(appRouter)

describe('DefaultModuleController', (): void => {
  describe('log-in', (): void => {
    describe('when a successful log in happens', (): void => {
      it('returns ok and the rendered session data', async (): Promise<void> => {
        dynamicApiJest.mockDynamicReturnValue(UserFromEmailDynamic, { id: 99, email: 'david@universal-packages.com' })
        dynamicApiJest.mockDynamicReturnValue(DoPasswordsMatch, true)

        expect(await trpcJest.client(appRouter).logIn.mutate({ email: 'email', password: 'password' })).toEqual({
          sessionToken: '',
          status: 'success',
          user: { id: 99, email: 'david@universal-packages.com' }
        })
      })
    })

    describe('when the log in attempt fails', (): void => {
      it('returns invalid credentials message', async (): Promise<void> => {
        await expect(trpcJest.client(appRouter).logIn.mutate({ email: 'email', password: 'password' })).rejects.toThrow('invalid-credentials')
      })
    })
  })
})
