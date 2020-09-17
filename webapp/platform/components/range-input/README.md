# Range Slider

Two number inputs for ranges.

## Component

The `cfx-range-input` component handles if the min and max value overlaps each other.

It is usable in **forms**:

    <cfx-range-input formControlName="minMax"
                     [min]="rangeValues.min"
                     [max]="rangeValues.min"
                     label="nodes">
    </cfx-range-input>

and in **standalone** as well:

    <cfx-range-input [(ngModel)]="minMax"
                     [disabled]="isInputDisabled"
                     [min]="rangeValues.min"
                     [max]="rangeValues.min"
                     label="nodes">
    </cfx-range-input>

## Input parameters

-   **disabled**: controls the disabled state if it used outside of form
-   **max**: maximum value; default: 100
-   **min**: minimum value; default: 0
-   **labelText**: text to display in the label above the input
-   **tabIndex**: same as `mat-slider`'s
-   **value**: sets the value to the passed `{ min: number, max: number }`

## Output parameters

-   **change**: emitted when any of the value is changed
