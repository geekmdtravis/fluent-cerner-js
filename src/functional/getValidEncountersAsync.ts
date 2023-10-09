import { PowerChartReturn } from '.';
import { outsideOfPowerChartError } from './utils';

/**
 * Get a list of valid encounter ID's for a given patient.
 * @param pid {number} - the patient ID to get valid encounters for
 * @returns a `Promise` which resolves to an object containing an array of valid encounter IDs
 * and a boolean indicating whether the user is in PowerChart
 * @throws `Error` if an unexpected error occurs, and a `RangeError` if the provided
 * patient ID is not a positive integer greater than zero.
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
  if (pid < 1) {
    throw new RangeError('The patient ID must be a positive integer.');
  }
  try {
    const dcof = await window.external.DiscernObjectFactory('PVCONTXTMPAGE');
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
