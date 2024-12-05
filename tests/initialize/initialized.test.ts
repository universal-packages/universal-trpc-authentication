import { initialize } from '../../src'

describe(initialize, (): void => {
  it('initializes the authentication to be used by routes', async (): Promise<void> => {
    await initialize({ dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret' })

    let error: Error

    try {
      await initialize({ dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret' })
    } catch (err) {
      error = err
    }

    expect(error.message).toEqual('Authentication already initialized')
  })
})
