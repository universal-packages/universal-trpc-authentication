import { TRPCError, initTRPC } from '@trpc/server'
import { z } from 'zod'

import { CURRENT_AUTHENTICATION } from './initialize'
import { TrpcAuthenticationResult } from './types'

export function createDefaultAuthenticationModuleRouter<U extends Record<string, any>, S extends Record<string, any>, T extends ReturnType<typeof initTRPC.create>>(
  trpcInstance: T
) {
  return trpcInstance.router({
    logIn: trpcInstance.procedure
      .input(
        z.object({
          email: z.string(),
          password: z.string()
        })
      )
      .mutation(async ({ input, ctx }): Promise<TrpcAuthenticationResult<U, S>> => {
        const result = await CURRENT_AUTHENTICATION.instance.performDynamic('log-in', { email: input.email, password: input.password })

        if (result.status === 'success') {
          const sessionToken = await await CURRENT_AUTHENTICATION.instance.performDynamic('set-session', { user: result.user, context: ctx })

          const rendered = await CURRENT_AUTHENTICATION.instance.performDynamic('render-user', { user: result.user })

          return {
            user: rendered as unknown as U,
            sessionToken
          }
        }

        throw new TRPCError({ code: 'BAD_REQUEST', message: 'invalid-credentials' })
      }),
    requestPasswordReset: trpcInstance.procedure
      .input(
        z.object({
          email: z.string()
        })
      )
      .mutation(async ({ input }): Promise<TrpcAuthenticationResult<U, S>> => {
        await CURRENT_AUTHENTICATION.instance.performDynamic('request-password-reset', { email: input.email })

        return {}
      }),
    signUp: trpcInstance.procedure
      .input(
        z.object({
          email: z.string(),
          password: z.string()
        })
      )
      .mutation(async ({ input, ctx }): Promise<TrpcAuthenticationResult<U, S>> => {
        const result = await CURRENT_AUTHENTICATION.instance.performDynamic('sign-up', { email: input.email, password: input.password })

        if (result.status === 'success') {
          const sessionToken = await CURRENT_AUTHENTICATION.instance.performDynamic('set-session', {
            context: ctx,
            user: result.user
          })

          const rendered = await CURRENT_AUTHENTICATION.instance.performDynamic('render-user', { user: result.user })

          return {
            user: rendered as unknown as U,
            sessionToken
          }
        }

        return { validation: result.validation }
      }),
    updateEmailPassword: trpcInstance.procedure
      .input(
        z.object({
          email: z.string().optional(),
          password: z.string().optional()
        })
      )
      .mutation(async ({ input, ctx }): Promise<TrpcAuthenticationResult<U, S>> => {
        const user = await CURRENT_AUTHENTICATION.instance.performDynamic('user-from-context', { context: ctx })

        if (user) {
          const result = await CURRENT_AUTHENTICATION.instance.performDynamic('update-email-password', { user, ...input })

          if (result.status === 'success') {
            const rendered = await CURRENT_AUTHENTICATION.instance.performDynamic('render-user', { user: result.user })

            return {
              user: rendered as unknown as U
            }
          }

          return { validation: result.validation }
        } else {
          throw new TRPCError({ code: 'UNAUTHORIZED' })
        }
      }),
    verifyPasswordReset: trpcInstance.procedure
      .input(
        z.object({
          email: z.string(),
          oneTimePassword: z.string(),
          password: z.string()
        })
      )
      .mutation(async ({ input }): Promise<TrpcAuthenticationResult<U, S>> => {
        const result = await CURRENT_AUTHENTICATION.instance.performDynamic('verify-password-reset', {
          email: input.email,
          oneTimePassword: input.oneTimePassword,
          password: input.password
        })

        if (result.status === 'failure') {
          if (result.message === 'invalid-one-time-password') {
            throw new TRPCError({ code: 'BAD_REQUEST', message: 'invalid-one-time-password' })
          }
          return { validation: result.validation }
        }

        return {}
      })
  })
}
