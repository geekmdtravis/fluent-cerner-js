import { PowerChartReturn } from '.';
import { outsideOfPowerChartError } from '../utils';

export type AppointmentAction =
  | 'check in'
  | 'check out'
  | 'cancel'
  | 'no show'
  | 'view appt dialog'
  | 'view appt history';

export type AppointmentReturn = PowerChartReturn & {
  success: boolean;
};

/**
 * Managed appointments in PowerChart. For any given appointment ID, the
 * following actions can be performed: check in, check out, cancel, no show,
 * view appointment dialog, and view appointment history. This is a wrapper function
 * for the `PEXSCHEDULINGACTIONS` Discern COM object.
 * @param id {number} - the event ID of the appointment to check in.
 * @param action {string} - the action to perform on the appointment. The available
 * actions are: 'check in', 'check out', 'cancel', 'no show', 'view appt dialog',
 * and 'view appt history'.
 * @resolves an `AppointmentReturn` object with the following properties:
 * - `success` - `true` if the action was successful, `false` otherwise.
 * - `inPowerChart` - `true` if the action was successful, `false` otherwise.
 * @throws a `RangeError` if the provided appointment ID is less than 1.
 * @throws an `Error` if the action is invalid.
 * @throws an `Error` if an unexpected error occurs.
 */
export async function manageAppointmentAsync(
  id: number,
  action: AppointmentAction
): Promise<AppointmentReturn> {
  if (id < 1) {
    throw new RangeError('The provided appointment ID must be greater than 0');
  }

  let actionSuccess: 0 | 1 = 0;
  let inPowerChart = true;

  try {
    const dcof = await window.external.DiscernObjectFactory(
      'PEXSCHEDULINGACTIONS'
    );
    switch (action) {
      case 'check in':
        actionSuccess = await dcof.CheckInAppointment(id);
        break;
      case 'check out':
        actionSuccess = await dcof.CheckOutAppointment(id);
        break;
      case 'cancel':
        actionSuccess = await dcof.CancelAppointment(id);
        break;
      case 'no show':
        actionSuccess = await dcof.NoShowAppointment(id);
        break;
      case 'view appt dialog':
        actionSuccess = await dcof.ShowView(id);
        break;
      case 'view appt history':
        actionSuccess = await dcof.ShowHistoryView(id);
        break;
      default:
        throw new Error('Invalid appointment action');
    }
  } catch (e) {
    if (outsideOfPowerChartError(e)) {
      inPowerChart = false;
    } else {
      throw e;
    }
  }
  return {
    success: actionSuccess === 1,
    inPowerChart: inPowerChart,
  };
}
