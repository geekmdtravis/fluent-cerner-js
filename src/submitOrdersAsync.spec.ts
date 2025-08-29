import {
  Order,
  SubmitOrderAsyncOpts,
  submitOrdersAsync,
} from './submitOrdersAsync';

const order: Order = {
  id: 1,
  action: 'new order',
};

describe('submitOrders', () => {
  afterEach(() => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: { MPAGES_EVENT: null },
    });
  });
  test('returns an object with a string and a boolean', async () => {
    const { eventString, inPowerChart } = await submitOrdersAsync(1, 2, [
      order,
    ]);
    expect(typeof eventString).toBe('string');
    expect(typeof inPowerChart).toBe('boolean');
  });
  test('being called outside of PowerChart environment does not throw an error', async () => {
    expect(() => submitOrdersAsync(1, 2, [order])).not.toThrow();
  });
  test('being called outside of PowerChart environment will return the inPowerChart flag as false', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        MPAGES_EVENT: undefined,
      },
    });
    const { inPowerChart } = await submitOrdersAsync(1, 2, [order]);
    expect(inPowerChart).toBe(false);
  });
  test("effectively adds orders to the 'eventString'", async () => {
    const order1: Order = { action: 'new order', id: 11 };
    const order2: Order = { action: 'new order', id: 22 };
    const { eventString } = await submitOrdersAsync(1, 2, [order1, order2]);
    const foundOrdersString = eventString.includes(
      '{ORDER|11|0|0|0|0}{ORDER|22|0|0|0|0}'
    );
    expect(foundOrdersString).toBe(true);
  });
  test('`pid` and `eid` are correct in value and in location in the `eventString`', async () => {
    const { eventString } = await submitOrdersAsync(1, 2, [order]);
    const pidAndEidAtHead = eventString.startsWith('1|2');
    expect(pidAndEidAtHead).toBe(true);
  });
  test('setting `targetTab` to `power orders` updates the `eventString` to include the _PowerPlans_ flag `24` and _PowerOrders_ flag `127` and sets the target tab to `2`.', async () => {
    const opts: SubmitOrderAsyncOpts = {
      targetTab: 'power orders',
    };
    const { eventString } = await submitOrdersAsync(1, 2, [order], opts);
    const expectedString = '1|2|{ORDER|1|0|0|0|0}|24|{2|127}|32|0';
    expect(eventString).toBe(expectedString);
  });
  test('setting `targetTab` to `power medications` updates the `eventString` to include the _PowerPlans_ flag `24` and _PowerOrders_ flag `127` and sets the target tab to `3`.', async () => {
    const opts: SubmitOrderAsyncOpts = {
      targetTab: 'power medications',
    };
    const { eventString } = await submitOrdersAsync(1, 2, [order], opts);
    const expectedString = '1|2|{ORDER|1|0|0|0|0}|24|{3|127}|32|0';
    expect(eventString).toBe(expectedString);
  });

  test('setting `targetTab` to `orders` updates the `eventString` properly to a target tab of `2` with both _PowerOrders_ and _PowerPlans_ disabled.', async () => {
    const opts: SubmitOrderAsyncOpts = {
      targetTab: 'orders',
    };
    const { eventString } = await submitOrdersAsync(1, 2, [order], opts);
    const expectedString = '1|2|{ORDER|1|0|0|0|0}|0|{2|0}|32|0';
    expect(eventString).toBe(expectedString);
  });

  test('setting `targetTab` to `medications` updates the `eventString` properly to a target tab of `3` with both _PowerOrders_ and _PowerPlans_ disabled.', async () => {
    const opts: SubmitOrderAsyncOpts = {
      targetTab: 'medications',
    };
    const { eventString } = await submitOrdersAsync(1, 2, [order], opts);
    const expectedString = '1|2|{ORDER|1|0|0|0|0}|0|{3|0}|32|0';
    expect(eventString).toBe(expectedString);
  });

  test('setting the `launchView` to `search` updates the `eventString` to include the proper flag `8`', async () => {
    const opts: SubmitOrderAsyncOpts = {
      launchView: 'search',
    };
    const { eventString } = await submitOrdersAsync(1, 2, [order], opts);
    const expectedString = '1|2|{ORDER|1|0|0|0|0}|0|{2|0}|8|0';
    expect(eventString).toBe(expectedString);
  });
  test('setting the `launchView` to `profile` updates the `eventString` properly to include the proper flag `16`', async () => {
    const opts: SubmitOrderAsyncOpts = {
      launchView: 'profile',
    };
    const { eventString } = await submitOrdersAsync(1, 2, [order], opts);
    const expectedString = '1|2|{ORDER|1|0|0|0|0}|0|{2|0}|16|0';
    expect(eventString).toBe(expectedString);
  });
  test('setting the `launchView` to `signature` updates the `eventString` properly to include the proper flag `32`', async () => {
    const opts: SubmitOrderAsyncOpts = {
      launchView: 'signature',
    };
    const { eventString } = await submitOrdersAsync(1, 2, [order], opts);
    const expectedString = '1|2|{ORDER|1|0|0|0|0}|0|{2|0}|32|0';
    expect(eventString).toBe(expectedString);
  });
  test('setting `signSilently` to `false` updates the `eventString` properly to end the string with a `0` flag', async () => {
    const opts: SubmitOrderAsyncOpts = {
      signSilently: false,
    };
    const { eventString } = await submitOrdersAsync(1, 2, [order], opts);
    const expectedString = '1|2|{ORDER|1|0|0|0|0}|0|{2|0}|32|0';
    expect(eventString).toBe(expectedString);
  });
  test('setting `signSilently` to `true` updates the `eventString` properly to end the string with a `1` flag', async () => {
    const opts: SubmitOrderAsyncOpts = {
      signSilently: true,
    };
    const { eventString } = await submitOrdersAsync(1, 2, [order], opts);
    const expectedString = '1|2|{ORDER|1|0|0|0|0}|0|{2|0}|32|1';
    expect(eventString).toBe(expectedString);
  });
  test('not providing options properly produces default `eventString` values with disabled _PowerPlans_, disabled _PowerOrders_, target tab of orders tab `2`, and showing orders for signature `32`', async () => {
    const { eventString } = await submitOrdersAsync(1, 2, [order]);
    const expectedString = '1|2|{ORDER|1|0|0|0|0}|0|{2|0}|32|0';
    expect(eventString).toBe(expectedString);
  });
  test('setting `targetTab` to `power medications`, `launchView` to `signature`, and `signSilently` to `true` produces the proper `eventString`', async () => {
    const opts: SubmitOrderAsyncOpts = {
      targetTab: 'power medications',
      launchView: 'signature',
      signSilently: true,
    };
    const { eventString } = await submitOrdersAsync(1, 2, [order], opts);
    const expectedString = '1|2|{ORDER|1|0|0|0|0}|24|{3|127}|32|1';
    expect(eventString).toBe(expectedString);
  });
  test('produces valid eventString when dryRun is true', async () => {
    const opts: SubmitOrderAsyncOpts = {
      dryRun: true,
    };
    const { eventString } = await submitOrdersAsync(1, 2, [order], opts);
    const expectedString = '1|2|{ORDER|1|0|0|0|0}|0|{2|0}|32|0';
    expect(eventString).toBe(expectedString);
  });
  test('orderId, status, and response are successfully parsed from the response text with a single order', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        MPAGES_EVENT: jest
          .fn()
          .mockImplementation(async function(
            a: string,
            b: string
          ): Promise<string> {
            console.debug(`a: ${a}, b: ${b}`);
            return new Promise(resolve =>
              resolve(`<?xml version="1.0"?>
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
              </Orders>`)
            );
          }),
      },
    });

    const {
      ordersPlaced: orderIds,
      status,
      response,
    } = await submitOrdersAsync(1, 2, [order]);
    expect(orderIds).not.toBeNull();
    expect(orderIds).toStrictEqual([
      {
        name: 'tamsulosin',
        oid: 123,
        display:
          '0.4 mg, Oral, Cap, Daily, Administration Type NA, Automatic Refill, Order Duration: 30 day, First Dose: 07/23/23 07:00 PDT, Stop Date: 08/22/23 06:59 PDT, 07/23/23 07:00 PDT',
      },
    ]);
    expect(status).toBe('success');
    expect(response).not.toBeNull();
    expect(response).toBeInstanceOf(Object);
  });
  test('orderId, status, and response are successfully parsed from the response text with more than one orders', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        MPAGES_EVENT: jest
          .fn()
          .mockImplementation(async function(
            a: string,
            b: string
          ): Promise<string> {
            console.debug(`a: ${a}, b: ${b}`);
            return new Promise(resolve =>
              resolve(`<?xml version="1.0"?>
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
              <Order id="1234.00">
              <OrderableType type="int">8</OrderableType>
              <OrderId type="double">1234.0000</OrderId>
              <SynonymId type="double">555.0000</SynonymId>
              <ClinCatCd type="double">666.0000</ClinCatCd>
              <CatalogTypeCd type="double">777.0000</CatalogTypeCd>
              <ActivityTypeCd type="double">888.0000</ActivityTypeCd>
              <OrderSentenceId type="double">999.0000</OrderSentenceId>
              <OrderedAsMnemonic type="string">tamsulosin</OrderedAsMnemonic>
              <ClinDisplayLine type="string">0.4 mg, Oral, Cap, Daily, Administration Type NA, Automatic Refill, Order Duration: 30 day, First Dose: 07/23/23 07:00 PDT, Stop Date: 08/22/23 06:59 PDT, 07/23/23 07:00 PDT</ClinDisplayLine>
              </Order>
              </Orders>`)
            );
          }),
      },
    });

    const {
      ordersPlaced: orderIds,
      status,
      response,
    } = await submitOrdersAsync(1, 2, [order]);
    expect(orderIds).not.toBeNull();
    expect(orderIds).toStrictEqual([
      {
        name: 'tamsulosin',
        oid: 123,
        display:
          '0.4 mg, Oral, Cap, Daily, Administration Type NA, Automatic Refill, Order Duration: 30 day, First Dose: 07/23/23 07:00 PDT, Stop Date: 08/22/23 06:59 PDT, 07/23/23 07:00 PDT',
      },
      {
        name: 'tamsulosin',
        oid: 1234,
        display:
          '0.4 mg, Oral, Cap, Daily, Administration Type NA, Automatic Refill, Order Duration: 30 day, First Dose: 07/23/23 07:00 PDT, Stop Date: 08/22/23 06:59 PDT, 07/23/23 07:00 PDT',
      },
    ]);
    expect(status).toBe('success');
    expect(response).not.toBeNull();
    expect(response).toBeInstanceOf(Object);
  });
  test('returns status "invalid data returned" when there is no response', async () => {
    const { status } = await submitOrdersAsync(1, 2, [order]);

    expect(status).toBe('invalid data returned');
  });
  test('returns status "invalid data returned" when the response is not a string', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        MPAGE_EVENT: jest
          .fn()
          .mockImplementation(async function(
            a: string,
            b: string
          ): Promise<Object> {
            console.debug(`a: ${a}, b: ${b}`);
            return new Promise(resolve => resolve({}));
          }),
      },
    });
    const { status } = await submitOrdersAsync(1, 2, [order]);

    expect(status).toBe('invalid data returned');
  });
  test('returns "cancelled" when an empty string is returned', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        MPAGES_EVENT: jest
          .fn()
          .mockImplementation(async function(
            a: string,
            b: string
          ): Promise<string> {
            console.debug(`a: ${a}, b: ${b}`);
            return new Promise(resolve => resolve(''));
          }),
      },
    });
    const { status } = await submitOrdersAsync(1, 2, [order]);

    expect(status).toBe('cancelled');
  });
  test('returns "xml parse error" when an string that is not a valid XML string is returned', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        MPAGES_EVENT: jest
          .fn()
          .mockImplementation(async function(
            a: string,
            b: string
          ): Promise<string> {
            console.debug(`a: ${a}, b: ${b}`);
            return new Promise(resolve => resolve('<xml>'));
          }),
      },
    });
    const { status } = await submitOrdersAsync(1, 2, [order]);

    expect(status).toBe('xml parse error');
  });
  test('returns "failed" when a null response is returned', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        MPAGES_EVENT: jest
          .fn()
          .mockImplementation(async function(
            a: string,
            b: string
          ): Promise<null> {
            console.debug(`a: ${a}, b: ${b}`);
            return new Promise(resolve => resolve(null));
          }),
      },
    });
    const { status } = await submitOrdersAsync(1, 2, [order]);

    expect(status).toBe('failed');
  });

  test('throws an error when the error type is not one expected to be generated as an "out-of-powerchart" error.', async () => {
    Object.defineProperty(window.external, 'MPAGES_EVENT', {
      writable: true,
      value: jest
        .fn()
        .mockImplementation(async function(
          a: string,
          b: string
        ): Promise<Error> {
          console.debug(`a: ${a}, b: ${b}`);
          return Promise.reject(new Error('unexpected error'));
        }),
    });

    try {
      await submitOrdersAsync(1, 2, [order]);
    } catch (e) {
      expect((e as Error).message).toBe('unexpected error');
    }
  });

  test('successfully updates targetTab and display when provided as options', async () => {
    const opts: SubmitOrderAsyncOpts = {
      targetTab: 'power medications',
    };
    const { eventString } = await submitOrdersAsync(1, 2, [order], opts);
    const expectedString = '1|2|{ORDER|1|0|0|0|0}|24|{3|127}|32|0';
    expect(eventString).toBe(expectedString);
  });
});
