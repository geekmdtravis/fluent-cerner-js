import { outsideOfPowerChartError } from '../utils';

const launchViewMap = new Map()
  .set('search', 8)
  .set('profile', 16)
  .set('signature', 32);

const tabsMap = new Map<string, { tab: number; display: number }>()
  .set('orders', { tab: 2, display: 0 })
  .set('power orders', { tab: 2, display: 127 })
  .set('medications', { tab: 3, display: 0 })
  .set('power medications', { tab: 3, display: 127 });

/**
 * @action `targetTab` - (optional) Sets the tab to be displayed, with and without power orders.
 * If not provided, will default to `power orders`, that is the orders tab with power orders enabled.
 * @action `launchView` - (optional) Sets the view to be displayed.If not provided,
 * will default to `search` view.
 * @action `disablePowerPlans` - (optional) Disables power plans. Power plans are enabled by default.
 * @action `silentSign` - (optional) Signs the orders silently. Orders are not signed silently by default.
 * @action `dryRun` - (optional) If set to true, will not submit the order.
 * @documentation [MPAGES_EVENT - ORDER](https://wiki.cerner.com/display/public/MPDEVWIKI/MPAGES_EVENT+-+ORDERS)
 */
export type SubmitOrderOpts = {
  targetTab?: 'orders' | 'power orders' | 'medications' | 'power medications';
  launchView?: 'search' | 'profile' | 'signature';
  disablePowerPlans?: boolean;
  signSilently?: boolean;
  dryRun?: boolean;
};

/**
 * Submit orders for a patient in a given encounter through the Cerner PowerChart MPage Event interface.
 * By default, power plans are enabled, the target tab is set to order with power orders enabled, and
 * will launch to the signature view.
 * @param {number} personId - The identifier for the patient to whom the note belongs.
 * Cerner context variable: PAT_PersonId.
 * @param {number} encounterId - The identifier for the encounter belonging to the patient where
 * this note will be launched. Cerner context variable: VIS_EncntrId.
 * @param orders - The orders to be submitted. Orders are given in the form of an
 * Cerner MPage Order string of pipe-delimited parameters.
 * @param opts - (optional) User defined options for the order submission event.
 * @returns an object with the order `eventString` and a boolean flag set to notify the user if
 * the attempt was made outside of PowerChart, `inPowerChart`.
 *
 * @documentation [MPAGES_EVENT - ORDER](https://wiki.cerner.com/display/public/MPDEVWIKI/MPAGES_EVENT+-+ORDERS)
 */
export const submitOrders = (
  personId: number,
  encounterId: number,
  orders: Array<string>,
  opts?: SubmitOrderOpts
): { eventString: string; inPowerChart: boolean } => {
  let { targetTab, launchView, disablePowerPlans, signSilently, dryRun } =
    opts || {};
  if (!targetTab) targetTab = 'power orders';
  if (!launchView) launchView = 'signature';

  let inPowerChart = true;

  let params: Array<string> = [
    `${personId}`,
    `${encounterId}`,
    orders.join(''),
  ];

  params.push(disablePowerPlans ? '0' : '24');

  const { tab, display } = tabsMap.get(targetTab) || { tab: 2, display: 127 };
  params.push(`{${tab}|${display}}`);

  params.push(`${launchViewMap.get(launchView) || 32}`);

  params.push(`${signSilently ? '1' : '0'}`);

  const eventString = params.join('|');

  if (dryRun) return { eventString, inPowerChart: false };

  try {
    window.MPAGES_EVENT('ORDERS', eventString);
  } catch (e) {
    if (outsideOfPowerChartError(e)) {
      inPowerChart = false;
      outsideOfPowerChartError(eventString);
    } else {
      throw e;
    }
  }
  return { eventString, inPowerChart };
};
