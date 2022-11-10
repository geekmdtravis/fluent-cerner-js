import { MPageEventReturn } from '.';
import { outsideOfPowerChartError } from '../utils';

/**
 * A type which represents the parameters to be be passed into the launchPowerNote() function.
 * @param {number} personId - The person_id of the patient whose power note is to be displayed.
 * @param {number} encounterId - The encntr_id of the patient whose power note is to be displayed.
 * @param {string} CKI - (exclusive option to eventID) A CKI value for a new PowerNote that corresponds to an encounter pathway.
 * @param {number} eventId - (exclusive option to CKI) An event_id for an existing PowerNote to load.
 **/
export type PowerNoteOpts = {
  personId: number;
  encounterId: number;
  CKI?: string;
  eventId?: number;
};

/**
 * A function to launch a power note, which returns an object of `MPageEventReturn`
 * @param {PowerNoteOpts} opts - The parameters passed, as specified in `PowerNoteOpts`
 * @returns {MPageEventReturn} - An object containing the `eventString` and `inPowerChart` values.
 **/
export const launchPowerNote = (opts: PowerNoteOpts): MPageEventReturn => {
  const { personId, encounterId, CKI, eventId } = opts;

  if (!CKI && !eventId)
    throw new Error("Either 'CKI' or 'eventId' is required.");

  const params: Array<string> = [
    `${personId}`,
    `${encounterId}`,
    `${(!eventId && CKI) || ''}`,
    `${eventId || 0}`,
  ];

  const eventString = `${params.join('|')}`;
  let inPowerChart = true;
  try {
    window.MPAGES_EVENT('POWERNOTE', eventString);
  } catch (e) {
    if (outsideOfPowerChartError(e)) {
      inPowerChart = false;
      console.warn(`window.MPAGES_EVENT('POWERNOTE', '${eventString}')`);
    } else {
      throw e;
    }
  }

  return { eventString, inPowerChart };
};
