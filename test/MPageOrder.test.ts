import { MPageOrder, NewOrderOpts } from '../src/';

describe('MPageOrder', () => {
  // Check orderAction
  it('sets "orderAction" to "ACTIVATE" when the "willActivate" method is called.', () => {
    const o = new MPageOrder();
    o.willActivate(0);
    expect(o.getOrderAction()).toBe('ACTIVATE');
  });
  it('sets "orderAction" to "CANCEL DC" when the "willCancelDiscontinue" method is called.', () => {
    const o = new MPageOrder();
    o.willCancelDiscontinue(0);
    expect(o.getOrderAction()).toBe('CANCEL DC');
  });
  it('sets "orderAction" to "CANCEL REORD" when the "willCancelReorder" method is called.', () => {
    const o = new MPageOrder();
    o.willCancelReorder(0);
    expect(o.getOrderAction()).toBe('CANCEL REORD');
  });
  it('sets "orderAction" to "CLEAR" when the "willClear" method is called.', () => {
    const o = new MPageOrder();
    o.willClear(0);
    expect(o.getOrderAction()).toBe('CLEAR');
  });
  it('sets "orderAction" to "CONVERT_INPAT" when the "willConvertInpatient" method is called.', () => {
    const o = new MPageOrder();
    o.willConvertInpatient(0);
    expect(o.getOrderAction()).toBe('CONVERT_INPAT');
  });
  it('sets "orderAction" to "CONVERT_RX" when the "willConvertToPrescriptionOrder" method is called.', () => {
    const o = new MPageOrder();
    o.willConvertToPrescriptionOrder(0);
    expect(o.getOrderAction()).toBe('CONVERT_RX');
  });
  it('sets "orderAction" to "MODIFY" when the "willModify" method is called.', () => {
    const o = new MPageOrder();
    o.willModify(0);
    expect(o.getOrderAction()).toBe('MODIFY');
  });
  it('sets "orderAction" to "ORDER" when the "willMakeNewOrder" method is called.', () => {
    const o = new MPageOrder();
    o.willMakeNewOrder(0);
    expect(o.getOrderAction()).toBe('ORDER');
  });
  it('sets "orderAction" to "RENEW" when the "willRenewNonPrescription" method is called.', () => {
    const o = new MPageOrder();
    o.willRenewNonPrescription(0);
    expect(o.getOrderAction()).toBe('RENEW');
  });
  it('sets "orderAction" to "RENEW_RX" when the "willRenewPrescription" method is called.', () => {
    const o = new MPageOrder();
    o.willRenewPrescription(0);
    expect(o.getOrderAction()).toBe('RENEW_RX');
  });
  it('sets "orderAction" to "REPEAT" when the "willCopyExistingOrder" method is called.', () => {
    const o = new MPageOrder();
    o.willCopyExistingOrder(0);
    expect(o.getOrderAction()).toBe('REPEAT');
  });
  it('sets "orderAction" to "RESUME" when the "willResumeSuspendedOrder" method is called.', () => {
    const o = new MPageOrder();
    o.willResumeSuspendedOrder(0);
    expect(o.getOrderAction()).toBe('RESUME');
  });
  it('sets "orderAction" to "SUSPEND" when the "willSuspend" method is called.', () => {
    const o = new MPageOrder();
    o.willSuspend(0);
    expect(o.getOrderAction()).toBe('SUSPEND');
  });
  // Check orderId
  it('"willActivate" sets "orderId" properly.', () => {
    const o = new MPageOrder();
    o.willActivate(1234);
    expect(o.getOrderId()).toBe(1234);
  });
  it('"willCancelDiscontinue" sets "orderId" properly.', () => {
    const o = new MPageOrder();
    o.willCancelDiscontinue(1234);
    expect(o.getOrderId()).toBe(1234);
  });
  it('"willCancelReorder" sets "orderId" properly.', () => {
    const o = new MPageOrder();
    o.willCancelReorder(1234);
    expect(o.getOrderId()).toBe(1234);
  });
  it('"willClear" sets "orderId" properly.', () => {
    const o = new MPageOrder();
    o.willClear(1234);
    expect(o.getOrderId()).toBe(1234);
  });
  it('"willConvertInpatient" sets "orderId" properly.', () => {
    const o = new MPageOrder();
    o.willConvertInpatient(1234);
    expect(o.getOrderId()).toBe(1234);
  });
  it('"willConvertToPrescriptionOrder" sets "orderId" properly.', () => {
    const o = new MPageOrder();
    o.willConvertToPrescriptionOrder(1234);
    expect(o.getOrderId()).toBe(1234);
  });
  it('"willModify" sets "orderId" properly.', () => {
    const o = new MPageOrder();
    o.willModify(1234);
    expect(o.getOrderId()).toBe(1234);
  });
  it('"willRenewNonPrescription" sets "orderId" properly.', () => {
    const o = new MPageOrder();
    o.willRenewNonPrescription(1234);
    expect(o.getOrderId()).toBe(1234);
  });
  it('"willRenewPrescription" sets "orderId" properly.', () => {
    const o = new MPageOrder();
    o.willRenewPrescription(1234);
    expect(o.getOrderId()).toBe(1234);
  });
  it('"willCopyExistingOrder" sets "orderId" properly.', () => {
    const o = new MPageOrder();
    o.willCopyExistingOrder(1234);
    expect(o.getOrderId()).toBe(1234);
  });
  it('"willResumeSuspendedOrder" sets "orderId" properly.', () => {
    const o = new MPageOrder();
    o.willResumeSuspendedOrder(1234);
    expect(o.getOrderId()).toBe(1234);
  });
  it('"willSuspend" sets "orderId" properly.', () => {
    const o = new MPageOrder();
    o.willSuspend(1234);
    expect(o.getOrderId()).toBe(1234);
  });

  it('"willMakeNewOrder" sets "all properties" appropriately and generates the correct string.', () => {
    const opts: NewOrderOpts = {
      isRxOrder: true,
      orderSentenceId: 4321,
      nomenclatureId: 5678,
      skipInteractionCheckUntilSign: true,
    };
    const o = new MPageOrder();
    o.willMakeNewOrder(1234, opts);
    const expected = `{ORDER|1234|1|4321|5678|1}`;
    expect(o.toString()).toBe(expected);
  });

  it('"willMakeNewOrder" throw error when both isRxOrder and isSatelliteOrder are set to true.', () => {
    const opts: NewOrderOpts = {
      isRxOrder: true,
      isSatelliteOrder: true,
      orderSentenceId: 4321,
      nomenclatureId: 5678,
      skipInteractionCheckUntilSign: true,
    };
    const o = new MPageOrder();
    expect(() => o.willMakeNewOrder(1234, opts)).toThrow(Error);
  });

  it('"willMakeNewOrder" sets the order origination field to 0 when neither isRxOrder or isSatelliteOrder is set to true', () => {
    const o = new MPageOrder();
    o.willMakeNewOrder(1234);
    const expected = `{ORDER|1234|0|0|0|0}`;
    expect(o.toString()).toBe(expected);
  });

  it('"willMakeNewOrder" sets the order origination field to 1 when isRxOrder is set to true', () => {
    const opts: NewOrderOpts = {
      isRxOrder: true,
    };
    const o = new MPageOrder();
    o.willMakeNewOrder(1234, opts);
    const expected = `{ORDER|1234|1|0|0|0}`;
    expect(o.toString()).toBe(expected);
  });

  it('"willMakeNewOrder" sets the order origination field to 5 when isSatelliteOrder is set to true', () => {
    const opts: NewOrderOpts = {
      isSatelliteOrder: true,
    };
    const o = new MPageOrder();
    o.willMakeNewOrder(1234, opts);
    const expected = `{ORDER|1234|5|0|0|0}`;
    expect(o.toString()).toBe(expected);
  });

  it('"toString" generates a proper string for ORDER type', () => {
    const opts: NewOrderOpts = {
      isSatelliteOrder: true,
    };
    const o = new MPageOrder();
    o.willMakeNewOrder(1234, opts);
    const expected = `{ORDER|1234|5|0|0|0}`;
    expect(o.toString()).toBe(expected);
  });

  it('"toString" generates a proper string for non-ORDER type', () => {
    const o = new MPageOrder();
    o.willRenewPrescription(12345);
    expect(o.toString()).toBe('{RENEW_RX|12345}');
  });
});
