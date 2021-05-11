---
name: Feature request
about: Suggest an idea for this project
title: ''
labels: ''
assignees: ''

---

When defining a new feature it might be needed from two different point of views, the Final User accessing to a website
 using the components or the Developer User who is going to use the components to generate a website. In a feature definition it 
 may be needed one of both of them.

# Final User
When we define tasks from point of view of the final user, we have to describe what this user expects from this task:

## What do I expect from this task?
(Brief description of the interface and its behavior) Example:
* Display a list of queries already done by the user.
* Each query of the list has a button to delete it from the list.

## How can I interact with the result of this task?
(Different interactions of the user) Example:
* When the user clicks on a item of the list, then that query is searched.
* When the user clicks on the delete button, then the query is removed from the list.

## How does the result of this task look?
Simple version of HTML expected, if needed. Example:
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
(!) not strictly necessary to follow this layout. It is just an example.

## Other requirements to take into account
Example:
* The list of queries must be maintained in the same device over time, even closing the tab.
* If there are no queries, then nothing is displayed.

----

# Developer User
When we define tasks from point of view of the developer user, we have to describe what the user of X Components library expects from this task.
*!! NO DESIGN DECISIONS HERE, JUST REQUIREMENTS*.

## How do I use the result of this task?
Example:
* Importing and using a single component 
## What can I customize visually?
Example:
* Changing content of each query
* Changing content of each delete button
* Changing the complete content of the item
* Adding animation to items

## What can I customize in terms of behaviour?
Example:
* Changing the number of the queries to show

(!) All the naming and interface can be changed during the analysis and design if a better approach appears.

----

## Support attachments
* designs
* diagrams
* videos
* confluence links
* real examples links
* etc.
