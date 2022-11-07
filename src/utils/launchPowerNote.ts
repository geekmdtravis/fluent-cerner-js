export type PowerNoteOpts = {
  personId: number;
  encounterId: number;
  CKI: string;
  eventId: number;
  createNewNote: boolean;
};

export type MPageEventReturn = {
  eventString: string;
  inPowerChart: boolean;
};

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
