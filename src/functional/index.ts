import { getValidEncountersAsync } from './getValidEncounters';
import {
  launchClinicalNoteAsync,
  ClinicalNoteOpts,
} from './launchClinicalNote';
import { launchPowerFormAsync, PowerFormOpts } from './launchPowerForm';
import { launchPowerNoteAsync, PowerNoteOpts } from './launchPowerNote';
import {
  makeCclRequestAsync,
  CclCallParam,
  CclOpts,
  XmlCclStatus,
  CclRequestResponse,
} from './makeCclRequest';
import { openPatientTabAsync } from './openPatientTab';
import { openOrganizerTabAsync } from './openOrganizerTab';
import {
  orderString,
  OrderAction,
  OrderStrOpts,
  NewOrderStrOpts,
} from './orderString';
import { submitOrdersAsync, SubmitOrderOpts } from './submitOrders';

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
  getValidEncountersAsync,
  launchClinicalNoteAsync,
  launchPowerFormAsync,
  launchPowerNoteAsync,
  makeCclRequestAsync,
  openPatientTabAsync,
  openOrganizerTabAsync,
  orderString,
  submitOrdersAsync,
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
