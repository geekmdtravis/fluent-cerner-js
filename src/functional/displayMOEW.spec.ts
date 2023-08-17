import { DisplayMOEWReturn, displayMOEWAsync } from './displayMOEW';

describe('displayMOEWAsync()', () => {
  it('runs outside of powerchart', async () => {
    const result = await displayMOEWAsync(1337);
    const expectedObj: DisplayMOEWReturn = {
      inPowerChart: false,
      retval: 0,
    };
    expect(result).toEqual(expectedObj);
  });

  it('runs inside of PowerChart ', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          DisplayMOEW: async () => Promise.resolve(0),
        })),
      },
    });
    const result = await displayMOEWAsync(1337);
    expect(result.retval).toEqual(0);
  });

  it('throws an error if an unexpected error occurs', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          DisplayMOEW: async () => {
            throw new Error('This is a test error.');
          },
        })),
      },
    });
    try {
      await displayMOEWAsync(1337);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e as Error).toHaveProperty('message', 'This is a test error.');
    }
  });
});
