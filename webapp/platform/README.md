# Platform

App independent components, services, directives, etc. that are intended to use in multiple applications in the long term.

These components should not access the backend api and the global app state (store).

Components here strictly have to communicate with @Inputs and @Outputs.

To generate a nev component called `ExampleComponent` (`<cfx-example>`):

```
cd webapp/platform/components
ng g m example --module platform
ng g c example --export=true --prefix=cfx
```

Finally, if you would like to use the component outside the module, either you can simply import this module there, or you can export the component module in `webapp/platform/platform-module.ts`, then it will be available in the whole app.

```
@NgModule({
    ...
    exports: [
        ...
        CfxExampleModule
    ]
})
export class PlatformModule { }
```