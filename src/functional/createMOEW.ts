import { PowerChartReturn } from '.';
import { outsideOfPowerChartError } from '../utils';

/**
 * Creates an MOEW handle.
 * @param dPersonId {number} - the patient ID
 * @param dEncntrId {number} - the encounter ID in which orders would be placed
 * @param dwCustomizeFlag {number} - mask used to determine options available within the MOEW
 * @param dwTabFlag {number} - the type of list being customized (2 for orders, 3 for medications).
 * @param dwTabDisplayOptionsFlag {number} - mask specifying the components to display on the list.
 * @returns a `Promise` which resolves to an integer representing a handle to the MOEW instance. 0 indicates an invalid call or call from outside PowerChart.
 *
 * @throws `Error` if an unexpected error occurs
 */
export async function createMOEWAsync(
  dPersonId: number,
  dEncntrId: number,
  dwCustomizeFlag: number,
  dwTabFlag: number,
  dwTabDisplayOptionsFlag: number
): Promise<PowerChartReturn & { m_hMOEW: number }> {
  let retData: {
    inPowerChart: boolean;
    m_hMOEW: number;
  } = {
    inPowerChart: true,
    m_hMOEW: 0,
  };

  try {
    const dcof = await window.external.DiscernObjectFactory('POWERORDERS');
    const response = await dcof.CreateMOEW(
      dPersonId,
      dEncntrId,
      dwCustomizeFlag,
      dwTabFlag,
      dwTabDisplayOptionsFlag
    );
    retData.m_hMOEW = response;
  } catch (e) {
    if (outsideOfPowerChartError(e)) {
      return {
        inPowerChart: false,
        m_hMOEW: 0,
      };
    } else {
      throw e;
    }
  }
  return retData;
}
