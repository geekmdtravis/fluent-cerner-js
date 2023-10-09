import { launchPowerNoteAsync } from './launchPowerNoteAsync';

describe('launchPowerNoteAsync', () => {
  it('properly constructs a valid power note request to load an *existing* power note', async () => {
    const expected = '123456|78910||1337';

    const result = await launchPowerNoteAsync('existing', 123456, 78910, 1337);
    expect(result.eventString).toEqual(expected);
  });
  it('properly constructs a valid power note request to create a *new* power note', async () => {
    const expected = '8316243|12575702|CKI!EPS HAIR LOSS|0';

    const result = await launchPowerNoteAsync(
      'new',
      8316243,
      12575702,
      'CKI!EPS HAIR LOSS'
    );
    expect(result.eventString).toEqual(expected);
  });
  it('throws an error if `new` is provided but targetId is not a string', async () => {
    try {
      await launchPowerNoteAsync('new', 123456, 78910, 1337);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect((e as Error).message).toEqual(
        'targetId (for CKI) must be a string when launching a new PowerNote.'
      );
    }
  });
  it('throws an error if `existing` is provided but targetId not a number', async () => {
    try {
      await launchPowerNoteAsync(
        'existing',
        123456,
        78910,
        'CKI!EPS HAIR LOSS'
      );
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect((e as Error).message).toEqual(
        'targetId must be a number when loading an existing PowerNote.'
      );
    }
  });
  it('returns false for `inPowerChart` when called outside of PowerChart', async () => {
    const result = await launchPowerNoteAsync('existing', 123456, 78910, 1337);
    expect(result.inPowerChart).toEqual(false);
  });
});
