import { launchPowerNote, PowerNoteOpts } from './launchPowerNote';

describe('launchPowerNote', () => {
  it('properly constructs a valid power note request to load an *existing* power note', () => {
    const expected = '123456|78910||1337';

    const opts: PowerNoteOpts = {
      personId: 123456,
      encounterId: 78910,
      target: 'existing',
      targetId: 1337,
    };

    const result = launchPowerNote(opts);
    expect(result.eventString).toEqual(expected);
  });
  it('properly constructs a valid power note request to create a *new* power note', () => {
    const expected = '8316243|12575702|CKI!EPS HAIR LOSS|0';

    const opts: PowerNoteOpts = {
      personId: 8316243,
      encounterId: 12575702,
      target: 'new',
      targetId: 'CKI!EPS HAIR LOSS',
    };

    const result = launchPowerNote(opts);
    expect(result.eventString).toEqual(expected);
  });
  it('throws an error if `new` is provided but is not a string', () => {
    const opts: PowerNoteOpts = {
      personId: 123456,
      encounterId: 78910,
      target: 'new',
      targetId: 1337,
    };

    expect(() => launchPowerNote(opts)).toThrowError();
  });
  it('throws an error if `existing` is provided but is not a number', () => {
    const opts: PowerNoteOpts = {
      personId: 123456,
      encounterId: 78910,
      target: 'existing',
      targetId: 'CKI!EPS HAIR LOSS',
    };

    expect(() => launchPowerNote(opts)).toThrowError();
  });
  it('returns false for `inPowerChart` when called outside of PowerChart', () => {
    const opts: PowerNoteOpts = {
      personId: 123456,
      encounterId: 78910,
      target: 'existing',
      targetId: 1337,
    };

    const result = launchPowerNote(opts);
    expect(result.inPowerChart).toEqual(false);
  });
});
