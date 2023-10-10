import { PowerChartReturn } from '.';
import { outsideOfPowerChartError } from './utils';

/**
 * Add an addendum to an existing document for a given patient and encounter using the
 * DYNDOC Discern COM object. Of note, Cerner PowerChart references the "addendum" action
 * with the "modify" terminology.
 * @param personId {number} - the patient ID to launch the document for
 * @param encounterId {number} - the encounter ID to launch the document in
 * @param eventId {number} - the event ID of the document to modify.
 * @resolves {PowerChartReturn & { success: boolean }} - a `Promise` which resolves to an object
 * containing a boolean indicating whether the user is in PowerChart and a boolean indicating
 * whether the action was successful.
 * @throws {Error} if an unexpected error occurs.
 */

export async function addAddendumToDocumentAsync(
  personId: number,
  encounterId: number,
  eventId: number
): Promise<PowerChartReturn & { success: boolean }> {
  let retVal: PowerChartReturn & { success: boolean } = {
    inPowerChart: true,
    success: false,
  };

  try {
    const dcof = await window.external.DiscernObjectFactory('DYNDOC');
    let response: 0 | 1 | null = null;
    response = await dcof.ModifyExistingDocumentByEventId(
      personId,
      encounterId,
      eventId
    );
    retVal.success = Boolean(response);
  } catch (e) {
    if (outsideOfPowerChartError(e)) {
      retVal.inPowerChart = false;
      return retVal;
    } else {
      throw e;
    }
  }

  return retVal;
}
