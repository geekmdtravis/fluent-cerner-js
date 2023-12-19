import { outsideOfPowerChartError } from './utils';
import { calculateMOEWBitmask } from './utils/calculateMOEWBitmask';
import { addNewOrdersToScratchpadAsync } from './utils/addNewOrdersToScratchPadAsync';
import { addPowerPlanWithDetailsAsync } from './utils/addPowerPlanWithDetailsAsync';
import { createMOEWAsync } from './utils/createMOEWAsync';
import { destroyMOEWAsync } from './utils/destroyMOEWAsync';
import { displayMOEWAsync } from './utils/displayMOEWAsync';
import {
  SubmitPowerOrdersStatus,
  getOrdersPlacedAsync,
} from './utils/getOrdersPlacedAsync';
import { signOrdersAsync } from './utils/signOrdersAsync';
import { PowerChartReturn } from '.';

/**
 * PowerOrdersMOEWFlags is a type which represents an optional array of flags to  customize the MOEW. If not provided, the values will default to the recommended values for the MOEW
 * with PowerPlan support. If any values are provided, those will be the only values used by submitPowerOrdersAsync().
 * @action `add rx to filter` - Turns the prescription indicator on the default filter.
 * @action `allow only inpatient and outpatient orders` - Only inpatient and ambulatory venue ordering will be allowed.
 * @action `allow power plan doc` - Enables PowerPlan documentation.
 * @action `allow power plans` - Allows PowerPlans to be used from the MOEW.
 * @action `allow regimen` - Ensures that regimens are enabled.
 * @action `disable auto search` - Disables auto search.
 * @action `disallow EOL` - This option forces edit-on-line mode (which allows multi-selection) to be disabled.
 * @action `documented meds only` - Restricts the MOEW to only perform actions on documented medications.
 * @action `show demographics` - Displays the demographics bar in the MOEW.
 * @action `show med rec` - Displays medication reconiciliation controls in the MOEW.
 * @action `read only` - The MEOW will be read only.
 * @action `show diag and probs` -  Configures the MOEW such that the diagnoses/problem control menu is displayed.
 * @action `show list details` -  Configures the MOEW such that the order detail control is enabled. Note that this is required if adding any orders (if parameters are provided).
 * @action `show nav tree` - Configures the MOEW such that the navigator tree control is displayed.
 * @action `show order profile` -  Configures the MOEW such that the order profile is displayed.
 * @action `show orders search` -  Configures the MOEW such that the order search menu is displayed. Note that this is required if adding any orders (if parameters are provided).
 * @action `show refresh and print buttons` - Will show the refresh and print buttons in the MOEW.
 * @action `show related res` -  Configures the MOEW such that the related results control is displayed.
 * @action `show scratchpad` -  Configures the MOEW such that the scratchpad is displayed. Note that this is required if adding any orders (if parameters are provided).
 * @action `sign later` - Sign later functionality will be allowed from the MOEW.
 **/
export type PowerOrdersMOEWFlags =
  | 'add rx to filter'
  | 'allow only inpatient and outpatient orders'
  | 'allow power plan doc'
  | 'allow power plans'
  | 'allow regimen'
  | 'disable auto search'
  | 'disallow EOL'
  | 'documented meds only'
  | 'read only'
  | 'show demographics' // Cerner analog: 'hide demographics'
  | 'show diag and probs'
  | 'show list details'
  | 'show med rec' // Cerner analog: 'hide med rec'
  | 'show nav tree'
  | 'show order profile'
  | 'show orders search'
  | 'show refresh and print buttons'
  | 'show related res'
  | 'show scratchpad'
  | 'sign later';

/**
 * StandaloneOrder is a type which contains the items needed to place a standalone order.
 * @param {number} synonymId - The synonym Id associated with the standalone order.
 * @param {'inpatient order' | 'prescription order'} origination - The origination of the order being placed.
 * @param {number} sentenceId - An optional order sentence Id for the order being placed.
 **/
export type StandaloneOrder = {
  synonymId: number;
  origination: 'inpatient order' | 'prescription order';
  sentenceId?: number;
};

/**
 * PowerPlanOrder is a type which contains the items needed to place a PowerPlan order.
 * @param {number} pathwayCatalogId -The pathway catalog Id associated with the PowerPlan order.
 * @param {number} personalizedPlanId - An optional personalized plan Id.
 * @param {Array<number>} diagnosisIds - An optional array of diagnosis Ids for the PowerPlan order to be associated with
 **/
export type PowerPlanOrder = {
  pathwayCatalogId: number;
  personalizedPlanId?: number;
  diagnosisIds?: Array<number>;
};

/**
 * PowerOrdersOrderOpts is a type which allows the user to choose settings (silent sign and interaction checking) that impact the manner in which order(s) are placed.
 * @param {boolean} signSilently - A boolean indicating whether or not a silent sign should be attempted.
 * @param {boolean} interactionChecking - A boolean indicating whether or not interaction checking (for standalone orders only) should be performed.
 **/
export type SubmissionOpts = {
  signSilently: boolean;
  interactionChecking: boolean;
};

/**
 * Submits a combination of standalone orders and/or PowerPlan orders by utilizing underlying Cerner - POWERORDERS functionality.
 * @param {number} patientId - The identifier for the patient. Cerner context variable: PAT_PersonId.
 * @param {number} encounterId - The identifier for the encounter belonging to the patient where
 * this order will be placed. Cerner context variable: VIS_EncntrId.
 * @param {Array<StandaloneOrder | PowerPlanOrder>} orders - An array of `StandaloneOrder` and/or `PowerPlanOrder`
 * objects, representing orders to be placed.
 * @param {PowerOrdersOpts} opts - An *optional* object containg a flag indicating whether or not the orders should be signed
 * silently and whether interaction checking should be performed for standalone orders. Defaults to no silent signing and interaction checking if not provided.
 * @param { Array<PowerOrdersMOEWFlags>} moewFlags - An *optional* array of strings defining the MOEW behavior/appearance. If not provided,
 * the values will default to the the order setting as well as recommended
 * values for the MOEW to be configured with PowerPlan support. If any values are provided, those will be the only values used.
 * @param {'order' | 'medications'} targetTab - (optional) Determines which list to target when lauching the MOEW.
 * Either the order list or the medication list (subset). Defaults to the complete order list if not provided.
 * @returns {SubmitPowerOrdersReturn} - an object with several high value properties: a boolean flag set to notify the user if the
 * attempt was made outside of PowerChart, the `status` of the order attempt, an object
 * representing the XML response string (converted to an array of the orders placed with order `name`,
 * `oid`, and `display` available for each), and the XML/response string itself (which is attempted to be parsed).
 * @throws {Error} - If no orders are provided, an Error will be thrown.
 * @throws {SyntaxError} - If any order provided is not of type `StandaloneOrder` or `PowerPlanOrder`, a SyntaxError will be thrown.
 */
export const submitPowerOrdersAsync = async (
  patientId: number,
  encounterId: number,
  orders: Array<StandaloneOrder | PowerPlanOrder>,
  opts?: SubmissionOpts,
  moewFlags?: Array<PowerOrdersMOEWFlags>,
  targetTab?: 'orders tab' | 'medications tab'
): Promise<SubmitPowerOrdersReturn> => {
  opts = !opts ? { signSilently: false, interactionChecking: true } : opts;

  moewFlags = !moewFlags ? [] : moewFlags;

  // Get required bitmask values for later use in the CreateMOEW function
  // TODO: determine if this should be moved, and maybe simply integrated directly into the CreateMOEW function
  const {
    dwCustomizeFlag,
    dwTabFlag,
    dwTabDisplayOptionsFlag,
  } = calculateMOEWBitmask(targetTab || 'orders tab', moewFlags);

  let retData: SubmitPowerOrdersReturn = {
    inPowerChart: true,
    status: 'success',
    ordersPlaced: null,
  };

  if (orders.length < 1) {
    throw new Error(
      'At least one order to submit must be provided to this function.'
    );
  }

  let powerPlanOrders: Array<PowerPlanOrder> = [];
  let standaloneOrders: Array<StandaloneOrder> = [];

  orders.forEach(order => {
    if (isPowerPlanOrder(order)) {
      powerPlanOrders.push(order as PowerPlanOrder);
    } else if (isStandaloneOrder(order)) {
      standaloneOrders.push(order as StandaloneOrder);
    } else {
      throw new SyntaxError(
        'Each order provided must be of either a PowerPlanOrder or  StandaloneOrder type.'
      );
    }
  });

  try {
    let moewId: number = 0;

    const dcof = await window.external.DiscernObjectFactory('POWERORDERS');

    const createMOEW = await createMOEWAsync(
      dcof,
      patientId,
      encounterId,
      dwCustomizeFlag,
      dwTabFlag,
      dwTabDisplayOptionsFlag
    );

    if (createMOEW.inPowerChart === false) {
      retData.inPowerChart = false;
      retData.ordersPlaced = null;
      retData.status = 'dry run';
      return retData;
    }

    if (createMOEW.moewHandle === null) {
      retData.inPowerChart = true;
      retData.ordersPlaced = null;
      retData.status = 'invalid data returned';
      return retData;
    }

    moewId = createMOEW.moewHandle;

    if (powerPlanOrders && powerPlanOrders.length >= 1) {
      const addPowerPlans = await addPowerPlanWithDetailsAsync(
        dcof,
        moewId,
        powerPlanOrders
      );

      if (addPowerPlans.inPowerChart === false) {
        retData.inPowerChart = false;
        retData.ordersPlaced = null;
        retData.status = 'dry run';
        return retData;
      }

      if (addPowerPlans.powerPlansAdded === false) {
        retData.inPowerChart = true;
        retData.ordersPlaced = null;
        retData.status = 'cancelled, failed, or invalid parameters provided';
        return retData;
      }
    }

    if (standaloneOrders && standaloneOrders.length >= 1) {
      const addStandaloneOrders = await addNewOrdersToScratchpadAsync(
        dcof,
        moewId,
        standaloneOrders,
        opts.interactionChecking
      );

      if (addStandaloneOrders.inPowerChart === false) {
        retData.inPowerChart = false;
        retData.ordersPlaced = null;
        retData.status = 'dry run';
        return retData;
      }

      if (
        addStandaloneOrders.result === 'add failed' ||
        addStandaloneOrders.result === 'cancelled by user'
      ) {
        retData.inPowerChart = true;
        retData.ordersPlaced = null;
        retData.status = 'cancelled, failed, or invalid parameters provided';
        return retData;
      }
    }

    if (opts.signSilently) {
      const signOrders = await signOrdersAsync(dcof, moewId);

      if (signOrders.inPowerChart === false) {
        retData.inPowerChart = false;
        retData.ordersPlaced = null;
        retData.status = 'dry run';
        return retData;
      }
    } else {
      const displayMOEW = await displayMOEWAsync(dcof, moewId);

      if (displayMOEW.inPowerChart === false) {
        retData.inPowerChart = false;
        retData.ordersPlaced = null;
        retData.status = 'dry run';
        return retData;
      }
    }

    const getPlacedOrders = await getOrdersPlacedAsync(dcof, moewId);

    if (getPlacedOrders.inPowerChart === false) {
      retData.inPowerChart = false;
      retData.ordersPlaced = null;
      retData.status = 'dry run';
      return retData;
    }

    if (
      getPlacedOrders.ordersPlaced === null ||
      getPlacedOrders.ordersPlaced.length === 0
    ) {
      retData.inPowerChart = true;
      retData.ordersPlaced = null;
      retData.status = getPlacedOrders.status;
      return retData;
    }

    retData.inPowerChart = true;
    retData.ordersPlaced = getPlacedOrders.ordersPlaced;
    retData.status = getPlacedOrders.status;

    const destroyMOEW = await destroyMOEWAsync(dcof, moewId);

    if (destroyMOEW.inPowerChart === false) {
      retData.inPowerChart = false;
      retData.ordersPlaced = null;
      retData.status = 'dry run';
      return retData;
    }
  } catch (e) {
    if (outsideOfPowerChartError(e)) {
      retData.inPowerChart = false;
      retData.ordersPlaced = null;
      retData.status = 'dry run';
      return retData;
    } else {
      throw e;
    }
  }

  return retData;
};

export type SubmitPowerOrdersReturn = PowerChartReturn & {
  status: SubmitPowerOrdersStatus;
  ordersPlaced: Array<{ name: string; oid: number; display: string }> | null;
};

const isPowerPlanOrder = (o: PowerPlanOrder | StandaloneOrder): boolean => {
  return o.hasOwnProperty('pathwayCatalogId');
};

const isStandaloneOrder = (o: PowerPlanOrder | StandaloneOrder): boolean => {
  return o.hasOwnProperty('synonymId') && o.hasOwnProperty('origination');
};
