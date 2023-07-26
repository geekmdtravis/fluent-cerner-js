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
  orderString,
  OrderAction,
  OrderStrOpts,
  NewOrderStrOpts,
} from './orderString';
import { submitOrders, SubmitOrderOpts } from './submitOrders';

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

// Export functions
export {
  launchClinicalNote,
  launchPowerForm,
  launchPowerNote,
  makeCclRequest,
  openPatientTab,
  openOrganizerTab,
  orderString,
  submitOrders,
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
  PowerNoteOpts,
  SubmitOrderOpts,
  XmlCclStatus,
};
