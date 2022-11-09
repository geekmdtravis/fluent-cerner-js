import { openPatientTab } from './openPatientTab';

describe('openPatientTab', () => {
  test('throws when outside PowerChart', () => {
    expect(() => openPatientTab(1, 1, 'test')).toThrow();
  });
});
