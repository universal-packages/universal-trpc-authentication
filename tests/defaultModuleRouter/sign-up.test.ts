import CreateUserDynamic from '@universal-packages/authentication/CreateUser.universal-auth-dynamic'

import { initialize } from '../../src'
import { appRouter } from '../trpc'

beforeAll(async (): Promise<void> => {
  await initialize({ dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret' })
})

trpcJest.runTrpcServer(appRouter)

describe('DefaultModuleController', (): void => {
  describe('sign-up', (): void => {
    describe('when a successful signup happens', (): void => {
      it('returns ok and the rendered session data', async (): Promise<void> => {
        dynamicApiJest.mockDynamicReturnValue(CreateUserDynamic, { id: 99, email: 'david@universal-packages' })

        expect(await trpcJest.client(appRouter).signUp.mutate({ email: 'DAVID@UNIVERSAL.com', password: '12345678', locale: 'en-US' })).toEqual({
          user: { id: 99, email: 'david@universal-packages' },
          status: 'success',
          sessionToken: ''
        })
      })
    })

    describe('when invalid input is passed', (): void => {
      it('returns bad request', async (): Promise<void> => {
        expect(await trpcJest.client(appRouter).signUp.mutate({ email: 'a', password: 'b', locale: 'bad-locale', timezone: 'bad-timezone' })).toEqual({
          status: 'failure',
          validation: {
            errors: {
              email: ['email-should-be-right-sized'],
              password: ['password-should-be-right-sized'],
              locale: ['locale-should-be-a-valid-locale'],
              timezone: ['timezone-should-be-a-valid-timezone']
            },
            valid: false
          },
          user: null,
          sessionToken: null
        })
      })
    })
  })
})
