import { PowerOrdersMOEWFlags } from '../functional/submitPowerOrdersAsync';

type CernerMOEWFlags =
  | 'add rx to filter'
  | 'allow only inpatient and outpatient orders'
  | 'allow power plan doc'
  | 'allow power plans'
  | 'allow regimen'
  | 'customize meds'
  | 'customize order'
  | 'disable auto search'
  | 'disallow EOL'
  | 'documented meds only'
  | 'hide demographics'
  | 'hide med rec'
  | 'read only'
  | 'show diag and probs'
  | 'show list details'
  | 'show nav tree'
  | 'show order profile'
  | 'show orders search'
  | 'show refresh and print buttons'
  | 'show related res'
  | 'show scratchpad'
  | 'sign later';

/**
 * A utility function designed to calculate the bitmask for the input paramaters to be used with PowerChart's CreateMOEW() function.
 * @param {PowerOrdersMOEWOpts} inputOpts - An object containing the type of orders to be placed (medications or order) as well as an (optional)
 * array of strings defining the MOEW behavior/appearance. If not provided, the values will default to the the order setting as well as recommended
 * values for the MOEW to be configured with PowerPlan support. If any values are provided, those will be the only values used.
 * @returns The bitmask numbers (dwCustomizeFlag, dwTabFlag, and dwTabDisplayOptionsFlag) to be used with PowerChart's CreateMOEW() function.
 */
export const calculateMOEWBitmask = (
  targetTab: 'orders tab' | 'medications tab',
  inputFlags: Array<PowerOrdersMOEWFlags>
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
  if (targetTab === 'orders tab') {
    dwTabFlag = 2;
  }

  if (targetTab === 'medications tab') {
    dwTabFlag = 3;
  }

  // If no MOEW options are provided, use recommended default settings
  const defaultOpts: Array<PowerOrdersMOEWFlags> = [
    'show refresh and print buttons',
    'allow power plan doc',
    'allow power plans',
    'show list details',
    'show scratchpad',
    'show order profile',
    'show orders search',
    'show related res',
    'show diag and probs',
    'show nav tree',
    'show demographics',
    'show med rec',
  ];

  const userFlags =
    !inputFlags || inputFlags.length === 0 ? defaultOpts : inputFlags;

  //Go through the flags provided by the user and convert them to Cerner analogs
  //At time of last edit:
  // - absence of `show demographics` causes `hide demographics` to be added to the bitmask calculation
  // - absence of `show med rec` causes `hide med rec` to be added to the bitmask calculation

  const cernerFlags: Array<CernerMOEWFlags> = [];
  userFlags.forEach((flag: PowerOrdersMOEWFlags) => {
    if (flag === 'show demographics') {
      return;
    }
    if (flag === 'show med rec') {
      return;
    }
    return cernerFlags.push(flag as CernerMOEWFlags);
  });
  if (!userFlags.includes('show demographics')) {
    cernerFlags.push('hide demographics');
  }
  if (!userFlags.includes('show med rec')) {
    cernerFlags.push('hide med rec');
  }

  // Calculate the other two parameters (dwCustomizeFlag and dwTabDisplayOptionsFlag) that are also ultimately needed for CreateMOEW()
  cernerFlags.forEach(option => {
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
