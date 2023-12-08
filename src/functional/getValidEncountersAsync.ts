import { PowerChartReturn } from '.';
import { outsideOfPowerChartError } from './utils';

/**
 * Get a list of valid encounter ID's for a given patient.
 * @param {number} personId  - the patient ID to get valid encounters for
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
    const eidStr = response.trim();
    if (eidStr === '') return retData;
    eidStr.split(',').forEach(e => {
      const eid = parseFloat(e);
      if (isNaN(eid)) {
        console.warn(
          `getValidEncountersAsync: encounter ID ${e} could not be parsed to a number.`
        );
      } else {
        retData.encounterIds.push(eid);
      }
    });
  } catch (e) {
    if (outsideOfPowerChartError(e)) {
      retData.inPowerChart = false;
    } else {
      throw e;
    }
  }
  return retData;
}
