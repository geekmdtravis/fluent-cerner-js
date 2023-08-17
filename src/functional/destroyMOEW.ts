import { PowerChartReturn } from '.';
import { outsideOfPowerChartError } from '../utils';

/**
 * Destroys the modal order entry window (MOEW).
 * @param {number} moewHandle - the handle to the MOEW.
 * @returns a `Promise` which resolves to null. Null appears to be returned upon either a successful or unsuccessful destruction.
 * @throws `Error` if an unexpected error occurs.
 */

export async function destroyMOEWAsync(
  moewHandle: number
): Promise<DestroyMOEWReturn> {
  let retData: DestroyMOEWReturn = {
    inPowerChart: true,
    retVal: null,
  };

  // Create the DiscernObjectFactory and use that to call DestroyMOEW() with the handle from above
  try {
    const dcof = await window.external.DiscernObjectFactory('POWERORDERS');
    const response = await dcof.DestroyMOEW(moewHandle);

    // Set the retValue equal to the return (which appears to always be null)
    retData.retVal === response;
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

export type DestroyMOEWReturn = PowerChartReturn & {
  retVal: null;
};
