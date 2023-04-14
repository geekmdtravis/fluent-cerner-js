/**
 * A type for the options that can be passed to the makeMpageOrder function.
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
export type OrderAction =
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
 * @param `synonymId` - The Cerner synonym_id for the order to be generated.
 * @param `orderSentenceId` - (optional) The order sentence id to be associated with the new order.
 * This is an accompanied value to the synonymId and provides specificity to the order type.
 * @param `nomenclatureIds` - (optional) An array of nomenclature ids (identifiers for problems/diagnoses) to be associated with the new order.
 * @param `interaction` - (optional) Defines when an interaction between the provider and PowerChart takes place only at sign time, or impromptu.
 * @param `origination` - (optional) Defines the origination of the order as `satellite`, `prescription`, or `normal`.
 *
 * @documentation [MPAGES_EVENT - ORDER](https://wiki.cerner.com/display/public/MPDEVWIKI/MPAGES_EVENT+-+ORDERS)
 */
export type NewOrderStrOpts = {
  synonymId: number;
  orderSentenceId?: number;
  nomenclatureIds?: Array<number>;
  interactionCheck?: 'on sign' | 'default';
  origination?: 'satellite' | 'prescription' | 'normal';
};

/**
 * @param {number} orderId - (optional) The order id value for the order to activate.
 * @param {NewOrderOpts}newOrderOpts - (optional) The options for the new order.
 *
 * @documentation [MPAGES_EVENT - ORDER](https://wiki.cerner.com/display/public/MPDEVWIKI/MPAGES_EVENT+-+ORDERS)
 */
export type OrderStrOpts = {
  orderId?: number;
  newOrderOpts?: NewOrderStrOpts;
};

/**
 * Creates a new pipe-delimited MPage Order string.
 * @since 0.4.0
 * @param {OrderAction} action - The action to be performed on the order.
 * @param {OrderStrOpts} opts - (optional) The options for the order.
 * @returns {string} - A pipe-delimited string which can be integrated into an MPage Event for one or more orders.
 * @throws {Error} - If the action is not a valid order action.
 *
 * @documentation [MPAGES_EVENT - ORDER](https://wiki.cerner.com/display/public/MPDEVWIKI/MPAGES_EVENT+-+ORDERS)
 */
export const orderString = (
  action: OrderAction,
  opts?: OrderStrOpts
): string => {
  const { orderId, newOrderOpts } = opts || {};
  const {
    synonymId,
    orderSentenceId,
    nomenclatureIds,
    interactionCheck: interaction,
    origination,
  } = newOrderOpts || {};

  let params: Array<string> = [orderActionMap.get(action)];

  const nids = nomenclatureIds || [];

  switch (action) {
    case 'launch moew':
      params = params.concat(['0', '0', '0', '0', '0']);
      break;
    case 'new order':
      if (!synonymId)
        throw new Error(`synonymId is required for the '${action}' action`);
      params = params.concat([
        `${synonymId}`,
        `${originationMap.get(origination) || 0}`,
        `${orderSentenceId || 0}`,
        nids.length > 1 ? `[${nids.join('|')}]` : `${nids[0] || 0}`,
        `${interactionMap.get(interaction) || 0}`,
      ]);
      break;
    default:
      if (!orderId)
        throw new Error(`orderId is required for the '${action}' action`);
      params = params.concat([`${orderId}`]);
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
