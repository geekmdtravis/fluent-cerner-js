import {
  CclCallParam,
  CclRequestResponse,
  makeCclRequestAsync,
  XmlCclResult,
  XmlCclReadyState,
} from 'easy-ccl-request';
import { addAddendumToDocumentAsync } from './addAddendumToDocumentAsync';
import { createNewDocumentAsync } from './createNewDocumentAsync';
import { getValidEncountersAsync } from './getValidEncountersAsync';
import {
  ClinicalNoteOpts,
  InheretanceProps,
  launchClinicalNoteAsync,
  ViewOption,
} from './launchClinicalNoteAsync';
import { launchDischargeProcessAsync } from './launchDischargeProcessAsync';
import { launchPatientEducationAsync } from './launchPatientEducationAsync';
import { launchPowerFormAsync } from './launchPowerFormAsync';
import { launchPowerNoteAsync } from './launchPowerNoteAsync';
import {
  manageAppointmentAsync,
  AppointmentAction,
  AppointmentReturn,
} from './manageAppointmentAsync';
import {
  OpenApplicationArgument,
  openApplicationAsync,
  OpenApplicationMode,
} from './openApplicationAsync';
import { openOrganizerTabAsync } from './openOrganizerTabAsync';
import { openPatientTabAsync } from './openPatientTabAsync';
import { openWebsiteByUrlAsync } from './openWebsiteByUrlAsync';
import {
  submitOrdersAsync,
  SubmitOrderAsyncOpts,
  SubmitOrderAsyncReturn,
  SubmitOrdersAsyncStatus,
  OrderAction,
  OrderOpts,
  Order,
} from './submitOrdersAsync';
import { submitPowerOrdersAsync } from './submitPowerOrdersAsync';

// Export functions
export {
  addAddendumToDocumentAsync,
  createNewDocumentAsync,
  getValidEncountersAsync,
  launchClinicalNoteAsync,
  launchDischargeProcessAsync,
  launchPatientEducationAsync,
  launchPowerFormAsync,
  launchPowerNoteAsync,
  makeCclRequestAsync,
  manageAppointmentAsync,
  openApplicationAsync,
  openOrganizerTabAsync,
  openPatientTabAsync,
  openWebsiteByUrlAsync,
  submitOrdersAsync,
  submitPowerOrdersAsync,
};

// Export types; cannot use the `export type` syntax.
export {
  AppointmentAction,
  AppointmentReturn,
  CclCallParam,
  CclRequestResponse,
  ClinicalNoteOpts,
  InheretanceProps,
  OpenApplicationArgument,
  OpenApplicationMode,
  Order,
  OrderAction,
  OrderOpts as OrderStrOpts,
  SubmitOrderAsyncOpts,
  SubmitOrderAsyncReturn,
  SubmitOrdersAsyncStatus,
  ViewOption,
  XmlCclReadyState,
  XmlCclResult,
};

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

/**
 * @param {string} eventString - string being provided as an argument to the Discern
 * native function call.
 * @param {boolean} inPowerChart - whether or not the function is being run from inside of
 * PowerChart.
 * @param {boolean} badInput - whether or not the input provided to the function is valid as
 * reported by the Discern engine.
 */
export type ApplinkReturn = MPageEventReturn & { badInput: boolean };

declare global {
  /**
   * A type which ensures that only valid DiscernCOMObjects can be
   * passed to the DiscernObjectFactory constructor.
   */
  type DiscernCOMObjects =
    | 'INFOBUTTONLINK'
    | 'DISCHARGEPROCESS'
    | 'DYNDOC'
    | 'KIACROSSMAPPING'
    | 'ORDERS'
    | 'PATIENTEDUCATION'
    | 'PEXAPPLICATIONSTATUS'
    | 'PEXSCHEDULINGACTIONS'
    | 'PMLISTMAINTENANCE'
    | 'POWERFORM'
    | 'POWERNOTE'
    | 'POWERORDERS'
    | 'PREGNANCY'
    | 'PVCONTXTMPAGE'
    | 'PVFRAMEWORKLINK'
    | 'PVPATIENTFOCUS'
    | 'PVPATIENTSEARCHMPAGE'
    | 'PVVIEWERMPAGE'
    | 'TASKDOC';
  interface Window {
    readonly external: External;
    /**
     * Interface for the Cerner Discern native function which provides the function
     * responsible for opening an application, chart tab, or organization level tab.
     * Useful for development but not intended for production use.
     * @param {0 | 1 | 100} mode - The _linkmode_ parameter for the APPLINK function.The value 0
     * is used for starting a solution by application name (e.g. Powerchart.exe), the value 1
     * is used for starting a solution by solution object (e.g. DiscernAnalytics.Application),
     * and the value 100 is used for launching a link, file, or executable through a shell execute
     * (e.g. launch a URL).
     * @param {string} target - The _launchobject_ parameter for the APPLINK function. This can
     * represent an executable name, application object, file, or link to start based on the
     * _mode_ (_linkmode_) parameter. This accepts Powerchart context variables, and using
     * `$APP_AppName$` is useful in place of the executable name if you watn to open a patient
     * in the context of the current solution.
     */
    APPLINK: (mode: 0 | 1 | 100, target: string, args: string) => Promise<null>;
  }
  export type DiscernObjectFactoryReturn = {
    /**
     * Creates the MOEW handle.
     * @param dPersonId {number} - the patient ID
     * @param dEncntrId {number} - the encounter ID in which orders would be placed
     * @param dwCustomizeFlag {number} - mask used to determine options available within the MOEW
     * @param dwTabFlag {number} - the type of list being customized (2 for orders, 3 for medications).
     * @param dwTabDisplayOptionsFlag {number} - mask specifying the components to display on the list.
     * @returns a `Promise` which resolves to an integer representing a handle to the MOEW instance. 0 indicates an invalid call or call from outside PowerChart.
     */
    CreateMOEW: (
      dPersonId: number,
      dEncntrId: number,
      dwCustomizeFlag: number,
      dwTabFlag: number,
      dwTabDisplayOptionsFlag: number
    ) => Promise<number>;
    /**
     * Creates PowerPlan objects from the pathway catalog IDs. CreateMOEW() must be called first.
     * @param lMOEWHandle {number} - the handle to the MOEW
     * @param planDetailsXMLBstr {string} - XML string containing the plan/pathway catalog IDs
     * @returns a `Promise` which resolves to an integer: 1 if the plan was added successfully, and 0 otherwise.
     */
    AddPowerPlanWithDetails: (
      lMOEWHandle: number,
      planDetailsXMLBstr: string
    ) => Promise<number>;
    /**
     * Attempts to add standalone orders to the scratchpad. CreateMOEW() must be called first.
     * @param lMOEWHandle {number} - the handle to the MOEW
     * @param newOrdersXMLBstr {string} - XML string containing the order details, including synonym IDs
     * @param bSignTimeInteractionChecking {boolean} - indicates if interaction checking should be performed at order sign time.
     * @returns a `Promise` which resolves to an integer: 1 if the orders were added successfully, and 0 otherwise.
     */
    AddNewOrdersToScratchpad: (
      lMOEWHandle: number,
      newOrdersXMLBstr: string,
      bSignTimeInteractionChecking: boolean
    ) => Promise<number>;
    /**
     * Displays the modal order entry window (MOEW).
     * @param {number} lMOEWHandle - the handle to the MOEW.
     * @returns a `Promise` which resolves to an integer (0). This appears to be returned upon either a successful or unsuccessful launch.
     */
    DisplayMOEW: (lMOEWHandle: number) => Promise<number>;
    /**
     * Attempts to silently sign orders on the scratchpad. If the orders cannot be signed silently, will display the MOEW.
     * @param {number} lMOEWHandle - the handle to the MOEW.
     * @returns a `Promise` which resolves to an integer: 0 if called with invalid/improperly structured paramters, and 1 otherwise.
     */
    SignOrders: (lMOEWHandle: number) => Promise<number>;
    /**
     * Retrieves the XML representation of the order information signed during the previous MOEW invocation.
     * @param {number} lMOEWHandle - the handle to the MOEW.
     * @returns a `Promise` which resolves to a string containing prior order information. If none or invalid, the string will be empty.
     */
    GetXMLOrdersMOEW: (lMOEWHandle: number) => Promise<string>;
    /**
     * Destroys the modal order entry window (MOEW).
     * @param {number} lMOEWHandle - the handle to the MOEW.
     * @returns a `Promise` which resolves to null. This appears to be returned upon either a successful or unsuccessful destruction.
     * @throws `Error` if an unexpected error occurs.
     */
    DestroyMOEW: (lMOEWHandle: number) => Promise<null>;
    /**
     * Get valid encounter ID's for a given patient.
     * @param pid {number} - the patient ID of the patient to get encounters for.
     * @returns a `Promise` of a string representing the valid encounter ID's for the patient.
     */
    GetValidEncounters: (pid: number) => Promise<string>;
    /**
     * Provide patient context to the Discern COM object.
     * @param pid {number} - the patient ID of the patient provided for context.
     *
     * @returns a `Promise` which always returns `null`.
     */
    SetPatient(pid: number, eid: number): Promise<null>;
    /**
     * Provide patient context to the Discern COM object.
     * @param tab {0 | 1} - the tab to target upon opening. Instruction component is `0` and
     * Follow-up component is `1`.
     * @returns a `Promise` which always returns `null`.
     */
    SetDefaultTab(tab: 0 | 1): Promise<null>;
    /**
     * Open the modal for the targeted COM object.
     * @returns a `Promise` which always returns `null`.
     */
    DoModal(): Promise<null>;
    /**
     * Launches a dialog to check in the specified appointment.
     * @param eventId {number} - the event ID of the appointment to check in.
     * @resolves to `0` if the action was successful, `1` otherwise.
     */
    CheckInAppointment(eventId: number): Promise<0 | 1>;
    /**
     * Launches a dialog to check out the specified appointment.
     * @param eventId {number} - the event ID of the appointment to check in.
     * @resolves to `0` if the action was successful, `1` otherwise.
     */
    CheckOutAppointment(eventId: number): Promise<0 | 1>;
    /**
     * Launches a dialog to cancel the specified appointment.
     * @param eventId {number} - the event ID of the appointment to check in.
     * @resolves to `0` if the action was successful, `1` otherwise.
     */
    CancelAppointment(eventId: number): Promise<0 | 1>;
    /**
     * Launches a dialog to put a hold on the specified appointment.
     * @param eventId {number} - the event ID of the appointment to check in.
     * @resolves to `0` if the action was successful, `1` otherwise.
     */
    HoldAppointment(eventId: number): Promise<0 | 1>;
    /**
     * Launches a dialog to mark the specified appointment as 'no show'.
     * @param eventId {number} - the event ID of the appointment to check in.
     * @resolves to `0` if the action was successful, `1` otherwise.
     */
    NoShowAppointment(eventId: number): Promise<0 | 1>;
    /**
     * Display the appointment view dialog for the specified appointment.
     * @param eventId {number} - the event ID of the appointment to check in.
     * @resolves to `0` if the action was successful, `1` otherwise.
     */
    ShowView(eventId: number): Promise<0 | 1>;
    /**
     * Display the appointment history view dialog for the specified appointment.
     * @param eventId {number} - the event ID of the appointment to check in.
     * @resolves to `0` if the action was successful, `1` otherwise.
     */
    ShowHistoryView(eventId: number): Promise<0 | 1>;
    // TODO: update return type and JSDOc
    OpenNewDocumentByReferenceTemplateId(
      pid: number,
      eid: number,
      refTemplateId: number
    ): Promise<null>;
    // TODO: update return type and JSDOc
    OpenNewDocumentByReferenceTemplateIdAndNoteType(
      pid: number,
      eid: number,
      refTemplateId: number,
      noteTypeCd: number
    ): Promise<null>;
    // TODO: update return type and JSDOc
    ModifyExistingDocumentByEventId(
      pid: number,
      eid: number,
      docEventId: number
    ): Promise<null>;
    // TODO: update return type and JSDOc
    OpenDynDocByWorkFlowId(
      pid: number,
      eid: number,
      workflowId: number
    ): Promise<null>;
    // TODO: update return type and JSDOc
    LaunchDischargeDialog(): Promise<null>;
    /**
     * A parameter to set the patient context for the Discern COM object.
     * At the time of writing this, the only discernable use for this is the
     * `DISCHARGEPROCESS` object.
     */
    person_id: number;
    /**
     * A parameter to set the encounter context for the Discern COM object.
     * At the time of writing this, the only discernable use for this is the
     * `DISCHARGEPROCESS` object.
     */
    encounter_id: number;
    /**
     * A parameter to set the user context for the Discern COM object.
     * At the time of writing this, the only discernable use for this is the
     * `DISCHARGEPROCESS` object.
     */
    user_id: number;
  };

  interface External {
    /**
     * A factory function which returns a Discern COM object.
     * @param comObject {DiscernCOMObjects} - a string representing the Discern
     * COM object to be created.
     * @returns the COM object the user will interact with.
     */
    DiscernObjectFactory: (
      comObject: DiscernCOMObjects
    ) => Promise<DiscernObjectFactoryReturn>;
    /**
     * Interface for the Cerner Discern native function which provides the function
     * responsible for engaging in special Cerneer _conversation events_ within the
     * web page (MPage) with the Cerner PowerChart application. Useful for development
     * but not intended for production use.
     * @param {string} type - The type of event to be triggered. Can by `'ALLERGY' | 'POWERFORM' | 'POWERNOTE' | 'ORDERS' | 'CLINICALNOTE'`
     * @param {string} args - Argument data passed to the event, specific to the event type.
     */
    MPAGES_EVENT: (
      type: 'ALLERGY' | 'POWERFORM' | 'POWERNOTE' | 'ORDERS' | 'CLINICALNOTE',
      args: string
    ) => Promise<any>;
  }
}
