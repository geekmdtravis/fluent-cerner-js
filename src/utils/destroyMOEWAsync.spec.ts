import { destroyMOEWAsync } from './destroyMOEWAsync';

describe('destroyMOEWAsync', () => {
  it('runs outside of powerchart', async () => {
    try {
      await destroyMOEWAsync({} as DiscernObjectFactoryReturn, 0);
    } catch (e) {
      expect(e).toBeInstanceOf(TypeError);
    }
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
    const dcof = await window.external.DiscernObjectFactory('POWERORDERS');
    const result = await destroyMOEWAsync(dcof, 1337);
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
    const dcof = await window.external.DiscernObjectFactory('POWERORDERS');
    try {
      await destroyMOEWAsync(dcof, 1337);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e as Error).toHaveProperty('message', 'This is a test error.');
    }
  });
});
