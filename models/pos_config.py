from odoo import fields, models


class PosConfig(models.Model):
    _inherit = 'pos.config'

    # Bypass settings
    iface_feedback_bypass_loading = fields.Boolean(
        string="Bypass Feedback Screen Loading",
        default=True,
        help="Allow cashiers to click and proceed immediately without waiting for printing/syncing.",
    )
    iface_feedback_suppress_warning = fields.Boolean(
        string="Hide Background Running Notification",
        default=False,
        help="Do not show the info notification when bypassing the feedback screen while loading.",
    )

    # Hide Buttons settings
    iface_feedback_hide_buttons = fields.Boolean(
        string="Hide All Buttons on Feedback Screen",
        default=False,
        help="Hide all action buttons (Print, Edit Payment, Send, etc.) on the Feedback Screen.",
    )
    iface_feedback_hide_print_btn = fields.Boolean(
        string="Hide Print Receipt Button",
        default=False,
        help="Hide the Print Receipt button on the Feedback Screen.",
    )
    iface_feedback_hide_edit_payment_btn = fields.Boolean(
        string="Hide Edit Payment Button",
        default=False,
        help="Hide the Edit Payment button on the Feedback Screen.",
    )

    # Financial Details settings (Total, Cash, Change)
    iface_feedback_show_details = fields.Boolean(
        string="Show Order Details on Feedback Screen",
        default=True,
        help="Display a summary card with Total, Cash Paid, and Change on the Feedback Screen.",
    )
    iface_feedback_show_total = fields.Boolean(
        string="Show Total Amount",
        default=True,
    )
    iface_feedback_show_cash = fields.Boolean(
        string="Show Cash / Paid Amount",
        default=True,
    )
    iface_feedback_show_change = fields.Boolean(
        string="Show Change Amount",
        default=True,
    )