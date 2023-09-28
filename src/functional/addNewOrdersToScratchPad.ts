import { PowerChartReturn } from '.';
import { outsideOfPowerChartError } from '../utils';
import { StandaloneOrder } from './submitPowerOrders';

/**
 * Attempts to add new standalone orders to the scratchpad
 * @param {any} dcof  - the reference to the DisernObjectFactory object
 * @param {number} moewHandle - the handle to the MOEW
 * @param {Array<StandaloneOrder>} standaloneOrders -  An array of objects containg order synonym Ids, order origination flags and, optionally, sentence Ids, for standalone orders to be placed
 * @param {boolean} interactionChecking - A boolean value indicating whether or not order interaction checking should be performed (strongly recommended to be set to true)
 * @returns a `Promise` which resolves to a PowerChartReturn and string, indicating the result of whether or not standalone orders were successfully added
 * @throws `Error` if an unexpected error occurs or if the array provided is empty
 */
export async function addNewOrdersToScratchpadAsync(
  dcof: any,
  moewHandle: number,
  standaloneOrders: Array<StandaloneOrder>,
  interactionChecking: boolean
): Promise<AddNewOrdersToScratchpadReturn> {
  //Prepare the default return data
  let retData: AddNewOrdersToScratchpadReturn = {
    inPowerChart: true,
    result: 'successfully added',
  };

  // Check for to make sure the array of orders provided is not empty
  if (standaloneOrders.length < 1) {
    throw new RangeError(
      'There should be at least one standalone order provided.'
    );
  }

  // Convert the standalone orders provided into the required XML string
  let standaloneOrdersXML: string = '';

  standaloneOrders.forEach(standaloneOrder => {
    standaloneOrdersXML += `<Order><EOrderOriginationFlag>${
      standaloneOrder.origination === 'inpatient order' ? 0 : 1
    }</EOrderOriginationFlag><SynonymId>${standaloneOrder.synonymId}</SynonymId>
    <OrderSentenceId>${
      standaloneOrder.sentenceId ? standaloneOrder.sentenceId : ''
    }</OrderSentenceId></Order>`;
  });

  //Add <Orders> to beginning & end of the Standalone Order XML
  standaloneOrdersXML = '<Orders>' + standaloneOrdersXML;
  standaloneOrdersXML += '</Orders>';

  //Remove newlines and spaces
  standaloneOrdersXML = standaloneOrdersXML.replace(/[\r\n\s]/g, '');

  try {
    const response = await dcof.AddNewOrdersToScratchpad(
      moewHandle,
      standaloneOrdersXML,
      interactionChecking
    );

    // Set the `result value` equal to a string describing the number that PowerChart returns
    switch (response) {
      case 0:
        retData.result = 'successfully added';
        break;

      case 1:
        retData.result = 'added and signed';
        break;

      case 2:
        retData.result = 'cancelled by user';
        break;

      case 3:
        retData.result = 'add failed';
        break;
    }
  } catch (e) {
    // If outside of PowerChart, set the output to reflect that
    if (outsideOfPowerChartError(e)) {
      retData.inPowerChart = false;
      retData.result = 'add failed';
    } else {
      // If some other error was encountered, throw that error
      throw e;
    }
  }

  // Return the retData object when complete
  return retData;
}

export type AddNewOrdersToScratchpadReturn = PowerChartReturn & {
  result: AddNewOrdersToScratchpadResult;
};

export type AddNewOrdersToScratchpadResult =
  | 'successfully added'
  | 'added and signed'
  | 'cancelled by user'
  | 'add failed';
