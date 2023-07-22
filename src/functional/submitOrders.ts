import { XMLParser } from 'fast-xml-parser';
import { MPageEventReturn } from '.';
import {
  outsideOfPowerChartError,
  warnAttemptedOrdersOutsideOfPowerChart,
} from '../utils';

const launchViewMap = new Map()
  .set('search', 8)
  .set('profile', 16)
  .set('signature', 32);

const tabsMap = new Map<string, { tab: number; display: number }>()
  .set('orders', { tab: 2, display: 0 })
  .set('power orders', { tab: 2, display: 127 })
  .set('medications', { tab: 3, display: 0 })
  .set('power medications', { tab: 3, display: 127 });

/**
 * @action `targetTab` - (optional) Sets the tab to be displayed, with and without power orders.
 * If not provided, will default to `orders`, that is the orders tab with _PowerOrders_ disabled.
 * Any tab with the term _power_ in it will enable both _PowerOrders_ and _PowerPlans_ in _PowerChart_.
 * @action `launchView` - (optional) Sets the view to be displayed.If not provided,
 * will default to `search` view.
 * @action `signSilently` - (optional) Signs the orders silently. Orders are not signed silently by default.
 * @action `dryRun` - (optional) If set to true, will not submit the order.
 * @documentation [MPAGES_EVENT - ORDER](https://wiki.cerner.com/display/public/MPDEVWIKI/MPAGES_EVENT+-+ORDERS)
 * @warning Our internal testing suggests there is a _PowerChart_ bug relating to the use of power
 * orders. When making MPAGES_EVENT calls (which we do in this library through `submitOrders`)
 * in series with power orders enabled, the result was that some MPAGES_EVENT calls failed to be invoked.
 * Please keep this in mind when enabling this option. For our own use, we have disabled power orders when
 * using `submitOrders` in such a way that calls are made in series.
 */
export type SubmitOrderOpts = {
  targetTab?: 'orders' | 'power orders' | 'medications' | 'power medications';
  launchView?: 'search' | 'profile' | 'signature';
  signSilently?: boolean;
  dryRun?: boolean;
};

export type SubmitOrdersStatus =
  | 'success'
  | 'cancelled'
  | 'failed'
  | 'invalid data returned'
  | 'xml parse error'
  | 'dry run';

export type SubmitOrderReturn = MPageEventReturn & {
  status: SubmitOrdersStatus;
  response: MpagesEventOrdersReturnXML | null;
  orderIds: Array<{ name: string; oid: number; display: string }> | null;
};

/**
 * Submit orders for a patient in a given encounter through the _Cerner PowerChart_ `MPAGES_EVENT` function.
 * By default, _PowerPlans_ are disabled (potential bug in _PowerChart_), _PowerOrders_ are disabled,
 * the target tab is set to orders, and will launch to the signature view.
 * @param {number} personId - The identifier for the patient to whom the note belongs.
 * Cerner context variable: PAT_PersonId.
 * @param {number} encounterId - The identifier for the encounter belonging to the patient where
 * this note will be launched. Cerner context variable: VIS_EncntrId.
 * @param orders - The orders to be submitted. Orders are given in the form of a a series of pipe-delimited
 * parameters as specified in the `MPAGES_EVENT` documentation (below). Use the `fluent-cerner-js` library's
 * `orderString` function to simplify building these pipe-delimited order strings.
 * @param opts - (optional) User defined options for the order submission event. The options allow for
 * changing the target tab, the view to be launched, and whether or not the orders should be signed silently.
 * @returns an object with the order `eventString` and a boolean flag set to notify the user if
 * the attempt was made outside of PowerChart, `inPowerChart`.
 *
 * @documentation [MPAGES_EVENT - ORDER](https://wiki.cerner.com/display/public/MPDEVWIKI/MPAGES_EVENT+-+ORDERS)
 */
export const submitOrdersAsync = async (
  personId: number,
  encounterId: number,
  orders: Array<string>,
  opts?: SubmitOrderOpts
): Promise<SubmitOrderReturn> => {
  let { targetTab, launchView, signSilently, dryRun } = opts || {};
  if (!targetTab) targetTab = 'orders';
  if (!launchView) launchView = 'signature';
  const enablePowerPlans =
    targetTab === 'power orders' || targetTab === 'power medications';

  let params: Array<string> = [
    `${personId}`,
    `${encounterId}`,
    orders.join(''),
  ];

  params.push(enablePowerPlans ? '24' : '0');

  const { tab, display } = tabsMap.get(targetTab) || { tab: 2, display: 127 };
  params.push(`{${tab}|${display}}`);

  params.push(`${launchViewMap.get(launchView) || 32}`);

  params.push(`${signSilently ? '1' : '0'}`);

  const eventString = params.join('|');

  const retVal: SubmitOrderReturn = {
    eventString,
    inPowerChart: true,
    status: 'success',
    response: null,
    orderIds: null,
  };

  if (dryRun) {
    retVal.status = 'dry run';
    return retVal;
  }

  try {
    const response = await window.MPAGES_EVENT('ORDERS', eventString);

    if (!response) {
      retVal.status = 'failed';
      return retVal;
    }

    if (typeof response !== 'string') {
      retVal.status = 'invalid data returned';
      return retVal;
    }

    switch (response.trim()) {
      case '':
        retVal.status = 'cancelled';
        break;
      default:
        retVal.status = 'success';
        const parser = new XMLParser();
        try {
          const parsed: MpagesEventOrdersReturnXML = parser.parse(response);
          retVal.response = parsed;
          if (!(parsed.Orders.Order instanceof Array)) {
            parsed.Orders.Order = [parsed.Orders.Order];
          }
          retVal.orderIds = parsed.Orders.Order.map(o => ({
            name: o.OrderedAsMnemonic,
            oid: o.OrderId,
            display: o.ClinDisplayLine,
          }));
        } catch {
          retVal.status = 'xml parse error';
        }

        break;
    }
  } catch (e) {
    if (outsideOfPowerChartError(e)) {
      retVal.inPowerChart = false;
      warnAttemptedOrdersOutsideOfPowerChart(eventString);
    } else {
      throw e;
    }
  }
  return retVal;
};

/**
 * When an MPAGES_EVENT:ORDER call is made asynchronously, it returns a
 * `Promise` of an XML string. This type is the parsed XML string. Several bits
 * of useful information can be extracted from here, including the order ID
 * and additional details of the newly placed order.
 */
export type MpagesEventOrdersReturnXML = {
  Orders: {
    OrderVersion: number;
    Order: Array<MpagesEventReturnOrderXML>;
  };
};

export type FieldValueList = {
  ListValues: {
    FieldValue: number;
    FieldDisplayValue: number;
    FieldDtTmValue: string;
  };
};

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

export type CommentList = {
  CommentValues: {
    CommentType: number;
    CommentText: string;
  };
};

export type AdHocFreqList = {
  CurrSchedList: string;
  OrigSchedList: string;
  PrevSchedList: string;
};

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

export type MpagesEventReturnOrderXML = {
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
