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
  let CustomizeFlag: number = 0;
  let TabFlag: number = 0;
  let TabDisplayOptionsFlag: number = 0;

  // Calculate the bitmask parameters ultimately needed for CreateMOEW()
  inputOpts.forEach(option => {
    switch (option) {
      // Calculate the dwCustomizeFlagParamater
      case 'sign later':
        CustomizeFlag += 1;
        break;

      case 'read only':
        CustomizeFlag += 4;
        break;

      case 'allow power plans':
        CustomizeFlag += 8;
        break;

      case 'allow power plan doc':
        CustomizeFlag += 16;
        break;

      case 'allow only inpatient and outpatient orders':
        CustomizeFlag += 32;
        break;

      case 'show refresh and print buttons':
        CustomizeFlag += 128;
        break;

      case 'documented meds only':
        CustomizeFlag += 256;
        break;

      case 'hide med rec':
        CustomizeFlag += 512;
        break;

      case 'disallow EOL':
        CustomizeFlag += 1024;
        break;

      case 'hide demographics':
        CustomizeFlag += 2048;
        break;

      case 'add rx filter':
        CustomizeFlag += 4096;
        break;

      case 'disable auto search':
        CustomizeFlag += 8192;
        break;

      case 'allow regimen':
        CustomizeFlag += 16384;
        break;

      // Calculate the dwTabFlag parameter
      case 'customize order':
        TabFlag = 2;
        break;

      case 'customize meds':
        TabFlag = 3;
        break;

      // Calculate the dwTabDisplayOptionsFlag parameter
      case 'show nav tree':
        TabDisplayOptionsFlag += 1;
        break;

      case 'show diag and probs':
        TabDisplayOptionsFlag += 2;
        break;

      case 'show related res':
        TabDisplayOptionsFlag += 4;
        break;

      case 'show orders search':
        TabDisplayOptionsFlag += 8;
        break;

      case 'show order profile':
        TabDisplayOptionsFlag += 16;
        break;

      case 'show scratchpad':
        TabDisplayOptionsFlag += 32;
        break;

      case 'show list details':
        TabDisplayOptionsFlag += 64;
        break;
    }
  });

  return {
    dwCustomizeFlag: CustomizeFlag,
    dwTabFlag: TabFlag,
    dwTabDisplayOptionsFlag: TabDisplayOptionsFlag,
  };
};
