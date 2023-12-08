import { PowerChartReturn } from '.';
import { outsideOfPowerChartError } from './utils';

/**
 * Launch Discharge Process dialog for a given patient and encounter.
 * @returns a `Promise<PowerChartReturn>`.
 */
export async function launchDischargeProcessAsync(): Promise<PowerChartReturn> {
  const retData: PowerChartReturn = {
    inPowerChart: true,
  };
  try {
    const dcof = await window.external.DiscernObjectFactory('DISCHARGEPROCESS');
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
