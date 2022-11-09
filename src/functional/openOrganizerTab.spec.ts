import { openOrganizerTab } from '.';

describe('openOrganizerTab', () => {
  test('throws when outside PowerChart', () => {
    expect(() => openOrganizerTab('test')).toThrow();
  });
});
