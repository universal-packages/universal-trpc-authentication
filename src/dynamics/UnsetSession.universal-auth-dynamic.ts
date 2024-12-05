import { AuthDynamic, Authentication } from '@universal-packages/authentication'

import { TrpcAuthDynamicNames, UnsetSessionPayload } from '../types'

@AuthDynamic<TrpcAuthDynamicNames>('unset-session', true)
export default class UnsetSessionDynamic {
  public async perform(_payload: UnsetSessionPayload, authentication: Authentication<TrpcAuthDynamicNames>): Promise<void> {
    authentication.emit('warning', { message: 'not implemented', payload: { dynamic: this.constructor.name } })
  }
}
