import { outsideOfPowerChartError } from '../utils';
import { calculateMOEWBitmask } from '../utils/calculateMOEWBitmask';
import { SubmitPowerPlanOrdersStatus } from './getXMLOrdersMOEW';

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
 * @documentation [POWERORDERS - CREATEMOEW](https://wiki.cerner.com/display/public/MPDEVWIKI/CreateMOEW)
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
 * @documentation [POWERORDERS - AddPowerPlanWithDetails](https://wiki.cerner.com/display/public/MPDEVWIKI/AddPowerPlanWithDetails)
 **/
export type PowerPlanOrderOpts = {
  personId: number;
  encounterId: number;
  standaloneOrders?: Array<StandaloneOrder>;
  powerPlanOrders?: Array<PowerPlanOrder>;
  signSilently: boolean;
};

/**
 * Submits a combination of standalone orders and/or PowerPlan orders by utilizing underlying Cerner - POWERORDERS functionality.
 * @param {PowerPlanOrderOpts} orderOpts - An object containing the person/patient Id, encounter Id,
 * an array of objects of either standalone orders or PowerPlan orders (each of which may contain
 * specific order properties), and a flag indicating whether or not the orders should be signed
 * silently.
 * @param {PowerPlanMOEWOpts} moewOpts - The type of orders to be placed (prescription or order) as well as an (optional)
 * array of strings defining the MOEW behavior/appearance. If not provided, the values will default to the recommended
 * values for the MOEW to be configured with Power Plan support. If any values are provided, those will be the only values used.
 * @returns an object with several high value properties: a boolean flag set to notify the user if the
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

  //Enable interaction checking (will hardcode to true for safety)
  const m_bSignTimeInteractionChecking = true;

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

  //Hold information regarding any standalone or PowerPlan orders
  let standaloneOrdersXML: string = '';

  let powerPlanOrdersXML: string = '';

  //Prepare the XML strings for input to AddNewOrdersToScatchPadAddPowerPlanWithDetails()
  if (standaloneOrders && standaloneOrders.length >= 1) {
    standaloneOrders.forEach(standaloneOrder => {
      standaloneOrdersXML += `<Order><EOrderOriginationFlag>${
        standaloneOrder.origination === 'inpatient order' ? 0 : 1
      }</EOrderOriginationFlag><SynonymId>${
        standaloneOrder.synonymId
      }</SynonymId>
      <OrderSentenceId>${
        standaloneOrder.sentenceId ? standaloneOrder.sentenceId : ''
      }</OrderSentenceId></Order>`;
    });

    //Add <Orders> to beginning & end of the Standalone Order XML
    standaloneOrdersXML = '<Orders>' + standaloneOrdersXML;
    standaloneOrdersXML += '</Orders>';
  }

  if (powerPlanOrders && powerPlanOrders.length >= 1) {
    powerPlanOrders.forEach(powerPlanOrder => {
      powerPlanOrdersXML += `<Plan><PathwayCatalogId>${
        powerPlanOrder.pathwayCatalogId
      }</PathwayCatalogId><PersonalizedPlanId>${
        powerPlanOrder.personalizedPlanId
          ? powerPlanOrder.personalizedPlanId
          : ''
      }</PersonalizedPlanId><Diagnoses>
    ${
      powerPlanOrder.diagnoses
        ? powerPlanOrder.diagnoses.map(diagnosis => {
            return '<DiagnosisId>' + diagnosis + '</DiagnosisId>';
          })
        : ''
    }
    </Diagnoses></Plan>`;
    });

    //Add <Plans> to beginning & end of PowerPlan XML
    powerPlanOrdersXML = '<Plans>' + powerPlanOrdersXML;
    powerPlanOrdersXML += '</Plans>';
  }

  try {
    //Create the DiscernObjectFactory - POWERORDERS object
    const dcof = await window.external.DiscernObjectFactory('POWERORDERS');

    //Initialize the MOEW handle
    let m_hMOEW = 0;

    //Create the MOEW
    m_hMOEW = await dcof.CreateMOEW(
      personId,
      encounterId,
      dwCustomizeFlag,
      dwTabFlag,
      dwTabDisplayOptionsFlag
    );

    //Add PowerPlan orders (if present)
    if (powerPlanOrders && powerPlanOrders.length >= 1) {
      await dcof.AddPowerPlanWithDetails(m_hMOEW, powerPlanOrdersXML);
    }

    //Add standalone orders (if present)
    if (standaloneOrders && standaloneOrders.length >= 1) {
      await dcof.AddNewOrdersToScratchpad(
        m_hMOEW,
        standaloneOrdersXML,
        m_bSignTimeInteractionChecking
      );
    }

    //Display the MOEW
    await dcof.DisplayMOEW(m_hMOEW);

    //Sign orders silently (if enalbed)
    if (signSilently === true) {
      await dcof.SignOrders(m_hMOEW);
    }

    //Destroy the MOEW at the end of the ordering process.
    await dcof.DestroyMOEW(m_hMOEW);

    //Obtain the XML return string
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

  return retData;
};

// Return type to signifiy status of order placing

//Return type of the entire function
export type SubmitPowerPlanOrderReturn = {
  inPowerChart: boolean;
  status: SubmitPowerPlanOrdersStatus;
  ordersPlaced: Array<{ name: string; oid: number; display: string }> | null;
};
