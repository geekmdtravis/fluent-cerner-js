import { ApplinkReturn } from '.';
import { openApplicationAsync } from './openApplicationAsync';

/**
 * Attempts to open a website in your **local** web browser. This
 * requires that your Citrix instance be setup to handle server-to-client redirection.
 * This is quite useful as a means of accesing websites that may not be accessible
 * from within the Citrix environment, e.g. those in your local network/intranet.
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
