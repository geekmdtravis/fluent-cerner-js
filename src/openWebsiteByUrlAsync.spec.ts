import { openWebsiteByUrlAsync } from './openWebsiteByUrlAsync';

describe('openWebsiteByUrlAsync', () => {
  it('returns an ApplinkReturn object', async () => {
    const result = await openWebsiteByUrlAsync('https://www.google.com');
    expect(result).toBeInstanceOf(Object);
    expect(result).toHaveProperty('eventString');
    expect(result).toHaveProperty('inPowerChart');
    expect(result).toHaveProperty('badInput');
  });
  it("throws an error if the URL does not include 'http://' or 'https://'", async () => {
    await expect(openWebsiteByUrlAsync('www.google.com')).rejects.toThrow(
      "openWebsiteByUrlAsync: URL must include the protocol 'http://' or 'https://'"
    );
  });
  it('does not throw an error if the URL includes http://', async () => {
    await expect(
      openWebsiteByUrlAsync('http://www.google.com')
    ).resolves.not.toThrow();
  });
  it('does not throw an error if the URL includes https://', async () => {
    await expect(
      openWebsiteByUrlAsync('https://www.google.com')
    ).resolves.not.toThrow();
  });
  it('does not throw an error if the URL has uppercase http://', async () => {
    await expect(
      openWebsiteByUrlAsync('HTTP://www.google.com')
    ).resolves.not.toThrow();
  });
  it('does not throw an error if the URL has uppercase https://', async () => {
    await expect(
      openWebsiteByUrlAsync('HTTPS://www.google.com')
    ).resolves.not.toThrow();
  });
});
