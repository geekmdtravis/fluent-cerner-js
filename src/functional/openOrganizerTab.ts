import { ApplinkReturn } from '.';
import { outsideOfPowerChartError } from '../utils';

/**
 * Attempts to open a tab with the name given to the `tab` variable in at the chart organizer
 * level.
 * @param tab The string which represents the tab to open
 * (case insensitive). Navigation will be made to the first
 * upper-level tab in the chart that that matches the `tab` string
 * If no match is found, then sub-tab names will be searched and
 * navigation made to the first sub-tab that matches
 * the `tab` string.  If no matches are found, no navigation will occur.
 * @returns {Promise<ApplinkReturn>} - A promise that will resolve to an object with
 * the following properties: `eventString`, `badInput`, and `inPowerChart`. The properties
 * `eventString` and `inPowerChart` are inhereted from `MPageEventReturn`. The property
 * `badInput` is a boolean that indicates whether the tab name given in the `tab` parameter
 * was invalid. Given the underlying Cerner Discern implementation, we cannot
 * determine which parameter was invalid.
 * @throws If an unexpected error occurs while attempting to open the tab.
 *
 * @documentation [APPLINK](https://wiki.cerner.com/display/public/MPDEVWIKI/APPLINK)
 */
export async function openOrganizerTabAsync(
  tab: string
): Promise<ApplinkReturn> {
  const retVal: ApplinkReturn = {
    eventString: `/ORGANIZERTAB=^${tab}^`,
    badInput: false,
    inPowerChart: true,
  };
  try {
    const response = await window.APPLINK(
      0,
      'Powerchart.exe',
      retVal.eventString
    );
    retVal.badInput = response === null ? true : false;
  } catch (e) {
    if (outsideOfPowerChartError(e)) {
      retVal.inPowerChart = false;
    } else {
      throw e;
    }
  }
  return retVal;
}
