import { XMLParser } from 'fast-xml-parser';
import { outsideOfPowerChartError } from '../utils';
import { calculateMOEWBitmask } from '../utils/calculateMOEWBitmask';

/**
 * PowerPlanMOEWOpts is a type which represents the parameters to be be passed into the CreateMOEW() function.
 * These parameters, passed as an array, are optional and, if not provided, the values will default to the recommended values for the MOEW
 * with Power Plan support. If any values are provided, those will be the only values used.
 *
 * @action `add rx filter` - Sets the prescription indicator to the default filter.
 * @action `allow only inpatient and outpatient orders` - Only inpatient and ambulatory venue ordering will be allowed.
 * @action `allow power plan doc` - Enables PowerPlan documentation.
 * @action `allow power plans` - Allows PowerPlans to be used from the MOEW.
 * @action `allow regimen` - Ensures that regimens are enabled.
 * @action `customize meds` - States that medications are being customized. Either this or "customize orders" must be present (if parameters are provided), but not both.
 * @action `customize orders` - States that orders are being customized. Either this or "customize meds" must be present (if parameters are provided), but not both.
 * @action `disable auto search` - Disables auto search.
 * @action `disallow EOL` - This option forces edit-on-line mode (which allows multi-selection) to be disabled.
 * @action `documented meds only` - Restricts the MOEW to only perform actions on documented medications.
 * @action `hide demographics` - Hides the demographics bar.
 * @action `hide med rec` - Hides medication reconiciliation controls.
 * @action `read only` - The MEOW will be read only.
 * @action `show diag and probs` -  Configures the MOEW such that the diagnoses/problem control menu is displayed.
 * @action `show list details` -  Configures the MOEW such that the order detail control is enabled. Note that this is required if adding any orders (if parameters are provided).
 * @action `show nav tree` - Configures the MOEW such that the navigator tree control is displayed.
 * @action `show order profile` -  Configures the MOEW such that the order profile is displayed.
 * @action `show orders search` -  Configures the MOEW such that the order search menu is displayed. Note that this is required if adding any orders (if parameters are provided).
 * @action `show refresh and print buttons` - Will show the refresh and print buttons in the MOEW.
 * @action `show related res` -  Configures the MOEW such that the related results control is displayed.
 * @action `show scratchpad` -  Configures the MOEW such that the scratchpad is displayed. Note that this is required if adding any orders (if parameters are provided).
 * @action `sign later` - Sign later functionality will be allowed from the MOEW.
 *
 * @documentation [POWERORDERS - CREATEMOEW](https://wiki.cerner.com/display/public/MPDEVWIKI/CreateMOEW)
 **/
export type PowerPlanMOEWOpts =
  | 'add rx filter'
  | 'allow only inpatient and outpatient orders'
  | 'allow power plan doc'
  | 'allow power plans'
  | 'allow regimen'
  | 'customize meds'
  | 'customize order'
  | 'disable auto search'
  | 'disallow EOL'
  | 'documented meds only'
  | 'hide demographics'
  | 'hide med rec'
  | 'read only'
  | 'show diag and probs'
  | 'show list details'
  | 'show nav tree'
  | 'show order profile'
  | 'show orders search'
  | 'show refresh and print buttons'
  | 'show related res'
  | 'show scratchpad'
  | 'sign later';

export type StandaloneOrder = {
  synonymId: number;
  orderOrigination: 'inpatient order' | 'prescription order';
  sentenceId?: number;
};

export type PowerPlanOrder = {
  pathwayCatalogId: number;
  personalizedPlanId?: number;
  diagnoses?: Array<number>;
};

/**
 * PowerPlanOrderOpts is a type which represents the parameters to be be passed into the AddPowerPlanWithDetails() function.
 * @param {number} personId - The identifier for the patient.
 * Cerner context variable: PAT_PersonId.
 *
 * @param {number} encounterId - The identifier for the encounter belonging to the patient where
 * this order will be placed. Cerner context variable: VIS_EncntrId.
 *
 * @param {Array<StandaloneOrder>} standaloneOrders -  An array of objects containg order synonym Ids, order origination flags and, optionally, sentence Ids, for standalone orders to be placed. Either this, `powerPlanOrders,` or both, should be present.
 *
 * @param {Array<PowerPlanOrder>} powerPlanOrders - An array of objects containg catalog Ids and, optionally, personalized plan Ids and diagnosis code Ids, for PowerPlan orders to be placed. Either this, `standaloneOrders,` or both, should be present.
 *
 * @param {boolean} signSilently - A boolean indicating whether or not a "silent sign" should be attempted.
 *
 * @documentation [POWERORDERS - AddPowerPlanWithDetails](https://wiki.cerner.com/display/public/MPDEVWIKI/AddPowerPlanWithDetails)
 **/
export type PowerPlanOrderOpts = {
  personId: number;
  encounterId: number;
  standaloneOrders?: Array<StandaloneOrder>;
  powerPlanOrders?: Array<PowerPlanOrder>;
  signSilently: boolean;
};

/**
 * Submits a combination of standalone orders and/or PowerPlan orders by utilizing underlying Cerner - POWERORDERS functionality.
 * @param {PowerPlanOrderOpts} orderOpts - An object containing the person/patient Id, encounter Id,
 * an array of objects of either standalone orders or PowerPlan orders (each of which may contain
 * specific order properties), and a flag indicating whether or not the orders should be signed
 * silently.
 * @param {Array<PowerPlanMOEWOpts>} moewOpts - An (optional) array of strings defining the MOEW behavior.
 * If not provided, the values will default to the recommended values for the MOEW to be configured
 * with Power Plan support. If any values are provided, those will be the only values used.
 * @returns an object with several high value properties: a boolean flag set to notify the user if the
 * attempt was made outside of PowerChart, the `status` of the order attempt, an object
 * representing the XML response string (converted to an array of the orders placed with order `name`,
 * `oid`, and `display` available for each), and the XML/response string itself (which is attempted to be parsed).
 * @throws an error if an unexpected error occurs that could not be handled appropriately.
 *
 * @documentation [POWERORDERS](https://wiki.cerner.com/display/public/MPDEVWIKI/POWERORDERS)
 */
export const submitPowerPlanOrdersAsync = async (
  orderOpts: PowerPlanOrderOpts,
  moewOpts?: Array<PowerPlanMOEWOpts>
): Promise<SubmitPowerPlanOrderReturn> => {
  //Either use the options provided by the user, or if none or provided, set default PowerPlan options
  const inputOpts: Array<PowerPlanMOEWOpts> = moewOpts
    ? moewOpts
    : ['allow power plans', 'allow power plan doc'];

  const {
    personId,
    encounterId,
    standaloneOrders,
    powerPlanOrders,
    signSilently,
  } = orderOpts;

  // Calculate the CreateMOEW() parameters
  const {
    dwCustomizeFlag,
    dwTabFlag,
    dwTabDisplayOptionsFlag,
  } = calculateMOEWBitmask(inputOpts);

  //Enable interaction checking (will hardcode to true for safety)
  const m_bSignTimeInteractionChecking = true;

  //Create the return object with default values
  let retVal: SubmitPowerPlanOrderReturn = {
    inPowerChart: true,
    status: 'success',
    response: null,
    ordersPlaced: null,
  };

  //Hold information regarding any standalone or PowerPlan orders
  let standaloneOrdersXML: string = '';

  let powerPlanOrdersXML: string = '';

  //Prepare the XML strings for input to AddNewOrdersToScatchPadAddPowerPlanWithDetails()
  if (standaloneOrders && standaloneOrders.length >= 1) {
    standaloneOrders.forEach(standaloneOrder => {
      standaloneOrdersXML += `<Order><EOrderOriginationFlag>${
        standaloneOrder.orderOrigination === 'inpatient order' ? 0 : 1
      }</EOrderOriginationFlag><SynonymId>${
        standaloneOrder.synonymId
      }</SynonymId>
      <OrderSentenceId>${
        standaloneOrder.sentenceId ? standaloneOrder.sentenceId : ''
      }</OrderSentenceId></Order>`;
    });

    //Add <Orders> to beginning & end of the Standalone Order XML
    standaloneOrdersXML = '<Orders>' + standaloneOrdersXML;
    standaloneOrdersXML += '</Orders>';
  }

  if (powerPlanOrders && powerPlanOrders.length >= 1) {
    powerPlanOrders.forEach(powerPlanOrder => {
      powerPlanOrdersXML += `<Plan><PathwayCatalogId>${
        powerPlanOrder.pathwayCatalogId
      }</PathwayCatalogId><PersonalizedPlanId>${
        powerPlanOrder.personalizedPlanId
          ? powerPlanOrder.personalizedPlanId
          : ''
      }</PersonalizedPlanId><Diagnoses>
    ${
      powerPlanOrder.diagnoses
        ? powerPlanOrder.diagnoses.map(diagnosis => {
            return '<DiagnosisId>' + diagnosis + '</DiagnosisId>';
          })
        : ''
    }
    </Diagnoses></Plan>`;
    });

    //Add <Plans> to beginning & end of PowerPlan XML
    powerPlanOrdersXML = '<Plans>' + powerPlanOrdersXML;
    powerPlanOrdersXML += '</Plans>';
  }

  try {
    //Create the DiscernObjectFactory - POWERORDERS object
    const dcof = await window.external.DiscernObjectFactory('POWERORDERS');

    //Initialize the MOEW handle
    let m_hMOEW = 0;

    //Create the MOEW
    m_hMOEW = await dcof.CreateMOEW(
      personId,
      encounterId,
      dwCustomizeFlag,
      dwTabFlag,
      dwTabDisplayOptionsFlag
    );

    //Add PowerPlan orders (if present)
    if (powerPlanOrders && powerPlanOrders.length >= 1) {
      await dcof.AddPowerPlanWithDetails(m_hMOEW, powerPlanOrdersXML);
    }

    //Add standalone orders (if present)
    if (standaloneOrders && standaloneOrders.length >= 1) {
      await dcof.AddNewOrdersToScratchpad(
        m_hMOEW,
        standaloneOrdersXML,
        m_bSignTimeInteractionChecking
      );
    }

    //Display the MOEW
    await dcof.DisplayMOEW(m_hMOEW);

    //Sign orders silently (if enalbed)
    if (signSilently === true) {
      await dcof.SignOrders(m_hMOEW);
    }

    //Obtain the return string
    const responseXML = await dcof.GetXMLOrdersMOEW(m_hMOEW);

    //Destroy the MOEW at the end of the ordering process.
    await dcof.DestroyMOEW(m_hMOEW);

    //Check to see if the response type was not a string (should always either be "" or an XML string)
    if (typeof responseXML !== 'string') {
      retVal.status = 'invalid data returned';
      return retVal;
    }

    //Check to see if no orders were placed or if invalid parameters were provided
    if (responseXML === '') {
      retVal.status = 'cancelled, failed, or invalid parameters provided';
      return retVal;
    }

    //Assuming we have a valid (non-empty) string at this point, attempt to parse out its XML and populate `retVal.ordersPlaced`
    const parser = new XMLParser();
    try {
      const parsed: OrdersReturnXML = parser.parse(responseXML);
      retVal.response = parsed;
      if (!(parsed.Orders.Order instanceof Array)) {
        parsed.Orders.Order = [parsed.Orders.Order];
      }
      retVal.ordersPlaced = parsed.Orders.Order.map(o => ({
        name: o.OrderedAsMnemonic,
        oid: o.OrderId,
        display: o.ClinDisplayLine,
      }));
    } catch {
      //A parsing error indicates the string isn't formatted as epxected
      retVal.status = 'xml parse error';
    }
  } catch (e) {
    //Document the error depending on the type, and adjust the return object
    if (outsideOfPowerChartError(e)) {
      retVal.inPowerChart = false;
      retVal.ordersPlaced = [];
      retVal.response = null;
      retVal.status = 'dry run';
    } else {
      throw e;
    }
  }

  return retVal;
};

// Return type to signifiy status of order placing
export type SubmitOrdersStatus =
  | 'success'
  | 'cancelled, failed, or invalid parameters provided'
  | 'invalid data returned'
  | 'xml parse error'
  | 'dry run';

// Return type to contain the orders placed and associated XML data
export type OrdersReturnXML = {
  Orders: {
    OrderVersion: number;
    Order: Array<PowerPlanReturnOrderXML>;
  };
};

// Return type of XML data
export type PowerPlanReturnOrderXML = {
  OrderableType: number;
  OrderId: number;
  SynonymId: number;
  ClinCatCd: number;
  CatalogTypeCd: number;
  ActivityTypeCd: number;
  OrderSentenceId: number;
  RxMask: number;
  HnaOrderMnemonic: string;
  OrderedAsMnemonic: string;
  OrderDtTm: string;
  OrigOrderDtTm: string;
  OrderMnemonic: string;
  OrderStatusCd: number;
  OrderStatusDisp: string;
  ClinDisplayLine: string;
  SimpleDisplayLine: string;
  DeptStatusCd: number;
  NeedDoctorCosignInd: number;
  NeedPhysicianValidateInd: number;
  NeedNurseReviewInd: number;
  CommInd: number;
  IngredientInd: number;
  LastUpdtCnt: number;
  MultipleOrdSentInd: number;
  OrderActionId: number;
  TemplateOrderFlag: number;
  TemplateOrderId: number;
  CsFlag: number;
  CsOrderId: number;
  OrderStatus: number;
  SuspendInd: number;
  ResumeInd: number;
  OrderableTypeFlag: number;
  RequiredInd: number;
  ConstantInd: number;
  PrnInd: number;
  FreqTypeFlag: number;
  HybridInd: number;
  NeedRxVerifyFlag: number;
  MedTypeCd: number;
  LastActionSeq: number;
  CommentTypeMask: number;
  StopTypeCd: number;
  ProviderId: number;
  ProviderName: string;
  CommunicationTypeCd: number;
  CurrentStartDtTm: string;
  ProjectedStopDtTm: string;
  TimeZone: number;
  OrigOrdAsFlag: number;
  OrdCommentTemplateId: number;
  DisableOrdCommentInd: number;
  SuspendEffectiveDtTm: string;
  ResumeEffectiveDtTm: string;
  AdditiveCnt: number;
  ClinSigDiluentCnt: number;
  LinkNbr: number;
  LinkTypeFlag: number;
  SuperviseProviderId: number;
  SuperviseProviderName: string;
  BillingProvider: string;
  RelatedOrderObjId: number;
  ActionDtTm: string;
  OeFormatId: number;
  FmtActionCd: number;
  SignedActionCd: number;
  ActionType: number;
  EncntrId: number;
  ProcessMask: number;
  CatalogCd: number;
  ParentId: number;
  ProjectedOrderId: number;
  ProposalAcceptance: string;
  ProposalId: number;
  SignDtTm: string;
  ActionDisplay: string;
  SignedOrderStatusCd: number;
  LastActionPrsnlId: number;
  LastActionPrsnlName: string;
  LastActionDtTm: string;
  DetailList: DetailList;
  ComplianceDetailList: string;
  CommentList: CommentList;
  AdHocFreqList: AdHocFreqList;
  DiagnosisList: DiagnosisList;
  CurrSchedExceptionList: string;
  PrevSchedExceptionList: string;
  OrigSchedExceptionList: string;
  ResponsibleProviderId: number;
  ResponsibleProviderName: string;
  SuspendedDtTm: string;
  RelatedFromOrderId: number;
  OrderRelationTypeCd: number;
  OrderRelationTypeMeaning: string;
  OrderRelationTypeDisplay: string;
  ProposalRejectReasonCd: number;
  ProposalRejectReasonDisplay: string;
  ProposalFreetextRejectReason: string;
};

//XML data return subtype
export type FieldValueList = {
  ListValues: {
    FieldValue: number;
    FieldDisplayValue: number;
    FieldDtTmValue: string;
  };
};

//XML data return subtype
export type Detail = {
  FieldValueList: FieldValueList;
  OeFieldId: number;
  OeFieldMeaning: string;
  OeFieldMeaningId: number;
  ValueRequiredInd: number;
  GroupSeq: number;
  FieldSeq: number;
  ModifiedInd: number;
  DetailAlterFlag: number;
};

//XML data return subtype
export type DetailList = {
  STRENGTHDOSE: Detail;
  STRENGTHDOSEUNIT: Detail;
  RXROUTE: Detail;
  DRUGFORM: Detail;
  FREQ: Detail;
  'SCH.PRN': Detail;
  OTHER: Detail[];
  DURATION: Detail;
  DURATIONUNIT: Detail;
  REQSTARTDTTM: Detail;
  STOPDTTM: Detail;
  STOPTYPE: Detail;
  FREQSCHEDID: Detail;
  ADHOCFREQINSTANCE: Detail;
  NEXTDOSEDTTM: Detail;
  PHARMORDERTYPE: Detail;
  DIFFINMIN: Detail;
  ICD9: Detail;
  INSTREPLACEREQUIREDDETS: Detail;
  REFERENCESTARTDTTM: Detail;
  DetailListCount: number;
};

//XML data return subtype
export type CommentList = {
  CommentValues: {
    CommentType: number;
    CommentText: string;
  };
};

//XML data return subtype
export type AdHocFreqList = {
  CurrSchedList: string;
  OrigSchedList: string;
  PrevSchedList: string;
};

//XML data return subtype
export type DiagnosisList = {
  Diagnosis: {
    DiagnosisId: number;
    NomenclatureId: number;
    SourceVocabularyCd: number;
    SourceIdentifier: string;
    DiagnosisDescription: string;
    DiagnosisRanking: number;
    SearchNomenclatureId: number;
  };
};

//Return type of the entire function
export type SubmitPowerPlanOrderReturn = {
  inPowerChart: boolean;
  status: SubmitOrdersStatus;
  response: OrdersReturnXML | null;
  ordersPlaced: Array<{ name: string; oid: number; display: string }> | null;
};
