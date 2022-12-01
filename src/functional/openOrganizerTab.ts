import { MPageEventReturn } from '.';
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
 *
 * @documentation [APPLINK](https://wiki.cerner.com/display/public/MPDEVWIKI/APPLINK)
 */
export function openOrganizerTab(tab: string): MPageEventReturn {
  let inPowerChart = true;
  const eventString = `/ORGANIZERTAB=^${tab}^`;
  try {
    window.APPLINK(0, 'Powerchart.exe', eventString);
  } catch (e) {
    if (outsideOfPowerChartError(e)) {
      inPowerChart = false;
    } else {
      throw e;
    }
  }
  return { eventString, inPowerChart };
}
