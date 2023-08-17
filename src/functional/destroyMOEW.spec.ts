import { DestroyMOEWReturn, destroyMOEWAsync } from './destroyMOEW';

describe('destroyMOEWAsync()', () => {
  it('runs outside of powerchart', async () => {
    const result = await destroyMOEWAsync(1337);
    const expectedObj: DestroyMOEWReturn = {
      inPowerChart: false,
      retVal: null,
    };
    expect(result).toEqual(expectedObj);
  });

  it('runs inside of PowerChart ', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          DestroyMOEW: async () => Promise.resolve(null),
        })),
      },
    });
    const result = await destroyMOEWAsync(1337);
    expect(result.retVal).toEqual(null);
    expect(result.inPowerChart).toEqual(true);
  });

  it('throws an error if an unexpected error occurs', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          DestroyMOEW: async () => {
            throw new Error('This is a test error.');
          },
        })),
      },
    });
    try {
      await destroyMOEWAsync(1337);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e as Error).toHaveProperty('message', 'This is a test error.');
    }
  });
});
