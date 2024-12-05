import { AuthDynamic, Authentication } from '@universal-packages/authentication'

import { TrpcAuthDynamicNames, SetSessionPayload } from '../types'

@AuthDynamic<TrpcAuthDynamicNames>('set-session', true)
export default class SetSessionDynamic {
  public async perform(_payload: SetSessionPayload, authentication: Authentication<TrpcAuthDynamicNames>): Promise<string> {
    authentication.emit('warning', { message: 'not implemented', payload: { dynamic: this.constructor.name } })

    return ''
  }
}
