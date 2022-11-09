import { MPageOrder } from '.';
import { outsideOfPowerChartError, warnOutsideOfPowerChart } from './utils';

class MPageOrderEvent {
  private _orders: Array<MPageOrder>;
  getOrders = () => this._orders;

  private _tabList: { tab: number; tabDisplayFlag: number } = {
    tab: 0,
    tabDisplayFlag: 0,
  };
  getTabList = () => this._tabList;

  private _personId: number = 0;
  getPersonId = () => this._personId;

  private _encounterId: number = 0;
  getEncounterId = () => this._encounterId;

  private _powerPlanFlag: number = 0;
  getPowerPlanFlag = () => this._powerPlanFlag;

  private _defaultDisplay: number = 0;
  getDefaultDisplay = () => this._defaultDisplay;

  private _silentSignFlag: number = 0;
  getSilentSignFlag = () => this._silentSignFlag;

  constructor() {
    this._orders = [];
    this._tabList = { tab: 0, tabDisplayFlag: 0 };
    // Disable PowerPlans by default
    this._powerPlanFlag = 0;
    // Disable PowerOrders by default
    this._tabList.tabDisplayFlag = 0;
    this.customizeOrderListProfile();
    this.launchOrderProfile();
    // Do NOT sign silently by default
    this._silentSignFlag = 0;
  }

  forPerson(id: number) {
    this._personId = id;
    return this;
  }

  forEncounter(id: number) {
    this._encounterId = id;
    return this;
  }

  addOrders(orders: Array<MPageOrder> | MPageOrder) {
    if (!Array.isArray(orders)) {
      orders = [orders];
    }
    this._orders = this._orders.concat(orders);
    return this;
  }

  enablePowerPlans() {
    this._powerPlanFlag = 24;
    return this;
  }

  customizeOrderListProfile() {
    this._tabList.tab = 2;
    return this;
  }

  customizeMedicationListProfile() {
    this._tabList.tab = 3;
    return this;
  }

  enablePowerOrders() {
    this._tabList.tabDisplayFlag = 127;
    return this;
  }

  launchOrderSearch() {
    this._defaultDisplay = 8;
    return this;
  }

  launchOrderProfile() {
    this._defaultDisplay = 16;
    return this;
  }

  launchOrdersForSignature() {
    this._defaultDisplay = 32;
    return this;
  }

  signSilently() {
    this._silentSignFlag = 1;
    return this;
  }

  send() {
    try {
      window.MPAGES_EVENT('ORDERS', this.toString());
    } catch (e) {
      if (outsideOfPowerChartError(e)) {
        warnOutsideOfPowerChart(this.toString());
      } else {
        throw e;
      }
    }
  }

  toString(): string {
    const head = `${this._personId}|${this._encounterId}|`;
    let body: string = '';
    this._orders.forEach(order => {
      body += order.toString();
    });
    const tail = `|${this._powerPlanFlag}|{${this._tabList.tab}|${this._tabList.tabDisplayFlag}}|${this._defaultDisplay}|${this._silentSignFlag}`;

    return `${head}${body}${tail}`;
  }
}

export { MPageOrderEvent };
