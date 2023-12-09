import { PowerChartReturn } from '..';
import { outsideOfPowerChartError } from '.';

/**
 * Displays the modal order entry window (MOEW).
 * @param {DiscernObjectFactoryReturn} dcof  - the reference to the DisernObjectFactory object
 * @param {number} moewHandle - the handle to the MOEW.
 * @resolves `PowerChartReturn & { signed: boolean }`
 * @returns a `Promise` which resolves to a PowerChartReturn and an integer
 * indicating if orders were signed, 1, or 0 otherwise, converted to a Boolean.
 * @throws `Error` if an unexpected error occurs.
 */

export async function displayMOEWAsync(
  dcof: DiscernObjectFactoryReturn,
  moewHandle: number
): Promise<
  PowerChartReturn & {
    signed: boolean;
  }
> {
  let retData: PowerChartReturn & {
    signed: boolean;
  } = {
    inPowerChart: true,
    signed: false,
  };

  try {
    const response = await dcof.DisplayMOEW(moewHandle);

    retData.signed = Boolean(response);
  } catch (e) {
    if (outsideOfPowerChartError(e)) {
      retData.inPowerChart = false;
    } else {
      throw e;
    }
  }
  return retData;
}
