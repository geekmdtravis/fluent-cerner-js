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
 * @param `synonymId` - The Cerner synonym_id to be associated with the new order. Must be set.
 * @param `orderSentenceId` - (optional) The order sentence id to be associated with the new order.
 * This is an accompanied value to the synonymId and provides specificity to the order type.
 * @param `nomenclatureId` - (optional) The nomenclature id, or associated problem/diagnosis, to be associated with the new order.
 * @param `interaction` - Defines when an interaction between the provider and PowerChart takes place only at sign time, or impromptu.
 * @param `origination` - Defines the origination of the order as `satellite`, `prescription`, or `normal`.
 */
export type NewOrderOpts = {
  synonymId: number;
  orderSentenceId?: number;
  nomenclatureId?: number;
  interaction?: 'skip' | 'default';
  origination?: 'satellite' | 'prescription' | 'normal';
};

/**
 * @param `orderId` - (optional) The order id value for the order to activate.
 * @param `newOrderOpts` - (optional) The options for the new order.
 */
export type OrderOpts = {
  orderId?: number;
  newOrderOpts?: NewOrderOpts;
};

/**
 * Creates a new pipe-delimited MPage Order string.
 * @since 0.4.0
 * @param action - The action to be performed on the order.
 * @param opts - (optional) The options for the order.
 * @returns `string` - A pipe-delimited string which can be integrated into an MPage Event for one or more orders.
 */
export const makeOrderString = (
  action: OrderAction,
  opts?: OrderOpts
): string => {
  const { orderId, newOrderOpts } = opts || {};
  const {
    synonymId,
    orderSentenceId,
    nomenclatureId,
    interaction,
    origination,
  } = newOrderOpts || {};

  let params: Array<string> = [orderActionMap.get(action)];

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
        `${nomenclatureId || 0}`,
        `${interactionMap.get(interaction) || 0}`,
      ]);
      break;
    default:
      if (!orderId)
        throw new Error(`orderId is required for the '${action}' action`);
      params = params.concat([`${orderId}`]);
      break;
  }

  return params.join('|');
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

const interactionMap = new Map().set('skip', '1').set('default', '0');
