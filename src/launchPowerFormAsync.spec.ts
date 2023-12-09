import { launchPowerFormAsync } from './launchPowerFormAsync';

describe('launchPowerForm', () => {
  it('properly constructs a valid power form request with `new form` selected', async () => {
    const expected = '733757|701346|15721144|0|0';

    const result = await launchPowerFormAsync(
      'new form',
      733757,
      701346,
      15721144
    );
    expect(result.eventString).toEqual(expected);
  });

  it("throws an error if targetId is not provided when 'new form' is targeted", async () => {
    try {
      await launchPowerFormAsync('new form', 733757, 701346);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect((e as Error).message).toEqual(
        "'targetId' is required for all targets except 'new form search'."
      );
    }
  });

  it("throws an error if targetId is not provided when 'view form' is targeted", async () => {
    try {
      await launchPowerFormAsync('view form', 733757, 701346);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect((e as Error).message).toEqual(
        "'targetId' is required for all targets except 'new form search'."
      );
    }
  });

  it("throws an error if targetId is not provided when 'modify form' is targeted", async () => {
    try {
      await launchPowerFormAsync('modify form', 733757, 701346);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect((e as Error).message).toEqual(
        "'targetId' is required for all targets except 'new form search'."
      );
    }
  });

  it('`modify form` generates the appropriate event string, without read-only flagged', async () => {
    const expected = '733757|701346|0|15721144|0';

    const result = await launchPowerFormAsync(
      'modify form',
      733757,
      701346,
      15721144
    );
    expect(result.eventString).toEqual(expected);
  });

  it('`new form` generates the appropriate event string, without read-only flagged', async () => {
    const expected = '733757|701346|15721144|0|0';

    const result = await launchPowerFormAsync(
      'new form',
      733757,
      701346,
      15721144
    );
    expect(result.eventString).toEqual(expected);
  });

  it('`new form search` generates the appropriate event string, without read-only flagged', async () => {
    const expected = '733757|701346|0|0|0';

    const result = await launchPowerFormAsync(
      'new form search',
      733757,
      701346
    );
    expect(result.eventString).toEqual(expected);
  });
  it('`view form` generates the appropriate event string, with read-only flagged', async () => {
    const expected = '733757|701346|0|15721144|1';

    const result = await launchPowerFormAsync(
      'view form',
      733757,
      701346,
      15721144
    );
    expect(result.eventString).toEqual(expected);
  });

  it('returns false for inPowerChart if outside of PowerChart', async () => {
    const { inPowerChart } = await launchPowerFormAsync(
      'new form',
      733757,
      701346,
      15721144
    );
    expect(inPowerChart).toBe(false);
  });
});
