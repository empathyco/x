# Concepts

## X Module

The `@empathy/x-components` project is organized in X Modules. You can find them in the
`src/x-modules` directory. An X Module is a logical group of Components, Vuex, Wiring, Emitters and
services, that are related by a common feature.

At the end an X Module is just an object that contains all these elements (except the
[X Components](#x-component)) and is registered in the X Plugin if it is going to be used.

However, there are other elements and Components that are used across all the project, and are out
of any X Module.

## X Component

An X Component is a component that depends on a [X Module](#x-module). Hence, as soon as this
component is imported, its X Module will be registered.

Because this component depends on an X Module, and every X Module has its own Vuex module, an X
Component can access that part of the store. Every other component type inside the
`@empathy/x-components` project can’t access the Vuex Store instance.

## X Event

The `@empathy/x-components` project has an event's driven architecture. Different pieces of the
library (components, wiring, emitters...) can communicate between themselves using events. An X
Event is just one of these events, that can have associated or not a payload type, and some metadata
(which X Module emitted this event, from what DOM element has it been emitted if there are any…).

## Base Components

Base components are components that do not have any dependencies with the `@empathy/x-components`
events system or X Modules.

This kind of components are intended to serve as a foundation to build other components.
