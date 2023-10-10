import { MPageEventReturn } from '.';
import { outsideOfPowerChartError } from './utils';

/**
 * A type which represents the parameters to be be passed into the launchPowerForm() function.
 * @param {number} patientId - The identifier for the patient to whom the note belongs.
 * Cerner context variable: PAT_PersonId.
 * @param {number} encounterId - The identifier for the encounter belonging to the patient where
 * this note will be launched. Cerner context variable: VIS_EncntrId.
 * @param {string} target - Determines whether to target (open) a "new form" of a specified
 * type, a "completed form", or a "new form search" box.
 * @param {number} targetId - (optional) For a new form, this is the formId (pulled from DCP_FORMS_REF_ID).
 * For a completed form, this is the activityId (pulled from DCP_FORMS_ACTIVITY_ID). This parameter is
 * required only for `new form` or `completed form` targets.
 * @param {string} permissions - (optional) The permissions to open the document with. Choices
 * are: "modify" or "read-only". When not provided, defaults to "read-only".
 *
 * @documentation [MPAGES_EVENT - POWERFORM](https://wiki.cerner.com/display/public/MPDEVWIKI/MPAGES_EVENT+-+POWERFORM)
 **/
export type PowerFormOpts = {
  patientId: number;
  encounterId: number;
  target: 'new form' | 'completed form' | 'new form search';
  targetId?: number;
  permissions?: 'modify' | 'read only';
};

/**
 * Launch a PowerForm in Cerner's PowerChart.
 * @param {PowerFormOpts} opts - The parameters passed, as specified in `PowerFormOpts`
 * @returns a `Promise` returning an `MPageEventReturn` object containing the `eventString`
 * and `inPowerChart` values. Of note, we cannot provide additional information about the
 * success or failure of the invocation because this information is not provided by the
 * underlying Discern native function call's return, which awlays returns `null` no matter
 * the outcome of the call.
 * @throws if there is a type mismatch between the provided option for `target` and `targetId`,
 * or if an unexpected error has occured.
 *
 * @documentation [MPAGES_EVENT - POWERFORM](https://wiki.cerner.com/display/public/MPDEVWIKI/MPAGES_EVENT+-+POWERFORM)
 **/
export const launchPowerFormAsync = async (
  opts: PowerFormOpts
): Promise<MPageEventReturn> => {
  const {
    patientId: personId,
    encounterId,
    target,
    targetId,
    permissions,
  } = opts;

  if ((target === 'new form' || target === 'completed form') && !targetId) {
    throw new Error(
      "'targetId' is required for 'new form' and 'completed form' targets."
    );
  }

  const params: Array<string> = [`${personId}`, `${encounterId}`];
  if (target === 'new form') {
    params.push(`${targetId}`);
    params.push('0');
  }
  if (target === 'completed form') {
    params.push('0');
    params.push(`${targetId}`);
  }
  if (target === 'new form search') {
    params.push('0');
    params.push('0');
  }
  params.push(permissions === 'modify' ? '0' : '1');

  let inPowerChart = true;
  const eventString = `${params.join('|')}`;

  try {
    await window.external.MPAGES_EVENT('POWERFORM', eventString);
  } catch (e) {
    if (outsideOfPowerChartError(e)) {
      inPowerChart = false;
      console.warn(`window.MPAGES_EVENT('POWERFORM', '${eventString}')`);
    } else {
      throw e;
    }
  }

  return { inPowerChart, eventString };
};
