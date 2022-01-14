import { MPageOrder, MPageOrderEvent } from '../src/';
import type {NewOrderOpts} from "../src/"

describe('MPageOrderEvent', () => {
  it('sets "personId" when the "forPerson" method is invoked.', () => {
    const e = new MPageOrderEvent();
    e.forPerson(1234);
    expect(e.getPersonId()).toBe(1234);
  });
  it('sets "encounterId" when the "forEncounter" method is invoked.', () => {
    const e = new MPageOrderEvent();
    e.forEncounter(1234);
    expect(e.getEncounterId()).toBe(1234);
  });
  it('effectively adds orders to "orders" when the "addOrders" meth od is invoked.', () => {
    const order1 = new MPageOrder().willCopyExistingOrder(1234);
    const order2 = new MPageOrder().willCopyExistingOrder(4321);
    const e = new MPageOrderEvent().addOrders([order1, order2]);
    expect(e.getOrders().length).toBe(2);
    expect(e.getOrders().map(o => o.getOrderId())[0]).toBe(1234);
    expect(e.getOrders().map(o => o.getOrderId())[1]).toBe(4321);
  });
  it('sets "powerPlanFlag" to "0" when the "enablePowerPlan" by default.', () => {
    const e = new MPageOrderEvent();
    expect(e.getPowerPlanFlag()).toBe(0);
  });
  it('sets "powerPlanFlag" to "24" when the "enablePowerPlan method is invoked.', () => {
    const e = new MPageOrderEvent();
    e.enablePowerPlans();
    expect(e.getPowerPlanFlag()).toBe(24);
  });
  it('sets the "tabList.tab" to "2" by default to customize the order list profile by default.', () => {
    const e = new MPageOrderEvent();
    expect(e.getTabList().tab).toBe(2);
  });
  it('sets the "tabList.tab" to "2" when "customizeOrderListProfile" method is invoked.', () => {
    const e = new MPageOrderEvent();
    e.customizeOrderListProfile();
    expect(e.getTabList().tab).toBe(2);
  });
  it('sets the "tabList.tab" to "3" when the "customizeMedicationListProfile" method is invoked.', () => {
    const e = new MPageOrderEvent();
    e.customizeMedicationListProfile();
    expect(e.getTabList().tab).toBe(3);
  });
  it('sets the "tabList.tabDisplayFlag" to "0" by default meaning power orders are not enabled.', () => {
    const e = new MPageOrderEvent();
    expect(e.getTabList().tabDisplayFlag).toBe(0);
  });
  it('sets the "tabList.tabDisplayFlag" to "127" when the "enablePowerOrders" method is invoked.', () => {
    const e = new MPageOrderEvent();
    e.enablePowerOrders();
    expect(e.getTabList().tabDisplayFlag).toBe(127);
  });
  it('sets "defaultDisplay" flag to "16" by default to launch the order profile.', () => {
    const e = new MPageOrderEvent();
    expect(e.getDefaultDisplay()).toBe(16);
  });
  it('sets "defaultDisplay" flag to "8" when the "launchOrderSearch" method is invoked.', () => {
    const e = new MPageOrderEvent();
    e.launchOrderSearch();
    expect(e.getDefaultDisplay()).toBe(8);
  });
  it('sets "defaultDisplay" flag to "16" when the "launchOrderProfile" method is invoked.', () => {
    const e = new MPageOrderEvent();
    e.launchOrderProfile();
    expect(e.getDefaultDisplay()).toBe(16);
  });
  it('sets "defaultDisplay" flag to "32" when the "launchOrdersForSignature" method is invoked.', () => {
    const e = new MPageOrderEvent();
    e.launchOrdersForSignature();
    expect(e.getDefaultDisplay()).toBe(32);
  });
  it('sets "silentSignFlag" to 0 by default.', () => {
    const e = new MPageOrderEvent();
    expect(e.getSilentSignFlag()).toBe(0);
  });
  it('sets "silentSignFlag" to 1 when the "signSilently" method is invoked.', () => {
    const e = new MPageOrderEvent();
    e.signSilently();
    expect(e.getSilentSignFlag()).toBe(1);
  });

  it('has a properly constructed toString override.', () => {
    const opts: NewOrderOpts = {
      isRxOrder: true,
      isSatelliteOrder: false,
      orderSentenceId: 4321,
      nomenclatureId: 5678,
      skipInteractionCheckUntilSign: true
    }
    const plannedOrder = new MPageOrder()
    plannedOrder.willMakeNewOrder(1234, opts)

    const plannedEvent = new MPageOrderEvent()
    
    plannedEvent.forPerson(2468)
      .forEncounter(1357)
      .addOrders(plannedOrder)
      .enablePowerPlans()
      .customizeOrderListProfile()
      .enablePowerOrders()
      .launchOrderProfile()
      .signSilently();

    expect(plannedEvent.toString()).toBe(
      '2468|1357|{ORDER|1234|1|4321|5678|1}|24|{2|127}|16|1'
    );
  });
});
