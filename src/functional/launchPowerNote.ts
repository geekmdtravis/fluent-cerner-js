import { MPageEventReturn } from '.';
import { outsideOfPowerChartError } from '../utils';

/**
 * Launch a PowerNote in Cerner's PowerChart.
 * @param {number} patientId - The identifier for the patient to whom the note belongs.
 * Cerner context variable: PAT_PersonId.
 * @param {number} encounterId - The identifier for the encounter belonging to the patient where
 * this note will be launched. Cerner context variable: VIS_EncntrId.
 * @param {string} target - Determines whether to target (open) a "new" PowerNote or an "existing" PowerNote.
 * @param {number | string} targetId - For a `new` note, this value should be a `string` representing the
 * CKI value for an encounter pathway. For an `existing` note, this value should be a `number` representing
 * the eventId of the note to be opened.
 * corresponds to an encounter pathway.
 * @param {number} eventId - (exclusive option to CKI) An event_id for an existing PowerNote to load.
 * @returns a `Promise` returning an `MPageEventReturn` object containing the `eventString`
 * and `inPowerChart` values. Of note, we cannot provide additional information about the
 * success or failure of the invocation because this information is not provided by the
 * underlying Discern native function call's return, which awlays returns `null` no matter
 * the outcome of the call.
 * @throws if there is a type mismatch between the provided option for `target` and `targetId`,
 * or if an unexpected error has occured.
 *
 * @documentation [MPAGES_EVENT - POWERNOTE](https://wiki.cerner.com/display/public/MPDEVWIKI/MPAGES_EVENT+-+POWERNOTE)
 **/
export const launchPowerNoteAsync = async (
  patientId: number,
  encounterId: number,
  target: 'new' | 'existing',
  targetId: string | number
): Promise<MPageEventReturn> => {
  if (target === 'new' && typeof targetId !== 'string') {
    throw new Error(
      'targetId (for CKI) must be a string when launching a new PowerNote.'
    );
  }

  if (target === 'existing' && typeof targetId !== 'number') {
    throw new Error(
      'targetId must be a number when loading an existing PowerNote.'
    );
  }
  const params: Array<string> = [
    `${patientId}`,
    `${encounterId}`,
    `${target === 'new' ? targetId : ''}`,
    `${target === 'existing' ? targetId : 0}`,
  ];

  const eventString = `${params.join('|')}`;
  let inPowerChart = true;
  try {
    await window.external.MPAGES_EVENT('POWERNOTE', eventString);
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
