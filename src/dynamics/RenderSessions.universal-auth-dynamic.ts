import { AuthDynamic, Authentication } from '@universal-packages/authentication'

import { RenderSessionsPayload, TrpcAuthDynamicNames } from '../types'

@AuthDynamic<TrpcAuthDynamicNames>('render-sessions', true)
export default class RenderSessionsDynamic {
  public perform(_payload: RenderSessionsPayload, authentication: Authentication<TrpcAuthDynamicNames>): Record<string, any> {
    authentication.emit('warning', { message: 'not implemented', payload: { dynamic: this.constructor.name } })

    return {}
  }
}
