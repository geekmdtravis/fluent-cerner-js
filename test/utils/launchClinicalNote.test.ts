import {
  launchClinicalNote,
  ClinicalNoteOpts,
} from '../../src/utils/launchClinicalNote';

describe('launchPowerNote', () => {
  it('properly constructs a valid multiple clinical note request', () => {
    const expected =
      '8316243|12575702|[155543|345623]|Clinical Notes|31|CLINNOTES|341|CLINNOTES|1';

    const opts: ClinicalNoteOpts = {
      personId: 8316243,
      encounterId: 12575702,
      eventIds: [155543, 345623],
      windowTitle: 'Clinical Notes',
      viewOptionFlags: [
        'menu',
        'buttons',
        'toolbar',
        'calculator',
        'view-only',
      ],
      viewName: 'CLINNOTES',
      viewSeq: 341,
      compName: 'CLINNOTES',
      compSeq: 1,
    };

    const result = launchClinicalNote(opts);
    expect(result.eventString).toEqual(expected);
  });
});

describe('launchPowerNote', () => {
  it('properly constructs a valid single clinical note request', () => {
    const expected =
      '8316243|12575702|[155543]|Clinical Notes Title|17|CLINNOTES5|143|CLINNOTES5|18';

    const opts: ClinicalNoteOpts = {
      personId: 8316243,
      encounterId: 12575702,
      eventIds: [155543],
      windowTitle: 'Clinical Notes Title',
      viewOptionFlags: ['menu', 'view-only'],
      viewName: 'CLINNOTES5',
      viewSeq: 143,
      compName: 'CLINNOTES5',
      compSeq: 18,
    };

    const result = launchClinicalNote(opts);
    expect(result.eventString).toEqual(expected);
  });
});
