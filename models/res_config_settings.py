from odoo import fields, models


class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    pos_iface_feedback_bypass_loading = fields.Boolean(
        related='pos_config_id.iface_feedback_bypass_loading',
        readonly=False,
    )
    pos_iface_feedback_suppress_warning = fields.Boolean(
        related='pos_config_id.iface_feedback_suppress_warning',
        readonly=False,
    )
    pos_iface_feedback_hide_buttons = fields.Boolean(
        related='pos_config_id.iface_feedback_hide_buttons',
        readonly=False,
    )
    pos_iface_feedback_hide_print_btn = fields.Boolean(
        related='pos_config_id.iface_feedback_hide_print_btn',
        readonly=False,
    )
    pos_iface_feedback_hide_send_btn = fields.Boolean(
        related='pos_config_id.iface_feedback_hide_send_btn',
        readonly=False,
    )
    pos_iface_feedback_hide_edit_payment_btn = fields.Boolean(
        related='pos_config_id.iface_feedback_hide_edit_payment_btn',
        readonly=False,
    )
    pos_iface_feedback_show_details = fields.Boolean(
        related='pos_config_id.iface_feedback_show_details',
        readonly=False,
    )
    pos_iface_feedback_show_total = fields.Boolean(
        related='pos_config_id.iface_feedback_show_total',
        readonly=False,
    )
    pos_iface_feedback_show_cash = fields.Boolean(
        related='pos_config_id.iface_feedback_show_cash',
        readonly=False,
    )
    pos_iface_feedback_show_change = fields.Boolean(
        related='pos_config_id.iface_feedback_show_change',
        readonly=False,
    )