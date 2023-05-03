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
 * If not provided, will default to `orders`, that is the orders tab with _PowerOrders_ disabled.
 * Any tab with the term _power_ in it will enable both _PowerOrders_ and _PowerPlans_ in _PowerChart_.
 * @action `launchView` - (optional) Sets the view to be displayed.If not provided,
 * will default to `search` view.
 * @action `signSilently` - (optional) Signs the orders silently. Orders are not signed silently by default.
 * @action `dryRun` - (optional) If set to true, will not submit the order.
 * @documentation [MPAGES_EVENT - ORDER](https://wiki.cerner.com/display/public/MPDEVWIKI/MPAGES_EVENT+-+ORDERS)
 * @warning Our internal testing suggests there is a _PowerChart_ bug relating to the use of power
 * orders. When making MPAGES_EVENT calls (which we do in this library through `submitOrders`)
 * in series with power orders enabled, the result was that some MPAGES_EVENT calls failed to be invoked.
 * Please keep this in mind when enabling this option. For our own use, we have disabled power orders when
 * using `submitOrders` in such a way that calls are made in series.
 */
export type SubmitOrderOpts = {
  targetTab?: 'orders' | 'power orders' | 'medications' | 'power medications';
  launchView?: 'search' | 'profile' | 'signature';
  signSilently?: boolean;
  dryRun?: boolean;
};

/**
 * Submit orders for a patient in a given encounter through the _Cerner PowerChart_ `MPAGES_EVENT` function.
 * By default, _PowerPlans_ are disabled (potential bug in _PowerChart_), _PowerOrders_ are disabled,
 * the target tab is set to orders, and will launch to the signature view.
 * @param {number} personId - The identifier for the patient to whom the note belongs.
 * Cerner context variable: PAT_PersonId.
 * @param {number} encounterId - The identifier for the encounter belonging to the patient where
 * this note will be launched. Cerner context variable: VIS_EncntrId.
 * @param orders - The orders to be submitted. Orders are given in the form of a a series of pipe-delimited
 * parameters as specified in the `MPAGES_EVENT` documentation (below). Use the `fluent-cerner-js` library's
 * `orderString` function to simplify building these pipe-delimited order strings.
 * @param opts - (optional) User defined options for the order submission event. The options allow for
 * changing the target tab, the view to be launched, and whether or not the orders should be signed silently.
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
  let { targetTab, launchView, signSilently, dryRun } = opts || {};
  if (!targetTab) targetTab = 'orders';
  if (!launchView) launchView = 'signature';
  const enablePowerPlans =
    targetTab === 'power orders' || targetTab === 'power medications';

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

  if (dryRun) return { eventString, inPowerChart };

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
