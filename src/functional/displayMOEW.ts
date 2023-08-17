import { PowerChartReturn } from '.';
import { outsideOfPowerChartError } from '../utils';

/**
 * Displays the modal order entry window (MOEW).
 * @param {number} moewHandle - the handle to the MOEW.
 * @returns a `Promise` which resolves to an integer (0). This appears to be returned upon either a successful or unsuccessful launch.
 * @throws `Error` if an unexpected error occurs.
 */

export async function displayMOEWAsync(
  moewHandle: number
): Promise<DisplayMOEWReturn> {
  let retData: DisplayMOEWReturn = {
    inPowerChart: true,
    retval: 0,
  };

  // Create the DiscernObjectFactory and use that to call DisplayMOEW() with the handle from above
  try {
    const dcof = await window.external.DiscernObjectFactory('POWERORDERS');
    const response = await dcof.DisplayMOEW(moewHandle);

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

export type DisplayMOEWReturn = PowerChartReturn & {
  retval: number;
};
