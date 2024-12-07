import UpdateUser from '@universal-packages/authentication/UpdateUser.universal-auth-dynamic'

import { initialize } from '../../src'
import UserFromContextDynamic from '../__fixtures__/dynamics/UserFromContext.auth-dynamic'
import { appRouter } from '../trpc'

beforeAll(async (): Promise<void> => {
  await initialize({ dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret' })
})

trpcJest.runTrpcServer(appRouter, { user: { id: 99 } })

describe('DefaultModuleController', (): void => {
  describe('update-email-password', (): void => {
    describe('when a successful update happens', (): void => {
      it('returns ok and the rendered user data', async (): Promise<void> => {
        dynamicApiJest.mockDynamicReturnValue(UpdateUser, { id: 69 })

        expect(await trpcJest.client(appRouter).updateEmailPassword.mutate({ email: 'new@email.com' })).toEqual({ status: 'success', user: { id: 69 } })
      })
    })

    describe('when attributes are not valid', (): void => {
      it('returns fail', async (): Promise<void> => {
        expect(await trpcJest.client(appRouter).updateEmailPassword.mutate({ password: 'new' })).toEqual({
          status: 'failure',
          validation: {
            errors: {
              password: ['password-out-of-size']
            },
            valid: false
          },
          user: null
        })
      })
    })

    describe('when the user can not be extracted from context (not logged in)', (): void => {
      it('returns unauthorized', async (): Promise<void> => {
        dynamicApiJest.mockDynamicReturnValue(UserFromContextDynamic, undefined)

        await expect(trpcJest.client(appRouter).updateEmailPassword.mutate({ email: 'new@email.com' })).rejects.toThrow('UNAUTHORIZED')
      })
    })
  })
})
