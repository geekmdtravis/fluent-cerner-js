import { PowerChartReturn } from '.';
import { outsideOfPowerChartError } from '../utils';
import { StandaloneOrder } from './submitPowerPlanOrders';

/**
 * Attempts to add new standalone orders to the scratchpad.
 * @param {number} moewHandle - the handle to the MOEW.
 * @param {Array<StandaloneOrder>} standaloneOrders - An array of synonym IDs for individual orders to be placed.
 * @param {boolean} interactionChecking - A boolean value indicating whether or not order interaction checking should be performed. Strongly recommended to be true.
 * @returns a `Promise` which resolves to a boolean, indicating whether or not the standalone orders were successfully added
 * @throws `Error` if an unexpected error occurs or if the array provided is empty
 */
export async function addNewOrdersToScratchpadAsync(
  moewHandle: number,
  standaloneOrders: Array<StandaloneOrder>,
  interactionChecking: boolean
): Promise<
  PowerChartReturn & {
    standaloneOrdersAdded: boolean;
  }
> {
  //Prepare the default return data
  let retData: {
    inPowerChart: boolean;
    standaloneOrdersAdded: boolean;
  } = {
    inPowerChart: true,
    standaloneOrdersAdded: true,
  };

  // Check for to make sure the array of orders provided is not empty
  if (standaloneOrders.length < 1) {
    throw new RangeError(
      'There should be at least one standalone order provided.'
    );
  }

  // Convert the standalone orders provided into the required XML string
  let standaloneOrdersXML: string = '';

  standaloneOrders.forEach(standaloneOrder => {
    standaloneOrdersXML += `<Order><EOrderOriginationFlag>0</EOrderOriginationFlag><SynonymId>${standaloneOrder.synonymID}</SynonymId><\OrderSentenceId></OrderSentenceId></Order>`;
  });

  //Add <Orders> to beginning & end of the Standalone Order XML
  standaloneOrdersXML = '<Orders>' + standaloneOrdersXML;
  standaloneOrdersXML += '</Orders>';

  // Create the DiscernObjectFactory and use that to call AddNewOrdersToScratchpad() with the values from above
  try {
    const dcof = await window.external.DiscernObjectFactory('POWERORDERS');
    const response = await dcof.AddNewOrdersToScratchpad(
      moewHandle,
      standaloneOrdersXML,
      interactionChecking
    );

    // Set the `standaloneOrdersAdded` boolean to be true if the orders were added, and false otherwise
    retData.standaloneOrdersAdded = response === 0 ? false : true;
  } catch (e) {
    // If outside of PowerChart, set the output to reflect that
    if (outsideOfPowerChartError(e)) {
      retData.inPowerChart = false;
      retData.standaloneOrdersAdded = false;
    } else {
      // If some other error was encountered, throw that error
      throw e;
    }
  }

  // Return the retData object when complete
  return retData;
}
