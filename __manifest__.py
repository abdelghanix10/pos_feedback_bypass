{
    'name': 'POS Feedback Screen Bypass',
    'version': '19.0.1.0.0',
    'category': 'Point of Sale',
    'summary': 'Allow bypassing the feedback screen without waiting for background processes',
    'description': """
POS Feedback Screen Bypass
==========================

This module patches the POS Feedback Screen to allow users to proceed 
without waiting for background processes (like printing) to complete.

Features:
- Click to proceed immediately without waiting for the loading indicator
- Prevents duplicate order creation when clicking early
- Background processes (printing, syncing) continue in the background

The original behavior blocks the user with a warning notification when clicking
while processes are still loading. This patch allows immediate navigation
to the next order while background tasks continue asynchronously.
    """,
    'author': 'Custom',
    'depends': ['point_of_sale'],
    'assets': {
        'point_of_sale._assets_pos': [
            'pos_feedback_bypass/static/src/js/feedback_screen_patch.js',
        ],
    },
    'installable': True,
    'application': False,
    'license': 'LGPL-3',
}
