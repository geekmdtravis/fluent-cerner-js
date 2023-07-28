import { PowerChartReturn } from '.';
import { outsideOfPowerChartError } from '../utils';

/**
 * Launch Patient Education for a given patient and encounter.
 * @param pid {number} - the patient ID to get valid encounters for.
 * @param eid  {number} - the encounter ID to get valid encounters for.
 * @param tab  {'instruction' | 'follow-up'} - the tab to target upon opening.
 * @returns a `Promise` of `PowerChartReturn` which includes a boolean indicating
 * whether the user is in PowerChart.
 * @throws `Error` if an unexpected error occurs, and a `RangeError` if the provided
 * patient ID or encounter ID is not a positive integer greater than zero.
 */
export async function launchPatientEducationAsync(
  pid: number,
  eid: number,
  tab: 'instruction' | 'follow-up'
): Promise<PowerChartReturn> {
  const retData: PowerChartReturn = {
    inPowerChart: true,
  };
  if (pid < 1) {
    throw new RangeError('The patient ID must be a positive integer.');
  }
  if (eid < 1) {
    throw new RangeError('The encounter ID must be a positive integer.');
  }
  try {
    const dcof = await window.DiscernObjectFactory('PATIENTEDUCATION');
    await dcof.SetPatient(pid, eid);
    await dcof.SetDefaultTab(tab === 'instruction' ? 0 : 1);
    await dcof.DoModal();
  } catch (e) {
    if (outsideOfPowerChartError(e)) {
      return {
        inPowerChart: false,
      };
    } else {
      throw e;
    }
  }
  return retData;
}
