import { outsideOfPowerChartError } from '../utils';

/**
 * A type which represents the parameters to be be passed into the launchPowerForm() function.
 * @param {number} personId - The person_id of the patient whose power form is to be displayed.
 * @param {number} encounterId - The encntr_id of the patient whose power form is to be displayed.
 * @param {string} target - Determines whether to target the "form", "activity", or the "ad hoc" charting dialog box.
 * @param {number} targetId - The id number of the target document -- required only for `form` or `activity` targets.
 * @param {string} permissions - The permissions to open the document with. Choices are "modify" or "read-only".
 **/
export type PowerFormOpts = {
  personId: number;
  encounterId: number;
  target: 'form' | 'activity' | 'ad hoc';
  targetId?: number;
  permissions: 'modify' | 'read only';
};

/**
 * A type which represents the object to be returned from the launchClinicalNote() function.
 * @param {string} eventString - The string version of the MPageEvent
 * @param {boolean} inPowerChart - Returns `true` if being run from inside of PowerChart and returns `false` otherwise.
 **/
export type MPageEventReturn = {
  eventString: string;
  inPowerChart: boolean;
};

/**
 * A function to launch a power form, which returns an object of `MPageEventReturn`
 * @param {PowerFormOpts} opts - The parameters passed, as specified in `PowerFormOpts`
 * @returns {MPageEventReturn} - An object containing the `eventString` and `inPowerChart` values.
 **/
export const launchPowerForm = (opts: PowerFormOpts): MPageEventReturn => {
  const { personId, encounterId, target, targetId, permissions } = opts;

  if ((target === 'form' || target === 'activity') && !targetId) {
    throw new Error(
      "'targetId' is required for 'form' and 'activity' targets."
    );
  }

  const params: Array<string> = [`${personId}`, `${encounterId}`];
  if (target === 'form') {
    params.push(`${targetId}`);
    params.push('0');
  }
  if (target === 'activity') {
    params.push('0');
    params.push(`${targetId}`);
  }
  if (target === 'ad hoc') {
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
