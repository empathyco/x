---
title: How Interface X works
tags:
  - x components
  - interface x
  - x architecture
  - architecture
---

# How Interface X works

<img :src="$withBase('/assets/media/interfacex-architecture.svg')" alt="Interface X architecture">

<FootNote>

Data journey: The frontend components collect user interactions or events. The wiring orchestrates
the UI events by emitting actions for the client API through the adapter. The API returns the
required data, travelling to the Vuex store through actions that can modify the app data state in
the Vuex store with mutation objects. The UI components are bound to the data state, so that they
render the new state to the user.

</FootNote>

## Understand how the pieces work together

The Interface&nbsp;X architecture is designed into separate tiers and elements:

1.  **Presentation tier**. Mainly represented by the UI **components**, responsible for determining
    how to display the data. It not only presents data in an understandable manner to users, but
    also monitors user interactions, emitting events to the Interface&nbsp;X application.

    Components can be customised according to client requirements, even allowing custom CSS styles.

2.  **Orchestration tier**. The x-factor in charge of orchestrating all the event wiring. When an
    event is emitted, other components are listening to it to react. This behavioural connection
    between components through events is the **wiring**. Then, the wiring decides what happens when
    an event is emitted in the Presentation layer.

    The wiring is customisable and flexible to meet client requirements. The behaviour can change
    without modifying the entire application. The event-driven operators in charge of the wiring
    routing logic enable different wiring configurations per event.

3.  **Business logic tier**. The heart of the app in charge of keeping all the data processing,
    where:
    - UI events emit **actions** for the client API. These actions can modify the state of the
      store.
    - The **store** holds all the app data that should be presented to the user at any given time.
      It acts as a single source of truth, providing great performance and reactivity.

The Interface&nbsp;X app needs an **adapter** to handle all client API communications. The API
adapter mainly translates the related app data and use models to the client API and vice versa,
solving any incompatibility issues. It is the entry point for all external data into the
application.

The API adapter can be customised and extended to meet the client requirements. It’s a plug-in
element that can be changed and adjusted to the specific client API, even when using other search
services not based on the Empathy search API.

::: note Architecture patterns

If you’re already experienced in the Vue universe, you’ll find the Interface&nbsp;X architecture
somewhat familiar. Although the [ViewModel layer](https://012.vuejs.org/guide/#Introduction) of the
**MVVM pattern** sprinkles traces all over the presentation tier, the Interface X architecture is
basically inspired by the
[**Flux pattern**](https://vuex.vuejs.org/#what-is-a-state-management-pattern) behind the state. As
the X&nbsp;Components emit events that dispatch actions in the business logic tier, these actions
can commit mutations to modify the state of the store.  
To sum up, the design of Interface&nbsp;X takes advantage of the MVVM and Flux patterns to design,
develop, and configure each tier separately and independently.

:::

## Technical stack

- [Vue.js](https://vuejs.org/) framework
- JavaScript + [TypeScript](https://www.typescriptlang.org/) languages
- [RxJS](https://rxjs.dev/) for the wiring configuration logic

**The story so far**  
Not long ago, exploring alternative options for the architecture design and technical stack became a
must. There were several design challenges that needed to be overcome to make the frontend service
easier to configure:

- Improve reusability and performance that were hindered by the logic in components and the bundle
  size
- Facilitate setup by solving synchronicity and extendability problems
- Provide easier maintenance over time, reducing regression issues

After studying different approaches to build fast and reusable components, **Vue.js** (also Vue)
seemed to be the best fit for the technical requirements and the level of abstraction required.

Revamping the architecture and technical stack has helped the former frontend services to evolve
into the latest Interface&nbsp;X application. Now, all the required **attributes and design
principles** are combined to make the solution easy to implement, change, test, and reuse:

- **Flexible**. Make changes to any element without impacting the rest of the app. For example, you
  can modify a visual component without impacting the business logic.
- **Customizable & extensible**. Add new custom components andor features.
- **Lightweight**. The bundle includes only the modules you want. You’ll get only the code you
  really need.
- **Incremental**. The modules interact and communicate automatically with each other. The more
  modules you use, the more features you get.
- **Easy-to-integrate**. Install the library as an NPM dependency in Vue and React projects.
  Interface X can be used in any webpage, as long as it is integrated as an isolated search layer.

**Why Vue?**  
Due to the flexibility required, using a library for the presentation layer instead of a
full-fledged framework is the best choice. Among the state-of-the-art technologies available for
building component-based UIs, Vue meets all the requirements:

- Lightweight, flexible, and stand-alone library
- Easy to learn and use with a user-friendly template syntax
- Smooth dynamic components and composition creation
- Outperformance with reactive approach, proxies, and interceptors
- Out-of-the-box solution, allowing you to focus just on developing features
- Small bundle size with no dependencies

**How does Vue meet the design challenges?**

- Stateless components. Centralised management through the Vuex library reduces the logic in
  components.
- Smooth setups. Dynamic component creation helps to track the modified data and re-render only the
  required components.
- Improved performance out of the box
- Seamless maintenance. Framework or library-agnostic

::: note

Interface&nbsp;X can potentially be integrated in commerce shops built with React. In any case,
Interface&nbsp;X can be used in any webpage, as long as it is integrated as an isolated search
layer.

:::
