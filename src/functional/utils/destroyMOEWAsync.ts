import { PowerChartReturn } from '..';
import { outsideOfPowerChartError } from '.';

/**
 * Destroys the modal order entry window (MOEW).
 * @param {DiscernObjectFactoryReturn} dcof  - the reference to the DisernObjectFactory object
 * @param {number} moewHandle - the handle to the MOEW.
 * @description The value returned by DestroyMOEW() is not used and is not believed to
 * be meaningful, but is logged to the console for development purposes.
 * @resolves `PowerChartReturn`
 */

export async function destroyMOEWAsync(
  dcof: DiscernObjectFactoryReturn,
  moewHandle: number
): Promise<PowerChartReturn> {
  let retData: PowerChartReturn = {
    inPowerChart: true,
  };

  try {
    const response = await dcof.DestroyMOEW(moewHandle);

    console.log('Response from DestroyMOEW() is: ', response);
  } catch (e) {
    if (outsideOfPowerChartError(e)) {
      retData.inPowerChart = false;
    } else {
      throw e;
    }
  }
  return retData;
}
