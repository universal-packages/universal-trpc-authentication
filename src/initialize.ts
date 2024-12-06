import { Authentication, AuthenticationOptions } from '@universal-packages/authentication'

import { CurrentAuthentication } from './types'

export const CURRENT_AUTHENTICATION: CurrentAuthentication = { instance: null, options: null }

export async function initialize(options: AuthenticationOptions): Promise<CurrentAuthentication>
export async function initialize<A extends Authentication<any>>(instance: A): Promise<CurrentAuthentication>
export async function initialize<A extends Authentication<any>>(optionsOrInstance: AuthenticationOptions | A): Promise<CurrentAuthentication> {
  if (!CURRENT_AUTHENTICATION.instance) {
    const finalOptions = optionsOrInstance instanceof Authentication ? optionsOrInstance.options : optionsOrInstance
    const finalInstance = optionsOrInstance instanceof Authentication ? optionsOrInstance : (new Authentication(finalOptions) as A)
    const instanceWasPassed = optionsOrInstance instanceof Authentication

    CURRENT_AUTHENTICATION.options = { ...finalOptions }
    CURRENT_AUTHENTICATION.instance = finalInstance

    if (!instanceWasPassed) await CURRENT_AUTHENTICATION.instance.loadDynamics()

    return CURRENT_AUTHENTICATION
  } else {
    throw new Error('Authentication already initialized')
  }
}
