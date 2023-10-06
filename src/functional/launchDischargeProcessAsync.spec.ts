import { launchDischargeProcessAsync } from './launchDischargeProcessAsync';

describe('launchDischargeProcessAsync', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: undefined,
      },
    });
  });
  it('returns inPowerChart as false when outside of PowerChart', async () => {
    const { inPowerChart } = await launchDischargeProcessAsync();
    expect(inPowerChart).toBe(false);
  });
  it('returns inPowerChart as true when inside of PowerChart', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(async () => ({
          LaunchDischargeDialog: async () => Promise.resolve(null),
        })),
      },
    });
    const { inPowerChart } = await launchDischargeProcessAsync();
    expect(inPowerChart).toBe(true);
  });
});
