# Confirmation Module

A module which can open a simple dialog with a title, message and buttons.

Simple usage:
```
this.confirmationService.openDialog({
    title: 'Apply changes',
    message: 'Do you really want to do this?',
    buttons: [{
        label: 'Cancel',
        key: 'CANCEL'
    }, {
        label: 'Apply',
        style: 'primary',
        key: 'APPLY'
    }]
}).subscribe((result) => {
    if (result === 'APPLY') {
        // apply changes here
    }
});
```

Notes:
- if the user clicks on the close button or in the top-right corner,
  or presses Escape key, `openDialog()` will return with `'CLOSE'`
- The last button in the bottom-right corner gets the focus initially.
