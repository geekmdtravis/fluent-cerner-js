import { CreateMOEWReturn, createMOEWAsync } from './createMOEW';

describe('createMOEWAsync()', () => {
  it('runs with minimal (and invalid) paramaters outside of powerchart', async () => {
    const result = await createMOEWAsync(0, 0);
    const expectedObj: CreateMOEWReturn = {
      inPowerChart: false,
      moewHandle: null,
    };

    expect(result).toEqual(expectedObj);
  });


  it('throws the expected error if `customize meds` and `customize order` are both chosen', async () => {
    try {
      await createMOEWAsync(0, 0, ['customize meds', 'customize order']);
    } catch (e) {
      expect(e).toBeInstanceOf(SyntaxError);
      expect(e as SyntaxError).toHaveProperty(
        'message',
        'The MOEW must be configured to customize orders or medications, but cannot be configured to customize both.'
      );
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
    try {
      await createMOEWAsync(0, 0);
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
    const result = await createMOEWAsync(1, 1);
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
    const result = await createMOEWAsync(1, 1);
    expect(result.moewHandle).toEqual(1337);
  });
});
