import { openOrganizerTab } from '.';

describe('openOrganizerTab', () => {
  test('returns an MPageEventReturn object', () => {
    const result = openOrganizerTab('Tab Name');
    expect(result).toBeInstanceOf(Object);
    expect(result).toHaveProperty('eventString');
    expect(result).toHaveProperty('inPowerChart');
  });
  test('returns inPowerChart as false when outside of Powerchart', () => {
    const { inPowerChart } = openOrganizerTab('Tab Name');
    expect(inPowerChart).toBe(false);
  });
  test('returns an appropriately formatted eventString', () => {
    const { eventString } = openOrganizerTab('Tab Name');
    expect(eventString).toBe(`/ORGANIZERTAB=^Tab Name^`);
  });
});
