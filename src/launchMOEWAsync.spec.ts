import { launchMOEWAsync } from './launchMOEWAsync';

describe('launchMOEWAsync', () => {
  test('launches the PowerOrders search view by default without adding orders', async () => {
    const result = await launchMOEWAsync(1, 2, { dryRun: true });

    expect(result.eventString).toBe('1|2|{ORDER|0|0|0|0|0}|24|{2|127}|8|0');
    expect(result.status).toBe('dry run');
  });

  test('allows overriding target tab and launch view', async () => {
    const result = await launchMOEWAsync(1, 2, {
      targetTab: 'medications',
      launchView: 'profile',
      dryRun: true,
    });

    expect(result.eventString).toBe('1|2|{ORDER|0|0|0|0|0}|0|{3|0}|16|0');
  });
});
