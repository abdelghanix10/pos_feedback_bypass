{
    'name': 'POS Feedback Screen Bypass & Details',
    'version': '20.0.2.0.0',
    'category': 'Sales/Point of Sale',
    'summary': 'Bypass POS feedback screen loading, hide buttons, and show Total, Cash & Change details',
    'description': """
POS Feedback Screen Bypass & Details (Odoo 20)
==============================================
Enhances the POS Feedback Screen with:
- Immediate click-to-proceed without waiting for background printing/syncing.
- Duplicate order creation protection in PosStore.
- Checkboxes in POS Settings to hide all or specific buttons on the Feedback Screen.
- Clear financial summary card displaying Order Total, Cash / Tendered amount, and Change due.
    """,
    'author': 'Custom',
    'depends': ['point_of_sale'],
    'data': [
        'views/pos_config_views.xml',
    ],
    'assets': {
        'point_of_sale._assets_pos': [
            'pos_feedback_bypass/static/src/scss/feedback_screen.scss',
            'pos_feedback_bypass/static/src/xml/feedback_screen.xml',
            'pos_feedback_bypass/static/src/js/feedback_screen_patch.js',
        ],
    },
    'installable': True,
    'application': False,
    'license': 'LGPL-3',
}