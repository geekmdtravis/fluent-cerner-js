import { handleAppointmentAsync } from './handleAppointmentAsync';

describe('handleAppointmentAsync', () => {
  it('throws RangeError if the provided appointment ID is less than 1', async () => {
    await expect(handleAppointmentAsync(0, 'check in')).rejects.toThrow(
      RangeError
    );
  });
});
