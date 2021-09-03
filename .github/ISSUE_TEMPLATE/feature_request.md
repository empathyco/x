---
name: Feature request
about: Suggest an idea for this project
title: ''
labels: ''
assignees: ''

---
When suggesting a new feature, submit your idea as a user story and provide as much information as possible on how you would solve it, so the team can assess and analyze your idea.

When defining your new feature, you need to consider it from two points of view: 
- the [Final User](#final-user) who accesses the commerce website that uses the component.
- the [Developer User](#developer-user) who is going to use the component to build a website. 
Depending on the feature, you may need to consider one or both.

# Final User
When you define the feature from the point of view of the final user, describe the problem encountered by the user, what they need to solve it, and what they expect.

## What does the user expect from this task?
Provide a brief description of the interface and its expected behavior. 

Example for the History Queries module:
* Display a list of search queries already performed by the user.
* Each search query of the list has a button to delete it from the list.

## How can the user interact with the result of this task?
Explain the different interactions of the user. 

Example for the History Queries module:
* When the user clicks on an item of the list, then that search query is performed.
* When the user clicks on the delete button, then the search query is removed from the list.

## What does the result of this task look like?
Simple version of HTML expected, if needed. 

Example:
```
    <ul class="queries-list">
        <li class="queries-list__item">
            <button class="queries-list__delete">X</button>
            <button class="queries-list__query">lego</button>
        </li>
        <li class="queries-list__item">
            <button class="queries-list__delete">X</button>
            <button class="queries-list__query">playmobil</button>
        </li>
    </ul>
```

(!) It is not strictly necessary to follow this layout. This is just an example to get you started.

## Other requirements to take into account
Include details of other requirements that the feature must cover, such as dependencies and actions covered by other services, and other needs.

Example:
* The list of search queries must be maintained in the same device over time, even when the tab is closed.
* If there are no search queries, then nothing should be displayed.

----

# Developer User
When you define the feature from the point of view of a developer, you need to describe what the user of X Components library expects, and how they can use it.

*(!) DO NOT INCLUDE DESIGN DECISIONS HERE; JUST REQUIREMENTS*.

## How does the user use the result of this task?
Provide details on how it will be used, i.e. used as a standalone component or requires other components to work.

Example:
* Import and use a single component 

## What can the user customize visually?
Provide details on the level of customization of the display that the user can perform.

Example for the History Queries module:
* Change the content of each search query
* Change the content of each delete button
* Change the complete content of the item
* Add different animation to items

## What can the user customize in terms of behavior?
Provide details on the level of customization that the user can perform.

Example:
* Change the number of the search queries to show

(!) All the naming and interface may be changed during the analysis and design stage if a better approach is identified.

----

## Supporting informations
Provide as much supporting information as possible. Including attachments will help us to better understand your feature request and requirements.

Example:
* designs
* diagrams
* videos
* Confluence links
* real examples links
* etc.
