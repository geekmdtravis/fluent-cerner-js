import { GetXMLReturn, getXMLOrdersMOEWAsync } from './getXMLOrdersMOEW';

describe('getXMLOrdersMOEWAsync()', () => {
  it('runs outside of powerchart', async () => {
    const result = await getXMLOrdersMOEWAsync(1337);
    const expectedObj: GetXMLReturn = {
      inPowerChart: false,
      XML: '',
    };
    expect(result).toEqual(expectedObj);
  });

  it('runs inside of PowerChart ', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          GetXMLOrdersMOEW: async () => Promise.resolve(''),
        })),
      },
    });
    const result = await getXMLOrdersMOEWAsync(1337);
    expect(result.XML).toEqual('');
  });

  it('throws an error if an unexpected error occurs', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          GetXMLOrdersMOEW: async () => {
            throw new Error('This is a test error.');
          },
        })),
      },
    });
    try {
      await getXMLOrdersMOEWAsync(1337);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e as Error).toHaveProperty('message', 'This is a test error.');
    }
  });
});
