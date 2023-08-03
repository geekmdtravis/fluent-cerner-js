import { PowerChartReturn } from '.';
import { outsideOfPowerChartError } from '../utils';
import { PowerPlanMOEWOpts } from './submitPowerPlanOrders';

/**
 * Creates an MOEW handle.
 * @param pid {number} - the patient ID
 * @param eid {number} - the encounter ID in which orders would be placed
 * @param moewOpts {Array<PowerPlanMOEWOpts>} - the parameters to be be passed into the CreateMOEW() function.
 * These parameters, passed as an array, are optional and, if not provided, the values will default to the recommended values for the MOEW
 * with Power Plan support. If any values are provided, those will be the only values used.
 * @returns a `Promise` which resolves to an integer representing a handle to the MOEW instance. 0 indicates an invalid call or call from outside PowerChart.
 *
 * @throws `Error` if an unexpected error occurs
 */
async function createMOEWAsync(
  pid: number,
  eid: number,
  moewOpts?: Array<PowerPlanMOEWOpts>
): Promise<PowerChartReturn & { m_hMOEW: number }> {
  let retData: {
    inPowerChart: boolean;
    m_hMOEW: number;
  } = {
    inPowerChart: true,
    m_hMOEW: 0,
  };

  const inputOpts: Array<PowerPlanMOEWOpts> = moewOpts
    ? moewOpts
    : ['allow power plans', 'allow power plan doc'];

  // Initialize and calculate the CreateMOEW() parameters
  let dwCustomizeFlag: number = 0;
  let dwTabFlag: number = 0;
  let dwTabDisplayOptionsFlag: number = 0;

  inputOpts.forEach(option => {
    switch (option) {
      // Calculate the dwCustomizeFlagParamater
      case 'sign later':
        dwCustomizeFlag += 1;
        break;

      case 'read only':
        dwCustomizeFlag += 4;
        break;

      case 'allow power plans':
        dwCustomizeFlag += 8;
        break;

      case 'allow power plan doc':
        dwCustomizeFlag += 16;
        break;

      case 'allow only inpatient and outpatient orders':
        dwCustomizeFlag += 32;
        break;

      case 'show refresh and print buttons':
        dwCustomizeFlag += 128;
        break;

      case 'documented meds only':
        dwCustomizeFlag += 256;
        break;

      case 'hide med rec':
        dwCustomizeFlag += 512;
        break;

      case 'disallow EOL':
        dwCustomizeFlag += 1024;
        break;

      case 'hide demographics':
        dwCustomizeFlag += 2048;
        break;

      case 'add rx filter':
        dwCustomizeFlag += 4096;
        break;

      case 'disable auto search':
        dwCustomizeFlag += 8192;
        break;

      case 'allow regimen':
        dwCustomizeFlag += 16384;
        break;

      // Calculate the dwTabFlag parameter
      case 'customize order':
        dwTabFlag = 2;
        break;

      case 'customize meds':
        dwTabFlag = 3;
        break;

      // Calculate the dwTabDisplayOptionsFlag parameter
      case 'show nav tree':
        dwTabDisplayOptionsFlag += 1;
        break;

      case 'show diag and probs':
        dwTabDisplayOptionsFlag += 2;
        break;

      case 'show related res':
        dwTabDisplayOptionsFlag += 4;
        break;

      case 'show orders search':
        dwTabDisplayOptionsFlag += 8;
        break;

      case 'show order profile':
        dwTabDisplayOptionsFlag += 16;
        break;

      case 'show scratchpad':
        dwTabDisplayOptionsFlag += 32;
        break;

      case 'show list details':
        dwTabDisplayOptionsFlag += 64;
        break;
    }
  });

  try {
    const dcof = await window.external.DiscernObjectFactory('POWERORDERS');
    const response = await dcof.CreateMOEW(
      pid,
      eid,
      dwCustomizeFlag,
      dwTabFlag,
      dwTabDisplayOptionsFlag
    );
    retData.m_hMOEW = response;
  } catch (e) {
    if (outsideOfPowerChartError(e)) {
      return {
        inPowerChart: false,
        m_hMOEW: 0,
      };
    } else {
      throw e;
    }
  }
  return retData;
}
