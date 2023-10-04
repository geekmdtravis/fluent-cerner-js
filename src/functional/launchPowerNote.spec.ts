import { launchPowerNoteAsync, PowerNoteOpts } from './launchPowerNote';

describe('launchPowerNoteAsync', () => {
  it('properly constructs a valid power note request to load an *existing* power note', async () => {
    const expected = '123456|78910||1337';

    const opts: PowerNoteOpts = {
      patientId: 123456,
      encounterId: 78910,
      target: 'existing',
      targetId: 1337,
    };

    const result = await launchPowerNoteAsync(opts);
    expect(result.eventString).toEqual(expected);
  });
  it('properly constructs a valid power note request to create a *new* power note', async () => {
    const expected = '8316243|12575702|CKI!EPS HAIR LOSS|0';

    const opts: PowerNoteOpts = {
      patientId: 8316243,
      encounterId: 12575702,
      target: 'new',
      targetId: 'CKI!EPS HAIR LOSS',
    };

    const result = await launchPowerNoteAsync(opts);
    expect(result.eventString).toEqual(expected);
  });
  it('throws an error if `new` is provided but targetId is not a string', async () => {
    const opts: PowerNoteOpts = {
      patientId: 123456,
      encounterId: 78910,
      target: 'new',
      targetId: 1337,
    };

    try {
      await launchPowerNoteAsync(opts);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect((e as Error).message).toEqual(
        'targetId (for CKI) must be a string when launching a new PowerNote.'
      );
    }
  });
  it('throws an error if `existing` is provided but targetId not a number', async () => {
    const opts: PowerNoteOpts = {
      patientId: 123456,
      encounterId: 78910,
      target: 'existing',
      targetId: 'CKI!EPS HAIR LOSS',
    };

    try {
      await launchPowerNoteAsync(opts);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect((e as Error).message).toEqual(
        'targetId must be a number when loading an existing PowerNote.'
      );
    }
  });
  it('returns false for `inPowerChart` when called outside of PowerChart', async () => {
    const opts: PowerNoteOpts = {
      patientId: 123456,
      encounterId: 78910,
      target: 'existing',
      targetId: 1337,
    };

    const result = await launchPowerNoteAsync(opts);
    expect(result.inPowerChart).toEqual(false);
  });
});
