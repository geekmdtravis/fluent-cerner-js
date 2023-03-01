import { warnOutsideOfPowerChart } from '../utils';
import { outsideOfPowerChartError } from '../utils/outsideOfPowerChartError';

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
 * @action `enablePowerPlans` - (optional) Enables power plans in the MOEW. Power plans are disabled by default.
 * **NOTE**: Our internal testing suggests there is a _PowerChart_ bug relating to enabling this option
 * where making MPAGES_EVENT calls, through `submitOrders`, in series with this option enabled will lead
 * to some MPAGES_EVENT calls failing to be invoked. Please keep this in mind when enabling this option.
 * @action `silentSign` - (optional) Signs the orders silently. Orders are not signed silently by default.
 *
 * @documentation [MPAGES_EVENT - ORDER](https://wiki.cerner.com/display/public/MPDEVWIKI/MPAGES_EVENT+-+ORDERS)
 */
export type SubmitOrderOpts = {
  targetTab?: 'orders' | 'power orders' | 'medications' | 'power medications';
  launchView?: 'search' | 'profile' | 'signature';
  enablePowerPlans?: boolean;
  signSilently?: boolean;
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
  let { targetTab, launchView, enablePowerPlans, signSilently } = opts || {};
  if (!targetTab) targetTab = 'power orders';
  if (!launchView) launchView = 'signature';

  let inPowerChart = true;

  let params: Array<string> = [
    `${personId}`,
    `${encounterId}`,
    orders.join(''),
  ];

  params.push(enablePowerPlans ? '24' : '0');

  const { tab, display } = tabsMap.get(targetTab) || { tab: 2, display: 127 };
  params.push(`{${tab}|${display}}`);

  params.push(`${launchViewMap.get(launchView) || 32}`);

  params.push(`${signSilently ? '1' : '0'}`);

  const eventString = params.join('|');
  try {
    window.MPAGES_EVENT('ORDERS', eventString);
  } catch (e) {
    if (outsideOfPowerChartError(e)) {
      inPowerChart = false;
      warnOutsideOfPowerChart(eventString);
    } else {
      throw e;
    }
  }
  return { eventString, inPowerChart };
};
