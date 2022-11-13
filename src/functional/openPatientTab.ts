import { outsideOfPowerChartError } from '../utils';

/**
 * Attempts to open a tab with the name given to the `tab` variable in a
 * patients chart given in the context of a given encounter.
 * @param {number} personId - The identifier for the patient to whom the note belongs.
 * Cerner context variable: PAT_PersonId.
 * @param {number} encounterId - The identifier for the encounter belonging to the patient where
 * this note will be launched. Cerner context variable: VIS_EncntrId.
 * @param tab The string which represents the tab to open
 * (case insensitive). Navigation will be made to the first
 * upper-level tab in the chart that that matches the `tab` string
 * If no match is found, then sub-tab names will be searched and
 * navigation made to the first sub-tab that matches
 * the `tab` string.  If no matches are found, no navigation will occur.
 * @param quickAdd {boolean} - (optional) If true, will attempt to open the window
 * in a quick add mode. E.g. if the Orders tab is connected to it will
 * attempt to launch the Add Order window so long as Enhanced Navigation is
 * supported by your installation. Defaults to false.
 *
 * @documentation [APPLINK](https://wiki.cerner.com/display/public/MPDEVWIKI/APPLINK)
 */
export function openPatientTab(
  personId: number,
  encounterId: number,
  tab: string,
  quickAdd?: boolean
): void {
  const args = `/PERSONID=${personId} /ENCNTRID=${encounterId} /FIRSTTAB=^${tab.toUpperCase()}${
    quickAdd || false ? '+' : ''
  }^`;

  try {
    window.APPLINK(1, '$APP_APPNAME$', args);
  } catch (e) {
    if (outsideOfPowerChartError(e)) {
      console.warn(`window.APPLINK(1, "$APP_NAME$", '${args}')`);
    } else {
      throw e;
    }
  }
}
