import { TRPCError, initTRPC } from '@trpc/server'
import { z } from 'zod'

import { CURRENT_AUTHENTICATION } from './initialize'
import { TrpcAuthenticationResult } from './types'

export function createAuthenticationRouter<U extends Record<string, any>, S extends Record<string, any>, T extends ReturnType<typeof initTRPC.create>>(trpcInstance: T) {
  return trpcInstance.router({
    logOut: trpcInstance.procedure
      .input(
        z
          .object({
            sessionId: z.string().optional()
          })
          .optional()
      )
      .mutation(async ({ input, ctx }): Promise<TrpcAuthenticationResult<U, S>> => {
        const user = await CURRENT_AUTHENTICATION.instance.performDynamic('user-from-context', { context: ctx })

        if (user) {
          await CURRENT_AUTHENTICATION.instance.performDynamic('unset-session', { context: ctx, user, sessionId: input?.sessionId })

          return {
            status: 'success'
          }
        } else {
          throw new TRPCError({ code: 'UNAUTHORIZED' })
        }
      }),
    me: trpcInstance.procedure.query(async ({ ctx }): Promise<TrpcAuthenticationResult<U, S>> => {
      const user = await CURRENT_AUTHENTICATION.instance.performDynamic('user-from-context', { context: ctx })

      if (user) {
        const rendered = await CURRENT_AUTHENTICATION.instance.performDynamic('render-user', { user })

        return {
          status: 'success',
          user: rendered as U
        }
      } else {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }
    }),
    sessions: trpcInstance.procedure.query(async ({ ctx }): Promise<TrpcAuthenticationResult<U, S>> => {
      const user = await CURRENT_AUTHENTICATION.instance.performDynamic('user-from-context', { context: ctx })

      if (user) {
        const renderedSessions = await CURRENT_AUTHENTICATION.instance.performDynamic('render-sessions', { user, context: ctx })

        return {
          sessions: renderedSessions as Record<string, S>,
          status: 'success'
        }
      } else {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }
    }),
    updateDeviceId: trpcInstance.procedure
      .input(
        z.object({
          deviceId: z.string({ required_error: 'required' })
        })
      )
      .mutation(async ({ input, ctx }): Promise<TrpcAuthenticationResult<U, S>> => {
        const user = await CURRENT_AUTHENTICATION.instance.performDynamic('user-from-context', { context: ctx })

        if (user) {
          await CURRENT_AUTHENTICATION.instance.performDynamic('set-session-device-id', { user, context: ctx, deviceId: input.deviceId })
          return {
            status: 'success'
          }
        } else {
          throw new TRPCError({ code: 'UNAUTHORIZED' })
        }
      })
  })
}
