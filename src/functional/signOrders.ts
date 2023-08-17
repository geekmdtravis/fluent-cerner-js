import { PowerChartReturn } from '.';
import { outsideOfPowerChartError } from '../utils';

/**
 * Attempts to silently sign orders on the scratchpad. If the orders cannot be signed silently, will display the MOEW.
 * @param {number} moewHandle - the handle to the MOEW.
 * @returns a `Promise` which resolves to an integer: 0 if called with invalid/improperly structured paramters, and 1 otherwise.
 * @throws `Error` if an unexpected error occurs.
 */

export async function signOrdersAsync(
  moewHandle: number
): Promise<SignOrdersReturn> {
  let retData: SignOrdersReturn = {
    inPowerChart: true,
    retval: 1,
  };

  // Create the DiscernObjectFactory and use that to call signOrders() with the handle from above
  try {
    const dcof = await window.external.DiscernObjectFactory('POWERORDERS');
    const response = await dcof.SignOrders(moewHandle);

    // Set the retValue equal to the return (which appears to always be 0)
    retData.retval === response;
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

export type SignOrdersReturn = PowerChartReturn & {
  retval: number;
};
