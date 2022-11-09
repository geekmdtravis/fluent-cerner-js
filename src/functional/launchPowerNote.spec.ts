import { launchPowerNote, PowerNoteOpts } from './launchPowerNote';

describe('launchPowerNote', () => {
  it('properly constructs a valid power note request to load an *existing* power note', () => {
    const expected = '123456|78910||1337';

    const opts: PowerNoteOpts = {
      personId: 123456,
      encounterId: 78910,
      eventId: 1337,
    };

    const result = launchPowerNote(opts);
    expect(result.eventString).toEqual(expected);
  });
  it('properly constructs a valid power note request to create a *new* power note', () => {
    const expected = '8316243|12575702|CKI!EPS HAIR LOSS|0';

    const opts: PowerNoteOpts = {
      personId: 8316243,
      encounterId: 12575702,
      CKI: 'CKI!EPS HAIR LOSS',
    };

    const result = launchPowerNote(opts);
    expect(result.eventString).toEqual(expected);
  });
  it('properly constructs a valid power note request to load an *existing* power note when both CKI and eventId are provided', () => {
    const expected = '123456|78910||1337';

    const opts: PowerNoteOpts = {
      personId: 123456,
      encounterId: 78910,
      CKI: 'CKI!EPS HAIR LOSS',
      eventId: 1337,
    };

    const result = launchPowerNote(opts);
    expect(result.eventString).toEqual(expected);
  });
  it('throws an error if neither CKI nor eventId are provided', () => {
    const opts: PowerNoteOpts = {
      personId: 123456,
      encounterId: 78910,
    };

    expect(() => launchPowerNote(opts)).toThrowError();
  });
});

//npx yarn test --verbose --coverage
