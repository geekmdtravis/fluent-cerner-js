import { ApplinkReturn } from '.';
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
 * @returns {Promise<ApplinkReturn>} - A promise that will resolve to an object with
 * the following properties: `eventString`, `badInput`, and `inPowerChart`. The properties
 * `eventString` and `inPowerChart` are inhereted from `MPageEventReturn`. The property
 * `badInput` is a boolean that indicates whether the tab name given in the `tab` parameter,
 * the `eid` parameter, or the `pid` parameter was invalid. Given the underlying Cerner Discern
 * implementation, we cannot determine which parameter was invalid.
 * @throws If an unexpected error occurs while attempting to open the tab.
 *
 * @documentation [APPLINK](https://wiki.cerner.com/display/public/MPDEVWIKI/APPLINK)
 */
export async function openPatientTabAsync(
  personId: number,
  encounterId: number,
  tab: string,
  quickAdd?: boolean
): Promise<ApplinkReturn> {
  const retVal: ApplinkReturn = {
    eventString: `/PERSONID=${personId} /ENCNTRID=${encounterId} /FIRSTTAB=^${tab.toUpperCase()}${
      quickAdd || false ? '+' : ''
    }^`,
    badInput: false,
    inPowerChart: true,
  };

  try {
    const response = await window.external.APPLINK(
      1,
      '$APP_APPNAME$',
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
