import { signOrdersAsync } from './signOrdersAsync';

describe('signOrdersAsync()', () => {
  it('runs outside of powerchart', async () => {
    try {
      await signOrdersAsync({} as DiscernObjectFactoryReturn, 1337);
    } catch (e) {
      expect(e).toBeInstanceOf(TypeError);
    }
  });

  it('runs inside of PowerChart ', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          SignOrders: async () => Promise.resolve(1),
        })),
      },
    });
    const dcof = await window.external.DiscernObjectFactory('POWERORDERS');
    const result = await signOrdersAsync(dcof, 1337);
    expect(result.inPowerChart).toEqual(true);
  });

  it('throws an error if an unexpected error occurs', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          SignOrders: async () => {
            throw new Error('This is a test error.');
          },
        })),
      },
    });
    const dcof = await window.external.DiscernObjectFactory('POWERORDERS');
    try {
      await signOrdersAsync(dcof, 1337);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e as Error).toHaveProperty('message', 'This is a test error.');
    }
  });
});
