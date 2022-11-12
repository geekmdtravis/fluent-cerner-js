import { launchPowerForm, PowerFormOpts } from './launchPowerForm';

describe('launchPowerForm', () => {
  it('properly constructs a valid power form request with `new form` selected', () => {
    const expected = '733757|701346|15721144|0|0';
    const opts: PowerFormOpts = {
      personId: 733757,
      encounterId: 701346,
      target: 'new form',
      targetId: 15721144,
      permissions: 'modify',
    };

    const result = launchPowerForm(opts);
    expect(result.eventString).toEqual(expected);
  });

  it('checks for the targetID parameter when set to `new form` and throws error if not present', () => {
    const opts: PowerFormOpts = {
      personId: 733757,
      encounterId: 701346,
      target: 'new form',
      targetId: undefined,
      permissions: 'modify',
    };
    expect(() => launchPowerForm(opts)).toThrow(Error);
  });

  it('checks for the targetId parameter when set to `completed form` and throws error if not present', () => {
    const opts: PowerFormOpts = {
      personId: 733757,
      encounterId: 701346,
      target: 'completed form',
      targetId: undefined,
      permissions: 'modify',
    };
    expect(() => launchPowerForm(opts)).toThrow(Error);
  });

  it('successfully generates a power form request with the `completed form` target selected', () => {
    const expected = '733757|701346|0|15721144|0';
    const opts: PowerFormOpts = {
      personId: 733757,
      encounterId: 701346,
      target: 'completed form',
      targetId: 15721144,
      permissions: 'modify',
    };

    const result = launchPowerForm(opts);
    expect(result.eventString).toEqual(expected);
  });

  it('successfully generates a power form request with the `new form search` target selected', () => {
    const expected = '733757|701346|0|0|0';
    const opts: PowerFormOpts = {
      personId: 733757,
      encounterId: 701346,
      target: 'new form search',
      targetId: 15721144,
      permissions: 'modify',
    };

    const result = launchPowerForm(opts);
    expect(result.eventString).toEqual(expected);
  });

  it('behaves as expected if called outside of PowerChart', () => {
    const opts: PowerFormOpts = {
      personId: 733757,
      encounterId: 701346,
      target: 'new form',
      targetId: 15721144,
      permissions: 'modify',
    };

    const result = launchPowerForm(opts);
    expect(result.inPowerChart).toBe(false);
  });

  it('when permissions is undefined, defaults to `read-only`', () => {
    const expected = '733757|701346|15721144|0|1';
    const opts: PowerFormOpts = {
      personId: 733757,
      encounterId: 701346,
      target: 'new form',
      targetId: 15721144,
    };

    const result = launchPowerForm(opts);
    expect(result.eventString).toEqual(expected);
  });
});
