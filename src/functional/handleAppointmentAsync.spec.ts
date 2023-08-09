import { handleAppointmentAsync } from './handleAppointmentAsync';

describe('handleAppointmentAsync', () => {
  it('throws RangeError if the provided appointment ID is less than 1', async () => {
    await expect(handleAppointmentAsync(0, 'check in')).rejects.toThrow(
      RangeError
    );
  });
  it('does not throw a RangeError if the provided appointment ID is greater than 0', async () => {
    await expect(handleAppointmentAsync(1, 'check in')).resolves.toBeDefined();
  });
  it('returns the inPowerChart property as false when the COM object is not available', async () => {
    const { inPowerChart } = await handleAppointmentAsync(1, 'check in');
    expect(inPowerChart).toBe(false);
  });
  it('returns the inPowerChart property as true when the COM object is available', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          CheckInAppointment(id: number): Promise<0 | 1> {
            console.log('CheckInAppointment', id);
            return Promise.resolve(1);
          },
          CheckOutAppointment(id: number): Promise<0 | 1> {
            console.log('CheckOutAppointment', id);
            return Promise.resolve(1);
          },
          CancelAppointment(id: number): Promise<0 | 1> {
            console.log('CancelAppointment', id);
            return Promise.resolve(1);
          },
          NoShowAppointment(id: number): Promise<0 | 1> {
            console.log('NoShowAppointment', id);
            return Promise.resolve(1);
          },
          ShowView(id: number): Promise<0 | 1> {
            console.log('ShowView', id);
            return Promise.resolve(1);
          },
          ShowHistoryView(id: number): Promise<0 | 1> {
            console.log('ShowHistoryView', id);
            return Promise.resolve(1);
          },
        })),
      },
    });
    const { inPowerChart } = await handleAppointmentAsync(1, 'check in');
    expect(inPowerChart).toBe(true);
  });
});
