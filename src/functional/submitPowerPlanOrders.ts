/**
 * MOEWOpts is a type which represents the parameters to be be passed into the CreateMOEW() function.
 *
 * @param {boolean} signLater - Determines whether sign later functionality will be allowed from the MOEW.
 * @param {boolean} readOnly - Determines whether the MEOW will be read only.
 * @param {boolean} allowPowerPlan - Determines whether the MOEW allows PowerPlans to be used.
 * @param {boolean} allowPowerPlanDoc - Determines whether PowerPlan documentation is enabled.
 * @param {boolean} allowOnlyInptOutptOrders - Determines whether only inpatient and ambulatory venue ordering is allowed.
 * @param {boolean} showRefreshPrint - Determines whether the banner bar, which shows refresh and print buttons, is displayed.
 * @param {boolean} documentedMedsOnly - Determines whether or not the user can only perform actions on documented medications.
 * @param {boolean} hideMedRec - Determines whether medication reconiciliation controls are hidden.
 * @param {boolean} disallowEOL - Determines whether edit-on-line mode (which allows multi-selection) is disabled.
 * @param {boolean} hideDemo - Determines whether the demographics bar is hidden.
 * @param {boolean} addRxFilter - Determines whether the prescription indicator is set to the default filter.
 * @param {boolean} disableAutoSearch - Determines whether auto search is disabled.
 * @param {boolean} allowRegimen - Determines whether regimens are enabled.
 *
 * @param {boolean} customizeOrder - Determines whether orders are being customized. Either this or customizeMeds must be true, but not both.
 * @param {boolean} customizeMeds - Determines whether medications are being customized. Either this or customizeOrder must be true, but not both.
 *
 * @param {boolean} showNavTree - Determines whether the order navigator tree control is displayed.
 * @param {boolean} showDiagProb - Determines whether the diagnoses/problem control menu is displayed.
 * @param {boolean} showRelatedRes - Determines whether the related results control is displayed.
 * @param {boolean} showOrderSearch - Determines whether the order search menu is displayed. Note that this is required to be true if adding any orders.
 * @param {boolean} showOrderProfile - Determines whether the order profile is displayed.
 * @param {boolean} showScratchpad - Determines whether the scratchpad is displayed. Note that this is required to be true if adding any orders.
 * @param {boolean} showListDetails - Determines whether the order detail control is enabled. Note that this is required to be true if adding any orders.
 *
 * @documentation [POWERORDERS - CREATEMOEW](https://wiki.cerner.com/display/public/MPDEVWIKI/CreateMOEW)
 **/

export type MOEWOpts = {
  signLater: boolean;
  readOnly: boolean;
  allowPowerPlan: boolean;
  allowPowerPlanDoc: boolean;
  allowOnlyInptOutptOrders: boolean;
  showRefreshPrint: boolean;
  documentedMedsOnly: boolean;
  hideMedRec: boolean;
  disallowEOL: boolean;
  hideDemo: boolean;
  addRxFilter: boolean;
  disableAutoSearch: boolean;
  allowRegimen: boolean;

  customizeOrder: boolean;
  customizeMeds: boolean;

  showNavTree: boolean;
  showDiagProb: boolean;
  showRelatedRes: boolean;
  showOrderSearch: boolean;
  showOrderProfile: boolean;
  showScratchpad: boolean;
  showListDetails: boolean;
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

export const submitPowerPlanOrdersAsync = async (opts: MOEWOpts): boolean => {
  // Destructure input, assign default values
  const {
    signLater = false,
    readOnly = false,
    allowPowerPlan = true,
    allowPowerPlanDoc = true,
    allowOnlyInptOutptOrders = false,
    showRefreshPrint = false,
    documentedMedsOnly = false,
    hideMedRec = false,
    disallowEOL = false,
    hideDemo = false,
    addRxFilter = false,
    disableAutoSearch = false,
    allowRegimen = false,

    customizeOrder = true,
    customizeMeds = false,

    showNavTree = true,
    showDiagProb = true,
    showRelatedRes = true,
    showOrderSearch = true,
    showOrderProfile = true,
    showScratchpad = true,
    showListDetails = true,
  } = opts;

  // Calculate the dwCustomizeFlag parameter
  let dwCustomizeFlag = 0;

  if (signLater) {
    dwCustomizeFlag += 1;
  }

  if (readOnly) {
    dwCustomizeFlag += 4;
  }

  if (allowPowerPlan) {
    dwCustomizeFlag += 8;
  }

  if (allowPowerPlanDoc) {
    dwCustomizeFlag += 16;
  }

  if (allowOnlyInptOutptOrders) {
    dwCustomizeFlag += 32;
  }

  if (showRefreshPrint) {
    dwCustomizeFlag += 128;
  }

  if (documentedMedsOnly) {
    dwCustomizeFlag += 256;
  }

  if (hideMedRec) {
    dwCustomizeFlag += 512;
  }

  if (disallowEOL) {
    dwCustomizeFlag += 1024;
  }

  if (hideDemo) {
    dwCustomizeFlag += 2048;
  }

  if (addRxFilter) {
    dwCustomizeFlag += 4096;
  }

  if (disableAutoSearch) {
    dwCustomizeFlag += 8192;
  }

  if (allowRegimen) {
    dwCustomizeFlag += 16384;
  }

  // Calculate the dwTabFlag parameter
  let dwTabFlag = 0;

  if (customizeOrder) {
    dwTabFlag = 2;
  }

  if (customizeMeds) {
    dwTabFlag = 3;
  }

  // Calculate the dwTabDisplayOptionsFlag parameter
  let dwTabDisplayOptionsFlag = 0;

  if (showNavTree) {
    dwTabDisplayOptionsFlag += 1;
  }

  if (showDiagProb) {
    dwTabDisplayOptionsFlag += 2;
  }

  if (showRelatedRes) {
    dwTabDisplayOptionsFlag += 4;
  }

  if (showOrderSearch) {
    dwTabDisplayOptionsFlag += 8;
  }

  if (showOrderProfile) {
    dwTabDisplayOptionsFlag += 16;
  }

  if (showScratchpad) {
    dwTabDisplayOptionsFlag += 32;
  }

  if (showListDetails) {
    dwTabDisplayOptionsFlag += 64;
  }
};
