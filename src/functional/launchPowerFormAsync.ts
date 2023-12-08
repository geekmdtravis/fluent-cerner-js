import { MPageEventReturn } from '.';
import { outsideOfPowerChartError } from './utils';

/**
 * Launch a PowerForm in Cerner's PowerChart.
 * @param {string} target - Determines whether which type of PowerForm action to take
 * upon launch. Choices are: "new form", "completed form", "modify completed form", or
 * "new form search". Cerner context variable: VIS_PowerFormTarget.
 * @param {number} patientId - The identifier for the patient to whom the note belongs.
 * Cerner context variable: PAT_PersonId.
 * @param {number} encounterId - The identifier for the encounter belonging to the patient where
 * this note will be launched. Cerner context variable: VIS_EncntrId.
 * @returns a `Promise` returning an `MPageEventReturn` object containing the `eventString`
 * and `inPowerChart` values. Of note, we cannot provide additional information about the
 * success or failure of the invocation because this information is not provided by the
 * underlying Discern native function call's return, which awlays returns `null` no matter
 * the outcome of the call.
 * @param {number} targetId - (optional) For a new form, this is the formId (pulled from DCP_FORMS_REF_ID).
 * For a completed form, this is the activityId (pulled from DCP_FORMS_ACTIVITY_ID). This parameter is
 * required for all targets except "new form search".
 * @throws if there is a type mismatch between the provided option for `target` and `targetId`,
 * or if an unexpected error has occured.
 *
 * @documentation [MPAGES_EVENT - POWERFORM](https://wiki.cerner.com/display/public/MPDEVWIKI/MPAGES_EVENT+-+POWERFORM)
 **/
export const launchPowerFormAsync = async (
  target: 'modify form' | 'new form' | 'new form search' | 'view form',
  patientId: number,
  encounterId: number,
  targetId?: number
): Promise<MPageEventReturn> => {
  const requiresTargetId =
    target === 'new form' || target === 'view form' || target === 'modify form';

  if (requiresTargetId && !targetId) {
    throw new Error(
      "'targetId' is required for all targets except 'new form search'."
    );
  }

  const params: Array<string> = [`${patientId}`, `${encounterId}`];
  switch (target) {
    case 'new form':
      params.push(`${targetId}`);
      params.push('0');
      break;
    case 'view form':
    case 'modify form':
      params.push('0');
      params.push(`${targetId}`);
      break;
    case 'new form search':
      params.push('0');
      params.push('0');
      break;
  }

  params.push(target === 'view form' ? '1' : '0');

  const retData: MPageEventReturn = {
    eventString: `${params.join('|')}`,
    inPowerChart: true,
  };

  try {
    await window.external.MPAGES_EVENT('POWERFORM', retData.eventString);
  } catch (e) {
    if (outsideOfPowerChartError(e)) {
      retData.inPowerChart = false;
      console.warn(
        `window.MPAGES_EVENT('POWERFORM', '${retData.eventString}')`
      );
    } else {
      throw e;
    }
  }

  return retData;
};
