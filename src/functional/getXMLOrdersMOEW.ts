import { PowerChartReturn } from '.';
import { outsideOfPowerChartError } from '../utils';

/**
 * Retrieves the XML representation of the order information signed during the previous MOEW invocation.
 * @param {number} moewHandle - the handle to the MOEW.
 * @returns a `Promise` which resolves to a string containing prior order information. If none or invalid, the string will be empty.
 * @throws `Error` if an unexpected error occurs.
 */

export async function getXMLOrdersMOEWAsync(
  moewHandle: number
): Promise<GetXMLReturn> {
  let retData: GetXMLReturn = {
    inPowerChart: true,
    XML: '',
  };

  // Create the DiscernObjectFactory and use that to call GetXMLOrdersMOEW() with the handle from above
  try {
    const dcof = await window.external.DiscernObjectFactory('POWERORDERS');
    const response = await dcof.GetXMLOrdersMOEW(moewHandle);

    // Set the return object XML equal to the return XML from PowerChart
    retData.XML === response;
  } catch (e) {
    //If outside of PowerChart, set the output to reflect that
    if (outsideOfPowerChartError(e)) {
      retData.inPowerChart = false;
      retData.XML = '';
    } else {
      // If some other error was encountered, throw that error
      throw e;
    }
  }

  // Return the retData object when complete
  return retData;
}

export type GetXMLReturn = PowerChartReturn & {
  XML: string;
};
