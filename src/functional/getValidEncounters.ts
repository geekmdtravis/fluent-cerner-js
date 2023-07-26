import { PowerChartReturn } from '.';
import { outsideOfPowerChartError } from '../utils';

/**
 *
 * @param pid {number} - the patient ID to get valid encounters for
 * @returns
 */
export async function getValidEncountersAsync(
  pid: number
): Promise<PowerChartReturn & { encounterIds: Array<number> }> {
  const retData: {
    inPowerChart: boolean;
    encounterIds: Array<number>;
  } = {
    inPowerChart: true,
    encounterIds: [],
  };
  try {
    const dcof = new window.DiscernObjectFactory('PVCONTXTMPAGE');
    const response = await dcof.GetValidEncounters(pid);
    response.split(',').forEach(e => retData.encounterIds.push(parseFloat(e)));
  } catch (e) {
    if (outsideOfPowerChartError(e)) {
      return {
        inPowerChart: false,
        encounterIds: [],
      };
    } else {
      throw e;
    }
  }
  return retData;
}
