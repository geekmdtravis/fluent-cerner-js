import { PowerPlanMOEWOpts } from '../functional/submitPowerPlanOrders';

/**
 * A utility function designed to calculate the bitmask for the input paramaters to be used with PowerChart's CreateMOEW() function.
 * @param {Array<PowerPlanMOEWOpts>} moewOpts - The plaintext parameters, passed as an array of strings, are optional and, if not provided, the values will default to the recommended values for the MOEW
 * with Power Plan support within createMOEWAsync(). If any values are provided, those will be the only values used.
 * @returns The bitmask numbers (dwCustomizeFlag, dwTabFlag, and dwTabDisplayOptionsFlag) to be used with PowerChart's CreateMOEW() function.
 */
export const calculateMOEWBitmask = (
  inputOpts: Array<PowerPlanMOEWOpts>
): {
  dwCustomizeFlag: number;
  dwTabFlag: number;
  dwTabDisplayOptionsFlag: number;
} => {
  // Check for the inclusion of both 'customize order' and 'customize meds' and throw an error if so
  if (
    inputOpts.includes('customize order') &&
    inputOpts.includes('customize meds')
  ) {
    throw new SyntaxError(
      'The MOEW must be configured to customize orders or medications, but cannot be configured to customize both.'
    );
  }

  // Initialize and calculate the CreateMOEW() parameters
  let dwCustomizeFlag: number = 0;
  let dwTabFlag: number = 0;
  let dwTabDisplayOptionsFlag: number = 0;

  // Calculate the bitmask parameters ultimately needed for CreateMOEW()
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

  return {
    dwCustomizeFlag,
    dwTabFlag,
    dwTabDisplayOptionsFlag,
  };
};
