import { PowerChartReturn } from '.';
import { outsideOfPowerChartError } from '../utils';

/**
 *
 * @param pid {number} - the patient ID to get valid encounters for.
 * @param eid {number} - the encounter ID to get valid encounters for.
 * @param providerPid {number} - the provider ID to get valid encounters for.
 * @returns a `Promise` of `PowerChartReturn` which includes a boolean indicating
 * whether the user is in PowerChart.
 * @throws `Error` if an unexpected error occurs.
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
    } else {
      retData.inPowerChart = false;
      throw e;
    }
  }
  return retData;
}
