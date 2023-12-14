import { PowerChartReturn } from '.';
import { outsideOfPowerChartError } from './utils';
/**
 * Create a new document for a given patient and encounter using the
 * DYNDOC Discern COM object. The document can be created using either
 * a reference template ID or a reference template ID and an optional note type code,
 * depending on the chosen method of 'by workflow' or 'by reference template'.
 * @param {'by workflow' | 'by reference template'} method  - the method to use to create the document.
 * @param {number} patientId  - the patient ID to launch the document for.
 * @param {number} encounterId - the encounter ID to launch the document in.
 * @param {number} id - the ID of the reference template or workflow to use to create the document.
 * @param {number} noteTypeCd - (optional) the note type code to use to create the document.
 * @rejects `PowerChartReturn & { success: boolean }`
 * @throws {Error} - an error is thrown if the method provided as an argument is not supported.
 */
export async function createNewDocumentAsync(
  method: 'by workflow' | 'by reference template',
  patientId: number,
  encounterId: number,
  id: number,
  noteTypeCd?: number
): Promise<PowerChartReturn & { success: boolean }> {
  let retVal: PowerChartReturn & { success: boolean } = {
    inPowerChart: true,
    success: false,
  };

  try {
    const dcof = await window.external.DiscernObjectFactory('DYNDOC');

    let response: 0 | 1 | null = null;

    if (method !== 'by workflow' && method !== 'by reference template') {
      throw new Error(`createNewDocumentAsync: ${method} is not supported`);
    }

    if (method === 'by workflow' && noteTypeCd) {
      console.warn(
        'The noteTypeCd is not used when creating a document by workflow.'
      );
    }

    if (method === 'by workflow') {
      response = await dcof.OpenDynDocByWorkFlowId(patientId, encounterId, id);
    }

    if (method === 'by reference template' && !noteTypeCd) {
      response = await dcof.OpenNewDocumentByReferenceTemplateId(
        patientId,
        encounterId,
        id
      );
    }

    if (method === 'by reference template' && noteTypeCd) {
      response = await dcof.OpenNewDocumentByReferenceTemplateIdAndNoteType(
        patientId,
        encounterId,
        id,
        noteTypeCd
      );
    }

    retVal.success = Boolean(response);
  } catch (e) {
    if (outsideOfPowerChartError(e)) {
      retVal.inPowerChart = false;
    } else {
      throw e;
    }
  }

  return retVal;
}
