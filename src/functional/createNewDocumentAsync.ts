import { PowerChartReturn } from '.';
import { outsideOfPowerChartError } from '../utils';

/**
 * Create a new document for a given patient and encounter using the
 * DYNDOC Discern COM object. The document can be created using either
 * a reference template ID or a reference template ID and an optional note type code.
 * @param pid {number} - the patient ID to launch the document for
 * @param eid {number} - the encounter ID to launch the document in
 * @param refTemplateId {number} - the reference template ID of the document to launch
 * @param noteTypeCd {number} - (optional) the note type code of the document to launch
 * @resolves {PowerChartReturn & { success: boolean }} - a `Promise` which resolves to an object
 * containing a boolean indicating whether the user is in PowerChart and a boolean indicating
 * whether the action was successful.
 * @throws {Error} if an unexpected error occurs.
 */
export async function createNewDocumentAsync(
  pid: number,
  eid: number,
  refTemplateId: number,
  noteTypeCd?: number
): Promise<PowerChartReturn & { success: boolean }> {
  let retVal: PowerChartReturn & { success: boolean } = {
    inPowerChart: true,
    success: false,
  };

  const dcof = await window.external.DiscernObjectFactory('DYNDOC');
  let response: 0 | 1 | null = null;

  try {
    if (noteTypeCd) {
      response = await dcof.OpenNewDocumentByReferenceTemplateIdAndNoteType(
        pid,
        eid,
        refTemplateId,
        noteTypeCd
      );
    } else {
      response = await dcof.OpenNewDocumentByReferenceTemplateId(
        pid,
        eid,
        refTemplateId
      );
      if (response === 1) {
        retVal.success = true;
      }
    }
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
