import { outsideOfPowerChartError } from '../utils';

/**
 * A type which represents the parameters to be be passed into the launchPowerForm() function.
 * @param {number} personId - The identifier for the patient to whom the note belongs.
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
  personId: number;
  encounterId: number;
  target: 'new form' | 'completed form' | 'new form search';
  targetId?: number;
  permissions?: 'modify' | 'read only';
};

/**
 * A type which represents the object to be returned from the launchClinicalNote() function.
 * @param {string} eventString - The string version of the MPageEvent
 * @param {boolean} inPowerChart - Returns `true` if being run from inside of PowerChart and returns `false` otherwise.
 *
 * @documentation [MPAGES_EVENT - POWERFORM](https://wiki.cerner.com/display/public/MPDEVWIKI/MPAGES_EVENT+-+POWERFORM)
 **/
export type MPageEventReturn = {
  eventString: string;
  inPowerChart: boolean;
};

/**
 * A function to launch a power form, which returns an object of `MPageEventReturn`
 * @param {PowerFormOpts} opts - The parameters passed, as specified in `PowerFormOpts`
 * @returns {MPageEventReturn} - An object containing the `eventString` and `inPowerChart` values.
 *
 * @documentation [MPAGES_EVENT - POWERFORM](https://wiki.cerner.com/display/public/MPDEVWIKI/MPAGES_EVENT+-+POWERFORM)
 **/
export const launchPowerForm = (opts: PowerFormOpts): MPageEventReturn => {
  const { personId, encounterId, target, targetId, permissions } = opts;

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
    window.MPAGES_EVENT('POWERFORM', eventString);
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
