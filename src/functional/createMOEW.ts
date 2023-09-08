import { PowerChartReturn } from '.';
import { outsideOfPowerChartError } from '../utils';

/**
 * Creates an MOEW handle.
 * @param {number} personId  - the patient Id
 * @param {number} encounterId  - the encounter Id in which orders would be placed
 * @param {number} dwCustomizeFlag  - the bitmask that determines available MOEW options
 * @param {number} dwTabFlag  - the bitmask identifying the list being customized
 * @param {number} dwTabDisplayOptionsFlag  - the bitmask specificying which components display on the MOEW
 * @returns a `Promise` which resolves to a PowerChartReturn and an integer representing a handle to the MOEW instance. 0 indicates an invalid/unsuccessful call, which is logged as null.
 * @throws `Error` if an unexpected error occurs
 */

export async function createMOEWAsync(
  personId: number,
  encounterId: number,
  dwCustomizeFlag: number,
  dwTabFlag: number,
  dwTabDisplayOptionsFlag: number
): Promise<CreateMOEWReturn> {
  let retData: CreateMOEWReturn = {
    inPowerChart: true,
    moewHandle: null,
  };

  //Create the DiscernObjectFactory and use that to call CreateMOEW()
  try {
    const dcof = await window.external.DiscernObjectFactory('POWERORDERS');
    const response = await dcof.CreateMOEW(
      personId,
      encounterId,
      dwCustomizeFlag,
      dwTabFlag,
      dwTabDisplayOptionsFlag
    );

    //Set the moewHandle equal to `null` if an invalid handle is returned, and set it to the actual value otherwise
    retData.moewHandle = response === 0 ? null : response;
  } catch (e) {
    //If outside of PowerChart, set the output to reflect that
    if (outsideOfPowerChartError(e)) {
      retData.inPowerChart = false;
      retData.moewHandle = null;
    } else {
      //If some other error was encountered, throw that error
      throw e;
    }
  }

  // Return the retData object when complete
  return retData;
}

export type CreateMOEWReturn = PowerChartReturn & {
  moewHandle: number | null;
};
