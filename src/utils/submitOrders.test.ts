import { orderString } from './orderString';
import { SubmitOrderOpts, submitOrders } from './submitOrders';

const order = orderString('launch moew');

describe('submitOrders', () => {
  test('returns an object with a string and a boolean', () => {
    const { eventString, inPowerChart } = submitOrders(1, 2, [order]);
    expect(typeof eventString).toBe('string');
    expect(typeof inPowerChart).toBe('boolean');
  });
  test('being called outside of PowerChart environment does not throw an error', () => {
    expect(() => submitOrders(1, 2, [order])).not.toThrow();
  });
  test('being called outside of PowerChart environment will return the inPowerChart flag as false', () => {
    const { inPowerChart } = submitOrders(1, 2, [order]);
    expect(inPowerChart).toBe(false);
  });
  test("effectively adds orders to the 'eventString'", () => {
    const order1 = orderString('launch moew');
    const order2 = orderString('new order', {
      newOrderOpts: { synonymId: 1 },
    });
    const { eventString } = submitOrders(1, 2, [order1, order2]);
    const foundOrdersString = eventString.includes(
      '{ORDER|0|0|0|0|0}{ORDER|1|0|0|0|0}'
    );
    expect(foundOrdersString).toBe(true);
  });
  test('`pid` and `eid` are correct in value and in location in the `eventString`', () => {
    const { eventString } = submitOrders(1, 2, [order]);
    const pidAndEidAtHead = eventString.startsWith('1|2');
    expect(pidAndEidAtHead).toBe(true);
  });
  test('setting `disablePowerPlans` to `false` updates the `eventString` properly', () => {
    const opts: SubmitOrderOpts = {
      disablePowerPlans: false,
    };
    const { eventString } = submitOrders(1, 2, [order], opts);
    const expectedString = '1|2|{ORDER|0|0|0|0|0}|24|{2|127}|8|0';
    expect(eventString).toBe(expectedString);
  });
  test('setting `disablePowerPlans` to `true` updates the `eventString` properly', () => {
    const opts: SubmitOrderOpts = {
      disablePowerPlans: true,
    };
    const { eventString } = submitOrders(1, 2, [order], opts);
    const expectedString = '1|2|{ORDER|0|0|0|0|0}|0|{2|127}|8|0';
    expect(eventString).toBe(expectedString);
  });
  test('setting `targetTab` to `orders` updates the `eventString` properly', () => {
    const opts: SubmitOrderOpts = {
      targetTab: 'orders',
    };
    const { eventString } = submitOrders(1, 2, [order], opts);
    const expectedString = '1|2|{ORDER|0|0|0|0|0}|24|{2|0}|8|0';
    expect(eventString).toBe(expectedString);
  });
  test('setting `targetTab` to `power orders` updates the `eventString` properly', () => {
    const opts: SubmitOrderOpts = {
      targetTab: 'power orders',
    };
    const { eventString } = submitOrders(1, 2, [order], opts);
    const expectedString = '1|2|{ORDER|0|0|0|0|0}|24|{2|127}|8|0';
    expect(eventString).toBe(expectedString);
  });
  test('setting the `targetTab` to `medications` updates the `eventString` properly', () => {
    const opts: SubmitOrderOpts = {
      targetTab: 'medications',
    };
    const { eventString } = submitOrders(1, 2, [order], opts);
    const expectedString = '1|2|{ORDER|0|0|0|0|0}|24|{3|0}|8|0';
    expect(eventString).toBe(expectedString);
  });
  test('setting the `targetTab` to `power medications` updates the `eventString` properly', () => {
    const opts: SubmitOrderOpts = {
      targetTab: 'power medications',
    };
    const { eventString } = submitOrders(1, 2, [order], opts);
    const expectedString = '1|2|{ORDER|0|0|0|0|0}|24|{3|127}|8|0';
    expect(eventString).toBe(expectedString);
  });
  test('setting the `launchView` to `search` updates the `eventString` properly', () => {
    const opts: SubmitOrderOpts = {
      launchView: 'search',
    };
    const { eventString } = submitOrders(1, 2, [order], opts);
    const expectedString = '1|2|{ORDER|0|0|0|0|0}|24|{2|127}|8|0';
    expect(eventString).toBe(expectedString);
  });
  test('setting the `launchView` to `profile` updates the `eventString` properly', () => {
    const opts: SubmitOrderOpts = {
      launchView: 'profile',
    };
    const { eventString } = submitOrders(1, 2, [order], opts);
    const expectedString = '1|2|{ORDER|0|0|0|0|0}|24|{2|127}|16|0';
    expect(eventString).toBe(expectedString);
  });
  test('setting the `launchView` to `signature` updates the `eventString` properly', () => {
    const opts: SubmitOrderOpts = {
      launchView: 'signature',
    };
    const { eventString } = submitOrders(1, 2, [order], opts);
    const expectedString = '1|2|{ORDER|0|0|0|0|0}|24|{2|127}|32|0';
    expect(eventString).toBe(expectedString);
  });
  test('setting `signSilently` to `false` updates the `eventString` properly', () => {
    const opts: SubmitOrderOpts = {
      signSilently: false,
    };
    const { eventString } = submitOrders(1, 2, [order], opts);
    const expectedString = '1|2|{ORDER|0|0|0|0|0}|24|{2|127}|8|0';
    expect(eventString).toBe(expectedString);
  });
  test('setting `signSilently` to `true` updates the `eventString` properly', () => {
    const opts: SubmitOrderOpts = {
      signSilently: true,
    };
    const { eventString } = submitOrders(1, 2, [order], opts);
    const expectedString = '1|2|{ORDER|0|0|0|0|0}|24|{2|127}|8|1';
    expect(eventString).toBe(expectedString);
  });
  test('not providing options properly produces default `eventString` values', () => {
    const { eventString } = submitOrders(1, 2, [order]);
    const expectedString = '1|2|{ORDER|0|0|0|0|0}|24|{2|127}|8|0';
    expect(eventString).toBe(expectedString);
  });
  test('setting `targetTab` to `power medications`, `launchView` to `signature`, `disablePowerPlans` to `true`, and `signSilently` to `true` produces the proper `eventString`', () => {
    const opts: SubmitOrderOpts = {
      targetTab: 'power medications',
      launchView: 'signature',
      disablePowerPlans: true,
      signSilently: true,
    };
    const { eventString } = submitOrders(1, 2, [order], opts);
    const expectedString = '1|2|{ORDER|0|0|0|0|0}|0|{3|127}|32|1';
    expect(eventString).toBe(expectedString);
  });
});
