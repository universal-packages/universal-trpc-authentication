import { Authentication, AuthenticationOptions } from '@universal-packages/authentication'

import { CurrentAuthentication } from './types'

export const CURRENT_AUTHENTICATION: CurrentAuthentication = { instance: null, options: null }

export async function initialize(options: AuthenticationOptions): Promise<CurrentAuthentication> {
  if (!CURRENT_AUTHENTICATION.instance) {
    CURRENT_AUTHENTICATION.options = { ...options }
    CURRENT_AUTHENTICATION.instance = new Authentication(CURRENT_AUTHENTICATION.options)

    await CURRENT_AUTHENTICATION.instance.loadDynamics()

    return CURRENT_AUTHENTICATION
  } else {
    throw new Error('Authentication already initialized')
  }
}
