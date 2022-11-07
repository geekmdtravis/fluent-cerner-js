export type ClinicalNoteOpts = {
  personId: number;
  encounterId: number;
  eventIds: Array<number>;
  windowTitle: string;
  viewOptionFlags: Array<string>;
  viewName: string;
  viewSeq: number;
  compName: string;
  compSeq: number;
};

export type MPageEventReturn = {
  eventString: string;
  inPowerChart: boolean;
};

export const launchClinicalNote = (
  opts: ClinicalNoteOpts
): MPageEventReturn => {
  const {
    personId,
    encounterId,
    eventIds,
    windowTitle,
    viewOptionFlags,
    viewName,
    viewSeq,
    compName,
    compSeq,
  } = opts;
  const params: Array<string> = [`${personId}`, `${encounterId}`];
  const formattedEventIds = `${eventIds.join('|')}`;

  params.push(`[${formattedEventIds}]`);
  params.push(`${windowTitle}`);

  let viewOptionFlagTotal = 0;
  const uniqueFlags = Array.from(new Set(viewOptionFlags));
  uniqueFlags.forEach(flag => {
    if (flag === 'menu') {
      viewOptionFlagTotal += 1;
    }
    if (flag === 'buttons') {
      viewOptionFlagTotal += 2;
    }
    if (flag === 'toolbar') {
      viewOptionFlagTotal += 4;
    }
    if (flag === 'calculator') {
      viewOptionFlagTotal += 8;
    }
    if (flag === 'view-only') {
      viewOptionFlagTotal += 16;
    }
  });
  params.push(`${viewOptionFlagTotal}`);

  params.push(`${viewName}`);
  params.push(`${viewSeq}`);
  params.push(`${compName}`);
  params.push(`${compSeq}`);

  const returnObject: MPageEventReturn = {
    eventString: '',
    inPowerChart: true,
  };

  const pfSentence = `${params.join('|')}`;

  try {
    window.MPAGES_EVENT('POWERFORM', pfSentence);
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

  returnObject.eventString = pfSentence;

  return returnObject;
};
