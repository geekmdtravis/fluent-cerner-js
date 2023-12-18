import { ApplinkReturn } from '.';
import { openApplicationAsync } from './openApplicationAsync';

/**
 * Attempts to open a website in a new tab in the PowerChart application.
 * Uses the function from this library `openApplicationAsync`.
 * @param url The URL of the website to open
 * @resolves `ApplinkReturn`
 * @throws If the URL does not include 'http://' or 'https://'
 */
export async function openWebsiteByUrlAsync(
  url: string
): Promise<ApplinkReturn> {
  if (
    !url.toLowerCase().includes('http://') &&
    !url.toLowerCase().includes('https://')
  ) {
    throw new Error(
      "openWebsiteByUrlAsync: URL must include the protocol 'http://' or 'https://'"
    );
  }

  return await openApplicationAsync('by url', url);
}
