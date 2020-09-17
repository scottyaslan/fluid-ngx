# Tab navigation

A router driven tab solution, makes possible to assign links to tab contents.

## Example

Let's say `MyViewComponent` has tabs on it:
The router setup:

    {
        path: 'my-view',
        component: MyViewComponent,
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'tab1' },
            {
                path: 'tab1',
                component: Tab1Component
            },
            {
                path: 'tab2',
                component: Tab2Component
            }
        ]
    },

... and `MyViewComponent`'s template:

    <cfx-tab-nav>
        <cfx-tab-link route="tab1">Link 1</cfx-tab-link>
        <cfx-tab-link route="tab2">Link 2</cfx-tab-link>
    </cfx-tab-nav>
    <cfx-tab-outlet></cfx-tab-outlet>
