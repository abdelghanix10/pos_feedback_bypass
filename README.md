# POS Feedback Screen Bypass & Details (Odoo 20)

This Odoo 20 module enhances the Point of Sale **Feedback Screen** by allowing cashiers to proceed immediately without waiting for background tasks, hiding unwanted action buttons, and displaying a clear summary of **Total**, **Cash / Paid**, and **Change**.

## Features

1. **Instant Feedback Screen Bypass**:
   - Tap anywhere on the Feedback Screen to immediately move to the next order while printing/syncing continues in the background.
   - Prevents duplicate order creation in `PosStore.orderDone`.
   - Option to silence the *"Background processes are still running"* notification.
2. **Hide Feedback Screen Buttons**:
   - **Hide All Buttons**: Removes all buttons from the Feedback Screen for a clean touchscreen experience.
   - **Hide Print Receipt Button**: Selectively hides the Print button.
   - **Hide Send Receipt Button**: Selectively hides the Send Receipt button.
   - **Hide Edit Payment / Back Button**: Selectively hides the Edit Payment / Back button.
3. **Order Financial Summary (Total, Cash, Change)**:
   - Displays a high-contrast card showing **Total**, **Cash / Payment Methods Tendered**, and **Change Due**.
   - Each line (**Total**, **Cash**, **Change**) can be toggled individually in POS Settings.

## Configuration

Go to **Point of Sale → Configuration → Settings** (or edit an individual POS under **Point of Sale → Configuration → Point of Sale**) to configure:
- **Feedback Screen Bypass & Buttons**
- **Feedback Screen Order Details**

## License

LGPL-3