import { PowerChartReturn } from '..';
import { outsideOfPowerChartError } from '.';

/**
 * Creates an MOEW handle.
 * @param {DiscernObjectFactoryReturn} dcof  - the to reference the DisernObjectFactory object
 * @param {number} personId  - the patient Id
 * @param {number} encounterId  - the encounter Id in which orders would be placed
 * @param {number} dwCustomizeFlag  - the bitmask that determines available MOEW options
 * @param {number} dwTabFlag  - the bitmask identifying the list being customized
 * @param {number} dwTabDisplayOptionsFlag  - the bitmask specificying which components display on the MOEW
 * @resolves `PowerChartReturn & { moewHandle: number | null }`
 */

export async function createMOEWAsync(
  dcof: DiscernObjectFactoryReturn,
  personId: number,
  encounterId: number,
  dwCustomizeFlag: number,
  dwTabFlag: number,
  dwTabDisplayOptionsFlag: number
): Promise<
  PowerChartReturn & {
    moewHandle: number | null;
  }
> {
  let retData: PowerChartReturn & {
    moewHandle: number | null;
  } = {
    inPowerChart: true,
    moewHandle: null,
  };

  //Use the DCOF to call CreateMOEW()
  try {
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
