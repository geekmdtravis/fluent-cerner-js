import { PowerChartReturn } from '.';
import { outsideOfPowerChartError } from '../utils';

/**
 * Attempts to silently sign orders on the scratchpad. If the orders cannot be signed silently, will display the MOEW.
 * @param {number} moewHandle - the handle to the MOEW.
 * @returns a `Promise` which resolves to a PowerChartReturn.
 * @description The value returned by SignOrders() is not used and is not believed to be meaningful, but is logged to the console for development purposes.
 * In our testing, a 0 is returned if an improper MOEW handle is provided, but a 1 is returned otherwise (any time SignOrders() is called).
 * @throws `Error` if an unexpected error occurs.
 */

export async function signOrdersAsync(
  moewHandle: number
): Promise<PowerChartReturn> {
  let retData: PowerChartReturn = {
    inPowerChart: true,
  };

  // Create the DiscernObjectFactory and use that to call signOrders() with the handle from above
  try {
    const dcof = await window.external.DiscernObjectFactory('POWERORDERS');
    const response = await dcof.SignOrders(moewHandle);

    // Log the return value for development purposes
    console.log('Response from SignMOEW() is: ', response);
  } catch (e) {
    //If outside of PowerChart, set the output to reflect that
    if (outsideOfPowerChartError(e)) {
      retData.inPowerChart = false;
    } else {
      // If some other error was encountered, throw that error
      throw e;
    }
  }

  // Return the retData object when complete
  return retData;
}
