/**
 * A type which represents the parameters to be be passed into the launchPowerNote() function.
 * @param {number} personId - The person_id of the patient whose power note is to be displayed.
 * @param {number} encounterId - The encntr_id of the patient whose power note is to be displayed.
 * @param {string} CKI - A CKI value for a new PowerNote that corresponds to an encounter pathway. This can be constructed in the format CKI_SOURCE!CKI_IDENTIFIER from the SCR_PATTERN table, where the ENTRY_MODE_CD corresponds to the code value for a PowerNote.
 * @param {number} eventId - An event_id for an existing PowerNote to load. This corresponds to the EVENT_ID from the CLINICAL_EVENT table.
 * @param {boolean} createNewNote - If false, will attempt to load an existing PowerNote. If true, a new PowerNote is created corresponding to the `CKI` value (in this case, `eventId` is set to 0).
 **/
export type PowerNoteOpts = {
  personId: number;
  encounterId: number;
  CKI: string;
  eventId: number;
  createNewNote: boolean;
};

/**
 * A type which represents the object to be returned from the launchPowerNote() function.
 * @param {string} eventString - The string version of the MPageEvent
 * @param {boolean} inPowerChart - Returns `true` if being run from inside of PowerChart and returns `false` otherwise.
 **/
export type MPageEventReturn = {
  eventString: string;
  inPowerChart: boolean;
};

/**
 * A function to launch a power note, which returns an object of `MPageEventReturn`
 * @param {PowerNoteOpts} opts - The parameters passed, as specified in `PowerNoteOpts`
 **/
export const launchPowerNote = (opts: PowerNoteOpts): MPageEventReturn => {
  const { personId, encounterId, CKI, eventId, createNewNote } = opts;
  const params: Array<string> = [`${personId}`, `${encounterId}`];

  const returnObject: MPageEventReturn = {
    eventString: '',
    inPowerChart: true,
  };

  if (createNewNote === false) {
    params.push(`${CKI}`);
    params.push(`${eventId}`);
  }

  if (createNewNote === true) {
    params.push(`${CKI}`);
    params.push('0');
  }

  const pnSentence = `${params.join('|')}`;

  try {
    window.MPAGES_EVENT('POWERNOTE', pnSentence);
  } catch (e) {
    if (
      e instanceof TypeError &&
      e.message === 'window.MPAGES_EVENT is not a function'
    ) {
      returnObject.inPowerChart = false;
    } else {
      throw e;
    }
  }

  returnObject.eventString = pnSentence;

  return returnObject;
};
