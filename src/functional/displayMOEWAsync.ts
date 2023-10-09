import { PowerChartReturn } from '.';
import { outsideOfPowerChartError } from '../utils';

/**
 * Displays the modal order entry window (MOEW).
 * @param {DiscernObjectFactoryReturn} dcof  - the reference to the DisernObjectFactory object
 * @param {number} moewHandle - the handle to the MOEW.
 * @returns a `Promise` which resolves to a PowerChartReturn and an integer indicating if orders were signed, 1, or 0 otherwise, converted to a Boolean.
 * @throws `Error` if an unexpected error occurs.
 */

export async function displayMOEWAsync(
  dcof: DiscernObjectFactoryReturn,
  moewHandle: number
): Promise<DisplayMOEWReturn> {
  let retData: DisplayMOEWReturn = {
    inPowerChart: true,
    signed: false,
  };

  try {
    const response = await dcof.DisplayMOEW(moewHandle);

    // Set the `signed` variable equal to the return, converted to a Boolean. 0 will return false, 1 will return true
    retData.signed = Boolean(response);
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

export type DisplayMOEWReturn = PowerChartReturn & {
  signed: boolean;
};
