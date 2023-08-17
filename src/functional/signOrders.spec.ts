import { SignOrdersReturn, signOrdersAsync } from './signOrders';

describe('signOrdersAsync()', () => {
  it('runs outside of powerchart', async () => {
    const result = await signOrdersAsync(1337);
    const expectedObj: SignOrdersReturn = {
      inPowerChart: false,
      retval: 1,
    };
    expect(result).toEqual(expectedObj);
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
    const result = await signOrdersAsync(1337);
    expect(result.retval).toEqual(1);
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
    try {
      await signOrdersAsync(1337);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e as Error).toHaveProperty('message', 'This is a test error.');
    }
  });
});
