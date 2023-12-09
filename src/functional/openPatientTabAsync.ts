import { ApplinkReturn } from '.';
import {
  OpenApplicationArgument,
  openApplicationAsync,
} from './openApplicationAsync';

/**
 * Attempts to open a tab with the name given to the `tab` variable in a
 * patients chart given in the context of a given encounter.  Uses the function from
 * this library `openApplicationAsync`.
 * @param {number} patientId - The identifier for the patient to whom the note belongs.
 * Cerner context variable: PAT_PersonId.
 * @param {number} encounterId - The identifier for the encounter belonging to the patient where
 * this note will be launched. Cerner context variable: VIS_EncntrId.
 * @param tab The string which represents the tab to open
 * (case insensitive). Navigation will be made to the first
 * upper-level tab in the chart that that matches the `tab` string
 * If no match is found, then sub-tab names will be searched and
 * navigation made to the first sub-tab that matches
 * the `tab` string.  If no matches are found, no navigation will occur.
 * @resolves `ApplinkReturn`
 * @throws If an unexpected error occurs while attempting to open the tab.
 * @documentation [APPLINK](https://wiki.cerner.com/display/public/MPDEVWIKI/APPLINK)
 */
export async function openPatientTabAsync(
  patientId: number,
  encounterId: number,
  tab: string
): Promise<ApplinkReturn> {
  const args: Array<OpenApplicationArgument> = [
    {
      argument: 'PERSONID',
      value: patientId,
    },
    {
      argument: 'ENCNTRID',
      value: encounterId,
    },
    {
      argument: 'FIRSTTAB',
      value: tab,
    },
  ];

  return await openApplicationAsync('by executable', '$APP_APPNAME$', args);
}
