import { PowerChartReturn } from '.';
import { outsideOfPowerChartError } from '../utils';

/**
 *
 * @param pid {number} - the patient ID to launch the document for
 * @param eid {number} - the encounter ID to launch the document in
 * @param action {'modify' | 'open by workflow'} - the action to perform
 * @param targetId {number} - the event ID of the document to modify or the workflow ID of
 * the document to open. If the action is 'modify', this is the event ID of the document to modify.
 * If the action is 'open by workflow', this is the workflow ID of the document to open.
 * @resolves {PowerChartReturn & { success: boolean }} - a `Promise` which resolves to an object
 * containing a boolean indicating whether the user is in PowerChart and a boolean indicating
 * whether the action was successful.
 * @throws {Error} if an unexpected error occurs.
 */

export async function openDocumentAsync(
  pid: number,
  eid: number,
  action: 'modify' | 'open by workflow',
  targetId: number
): Promise<PowerChartReturn & { success: boolean }> {
  let retVal: PowerChartReturn & { success: boolean } = {
    inPowerChart: true,
    success: false,
  };

  const dcof = await window.external.DiscernObjectFactory('DYNDOC');
  let response: 0 | 1 | null = null;

  try {
    if (action === 'modify') {
      response = await dcof.ModifyExistingDocumentByEventId(pid, eid, targetId);
    } else {
      response = await dcof.OpenDynDocByWorkFlowId(pid, eid, targetId);
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
