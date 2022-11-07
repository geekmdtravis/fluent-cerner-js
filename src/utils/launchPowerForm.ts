export type PowerFormOpts = {
  personId: number;
  encounterId: number;
  target: 'form' | 'activity' | 'ad hoc';
  targetId?: number;
  permissions: 'modify' | 'read only';
};

export type MPageEventReturn = {
  eventString: string;
  inPowerChart: boolean;
};

export const launchPowerForm = (opts: PowerFormOpts): MPageEventReturn => {
  const { personId, encounterId, target, targetId, permissions } = opts;
  const params: Array<string> = [`${personId}`, `${encounterId}`];

  if ((target === 'form' || target === 'activity') && !targetId) {
    throw new Error("Missing required parameter 'targetId'");
  }

  if (target === 'form') {
    params.push(`${targetId}`);
    params.push('0');
  }
  if (target === 'activity') {
    params.push('0');
    params.push(`${targetId}`);
  }
  if (target === 'ad hoc') {
    params.push('0');
    params.push('0');
  }
  params.push(permissions === 'modify' ? '0' : '1');

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
