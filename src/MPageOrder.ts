class MPageOrder {
  private _orderAction: string = '';
  getOrderAction = () => this._orderAction;

  private _orderId: number = 0;
  getOrderId = () => this._orderId;

  private _synonymId: number = 0;
  getSynonymId = () => this._synonymId;

  private _orderOrigination: number = 0;
  getOrderOrigination = () => this._orderOrigination;

  private _orderSentenceId: number = 0;
  getOrderSentenceId = () => this._orderSentenceId;

  private _nomenclatureId: number = 0;
  getNomenclatureId = () => this._nomenclatureId;

  private _signTimeInteraction: number = 0;
  getSignTimeInteraction = () => this._signTimeInteraction;

  /**
   * Creates a new MPageOrder with the order action 'ACTIVATE', which is the prototype for activating an existing future order.
   *
   * @since 0.1.0
   * @category MPage Events - Orders
   * @param {number} orderId The order id value for the order to activate.
   * @returns {this} Returns itself to continue chaining method calls.
   */
  willActivate(orderId: number) {
    this._orderAction = 'ACTIVATE';
    this._orderId = orderId;
    return this;
  }
  /**
   * Creates a new MPageOrder with the order action 'CANCEL DC', which is the prototype for canceling and discontinuing an existing future order.
   *
   * @since 0.1.0
   * @param {number} orderId The order id value for the order to activate.
   * @returns {this} Returns itself to continue chaining method calls.
   */
  willCancelDiscontinue(orderId: number) {
    this._orderAction = 'CANCEL DC';
    this._orderId = orderId;
    return this;
  }
  /**
   * Creates a new MPageOrder with the order action 'CANCEL REORD', which is the prototype for cancelling and reordering an existing future order.
   *
   * @since 0.1.0
   * @param {number} orderId The order id value for the order to activate.
   * @returns {this} Returns itself to continue chaining method calls.
   */
  willCancelReorder(orderId: number) {
    this._orderAction = 'CANCEL REORD';
    this._orderId = orderId;
    return this;
  }
  /**
   * Creates a new MPageOrder with the order action 'CLEAR', which is the prototype for clearing actions of an existing future order.
   *
   * @since 0.1.0
   * @param {number} orderId The order id value for the order to activate.
   * @returns {this} Returns itself to continue chaining method calls.
   */
  willClear(orderId: number) {
    this._orderAction = 'CLEAR';
    this._orderId = orderId;
    return this;
  }
  /**
   * Creates a new MPageOrder with the order action 'CONVERT_INPAT', which is the prototype for converting a prescription order into an inpatient order.
   *
   * @since 0.1.0
   * @param {number} orderId The order id value for the order to activate.
   * @returns {this} Returns itself to continue chaining method calls.
   */
  willConvertInpatient(orderId: number) {
    this._orderAction = 'CONVERT_INPAT';
    this._orderId = orderId;
    return this;
  }
  /**
   * Creates a new MPageOrder with the order action 'CONVERT_RX', which is the prototype for converting an inpatient order into a prescription.
   *
   * @since 0.1.0
   * @param {number} orderId The order id value for the order to activate.
   * @returns {this} Returns itself to continue chaining method calls.
   */
  willConvertToPrescriptionOrder(orderId: number) {
    this._orderAction = 'CONVERT_RX';
    this._orderId = orderId;
    return this;
  }
  /**
   * Creates a new MPageOrder with the order action 'MODIFY', which is the prototype for modifying an existing future order.
   *
   * @since 0.1.0
   * @param {number} orderId The order id value for the order to activate.
   * @returns {this} Returns itself to continue chaining method calls.
   */
  willModify(orderId: number) {
    this._orderAction = 'MODIFY';
    this._orderId = orderId;
    return this;
  }
  /**
   * Creates a new MPage Order with order action 'ORDER'.
   *
   * @since 0.1.0
   * @category MPage Events - Orders
   * @param {number} synonymId The Cerner synonym_id to be associated with the new order.
   * @param {boolean} isRxOrder Marks the order order as a prescription. Is mutually exclusive from isSatelliteOrder.
   * @param {boolean} isSatelliteOrder Moarks the order origination as satellite. Is mutually exclusive from isRxOrder.
   * @param {number} orderSentenceId The optional Cerner order_sentence_id to be associated with the new order.
   * @param {number} nomenclatureId The optional Cerner nomenclature_id to be associated with the new order.
   * @param {boolean} skipInteractionCheckUntilSign Determines cerner sign-time interaction checking. A value of true skips checking for interactions until orders are signed, false will not.
   * @returns {this} Returns itself to continue chaining method calls.
   * default to a normal order type.
   * @throws Error if `isRxOrder` and `isSatelliteOrder` are both set to true. These two are mutually exclusive and setting
   * both creates underfined behavior with respect the order origination field.
   * @example
   * m.willMakeNewOrder(34, true, 13, 42, true).toString() => "{'ORDER'|34|5|1342|1}"
   */

  willMakeNewOrder(
    synonymId: number,
    isRxOrder: boolean = false, // optional
    isSatelliteOrder: boolean = false, // optional
    orderSentenceId: number = 0, // optional
    nomenclatureId: number = 0, // optional
    skipInteractionCheckUntilSign: boolean = false // optional
  ) {
    if (isRxOrder && isSatelliteOrder)
      throw new Error('Only select either isRxOrder or isSatelliteOrder.');
    this._orderAction = 'ORDER';
    this._synonymId = synonymId;
    this._orderSentenceId = orderSentenceId;
    this._nomenclatureId = nomenclatureId;
    this._signTimeInteraction = skipInteractionCheckUntilSign ? 1 : 0;
    this._orderOrigination = isSatelliteOrder ? 5 : isRxOrder ? 1 : 0;

    return this;
  }

  /**
   * Creates a new MPageOrder with the order action 'RENEW', which is the prototype for reviewing an existing non-prescription order.
   *
   * @since 0.1.0
   * @param {number} orderId The order id value for the order to activate.
   * @returns {this} Returns itself to continue chaining method calls.
   */
  willRenewNonPrescription(orderId: number) {
    this._orderAction = 'RENEW';
    this._orderId = orderId;
    return this;
  }
  /**
   * Creates a new MPageOrder with the order action 'RENEW_RX', which is the prototype for renewing an existing prescription order.
   *
   * @since 0.1.0
   * @param {number} orderId The order id value for the order to activate.
   * @returns {this} Returns itself to continue chaining method calls.
   */
  willRenewPrescription(orderId: number) {
    this._orderAction = 'RENEW_RX';
    this._orderId = orderId;
    return this;
  }
  /**
   * Creates a new MPageOrder with the order action 'REPEAT', which is the prototype for copying an order.
   *
   * @since 0.1.0
   * @param {number} orderId The order id value for the order to activate.
   * @returns {this} Returns itself to continue chaining method calls.
   */
  willCopyExistingOrder(orderId: number) {
    this._orderAction = 'REPEAT';
    this._orderId = orderId;
    return this;
  }
  /**
   * Creates a new MPageOrder with the order action 'RESUME', which is the prototype for resuming a suspended order.
   *
   * @since 0.1.0
   * @param {number} orderId The order id value for the order to activate.
   * @returns {this} Returns itself to continue chaining method calls.
   */
  willResumeSuspendedOrder(orderId: number) {
    this._orderAction = 'RESUME';
    this._orderId = orderId;
    return this;
  }
  /**
   * Creates a new MPageOrder with the order action 'SUSPEND', which is the prototype for suspending an existing order.
   *
   * @since 0.1.0
   * @param {number} orderId The order id value for the order to activate.
   * @returns {this} Returns itself to continue chaining method calls.
   */
  willSuspend(orderId: number) {
    this._orderAction = 'SUSPEND';
    this._orderId = orderId;
    return this;
  }

  /**
   * Overrides the toString() method for representing the objects internal state as a string.
   *
   * @since 0.1.0
   * @returns {string} string representation of MPageOrder's internal state
   */
  toString(): string {
    return this._orderAction === 'ORDER'
      ? `{${this._orderAction}|${this._synonymId}|${this._orderOrigination}|${this._orderSentenceId}|${this._nomenclatureId}|${this._signTimeInteraction}}`
      : `{${this._orderAction}|${this._orderId}}`;
  }
}

export { MPageOrder };
