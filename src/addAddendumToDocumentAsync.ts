import { PowerChartReturn } from '.';
import { outsideOfPowerChartError } from './utils';

/**
 * Add an addendum to an existing document for a given patient and encounter using the
 * DYNDOC Discern COM object. Of note, Cerner PowerChart refers the "addendum" action
 * with the "modify" terminology.
 * @param {number} patientId  - the patient ID to launch the document for
 * @param {number} encounterId - the encounter ID to launch the document in
 * @param {number} eventId  - the event ID of the document to modify.
 * @resolves `PowerChartReturn & { success: boolean }`.
 */

export async function addAddendumToDocumentAsync(
  patientId: number,
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
      patientId,
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
