import { openPatientTab } from './openPatientTab';

describe('openPatientTab', () => {
  test('returns an MPageEventReturn object', () => {
    const result = openPatientTab(0, 1, 'Tab Name');
    expect(result).toBeInstanceOf(Object);
    expect(result).toHaveProperty('eventString');
    expect(result).toHaveProperty('inPowerChart');
  });
  test('returns inPowerChart as false when outside of Powerchart', () => {
    const { inPowerChart } = openPatientTab(0, 1, 'Tab Name');
    expect(inPowerChart).toBe(false);
  });
  test('returns an appropriately formatted eventString without quickadd', () => {
    const { eventString } = openPatientTab(0, 1, 'Tab Name');
    expect(eventString).toBe(`/PERSONID=0 /ENCNTRID=1 /FIRSTTAB=^TAB NAME^`);
  });
  test('returns an appropriately formatted eventString with quickadd', () => {
    const { eventString } = openPatientTab(0, 1, 'Tab Name', true);
    expect(eventString).toBe(`/PERSONID=0 /ENCNTRID=1 /FIRSTTAB=^TAB NAME+^`);
  });
});
