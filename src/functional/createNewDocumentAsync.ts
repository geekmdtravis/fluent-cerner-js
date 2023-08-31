import { PowerChartReturn } from '.';
import { outsideOfPowerChartError } from '../utils';

export type NewDocumentOpts = {
  eid: number;
  pid: number;
  refTemplateId?: number;
  noteTypeCd?: number;
  workflowId?: number;
};

/**
 * Create a new document for a given patient and encounter using the
 * DYNDOC Discern COM object. The document can be created using either
 * a reference template ID or a reference template ID and an optional note type code,
 * depending on the chosen method of 'by workflow' or 'by reference template'.
 * @param method {'by workflow' | 'by reference template'} - the method to use to create the document
 * @param opts {NewDocumentOpts} - an object containing the patient ID, encounter ID, and either a
 * reference template ID (plus or minus an optional note type CD), or a workflow ID.
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
  opts: NewDocumentOpts
): Promise<PowerChartReturn & { success: boolean }> {
  const { eid, pid, refTemplateId, noteTypeCd, workflowId } = opts;

  if (!refTemplateId && !workflowId) {
    throw new Error(
      'Either a reference template ID or a workflow ID must be provided.'
    );
  }

  if (refTemplateId && workflowId) {
    throw new Error(
      'Only one of a reference template ID or a workflow ID can be provided, exclusively.'
    );
  }

  if (method === 'by workflow' && !workflowId) {
    throw new Error(
      'A workflow ID must be provided when creating a document by workflow.'
    );
  }

  if (method === 'by reference template' && !refTemplateId) {
    throw new Error(
      'A reference template ID must be provided when creating a document by reference template.'
    );
  }

  if (method === 'by workflow' && noteTypeCd) {
    console.warn(
      'A note type code was provided, but it will be ignored when creating a document by workflow'
    );
  }

  if (method === 'by reference template' && workflowId) {
    console.warn(
      'A workflow ID was provided, but it will be ignored when creating a document by reference template'
    );
  }

  let retVal: PowerChartReturn & { success: boolean } = {
    inPowerChart: true,
    success: false,
  };

  if (method === 'by workflow' && workflowId) {
    try {
      const dcof = await window.external.DiscernObjectFactory('DYNDOC');
      let response: 0 | 1 | null = null;
      response = await dcof.OpenDynDocByWorkFlowId(pid, eid, workflowId);
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

  if (method === 'by reference template' && refTemplateId) {
    try {
      const dcof = await window.external.DiscernObjectFactory('DYNDOC');
      let response: 0 | 1 | null = null;
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
