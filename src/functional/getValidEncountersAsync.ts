import { PowerChartReturn } from '.';
import { outsideOfPowerChartError } from './utils';

/**
 * Get a list of valid encounter ID's for a given patient.
 * @param personId {number} - the patient ID to get valid encounters for
 * @returns a `Promise<{PowerChartReturn & { encounterIds: Array<number> }}>`.
 * If there are no valid encounters, the `encounterIds` array will be empty.
 */
export async function getValidEncountersAsync(
  personId: number
): Promise<PowerChartReturn & { encounterIds: Array<number> }> {
  const retData: {
    inPowerChart: boolean;
    encounterIds: Array<number>;
  } = {
    inPowerChart: true,
    encounterIds: [],
  };
  try {
    const dcof = await window.external.DiscernObjectFactory('PVCONTXTMPAGE');
    const response = await dcof.GetValidEncounters(personId);
    response.split(',').forEach(e => retData.encounterIds.push(parseFloat(e)));
  } catch (e) {
    if (outsideOfPowerChartError(e)) {
      retData.inPowerChart = false;
    } else {
      throw e;
    }
  }
  return retData;
}
