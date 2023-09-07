import { PowerPlanMOEWOpts } from '../functional/submitPowerPlanOrders';

/**
 * A utility function designed to calculate the bitmask for the input paramaters to be used with PowerChart's CreateMOEW() function.
 * @param {Array<PowerPlanMOEWOpts>} inputOpts - The plaintext parameters, passed as an array of strings, are optional and, if not provided, the values will default to the recommended values for the MOEW
 * with Power Plan support within createMOEWAsync(). If any values are provided, those will be the only values used.
 * @returns The bitmask numbers (dwCustomizeFlag, dwTabFlag, and dwTabDisplayOptionsFlag) to be used with PowerChart's CreateMOEW() function.
 */
export const calculateMOEWBitmask = (
  inputOpts: PowerPlanMOEWOpts
): {
  dwCustomizeFlag: number;
  dwTabFlag: number;
  dwTabDisplayOptionsFlag: number;
} => {
  // Initialize and calculate the CreateMOEW() parameters
  let dwCustomizeFlag: number = 0;
  let dwTabFlag: number = 0;
  let dwTabDisplayOptionsFlag: number = 0;

  // Calculate the dwTabFlag parameter
  if (inputOpts.orderType === 'order') {
    dwTabFlag = 2;
  }

  if (inputOpts.orderType === 'medications') {
    dwTabFlag = 3;
  }

  if (!inputOpts.moewFlags || inputOpts.moewFlags.length === 0) {
    inputOpts.moewFlags = [
      'allow power plans',
      'allow power plan doc',
      'show scratchpad',
      'allow regimen',
      'show list details',
      'show orders search',
      'hide demographics',
      'show order profile',
      'show refresh and print buttons',
    ];
  }

  // Calculate the other two parameters ultimately needed for CreateMOEW()
  inputOpts.moewFlags.forEach(option => {
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

      case 'add rx to filter':
        dwCustomizeFlag += 4096;
        break;

      case 'disable auto search':
        dwCustomizeFlag += 8192;
        break;

      case 'allow regimen':
        dwCustomizeFlag += 16384;
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

  return {
    dwCustomizeFlag,
    dwTabFlag,
    dwTabDisplayOptionsFlag,
  };
};
