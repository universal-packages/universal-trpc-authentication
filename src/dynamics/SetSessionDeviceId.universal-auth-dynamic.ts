import { AuthDynamic, Authentication } from '@universal-packages/authentication'

import { SetSessionDeviceIdPayload, TrpcAuthDynamicNames } from '../types'

@AuthDynamic<TrpcAuthDynamicNames>('set-session-device-id', true)
export default class SetSessionDeviceIdDynamic {
  public async perform(_payload: SetSessionDeviceIdPayload, authentication: Authentication<TrpcAuthDynamicNames>): Promise<void> {
    authentication.emit('warning', { message: 'not implemented', payload: { dynamic: this.constructor.name } })
  }
}
