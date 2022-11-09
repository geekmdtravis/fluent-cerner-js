import { MPageEventReturn } from '.';
import { outsideOfPowerChartError } from '../utils';

/**
 * A type alias with the purpose of limiting the set of view flags available.
 */
export type ViewFlag =
  | 'menu'
  | 'buttons'
  | 'toolbar'
  | 'calculator'
  | 'view-only';

// TODO: Determine which of these fields are required and which are optional. Understand what each is.
/**
 * A type which represents the parameters to be be passed into the launchClinicalNote() function
 * @param {number} personId - The personId of the patient to whom the note is regarding.
 * @param {number} encounterId - The encounterId of the encounter for the patient to which the note is regarding.
 * @param {Array<number>} eventIds - An array of event_ids of the clinical note(s) to be displayed.
 * @param {string} windowTitle - The text to be displayed in the first section of the title for the Clinical Notes window.
 * @param {Array<ViewFlag>} viewOptionFlags - A set of flags that can be used to define the style of the Clinical Notes window. Example: ["menu", "buttons", "toolbar", calculator", "view-only"]
 * @param {string} viewName - The view name for the view-level preference of the tab to model the preferences after.
 * @param {number} viewSeq - The view sequence for the view-level preference of the tab to model the preferences after. An invalid viewSeq loads the clinical note with the default preferences.
 * @param {string} compName - The component name for the component-level preference of the tab to model the preferences after. An invalid compName loads the clinical note with the default preferences.
 * @param {number} compSeq - 	The component sequence for the component-level preference of the tab to model the preferences after. An invalid compSeq loads the clinical note with the default preferences.
 **/
export type ClinicalNoteOpts = {
  personId: number;
  encounterId: number;
  eventIds: Array<number>;
  windowTitle: string;
  viewOptionFlags: Array<ViewFlag>;
  viewName: string;
  viewSeq: number;
  compName: string;
  compSeq: number;
};

/**
 * A function to launch a clinical note, which returns an object of `MPageEventReturn`
 * @param {ClinicalNoteOpts} opts - The parameters passed, as specified in `ClinicalNoteOpts`
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
    viewName,
    viewSeq,
    compName,
    compSeq,
  } = opts;
  let inPowerChart = true;
  const params: Array<string> = [`${personId}`, `${encounterId}`];

  params.push(`[${eventIds.join('|')}]`);
  params.push(`${windowTitle}`);
  params.push(`${calculateViewOptionFlag(viewOptionFlags)}`);
  params.push(`${viewName}`);
  params.push(`${viewSeq}`);
  params.push(`${compName}`);
  params.push(`${compSeq}`);

  const eventString = `${params.join('|')}`;
  try {
    window.MPAGES_EVENT('CLINICALNOTE', eventString);
  } catch (e) {
    if (outsideOfPowerChartError(e)) {
      inPowerChart = false;
      console.warn(`window.MPAGES_EVENT('CLINICALNOTE', ${eventString})`);
    } else {
      throw e;
    }
  }

  return { inPowerChart, eventString };
};

function calculateViewOptionFlag(viewOptionFlags: Array<ViewFlag>): number {
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
