import { AuthDynamicNames, Authentication, AuthenticationOptions, DefaultModuleDynamicNames, UserPayload, ValidationResult } from '@universal-packages/authentication'

export interface CurrentAuthentication {
  instance: Authentication<TrpcDefaultAuthenticationModuleDynamicNames>
  options: AuthenticationOptions
}

export interface TrpcAuthDynamicNames<U = Record<string, any>, C = Record<string, any>, S = Record<string, any>> {
  'user-from-context': { payload: UserFromContextPayload<C>; result: U }
  'render-user': { payload: UserPayload<U>; result: Record<string, any> }
  'render-sessions': { payload: RenderSessionsPayload<U, C>; result: Record<string, S> }
  'set-session': { payload: SetSessionPayload<U, C>; result: string }
  'set-session-device-id': { payload: SetSessionDeviceIdPayload<U, C>; result: void }
  'unset-session': { payload: UnsetSessionPayload<U, C>; result: void }
}

export type TrpcAuthenticationDynamicNames<U = Record<string, any>> = AuthDynamicNames<U> & TrpcAuthDynamicNames<U>
export type TrpcDefaultAuthenticationModuleDynamicNames<U = Record<string, any>> = DefaultModuleDynamicNames<U> & TrpcAuthDynamicNames<U>

export interface UserFromContextPayload<C = Record<string, any>> {
  context: C
}

export interface RenderSessionsPayload<U = Record<string, any>, C = Record<string, any>> {
  context: C
  user: U
}

export interface SetSessionPayload<U = Record<string, any>, C = Record<string, any>> {
  context: C
  user: U
}

export interface SetSessionDeviceIdPayload<U = Record<string, any>, C = Record<string, any>> {
  context: C
  deviceId: string
  user: U
}

export interface UnsetSessionPayload<U = Record<string, any>, C = Record<string, any>> {
  context: C
  user: U
  sessionId?: string
}

export interface BaseTrpcAuthenticationResult<M = Record<string, any>> {
  message?: string
  metadata?: M
  status: 'success' | 'failure' | 'warning'
  validation?: ValidationResult
}
