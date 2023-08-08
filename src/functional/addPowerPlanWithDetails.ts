import { PowerChartReturn } from '.';
import { outsideOfPowerChartError } from '../utils';
import { PowerPlanOrder } from './submitPowerPlanOrders';

/**
 * Attempts to add a PowerPlan and creates PowerPlan objects from the pathway catalog IDs. CreateMOEW() must be called first.
 * @param {number} moewHandle - the handle to the MOEW.
 * @param {Array<PowerPlanOrder>} powerPlanOrders - An array of pathway catalog IDs for PowerPlan orders to be placed.
 * @returns a `Promise` which resolves to a boolean, indicating whether or not the PowerPlan orders were successfully added
 * @throws `Error` if an unexpected error occurs or if the array provided is empty
 */

export async function addPowerPlanWithDetailsAsync(
  moewHandle: number,
  powerPlanOrders: Array<PowerPlanOrder>
): Promise<
  PowerChartReturn & {
    powerPlanAdded: boolean;
  }
> {

  //Prepare the default return data
  let retData: {
    inPowerChart: boolean;
    powerPlanAdded: boolean;
  } = {
    inPowerChart: true,
    powerPlanAdded: true,
  };

  // Check for to make sure the array of orders provided is not empty
  if (powerPlanOrders.length < 1) {
    throw new RangeError(
      'There should be at least one PowerPlan order provided.'
    );
  }

  // Convert the PowerPlan orders provided into the required XML string
  let powerPlanOrdersXML: string = '';

  powerPlanOrders.forEach(powerPlanOrder => {
    powerPlanOrdersXML += `<Plan><PathwayCatalogId>${powerPlanOrder.pathwayCatalogID}</PathwayCatalogId><PersonalizedPlanId>0.0</PersonalizedPlanId><Diagnoses></Diagnoses></Plan>`;
  });

  // Add <Plans> to beginning & end of PowerPlan XML
  powerPlanOrdersXML = '<Plans>' + powerPlanOrdersXML;
  powerPlanOrdersXML += '</Plans>';

  // Create the DiscernObjectFactory and use that to call AddPowerPlanWithDetails() with the values from above
  try {
    const dcof = await window.external.DiscernObjectFactory('POWERORDERS');
    const response = await dcof.AddPowerPlanWithDetails(
      moewHandle,
      powerPlanOrdersXML
    );

    // Set the `powerPlanAdded` boolean to be true if the orders were added, and false otherwise
    retData.powerPlanAdded = response === 0 ? false : true;

  } catch (e) {

    // If outside of PowerChart, set the output to reflect that
    if (outsideOfPowerChartError(e)) {
      retData.inPowerChart = false;
      retData.powerPlanAdded = false;
    } 
    else {
      // If some other error was encountered, throw that error
      throw e;
    }
  }

  // Return the retData object when complete
  return retData;
}