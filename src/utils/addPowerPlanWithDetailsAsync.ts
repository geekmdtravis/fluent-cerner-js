import { PowerChartReturn } from '..';
import { outsideOfPowerChartError } from '.';
import { PowerPlanOrder } from '../submitPowerOrdersAsync';

/**
 * Attempts to add a PowerPlan and creates PowerPlan objects from the pathway catalog Ids. CreateMOEW() must be called first.
 * @param {DiscernObjectFactoryReturn} dcof  - the reference to the DisernObjectFactory object
 * @param {number} moewHandle - the handle to the MOEW.
 * @param {Array<PowerPlanOrder>} powerPlanOrders - An array of objects containg catalog Ids and, optionally,
 * personalized plan Ids and diagnosis code Ids, for PowerPlan orders to be placed.
 * @resolves `PowerChartReturn & { powerPlansAdded: boolean }`
 * @throws `Error` if no orders are provided
 */

export async function addPowerPlanWithDetailsAsync(
  dcof: DiscernObjectFactoryReturn,
  moewHandle: number,
  powerPlanOrders: Array<PowerPlanOrder>
): Promise<
  PowerChartReturn & {
    powerPlansAdded: boolean;
  }
> {
  //Prepare the default return data
  let retData: PowerChartReturn & {
    powerPlansAdded: boolean;
  } = {
    inPowerChart: true,
    powerPlansAdded: true,
  };

  // Check for to make sure the array of orders provided is not empty
  if (powerPlanOrders.length < 1) {
    throw new RangeError(
      'There should be at least one PowerPlan order provided.'
    );
  }

  // Convert the PowerPlan orders provided into the required XML string
  let powerPlanOrdersXML: string = '';

  powerPlanOrders.forEach(
    ({
      pathwayCatalogId: cid,
      personalizedPlanId: pid,
      diagnosisIds: dids,
    }) => {
      powerPlanOrdersXML += `<Plan><PathwayCatalogId>${cid}</PathwayCatalogId><PersonalizedPlanId>${
        pid ? pid : ''
      }</PersonalizedPlanId><Diagnoses>
    ${
      dids
        ? dids.map(diagnosisSynonymID => {
            return '<DiagnosisId>' + diagnosisSynonymID + '</DiagnosisId>';
          })
        : ''
    }
    </Diagnoses></Plan>`;
    }
  );

  // Add <Plans> to beginning & end of PowerPlan XML
  powerPlanOrdersXML = '<Plans>' + powerPlanOrdersXML;
  powerPlanOrdersXML += '</Plans>';

  //Remove newlines and spaces
  powerPlanOrdersXML = powerPlanOrdersXML.replace(/[\r\n\s]/g, '');

  try {
    const response = await dcof.AddPowerPlanWithDetails(
      moewHandle,
      powerPlanOrdersXML
    );

    // Set the `powerPlanAdded` boolean to be true if the orders were added, and false otherwise
    retData.powerPlansAdded = response === 0 ? false : true;
  } catch (e) {
    // If outside of PowerChart, set the output to reflect that
    if (outsideOfPowerChartError(e)) {
      retData.inPowerChart = false;
      retData.powerPlansAdded = false;
    } else {
      // If some other error was encountered, throw that error
      throw e;
    }
  }

  // Return the retData object when complete
  return retData;
}
