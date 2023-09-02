import { PowerChartReturn } from '.';
import { outsideOfPowerChartError } from '../utils';

export async function openWebsiteByUrlAsync(
  url: string
): Promise<PowerChartReturn & { success: boolean }> {
  if (!url.includes('http://') && !url.includes('https://')) {
    throw new Error(
      "openWebsiteByUrlAsync: URL must include 'http://' or 'https://'"
    );
  }
  const retVal: PowerChartReturn & { success: boolean } = {
    inPowerChart: true,
    success: false,
  };
  try {
    const response = await window.external.APPLINK(100, url, '');
    retVal.success = response === null ? true : false;
  } catch (e) {
    if (outsideOfPowerChartError(e)) {
      retVal.inPowerChart = false;
    } else {
      throw e;
    }
  }
  return retVal;
}
