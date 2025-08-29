import { manageAppointmentAsync } from './manageAppointmentAsync';

describe('manageAppointmentAsync', () => {
  beforeEach(() => {
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
  });
  it('does not throw a RangeError if the provided appointment ID is greater than 0', async () => {
    await expect(manageAppointmentAsync('check in', 1)).resolves.toBeDefined();
  });
  it('returns the inPowerChart property as false when the COM object is not available', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: undefined,
      },
    });
    const { inPowerChart } = await manageAppointmentAsync('check in', 1);
    expect(inPowerChart).toBe(false);
  });
  it('returns the inPowerChart property as true when the COM object is available', async () => {
    const { inPowerChart } = await manageAppointmentAsync('check in', 1);
    expect(inPowerChart).toBe(true);
  });
  it('returns the success property as true when CheckInAppointment returns 1', async () => {
    const { success } = await manageAppointmentAsync('check in', 1);
    expect(success).toBe(true);
  });
  it('returns the success property as true when CheckOutAppointment returns 1', async () => {
    const { success } = await manageAppointmentAsync('check out', 1);
    expect(success).toBe(true);
  });
  it('returns the success property as true when CancelAppointment returns 1', async () => {
    const { success } = await manageAppointmentAsync('cancel', 1);
    expect(success).toBe(true);
  });
  it('returns the success property as true when NoShowAppointment returns 1', async () => {
    const { success } = await manageAppointmentAsync('no show', 1);
    expect(success).toBe(true);
  });
  it('returns the success property as true when ShowView returns 1', async () => {
    const { success } = await manageAppointmentAsync('view appt dialog', 1);
    expect(success).toBe(true);
  });
  it('returns the success property as true when ShowHistoryView returns 1', async () => {
    const { success } = await manageAppointmentAsync('view appt history', 1);
    expect(success).toBe(true);
  });
  it('throws an Error when the provided action is not supported', async () => {
    // @ts-ignore
    await expect(manageAppointmentAsync('foo', 1)).rejects.toThrow(Error);
  });
  it('returns the success property as false when CheckInAppointment returns 0', async () => {
    Object.defineProperty(window.external, 'DiscernObjectFactory', {
      writable: true,
      value: jest.fn().mockImplementation(() => ({
        CheckInAppointment(id: number): Promise<0 | 1> {
          console.log('CheckInAppointment', id);
          return Promise.resolve(0);
        },
      })),
    });
    const { success } = await manageAppointmentAsync('check in', 1);
    expect(success).toBe(false);
  });
  it('returns the success property as false when CheckOutAppointment returns 0', async () => {
    Object.defineProperty(window.external, 'DiscernObjectFactory', {
      writable: true,
      value: jest.fn().mockImplementation(() => ({
        CheckOutAppointment(id: number): Promise<0 | 1> {
          console.log('CheckOutAppointment', id);
          return Promise.resolve(0);
        },
      })),
    });
    const { success } = await manageAppointmentAsync('check out', 1);
    expect(success).toBe(false);
  });
  it('returns the success property as false when CancelAppointment returns 0', async () => {
    Object.defineProperty(window.external, 'DiscernObjectFactory', {
      writable: true,
      value: jest.fn().mockImplementation(() => ({
        CancelAppointment(id: number): Promise<0 | 1> {
          console.log('CancelAppointment', id);
          return Promise.resolve(0);
        },
      })),
    });
    const { success } = await manageAppointmentAsync('cancel', 1);
    expect(success).toBe(false);
  });
  it('returns the success property as false when NoShowAppointment returns 0', async () => {
    Object.defineProperty(window.external, 'DiscernObjectFactory', {
      writable: true,
      value: jest.fn().mockImplementation(() => ({
        NoShowAppointment(id: number): Promise<0 | 1> {
          console.log('NoShowAppointment', id);
          return Promise.resolve(0);
        },
      })),
    });
    const { success } = await manageAppointmentAsync('no show', 1);
    expect(success).toBe(false);
  });
  it('returns the success property as false when ShowView returns 0', async () => {
    Object.defineProperty(window.external, 'DiscernObjectFactory', {
      writable: true,
      value: jest.fn().mockImplementation(() => ({
        ShowView(id: number): Promise<0 | 1> {
          console.log('ShowView', id);
          return Promise.resolve(0);
        },
      })),
    });
    const { success } = await manageAppointmentAsync('view appt dialog', 1);
    expect(success).toBe(false);
  });
  it('returns the success property as false when ShowHistoryView returns 0', async () => {
    Object.defineProperty(window.external, 'DiscernObjectFactory', {
      writable: true,
      value: jest.fn().mockImplementation(() => ({
        ShowHistoryView(id: number): Promise<0 | 1> {
          console.log('ShowHistoryView', id);
          return Promise.resolve(0);
        },
      })),
    });
    const { success } = await manageAppointmentAsync('view appt history', 1);
    expect(success).toBe(false);
  });
});
