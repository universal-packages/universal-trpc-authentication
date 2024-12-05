import { AuthDynamic } from '@universal-packages/authentication'

import { TrpcAuthDynamicNames, UserFromContextPayload } from '../types'

@AuthDynamic<TrpcAuthDynamicNames>('user-from-context', true)
export default class UserFromContextDynamic {
  public async perform(payload: UserFromContextPayload): Promise<Record<string, any>> {
    const { context } = payload

    return context['user']
  }
}
