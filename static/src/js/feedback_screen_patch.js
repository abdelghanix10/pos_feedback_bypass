/** @odoo-module */

import { usePlugin } from "@odoo/owl";
import { FeedbackScreen } from "@point_of_sale/app/screens/feedback_screen/feedback_screen";
import { PosStore } from "@point_of_sale/app/services/pos_store";
import { formatCurrency } from "@web/core/currency";
import { _t } from "@web/core/l10n/translation";
import { NotificationPlugin } from "@web/core/notifications/notification_plugin";
import { patch } from "@web/core/utils/patch";

patch(PosStore.prototype, {
    orderDone(order) {
        if (!order || !order.uuid) {
            return super.orderDone(order);
        }

        if (!this._completedOrderUuids) {
            this._completedOrderUuids = new Set();
        }

        if (this._completedOrderUuids.has(order.uuid)) {
            return;
        }

        this._completedOrderUuids.add(order.uuid);
        setTimeout(() => this._completedOrderUuids.delete(order.uuid), 30000);

        return super.orderDone(order);
    },
});

patch(FeedbackScreen.prototype, {
    setup() {
        super.setup(...arguments);
        this.notification = usePlugin(NotificationPlugin);
    },

    get fbConfig() {
        return this.pos?.config || {};
    },

    get canPrintReceipt() {
        if (
            this.fbConfig.iface_feedback_hide_buttons ||
            this.fbConfig.iface_feedback_hide_print_btn
        ) {
            return false;
        }
        return super.canPrintReceipt;
    },

    get hideAllButtonsAttr() {
        return this.fbConfig.iface_feedback_hide_buttons ? "1" : "0";
    },

    get hidePrintBtnAttr() {
        return this.fbConfig.iface_feedback_hide_print_btn ? "1" : "0";
    },

    get hideSendBtnAttr() {
        return this.fbConfig.iface_feedback_hide_send_btn ? "1" : "0";
    },

    get hideEditBtnAttr() {
        return this.fbConfig.iface_feedback_hide_edit_payment_btn ? "1" : "0";
    },

    get hasDetailsCardAttr() {
        return this.fbConfig.iface_feedback_show_details ? "1" : "0";
    },

    get feedbackOrderDetails() {
        const order = this.currentOrder;
        const currencyId =
            this.pos?.currency?.id || this.pos?.config?.currency_id?.id;
        const fmt = (val) => {
            try {
                return currencyId
                    ? formatCurrency(val || 0, currencyId)
                    : `${Number(val || 0).toFixed(2)}`;
            } catch {
                return `${Number(val || 0).toFixed(2)}`;
            }
        };

        if (!order) {
            return {
                total: fmt(0),
                cashPaid: fmt(0),
                totalPaid: fmt(0),
                change: fmt(0),
                hasChange: false,
                paymentLines: [],
            };
        }

        const totalAmount =
            order.amount_total ??
            order.getTotalWithTax?.() ??
            order.get_total_with_tax?.() ??
            0;
        const changeAmount =
            order.amount_return ??
            order.getChange?.() ??
            order.get_change?.() ??
            0;
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
                    formattedAmount: fmt(amount),
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
            total: fmt(totalAmount),
            cashPaid: fmt(cashAmount || totalTendered),
            totalPaid: fmt(totalTendered),
            change: fmt(changeAmount),
            hasChange: changeAmount > 0,
            paymentLines,
        };
    },

    onClick(buttonClicked = false) {
        if (!this.fbConfig.iface_feedback_bypass_loading) {
            return super.onClick(buttonClicked);
        }

        const isLoading =
            typeof this.loading === "function" ? this.loading() : Boolean(this.loading);
        if (isLoading && !this.fbConfig.iface_feedback_suppress_warning) {
            this.notification?.add(
                _t("Background processes are still running, proceeding to next order."),
                { type: "info" },
            );
        }

        const currentTimeout =
            typeof this.timeout === "function" ? this.timeout() : this.timeout;
        if (currentTimeout) {
            clearTimeout(currentTimeout);
            if (typeof this.timeout?.set === "function") {
                this.timeout.set(null);
            }
        }

        this.goNext();
    },
});
