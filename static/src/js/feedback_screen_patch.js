/** @odoo-module */

import { patch } from "@web/core/utils/patch";
import { FeedbackScreen } from "@point_of_sale/app/screens/feedback_screen/feedback_screen";
import { PosStore } from "@point_of_sale/app/services/pos_store";
import { _t } from "@web/core/l10n/translation";

/**
 * Patch FeedbackScreen and PosStore to allow users to proceed without waiting 
 * for background processes (like printing) to complete.
 * 
 * The original behavior blocks the user with a notification when clicking
 * while `state.loading` is true. This patch allows immediate navigation
 * to the next order while background tasks continue asynchronously.
 * 
 * Key fix: Prevents duplicate orderDone calls that were causing automatic
 * order creation issues by tracking completed orders in PosStore.
 */

// Patch PosStore to prevent duplicate orderDone calls
patch(PosStore.prototype, {
    setup(...args) {
        super.setup(...args);
        // Set to track orders that have already been marked as done
        this._completedOrderUuids = new Set();
    },

    orderDone(order) {
        // Guard against duplicate calls for the same order
        if (!order || !order.uuid) {
            return super.orderDone(order);
        }

        // If this order was already marked as done, skip
        if (this._completedOrderUuids && this._completedOrderUuids.has(order.uuid)) {
            return;
        }

        // Mark this order as completed
        if (this._completedOrderUuids) {
            this._completedOrderUuids.add(order.uuid);
            // Clean up after a delay to prevent memory leak
            setTimeout(() => this._completedOrderUuids.delete(order.uuid), 30000);
        }

        // Call original orderDone
        return super.orderDone(order);
    },
});

// Patch FeedbackScreen to allow clicking even when loading
patch(FeedbackScreen.prototype, {
    onClick() {
        if (this.state.loading) {
            // Show a subtle notification that processes are still running
            // but allow the user to continue anyway
            this.notification.add(
                _t("Background processes are still running but you can continue."),
                {
                    type: "info",
                }
            );
        }

        // Clear any pending timeout to be safe
        clearTimeout(this.timeout);

        // Proceed to next order - duplicate protection is in PosStore.orderDone
        this.pos.orderDone(this.currentOrder);
    },
});
