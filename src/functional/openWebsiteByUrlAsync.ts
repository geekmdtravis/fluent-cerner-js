import { ApplinkReturn } from '.';
import { openApplicationAsync } from './openApplicationAsync';

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
