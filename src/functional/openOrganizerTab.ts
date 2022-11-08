/**
 * Attempts to open a tab with the name given to the `tab` variable in at the chart organizer
 * level.
 * @param tab The string which represents the tab to open
 * (case insensitive). Navigation will be made to the first
 * upper-level tab in the chart that that matches the `tab` string
 * If no match is found, then sub-tab names will be searched and
 * navigation made to the first sub-tab that matches
 * the `tab` string.  If no matches are found, no navigation will occur.
 */
export function openOrganizerTab(tab: string): void {
  try {
    window.APPLINK(0, 'Powerchart.exe', `/ORGANIZERTAB=^${tab}^`);
  } catch (e) {
    if (e instanceof ReferenceError) {
      console.warn(
        `We're likely not inside PowerChart. The input given would be: '0, "Powerchart.exe", "/ORGANIZERTAB=^${tab}^"'`
      );
    } else {
      throw e;
    }
  }
}
