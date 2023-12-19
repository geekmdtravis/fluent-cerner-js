import {
  PowerPlanOrder,
  StandaloneOrder,
  SubmitPowerOrdersReturn,
  submitPowerOrdersAsync,
} from './submitPowerOrdersAsync';

//Clear the window object before each test
beforeEach(() => {
  Object.defineProperty(window, 'external', {
    writable: true,
    value: { DiscernObjectFactory: undefined },
  });
});

describe('submitPowerOrders()', () => {
  it('returns appropriate object if run outside of PowerChart', async () => {
    const orderArray: Array<PowerPlanOrder | StandaloneOrder> = [
      {
        synonymId: 1,
        origination: 'prescription order',
        sentenceId: 1,
      },
    ];
    const result = await submitPowerOrdersAsync(1, 1, orderArray);
    const expectedObj: SubmitPowerOrdersReturn = {
      inPowerChart: false,
      status: 'dry run',
      ordersPlaced: null,
    };
    expect(result).toEqual(expectedObj);
  });

  it('throws an error if no orders are provided', async () => {
    const orderArray: Array<PowerPlanOrder | StandaloneOrder> = [];
    try {
      await submitPowerOrdersAsync(1, 1, orderArray);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e as Error).toHaveProperty(
        'message',
        'At least one order to submit must be provided to this function.'
      );
    }
  });

  it('adds both standalone orders and PowerPlan orders to the arrays', async () => {
    const orderArray: Array<PowerPlanOrder | StandaloneOrder> = [
      {
        synonymId: 1,
        origination: 'prescription order',
        sentenceId: 1,
      },
      {
        pathwayCatalogId: 5,
      },
    ];

    const result = await submitPowerOrdersAsync(1, 1, orderArray);
    const expectedObj: SubmitPowerOrdersReturn = {
      inPowerChart: false,
      status: 'dry run',
      ordersPlaced: null,
    };
    expect(result).toEqual(expectedObj);
  });

  it('throws an error an order in the order array is not of the correct type', async () => {
    const orderArray: any = [
      {
        test: 'yes',
      },
    ];
    try {
      await submitPowerOrdersAsync(1, 1, orderArray);
    } catch (e) {
      expect(e).toBeInstanceOf(SyntaxError);
      expect(e as SyntaxError).toHaveProperty(
        'message',
        'Each order provided must be of either a PowerPlanOrder or  StandaloneOrder type.'
      );
    }
  });

  it('returns the expected object if the createMOEW moewHandle is null', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          CreateMOEW: async () => Promise.resolve(0),
          AddPowerPlanWithDetails: async () => Promise.resolve(1),
          AddNewOrdersToScratchpad: async () => Promise.resolve(0),
          DisplayMOEW: async () => Promise.resolve(1),
          SignOrders: async () => Promise.resolve(1),
          GetXMLOrdersMOEW: async () =>
            Promise.resolve(`<?xml version="1.0"?>
          <?xml-stylesheet type='text/xml' href='dom.xsl'?>
          <Orders>
          <OrderVersion>1</OrderVersion>
          <Order id="123.00">
          <OrderableType type="int">8</OrderableType>
          <OrderId type="double">123.0000</OrderId>
          <SynonymId type="double">555.0000</SynonymId>
          <ClinCatCd type="double">666.0000</ClinCatCd>
          <CatalogTypeCd type="double">777.0000</CatalogTypeCd>
          <ActivityTypeCd type="double">888.0000</ActivityTypeCd>
          <OrderSentenceId type="double">999.0000</OrderSentenceId>
          <OrderedAsMnemonic type="string">tamsulosin</OrderedAsMnemonic>
          <ClinDisplayLine type="string">0.4 mg, Oral, Cap, Daily, Administration Type NA, Automatic Refill, Order Duration: 30 day, First Dose: 07/23/23 07:00 PDT, Stop Date: 08/22/23 06:59 PDT, 07/23/23 07:00 PDT</ClinDisplayLine>
          </Order>
          </Orders>`),
          DestroyMOEW: async () => Promise.resolve(null),
        })),
      },
    });

    const orderArray: Array<PowerPlanOrder | StandaloneOrder> = [
      {
        synonymId: 1,
        origination: 'prescription order',
        sentenceId: 1,
      },
    ];
    const result = await submitPowerOrdersAsync(1, 1, orderArray);

    const expectedObj: SubmitPowerOrdersReturn = {
      inPowerChart: true,
      status: 'invalid data returned',
      ordersPlaced: null,
    };

    expect(result).toEqual(expectedObj);
  });

  it('sets m_hMOEW correctly if a valid handle is returned', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          CreateMOEW: async () => Promise.resolve(1),
          AddPowerPlanWithDetails: async () => Promise.resolve(1),
          AddNewOrdersToScratchpad: async () => Promise.resolve(0),
          DisplayMOEW: async () => Promise.resolve(1),
          SignOrders: async () => Promise.resolve(1),
          GetXMLOrdersMOEW: async () =>
            Promise.resolve(`<?xml version="1.0"?>
          <?xml-stylesheet type='text/xml' href='dom.xsl'?>
          <Orders>
          <OrderVersion>1</OrderVersion>
          <Order id="123.00">
          <OrderableType type="int">8</OrderableType>
          <OrderId type="double">123.0000</OrderId>
          <SynonymId type="double">555.0000</SynonymId>
          <ClinCatCd type="double">666.0000</ClinCatCd>
          <CatalogTypeCd type="double">777.0000</CatalogTypeCd>
          <ActivityTypeCd type="double">888.0000</ActivityTypeCd>
          <OrderSentenceId type="double">999.0000</OrderSentenceId>
          <OrderedAsMnemonic type="string">tamsulosin</OrderedAsMnemonic>
          <ClinDisplayLine type="string">0.4 mg, Oral, Cap, Daily, Administration Type NA, Automatic Refill, Order Duration: 30 day, First Dose: 07/23/23 07:00 PDT, Stop Date: 08/22/23 06:59 PDT, 07/23/23 07:00 PDT</ClinDisplayLine>
          </Order>
          </Orders>`),
          DestroyMOEW: async () => Promise.resolve(null),
        })),
      },
    });

    const orderArray: Array<PowerPlanOrder | StandaloneOrder> = [
      {
        synonymId: 1,
        origination: 'prescription order',
        sentenceId: 1,
      },
    ];
    const result = await submitPowerOrdersAsync(1, 1, orderArray);

    const expectedObj: SubmitPowerOrdersReturn = {
      inPowerChart: true,
      status: 'success',
      ordersPlaced: [
        {
          name: 'tamsulosin',
          oid: 123,
          display:
            '0.4 mg, Oral, Cap, Daily, Administration Type NA, Automatic Refill, Order Duration: 30 day, First Dose: 07/23/23 07:00 PDT, Stop Date: 08/22/23 06:59 PDT, 07/23/23 07:00 PDT',
        },
      ],
    };

    expect(result).toEqual(expectedObj);
  });

  it('correctly places PowerPlan orders', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          CreateMOEW: async () => Promise.resolve(1),
          AddPowerPlanWithDetails: async () => Promise.resolve(1),
          AddNewOrdersToScratchpad: async () => Promise.resolve(0),
          DisplayMOEW: async () => Promise.resolve(1),
          SignOrders: async () => Promise.resolve(1),
          GetXMLOrdersMOEW: async () =>
            Promise.resolve(`<?xml version="1.0"?>
            <?xml-stylesheet type='text/xml' href='dom.xsl'?>
            <Orders>
                <OrderVersion>1</OrderVersion>
                <Order id="15452082851.00">
                    <OrderableType type="int">8</OrderableType>
                    <OrderId type="double">15452082851.0000</OrderId>
                    <SynonymId type="double">27061553.0000</SynonymId>
                    <ClinCatCd type="double">10576.0000</ClinCatCd>
                    <CatalogTypeCd type="double">2513.0000</CatalogTypeCd>
                    <ActivityTypeCd type="double">692.0000</ActivityTypeCd>
                    <OrderSentenceId type="double">33878649.0000</OrderSentenceId>
                    <RxMask type="long">0</RxMask>
                    <HnaOrderMnemonic type="string">CBC with Diff (CBC with differential)</HnaOrderMnemonic>
                    <OrderedAsMnemonic type="string">CBC with differential</OrderedAsMnemonic>
                    <OrderDtTm type="Calendar">2023091921113100 - 266</OrderDtTm>
                    <OrigOrderDtTm type="Calendar">0000000000000000 - 35</OrigOrderDtTm>
                    <OrderMnemonic type="string"></OrderMnemonic>
                    <OrderStatusCd type="double">0.0000</OrderStatusCd>
                    <OrderStatusDisp type="string"></OrderStatusDisp>
                    <ClinDisplayLine type="string">Blood, Routine collect, 09/26/23 05:00 PDT, Once, Stop date 09/26/23 05:00 PDT, Lab Collect</ClinDisplayLine>
                    <SimpleDisplayLine type="string"></SimpleDisplayLine>
                    <DeptStatusCd type="double">0.0000</DeptStatusCd>
                    <NeedDoctorCosignInd type="int">0</NeedDoctorCosignInd>
                    <NeedPhysicianValidateInd type="int">0</NeedPhysicianValidateInd>
                    <NeedNurseReviewInd type="short">0</NeedNurseReviewInd>
                    <CommInd type="short">0</CommInd>
                    <IngredientInd type="short">0</IngredientInd>
                    <LastUpdtCnt type="long">0</LastUpdtCnt>
                    <MultipleOrdSentInd type="short">0</MultipleOrdSentInd>
                    <OrderActionId type="double">0.0000</OrderActionId>
                    <TemplateOrderFlag type="int">0</TemplateOrderFlag>
                    <TemplateOrderId type="double">0.0000</TemplateOrderId>
                    <CsFlag type="short">32</CsFlag>
                    <CsOrderId type="double">0.0000</CsOrderId>
                    <OrderStatus type="int">-1</OrderStatus>
                    <SuspendInd type="short">0</SuspendInd>
                    <ResumeInd type="short">0</ResumeInd>
                    <OrderableTypeFlag type="short">0</OrderableTypeFlag>
                    <RequiredInd type="short">0</RequiredInd>
                    <ConstantInd type="short">0</ConstantInd>
                    <PrnInd type="short">0</PrnInd>
                    <FreqTypeFlag type="short">4</FreqTypeFlag>
                    <HybridInd type="short">0</HybridInd>
                    <NeedRxVerifyFlag type="short">-1</NeedRxVerifyFlag>
                    <MedTypeCd type="double">0.0000</MedTypeCd>
                    <LastActionSeq type="long">1</LastActionSeq>
                    <CommentTypeMask type="long">0</CommentTypeMask>
                    <StopTypeCd type="double">2337.0000</StopTypeCd>
                    <ProviderId type="double">3917685.0000</ProviderId>
                    <ProviderName type="string">Lara, Daniel P&amp;S</ProviderName>
                    <CommunicationTypeCd type="double">2562.0000</CommunicationTypeCd>
                    <CurrentStartDtTm type="Calendar">2023092605000000 - 35</CurrentStartDtTm>
                    <ProjectedStopDtTm type="Calendar">2023092605000000 - 35</ProjectedStopDtTm>
                    <TimeZone type="long">0</TimeZone>
                    <OrigOrdAsFlag type="int">0</OrigOrdAsFlag>
                    <OrdCommentTemplateId type="double">0.0000</OrdCommentTemplateId>
                    <DisableOrdCommentInd type="short">0</DisableOrdCommentInd>
                    <SuspendEffectiveDtTm type="Calendar">0000000000000000 - 35</SuspendEffectiveDtTm>
                    <ResumeEffectiveDtTm type="Calendar">2023091914113100 - 35</ResumeEffectiveDtTm>
                    <AdditiveCnt type="long">0</AdditiveCnt>
                    <ClinSigDiluentCnt type="long">0</ClinSigDiluentCnt>
                    <LinkNbr type="double">0.0000</LinkNbr>
                    <LinkTypeFlag type="int">0</LinkTypeFlag>
                    <SuperviseProviderId type="double">0.0000</SuperviseProviderId>
                    <SuperviseProviderName type="string"></SuperviseProviderName>
                    <BillingProvider type="string"></BillingProvider>
                    <RelatedOrderObjId type="double">0.0000</RelatedOrderObjId>
                    <ActionDtTm type="Calendar">2023091914110000 - 35</ActionDtTm>
                    <OeFormatId type="double">312486.0000</OeFormatId>
                    <FmtActionCd type="double">2534.0000</FmtActionCd>
                    <SignedActionCd type="double">2534.0000</SignedActionCd>
                    <ActionType type="int">0</ActionType>
                    <EncntrId type="double">9348743.0000</EncntrId>
                    <ProcessMask type="int">32</ProcessMask>
                    <CatalogCd type="double">22043363.0000</CatalogCd>
                    <ParentId type="double">0.0000</ParentId>
                    <ProjectedOrderId type="double">0.0000</ProjectedOrderId>
                    <ProposalAcceptance type="string">None</ProposalAcceptance>
                    <ProposalId type="double">0.0000</ProposalId>
                    <SignDtTm type="Calendar">2023091914113500 - 35</SignDtTm>
                    <ActionDisplay type="string">Order</ActionDisplay>
                    <SignedOrderStatusCd type="double">2550.0000</SignedOrderStatusCd>
                    <LastActionPrsnlId type="double">0.0000</LastActionPrsnlId>
                    <LastActionPrsnlName type="string"></LastActionPrsnlName>
                    <LastActionDtTm type="Calendar">0000000000000000 - 35</LastActionDtTm>
                    <DetailList>
                        <UNDEFINED>
                            <FieldValueList>
                                <ListValues>
                                    <FieldValue type="double">0.0000</FieldValue>
                                    <FieldDisplayValue type="string">09/26/23 05:00 PDT</FieldDisplayValue>
                                    <FieldDtTmValue type="Calendar">2023092605000000 - 35</FieldDtTmValue>
                                </ListValues>
                            </FieldValueList>
                            <OeFieldId type="double">-8.0000</OeFieldId>
                            <OeFieldMeaning type="string"></OeFieldMeaning>
                            <OeFieldMeaningId type="double">146.0000</OeFieldMeaningId>
                            <ValueRequiredInd type="int">-1</ValueRequiredInd>
                            <GroupSeq type="long">0</GroupSeq>
                            <FieldSeq type="long">0</FieldSeq>
                            <ModifiedInd type="short">1</ModifiedInd>
                            <DetailAlterFlag type="int">0</DetailAlterFlag>
                        </UNDEFINED>
                        <SPECIMEN-TYPE>
                            <FieldValueList>
                                <ListValues>
                                    <FieldValue type="double">1765.0000</FieldValue>
                                    <FieldDisplayValue type="string">Blood</FieldDisplayValue>
                                    <FieldDtTmValue type="Calendar">0000000000000000 - 35</FieldDtTmValue>
                                </ListValues>
                            </FieldValueList>
                            <OeFieldId type="double">12584.0000</OeFieldId>
                            <OeFieldMeaning type="string">SPECIMEN TYPE</OeFieldMeaning>
                            <OeFieldMeaningId type="double">9.0000</OeFieldMeaningId>
                            <ValueRequiredInd type="int">0</ValueRequiredInd>
                            <GroupSeq type="long">1</GroupSeq>
                            <FieldSeq type="long">0</FieldSeq>
                            <ModifiedInd type="short">1</ModifiedInd>
                            <DetailAlterFlag type="int">0</DetailAlterFlag>
                        </SPECIMEN-TYPE>
                        <COLLPRI>
                            <FieldValueList>
                                <ListValues>
                                    <FieldValue type="double">311045.0000</FieldValue>
                                    <FieldDisplayValue type="string">Routine</FieldDisplayValue>
                                    <FieldDtTmValue type="Calendar">0000000000000000 - 35</FieldDtTmValue>
                                </ListValues>
                            </FieldValueList>
                            <OeFieldId type="double">12613.0000</OeFieldId>
                            <OeFieldMeaning type="string">COLLPRI</OeFieldMeaning>
                            <OeFieldMeaningId type="double">43.0000</OeFieldMeaningId>
                            <ValueRequiredInd type="int">0</ValueRequiredInd>
                            <GroupSeq type="long">5</GroupSeq>
                            <FieldSeq type="long">0</FieldSeq>
                            <ModifiedInd type="short">1</ModifiedInd>
                            <DetailAlterFlag type="int">0</DetailAlterFlag>
                        </COLLPRI>
                        <REPPRI>
                            <FieldValueList>
                                <ListValues>
                                    <FieldValue type="double">1757.0000</FieldValue>
                                    <FieldDisplayValue type="string">RT - Routine</FieldDisplayValue>
                                    <FieldDtTmValue type="Calendar">0000000000000000 - 35</FieldDtTmValue>
                                </ListValues>
                            </FieldValueList>
                            <OeFieldId type="double">12583.0000</OeFieldId>
                            <OeFieldMeaning type="string">REPPRI</OeFieldMeaning>
                            <OeFieldMeaningId type="double">8.0000</OeFieldMeaningId>
                            <ValueRequiredInd type="int">0</ValueRequiredInd>
                            <GroupSeq type="long">10</GroupSeq>
                            <FieldSeq type="long">0</FieldSeq>
                            <ModifiedInd type="short">1</ModifiedInd>
                            <DetailAlterFlag type="int">0</DetailAlterFlag>
                        </REPPRI>
                        <COLLECTEDYN>
                            <FieldValueList>
                                <ListValues>
                                    <FieldValue type="double">0.0000</FieldValue>
                                    <FieldDisplayValue type="string">No</FieldDisplayValue>
                                    <FieldDtTmValue type="Calendar">0000000000000000 - 35</FieldDtTmValue>
                                </ListValues>
                            </FieldValueList>
                            <OeFieldId type="double">12766.0000</OeFieldId>
                            <OeFieldMeaning type="string">COLLECTEDYN</OeFieldMeaning>
                            <OeFieldMeaningId type="double">6006.0000</OeFieldMeaningId>
                            <ValueRequiredInd type="int">0</ValueRequiredInd>
                            <GroupSeq type="long">15</GroupSeq>
                            <FieldSeq type="long">0</FieldSeq>
                            <ModifiedInd type="short">1</ModifiedInd>
                            <DetailAlterFlag type="int">0</DetailAlterFlag>
                        </COLLECTEDYN>
                        <REQSTARTDTTM>
                            <FieldValueList>
                                <ListValues>
                                    <FieldValue type="double">0.0000</FieldValue>
                                    <FieldDisplayValue type="string">09/26/23 05:00 PDT</FieldDisplayValue>
                                    <FieldDtTmValue type="Calendar">2023092605000000 - 35</FieldDtTmValue>
                                </ListValues>
                            </FieldValueList>
                            <OeFieldId type="double">12620.0000</OeFieldId>
                            <OeFieldMeaning type="string">REQSTARTDTTM</OeFieldMeaning>
                            <OeFieldMeaningId type="double">51.0000</OeFieldMeaningId>
                            <ValueRequiredInd type="int">0</ValueRequiredInd>
                            <GroupSeq type="long">20</GroupSeq>
                            <FieldSeq type="long">0</FieldSeq>
                            <ModifiedInd type="short">1</ModifiedInd>
                            <DetailAlterFlag type="int">0</DetailAlterFlag>
                        </REQSTARTDTTM>
                        <FREQ>
                            <FieldValueList>
                                <ListValues>
                                    <FieldValue type="double">696531.0000</FieldValue>
                                    <FieldDisplayValue type="string">Once</FieldDisplayValue>
                                    <FieldDtTmValue type="Calendar">0000000000000000 - 35</FieldDtTmValue>
                                </ListValues>
                            </FieldValueList>
                            <OeFieldId type="double">12690.0000</OeFieldId>
                            <OeFieldMeaning type="string">FREQ</OeFieldMeaning>
                            <OeFieldMeaningId type="double">2011.0000</OeFieldMeaningId>
                            <ValueRequiredInd type="int">0</ValueRequiredInd>
                            <GroupSeq type="long">25</GroupSeq>
                            <FieldSeq type="long">0</FieldSeq>
                            <ModifiedInd type="short">1</ModifiedInd>
                            <DetailAlterFlag type="int">0</DetailAlterFlag>
                        </FREQ>
                        <FREQSCHEDID>
                            <FieldValueList>
                                <ListValues>
                                    <FieldValue type="double">24.0000</FieldValue>
                                    <FieldDisplayValue type="string">24</FieldDisplayValue>
                                    <FieldDtTmValue type="Calendar">0000000000000000 - 35</FieldDtTmValue>
                                </ListValues>
                            </FieldValueList>
                            <OeFieldId type="double">633592.0000</OeFieldId>
                            <OeFieldMeaning type="string">FREQSCHEDID</OeFieldMeaning>
                            <OeFieldMeaningId type="double">2094.0000</OeFieldMeaningId>
                            <ValueRequiredInd type="int">0</ValueRequiredInd>
                            <GroupSeq type="long">25</GroupSeq>
                            <FieldSeq type="long">1</FieldSeq>
                            <ModifiedInd type="short">1</ModifiedInd>
                            <DetailAlterFlag type="int">0</DetailAlterFlag>
                        </FREQSCHEDID>
                        <STOPDTTM>
                            <FieldValueList>
                                <ListValues>
                                    <FieldValue type="double">0.0000</FieldValue>
                                    <FieldDisplayValue type="string">09/26/23 05:00 PDT</FieldDisplayValue>
                                    <FieldDtTmValue type="Calendar">2023092605000000 - 35</FieldDtTmValue>
                                </ListValues>
                            </FieldValueList>
                            <OeFieldId type="double">12731.0000</OeFieldId>
                            <OeFieldMeaning type="string">STOPDTTM</OeFieldMeaning>
                            <OeFieldMeaningId type="double">2073.0000</OeFieldMeaningId>
                            <ValueRequiredInd type="int">0</ValueRequiredInd>
                            <GroupSeq type="long">30</GroupSeq>
                            <FieldSeq type="long">0</FieldSeq>
                            <ModifiedInd type="short">1</ModifiedInd>
                            <DetailAlterFlag type="int">0</DetailAlterFlag>
                        </STOPDTTM>
                        <NURSECOLLECT>
                            <FieldValueList>
                                <ListValues>
                                    <FieldValue type="double">0.0000</FieldValue>
                                    <FieldDisplayValue type="string">No</FieldDisplayValue>
                                    <FieldDtTmValue type="Calendar">0000000000000000 - 35</FieldDtTmValue>
                                </ListValues>
                            </FieldValueList>
                            <OeFieldId type="double">12667.0000</OeFieldId>
                            <OeFieldMeaning type="string">NURSECOLLECT</OeFieldMeaning>
                            <OeFieldMeaningId type="double">1108.0000</OeFieldMeaningId>
                            <ValueRequiredInd type="int">0</ValueRequiredInd>
                            <GroupSeq type="long">35</GroupSeq>
                            <FieldSeq type="long">0</FieldSeq>
                            <ModifiedInd type="short">1</ModifiedInd>
                            <DetailAlterFlag type="int">0</DetailAlterFlag>
                        </NURSECOLLECT>
                        <PRINTLBL>
                            <FieldValueList>
                                <ListValues>
                                    <FieldValue type="double">0.0000</FieldValue>
                                    <FieldDisplayValue type="string">No</FieldDisplayValue>
                                    <FieldDtTmValue type="Calendar">0000000000000000 - 35</FieldDtTmValue>
                                </ListValues>
                            </FieldValueList>
                            <OeFieldId type="double">12616.0000</OeFieldId>
                            <OeFieldMeaning type="string">PRINTLBL</OeFieldMeaning>
                            <OeFieldMeaningId type="double">47.0000</OeFieldMeaningId>
                            <ValueRequiredInd type="int">0</ValueRequiredInd>
                            <GroupSeq type="long">70</GroupSeq>
                            <FieldSeq type="long">0</FieldSeq>
                            <ModifiedInd type="short">1</ModifiedInd>
                            <DetailAlterFlag type="int">0</DetailAlterFlag>
                        </PRINTLBL>
                        <HOLDUNTILCOLLECTED>
                            <FieldValueList>
                                <ListValues>
                                    <FieldValue type="double">1.0000</FieldValue>
                                    <FieldDisplayValue type="string">Yes</FieldDisplayValue>
                                    <FieldDtTmValue type="Calendar">0000000000000000 - 35</FieldDtTmValue>
                                </ListValues>
                            </FieldValueList>
                            <OeFieldId type="double">12655.0000</OeFieldId>
                            <OeFieldMeaning type="string">HOLDUNTILCOLLECTED</OeFieldMeaning>
                            <OeFieldMeaningId type="double">125.0000</OeFieldMeaningId>
                            <ValueRequiredInd type="int">0</ValueRequiredInd>
                            <GroupSeq type="long">145</GroupSeq>
                            <FieldSeq type="long">0</FieldSeq>
                            <ModifiedInd type="short">1</ModifiedInd>
                            <DetailAlterFlag type="int">0</DetailAlterFlag>
                        </HOLDUNTILCOLLECTED>
                        <DetailListCount type="int">12</DetailListCount>
                    </DetailList>
                    <ComplianceDetailList/>
                    <AdHocFreqList>
                        <CurrSchedList/>
                        <OrigSchedList/>
                        <PrevSchedList/>
                    </AdHocFreqList>
                    <CurrSchedExceptionList/>
                    <PrevSchedExceptionList/>
                    <OrigSchedExceptionList/>
                    <ResponsibleProviderId type="double">0.0000</ResponsibleProviderId>
                    <ResponsibleProviderName type="string"></ResponsibleProviderName>
                    <SuspendedDtTm type="Calendar">0000000000000000 - 35</SuspendedDtTm>
                    <RelatedFromOrderId type="double">0.0000</RelatedFromOrderId>
                    <OrderRelationTypeCd type="double">0.0000</OrderRelationTypeCd>
                    <OrderRelationTypeMeaning type="string"></OrderRelationTypeMeaning>
                    <OrderRelationTypeDisplay type="string"></OrderRelationTypeDisplay>
                    <ProposalRejectReasonCd type="double">0.0000</ProposalRejectReasonCd>
                    <ProposalRejectReasonDisplay type="string"></ProposalRejectReasonDisplay>
                    <ProposalFreetextRejectReason type="string"></ProposalFreetextRejectReason>
                </Order>
            </Orders>
            `),
          DestroyMOEW: async () => Promise.resolve(null),
        })),
      },
    });

    const orderArray: Array<PowerPlanOrder | StandaloneOrder> = [
      {
        pathwayCatalogId: 1,
        personalizedPlanId: 2,
        diagnosisIds: [3, 4],
      },
    ];
    const result = await submitPowerOrdersAsync(1, 1, orderArray);

    const expectedObj: SubmitPowerOrdersReturn = {
      inPowerChart: true,
      status: 'success',
      ordersPlaced: [
        {
          name: 'CBC with differential',
          oid: 15452082851,
          display:
            'Blood, Routine collect, 09/26/23 05:00 PDT, Once, Stop date 09/26/23 05:00 PDT, Lab Collect',
        },
      ],
    };

    expect(result).toEqual(expectedObj);
  });

  it('returns the expected object if the PowerPlans could not be added', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          CreateMOEW: async () => Promise.resolve(1),
          AddPowerPlanWithDetails: async () => Promise.resolve(0),
          AddNewOrdersToScratchpad: async () => Promise.resolve(0),
          DisplayMOEW: async () => Promise.resolve(1),
          SignOrders: async () => Promise.resolve(1),
          GetXMLOrdersMOEW: async () => Promise.resolve(``),
          DestroyMOEW: async () => Promise.resolve(null),
        })),
      },
    });

    const orderArray: Array<PowerPlanOrder | StandaloneOrder> = [
      {
        pathwayCatalogId: 1,
      },
    ];
    const result = await submitPowerOrdersAsync(1, 1, orderArray);

    const expectedObj: SubmitPowerOrdersReturn = {
      inPowerChart: true,
      status: 'cancelled, failed, or invalid parameters provided',
      ordersPlaced: null,
    };

    expect(result).toEqual(expectedObj);
  });

  it('returns the expected object if the standalone orders could not be added', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          CreateMOEW: async () => Promise.resolve(2),
          AddPowerPlanWithDetails: async () => Promise.resolve(1),
          AddNewOrdersToScratchpad: async () => Promise.resolve(2),
          DisplayMOEW: async () => Promise.resolve(1),
          SignOrders: async () => Promise.resolve(1),
          GetXMLOrdersMOEW: async () => Promise.resolve(``),
          DestroyMOEW: async () => Promise.resolve(null),
        })),
      },
    });

    const orderArray: Array<PowerPlanOrder | StandaloneOrder> = [
      {
        synonymId: 1,
        origination: 'prescription order',
      },
    ];
    const result = await submitPowerOrdersAsync(1, 1, orderArray);

    const expectedObj: SubmitPowerOrdersReturn = {
      inPowerChart: true,
      status: 'cancelled, failed, or invalid parameters provided',
      ordersPlaced: null,
    };

    expect(result).toEqual(expectedObj);
  });

  it('returns the expected object if orders are not fully signed', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          CreateMOEW: async () => Promise.resolve(2),
          AddPowerPlanWithDetails: async () => Promise.resolve(1),
          AddNewOrdersToScratchpad: async () => Promise.resolve(0),
          DisplayMOEW: async () => Promise.resolve(0),
          SignOrders: async () => Promise.resolve(1),
          GetXMLOrdersMOEW: async () => Promise.resolve(``),
          DestroyMOEW: async () => Promise.resolve(null),
        })),
      },
    });

    const orderArray: Array<PowerPlanOrder | StandaloneOrder> = [
      {
        synonymId: 1,
        origination: 'prescription order',
      },
    ];
    const result = await submitPowerOrdersAsync(1, 1, orderArray);

    const expectedObj: SubmitPowerOrdersReturn = {
      inPowerChart: true,
      status: 'cancelled, failed, or invalid parameters provided',
      ordersPlaced: null,
    };

    expect(result).toEqual(expectedObj);
  });

  it('returns the expected object if orders are not fully signed, even with a silent sign attempt', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          CreateMOEW: async () => Promise.resolve(2),
          AddPowerPlanWithDetails: async () => Promise.resolve(1),
          AddNewOrdersToScratchpad: async () => Promise.resolve(0),
          DisplayMOEW: async () => Promise.resolve(0),
          SignOrders: async () => Promise.resolve(1),
          GetXMLOrdersMOEW: async () => Promise.resolve(``),
          DestroyMOEW: async () => Promise.resolve(null),
        })),
      },
    });

    const orderArray: Array<PowerPlanOrder | StandaloneOrder> = [
      {
        synonymId: 1,
        origination: 'prescription order',
      },
    ];
    const result = await submitPowerOrdersAsync(1, 1, orderArray, {
      signSilently: true,
      interactionChecking: true,
    });

    const expectedObj: SubmitPowerOrdersReturn = {
      inPowerChart: true,
      status: 'cancelled, failed, or invalid parameters provided',
      ordersPlaced: null,
    };

    expect(result).toEqual(expectedObj);
  });

  it('catches an unexpected error', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          CreateMOEW: async () => Promise.resolve(new Error('')),
        })),
      },
    });

    const orderArray: Array<PowerPlanOrder | StandaloneOrder> = [
      {
        synonymId: 1,
        origination: 'prescription order',
      },
    ];

    try {
      await submitPowerOrdersAsync(1, 1, orderArray, {
        signSilently: true,
        interactionChecking: true,
      });
    } catch (e) {
      expect((e as Error).message).toBe(
        'dcof.AddNewOrdersToScratchpad is not a function'
      );
    }
  });
});
