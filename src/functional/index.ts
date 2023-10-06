import { launchClinicalNote, ClinicalNoteOpts } from './launchClinicalNote';
import { launchPowerForm, PowerFormOpts } from './launchPowerForm';
import { launchPowerNote, PowerNoteOpts } from './launchPowerNote';
import {
  makeCclRequest,
  CclCallParam,
  CclOpts,
  XmlCclStatus,
  CclRequestResponse,
} from './makeCclRequest';
import { openPatientTab } from './openPatientTab';
import { openOrganizerTab } from './openOrganizerTab';
import {
  createOrderString,
  OrderAction,
  OrderStrOpts,
  NewOrderStrOpts,
<<<<<<< Updated upstream
} from './orderString';
import { submitOrders, SubmitOrderOpts } from './submitOrders';
=======
} from './createOrderString';
import {
  takeOrderActionAsync,
  SubmitOrderAsyncOpts,
} from './submitOrdersAsync';
import { submitPowerOrdersAsync } from './submitPowerOrders';
import { createNewDocumentAsync } from './createNewDocumentAsync';
import { addAddendumToDocumentAsync } from './addAddendumToDocumentAsync';

export type PowerChartReturn = {
  inPowerChart: boolean;
};
>>>>>>> Stashed changes

/**
 * A type which represents the object to be returned from the launchClinicalNote() function.
 * @param {string} eventString - The string version of the MPageEvent
 * @param {boolean} inPowerChart - Returns `true` if being run from inside of PowerChart and returns `false` otherwise.
 **/
export type MPageEventReturn = {
  eventString: string;
  inPowerChart: boolean;
};

// Export functions
export {
<<<<<<< Updated upstream
  launchClinicalNote,
  launchPowerForm,
  launchPowerNote,
  makeCclRequest,
  openPatientTab,
  openOrganizerTab,
  orderString,
  submitOrders,
=======
  createNewDocumentAsync,
  getValidEncountersAsync,
  launchClinicalNoteAsync,
  launchPatientEducationAsync,
  launchPowerFormAsync,
  launchPowerNoteAsync,
  makeCclRequestAsync,
  manageAppointmentAsync,
  addAddendumToDocumentAsync,
  openPatientTabAsync,
  openOrganizerTabAsync,
  createOrderString as orderString,
  takeOrderActionAsync as submitOrdersAsync,
  submitPowerOrdersAsync,
>>>>>>> Stashed changes
};

// Export types; cannot use the `export type` syntax.
export {
  CclCallParam,
  CclOpts,
  CclRequestResponse,
  ClinicalNoteOpts,
  NewOrderStrOpts,
  OrderAction,
  OrderStrOpts,
  PowerFormOpts,
<<<<<<< Updated upstream
  PowerNoteOpts,
  SubmitOrderOpts,
=======
  SubmitOrderAsyncOpts as SubmitOrderOpts,
>>>>>>> Stashed changes
  XmlCclStatus,
};
