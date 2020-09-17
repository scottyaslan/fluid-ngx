# Tooltip

A large rich HTML tooltip.

CUIX definition: https://app.zeplin.io/project/5b33e4162a5888d273b9ae00/screen/5db986f4d96acd836f5ec9aa

(Use mat-tooltip for simple small text-only cases.)

## Component

The component `<cfx-tooltip-help-button />`
renders an info icon, and shows a standardized tooltip on mouse hover:

    <h4 class="push-top-md cfx-muted">Learn more:
        <cfx-tooltip-help-button title="More info"
                                 text="More info."
                                 link='http://cloudera.com'></cfx-tooltip-help-button>
    </h4>

## Directive

For special use, you can use the directive `[cfxTooltip]`.
It can show a large tooltip over any element.
Tooltip content can be defined by a simple string or a template:

    <a href="#" cfxTooltip="More info."> Learn more... </a>

    <a href="#" [cfxTooltip]="tooltipTemplate"> Learn more... </a>
    <ng-template #tooltipTemplate> More info. </ng-template>

## Service

If even more control is needed, you can use `TooltipService` directly
to `show()` and `hide()` large tooltips.