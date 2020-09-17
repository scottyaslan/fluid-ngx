# Range Slider

Range slider implemented with two `mat-slider`s.

## Component

The `cfx-range-slider` component handles if the min and max value overlaps each other.

It is usable in **forms**:

    <cfx-range-slider formControlName="minMax"
                      [min]="rangeValues.min"
                      [max]="rangeValues.min">
    </cfx-range-slider>

and in **standalone** as well:

    <cfx-range-slider [(ngModel)]="minMax"
                      [disabled]="isSliderDisabled"
                      [min]="rangeValues.min"
                      [max]="rangeValues.min">
    </cfx-range-slider>

## Input parameters

- **displayLabel**: Displays label for minimum and maximum values
- **displayWith**: same as `mat-slider`'s
- **step**: same as `mat-slider`'s
- **tabIndex**: same as `mat-slider`'s
- **thumbLabel**: same as `mat-slider`'s
- **tickInterval**: same as `mat-slider`'s
- **value**: sets the value to the passed `{ min: number, max: number }`

#### Works only via binding

- **disabled**: controls the disabled state if it used outside of form
- **invert**: same as `mat-slider`'s
- **min**: minimum value; default: 0
- **max**: maximum value; default: 100
- **vertical**: same as `mat-slider`'s


## Output parameters

- **change**: emitted when any of the value is changed
- **input**: emitted when the slider thumb moves
