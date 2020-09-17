# Dialog module

Utilities to use Material dialogs consistently.

## DialogService

A utility to open Material dialogs with common defaults.
Applies some common config, otherwise identical to `MatDialog.open()`

Example usage:

    this.dialogService.open<DemoDialogComponent, DemoDialogData, DemoDialogResult>(DemoDialogComponent, {
        width: '560px',
        height: '560px',
        data: demoDialogData
    })
    .afterClosed().subscribe((demoDialogResult) => ...

## cfx-dialog-layout

A common dialog layout with:
- title with icon
- close button at the to-right corner
- scrollable body
- right-aligned footer container for primary buttons
- left-aligned footer container for secondary actions

See `dialog-layout/dialog-layout.component.ts` for configuration details.

Example for a template of a dialog component:

    <cfx-dialog-layout [title]="'Demo Dialog'"
                       icon = "error"
                       iconClass = "cfx-error"
                       (close)="close()">
        <div body>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sollicitudin tellus sit
            amet tellus hendrerit, ut varius eros ultricies.
        </div>

        <div footer-left>
            <button type="button" class="cfx-btn btn-borderless">Learn more...</button>
        </div>

        <div footer-right>
            <button type="button" class="cfx-btn" (click)="close()">Cancel</button>
            <button type="button" class="cfx-btn btn-primary" (click)="submit()">Submit</button>
        </div>
    </cfx-dialog-layout>
