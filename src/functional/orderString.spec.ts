import { orderString } from './orderString';

describe('makeOrderString', () => {
  test('should return a string', () => {
    const result = orderString('new order', {
      newOrderOpts: { synonymId: 1 },
    });
    expect(typeof result).toBe('string');
  });
  test("'launch moew' returns `{ORDER|0|0|0|0|0}`", () => {
    const result = orderString('launch moew');
    expect(result).toBe('{ORDER|0|0|0|0|0}');
  });
  test("'new order' without a `synonymId` throws an error", () => {
    expect(() => orderString('new order')).toThrow();
  });
  test("'new order' with `synonymId` of `1` returns `{ORDER|1|0|0|0|0}`", () => {
    const result = orderString('new order', {
      newOrderOpts: { synonymId: 1 },
    });
    expect(result).toBe('{ORDER|1|0|0|0|0}');
  });
  test("'new order' with a `origination` of `satellite` return `{ORDER|1|5|0|0|0}`", () => {
    const result = orderString('new order', {
      newOrderOpts: { synonymId: 1, origination: 'satellite' },
    });
    expect(result).toBe('{ORDER|1|5|0|0|0}');
  });
  test("'new order' with a `origination` of `prescription` returns `{ORDER|1|1|0|0|0}`", () => {
    const result = orderString('new order', {
      newOrderOpts: { synonymId: 1, origination: 'prescription' },
    });
    expect(result).toBe('{ORDER|1|1|0|0|0}');
  });
  test("'new order' with a `origination` of `normal` return `{ORDER|1|0|0|0|0}`", () => {
    const result = orderString('new order', {
      newOrderOpts: { synonymId: 1, origination: 'normal' },
    });
    expect(result).toBe('{ORDER|1|0|0|0|0}');
  });
  test("'new order' with an `orderSentenceId` of `2` returns `{ORDER|1|0|2|0|0}`", () => {
    const result = orderString('new order', {
      newOrderOpts: { synonymId: 1, orderSentenceId: 2 },
    });
    expect(result).toBe('{ORDER|1|0|2|0|0}');
  });
  test("'new order' with 'nomenclatureIds' of `3` returns `{ORDER|1|0|0|3|0}`", () => {
    const result = orderString('new order', {
      newOrderOpts: { synonymId: 1, nomenclatureIds: [3] },
    });
    expect(result).toBe('{ORDER|1|0|0|3|0}');
  });
  test("'new order' with 'nomenclatureIds' of `3` and `4` returns `{ORDER|1|0|0|[3|4]|0}`", () => {
    const result = orderString('new order', {
      newOrderOpts: { synonymId: 1, nomenclatureIds: [3, 4] },
    });
    expect(result).toBe('{ORDER|1|0|0|[3|4]|0}');
  });
  test("'new order' with an `interaction` of `on sign` returns `{ORDER|1|0|0|0|1}`", () => {
    const result = orderString('new order', {
      newOrderOpts: { synonymId: 1, interactionCheck: 'on sign' },
    });
    expect(result).toBe('{ORDER|1|0|0|0|1}');
  });
  test("'new order' with an `interaction` of `default` returns `{ORDER|1|0|0|0|0}`", () => {
    const result = orderString('new order', {
      newOrderOpts: { synonymId: 1, interactionCheck: 'default' },
    });
    expect(result).toBe('{ORDER|1|0|0|0|0}');
  });
  test("action types other than 'new order' and 'launch moew' will throw an error if no `orderId` is provied", () => {
    expect(() => orderString('activate existing')).toThrow();
    expect(() => orderString('cancel-discontinue')).toThrow();
    expect(() => orderString('cancel-reorder')).toThrow();
    expect(() => orderString('clear actions')).toThrow();
    expect(() => orderString('convert inpatient')).toThrow();
    expect(() => orderString('convert prescription')).toThrow();
    expect(() => orderString('modify')).toThrow();
    expect(() => orderString('renew')).toThrow();
    expect(() => orderString('renew prescription')).toThrow();
    expect(() => orderString('copy existing')).toThrow();
    expect(() => orderString('resume')).toThrow();
    expect(() => orderString('suspend')).toThrow();
  });
  test("'activate existing' with `orderId` of `1` returns `{ACTIVATE|1}`", () => {
    const result = orderString('activate existing', { orderId: 1 });
    expect(result).toBe('{ACTIVATE|1}');
  });
  test("'cancel-discontinue' with an `orderId` of `1` returns `{CANCEL DC|1}`", () => {
    const result = orderString('cancel-discontinue', { orderId: 1 });
    expect(result).toBe('{CANCEL DC|1}');
  });
  test("'cancel-reorder' with an `orderId` of `1` returns `{CANCEL REORD|1}`", () => {
    const result = orderString('cancel-reorder', { orderId: 1 });
    expect(result).toBe('{CANCEL REORD|1}');
  });
  test("'clear actions' with an `orderId` of `1` returns `{CLEAR|1}`", () => {
    const result = orderString('clear actions', { orderId: 1 });
    expect(result).toBe('{CLEAR|1}');
  });
  test("'convert inpatient' with an `orderId` of `1` returns `{CONVERT_INPAT|1}`", () => {
    const result = orderString('convert inpatient', { orderId: 1 });
    expect(result).toBe('{CONVERT_INPAT|1}');
  });
  test("'convert prescription' with an `orderId` of `1` returns `{CONVERT_RX|1}`", () => {
    const result = orderString('convert prescription', { orderId: 1 });
    expect(result).toBe('{CONVERT_RX|1}');
  });
  test("'modify' with an `orderId` of `1` returns `{MODIFY|1}`", () => {
    const result = orderString('modify', { orderId: 1 });
    expect(result).toBe('{MODIFY|1}');
  });
  test("'renew' with an `orderId` of `1` returns `{RENEW|1}`", () => {
    const result = orderString('renew', { orderId: 1 });
    expect(result).toBe('{RENEW|1}');
  });
  test("'renew prescription' with an `orderId` of `1` returns `{RENEW_RX|1}`", () => {
    const result = orderString('renew prescription', { orderId: 1 });
    expect(result).toBe('{RENEW_RX|1}');
  });
  test("'copy existing' with an `orderId` of `1` returns `{REPEAT|1}`", () => {
    const result = orderString('copy existing', { orderId: 1 });
    expect(result).toBe('{REPEAT|1}');
  });
  test("'resume' with an `orderId` of `1` returns `{RESUME|1}`", () => {
    const result = orderString('resume', { orderId: 1 });
    expect(result).toBe('{RESUME|1}');
  });
  test("'suspend' with an `orderId` of `1` returns `{SUSPEND|1}`", () => {
    const result = orderString('suspend', { orderId: 1 });
    expect(result).toBe('{SUSPEND|1}');
  });
  test("'new order' with a `synonymId` of `1`, `origination` of `prescription`, `orderSentenceId` of `2`, `nomenclatureId` of `3`, and interaction of `skip` returns `{ORDER|1|1|2|3|1`", () => {
    const result = orderString('new order', {
      newOrderOpts: {
        synonymId: 1,
        origination: 'prescription',
        orderSentenceId: 2,
        nomenclatureIds: [3],
        interactionCheck: 'on sign',
      },
    });
    expect(result).toBe('{ORDER|1|1|2|3|1}');
  });
});
