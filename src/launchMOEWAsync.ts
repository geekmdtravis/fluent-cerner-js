import {
  SubmitOrderAsyncOpts,
  SubmitOrderAsyncReturn,
  submitOrdersAsync,
} from './submitOrdersAsync';

/**
 * Options for launching the Modal Order Entry Window (MOEW) without adding orders.
 * @param targetTab - The tab to launch. Defaults to `power orders`.
 * @param launchView - The view to display by default. Defaults to `search`.
 * @param dryRun - If set to true, returns the generated event string without invoking PowerChart.
 */
export type LaunchMOEWAsyncOpts = Omit<SubmitOrderAsyncOpts, 'signSilently'>;

/**
 * Launches the Modal Order Entry Window (MOEW) without adding orders.
 * This uses the Cerner-documented launch-only order token, `{ORDER|0|0|0|0|0}`,
 * through the `MPAGES_EVENT("ORDERS", ...)` route.
 * @param patientId - The identifier for the patient. Cerner context variable: PAT_PersonId.
 * @param encounterId - The identifier for the encounter. Cerner context variable: VIS_EncntrId.
 * @param opts - Optional display settings for the MOEW.
 * @resolves `SubmitOrderAsyncReturn`
 */
export const launchMOEWAsync = async (
  patientId: number,
  encounterId: number,
  opts?: LaunchMOEWAsyncOpts
): Promise<SubmitOrderAsyncReturn> => {
  const {
    targetTab = 'power orders',
    launchView = 'search',
    dryRun,
  } = opts || {};

  return submitOrdersAsync(patientId, encounterId, [], {
    targetTab,
    launchView,
    dryRun,
    signSilently: false,
  });
};
