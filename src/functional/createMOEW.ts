import { PowerChartReturn } from '.';
import { calculateMOEWBitmask, outsideOfPowerChartError } from '../utils';
import { PowerPlanMOEWOpts } from './submitPowerPlanOrders';

/**
 * Creates an MOEW handle.
 * @param pid {number} - the patient ID
 * @param eid {number} - the encounter ID in which orders would be placed
 * @param moewOpts {Array<PowerPlanMOEWOpts>} - the optional parameters to be be passed into the CreateMOEW() function.
 * These parameters, passed as an array, are optional and, if not provided, the values will default to the recommended values for the MOEW
 * with Power Plan support. If any values are provided, those will be the only values used.
 * @returns a `Promise` which resolves to an integer representing a handle to the MOEW instance. `null` indicates an invalid call or call from outside PowerChart. For testing purposes, the bitmask flags are also returned.
 * @throws `Error` if an unexpected error occurs or if MOEW set to customize both orders AND medications.
 */

export async function createMOEWAsync(
  pid: number,
  eid: number,
  moewOpts?: Array<PowerPlanMOEWOpts>
): Promise<CreateMOEWReturn> {
  let retData: CreateMOEWReturn = {
    inPowerChart: true,
    moewHandle: null,
    customizeFlag: 0,
    tabFlag: 0,
    tabDisplayOptionsFlag: 0,
  };

  // Definite the recommended input optinons, to be used if none entered by the user
  const inputOpts: Array<PowerPlanMOEWOpts> = moewOpts
    ? moewOpts
    : [
        'allow power plans',
        'allow power plan doc',
        'customize order',
        'show nav tree',
        'show diag and probs',
        'show related res',
        'show orders search',
        'show order profile',
        'show scratchpad',
        'show list details',
      ];

  // Check for the inclusion of both 'customize order' and 'customize meds' and throw an error if so
  if (
    inputOpts.includes('customize order') &&
    inputOpts.includes('customize meds')
  ) {
    throw new SyntaxError(
      'The MOEW must be configured to customize orders or medications, but cannot be configured to customize both.'
    );
  }

  // Calculate the bitmask via utility function
  const {
    dwCustomizeFlag,
    dwTabFlag,
    dwTabDisplayOptionsFlag,
  } = calculateMOEWBitmask(inputOpts);

  //Create the DiscernObjectFactory and use that to call CreateMOEW() with the values from above
  try {
    const dcof = await window.external.DiscernObjectFactory('POWERORDERS');
    const response = await dcof.CreateMOEW(
      pid,
      eid,
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

  // We also return the actual bitmask flags, primarily for testing purposes & verification
  retData.customizeFlag = dwCustomizeFlag;
  retData.tabFlag = dwTabFlag;
  retData.tabDisplayOptionsFlag = dwTabDisplayOptionsFlag;

  // Return the retData object when complete
  return retData;
}

export type CreateMOEWReturn = PowerChartReturn & {
  moewHandle: number | null;
  customizeFlag: number;
  tabFlag: number;
  tabDisplayOptionsFlag: number;
};
