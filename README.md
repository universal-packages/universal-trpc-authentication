# tRPC Authentication

[![npm version](https://badge.fury.io/js/@universal-packages%2Ftrpc-authentication.svg)](https://www.npmjs.com/package/@universal-packages/trpc-authentication)
[![Testing](https://github.com/universal-packages/universal-trpc-authentication/actions/workflows/testing.yml/badge.svg)](https://github.com/universal-packages/universal-trpc-authentication/actions/workflows/testing.yml)
[![codecov](https://codecov.io/gh/universal-packages/universal-trpc-authentication/branch/main/graph/badge.svg?token=CXPJSN8IGL)](https://codecov.io/gh/universal-packages/universal-trpc-authentication)

[universal-authentication](https://github.com/universal-packages/universal-authentication) implementation on top of [trpc](https://trpc.io/)

## Install

```shell
npm install @universal-packages/trpc-authentication
```

## Global methods

#### **`initialize(options: Object)`**

Initialize the authentication api configuration for the authentication trpc routers.

```js
import { initialize } from '@universal-packages/trpc-authentication'

await initialize({ secret: 'my-secret' })
```

#### Options

`initialize` takes the same [options](https://github.com/universal-packages/universal-authentication#options) as `Authentication`.

## Router creators

#### **`createAuthenticationRouter(trpc: TRPCInstance)`**

Create a trpc router with the authentication methods.

```js
import { initTRPC } from '@trpc/server'
import { createAuthenticationRouter, initialize } from '@universal-packages/trpc-authentication'

await initialize({ secret: 'my-secret' })

export const trpc = initTRPC.create()
export const appRouter = trpc.router({
  authentication: createAuthenticationRouter(trpc)
})
```

#### **`createDefaultAuthenticationModuleRouter(trpc: TRPCInstance)`**

Create a trpc router with the default authentication module methods. You usually want to combine the base router with other modules.

```js
import { initTRPC } from '@trpc/server'
import { createAuthenticationRouter, createDefaultAuthenticationModuleRouter, initialize } from '@universal-packages/trpc-authentication'

export const trpc = initTRPC.create()
export const appRouter = trpc.router({
  authentication: trpc.mergeRouters(createAuthenticationRouter(trpc), createDefaultAuthenticationModuleRouter(trpc))
})
```

## Typescript

This library is developed in TypeScript and shipped fully typed.

## Contributing

The development of this library happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving this library.

- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Contributing Guide](./CONTRIBUTING.md)

### License

[MIT licensed](./LICENSE).
