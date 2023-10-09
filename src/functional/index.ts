import { manageAppointmentAsync } from './manageAppointmentAsync';
import { getValidEncountersAsync } from './getValidEncountersAsync';
import {
  launchClinicalNoteAsync,
  ClinicalNoteOpts,
} from './launchClinicalNoteAsync';
import { launchPatientEducationAsync } from './launchPatientEducationAsync';
import { launchPowerFormAsync, PowerFormOpts } from './launchPowerFormAsync';
import { launchPowerNoteAsync } from './launchPowerNoteAsync';
import {
  makeCclRequestAsync,
  CclCallParam,
  XmlCclStatus,
  CclRequestResponse,
} from './makeCclRequestAsync';
import { openPatientTabAsync } from './openPatientTabAsync';
import { openOrganizerTabAsync } from './openOrganizerTabAsync';
import {
  createOrderString,
  OrderAction,
  OrderStrOpts,
} from './createOrderString';
import { submitOrdersAsync } from './submitOrdersAsync';

import { SubmitOrderAsyncOpts } from './submitOrdersAsync';

import { submitPowerOrdersAsync } from './submitPowerOrdersAsync';
import { createNewDocumentAsync } from './createNewDocumentAsync';
import { addAddendumToDocumentAsync } from './addAddendumToDocumentAsync';

export type PowerChartReturn = {
  inPowerChart: boolean;
};

/**
 * A type which represents the object to be returned from the launchClinicalNote() function.
 * @param {string} eventString - The string version of the MPageEvent
 * @param {boolean} inPowerChart - Returns `true` if being run from inside of PowerChart and returns `false` otherwise.
 **/
export type MPageEventReturn = PowerChartReturn & {
  eventString: string;
};

export type ApplinkReturn = MPageEventReturn & { badInput: boolean };

// Export functions
export {
  addAddendumToDocumentAsync,
  createNewDocumentAsync,
  createOrderString as orderString,
  getValidEncountersAsync,
  launchClinicalNoteAsync,
  launchPatientEducationAsync,
  launchPowerFormAsync,
  launchPowerNoteAsync,
  makeCclRequestAsync,
  manageAppointmentAsync,
  openOrganizerTabAsync,
  openPatientTabAsync,
  submitPowerOrdersAsync,
  submitOrdersAsync,
};

// Export types; cannot use the `export type` syntax.
export {
  CclCallParam,
  CclRequestResponse,
  ClinicalNoteOpts,
  OrderAction,
  OrderStrOpts,
  PowerFormOpts,
  SubmitOrderAsyncOpts as SubmitOrderOpts,
  XmlCclStatus,
};
