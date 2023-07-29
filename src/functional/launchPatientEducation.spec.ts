import { launchPatientEducationAsync } from './launchPatientEducation';

describe('launchPatientEducationAsync', () => {
  test('throws range error of pid (patient id) is less than 1', async () => {
    try {
      await launchPatientEducationAsync(0, 1, 'instruction');
    } catch (e) {
      expect(e).toBeInstanceOf(RangeError);
      expect(e).toHaveProperty(
        'message',
        'The patient ID must be a positive integer.'
      );
    }
  });
  test('throws range error of eid (encounter id) is less than 1', async () => {
    try {
      await launchPatientEducationAsync(1, 0, 'instruction');
    } catch (e) {
      expect(e).toBeInstanceOf(RangeError);
      expect(e).toHaveProperty(
        'message',
        'The encounter ID must be a positive integer.'
      );
    }
  });
  test('returns an object with inPowerChart set to false if outside of PowerChart', async () => {
    const result = await launchPatientEducationAsync(1, 1, 'instruction');
    expect(result).toHaveProperty('inPowerChart', false);
  });
  test('returns an object with inPowerChart set to true if inside of PowerChart', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          SetPatient: async (pid: number, eid: number) => {
            console.debug('SetPatient', pid, eid);
            Promise.resolve(null);
          },
          SetDefaultTab: async (tabNum: 0 | 1) => {
            console.debug('SetDefaultTab', tabNum);
            Promise.resolve(null);
          },
          DoModal: async () => {
            Promise.resolve(null);
          },
        })),
      },
    });
    const { inPowerChart } = await launchPatientEducationAsync(
      1,
      1,
      'instruction'
    );
    expect(inPowerChart).toBe(true);
  });
  test('throws an error if an unexpected error occurs', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          SetPatient: async (pid: number, eid: number) => {
            console.debug('SetPatient', pid, eid);
            Promise.resolve(null);
          },
          SetDefaultTab: async (tabNum: 0 | 1) => {
            console.debug('SetDefaultTab', tabNum);
            Promise.resolve(null);
          },
          DoModal: async () => {
            throw new Error('test');
          },
        })),
      },
    });
    try {
      await launchPatientEducationAsync(1, 1, 'instruction');
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e).toHaveProperty('message', 'test');
    }
  });
});
