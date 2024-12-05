import { AuthDynamic, UserPayload } from '@universal-packages/authentication'

import { TrpcAuthDynamicNames } from '../types'

@AuthDynamic<TrpcAuthDynamicNames>('render-user', true)
export default class RenderUserDynamic {
  public perform(payload: UserPayload): Record<string, any> {
    const { user } = payload

    return {
      id: user.id,
      email: user.email
    }
  }
}
