import { createMOEWAsync } from './createMOEWAsync';

describe('createMOEWAsync', () => {
  afterEach(() => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: null,
      },
    });
  });
  it('runs with minimal (and invalid) paramaters outside of powerchart', async () => {
    try {
      await createMOEWAsync({} as DiscernObjectFactoryReturn, 0, 0, 0, 0, 0);
    } catch (e) {
      expect(e).toBeInstanceOf(TypeError);
    }
  });

  it('throws an error if an unexpected error occurs', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          CreateMOEW: async () => {
            throw new Error('This is a test error.');
          },
        })),
      },
    });
    const dcof = await window.external.DiscernObjectFactory('POWERORDERS');
    try {
      await createMOEWAsync(dcof, 0, 0, 0, 0, 0);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e as Error).toHaveProperty('message', 'This is a test error.');
    }
  });

  it('correctly sets the moewHandle to null if executed correctly in PowerChart and 0 is retured', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          CreateMOEW: async () => Promise.resolve(0),
        })),
      },
    });
    const dcof = await window.external.DiscernObjectFactory('POWERORDERS');
    const result = await createMOEWAsync(dcof, 1, 1, 1, 1, 1);
    expect(result.moewHandle).toEqual(null);
  });

  it('correctly sets the moewHandle to the returned value if executed correctly in PowerChart and a non-zero is retured', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          CreateMOEW: async () => Promise.resolve(1337),
        })),
      },
    });
    const dcof = await window.external.DiscernObjectFactory('POWERORDERS');
    const result = await createMOEWAsync(dcof, 1, 1, 1, 1, 1);
    expect(result.moewHandle).toEqual(1337);
  });
});
