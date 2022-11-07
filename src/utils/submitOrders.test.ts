import { orderString } from './orderString';
import { submitOrders } from './submitOrders';

describe('submitOrders', () => {
  test('returns an object with a string and a boolean', () => {
    const order = orderString('launch moew');
    const { eventString, inPowerChart } = submitOrders(1, 2, [order]);
    expect(typeof eventString).toBe('string');
    expect(typeof inPowerChart).toBe('boolean');
  });
});
