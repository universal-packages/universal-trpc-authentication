import VerifyOneTimePassword from '@universal-packages/authentication/VerifyOneTimePassword.universal-auth-dynamic'
import UserFromEmailDynamic from '@universal-packages/authentication/default-module/UserFromEmail.universal-auth-dynamic'

import { initialize } from '../../src'
import { appRouter } from '../trpc'

beforeAll(async (): Promise<void> => {
  await initialize({ dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret' })
})

trpcJest.runTrpcServer(appRouter)

describe('DefaultModuleController', (): void => {
  describe('verify-password-reset', (): void => {
    describe('when the password-reset verification is successful', (): void => {
      it('returns ok', async (): Promise<void> => {
        dynamicApiJest.mockDynamicReturnValue(VerifyOneTimePassword, true)
        dynamicApiJest.mockDynamicReturnValue(UserFromEmailDynamic, { id: 99, email: 'david@universal-packages.com' })

        expect(await trpcJest.client(appRouter).verifyPasswordReset.mutate({ email: 'email', oneTimePassword: '123', password: 'new-password' })).toEqual({ status: 'success' })
      })
    })

    describe('when the otp verification fails', (): void => {
      it('returns fail', async (): Promise<void> => {
        dynamicApiJest.mockDynamicReturnValue(VerifyOneTimePassword, false)

        await expect(trpcJest.client(appRouter).verifyPasswordReset.mutate({ email: 'email', oneTimePassword: '123', password: 'new-password' })).rejects.toThrow(
          'invalid-one-time-password'
        )
      })
    })

    describe('when the validation fails', (): void => {
      it('returns fail', async (): Promise<void> => {
        dynamicApiJest.mockDynamicReturnValue(VerifyOneTimePassword, true)
        dynamicApiJest.mockDynamicReturnValue(UserFromEmailDynamic, { id: 99, email: 'david@universal-packages.com' })

        expect(await trpcJest.client(appRouter).verifyPasswordReset.mutate({ email: 'email', oneTimePassword: '123', password: 'short' })).toEqual({
          status: 'failure',
          validation: {
            errors: {
              password: ['password-out-of-size']
            },
            valid: false
          }
        })
      })
    })
  })
})
