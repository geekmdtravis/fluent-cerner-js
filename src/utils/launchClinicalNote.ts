/**
 * A type which represents the parameters to be be passed into the launchClinicalNote() function
 * @param {number} personId - The person_id of the patient whose clinical note is to be displayed.
 * @param {number} encounterId - The encntr_id of the patient whose clinical note is to be displayed.
 * @param {Array<number>} eventIds - An array of event_ids of the clinical note(s) to be displayed.
 * @param {string} windowTitle - The text to be displayed in the first section of the title for the Clinical Notes window.
 * @param {Array<string>} viewOptionFlags - A set of flags that can be used to define the style of the Clinical Notes window. Example: ["menu", "buttons", "toolbar", calculator", "view-only"]
 * @param {string} viewName - The view name for the view-level preference of the tab to model the preferences after.
 * @param {number} viewSeq - The view sequence for the view-level preference of the tab to model the preferences after. An invalid viewSeq loads the clinical note with the default preferences.
 * @param {string} compName - The component name for the component-level preference of the tab to model the preferences after. An invalid compName loads the clinical note with the default preferences.
 * @param {number} compSeq - 	The component sequence for the component-level preference of the tab to model the preferences after. An invalid compSeq loads the clinical note with the default preferences.
 **/
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

/**
 * A type which represents the object to be returned from the launchClinicalNote() function.
 * @param {string} eventString - The string version of the MPageEvent
 * @param {boolean} inPowerChart - Returns `true` if being run from inside of PowerChart and returns `false` otherwise.
 **/
export type MPageEventReturn = {
  eventString: string;
  inPowerChart: boolean;
};

/**
 * A function to launch a clinical note, which returns an object of `MPageEventReturn`
 * @param {ClinicalNoteOpts} opts - The parameters passed, as specified in `ClinicalNoteOpts`
 **/
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
