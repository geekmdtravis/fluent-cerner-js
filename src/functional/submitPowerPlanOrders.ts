/**
 * PowerPlanMOEWOpts is a type which represents the parameters to be be passed into the CreateMOEW() function.
 * These parameters, passed as an array, are optional and, if not provided, the values will default to the recommended values for the MOEW
 * with Power Plan support. If any values are provided, those will be the only values used.
 *
 * @action `add rx filter` - Sets the prescription indicator to the default filter.
 * @action `allow only inpatient and outpatient orders` - Only inpatient and ambulatory venue ordering will be allowed.
 * @action `allow power plan doc` - Enables PowerPlan documentation.
 * @action `allow power plans` - Allows PowerPlans to be used from the MOEW.
 * @action `allow regimen` - Ensures that regimens are enabled.
 * @action `customize meds` - States that medications are being customized. Either this or "customize orders" must be present (if parameters are provided), but not both.
 * @action `customize orders` - States that orders are being customized. Either this or "customize meds" must be present (if parameters are provided), but not both.
 * @action `disable auto search` - Disables auto search.
 * @action `disallow EOL` - This option forces edit-on-line mode (which allows multi-selection) to be disabled.
 * @action `documented meds only` - Restricts the MOEW to only perform actions on documented medications.
 * @action `hide demographics` - Hides the demographics bar.
 * @action `hide med rec` - Hides medication reconiciliation controls.
 * @action `read only` - The MEOW will be read only.
 * @action `show diag and probs` -  Configures the MOEW such that the diagnoses/problem control menu is displayed.
 * @action `show list details` -  Configures the MOEW such that the order detail control is enabled. Note that this is required if adding any orders (if parameters are provided).
 * @action `show nav tree` - Configures the MOEW such that the navigator tree control is displayed.
 * @action `show order profile` -  Configures the MOEW such that the order profile is displayed.
 * @action `show orders search` -  Configures the MOEW such that the order search menu is displayed. Note that this is required if adding any orders (if parameters are provided).
 * @action `show refresh and print buttons` - Will show the refresh and print buttons in the MOEW.
 * @action `show related res` -  Configures the MOEW such that the related results control is displayed.
 * @action `show scratchpad` -  Configures the MOEW such that the scratchpad is displayed. Note that this is required if adding any orders (if parameters are provided).
 * @action `sign later` - Sign later functionality will be allowed from the MOEW.
 *
 * @documentation [POWERORDERS - CREATEMOEW](https://wiki.cerner.com/display/public/MPDEVWIKI/CreateMOEW)
 **/

export type PowerPlanMOEWOpts =
  | 'add rx filter'
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
 * PowerPlanOrderOpts is a type which represents the parameters to be be passed into the AddPowerPlanWithDetails() function.
 * @param {number} personId - The identifier for the patient.
 * Cerner context variable: PAT_PersonId.
 *
 * @param {number} encounterId - The identifier for the encounter belonging to the patient where
 * this order will be placed. Cerner context variable: VIS_EncntrId.
 *
 * @documentation [POWERORDERS - AddPowerPlanWithDetails](https://wiki.cerner.com/display/public/MPDEVWIKI/AddPowerPlanWithDetails)
 **/

export type PowerPlanOrderOpts = {
  personId: number;
  encounterId: number;
};

export const submitPowerPlanOrdersAsync = async (
  moewOpts?: Array<PowerPlanMOEWOpts>
): Promise<T> => {
  // Destructure input, assign default values

  //Either use the options provided by the user, or if none or provided, set default PowerPlan options
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


  
};
