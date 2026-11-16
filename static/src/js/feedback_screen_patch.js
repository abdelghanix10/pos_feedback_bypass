/** @odoo-module */

import { patch } from "@web/core/utils/patch";
import { FeedbackScreen } from "@point_of_sale/app/screens/feedback_screen/feedback_screen";
import { PosStore } from "@point_of_sale/app/services/pos_store";
import { _t } from "@web/core/l10n/translation";

// Patch PosStore to prevent duplicate orderDone calls
patch(PosStore.prototype, {
  setup(...args) {
    super.setup(...args);
    this._completedOrderUuids = new Set();
  },

  orderDone(order) {
    if (!order || !order.uuid) {
      return super.orderDone(order);
    }

    if (this._completedOrderUuids?.has(order.uuid)) {
      return;
    }

    if (this._completedOrderUuids) {
      this._completedOrderUuids.add(order.uuid);
      setTimeout(() => this._completedOrderUuids.delete(order.uuid), 30000);
    }

    return super.orderDone(order);
  },
});

// Patch FeedbackScreen for Bypass, Button Hiding, and Financial Details (Total, Cash, Change)
patch(FeedbackScreen.prototype, {
  get fbConfig() {
    return this.pos?.config || {};
  },

  get hideAllButtonsAttr() {
    return this.fbConfig.iface_feedback_hide_buttons ? "1" : "0";
  },

  get hidePrintBtnAttr() {
    return this.fbConfig.iface_feedback_hide_print_btn ? "1" : "0";
  },

  get hideEditBtnAttr() {
    return this.fbConfig.iface_feedback_hide_edit_payment_btn ? "1" : "0";
  },

  get feedbackOrderDetails() {
    const order = this.currentOrder;
    const formatCurrency = (val) =>
      this.env.utils?.formatCurrency
        ? this.env.utils.formatCurrency(val || 0)
        : `${(val || 0).toFixed(2)}`;

    if (!order) {
      return {
        total: formatCurrency(0),
        cashPaid: formatCurrency(0),
        totalPaid: formatCurrency(0),
        change: formatCurrency(0),
        hasChange: false,
        paymentLines: [],
      };
    }

    const totalAmount =
      order.get_total_with_tax?.() ??
      order.getTotalWithTax?.() ??
      order.amount_total ??
      0;

    const changeAmount =
      order.get_change?.() ?? order.getChange?.() ?? order.amount_return ?? 0;

    // Extract payment lines
    const rawPayments =
      order.payment_ids ||
      order.paymentlines ||
      order.get_paymentlines?.() ||
      [];

    let paymentsArray = [];
    if (Array.isArray(rawPayments)) {
      paymentsArray = rawPayments;
    } else if (typeof rawPayments.getAll === "function") {
      paymentsArray = rawPayments.getAll();
    } else if (typeof rawPayments[Symbol.iterator] === "function") {
      paymentsArray = [...rawPayments];
    }

    let cashAmount = 0;
    let totalTendered = 0;
    const paymentLines = [];

    paymentsArray.forEach((payment, idx) => {
      const amount = payment.amount ?? payment.get_amount?.() ?? 0;
      // Only count positive tendered amounts (ignore negative change lines)
      if (amount > 0) {
        totalTendered += amount;
        const method =
          payment.payment_method_id || payment.payment_method || {};
        const methodName = method.name || payment.name || _t("Payment");
        const isCash =
          Boolean(method.is_cash_count) ||
          method.type === "cash" ||
          methodName.toLowerCase().includes("cash") ||
          methodName.toLowerCase().includes("espèce");

        if (isCash) {
          cashAmount += amount;
        }

        paymentLines.push({
          id: payment.id || `pm_${idx}`,
          name: methodName,
          isCash,
          amount,
          formattedAmount: formatCurrency(amount),
        });
      }
    });

    if (totalTendered === 0 && totalAmount > 0) {
      totalTendered = totalAmount + changeAmount;
    }
    if (cashAmount === 0 && totalTendered > 0 && paymentLines.length === 0) {
      cashAmount = totalTendered;
    }

    return {
      total: formatCurrency(totalAmount),
      cashPaid: formatCurrency(cashAmount || totalTendered),
      totalPaid: formatCurrency(totalTendered),
      change: formatCurrency(changeAmount),
      hasChange: changeAmount > 0,
      paymentLines,
    };
  },

  onClick() {
    // If bypass is disabled in POS settings, use standard Odoo behavior
    if (!this.fbConfig.iface_feedback_bypass_loading) {
      return super.onClick(...arguments);
    }

    if (this.state.loading && !this.fbConfig.iface_feedback_suppress_warning) {
      this.notification.add(
        _t("Background processes are still running, proceeding to next order."),
        { type: "info" },
      );
    }

    clearTimeout(this.timeout);
    this.pos.orderDone(this.currentOrder);
  },
});
