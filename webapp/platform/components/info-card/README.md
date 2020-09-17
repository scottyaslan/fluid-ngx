# Info card

A simple small building block which displays a label and a contend,
typically a parameter name and a value, like

    STATUS
    Good Health

It can also show an icon as an option.

## Examples


    <cfx-info-card label="Info card label"
                   value="Single line string value'>
    </cfx-info-card>

    <cfx-info-card label="Info card label">
        A <b>formatted</b> value
    </cfx-info-card>

    // two cards (one with icon and one without) horizontally aligned
    <cfx-info-card label="Status"
                   value="Good Health"
                   icon="status-success">
    </cfx-info-card>
    <cfx-info-card label="Number of Nodes"
                   value="12"
                   icon="EMPTY">
    </cfx-info-card>
