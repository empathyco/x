<template>
  <section class="x-list x-padding--07 x-list--gap-05 x-list--justify-start x-list--align-start">
    <h1 class="x-title1">Filter</h1>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">Default</h2>

      <div class="x-filter">
        <span class="x-filter__label">Filter value</span>
      </div>

      <div class="x-filter">
        <CheckboxSelectedIcon />
        <span class="x-filter__label">Filter value</span>
      </div>

      <div class="x-filter">
        <CheckboxSelectedIcon />
        <span class="x-filter__label">Filter value</span>
        <span class="x-filter__count">(10)</span>
      </div>

      <div class="x-filter">
        <CheckboxSelectedIcon />
        <span class="x-filter__label">Filter value</span>
        <span class="x-filter__count">(10)</span>
        <CheckIcon />
      </div>

      <div class="x-filter">
        <CheckboxSelectedIcon />
        <span class="x-filter__label">Filter extra large name</span>
        <span class="x-filter__count">(10)</span>
      </div>

      <div class="x-filter">
        <CheckboxSelectedIcon />
        <span class="x-filter__label">Filter extra large name</span>
        <span class="x-filter__count">(10)</span>
        <CheckIcon />
      </div>
    </article>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">Default Selected</h2>

      <div class="x-filter x-filter--is-selected">
        <span class="x-filter__label">Filter value</span>
      </div>

      <div class="x-filter x-filter--is-selected">
        <CheckboxSelectedIcon />
        <span class="x-filter__label">Filter value</span>
      </div>

      <div class="x-filter x-filter--is-selected">
        <CheckboxSelectedIcon />
        <span class="x-filter__label">Filter value</span>
        <span class="x-filter__count">(10)</span>
      </div>

      <div class="x-filter x-filter--is-selected">
        <CheckboxSelectedIcon />
        <span class="x-filter__label">Filter value</span>
        <span class="x-filter__count">(10)</span>
        <CheckIcon />
      </div>

      <div class="x-filter x-filter--is-selected">
        <CheckboxSelectedIcon />
        <span class="x-filter__label">Filter extra large name</span>
        <span class="x-filter__count">(10)</span>
      </div>

      <div class="x-filter x-filter--is-selected">
        <CheckboxSelectedIcon />
        <span class="x-filter__label">Filter extra large name</span>
        <span class="x-filter__count">(10)</span>
        <CheckIcon />
      </div>
    </article>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start x-filter--justified">
      <h2 class="x-title2">Justified</h2>

      <div class="x-filter">
        <span class="x-filter__label">Filter value</span>
      </div>

      <div class="x-filter">
        <CheckboxSelectedIcon />
        <span class="x-filter__label">Filter value</span>
      </div>

      <div class="x-filter">
        <CheckboxSelectedIcon />
        <span class="x-filter__label">Filter value</span>
        <span class="x-filter__count">(10)</span>
      </div>

      <div class="x-filter">
        <CheckboxSelectedIcon />
        <span class="x-filter__label">Filter value</span>
        <span class="x-filter__count">(10)</span>
        <CheckIcon />
      </div>

      <div class="x-filter">
        <CheckboxSelectedIcon />
        <span class="x-filter__label">Filter extra large name</span>
        <span class="x-filter__count">(10)</span>
      </div>

      <div class="x-filter">
        <CheckboxSelectedIcon />
        <span class="x-filter__label">Filter extra large name</span>
        <span class="x-filter__count">(10)</span>
        <CheckIcon />
      </div>
    </article>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start x-filter--justified">
      <h2 class="x-title2">Justified Selected</h2>

      <div class="x-filter x-filter--is-selected">
        <span class="x-filter__label">Filter value</span>
      </div>

      <div class="x-filter x-filter--is-selected">
        <CheckboxSelectedIcon />
        <span class="x-filter__label">Filter value</span>
      </div>

      <div class="x-filter x-filter--is-selected">
        <CheckboxSelectedIcon />
        <span class="x-filter__label">Filter value</span>
        <span class="x-filter__count">(10)</span>
      </div>

      <div class="x-filter x-filter--is-selected">
        <CheckboxSelectedIcon />
        <span class="x-filter__label">Filter value</span>
        <span class="x-filter__count">(10)</span>
        <CheckIcon />
      </div>

      <div class="x-filter x-filter--is-selected">
        <CheckboxSelectedIcon />
        <span class="x-filter__label">Filter extra large name</span>
        <span class="x-filter__count">(10)</span>
      </div>

      <div class="x-filter x-filter--is-selected">
        <CheckboxSelectedIcon />
        <span class="x-filter__label">Filter extra large name</span>
        <span class="x-filter__count">(10)</span>
        <CheckIcon />
      </div>
    </article>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">Hierarchical Filter</h2>

      <div class="x-hierarchical-filter-container">
        <div class="x-filter x-hierarchical-filter x-filter--is-selected">
          <span class="x-filter__label">Parent Filter</span>
        </div>
        <ul class="x-hierarchical-filter__children">
          <li class="x-hierarchical-filter-container">
            <div class="x-filter x-hierarchical-filter">
              <span class="x-filter__label">Child Filter 1</span>
            </div>
          </li>
          <li class="x-hierarchical-filter-container">
            <div class="x-filter x-hierarchical-filter x-filter--is-selected">
              <span class="x-filter__label">Child Filter 2</span>
            </div>
            <ul class="x-hierarchical-filter__children">
              <li class="x-hierarchical-filter-container">
                <div class="x-filter x-hierarchical-filter">
                  <span class="x-filter__label">Child Filter 1</span>
                </div>
              </li>
              <li class="x-hierarchical-filter-container">
                <div class="x-filter x-hierarchical-filter x-filter--is-selected">
                  <span class="x-filter__label">Child Filter 2</span>
                </div>
              </li>
              <li class="x-hierarchical-filter-container">
                <div class="x-filter x-hierarchical-filter">
                  <span class="x-filter__label">Child Filter 3</span>
                </div>
              </li>
            </ul>
          </li>
          <li class="x-hierarchical-filter-container">
            <div class="x-filter x-hierarchical-filter">
              <span class="x-filter__label">Child Filter 3</span>
            </div>
          </li>
        </ul>
      </div>

      <div class="x-hierarchical-filter-container">
        <div class="x-filter x-hierarchical-filter x-filter--is-selected">
          <CheckboxSelectedIcon />
          <span class="x-filter__label">Parent Filter</span>
        </div>
        <ul class="x-hierarchical-filter__children">
          <li class="x-hierarchical-filter-container">
            <div class="x-filter x-hierarchical-filter">
              <CheckboxSelectedIcon />
              <span class="x-filter__label">Child Filter 1</span>
            </div>
          </li>
          <li class="x-hierarchical-filter-container">
            <div class="x-filter x-hierarchical-filter x-filter--is-selected">
              <CheckboxSelectedIcon />
              <span class="x-filter__label">Child Filter 2</span>
            </div>
            <ul class="x-hierarchical-filter__children">
              <li class="x-hierarchical-filter-container">
                <div class="x-filter x-hierarchical-filter">
                  <CheckboxSelectedIcon />
                  <span class="x-filter__label">Child Filter 1</span>
                </div>
              </li>
              <li class="x-hierarchical-filter-container">
                <div class="x-filter x-hierarchical-filter x-filter--is-selected">
                  <CheckboxSelectedIcon />
                  <span class="x-filter__label">Child Filter 2</span>
                </div>
              </li>
              <li class="x-hierarchical-filter-container">
                <div class="x-filter x-hierarchical-filter">
                  <CheckboxSelectedIcon />
                  <span class="x-filter__label">Child Filter 3</span>
                </div>
              </li>
            </ul>
          </li>
          <li class="x-hierarchical-filter-container">
            <div class="x-filter x-hierarchical-filter">
              <CheckboxSelectedIcon />
              <span class="x-filter__label">Child Filter 3</span>
            </div>
          </li>
        </ul>
      </div>

      <div class="x-hierarchical-filter-container">
        <div class="x-filter x-hierarchical-filter x-filter--is-selected">
          <CheckboxSelectedIcon />
          <span class="x-filter__label">Parent Filter</span>
          <span class="x-filter__count">(10)</span>
        </div>
        <ul class="x-hierarchical-filter__children">
          <li class="x-hierarchical-filter-container">
            <div class="x-filter x-hierarchical-filter">
              <CheckboxSelectedIcon />
              <span class="x-filter__label">Child Filter 1</span>
              <span class="x-filter__count">(10)</span>
            </div>
          </li>
          <li class="x-hierarchical-filter-container">
            <div class="x-filter x-hierarchical-filter x-filter--is-selected">
              <CheckboxSelectedIcon />
              <span class="x-filter__label">Child Filter 2</span>
              <span class="x-filter__count">(10)</span>
            </div>
            <ul class="x-hierarchical-filter__children">
              <li class="x-hierarchical-filter-container">
                <div class="x-filter x-hierarchical-filter">
                  <CheckboxSelectedIcon />
                  <span class="x-filter__label">Child Filter 1</span>
                  <span class="x-filter__count">(10)</span>
                </div>
              </li>
              <li class="x-hierarchical-filter-container">
                <div class="x-filter x-hierarchical-filter x-filter--is-selected">
                  <CheckboxSelectedIcon />
                  <span class="x-filter__label">Child Filter 2</span>
                  <span class="x-filter__count">(10)</span>
                </div>
              </li>
              <li class="x-hierarchical-filter-container">
                <div class="x-filter x-hierarchical-filter">
                  <CheckboxSelectedIcon />
                  <span class="x-filter__label">Child Filter 3</span>
                  <span class="x-filter__count">(10)</span>
                </div>
              </li>
            </ul>
          </li>
          <li class="x-hierarchical-filter-container">
            <div class="x-filter x-hierarchical-filter">
              <CheckboxSelectedIcon />
              <span class="x-filter__label">Child Filter 3</span>
              <span class="x-filter__count">(10)</span>
            </div>
          </li>
        </ul>
      </div>

      <div class="x-hierarchical-filter-container">
        <div class="x-filter x-hierarchical-filter x-filter--is-selected">
          <CheckboxSelectedIcon />
          <span class="x-filter__label">Parent Filter</span>
          <span class="x-filter__count">(10)</span>
          <CheckIcon />
        </div>
        <ul class="x-hierarchical-filter__children">
          <li class="x-hierarchical-filter-container">
            <div class="x-filter x-hierarchical-filter">
              <CheckboxSelectedIcon />
              <span class="x-filter__label">Child Filter 1</span>
              <span class="x-filter__count">(10)</span>
              <CheckIcon />
            </div>
          </li>
          <li class="x-hierarchical-filter-container">
            <div class="x-filter x-hierarchical-filter x-filter--is-selected">
              <CheckboxSelectedIcon />
              <span class="x-filter__label">Child Filter 2</span>
              <span class="x-filter__count">(10)</span>
              <CheckIcon />
            </div>
            <ul class="x-hierarchical-filter__children">
              <li class="x-hierarchical-filter-container">
                <div class="x-filter x-hierarchical-filter">
                  <CheckboxSelectedIcon />
                  <span class="x-filter__label">Child Filter 1</span>
                  <span class="x-filter__count">(10)</span>
                  <CheckIcon />
                </div>
              </li>
              <li class="x-hierarchical-filter-container">
                <div class="x-filter x-hierarchical-filter x-filter--is-selected">
                  <CheckboxSelectedIcon />
                  <span class="x-filter__label">Child Filter 2</span>
                  <span class="x-filter__count">(10)</span>
                  <CheckIcon />
                </div>
              </li>
              <li class="x-hierarchical-filter-container">
                <div class="x-filter x-hierarchical-filter">
                  <CheckboxSelectedIcon />
                  <span class="x-filter__label">Child Filter 3</span>
                  <span class="x-filter__count">(10)</span>
                  <CheckIcon />
                </div>
              </li>
            </ul>
          </li>
          <li class="x-hierarchical-filter-container">
            <div class="x-filter x-hierarchical-filter">
              <CheckboxSelectedIcon />
              <span class="x-filter__label">Child Filter 3</span>
              <span class="x-filter__count">(10)</span>
              <CheckIcon />
            </div>
          </li>
        </ul>
      </div>

      <div class="x-hierarchical-filter-container">
        <div class="x-filter x-hierarchical-filter x-filter--is-selected">
          <CheckboxSelectedIcon />
          <span class="x-filter__label">Parent Filter extra large name</span>
          <span class="x-filter__count">(10)</span>
        </div>
        <ul class="x-hierarchical-filter__children">
          <li class="x-hierarchical-filter-container">
            <div class="x-filter x-hierarchical-filter">
              <CheckboxSelectedIcon />
              <span class="x-filter__label">Child Filter 1 extra large name</span>
              <span class="x-filter__count">(10)</span>
            </div>
          </li>
          <li class="x-hierarchical-filter-container">
            <div class="x-filter x-hierarchical-filter x-filter--is-selected">
              <CheckboxSelectedIcon />
              <span class="x-filter__label">Child Filter 2 extra large name</span>
              <span class="x-filter__count">(10)</span>
            </div>
            <ul class="x-hierarchical-filter__children">
              <li class="x-hierarchical-filter-container">
                <div class="x-filter x-hierarchical-filter">
                  <CheckboxSelectedIcon />
                  <span class="x-filter__label">Child Filter 1 extra large name</span>
                  <span class="x-filter__count">(10)</span>
                </div>
              </li>
              <li class="x-hierarchical-filter-container">
                <div class="x-filter x-hierarchical-filter x-filter--is-selected">
                  <CheckboxSelectedIcon />
                  <span class="x-filter__label">Child Filter 2 extra large name</span>
                  <span class="x-filter__count">(10)</span>
                </div>
              </li>
              <li class="x-hierarchical-filter-container">
                <div class="x-filter x-hierarchical-filter">
                  <CheckboxSelectedIcon />
                  <span class="x-filter__label">Child Filter 3 extra large name</span>
                  <span class="x-filter__count">(10)</span>
                </div>
              </li>
            </ul>
          </li>
          <li class="x-hierarchical-filter-container">
            <div class="x-filter x-hierarchical-filter">
              <CheckboxSelectedIcon />
              <span class="x-filter__label">Child Filter 3 extra large name</span>
              <span class="x-filter__count">(10)</span>
            </div>
          </li>
        </ul>
      </div>

      <div class="x-hierarchical-filter-container">
        <div class="x-filter x-hierarchical-filter x-filter--is-selected">
          <CheckboxSelectedIcon />
          <span class="x-filter__label">Parent Filter extra large name</span>
          <span class="x-filter__count">(10)</span>
          <CheckIcon />
        </div>
        <ul class="x-hierarchical-filter__children">
          <li class="x-hierarchical-filter-container">
            <div class="x-filter x-hierarchical-filter">
              <CheckboxSelectedIcon />
              <span class="x-filter__label">Child Filter 1 extra large name</span>
              <span class="x-filter__count">(10)</span>
              <CheckIcon />
            </div>
          </li>
          <li class="x-hierarchical-filter-container">
            <div class="x-filter x-hierarchical-filter x-filter--is-selected">
              <CheckboxSelectedIcon />
              <span class="x-filter__label">Child Filter 2 extra large name</span>
              <span class="x-filter__count">(10)</span>
              <CheckIcon />
            </div>
            <ul class="x-hierarchical-filter__children">
              <li class="x-hierarchical-filter-container">
                <div class="x-filter x-hierarchical-filter">
                  <CheckboxSelectedIcon />
                  <span class="x-filter__label">Child Filter 1 extra large name</span>
                  <span class="x-filter__count">(10)</span>
                  <CheckIcon />
                </div>
              </li>
              <li class="x-hierarchical-filter-container">
                <div class="x-filter x-hierarchical-filter x-filter--is-selected">
                  <CheckboxSelectedIcon />
                  <span class="x-filter__label">Child Filter 2 extra large name</span>
                  <span class="x-filter__count">(10)</span>
                  <CheckIcon />
                </div>
              </li>
              <li class="x-hierarchical-filter-container">
                <div class="x-filter x-hierarchical-filter">
                  <CheckboxSelectedIcon />
                  <span class="x-filter__label">Child Filter 3 extra large name</span>
                  <span class="x-filter__count">(10)</span>
                  <CheckIcon />
                </div>
              </li>
            </ul>
          </li>
          <li class="x-hierarchical-filter-container">
            <div class="x-filter x-hierarchical-filter">
              <CheckboxSelectedIcon />
              <span class="x-filter__label">Child Filter 3 extra large name</span>
              <span class="x-filter__count">(10)</span>
              <CheckIcon />
            </div>
          </li>
        </ul>
      </div>
    </article>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start x-filter--justified">
      <h2 class="x-title2">Justified Hierarchical Filter</h2>

      <div class="x-hierarchical-filter-container">
        <div class="x-filter x-hierarchical-filter x-filter--is-selected">
          <span class="x-filter__label">Parent Filter</span>
        </div>
        <ul class="x-hierarchical-filter__children">
          <li class="x-hierarchical-filter-container">
            <div class="x-filter x-hierarchical-filter">
              <span class="x-filter__label">Child Filter 1</span>
            </div>
          </li>
          <li class="x-hierarchical-filter-container">
            <div class="x-filter x-hierarchical-filter x-filter--is-selected">
              <span class="x-filter__label">Child Filter 2</span>
            </div>
            <ul class="x-hierarchical-filter__children">
              <li class="x-hierarchical-filter-container">
                <div class="x-filter x-hierarchical-filter">
                  <span class="x-filter__label">Child Filter 1</span>
                </div>
              </li>
              <li class="x-hierarchical-filter-container">
                <div class="x-filter x-hierarchical-filter x-filter--is-selected">
                  <span class="x-filter__label">Child Filter 2</span>
                </div>
              </li>
              <li class="x-hierarchical-filter-container">
                <div class="x-filter x-hierarchical-filter">
                  <span class="x-filter__label">Child Filter 3</span>
                </div>
              </li>
            </ul>
          </li>
          <li class="x-hierarchical-filter-container">
            <div class="x-filter x-hierarchical-filter">
              <span class="x-filter__label">Child Filter 3</span>
            </div>
          </li>
        </ul>
      </div>

      <div class="x-hierarchical-filter-container">
        <div class="x-filter x-hierarchical-filter x-filter--is-selected">
          <CheckboxSelectedIcon />
          <span class="x-filter__label">Parent Filter</span>
        </div>
        <ul class="x-hierarchical-filter__children">
          <li class="x-hierarchical-filter-container">
            <div class="x-filter x-hierarchical-filter">
              <CheckboxSelectedIcon />
              <span class="x-filter__label">Child Filter 1</span>
            </div>
          </li>
          <li class="x-hierarchical-filter-container">
            <div class="x-filter x-hierarchical-filter x-filter--is-selected">
              <CheckboxSelectedIcon />
              <span class="x-filter__label">Child Filter 2</span>
            </div>
            <ul class="x-hierarchical-filter__children">
              <li class="x-hierarchical-filter-container">
                <div class="x-filter x-hierarchical-filter">
                  <CheckboxSelectedIcon />
                  <span class="x-filter__label">Child Filter 1</span>
                </div>
              </li>
              <li class="x-hierarchical-filter-container">
                <div class="x-filter x-hierarchical-filter x-filter--is-selected">
                  <CheckboxSelectedIcon />
                  <span class="x-filter__label">Child Filter 2</span>
                </div>
              </li>
              <li class="x-hierarchical-filter-container">
                <div class="x-filter x-hierarchical-filter">
                  <CheckboxSelectedIcon />
                  <span class="x-filter__label">Child Filter 3</span>
                </div>
              </li>
            </ul>
          </li>
          <li class="x-hierarchical-filter-container">
            <div class="x-filter x-hierarchical-filter">
              <CheckboxSelectedIcon />
              <span class="x-filter__label">Child Filter 3</span>
            </div>
          </li>
        </ul>
      </div>

      <div class="x-hierarchical-filter-container">
        <div class="x-filter x-hierarchical-filter x-filter--is-selected">
          <CheckboxSelectedIcon />
          <span class="x-filter__label">Parent Filter</span>
          <span class="x-filter__count">(10)</span>
        </div>
        <ul class="x-hierarchical-filter__children">
          <li class="x-hierarchical-filter-container">
            <div class="x-filter x-hierarchical-filter">
              <CheckboxSelectedIcon />
              <span class="x-filter__label">Child Filter 1</span>
              <span class="x-filter__count">(10)</span>
            </div>
          </li>
          <li class="x-hierarchical-filter-container">
            <div class="x-filter x-hierarchical-filter x-filter--is-selected">
              <CheckboxSelectedIcon />
              <span class="x-filter__label">Child Filter 2</span>
              <span class="x-filter__count">(10)</span>
            </div>
            <ul class="x-hierarchical-filter__children">
              <li class="x-hierarchical-filter-container">
                <div class="x-filter x-hierarchical-filter">
                  <CheckboxSelectedIcon />
                  <span class="x-filter__label">Child Filter 1</span>
                  <span class="x-filter__count">(10)</span>
                </div>
              </li>
              <li class="x-hierarchical-filter-container">
                <div class="x-filter x-hierarchical-filter x-filter--is-selected">
                  <CheckboxSelectedIcon />
                  <span class="x-filter__label">Child Filter 2</span>
                  <span class="x-filter__count">(10)</span>
                </div>
              </li>
              <li class="x-hierarchical-filter-container">
                <div class="x-filter x-hierarchical-filter">
                  <CheckboxSelectedIcon />
                  <span class="x-filter__label">Child Filter 3</span>
                  <span class="x-filter__count">(10)</span>
                </div>
              </li>
            </ul>
          </li>
          <li class="x-hierarchical-filter-container">
            <div class="x-filter x-hierarchical-filter">
              <CheckboxSelectedIcon />
              <span class="x-filter__label">Child Filter 3</span>
              <span class="x-filter__count">(10)</span>
            </div>
          </li>
        </ul>
      </div>

      <div class="x-hierarchical-filter-container">
        <div class="x-filter x-hierarchical-filter x-filter--is-selected">
          <CheckboxSelectedIcon />
          <span class="x-filter__label">Parent Filter</span>
          <span class="x-filter__count">(10)</span>
          <CheckIcon />
        </div>
        <ul class="x-hierarchical-filter__children">
          <li class="x-hierarchical-filter-container">
            <div class="x-filter x-hierarchical-filter">
              <CheckboxSelectedIcon />
              <span class="x-filter__label">Child Filter 1</span>
              <span class="x-filter__count">(10)</span>
              <CheckIcon />
            </div>
          </li>
          <li class="x-hierarchical-filter-container">
            <div class="x-filter x-hierarchical-filter x-filter--is-selected">
              <CheckboxSelectedIcon />
              <span class="x-filter__label">Child Filter 2</span>
              <span class="x-filter__count">(10)</span>
              <CheckIcon />
            </div>
            <ul class="x-hierarchical-filter__children">
              <li class="x-hierarchical-filter-container">
                <div class="x-filter x-hierarchical-filter">
                  <CheckboxSelectedIcon />
                  <span class="x-filter__label">Child Filter 1</span>
                  <span class="x-filter__count">(10)</span>
                  <CheckIcon />
                </div>
              </li>
              <li class="x-hierarchical-filter-container">
                <div class="x-filter x-hierarchical-filter x-filter--is-selected">
                  <CheckboxSelectedIcon />
                  <span class="x-filter__label">Child Filter 2</span>
                  <span class="x-filter__count">(10)</span>
                  <CheckIcon />
                </div>
              </li>
              <li class="x-hierarchical-filter-container">
                <div class="x-filter x-hierarchical-filter">
                  <CheckboxSelectedIcon />
                  <span class="x-filter__label">Child Filter 3</span>
                  <span class="x-filter__count">(10)</span>
                  <CheckIcon />
                </div>
              </li>
            </ul>
          </li>
          <li class="x-hierarchical-filter-container">
            <div class="x-filter x-hierarchical-filter">
              <CheckboxSelectedIcon />
              <span class="x-filter__label">Child Filter 3</span>
              <span class="x-filter__count">(10)</span>
              <CheckIcon />
            </div>
          </li>
        </ul>
      </div>

      <div class="x-hierarchical-filter-container">
        <div class="x-filter x-hierarchical-filter x-filter--is-selected">
          <CheckboxSelectedIcon />
          <span class="x-filter__label">Parent Filter extra large name</span>
          <span class="x-filter__count">(10)</span>
        </div>
        <ul class="x-hierarchical-filter__children">
          <li class="x-hierarchical-filter-container">
            <div class="x-filter x-hierarchical-filter">
              <CheckboxSelectedIcon />
              <span class="x-filter__label">Child Filter 1 extra large name</span>
              <span class="x-filter__count">(10)</span>
            </div>
          </li>
          <li class="x-hierarchical-filter-container">
            <div class="x-filter x-hierarchical-filter x-filter--is-selected">
              <CheckboxSelectedIcon />
              <span class="x-filter__label">Child Filter 2 extra large name</span>
              <span class="x-filter__count">(10)</span>
            </div>
            <ul class="x-hierarchical-filter__children">
              <li class="x-hierarchical-filter-container">
                <div class="x-filter x-hierarchical-filter">
                  <CheckboxSelectedIcon />
                  <span class="x-filter__label">Child Filter 1 extra large name</span>
                  <span class="x-filter__count">(10)</span>
                </div>
              </li>
              <li class="x-hierarchical-filter-container">
                <div class="x-filter x-hierarchical-filter x-filter--is-selected">
                  <CheckboxSelectedIcon />
                  <span class="x-filter__label">Child Filter 2 extra large name</span>
                  <span class="x-filter__count">(10)</span>
                </div>
              </li>
              <li class="x-hierarchical-filter-container">
                <div class="x-filter x-hierarchical-filter">
                  <CheckboxSelectedIcon />
                  <span class="x-filter__label">Child Filter 3 extra large name</span>
                  <span class="x-filter__count">(10)</span>
                </div>
              </li>
            </ul>
          </li>
          <li class="x-hierarchical-filter-container">
            <div class="x-filter x-hierarchical-filter">
              <CheckboxSelectedIcon />
              <span class="x-filter__label">Child Filter 3 extra large name</span>
              <span class="x-filter__count">(10)</span>
            </div>
          </li>
        </ul>
      </div>

      <div class="x-hierarchical-filter-container">
        <div class="x-filter x-hierarchical-filter x-filter--is-selected">
          <CheckboxSelectedIcon />
          <span class="x-filter__label">Parent Filter extra large name</span>
          <span class="x-filter__count">(10)</span>
          <CheckIcon />
        </div>
        <ul class="x-hierarchical-filter__children">
          <li class="x-hierarchical-filter-container">
            <div class="x-filter x-hierarchical-filter">
              <CheckboxSelectedIcon />
              <span class="x-filter__label">Child Filter 1 extra large name</span>
              <span class="x-filter__count">(10)</span>
              <CheckIcon />
            </div>
          </li>
          <li class="x-hierarchical-filter-container">
            <div class="x-filter x-hierarchical-filter x-filter--is-selected">
              <CheckboxSelectedIcon />
              <span class="x-filter__label">Child Filter 2 extra large name</span>
              <span class="x-filter__count">(10)</span>
              <CheckIcon />
            </div>
            <ul class="x-hierarchical-filter__children">
              <li class="x-hierarchical-filter-container">
                <div class="x-filter x-hierarchical-filter">
                  <CheckboxSelectedIcon />
                  <span class="x-filter__label">Child Filter 1 extra large name</span>
                  <span class="x-filter__count">(10)</span>
                  <CheckIcon />
                </div>
              </li>
              <li class="x-hierarchical-filter-container">
                <div class="x-filter x-hierarchical-filter x-filter--is-selected">
                  <CheckboxSelectedIcon />
                  <span class="x-filter__label">Child Filter 2 extra large name</span>
                  <span class="x-filter__count">(10)</span>
                  <CheckIcon />
                </div>
              </li>
              <li class="x-hierarchical-filter-container">
                <div class="x-filter x-hierarchical-filter">
                  <CheckboxSelectedIcon />
                  <span class="x-filter__label">Child Filter 3 extra large name</span>
                  <span class="x-filter__count">(10)</span>
                  <CheckIcon />
                </div>
              </li>
            </ul>
          </li>
          <li class="x-hierarchical-filter-container">
            <div class="x-filter x-hierarchical-filter">
              <CheckboxSelectedIcon />
              <span class="x-filter__label">Child Filter 3 extra large name</span>
              <span class="x-filter__count">(10)</span>
              <CheckIcon />
            </div>
          </li>
        </ul>
      </div>
    </article>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import CheckboxSelectedIcon from '../../components/icons/checkbox-selected.vue';
  import CheckIcon from '../../components/icons/check.vue';

  @Component({
    components: {
      CheckboxSelectedIcon,
      CheckIcon
    }
  })
  export default class DesignSystemFilter extends Vue {}
</script>

<style lang="scss" scoped>
  .x-filter:not(.x-hierarchical-filter),
  .x-hierarchical-filter-container {
    max-width: 220px;
  }

  .x-hierarchical-filter-base-container {
    max-width: 270px;
  }
</style>
