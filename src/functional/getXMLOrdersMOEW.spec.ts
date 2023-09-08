import { GetXMLReturn, getXMLOrdersMOEWAsync } from './getXMLOrdersMOEW';

describe('getXMLOrdersMOEWAsync()', () => {
  it('runs outside of powerchart', async () => {
    const result = await getXMLOrdersMOEWAsync(1337);
    const expectedObj: GetXMLReturn = {
      inPowerChart: false,
      rawXML: '',
      ordersPlaced: [],
      parsedXML: null,
      status: 'dry run',
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
    expect(result.rawXML).toEqual('');
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

  it('returns "xml parse error" when non-valid XML is returned', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          GetXMLOrdersMOEW: async () => Promise.resolve('<xml>'),
        })),
      },
    });
    const result = await getXMLOrdersMOEWAsync(1337);
    expect(result.status).toEqual('xml parse error');
  });

  it('says "invalid data returned" when non-string data is returned', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          GetXMLOrdersMOEW: async () => Promise.resolve(5),
        })),
      },
    });
    const result = await getXMLOrdersMOEWAsync(1337);
    expect(result.status).toEqual('invalid data returned');
  });

  it('parses XML', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          GetXMLOrdersMOEW: async () =>
            Promise.resolve(`
          <?xml version="1.0"?>
          <?xml-stylesheet type='text/xml' href='dom.xsl'?>
          <Orders>
          <OrderVersion>1</OrderVersion>
          <Order id="123.00">
          <OrderableType type="int">8</OrderableType>
          <OrderId type="double">123.0000</OrderId>
          <SynonymId type="double">555.0000</SynonymId>
          <ClinCatCd type="double">666.0000</ClinCatCd>
          <CatalogTypeCd type="double">777.0000</CatalogTypeCd>
          <ActivityTypeCd type="double">888.0000</ActivityTypeCd>
          <OrderSentenceId type="double">999.0000</OrderSentenceId>
          <OrderedAsMnemonic type="string">tamsulosin</OrderedAsMnemonic>
          <ClinDisplayLine type="string">0.4 mg, Oral, Cap, Daily, Administration Type NA, Automatic Refill, Order Duration: 30 day, First Dose: 07/23/23 07:00 PDT, Stop Date: 08/22/23 06:59 PDT, 07/23/23 07:00 PDT</ClinDisplayLine>
          </Order>
          </Orders>
          `),
        })),
      },
    });
    const result = await getXMLOrdersMOEWAsync(1337);
    expect(result.ordersPlaced).toEqual([
      {
        name: 'tamsulosin',
        oid: 123,
        display:
          '0.4 mg, Oral, Cap, Daily, Administration Type NA, Automatic Refill, Order Duration: 30 day, First Dose: 07/23/23 07:00 PDT, Stop Date: 08/22/23 06:59 PDT, 07/23/23 07:00 PDT',
      },
    ]);
  });
});
