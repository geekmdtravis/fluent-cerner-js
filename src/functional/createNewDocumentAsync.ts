import { PowerChartReturn } from '.';
import { outsideOfPowerChartError } from '../utils';
/**
 * Create a new document for a given patient and encounter using the
 * DYNDOC Discern COM object. The document can be created using either
 * a reference template ID or a reference template ID and an optional note type code,
 * depending on the chosen method of 'by workflow' or 'by reference template'.
 * @param method {'by workflow' | 'by reference template'} - the method to use to create the document.
 * @param personId {number} - the patient ID to launch the document for.
 * @param encounterId {number} - the encounter ID to launch the document in.
 * @param id {number} - the ID of the reference template or workflow to use to create the document.
 * @param noteTypeCd {number} - (optional) the note type code to use to create the document.
 * @resolves {PowerChartReturn & { success: boolean }} - a `Promise` which resolves to an object
 * containing a boolean indicating whether the user is in PowerChart and a boolean indicating
 * whether the action was successful.
 * @throws {Error} if an unexpected error occurs.
 * @throws {Error} if neither a reference template ID nor a workflow ID is provided.
 * @throws {Error} if both a reference template ID and a workflow ID are provided.
 * @throws {Error} if a workflow ID is not provided when creating a document by workflow.
 * @throws {Error} if a reference template ID is not provided when creating a document by reference template.
 */
export async function createNewDocumentAsync(
  method: 'by workflow' | 'by reference template',
  personId: number,
  encounterId: number,
  id: number,
  noteTypeCd?: number
): Promise<PowerChartReturn & { success: boolean }> {
  if (method === 'by workflow' && noteTypeCd) {
    console.warn(
      'A note type code was provided, but it will be ignored when creating a document by workflow'
    );
  }

  let retVal: PowerChartReturn & { success: boolean } = {
    inPowerChart: true,
    success: false,
  };

  if (method === 'by workflow') {
    try {
      const dcof = await window.external.DiscernObjectFactory('DYNDOC');
      let response: 0 | 1 | null = null;
      response = await dcof.OpenDynDocByWorkFlowId(personId, encounterId, id);
      if (response === 1) {
        retVal.success = true;
      }
      return retVal;
    } catch (e) {
      if (outsideOfPowerChartError(e)) {
        retVal.inPowerChart = false;
        return retVal;
      } else {
        throw e;
      }
    }
  }

  if (method === 'by reference template') {
    try {
      const dcof = await window.external.DiscernObjectFactory('DYNDOC');
      let response: 0 | 1 | null = null;
      if (noteTypeCd) {
        response = await dcof.OpenNewDocumentByReferenceTemplateIdAndNoteType(
          personId,
          encounterId,
          id,
          noteTypeCd
        );
      } else {
        response = await dcof.OpenNewDocumentByReferenceTemplateId(
          personId,
          encounterId,
          id
        );
        if (response === 1) {
          retVal.success = true;
        }
      }
      return retVal;
    } catch (e) {
      if (outsideOfPowerChartError(e)) {
        retVal.inPowerChart = false;
        return retVal;
      } else {
        throw e;
      }
    }
  }
  throw new Error(
    `An unexpected error occurred when attempting to create a new document by ${method}.`
  );
}
