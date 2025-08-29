import { PowerChartReturn } from '.';
import { outsideOfPowerChartError } from './utils';

/**
 * Launch Discharge Process dialog for a given patient and encounter.
 * @resolves `PowerChartReturn`
 */
export async function launchDischargeProcessAsync(
  patientId: number,
  encounterId: number,
  providerId: number
): Promise<PowerChartReturn> {
  const retData: PowerChartReturn = {
    inPowerChart: true,
  };
  try {
    const dcof = await window.external.DiscernObjectFactory('DISCHARGEPROCESS');
    dcof.person_id = patientId;
    dcof.encounter_id = encounterId;
    dcof.user_id = providerId;
    dcof.LaunchDischargeDialog();
  } catch (e) {
    if (outsideOfPowerChartError(e)) {
      retData.inPowerChart = false;
    } else {
      throw e;
    }
  }
  return retData;
}
