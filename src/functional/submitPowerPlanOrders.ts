import { PowerChartReturn } from '.';
import { outsideOfPowerChartError } from '../utils';
import { calculateMOEWBitmask } from '../utils/calculateMOEWBitmask';
import {
  AddNewOrdersToScratchpadReturn,
  addNewOrdersToScratchpadAsync,
} from './addNewOrdersToScratchPad';
import {
  AddPowerPlanWithDetailsReturn,
  addPowerPlanWithDetailsAsync,
} from './addPowerPlanWithDetails';
import { CreateMOEWReturn, createMOEWAsync } from './createMOEW';
import { DisplayMOEWReturn, displayMOEWAsync } from './displayMOEW';
import {
  GetXMLReturn,
  SubmitPowerPlanOrdersStatus,
  getXMLOrdersMOEWAsync,
} from './getXMLOrdersMOEW';
import { signOrdersAsync } from './signOrders';

export type PowerPlanMOEWFlags =
  | 'add rx to filter'
  | 'allow only inpatient and outpatient orders'
  | 'allow power plan doc'
  | 'allow power plans'
  | 'allow regimen'
  | 'customize meds'
  | 'customize order'
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
 * PowerPlanMOEWOpts is a type which represents the parameters to be be passed into the CreateMOEW() function.
 *
 * @param {string} orderType -  Should be set to 'order' or 'medications', indicating what type of orders will be submitted
 *
 * @param {Array<PowerPlanMOEWFlags>} moewFlags -  An optional array of flags to  customize the MOEW. If not provided, the values will default to the recommended values for the MOEW
 * with Power Plan support. If any values are provided, those will be the only values used.
 *
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
 *
 * @documentation [POWERORDERS - CREATEMOEW] (https://wiki.cerner.com/display/public/MPDEVWIKI/CreateMOEW)
 **/
export type PowerPlanMOEWOpts = {
  orderType: 'order' | 'medications';
  moewFlags?: Array<PowerPlanMOEWFlags>;
};

export type StandaloneOrder = {
  synonymId: number;
  origination: 'inpatient order' | 'prescription order';
  sentenceId?: number;
};

export type PowerPlanOrder = {
  pathwayCatalogId: number;
  personalizedPlanId?: number;
  diagnoses?: Array<number>;
};

/**
 * PowerPlanOrderOpts is a type which represents the parameters to be be passed into the AddPowerPlanWithDetails() function.
 * @param {number} personId - The identifier for the patient.
 * Cerner context variable: PAT_PersonId.
 *
 * @param {number} encounterId - The identifier for the encounter belonging to the patient where
 * this order will be placed. Cerner context variable: VIS_EncntrId.
 *
 * @param {Array<StandaloneOrder>} standaloneOrders -  An array of objects containg order synonym Ids, order origination flags and, optionally, sentence Ids, for standalone orders to be placed. Either this, `powerPlanOrders,` or both, should be present.
 *
 * @param {Array<PowerPlanOrder>} powerPlanOrders - An array of objects containg catalog Ids and, optionally, personalized plan Ids and diagnosis code Ids, for PowerPlan orders to be placed. Either this, `standaloneOrders,` or both, should be present.
 *
 * @param {boolean} signSilently - A boolean indicating whether or not a "silent sign" should be attempted.
 *
 *  @param {boolean} interactionChecking - A boolean indicating whether or not interaction checking (to standalone orders only) should be performed. *Strongly* recommended to be TRUE.
 *
 * @documentation [POWERORDERS - AddPowerPlanWithDetails](https://wiki.cerner.com/display/public/MPDEVWIKI/AddPowerPlanWithDetails)
 **/
export type PowerPlanOrderOpts = {
  personId: number;
  encounterId: number;
  standaloneOrders?: Array<StandaloneOrder>;
  powerPlanOrders?: Array<PowerPlanOrder>;
  signSilently: boolean;
  interactionChecking: boolean;
};

/**
 * Submits a combination of standalone orders and/or PowerPlan orders by utilizing underlying Cerner - POWERORDERS functionality.
 * @param {PowerPlanOrderOpts} orderOpts - An object containing the person/patient Id, encounter Id,
 * an array of objects of either standalone orders or PowerPlan orders (each of which may contain
 * specific order properties), and a flag indicating whether or not the orders should be signed
 * silently.
 * @param {PowerPlanMOEWOpts} moewOpts - An object containing the type of orders to be placed (medications or order) as well as an (optional)
 * array of strings defining the MOEW behavior/appearance. If not provided, the values will default to the recommended
 * values for the MOEW to be configured with Power Plan support. If any values are provided, those will be the only values used.
 * @returns {SubmitPowerPlanOrderReturn} - an object with several high value properties: a boolean flag set to notify the user if the
 * attempt was made outside of PowerChart, the `status` of the order attempt, an object
 * representing the XML response string (converted to an array of the orders placed with order `name`,
 * `oid`, and `display` available for each), and the XML/response string itself (which is attempted to be parsed).
 * @throws an error if an unexpected error occurs that could not be handled appropriately.
 *
 * @documentation [POWERORDERS](https://wiki.cerner.com/display/public/MPDEVWIKI/POWERORDERS)
 */
export const submitPowerPlanOrdersAsync = async (
  orderOpts: PowerPlanOrderOpts,
  moewOpts: PowerPlanMOEWOpts
): Promise<SubmitPowerPlanOrderReturn> => {
  const {
    personId,
    encounterId,
    standaloneOrders,
    powerPlanOrders,
    signSilently,
  } = orderOpts;

  // Calculate the CreateMOEW() parameters
  const {
    dwCustomizeFlag,
    dwTabFlag,
    dwTabDisplayOptionsFlag,
  } = calculateMOEWBitmask(moewOpts);

  //Obtain user's chosen interaction checking setting
  const m_bSignTimeInteractionChecking = orderOpts.interactionChecking;

  //Create the return object with default values
  let retData: SubmitPowerPlanOrderReturn = {
    inPowerChart: true,
    status: 'success',
    ordersPlaced: null,
  };

  //If no standalone orders AND no PowerPlan orders are provided, throw an error
  if (
    (!standaloneOrders || standaloneOrders.length < 1) &&
    (!powerPlanOrders || powerPlanOrders.length < 1)
  ) {
    throw new SyntaxError(
      'At least one standalone order or one PowerPlan order to submit must be provided to this function.'
    );
  }

  try {
    //Initialize the MOEW handle
    let m_hMOEW: number = 0;

    //Create the MOEW
    try {
      const createMOEW: CreateMOEWReturn = await createMOEWAsync(
        personId,
        encounterId,
        dwCustomizeFlag,
        dwTabFlag,
        dwTabDisplayOptionsFlag
      );

      //If not in power chart, state so and return
      if (createMOEW.inPowerChart === false) {
        retData.inPowerChart = false;
        retData.ordersPlaced = [];
        retData.status = 'dry run';
        return retData;
      }

      //If an improper MOEW handle was generated, state so
      if (createMOEW.moewHandle === null) {
        retData.inPowerChart = true;
        retData.ordersPlaced = [];
        retData.status = 'invalid data returned';
        return retData;
      }

      //Update the MOEW handle once verified to be valid
      m_hMOEW = createMOEW.moewHandle;
    } catch (e) {
      throw e;
    }

    //Add PowerPlan orders (if present)
    if (powerPlanOrders && powerPlanOrders.length >= 1) {
      try {
        const addPowerPlans: AddPowerPlanWithDetailsReturn = await addPowerPlanWithDetailsAsync(
          m_hMOEW,
          powerPlanOrders
        );

        //If not in PowerChart, state so and return
        if (addPowerPlans.inPowerChart === false) {
          retData.inPowerChart = false;
          retData.ordersPlaced = [];
          retData.status = 'dry run';
          return retData;
        }

        //If failed to add PowerPlans, state so and return
        if (addPowerPlans.powerPlansAdded === false) {
          retData.inPowerChart = true;
          retData.ordersPlaced = [];
          retData.status = 'cancelled, failed, or invalid parameters provided';
          return retData;
        }
      } catch (e) {
        throw e;
      }
    }

    //Add standalone orders (if present)
    if (standaloneOrders && standaloneOrders.length >= 1) {
      try {
        const addStandaloneOrders: AddNewOrdersToScratchpadReturn = await addNewOrdersToScratchpadAsync(
          m_hMOEW,
          standaloneOrders,
          m_bSignTimeInteractionChecking
        );

        //If not in PowerChart, state so and return
        if (addStandaloneOrders.inPowerChart === false) {
          retData.inPowerChart = false;
          retData.ordersPlaced = [];
          retData.status = 'dry run';
          return retData;
        }

        //If failed to add standalone orders, state so and return
        if (
          addStandaloneOrders.result === 'add failed' ||
          addStandaloneOrders.result === 'cancelled by user'
        ) {
          retData.inPowerChart = true;
          retData.ordersPlaced = [];
          retData.status = 'cancelled, failed, or invalid parameters provided';
          return retData;
        }
      } catch (e) {
        throw e;
      }
    }

    //Display the MOEW (if user has chosen to not silent sign)
    if (signSilently === false) {
      try {
        const displayMOEW: DisplayMOEWReturn = await displayMOEWAsync(m_hMOEW);

        //If not in PowerChart, state so and return
        if (displayMOEW.inPowerChart === false) {
          retData.inPowerChart = false;
          retData.ordersPlaced = [];
          retData.status = 'dry run';
          return retData;
        }

        //If the orders are not signed by the user for some reason, state so
        if (displayMOEW.signed === false) {
          retData.inPowerChart = true;
          retData.ordersPlaced = [];
          retData.status = 'cancelled, failed, or invalid parameters provided';
          return retData;
        }
      } catch (e) {
        throw e;
      }
    }

    //Try to sign orders silently (if chosen by user)
    if (signSilently === true) {
      try {
        const signOrders: PowerChartReturn = await signOrdersAsync(m_hMOEW);

        //If not in PowerChart, state so and return
        if (signOrders.inPowerChart === false) {
          retData.inPowerChart = false;
          retData.ordersPlaced = [];
          retData.status = 'dry run';
          return retData;
        }
      } catch (e) {
        throw e;
      }
    }

    //Obtain the XML return information
    try {
      const getXML: GetXMLReturn = await getXMLOrdersMOEWAsync(m_hMOEW);

      //If not in PowerChart, state so and return
      if (getXML.inPowerChart === false) {
        retData.inPowerChart = false;
        retData.ordersPlaced = [];
        retData.status = 'dry run';
        return retData;
      }

      //If no orders placed, state so and return
      if (getXML.ordersPlaced === null || getXML.ordersPlaced.length === 0) {
        retData.inPowerChart = true;
        retData.ordersPlaced = null;
        retData.status = getXML.status;
        return retData;
      }

      //Otherwise, obtain the data from the XML call to ultimately return back
      retData.inPowerChart = true;
      retData.ordersPlaced = getXML.ordersPlaced;
      retData.status = getXML.status;
    } catch (e) {
      throw e;
    }

    //Destroy the MOEW at the end of the ordering process (and after obtaining our XML)
    try {
      await displayMOEWAsync(m_hMOEW);
    } catch (e) {
      throw e;
    }
  } catch (e) {
    //Document the error depending on the type, and adjust the return object
    if (outsideOfPowerChartError(e)) {
      retData.inPowerChart = false;
      retData.ordersPlaced = [];
      retData.status = 'dry run';
    } else {
      throw e;
    }
  }

  //Return the final data
  return retData;
};

//Return type of the entire function
export type SubmitPowerPlanOrderReturn = {
  inPowerChart: boolean;
  status: SubmitPowerPlanOrdersStatus;
  ordersPlaced: Array<{ name: string; oid: number; display: string }> | null;
};
