import { ApplinkReturn } from '.';
import { openApplicationAsync } from './openApplicationAsync';

// write jsdoc
/**
 * Attempts to open a website in a new tab in the PowerChart application.
 * Uses the function from this library `openApplicationAsync`.
 * @param url The URL of the website to open
 * @returns {Promise<ApplinkReturn>} - A promise that will resolve to an object with
 * the following properties: `eventString`, `badInput`, and `inPowerChart`. The properties
 * `eventString` and `inPowerChart` are inhereted from `MPageEventReturn`. The property
 * `badInput` is a boolean that indicates whether the tab name given in the `tab` parameter
 * was invalid. Given the underlying Cerner Discern implementation, we cannot
 * determine which parameter was invalid.
 * @throws If an unexpected error occurs while attempting to open the tab.
 * @throws If the URL does not include 'http://' or 'https://'
 *
 * @documentation [APPLINK](https://wiki.cerner.com/display/public/MPDEVWIKI/APPLINK)
 */
export async function openWebsiteByUrlAsync(
  url: string
): Promise<ApplinkReturn> {
  if (!url.includes('http://') && !url.includes('https://')) {
    throw new Error(
      "openWebsiteByUrlAsync: URL must include 'http://' or 'https://'"
    );
  }

  return await openApplicationAsync('by url', url);
}
