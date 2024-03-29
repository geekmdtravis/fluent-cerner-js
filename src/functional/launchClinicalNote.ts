import { MPageEventReturn } from '.';
import { outsideOfPowerChartError } from '../utils';

/**
 * Available options for the Clinical Note view.
 *
 * @documentation [MPAGES_EVENT - CLINICAL NOTE](https://wiki.cerner.com/display/public/MPDEVWIKI/MPAGES_EVENT+-+CLINICALNOTE)
 */
export type ViewOption =
  | 'menu'
  | 'buttons'
  | 'toolbar'
  | 'calculator'
  | 'view-only';

/**
 * Launches a clinical note in PowerChart inhereting the preferences of the component and view described below.
 * If any of the values is invalid, it will use the default values.
 * @param {string} viewName - The view name for the view-level preference of the tab to model the preferences after.
 * @param {number} viewSeq - The view sequence for the view-level preference of the tab to model the
 * preferences after. An invalid viewSeq loads the clinical note with the default preferences.
 * @param {string} compName - The component name for the component-level preference of the tab to model the
 * preferences after. An invalid compName loads the clinical note with the default preferences.
 * @param {number} compSeq - 	The component sequence for the component-level preference of the tab to model
 * the preferences after. An invalid compSeq loads the clinical note with the default preferences.
 *
 * @documentation [MPAGES_EVENT - CLINICAL NOTE](https://wiki.cerner.com/display/public/MPDEVWIKI/MPAGES_EVENT+-+CLINICALNOTE)
 */
export type InheretanceProps = {
  viewName: string;
  viewSeq: number;
  compName: string;
  compSeq: number;
};

/**
 * A type which represents the parameters to be be passed into the launchClinicalNote() function.
 * @param {number} personId - The identifier for the patient to whom the note belongs.
 * Cerner context variable: PAT_PersonId.
 * @param {number} encounterId - The identifier for the encounter belonging to the patient where
 * this note will be launched. Cerner context variable: VIS_EncntrId.
 * @param {Array<number>} eventIds - An array of `event_id`'s of the clinical note(s) to be displayed.
 * @param {string} windowTitle - The text to be displayed in the first section of the title for the
 * Clinical Notes window.
 * @param {Array<ViewOption>} viewOptionFlags - (optional) View options for the Clinical Notes window.
 * If not provided, defaults to `view-only` with no other options.
 * @param {InheretanceProps} inheritanceProps - (optional) The view and component names and sequences
 * to be used for the Clinical Notes window. If not provided, uses default preferences.
 *
 * @documentation [MPAGES_EVENT - CLINICAL NOTE](https://wiki.cerner.com/display/public/MPDEVWIKI/MPAGES_EVENT+-+CLINICALNOTE)
 **/
export type ClinicalNoteOpts = {
  personId: number;
  encounterId: number;
  eventIds: Array<number>;
  windowTitle: string;
  viewOptionFlags?: Array<ViewOption>;
  inheritanceProps?: InheretanceProps;
};

/**
 * Launch a ClinicalNote in Cerner's PowerChart.
 * @param {ClinicalNoteOpts} opts - The parameters passed, as specified in `ClinicalNoteOpts`
 * @returns {MPageEventReturn} - An object containing the `eventString` and `inPowerChart` values.
 *
 * @documentation [MPAGES_EVENT - CLINICAL NOTE](https://wiki.cerner.com/display/public/MPDEVWIKI/MPAGES_EVENT+-+CLINICALNOTE)
 **/
export const launchClinicalNote = (
  opts: ClinicalNoteOpts
): MPageEventReturn => {
  const {
    personId,
    encounterId,
    eventIds,
    windowTitle,
    viewOptionFlags,
  } = opts;
  const { viewName, viewSeq, compName, compSeq } = opts.inheritanceProps || {};

  let inPowerChart = true;
  const params: Array<string> = [`${personId}`, `${encounterId}`];

  const _viewOptsFlags: Array<ViewOption> =
    !viewOptionFlags || viewOptionFlags.length === 0
      ? ['view-only']
      : viewOptionFlags;

  params.push(`[${eventIds.join('|')}]`);
  params.push(`${windowTitle}`);
  params.push(`${calculateViewOptionFlag(_viewOptsFlags)}`);
  params.push(`${viewName || ''}`);
  params.push(`${viewSeq || ''}`);
  params.push(`${compName || ''}`);
  params.push(`${compSeq || ''}`);

  const eventString = `${params.join('|')}`;
  try {
    window.MPAGES_EVENT('CLINICALNOTE', eventString);
  } catch (e) {
    if (outsideOfPowerChartError(e)) {
      inPowerChart = false;
      console.warn(`window.MPAGES_EVENT('CLINICALNOTE', '${eventString}')`);
    } else {
      throw e;
    }
  }

  return { inPowerChart, eventString };
};

function calculateViewOptionFlag(viewOptionFlags: Array<ViewOption>): number {
  let total = 0;
  viewOptionFlags.forEach(flag => {
    if (flag === 'menu') total += 1;
    if (flag === 'buttons') total += 2;
    if (flag === 'toolbar') total += 4;
    if (flag === 'calculator') total += 8;
    if (flag === 'view-only') total += 16;
  });
  return total;
}
