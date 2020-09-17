# Components

All app related components goes here which are used in the application only.

## Components assigned to routes

Components in these folder structure (except those in `common` folders) are assigned to routes. Components should not have selectors.

To generate a new root component called `RootExampleComponent`:

```
cd webapp/components
ng g m root-example --module app
ng g c root-example --skipSelector=true
mkdir common
```

To generate a new child-route component called `ChildRouteExample`under `root-example`:

```
cd webapp/components/root-example
ng g m childroute-example --module root-example
ng g c childroute-example --skipSelector=true
mkdir common
```

Finally assign the component to a route in `webapp/app-routing.module.ts`

## Common components

`common` folders on any level do contain components that are
not assigned to routes. Components should have selectors.

To generate a nev component called `ExampleComponent` (`<example>`) on the root level:

```
cd webapp/components/common
ng g m example
ng g c example
```

Then import the module into any other module where it is used.


