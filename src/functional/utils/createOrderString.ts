/**
 * A type for the options that can be passed to the `makeMpageOrder` function.
 * @action `launch moew` - Launches the MOEW.
 * @action `activate existing` - Activates an existing order.
 * @action `cancel-discontinue` - Cancels and discontinues an existing order.\n
 * @action `cancel-reorder` - Cancels and reorders an existing order.
 * @action `clear actions` - Clear actions of a future existing order.
 * @action `convert inpatient` - Converts a prescription order into an inpatient order.
 * @action `convert prescription` - Converts an inpatient order into a prescription.
 * @action `modify` - Modifies an existing future order.
 * @action `new order` - Creates a new order.
 * @action `renew` - Renews an existing non-prescription order.
 * @action `renew prescription` - Renews an existing prescription order.
 * @action `copy existing` - Copy an existing order.
 * @action `resume` - Resumes an existing order.
 * @action `suspend` - Suspends an existing order.
 *
 * @documentation [MPAGES_EVENT - ORDER](https://wiki.cerner.com/display/public/MPDEVWIKI/MPAGES_EVENT+-+ORDERS)
 */
type CompleteOrderAction =
  | 'launch moew'
  | 'activate existing'
  | 'cancel-discontinue'
  | 'cancel-reorder'
  | 'clear actions'
  | 'convert inpatient'
  | 'convert prescription'
  | 'modify'
  | 'new order'
  | 'renew'
  | 'renew prescription'
  | 'copy existing'
  | 'resume'
  | 'suspend';

/**
 * @param {Array<number>} nomenclatureIds - (optional) An array of nomenclature ids for the order.
 * @param {number} orderSentenceId - (optional) The order sentence id value for the order to activate.
 * @param {number} orderId - (optional) The order id value for the order to activate.
 * @param {NewOrderOpts}newOrderOpts - (optional) The options for the new order.
 *
 * @documentation [MPAGES_EVENT - ORDER](https://wiki.cerner.com/display/public/MPDEVWIKI/MPAGES_EVENT+-+ORDERS)
 */
export type OrderStrOpts = {
  nomenclatureIds?: Array<number>;
  orderSentenceId?: number;
  interactionCheck?: 'on sign' | 'default';
  origination?: 'satellite' | 'prescription' | 'normal';
};

const _createOrderString = (
  action: CompleteOrderAction,
  id?: number,
  opts?: OrderStrOpts
): string => {
  const { orderSentenceId, nomenclatureIds, origination, interactionCheck } =
    opts || {};

  let params: Array<string> = [orderActionMap.get(action)];

  const nids = nomenclatureIds || [];

  switch (action) {
    case 'launch moew':
      params = params.concat(['0', '0', '0', '0', '0']);
      break;
    case 'new order':
      if (!id)
        throw new Error(
          `id (as synonym ID) is required for the '${action}' action`
        );
      params = params.concat([
        `${id}`,
        `${originationMap.get(origination) || 0}`,
        `${orderSentenceId || 0}`,
        nids.length > 1 ? `[${nids.join('|')}]` : `${nids[0] || 0}`,
        `${interactionMap.get(interactionCheck) || 0}`,
      ]);
      break;
    default:
      if (!id)
        throw new Error(
          `id (as the existing order ID) is required for the '${action}' action`
        );
      params = params.concat([`${id}`]);
      break;
  }

  return `{${params.join('|')}}`;
};

const orderActionMap = new Map()
  .set('launch moew', 'ORDER')
  .set('activate existing', 'ACTIVATE')
  .set('cancel-discontinue', 'CANCEL DC')
  .set('cancel-reorder', 'CANCEL REORD')
  .set('clear actions', 'CLEAR')
  .set('convert inpatient', 'CONVERT_INPAT')
  .set('convert prescription', 'CONVERT_RX')
  .set('modify', 'MODIFY')
  .set('new order', 'ORDER')
  .set('renew', 'RENEW')
  .set('renew prescription', 'RENEW_RX')
  .set('copy existing', 'REPEAT')
  .set('resume', 'RESUME')
  .set('suspend', 'SUSPEND');

const originationMap = new Map()
  .set('satellite', '5')
  .set('prescription', '1')
  .set('normal', '0');

const interactionMap = new Map().set('on sign', '1').set('default', '0');

/**
 * A type for the options that can be passed to the makeMpageOrder function.
 * @action `activate existing` - Activates an existing order.
 * @action `cancel-discontinue` - Cancels and discontinues an existing order.\n
 * @action `cancel-reorder` - Cancels and reorders an existing order.
 * @action `clear actions` - Clear actions of a future existing order.
 * @action `convert inpatient` - Converts a prescription order into an inpatient order.
 * @action `convert prescription` - Converts an inpatient order into a prescription.
 * @action `modify` - Modifies an existing future order.
 * @action `new order` - Creates a new order.
 * @action `renew` - Renews an existing non-prescription order.
 * @action `renew prescription` - Renews an existing prescription order.
 * @action `copy existing` - Copy an existing order.
 * @action `resume` - Resumes an existing order.
 * @action `suspend` - Suspends an existing order.
 *
 * @documentation [MPAGES_EVENT - ORDER](https://wiki.cerner.com/display/public/MPDEVWIKI/MPAGES_EVENT+-+ORDERS)
 */
export type OrderAction =
  | 'activate existing'
  | 'cancel-discontinue'
  | 'cancel-reorder'
  | 'clear actions'
  | 'convert inpatient'
  | 'convert prescription'
  | 'modify'
  | 'new order'
  | 'renew'
  | 'renew prescription'
  | 'copy existing'
  | 'resume'
  | 'suspend';

/**
 * A helper function consumed by `submitOrdersAsync` function.  Creates a new pipe-delimited
 * order string consumed by an `MPAGES_EVENT` call with the `ORDERS` directive.
 * @since 0.10.0-alpha.0
 * @param {OrderAction} action - The action to be performed on the order.
 * @param {number} id - The id of the order. This is the synonym id for new orders and the order id for existing orders.
 * @param {OrderStrOpts} opts - (optional) The options for the order.
 * @returns {string} - A pipe-delimited string which can be integrated into an MPage Event for one or more orders.
 * @throws {Error} - If the action is not a valid order action.
 * @documentation [MPAGES_EVENT - ORDER](https://wiki.cerner.com/display/public/MPDEVWIKI/MPAGES_EVENT+-+ORDERS)
 */
export const createOrderString = (
  action: OrderAction,
  id: number,
  opts?: OrderStrOpts
) => _createOrderString(action, id, opts);

/**
 * A constant string for the `launch moew` action.
 */
export const LAUNCH_MOEW_ORDER_STRING = _createOrderString('launch moew');
