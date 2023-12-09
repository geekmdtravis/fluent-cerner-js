import { displayMOEWAsync } from './displayMOEWAsync';

describe('displayMOEWAsync', () => {
  it('runs outside of powerchart', async () => {
    try {
      await displayMOEWAsync({} as DiscernObjectFactoryReturn, 0);
    } catch (e) {
      expect(e).toBeInstanceOf(TypeError);
    }
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
    const dcof = await window.external.DiscernObjectFactory('POWERORDERS');
    const result = await displayMOEWAsync(dcof, 1337);
    expect(result.signed).toEqual(false);
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
    const dcof = await window.external.DiscernObjectFactory('POWERORDERS');

    try {
      await displayMOEWAsync(dcof, 1337);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e as Error).toHaveProperty('message', 'This is a test error.');
    }
  });
});
