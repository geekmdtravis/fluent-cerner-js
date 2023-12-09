import { PowerChartReturn } from '..';
import { outsideOfPowerChartError } from '.';

/**
 * Attempts to silently sign orders on the scratchpad. If the orders cannot be signed silently, will display the MOEW.
 * @param {DiscernObjectFactoryReturn} dcof  - the reference to the DisernObjectFactory object
 * @param {number} moewHandle - the handle to the MOEW.
 * @resolves `PowerChartReturn`
 * @description The value returned by SignOrders() is not used and is not believed to be meaningful, but is logged
 * to the console for development purposes. In our testing, a 0 is returned if an improper MOEW handle is provided, but a 1 is returned otherwise
 * (any time SignOrders() is called) but this is not yet fully confirmed. If it is confirmed,
 * the resolved object will be updated to reflect this.
 */

export async function signOrdersAsync(
  dcof: DiscernObjectFactoryReturn,
  moewHandle: number
): Promise<PowerChartReturn> {
  let retData: PowerChartReturn = {
    inPowerChart: true,
  };

  try {
    const response = await dcof.SignOrders(moewHandle);
    // TODO: Remove this console.log() statement when development is complete
    console.log('Response from SignMOEW() is: ', response);
  } catch (e) {
    if (outsideOfPowerChartError(e)) {
      retData.inPowerChart = false;
    } else {
      throw e;
    }
  }
  return retData;
}
