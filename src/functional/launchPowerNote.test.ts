import { launchPowerNote, PowerNoteOpts } from './launchPowerNote';

describe('launchPowerNote', () => {
  it('properly constructs a valid power note request to load an *existing* power note', () => {
    const expected = '123456|78910|CKI!EPS HAIR LOSS|1337';

    const opts: PowerNoteOpts = {
      personId: 123456,
      encounterId: 78910,
      CKI: 'CKI!EPS HAIR LOSS',
      eventId: 1337,
      createNewNote: false,
    };

    const result = launchPowerNote(opts);
    expect(result.eventString).toEqual(expected);
  });
});

describe('launchPowerNote', () => {
  it('properly constructs a valid power note request to create a *new* power note', () => {
    const expected = '8316243|12575702|CKI!EPS HAIR LOSS|0';

    const opts: PowerNoteOpts = {
      personId: 8316243,
      encounterId: 12575702,
      CKI: 'CKI!EPS HAIR LOSS',
      eventId: 1337,
      createNewNote: true,
    };

    const result = launchPowerNote(opts);
    expect(result.eventString).toEqual(expected);
  });
});

//npx yarn test --verbose --coverage
