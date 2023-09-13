import { XMLParser } from 'fast-xml-parser';
import { PowerChartReturn } from '.';
import { outsideOfPowerChartError } from '../utils';

/**
 * Retrieves the XML representation of the order information signed during the previous MOEW invocation.
 * @param {number} moewHandle - the handle to the MOEW.
 * @returns a `Promise` which resolves to a PowerChartReturn and an array of orders placed, parsed XML, unparsed/raw XML, and an order attempt status string.
 * @throws `Error` if an unexpected error occurs.
 */

export async function getXMLOrdersMOEWAsync(
  moewHandle: number
): Promise<GetXMLReturn> {
  let retData: GetXMLReturn = {
    inPowerChart: true,
    ordersPlaced: [],
    parsedXML: null,
    rawXML: '',
    status: 'success',
  };

  // Create the DiscernObjectFactory and use that to call GetXMLOrdersMOEW() with the handle from above
  try {
    const dcof = await window.external.DiscernObjectFactory('POWERORDERS');

    // Set the return object XML equal to the return XML from PowerChart
    retData.rawXML = await dcof.GetXMLOrdersMOEW(moewHandle);

    //Check to see if the response type was not a string (should always either be "" or an XML string)
    if (typeof retData.rawXML !== 'string') {
      retData.status = 'invalid data returned';
      return retData;
    }

    //Check to see if no orders were placed or if invalid parameters were provided
    if (retData.rawXML.trim() === '') {
      retData.status = 'cancelled, failed, or invalid parameters provided';
      return retData;
    }

    //Assuming we have a valid (non-empty) string at this point, attempt to parse out its XML and populate `retData.ordersPlaced`
    const parser = new XMLParser();
    try {
      const parsed: OrdersReturnXML = parser.parse(retData.rawXML);
      retData.parsedXML = parsed;
      if (!(parsed.Orders.Order instanceof Array)) {
        parsed.Orders.Order = [parsed.Orders.Order];
      }
      retData.ordersPlaced = parsed.Orders.Order.map(o => ({
        name: o.OrderedAsMnemonic,
        oid: o.OrderId,
        display: o.ClinDisplayLine,
      }));
    } catch {
      //A parsing error indicates the string isn't formatted as epxected
      retData.status = 'xml parse error';
    }
  } catch (e) {
    //If outside of PowerChart, set the output to reflect that
    if (outsideOfPowerChartError(e)) {
      retData.inPowerChart = false;
      retData.parsedXML = null;
      retData.ordersPlaced = [];
      retData.rawXML = '';
      retData.status = 'dry run';
    } else {
      // If some other error was encountered, throw that error
      throw e;
    }
  }

  // Return the retData object when complete
  return retData;
}

export type SubmitPowerOrdersStatus =
  | 'success'
  | 'cancelled, failed, or invalid parameters provided'
  | 'invalid data returned'
  | 'xml parse error'
  | 'dry run';

export type GetXMLReturn = PowerChartReturn & {
  ordersPlaced: Array<{ name: string; oid: number; display: string }> | null;
  parsedXML: OrdersReturnXML | null;
  rawXML: string;
  status: SubmitPowerOrdersStatus;
};

// Return type to contain the orders placed and associated XML data
export type OrdersReturnXML = {
  Orders: {
    OrderVersion: number;
    Order: Array<PowerOrderReturnOrderXML>;
  };
};

// Return type of XML data
export type PowerOrderReturnOrderXML = {
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
