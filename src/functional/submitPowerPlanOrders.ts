import { outsideOfPowerChartError } from '../utils';

/**
 * MOEWOpts is a type which represents the parameters to be be passed into the CreateMOEW() function.
 *
 * @param {boolean} SIGN_LATER - Determines whether sign later functionality will be allowed from the MOEW.
 * @param {boolean} READ_ONLY - Determines whether the MEOW will be read only.
 * @param {boolean} ALLOW_POWERPLAN - Determines whether the MOEW allows PowerPlans to be used.
 * @param {boolean} ALLOW_POWERPLAN_DOC - Determines whether PowerPlan documentation is enabled.
 * @param {boolean} ALLOW_ONLY_INPT_OUTPT_ORDERS - Determines whether only inpatient and ambulatory venue ordering is allowed.
 * @param {boolean} SHOW_REFRESH_PRINT - Determines whether the banner bar, which shows refresh and print buttons, is displayed.
 * @param {boolean} DOCUMENTED_MEDS_ONLY - Determines whether or not the user can only perform actions on documented medications.
 * @param {boolean} HIDE_MED_REC - Determines whether medication reconiciliation controls are hidden.
 * @param {boolean} DISALLOW_EOL - Determines whether edit-on-line mode (which allows multi-selection) is disabled.
 * @param {boolean} HIDE_DEMO - Determines whether the demographics bar is hidden.
 * @param {boolean} ADD_RX_FILTER - Determines whether the prescription indicator is set to the default filter.
 * @param {boolean} DISABLE_AUTO_SEARCH - Determines whether auto search is disabled.
 * @param {boolean} ALLOW_REGIMEN - Determines whether regimens are enabled.
 *
 * @param {boolean} CUSTOMIZE_ORDER - Determines whether orders are being customized. Either this or CUSTOMIZE_MEDS must be true, but not both.
 * @param {boolean} CUSTOMIZE_MEDS - Determines whether medications are being customized. Either this or CUSTOMIZE_ORDER must be true, but not both.
 *
 * @param {boolean} SHOW_NAV_TREE - Determines whether the order navigator tree control is displayed.
 * @param {boolean} SHOW_DIAG_PROB - Determines whether the diagnoses/problem control menu is displayed.
 * @param {boolean} SHOW_RELATED_RES - Determines whether the related results control is displayed.
 * @param {boolean} SHOW_ORDER_SEARCH - Determines whether the order search menu is displayed. Note that this is required to be true if adding any orders.
 * @param {boolean} SHOW_ORDER_PROFILE - Determines whether the order profile is displayed.
 * @param {boolean} SHOW_SCRATCHPAD - Determines whether the scratchpad is displayed. Note that this is required to be true if adding any orders.
 * @param {boolean} SHOW_LIST_DETAILS - Determines whether the order detail control is enabled. Note that this is required to be true if adding any orders.
 *
 * @documentation [POWERORDERS - CREATEMOEW](https://wiki.cerner.com/display/public/MPDEVWIKI/CreateMOEW)
 **/

export type MOEWOpts = {
  SIGN_LATER: boolean;
  READ_ONLY: boolean;
  ALLOW_POWERPLAN: boolean;
  ALLOW_POWERPLAN_DOC: boolean;
  ALLOW_ONLY_INPT_OUTPT_ORDERS: boolean;
  SHOW_REFRESH_PRINT: boolean;
  DOCUMENTED_MEDS_ONLY: boolean;
  HIDE_MED_REC: boolean;
  DISALLOW_EOL: boolean;
  HIDE_DEMO: boolean;
  ADD_RX_FILTER: boolean;
  DISABLE_AUTO_SEARCH: boolean;
  ALLOW_REGIMEN: boolean;

  CUSTOMIZE_ORDER: boolean;
  CUSTOMIZE_MEDS: boolean;

  SHOW_NAV_TREE: boolean;
  SHOW_DIAG_PROB: boolean;
  SHOW_RELATED_RES: boolean;
  SHOW_ORDER_SEARCH: boolean;
  SHOW_ORDER_PROFILE: boolean;
  SHOW_SCRATCHPAD: boolean;
  SHOW_LIST_DETAILS: boolean;
};

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

export const submitPowerPlanOrders = (opts: MOEWOpts): boolean => {
  
  
    // Destructure input, assign default values
  const {
    SIGN_LATER = false,
    READ_ONLY = false,
    ALLOW_POWERPLAN = true,
    ALLOW_POWERPLAN_DOC = true,
    ALLOW_ONLY_INPT_OUTPT_ORDERS = false,
    SHOW_REFRESH_PRINT = false,
    DOCUMENTED_MEDS_ONLY = false,
    HIDE_MED_REC = false,
    DISALLOW_EOL = false,
    HIDE_DEMO = false,
    ADD_RX_FILTER = false,
    DISABLE_AUTO_SEARCH = false,
    ALLOW_REGIMEN = false,

    CUSTOMIZE_ORDER = true,
    CUSTOMIZE_MEDS = false,

    SHOW_NAV_TREE = true,
    SHOW_DIAG_PROB = true,
    SHOW_RELATED_RES = true,
    SHOW_ORDER_SEARCH = true,
    SHOW_ORDER_PROFILE = true,
    SHOW_SCRATCHPAD = true,
    SHOW_LIST_DETAILS = true,
  } = opts;

  // Calculate the dwCustomizeFlag parameter
  let dwCustomizeFlag = 0;

  if (SIGN_LATER) {
    dwCustomizeFlag += 1;
  }

  if (READ_ONLY) {
    dwCustomizeFlag += 4;
  }

  if (ALLOW_POWERPLAN) {
    dwCustomizeFlag += 8;
  }

  if (ALLOW_POWERPLAN_DOC) {
    dwCustomizeFlag += 16;
  }

  if (ALLOW_ONLY_INPT_OUTPT_ORDERS) {
    dwCustomizeFlag += 32;
  }

  if (SHOW_REFRESH_PRINT) {
    dwCustomizeFlag += 128;
  }

  if (DOCUMENTED_MEDS_ONLY) {
    dwCustomizeFlag += 256;
  }

  if (HIDE_MED_REC) {
    dwCustomizeFlag += 512;
  }

  if (DISALLOW_EOL) {
    dwCustomizeFlag += 1024;
  }

  if (HIDE_DEMO) {
    dwCustomizeFlag += 2048;
  }

  if (ADD_RX_FILTER) {
    dwCustomizeFlag += 4096;
  }

  if (DISABLE_AUTO_SEARCH) {
    dwCustomizeFlag += 8192;
  }

  if (ALLOW_REGIMEN) {
    dwCustomizeFlag += 16384;
  }

  // Calculate the dwTabFlag parameter
  let dwTabFlag = 0;

  if (CUSTOMIZE_ORDER) {
    dwTabFlag = 2;
  }

  if (CUSTOMIZE_MEDS) {
    dwTabFlag = 3;
  }

  // Calculate the dwTabDisplayOptionsFlag parameter
  let dwTabDisplayOptionsFlag = 0;

  if (SHOW_NAV_TREE){
    dwTabDisplayOptionsFlag += 1;
  }

  if (SHOW_DIAG_PROB){
    dwTabDisplayOptionsFlag += 2;
  }

  if (SHOW_RELATED_RES){
    dwTabDisplayOptionsFlag += 4;
  }

  if (SHOW_ORDER_SEARCH){
    dwTabDisplayOptionsFlag += 8;
  }

  if (SHOW_ORDER_PROFILE){
    dwTabDisplayOptionsFlag += 16
  }

  if (SHOW_SCRATCHPAD){
    dwTabDisplayOptionsFlag += 32;
  }

  if (SHOW_LIST_DETAILS){
    dwTabDisplayOptionsFlag += 64;
  }


};
