import { PowerChartReturn } from '.';
import { outsideOfPowerChartError } from './utils';

/**
 * Launch Patient Education for a given patient and encounter.
 * @param patientId {number} - the patient ID to get valid encounters for.
 * @param encounterId  {number} - the encounter ID to get valid encounters for.
 * @param targetTab  {'instruction' | 'follow-up'} - the tab to target upon opening.
 * @resolves a `PowerChartReturn`.
 */
export async function launchPatientEducationAsync(
  patientId: number,
  encounterId: number,
  targetTab: 'instruction' | 'follow-up'
): Promise<PowerChartReturn> {
  const retData: PowerChartReturn = {
    inPowerChart: true,
  };
  try {
    const dcof = await window.external.DiscernObjectFactory('PATIENTEDUCATION');
    await dcof.SetPatient(patientId, encounterId);
    await dcof.SetDefaultTab(targetTab === 'instruction' ? 0 : 1);
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
