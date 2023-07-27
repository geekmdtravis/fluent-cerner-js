import {
  launchClinicalNoteAsync,
  ClinicalNoteOpts,
} from './launchClinicalNote';

describe('launchPowerNote', () => {
  it('properly constructs a valid multiple clinical note request', async () => {
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
      inheritanceProps: {
        viewName: 'CLINNOTES',
        viewSeq: 341,
        compName: 'CLINNOTES',
        compSeq: 1,
      },
    };

    const result = await launchClinicalNoteAsync(opts);
    expect(result.eventString).toEqual(expected);
  });

  it('properly constructs a valid single clinical note request', async () => {
    const expected =
      '8316243|12575702|[155543]|Clinical Notes Title|17|CLINNOTES5|143|CLINNOTES5|18';

    const opts: ClinicalNoteOpts = {
      personId: 8316243,
      encounterId: 12575702,
      eventIds: [155543],
      windowTitle: 'Clinical Notes Title',
      viewOptionFlags: ['menu', 'view-only'],
      inheritanceProps: {
        viewName: 'CLINNOTES5',
        viewSeq: 143,
        compName: 'CLINNOTES5',
        compSeq: 18,
      },
    };

    const result = await launchClinicalNoteAsync(opts);
    expect(result.eventString).toEqual(expected);
  });

  it('empty viewOptions defaults to `view-only` with no other options', async () => {
    const expected =
      '8316243|12575702|[155543]|Clinical Notes Title|16|CLINNOTES5|143|CLINNOTES5|18';

    const opts: ClinicalNoteOpts = {
      personId: 8316243,
      encounterId: 12575702,
      eventIds: [155543],
      windowTitle: 'Clinical Notes Title',
      viewOptionFlags: [],
      inheritanceProps: {
        viewName: 'CLINNOTES5',
        viewSeq: 143,
        compName: 'CLINNOTES5',
        compSeq: 18,
      },
    };

    const result = await launchClinicalNoteAsync(opts);
    expect(result.eventString).toEqual(expected);
  });

  it('undefined viewOptions defaults to `view-only` with no other options', async () => {
    const expected =
      '8316243|12575702|[155543]|Clinical Notes Title|16|CLINNOTES5|143|CLINNOTES5|18';

    const opts: ClinicalNoteOpts = {
      personId: 8316243,
      encounterId: 12575702,
      eventIds: [155543],
      windowTitle: 'Clinical Notes Title',
      inheritanceProps: {
        viewName: 'CLINNOTES5',
        viewSeq: 143,
        compName: 'CLINNOTES5',
        compSeq: 18,
      },
    };

    const result = await launchClinicalNoteAsync(opts);
    expect(result.eventString).toEqual(expected);
  });

  it('undefined `inheritanceProps` will leave the last four fields empty', async () => {
    const expected = '8316243|12575702|[155543]|Clinical Notes Title|16||||';

    const opts: ClinicalNoteOpts = {
      personId: 8316243,
      encounterId: 12575702,
      eventIds: [155543],
      windowTitle: 'Clinical Notes Title',
      viewOptionFlags: ['view-only'],
    };

    const result = await launchClinicalNoteAsync(opts);
    expect(result.eventString).toEqual(expected);
  });
});
