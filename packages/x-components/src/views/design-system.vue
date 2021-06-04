<template>
  <main class="x-design-system">
    <section>
      <h1 class="x-title1">Typography</h1>

      <span class="x-text">text typography</span>
      <span class="x-title1">Title1 Typography</span>
      <span class="x-title2">Title2 Typography</span>
      <span class="x-title3">Title3 Typography</span>
      <span class="x-small">small typography</span>
    </section>

    <section>
      <h1 class="x-title1">Button</h1>

      <article>
        <h2 class="x-title2">Default</h2>
        <button class="x-button">Default</button>
        <button class="x-button">
          <span class="x-icon">⌕</span>
          <span>Default</span>
        </button>
        <button class="x-button x-button--card">
          <span class="x-icon">⌕</span>
          <span>Default Card</span>
        </button>
        <button class="x-button x-button--pill">
          <span class="x-icon">⌕</span>
          <span>Default Pill</span>
        </button>
        <button class="x-button x-button--round">
          <span class="x-icon">⌕</span>
        </button>
      </article>

      <article class="x-button--primary">
        <h2 class="x-title2">Primary</h2>
        <button class="x-button">Primary</button>
        <button class="x-button">
          <span class="x-icon">⌕</span>
          <span>Primary</span>
        </button>
        <button class="x-button x-button--card">
          <span class="x-icon">⌕</span>
          <span>Primary Card</span>
        </button>
        <button class="x-button x-button--pill">
          <span class="x-icon">⌕</span>
          <span>Primary Pill</span>
        </button>
        <button class="x-button x-button--round">
          <span class="x-icon">⌕</span>
        </button>
      </article>

      <article class="x-button--secondary">
        <h2 class="x-title2">Secondary</h2>
        <button class="x-button">Secondary</button>
        <button class="x-button">
          <span class="x-icon">⌕</span>
          <span>Secondary</span>
        </button>
        <button class="x-button x-button--card">
          <span class="x-icon">⌕</span>
          <span>Secondary Card</span>
        </button>
        <button class="x-button x-button--pill">
          <span class="x-icon">⌕</span>
          <span>Secondary Pill</span>
        </button>
        <button class="x-button x-button--round">
          <span class="x-icon">⌕</span>
        </button>
      </article>

      <article class="x-button--tertiary">
        <h2 class="x-title2">Tertiary</h2>
        <button class="x-button">Tertiary</button>
        <button class="x-button">
          <span class="x-icon">⌕</span>
          <span>Tertiary</span>
        </button>
        <button class="x-button x-button--card">
          <span class="x-icon">⌕</span>
          <span>Tertiary Card</span>
        </button>
        <button class="x-button x-button--pill">
          <span class="x-icon">⌕</span>
          <span>Tertiary Pill</span>
        </button>
        <button class="x-button x-button--round">
          <span class="x-icon">⌕</span>
        </button>
      </article>

      <article class="x-button--ghost">
        <h2 class="x-title2">Ghost</h2>
        <button class="x-button">Ghost</button>
        <button class="x-button">
          <span class="x-icon">⌕</span>
          <span>Ghost</span>
        </button>
        <button class="x-button x-button--card">
          <span class="x-icon">⌕</span>
          <span>Ghost Card</span>
        </button>
        <button class="x-button x-button--pill">
          <span class="x-icon">⌕</span>
          <span>Ghost Pill</span>
        </button>
        <button class="x-button x-button--round">
          <span class="x-icon">⌕</span>
        </button>
      </article>
    </section>

    <section>
      <h1 class="x-title1">Input</h1>

      <article>
        <h2 class="x-title2">Default</h2>
        <input type="text" class="x-input" placeholder="type here" />
      </article>

      <article class="x-input--card">
        <h2 class="x-title2">Card</h2>
        <input type="text" class="x-input" placeholder="type here" />
      </article>

      <article class="x-input--line">
        <h2 class="x-title2">Line</h2>
        <input type="text" class="x-input" placeholder="type here" />
      </article>

      <article class="x-input--pill">
        <h2 class="x-title2">Pill</h2>
        <input type="text" class="x-input" placeholder="type here" />
      </article>
    </section>

    <section>
      <h1 class="x-title1">Input Group</h1>

      <article>
        <h2 class="x-title2">Default</h2>

        <div class="x-input-group">
          <input type="text" class="x-input" placeholder="type here" />
          <button class="x-button">Clear</button>
          <button class="x-button x-input-group__action">
            <span class="x-icon">⌕</span>
          </button>
        </div>

        <div class="x-input-group">
          <span class="x-icon x-input-group__action">⌕</span>
          <input type="text" class="x-input" placeholder="type here" />
          <button class="x-button">Clear</button>
          <button class="x-button x-button--secondary x-input-group__action">Search</button>
        </div>

        <div class="x-input-group">
          <button class="x-button x-button--tertiary x-input-group__action">
            <span class="x-icon">⌕</span>
          </button>
          <input type="text" class="x-input" placeholder="type here" />
          <button class="x-button">Clear</button>
        </div>
      </article>

      <article class="x-input-group--pill">
        <h2 class="x-title2">Pill</h2>

        <div class="x-input-group">
          <input type="text" class="x-input" placeholder="type here" />
          <button class="x-button">Clear</button>
          <button class="x-button x-input-group__action">
            <span class="x-icon">⌕</span>
          </button>
        </div>

        <div class="x-input-group">
          <span class="x-icon x-input-group__action">⌕</span>
          <input type="text" class="x-input" placeholder="type here" />
          <button class="x-button">Clear</button>
          <button class="x-button x-button--secondary x-input-group__action">Search</button>
        </div>

        <div class="x-input-group">
          <button class="x-button x-button--tertiary x-input-group__action">
            <span class="x-icon">⌕</span>
          </button>
          <input type="text" class="x-input" placeholder="type here" />
          <button class="x-button">Clear</button>
        </div>
      </article>

      <article class="x-input-group--card">
        <h2 class="x-title2">Card</h2>

        <div class="x-input-group">
          <input type="text" class="x-input" placeholder="type here" />
          <button class="x-button">Clear</button>
          <button class="x-button x-input-group__action">
            <span class="x-icon">⌕</span>
          </button>
        </div>

        <div class="x-input-group">
          <span class="x-icon x-input-group__action">⌕</span>
          <input type="text" class="x-input" placeholder="type here" />
          <button class="x-button">Clear</button>
          <button class="x-button x-button--secondary x-input-group__action">Search</button>
        </div>

        <div class="x-input-group">
          <button class="x-button x-button--tertiary x-input-group__action">
            <span class="x-icon">⌕</span>
          </button>
          <input type="text" class="x-input" placeholder="type here" />
          <button class="x-button">Clear</button>
        </div>
      </article>

      <article class="x-input-group--line">
        <h2 class="x-title2">Line</h2>

        <div class="x-input-group">
          <input type="text" class="x-input" placeholder="type here" />
          <button class="x-button">Clear</button>
          <button class="x-button x-input-group__action">
            <span class="x-icon">⌕</span>
          </button>
        </div>

        <div class="x-input-group">
          <span class="x-icon x-input-group__action">⌕</span>
          <input type="text" class="x-input" placeholder="type here" />
          <button class="x-button">Clear</button>
          <button class="x-button x-button--secondary x-input-group__action">Search</button>
        </div>

        <div class="x-input-group">
          <button class="x-button x-button--tertiary x-input-group__action">
            <span class="x-icon">⌕</span>
          </button>
          <input type="text" class="x-input" placeholder="type here" />
          <button class="x-button">Clear</button>
        </div>
      </article>
    </section>

    <section>
      <h1 class="x-title1">Filter</h1>

      <article>
        <h2 class="x-title2">Default</h2>

        <div class="x-filter">
          <span class="x-filter__label">Filter value</span>
        </div>

        <div class="x-filter">
          <span class="x-icon">☑</span>
          <span class="x-filter__label">Filter value</span>
        </div>

        <div class="x-filter">
          <span class="x-icon">☑</span>
          <span class="x-filter__label">Filter value</span>
          <span class="x-filter__count">(10)</span>
        </div>

        <div class="x-filter">
          <span class="x-icon">☑</span>
          <span class="x-filter__label">Filter value</span>
          <span class="x-filter__count">(10)</span>
          <span class="x-icon">✓</span>
        </div>

        <div class="x-filter">
          <span class="x-icon">☑</span>
          <span class="x-filter__label">Filter extra large name</span>
          <span class="x-filter__count">(10)</span>
        </div>

        <div class="x-filter">
          <span class="x-icon">☑</span>
          <span class="x-filter__label">Filter extra large name</span>
          <span class="x-filter__count">(10)</span>
          <span class="x-icon">✓</span>
        </div>
      </article>

      <article>
        <h2 class="x-title2">Default Selected</h2>

        <div class="x-filter x-filter--is-selected">
          <span class="x-filter__label">Filter value</span>
        </div>

        <div class="x-filter x-filter--is-selected">
          <span class="x-icon">☑</span>
          <span class="x-filter__label">Filter value</span>
        </div>

        <div class="x-filter x-filter--is-selected">
          <span class="x-icon">☑</span>
          <span class="x-filter__label">Filter value</span>
          <span class="x-filter__count">(10)</span>
        </div>

        <div class="x-filter x-filter--is-selected">
          <span class="x-icon">☑</span>
          <span class="x-filter__label">Filter value</span>
          <span class="x-filter__count">(10)</span>
          <span class="x-icon">✓</span>
        </div>

        <div class="x-filter x-filter--is-selected">
          <span class="x-icon">☑</span>
          <span class="x-filter__label">Filter extra large name</span>
          <span class="x-filter__count">(10)</span>
        </div>

        <div class="x-filter x-filter--is-selected">
          <span class="x-icon">☑</span>
          <span class="x-filter__label">Filter extra large name</span>
          <span class="x-filter__count">(10)</span>
          <span class="x-icon">✓</span>
        </div>
      </article>

      <article class="x-filter--justified">
        <h2 class="x-title2">Justified</h2>

        <div class="x-filter">
          <span class="x-filter__label">Filter value</span>
        </div>

        <div class="x-filter">
          <span class="x-icon">☑</span>
          <span class="x-filter__label">Filter value</span>
        </div>

        <div class="x-filter">
          <span class="x-icon">☑</span>
          <span class="x-filter__label">Filter value</span>
          <span class="x-filter__count">(10)</span>
        </div>

        <div class="x-filter">
          <span class="x-icon">☑</span>
          <span class="x-filter__label">Filter value</span>
          <span class="x-filter__count">(10)</span>
          <span class="x-icon">✓</span>
        </div>

        <div class="x-filter">
          <span class="x-icon">☑</span>
          <span class="x-filter__label">Filter extra large name</span>
          <span class="x-filter__count">(10)</span>
        </div>

        <div class="x-filter">
          <span class="x-icon">☑</span>
          <span class="x-filter__label">Filter extra large name</span>
          <span class="x-filter__count">(10)</span>
          <span class="x-icon">✓</span>
        </div>
      </article>

      <article class="x-filter--justified">
        <h2 class="x-title2">Justified Selected</h2>

        <div class="x-filter x-filter--is-selected">
          <span class="x-filter__label">Filter value</span>
        </div>

        <div class="x-filter x-filter--is-selected">
          <span class="x-icon">☑</span>
          <span class="x-filter__label">Filter value</span>
        </div>

        <div class="x-filter x-filter--is-selected">
          <span class="x-icon">☑</span>
          <span class="x-filter__label">Filter value</span>
          <span class="x-filter__count">(10)</span>
        </div>

        <div class="x-filter x-filter--is-selected">
          <span class="x-icon">☑</span>
          <span class="x-filter__label">Filter value</span>
          <span class="x-filter__count">(10)</span>
          <span class="x-icon">✓</span>
        </div>

        <div class="x-filter x-filter--is-selected">
          <span class="x-icon">☑</span>
          <span class="x-filter__label">Filter extra large name</span>
          <span class="x-filter__count">(10)</span>
        </div>

        <div class="x-filter x-filter--is-selected">
          <span class="x-icon">☑</span>
          <span class="x-filter__label">Filter extra large name</span>
          <span class="x-filter__count">(10)</span>
          <span class="x-icon">✓</span>
        </div>
      </article>

      <article>
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
            <span class="x-icon">☑</span>
            <span class="x-filter__label">Parent Filter</span>
          </div>
          <ul class="x-hierarchical-filter__children">
            <li class="x-hierarchical-filter-container">
              <div class="x-filter x-hierarchical-filter">
                <span class="x-icon">☑</span>
                <span class="x-filter__label">Child Filter 1</span>
              </div>
            </li>
            <li class="x-hierarchical-filter-container">
              <div class="x-filter x-hierarchical-filter x-filter--is-selected">
                <span class="x-icon">☑</span>
                <span class="x-filter__label">Child Filter 2</span>
              </div>
              <ul class="x-hierarchical-filter__children">
                <li class="x-hierarchical-filter-container">
                  <div class="x-filter x-hierarchical-filter">
                    <span class="x-icon">☑</span>
                    <span class="x-filter__label">Child Filter 1</span>
                  </div>
                </li>
                <li class="x-hierarchical-filter-container">
                  <div class="x-filter x-hierarchical-filter x-filter--is-selected">
                    <span class="x-icon">☑</span>
                    <span class="x-filter__label">Child Filter 2</span>
                  </div>
                </li>
                <li class="x-hierarchical-filter-container">
                  <div class="x-filter x-hierarchical-filter">
                    <span class="x-icon">☑</span>
                    <span class="x-filter__label">Child Filter 3</span>
                  </div>
                </li>
              </ul>
            </li>
            <li class="x-hierarchical-filter-container">
              <div class="x-filter x-hierarchical-filter">
                <span class="x-icon">☑</span>
                <span class="x-filter__label">Child Filter 3</span>
              </div>
            </li>
          </ul>
        </div>

        <div class="x-hierarchical-filter-container">
          <div class="x-filter x-hierarchical-filter x-filter--is-selected">
            <span class="x-icon">☑</span>
            <span class="x-filter__label">Parent Filter</span>
            <span class="x-filter__count">(10)</span>
          </div>
          <ul class="x-hierarchical-filter__children">
            <li class="x-hierarchical-filter-container">
              <div class="x-filter x-hierarchical-filter">
                <span class="x-icon">☑</span>
                <span class="x-filter__label">Child Filter 1</span>
                <span class="x-filter__count">(10)</span>
              </div>
            </li>
            <li class="x-hierarchical-filter-container">
              <div class="x-filter x-hierarchical-filter x-filter--is-selected">
                <span class="x-icon">☑</span>
                <span class="x-filter__label">Child Filter 2</span>
                <span class="x-filter__count">(10)</span>
              </div>
              <ul class="x-hierarchical-filter__children">
                <li class="x-hierarchical-filter-container">
                  <div class="x-filter x-hierarchical-filter">
                    <span class="x-icon">☑</span>
                    <span class="x-filter__label">Child Filter 1</span>
                    <span class="x-filter__count">(10)</span>
                  </div>
                </li>
                <li class="x-hierarchical-filter-container">
                  <div class="x-filter x-hierarchical-filter x-filter--is-selected">
                    <span class="x-icon">☑</span>
                    <span class="x-filter__label">Child Filter 2</span>
                    <span class="x-filter__count">(10)</span>
                  </div>
                </li>
                <li class="x-hierarchical-filter-container">
                  <div class="x-filter x-hierarchical-filter">
                    <span class="x-icon">☑</span>
                    <span class="x-filter__label">Child Filter 3</span>
                    <span class="x-filter__count">(10)</span>
                  </div>
                </li>
              </ul>
            </li>
            <li class="x-hierarchical-filter-container">
              <div class="x-filter x-hierarchical-filter">
                <span class="x-icon">☑</span>
                <span class="x-filter__label">Child Filter 3</span>
                <span class="x-filter__count">(10)</span>
              </div>
            </li>
          </ul>
        </div>

        <div class="x-hierarchical-filter-container">
          <div class="x-filter x-hierarchical-filter x-filter--is-selected">
            <span class="x-icon">☑</span>
            <span class="x-filter__label">Parent Filter</span>
            <span class="x-filter__count">(10)</span>
            <span class="x-icon">✓</span>
          </div>
          <ul class="x-hierarchical-filter__children">
            <li class="x-hierarchical-filter-container">
              <div class="x-filter x-hierarchical-filter">
                <span class="x-icon">☑</span>
                <span class="x-filter__label">Child Filter 1</span>
                <span class="x-filter__count">(10)</span>
                <span class="x-icon">✓</span>
              </div>
            </li>
            <li class="x-hierarchical-filter-container">
              <div class="x-filter x-hierarchical-filter x-filter--is-selected">
                <span class="x-icon">☑</span>
                <span class="x-filter__label">Child Filter 2</span>
                <span class="x-filter__count">(10)</span>
                <span class="x-icon">✓</span>
              </div>
              <ul class="x-hierarchical-filter__children">
                <li class="x-hierarchical-filter-container">
                  <div class="x-filter x-hierarchical-filter">
                    <span class="x-icon">☑</span>
                    <span class="x-filter__label">Child Filter 1</span>
                    <span class="x-filter__count">(10)</span>
                    <span class="x-icon">✓</span>
                  </div>
                </li>
                <li class="x-hierarchical-filter-container">
                  <div class="x-filter x-hierarchical-filter x-filter--is-selected">
                    <span class="x-icon">☑</span>
                    <span class="x-filter__label">Child Filter 2</span>
                    <span class="x-filter__count">(10)</span>
                    <span class="x-icon">✓</span>
                  </div>
                </li>
                <li class="x-hierarchical-filter-container">
                  <div class="x-filter x-hierarchical-filter">
                    <span class="x-icon">☑</span>
                    <span class="x-filter__label">Child Filter 3</span>
                    <span class="x-filter__count">(10)</span>
                    <span class="x-icon">✓</span>
                  </div>
                </li>
              </ul>
            </li>
            <li class="x-hierarchical-filter-container">
              <div class="x-filter x-hierarchical-filter">
                <span class="x-icon">☑</span>
                <span class="x-filter__label">Child Filter 3</span>
                <span class="x-filter__count">(10)</span>
                <span class="x-icon">✓</span>
              </div>
            </li>
          </ul>
        </div>

        <div class="x-hierarchical-filter-container">
          <div class="x-filter x-hierarchical-filter x-filter--is-selected">
            <span class="x-icon">☑</span>
            <span class="x-filter__label">Parent Filter extra large name</span>
            <span class="x-filter__count">(10)</span>
          </div>
          <ul class="x-hierarchical-filter__children">
            <li class="x-hierarchical-filter-container">
              <div class="x-filter x-hierarchical-filter">
                <span class="x-icon">☑</span>
                <span class="x-filter__label">Child Filter 1 extra large name</span>
                <span class="x-filter__count">(10)</span>
              </div>
            </li>
            <li class="x-hierarchical-filter-container">
              <div class="x-filter x-hierarchical-filter x-filter--is-selected">
                <span class="x-icon">☑</span>
                <span class="x-filter__label">Child Filter 2 extra large name</span>
                <span class="x-filter__count">(10)</span>
              </div>
              <ul class="x-hierarchical-filter__children">
                <li class="x-hierarchical-filter-container">
                  <div class="x-filter x-hierarchical-filter">
                    <span class="x-icon">☑</span>
                    <span class="x-filter__label">Child Filter 1 extra large name</span>
                    <span class="x-filter__count">(10)</span>
                  </div>
                </li>
                <li class="x-hierarchical-filter-container">
                  <div class="x-filter x-hierarchical-filter x-filter--is-selected">
                    <span class="x-icon">☑</span>
                    <span class="x-filter__label">Child Filter 2 extra large name</span>
                    <span class="x-filter__count">(10)</span>
                  </div>
                </li>
                <li class="x-hierarchical-filter-container">
                  <div class="x-filter x-hierarchical-filter">
                    <span class="x-icon">☑</span>
                    <span class="x-filter__label">Child Filter 3 extra large name</span>
                    <span class="x-filter__count">(10)</span>
                  </div>
                </li>
              </ul>
            </li>
            <li class="x-hierarchical-filter-container">
              <div class="x-filter x-hierarchical-filter">
                <span class="x-icon">☑</span>
                <span class="x-filter__label">Child Filter 3 extra large name</span>
                <span class="x-filter__count">(10)</span>
              </div>
            </li>
          </ul>
        </div>

        <div class="x-hierarchical-filter-container">
          <div class="x-filter x-hierarchical-filter x-filter--is-selected">
            <span class="x-icon">☑</span>
            <span class="x-filter__label">Parent Filter extra large name</span>
            <span class="x-filter__count">(10)</span>
            <span class="x-icon">✓</span>
          </div>
          <ul class="x-hierarchical-filter__children">
            <li class="x-hierarchical-filter-container">
              <div class="x-filter x-hierarchical-filter">
                <span class="x-icon">☑</span>
                <span class="x-filter__label">Child Filter 1 extra large name</span>
                <span class="x-filter__count">(10)</span>
                <span class="x-icon">✓</span>
              </div>
            </li>
            <li class="x-hierarchical-filter-container">
              <div class="x-filter x-hierarchical-filter x-filter--is-selected">
                <span class="x-icon">☑</span>
                <span class="x-filter__label">Child Filter 2 extra large name</span>
                <span class="x-filter__count">(10)</span>
                <span class="x-icon">✓</span>
              </div>
              <ul class="x-hierarchical-filter__children">
                <li class="x-hierarchical-filter-container">
                  <div class="x-filter x-hierarchical-filter">
                    <span class="x-icon">☑</span>
                    <span class="x-filter__label">Child Filter 1 extra large name</span>
                    <span class="x-filter__count">(10)</span>
                    <span class="x-icon">✓</span>
                  </div>
                </li>
                <li class="x-hierarchical-filter-container">
                  <div class="x-filter x-hierarchical-filter x-filter--is-selected">
                    <span class="x-icon">☑</span>
                    <span class="x-filter__label">Child Filter 2 extra large name</span>
                    <span class="x-filter__count">(10)</span>
                    <span class="x-icon">✓</span>
                  </div>
                </li>
                <li class="x-hierarchical-filter-container">
                  <div class="x-filter x-hierarchical-filter">
                    <span class="x-icon">☑</span>
                    <span class="x-filter__label">Child Filter 3 extra large name</span>
                    <span class="x-filter__count">(10)</span>
                    <span class="x-icon">✓</span>
                  </div>
                </li>
              </ul>
            </li>
            <li class="x-hierarchical-filter-container">
              <div class="x-filter x-hierarchical-filter">
                <span class="x-icon">☑</span>
                <span class="x-filter__label">Child Filter 3 extra large name</span>
                <span class="x-filter__count">(10)</span>
                <span class="x-icon">✓</span>
              </div>
            </li>
          </ul>
        </div>
      </article>

      <article class="x-filter--justified">
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
            <span class="x-icon">☑</span>
            <span class="x-filter__label">Parent Filter</span>
          </div>
          <ul class="x-hierarchical-filter__children">
            <li class="x-hierarchical-filter-container">
              <div class="x-filter x-hierarchical-filter">
                <span class="x-icon">☑</span>
                <span class="x-filter__label">Child Filter 1</span>
              </div>
            </li>
            <li class="x-hierarchical-filter-container">
              <div class="x-filter x-hierarchical-filter x-filter--is-selected">
                <span class="x-icon">☑</span>
                <span class="x-filter__label">Child Filter 2</span>
              </div>
              <ul class="x-hierarchical-filter__children">
                <li class="x-hierarchical-filter-container">
                  <div class="x-filter x-hierarchical-filter">
                    <span class="x-icon">☑</span>
                    <span class="x-filter__label">Child Filter 1</span>
                  </div>
                </li>
                <li class="x-hierarchical-filter-container">
                  <div class="x-filter x-hierarchical-filter x-filter--is-selected">
                    <span class="x-icon">☑</span>
                    <span class="x-filter__label">Child Filter 2</span>
                  </div>
                </li>
                <li class="x-hierarchical-filter-container">
                  <div class="x-filter x-hierarchical-filter">
                    <span class="x-icon">☑</span>
                    <span class="x-filter__label">Child Filter 3</span>
                  </div>
                </li>
              </ul>
            </li>
            <li class="x-hierarchical-filter-container">
              <div class="x-filter x-hierarchical-filter">
                <span class="x-icon">☑</span>
                <span class="x-filter__label">Child Filter 3</span>
              </div>
            </li>
          </ul>
        </div>

        <div class="x-hierarchical-filter-container">
          <div class="x-filter x-hierarchical-filter x-filter--is-selected">
            <span class="x-icon">☑</span>
            <span class="x-filter__label">Parent Filter</span>
            <span class="x-filter__count">(10)</span>
          </div>
          <ul class="x-hierarchical-filter__children">
            <li class="x-hierarchical-filter-container">
              <div class="x-filter x-hierarchical-filter">
                <span class="x-icon">☑</span>
                <span class="x-filter__label">Child Filter 1</span>
                <span class="x-filter__count">(10)</span>
              </div>
            </li>
            <li class="x-hierarchical-filter-container">
              <div class="x-filter x-hierarchical-filter x-filter--is-selected">
                <span class="x-icon">☑</span>
                <span class="x-filter__label">Child Filter 2</span>
                <span class="x-filter__count">(10)</span>
              </div>
              <ul class="x-hierarchical-filter__children">
                <li class="x-hierarchical-filter-container">
                  <div class="x-filter x-hierarchical-filter">
                    <span class="x-icon">☑</span>
                    <span class="x-filter__label">Child Filter 1</span>
                    <span class="x-filter__count">(10)</span>
                  </div>
                </li>
                <li class="x-hierarchical-filter-container">
                  <div class="x-filter x-hierarchical-filter x-filter--is-selected">
                    <span class="x-icon">☑</span>
                    <span class="x-filter__label">Child Filter 2</span>
                    <span class="x-filter__count">(10)</span>
                  </div>
                </li>
                <li class="x-hierarchical-filter-container">
                  <div class="x-filter x-hierarchical-filter">
                    <span class="x-icon">☑</span>
                    <span class="x-filter__label">Child Filter 3</span>
                    <span class="x-filter__count">(10)</span>
                  </div>
                </li>
              </ul>
            </li>
            <li class="x-hierarchical-filter-container">
              <div class="x-filter x-hierarchical-filter">
                <span class="x-icon">☑</span>
                <span class="x-filter__label">Child Filter 3</span>
                <span class="x-filter__count">(10)</span>
              </div>
            </li>
          </ul>
        </div>

        <div class="x-hierarchical-filter-container">
          <div class="x-filter x-hierarchical-filter x-filter--is-selected">
            <span class="x-icon">☑</span>
            <span class="x-filter__label">Parent Filter</span>
            <span class="x-filter__count">(10)</span>
            <span class="x-icon">✓</span>
          </div>
          <ul class="x-hierarchical-filter__children">
            <li class="x-hierarchical-filter-container">
              <div class="x-filter x-hierarchical-filter">
                <span class="x-icon">☑</span>
                <span class="x-filter__label">Child Filter 1</span>
                <span class="x-filter__count">(10)</span>
                <span class="x-icon">✓</span>
              </div>
            </li>
            <li class="x-hierarchical-filter-container">
              <div class="x-filter x-hierarchical-filter x-filter--is-selected">
                <span class="x-icon">☑</span>
                <span class="x-filter__label">Child Filter 2</span>
                <span class="x-filter__count">(10)</span>
                <span class="x-icon">✓</span>
              </div>
              <ul class="x-hierarchical-filter__children">
                <li class="x-hierarchical-filter-container">
                  <div class="x-filter x-hierarchical-filter">
                    <span class="x-icon">☑</span>
                    <span class="x-filter__label">Child Filter 1</span>
                    <span class="x-filter__count">(10)</span>
                    <span class="x-icon">✓</span>
                  </div>
                </li>
                <li class="x-hierarchical-filter-container">
                  <div class="x-filter x-hierarchical-filter x-filter--is-selected">
                    <span class="x-icon">☑</span>
                    <span class="x-filter__label">Child Filter 2</span>
                    <span class="x-filter__count">(10)</span>
                    <span class="x-icon">✓</span>
                  </div>
                </li>
                <li class="x-hierarchical-filter-container">
                  <div class="x-filter x-hierarchical-filter">
                    <span class="x-icon">☑</span>
                    <span class="x-filter__label">Child Filter 3</span>
                    <span class="x-filter__count">(10)</span>
                    <span class="x-icon">✓</span>
                  </div>
                </li>
              </ul>
            </li>
            <li class="x-hierarchical-filter-container">
              <div class="x-filter x-hierarchical-filter">
                <span class="x-icon">☑</span>
                <span class="x-filter__label">Child Filter 3</span>
                <span class="x-filter__count">(10)</span>
                <span class="x-icon">✓</span>
              </div>
            </li>
          </ul>
        </div>

        <div class="x-hierarchical-filter-container">
          <div class="x-filter x-hierarchical-filter x-filter--is-selected">
            <span class="x-icon">☑</span>
            <span class="x-filter__label">Parent Filter extra large name</span>
            <span class="x-filter__count">(10)</span>
          </div>
          <ul class="x-hierarchical-filter__children">
            <li class="x-hierarchical-filter-container">
              <div class="x-filter x-hierarchical-filter">
                <span class="x-icon">☑</span>
                <span class="x-filter__label">Child Filter 1 extra large name</span>
                <span class="x-filter__count">(10)</span>
              </div>
            </li>
            <li class="x-hierarchical-filter-container">
              <div class="x-filter x-hierarchical-filter x-filter--is-selected">
                <span class="x-icon">☑</span>
                <span class="x-filter__label">Child Filter 2 extra large name</span>
                <span class="x-filter__count">(10)</span>
              </div>
              <ul class="x-hierarchical-filter__children">
                <li class="x-hierarchical-filter-container">
                  <div class="x-filter x-hierarchical-filter">
                    <span class="x-icon">☑</span>
                    <span class="x-filter__label">Child Filter 1 extra large name</span>
                    <span class="x-filter__count">(10)</span>
                  </div>
                </li>
                <li class="x-hierarchical-filter-container">
                  <div class="x-filter x-hierarchical-filter x-filter--is-selected">
                    <span class="x-icon">☑</span>
                    <span class="x-filter__label">Child Filter 2 extra large name</span>
                    <span class="x-filter__count">(10)</span>
                  </div>
                </li>
                <li class="x-hierarchical-filter-container">
                  <div class="x-filter x-hierarchical-filter">
                    <span class="x-icon">☑</span>
                    <span class="x-filter__label">Child Filter 3 extra large name</span>
                    <span class="x-filter__count">(10)</span>
                  </div>
                </li>
              </ul>
            </li>
            <li class="x-hierarchical-filter-container">
              <div class="x-filter x-hierarchical-filter">
                <span class="x-icon">☑</span>
                <span class="x-filter__label">Child Filter 3 extra large name</span>
                <span class="x-filter__count">(10)</span>
              </div>
            </li>
          </ul>
        </div>

        <div class="x-hierarchical-filter-container">
          <div class="x-filter x-hierarchical-filter x-filter--is-selected">
            <span class="x-icon">☑</span>
            <span class="x-filter__label">Parent Filter extra large name</span>
            <span class="x-filter__count">(10)</span>
            <span class="x-icon">✓</span>
          </div>
          <ul class="x-hierarchical-filter__children">
            <li class="x-hierarchical-filter-container">
              <div class="x-filter x-hierarchical-filter">
                <span class="x-icon">☑</span>
                <span class="x-filter__label">Child Filter 1 extra large name</span>
                <span class="x-filter__count">(10)</span>
                <span class="x-icon">✓</span>
              </div>
            </li>
            <li class="x-hierarchical-filter-container">
              <div class="x-filter x-hierarchical-filter x-filter--is-selected">
                <span class="x-icon">☑</span>
                <span class="x-filter__label">Child Filter 2 extra large name</span>
                <span class="x-filter__count">(10)</span>
                <span class="x-icon">✓</span>
              </div>
              <ul class="x-hierarchical-filter__children">
                <li class="x-hierarchical-filter-container">
                  <div class="x-filter x-hierarchical-filter">
                    <span class="x-icon">☑</span>
                    <span class="x-filter__label">Child Filter 1 extra large name</span>
                    <span class="x-filter__count">(10)</span>
                    <span class="x-icon">✓</span>
                  </div>
                </li>
                <li class="x-hierarchical-filter-container">
                  <div class="x-filter x-hierarchical-filter x-filter--is-selected">
                    <span class="x-icon">☑</span>
                    <span class="x-filter__label">Child Filter 2 extra large name</span>
                    <span class="x-filter__count">(10)</span>
                    <span class="x-icon">✓</span>
                  </div>
                </li>
                <li class="x-hierarchical-filter-container">
                  <div class="x-filter x-hierarchical-filter">
                    <span class="x-icon">☑</span>
                    <span class="x-filter__label">Child Filter 3 extra large name</span>
                    <span class="x-filter__count">(10)</span>
                    <span class="x-icon">✓</span>
                  </div>
                </li>
              </ul>
            </li>
            <li class="x-hierarchical-filter-container">
              <div class="x-filter x-hierarchical-filter">
                <span class="x-icon">☑</span>
                <span class="x-filter__label">Child Filter 3 extra large name</span>
                <span class="x-filter__count">(10)</span>
                <span class="x-icon">✓</span>
              </div>
            </li>
          </ul>
        </div>
      </article>
    </section>

    <section>
      <h1 class="x-title1">Facet</h1>

      <article>
        <h2 class="x-title2">Default</h2>

        <div class="x-facet">
          <button>
            <span>Facet title</span>
            <span class="x-icon">▾</span>
          </button>
          <div>
            <pre style="height: 100%; text-align: center; vertical-align: center">&lt;slot&gt;</pre>
          </div>
        </div>

        <div class="x-facet">
          <button>
            <span>Facet title Extra Large Name</span>
            <span class="x-icon">▾</span>
          </button>
          <div>
            <pre style="height: 100%; text-align: center; vertical-align: center">&lt;slot&gt;</pre>
          </div>
        </div>

        <div class="x-facet">
          <button>
            <span class="x-icon">▾</span>
            <span>Facet title</span>
          </button>
          <div>
            <pre style="height: 100%; text-align: center; vertical-align: center">&lt;slot&gt;</pre>
          </div>
        </div>

        <div class="x-facet">
          <button>
            <span class="x-icon">▾</span>
            <span>Facet title Extra Large Name</span>
          </button>
          <div>
            <pre style="height: 100%; text-align: center; vertical-align: center">&lt;slot&gt;</pre>
          </div>
        </div>
      </article>

      <article class="x-facet--outlined">
        <h2 class="x-title2">Outlined</h2>

        <div class="x-facet">
          <button>
            <span>Facet title</span>
            <span class="x-icon">▾</span>
          </button>
          <div>
            <pre style="height: 100%; text-align: center; vertical-align: center">&lt;slot&gt;</pre>
          </div>
        </div>

        <div class="x-facet">
          <button>
            <span>Facet title Extra Large Name</span>
            <span class="x-icon">▾</span>
          </button>
          <div>
            <pre style="height: 100%; text-align: center; vertical-align: center">&lt;slot&gt;</pre>
          </div>
        </div>

        <div class="x-facet">
          <button>
            <span class="x-icon">▾</span>
            <span>Facet title</span>
          </button>
          <div>
            <pre style="height: 100%; text-align: center; vertical-align: center">&lt;slot&gt;</pre>
          </div>
        </div>

        <div class="x-facet">
          <button>
            <span class="x-icon">▾</span>
            <span>Facet title Extra Large Name</span>
          </button>
          <div>
            <pre style="height: 100%; text-align: center; vertical-align: center">&lt;slot&gt;</pre>
          </div>
        </div>
      </article>

      <article class="x-facet--line">
        <h2 class="x-title2">Line</h2>

        <div class="x-facet">
          <button>
            <span>Facet title</span>
            <span class="x-icon">▾</span>
          </button>
          <div>
            <pre style="height: 100%; text-align: center; vertical-align: center">&lt;slot&gt;</pre>
          </div>
        </div>

        <div class="x-facet">
          <button>
            <span>Facet title Extra Large Name</span>
            <span class="x-icon">▾</span>
          </button>
          <div>
            <pre style="height: 100%; text-align: center; vertical-align: center">&lt;slot&gt;</pre>
          </div>
        </div>

        <div class="x-facet">
          <button>
            <span class="x-icon">▾</span>
            <span>Facet title</span>
          </button>
          <div>
            <pre style="height: 100%; text-align: center; vertical-align: center">&lt;slot&gt;</pre>
          </div>
        </div>

        <div class="x-facet">
          <button>
            <span class="x-icon">▾</span>
            <span>Facet title Extra Large Name</span>
          </button>
          <div>
            <pre style="height: 100%; text-align: center; vertical-align: center">&lt;slot&gt;</pre>
          </div>
        </div>
      </article>

      <article class="x-facet--card">
        <h2 class="x-title2">Card</h2>

        <div class="x-facet">
          <button>
            <span>Facet title</span>
            <span class="x-icon">▾</span>
          </button>
          <div>
            <pre style="height: 100%; text-align: center; vertical-align: center">&lt;slot&gt;</pre>
          </div>
        </div>

        <div class="x-facet">
          <button>
            <span>Facet title Extra Large Name</span>
            <span class="x-icon">▾</span>
          </button>
          <div>
            <pre style="height: 100%; text-align: center; vertical-align: center">&lt;slot&gt;</pre>
          </div>
        </div>

        <div class="x-facet">
          <button>
            <span class="x-icon">▾</span>
            <span>Facet title</span>
          </button>
          <div>
            <pre style="height: 100%; text-align: center; vertical-align: center">&lt;slot&gt;</pre>
          </div>
        </div>

        <div class="x-facet">
          <button>
            <span class="x-icon">▾</span>
            <span>Facet title Extra Large Name</span>
          </button>
          <div>
            <pre style="height: 100%; text-align: center; vertical-align: center">&lt;slot&gt;</pre>
          </div>
        </div>
      </article>

      <article>
        <h2 class="x-title2">Combinations</h2>

        <div class="x-facet x-facet--outlined x-facet--line">
          <button>
            <span>Facet Outlined + Line</span>
            <span class="x-icon">▾</span>
          </button>
          <div>
            <pre style="height: 100%; text-align: center; vertical-align: center">&lt;slot&gt;</pre>
          </div>
        </div>

        <div class="x-facet x-facet--outlined x-facet--card">
          <button>
            <span>Facet Outlined + Card</span>
            <span class="x-icon">▾</span>
          </button>
          <div>
            <pre style="height: 100%; text-align: center; vertical-align: center">&lt;slot&gt;</pre>
          </div>
        </div>

        <div class="x-facet x-facet--line x-facet--card">
          <button>
            <span>Facet Line + Card</span>
            <span class="x-icon">▾</span>
          </button>
          <div>
            <pre style="height: 100%; text-align: center; vertical-align: center">&lt;slot&gt;</pre>
          </div>
        </div>

        <div class="x-facet x-facet--outlined x-facet--line x-facet--card">
          <button>
            <span>Facet Outlined + Line + Card</span>
            <span class="x-icon">▾</span>
          </button>
          <div>
            <pre style="height: 100%; text-align: center; vertical-align: center">&lt;slot&gt;</pre>
          </div>
        </div>
      </article>
    </section>

    <section>
      <h1 class="x-title1">Suggestion</h1>

      <article>
        <h2 class="x-title2">Default</h2>

        <div class="x-suggestion">
          <span class="x-suggestion__query">
            Suggestion
            <span class="x-suggestion__matching-part">Query</span>
          </span>
        </div>

        <div class="x-suggestion">
          <span class="x-icon">⌕</span>
          <span class="x-suggestion__query">
            Suggestion
            <span class="x-suggestion__matching-part">Query</span>
          </span>
        </div>

        <div class="x-suggestion">
          <span class="x-suggestion__query">
            Suggestion
            <span class="x-suggestion__matching-part">Query</span>
          </span>
          <span class="x-icon">⌕</span>
        </div>

        <div class="x-suggestion">
          <span class="x-icon">⌕</span>
          <span class="x-suggestion__query">
            Suggestion extra large name
            <span class="x-suggestion__matching-part">Query</span>
          </span>
        </div>

        <div class="x-suggestion">
          <span class="x-suggestion__query">
            Suggestion extra large name
            <span class="x-suggestion__matching-part">Query</span>
          </span>
          <span class="x-icon">⌕</span>
        </div>
      </article>
    </section>

    <section>
      <h1 class="x-title1">Suggestion Group</h1>

      <article>
        <h2 class="x-title2">Default</h2>

        <div class="x-suggestion-group">
          <div class="x-suggestion">
            <span class="x-suggestion__query">
              Suggestion
              <span class="x-suggestion__matching-part">Query</span>
            </span>
          </div>
          <button class="x-button">
            <span class="x-icon">✗</span>
          </button>
        </div>

        <div class="x-suggestion-group">
          <button class="x-button">
            <span class="x-icon">✗</span>
          </button>
          <div class="x-suggestion">
            <span class="x-suggestion__query">
              Suggestion
              <span class="x-suggestion__matching-part">Query</span>
            </span>
          </div>
        </div>

        <div class="x-suggestion-group">
          <div class="x-suggestion">
            <span class="x-icon">⌕</span>
            <span class="x-suggestion__query">
              Suggestion
              <span class="x-suggestion__matching-part">Query</span>
            </span>
          </div>
          <button class="x-button">
            <span class="x-icon">✗</span>
          </button>
        </div>

        <div class="x-suggestion-group">
          <button class="x-button">
            <span class="x-icon">✗</span>
          </button>
          <div class="x-suggestion">
            <span class="x-suggestion__query">
              Suggestion
              <span class="x-suggestion__matching-part">Query</span>
            </span>
            <span class="x-icon">⌕</span>
          </div>
        </div>

        <div class="x-suggestion-group">
          <button class="x-button">
            <span class="x-icon">✗</span>
          </button>
          <div class="x-suggestion">
            <span class="x-suggestion__query">
              Suggestion extra large name
              <span class="x-suggestion__matching-part">Query</span>
            </span>
            <span class="x-icon">⌕</span>
          </div>
        </div>
      </article>
    </section>

    <section>
      <h1 class="x-title1">Tags</h1>
      <article>
        <h2 class="x-title2">Default</h2>
        <div class="x-tag">
          <span class="x-icon">＋</span>
          <span>text tag</span>
        </div>
        <div class="x-tag">
          <span class="x-icon">＋</span>
          <span>text tag extra large name</span>
        </div>
        <div class="x-tag">
          <span>text tag</span>
        </div>
        <div class="x-tag">
          <span>text tag extra large name</span>
        </div>
      </article>
      <article>
        <h2 class="x-title2">Default Selected</h2>
        <div class="x-tag x-tag--is-selected">
          <span class="x-icon">＋</span>
          <span>text tag</span>
        </div>
        <div class="x-tag x-tag--is-selected">
          <span class="x-icon">＋</span>
          <span>text tag extra large name</span>
        </div>
        <div class="x-tag x-tag--is-selected">
          <span>text tag</span>
        </div>
        <div class="x-tag x-tag--is-selected">
          <span>text tag extra large name</span>
        </div>
      </article>
      <article>
        <h2 class="x-title2">Card</h2>
        <div class="x-tag x-tag--card">
          <span class="x-icon">＋</span>
          <span>text tag</span>
        </div>
        <div class="x-tag x-tag--card">
          <span class="x-icon">＋</span>
          <span>text tag extra large name</span>
        </div>
        <div class="x-tag x-tag--card">
          <span>text tag</span>
        </div>
        <div class="x-tag x-tag--card">
          <span>text tag extra large name</span>
        </div>
      </article>
      <article>
        <h2 class="x-title2">Card Selected</h2>
        <div class="x-tag x-tag--card x-tag--is-selected">
          <span class="x-icon">＋</span>
          <span>text tag</span>
        </div>
        <div class="x-tag x-tag--card x-tag--is-selected">
          <span class="x-icon">＋</span>
          <span>text tag extra large name</span>
        </div>
        <div class="x-tag x-tag--card x-tag--is-selected">
          <span>text tag</span>
        </div>
        <div class="x-tag x-tag--card x-tag--is-selected">
          <span>text tag extra large name</span>
        </div>
      </article>
      <article>
        <h2 class="x-title2">Pill</h2>
        <div class="x-tag x-tag--pill">
          <span class="x-icon">＋</span>
          <span>text tag</span>
        </div>
        <div class="x-tag x-tag--pill">
          <span class="x-icon">＋</span>
          <span>text tag extra large name</span>
        </div>
        <div class="x-tag x-tag--pill">
          <span>text tag</span>
        </div>
        <div class="x-tag x-tag--pill">
          <span>text tag extra large name</span>
        </div>
        <div class="x-tag x-tag--pill">
          <span>1</span>
        </div>
      </article>
      <article>
        <h2 class="x-title2">Pill Selected</h2>
        <div class="x-tag x-tag--pill x-tag--is-selected">
          <span class="x-icon">＋</span>
          <span>text tag</span>
        </div>
        <div class="x-tag x-tag--pill x-tag--is-selected">
          <span class="x-icon">＋</span>
          <span>text tag extra large name</span>
        </div>
        <div class="x-tag x-tag--pill x-tag--is-selected">
          <span>text tag</span>
        </div>
        <div class="x-tag x-tag--pill x-tag--is-selected">
          <span>text tag extra large name</span>
        </div>
        <div class="x-tag x-tag--pill x-tag--is-selected">
          <span>1</span>
        </div>
      </article>
      <article>
        <h2 class="x-title2">Ghost</h2>
        <div class="x-tag x-tag--ghost">
          <span class="x-icon">＋</span>
          <span>text tag</span>
        </div>
        <div class="x-tag x-tag--ghost">
          <span class="x-icon">＋</span>
          <span>text tag extra large name</span>
        </div>
        <div class="x-tag x-tag--ghost">
          <span>text tag</span>
        </div>
        <div class="x-tag x-tag--ghost">
          <span>text tag extra large name</span>
        </div>
      </article>
      <article>
        <h2 class="x-title2">Ghost Selected</h2>
        <div class="x-tag x-tag--ghost x-tag--is-selected">
          <span class="x-icon">＋</span>
          <span>text tag</span>
        </div>
        <div class="x-tag x-tag--ghost x-tag--is-selected">
          <span class="x-icon">＋</span>
          <span>text tag extra large name</span>
        </div>
        <div class="x-tag x-tag--ghost x-tag--is-selected">
          <span>text tag</span>
        </div>
        <div class="x-tag x-tag--ghost x-tag--is-selected">
          <span>text tag extra large name</span>
        </div>
      </article>
    </section>

    <section class="row">
      <h1 class="x-title1">Dropdown</h1>

      <article class="x-dropdown-show-case">
        <h2 class="x-title2">Default</h2>

        <div class="x-dropdown">
          <button class="x-dropdown__toggle">
            Sort by
            <span class="x-dropdown__toggle-selected-value">Relevance</span>
            <span class="x-icon">▾</span>
          </button>
        </div>
        <div class="x-dropdown x-dropdown--is-open">
          <button class="x-dropdown__toggle">
            Sort by
            <span class="x-dropdown__toggle-selected-value">Relevance</span>
            <span class="x-icon">▾</span>
          </button>
          <div class="x-dropdown__items-list">
            <button class="x-dropdown__item x-dropdown__item--is-selected">
              Relevance
              <span class="x-icon">✓</span>
            </button>
            <button class="x-dropdown__item">Alphabetical</button>
            <button class="x-dropdown__item">Price</button>
          </div>
        </div>
      </article>

      <article class="x-dropdown-show-case">
        <h2 class="x-title2">Card</h2>

        <div class="x-dropdown x-dropdown--card">
          <button class="x-dropdown__toggle">
            Sort by
            <span class="x-dropdown__toggle-selected-value">Relevance</span>
            <span class="x-icon">▾</span>
          </button>
        </div>
        <div class="x-dropdown x-dropdown--is-open x-dropdown--card">
          <button class="x-dropdown__toggle">
            Sort by
            <span class="x-dropdown__toggle-selected-value">Relevance</span>
            <span class="x-icon">▾</span>
          </button>
          <div class="x-dropdown__items-list">
            <button class="x-dropdown__item x-dropdown__item--is-selected">
              Relevance
              <span class="x-icon">✓</span>
            </button>
            <button class="x-dropdown__item">Alphabetical</button>
            <button class="x-dropdown__item">Price</button>
          </div>
        </div>
      </article>

      <article class="x-dropdown-show-case">
        <h2 class="x-title2">Pill</h2>

        <div class="x-dropdown x-dropdown--pill">
          <button class="x-dropdown__toggle">
            Sort by
            <span class="x-dropdown__toggle-selected-value">Relevance</span>
            <span class="x-icon">▾</span>
          </button>
        </div>
        <div class="x-dropdown x-dropdown--is-open x-dropdown--pill">
          <button class="x-dropdown__toggle">
            Sort by
            <span class="x-dropdown__toggle-selected-value">Relevance</span>
            <span class="x-icon">▾</span>
          </button>
          <div class="x-dropdown__items-list">
            <button class="x-dropdown__item x-dropdown__item--is-selected">
              Relevance
              <span class="x-icon">✓</span>
            </button>
            <button class="x-dropdown__item">Alphabetical</button>
            <button class="x-dropdown__item">Price</button>
          </div>
        </div>
      </article>

      <article class="x-dropdown-show-case">
        <h2 class="x-title2">Line</h2>

        <div class="x-dropdown x-dropdown--line">
          <button class="x-dropdown__toggle">
            Sort by
            <span class="x-dropdown__toggle-selected-value">Relevance</span>
            <span class="x-icon">▾</span>
          </button>
        </div>
        <div class="x-dropdown x-dropdown--is-open x-dropdown--line">
          <button class="x-dropdown__toggle">
            Sort by
            <span class="x-dropdown__toggle-selected-value">Relevance</span>
            <span class="x-icon">▾</span>
          </button>
          <div class="x-dropdown__items-list">
            <button class="x-dropdown__item x-dropdown__item--is-selected">
              Relevance
              <span class="x-icon">✓</span>
            </button>
            <button class="x-dropdown__item">Alphabetical</button>
            <button class="x-dropdown__item">Price</button>
          </div>
        </div>
      </article>
    </section>

    <section>
      <h1 class="x-title1">Option List</h1>
      <article>
        <h2 class="x-title2">Divider</h2>
        <div>
          <span class="x-text">Sort by</span>
          <ul class="x-option-list">
            <li class="x-option-list__item">
              <button class="x-button">Option 1</button>
            </li>
            <li class="x-option-list__item x-option-list__item--is-selected">
              <button class="x-button">Option 2</button>
            </li>
            <li class="x-option-list__item">
              <button class="x-button">Option 3</button>
            </li>
          </ul>
        </div>
      </article>
      <article>
        <h2 class="x-title2">Bottom</h2>
        <div>
          <span class="x-text">Sort by</span>
          <ul class="x-option-list x-option-list--bottom">
            <li class="x-option-list__item">
              <button class="x-button">Option 1</button>
            </li>
            <li class="x-option-list__item x-option-list__item--is-selected">
              <button class="x-button">Option 2</button>
            </li>
            <li class="x-option-list__item">
              <button class="x-button">Option 3</button>
            </li>
          </ul>
        </div>
      </article>
    </section>

    <!-- eslint-disable max-len -->
    <section>
      <h1 class="x-title1">Sliding panel</h1>
      <article>
        <h2 class="x-title2">Default</h2>
        <SlidingPanel>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Bogotá</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Baghdad</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Nairobi</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Ankara</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Thais</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Edron</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Venore</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Carlin</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Ab'Dendriel</span>
          </button>
        </SlidingPanel>
      </article>

      <article>
        <h2 class="x-title2">Buttons overflow</h2>
        <SlidingPanel class="x-sliding-panel--buttons-overflow">
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Bogotá</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Baghdad</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Nairobi</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Ankara</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Thais</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Edron</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Venore</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Carlin</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Ab'Dendriel</span>
          </button>
        </SlidingPanel>
      </article>

      <article>
        <h2 class="x-title2">No gradient</h2>
        <SlidingPanel class="x-sliding-panel--no-gradient">
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Bogotá</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Baghdad</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Nairobi</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Ankara</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Thais</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Edron</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Venore</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Carlin</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Ab'Dendriel</span>
          </button>
        </SlidingPanel>
      </article>

      <article>
        <h2 class="x-title2">Buttons visible on hover</h2>
        <SlidingPanel class="x-sliding-panel--show-buttons-on-hover">
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Bogotá</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Baghdad</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Nairobi</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Ankara</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Thais</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Edron</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Venore</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Carlin</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Ab'Dendriel</span>
          </button>
        </SlidingPanel>
      </article>

      <article>
        <h2 class="x-title2">Buttons visible on hover with overflow</h2>
        <SlidingPanel
          class="x-sliding-panel--show-buttons-on-hover x-sliding-panel--buttons-overflow"
        >
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Bogotá</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Baghdad</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Nairobi</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Ankara</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Thais</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Edron</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Venore</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Carlin</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Ab'Dendriel</span>
          </button>
        </SlidingPanel>
      </article>

      <article>
        <h2 class="x-title2">Buttons visible on hover, with overflow and no gradient</h2>
        <SlidingPanel
          class="
            x-sliding-panel--no-gradient
            x-sliding-panel--show-buttons-on-hover
            x-sliding-panel--buttons-overflow
          "
        >
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Bogotá</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Baghdad</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Nairobi</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Ankara</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Thais</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Edron</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Venore</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Carlin</span>
          </button>
          <button class="x-button x-button--tertiary x-button--card">
            <span class="x-icon">＋</span>
            <span>Ab'Dendriel</span>
          </button>
        </SlidingPanel>
      </article>
    </section>
    <!-- eslint-enable max-len -->

    <section>
      <h1 class="x-title1">Lists</h1>
      <article>
        <h2 class="x-title2">Vertical</h2>
        <ul class="x-list x-list--vertical">
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </article>
      <article>
        <h2 class="x-title2">Vertical Gap</h2>
        <ul class="x-list x-list--vertical x-list--gap-02">
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <ul class="x-list x-list--vertical x-list--gap-03">
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <ul class="x-list x-list--vertical x-list--gap-04">
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <ul class="x-list x-list--vertical x-list--gap-05">
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <ul class="x-list x-list--vertical x-list--gap-06">
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </article>
      <article>
        <h2 class="x-title2">Vertical Padding</h2>
        <ul class="x-list x-list--vertical x-list--padding-02">
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <ul class="x-list x-list--vertical x-list--padding-03">
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <ul class="x-list x-list--vertical x-list--padding-04">
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <ul class="x-list x-list--vertical x-list--padding-05">
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <ul class="x-list x-list--vertical x-list--padding-06">
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </article>
      <article>
        <h2 class="x-title2">Vertical Padding Direction</h2>
        <ul class="x-list x-list--vertical x-list--padding-06 x-list--padding-top">
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <ul class="x-list x-list--vertical x-list--padding-06 x-list--padding-right">
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <ul class="x-list x-list--vertical x-list--padding-06 x-list--padding-bottom">
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <ul class="x-list x-list--vertical x-list--padding-06 x-list--padding-left">
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </article>
      <article>
        <h2 class="x-title2">Vertical Border</h2>
        <ul class="x-list x-list--vertical x-list--padding-06 x-list--border">
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </article>
      <article>
        <h2 class="x-title2">Vertical Border Direction</h2>
        <ul class="x-list x-list--vertical x-list--padding-06 x-list--border x-list--border-top">
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <ul class="x-list x-list--vertical x-list--padding-06 x-list--border x-list--border-right">
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <ul class="x-list x-list--vertical x-list--padding-06 x-list--border x-list--border-bottom">
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <ul class="x-list x-list--vertical x-list--padding-06 x-list--border x-list--border-left">
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </article>
      <article>
        <h2 class="x-title2">Horizontal</h2>
        <ul class="x-list x-list--horizontal">
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </article>
      <article>
        <h2 class="x-title2">Horizontal Gap</h2>
        <ul class="x-list x-list--horizontal x-list--gap-02">
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <ul class="x-list x-list--horizontal x-list--gap-03">
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <ul class="x-list x-list--horizontal x-list--gap-04">
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <ul class="x-list x-list--horizontal x-list--gap-05">
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <ul class="x-list x-list--horizontal x-list--gap-06">
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </article>
      <article>
        <h2 class="x-title2">Horizontal Padding</h2>
        <ul class="x-list x-list--horizontal x-list--padding-02">
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <ul class="x-list x-list--horizontal x-list--padding-03">
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <ul class="x-list x-list--horizontal x-list--padding-04">
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <ul class="x-list x-list--horizontal x-list--padding-05">
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <ul class="x-list x-list--horizontal x-list--padding-06">
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </article>
      <article>
        <h2 class="x-title2">Horizontal Padding Direction</h2>
        <ul class="x-list x-list--horizontal x-list--padding-06 x-list--padding-top">
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <ul class="x-list x-list--horizontal x-list--padding-06 x-list--padding-right">
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <ul class="x-list x-list--horizontal x-list--padding-06 x-list--padding-bottom">
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <ul class="x-list x-list--horizontal x-list--padding-06 x-list--padding-left">
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </article>
      <article>
        <h2 class="x-title2">Horizontal Border</h2>
        <ul class="x-list x-list--horizontal x-list--padding-06 x-list--border">
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </article>
      <article>
        <h2 class="x-title2">Horizontal Border Direction</h2>
        <ul class="x-list x-list--horizontal x-list--padding-06 x-list--border x-list--border-top">
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <ul
          class="x-list x-list--horizontal x-list--padding-06 x-list--border x-list--border-right"
        >
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <ul
          class="x-list x-list--horizontal x-list--padding-06 x-list--border x-list--border-bottom"
        >
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <ul class="x-list x-list--horizontal x-list--padding-06 x-list--border x-list--border-left">
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </article>
      <article>
        <h2 class="x-title2">Wrap</h2>
        <ul class="x-list x-list--wrap">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </article>
      <article class="x-list-alignment">
        <h2 class="x-title2">Alignment</h2>
        <div class="x-list-alignment-horizontal">
          <h2 class="x-title3">Horizontal Justify & Align Start</h2>
          <ul class="x-list x-list--horizontal x-list--justify-start x-list--align-start">
            <li></li>
            <li></li>
            <li></li>
          </ul>
          <h2 class="x-title3">Horizontal Justify & Align Center</h2>
          <ul class="x-list x-list--horizontal x-list--justify-center x-list--align-center">
            <li></li>
            <li></li>
            <li></li>
          </ul>
          <h2 class="x-title3">Horizontal Justify & Align End</h2>
          <ul class="x-list x-list--horizontal x-list--justify-end x-list--align-end">
            <li></li>
            <li></li>
            <li></li>
          </ul>
          <h2 class="x-title3">Horizontal Align Baseline</h2>
          <ul class="x-list x-list--horizontal x-list--align-baseline">
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
        <div class="x-list-alignment-vertical">
          <h2 class="x-title3">Vertical Justify & Align Start</h2>
          <ul class="x-list x-list--vertical x-list--justify-start x-list--align-start">
            <li></li>
            <li></li>
            <li></li>
          </ul>
          <h2 class="x-title3">Vertical Justify & Align Center</h2>
          <ul class="x-list x-list--vertical x-list--justify-center x-list--align-center">
            <li></li>
            <li></li>
            <li></li>
          </ul>
          <h2 class="x-title3">Vertical Justify & Align End</h2>
          <ul class="x-list x-list--vertical x-list--justify-end x-list--align-end">
            <li></li>
            <li></li>
            <li></li>
          </ul>
          <h2 class="x-title3">Vertical Align Baseline</h2>
          <ul class="x-list x-list--vertical x-list--align-baseline">
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
      </article>
      <article class="x-list-sizing">
        <h2 class="x-title2">Items sizing</h2>
        <ul class="x-list x-list--vertical">
          <li class="x-list__item--2">02</li>
          <li class="x-list__item--6">06</li>
          <li class="x-list__item--2">02</li>
        </ul>
        <ul class="x-list x-list--horizontal">
          <li class="x-list__item--1">01</li>
          <li class="x-list__item--5">05</li>
          <li class="x-list__item--1">01</li>
          <li class="x-list__item--2">02</li>
        </ul>
      </article>
    </section>
    <section>
      <h1 class="x-title1">Row</h1>

      <article>
        <h2 class="x-title2">Default</h2>
        <ul class="x-row">
          <li class="x-row__item x-row__item--span-2 x-row__item--start-1">0</li>
          <li class="x-row__item">1</li>
          <li class="x-row__item x-row__item--span-3 x-row__item--start-5">2</li>
          <li class="x-row__item x-row__item--start-9">3</li>
          <li class="x-row__item x-row__item--span-2">4</li>
        </ul>
      </article>

      <article>
        <h2 class="x-title2">Padding</h2>

        <ul class="x-row x-row--padding-02">
          <li class="x-row__item x-row__item--span-2 x-row__item--start-1">0</li>
          <li class="x-row__item">1</li>
          <li class="x-row__item x-row__item--span-3 x-row__item--start-5">2</li>
          <li class="x-row__item x-row__item--start-9">3</li>
          <li class="x-row__item x-row__item--span-2">4</li>
        </ul>

        <ul class="x-row x-row--padding-03">
          <li class="x-row__item x-row__item--span-2 x-row__item--start-1">0</li>
          <li class="x-row__item">1</li>
          <li class="x-row__item x-row__item--span-3 x-row__item--start-5">2</li>
          <li class="x-row__item x-row__item--start-9">3</li>
          <li class="x-row__item x-row__item--span-2">4</li>
        </ul>

        <ul class="x-row x-row--padding-04">
          <li class="x-row__item x-row__item--span-2 x-row__item--start-1">0</li>
          <li class="x-row__item">1</li>
          <li class="x-row__item x-row__item--span-3 x-row__item--start-5">2</li>
          <li class="x-row__item x-row__item--start-9">3</li>
          <li class="x-row__item x-row__item--span-2">4</li>
        </ul>

        <ul class="x-row x-row--padding-05">
          <li class="x-row__item x-row__item--span-2 x-row__item--start-1">0</li>
          <li class="x-row__item">1</li>
          <li class="x-row__item x-row__item--span-3 x-row__item--start-5">2</li>
          <li class="x-row__item x-row__item--start-9">3</li>
          <li class="x-row__item x-row__item--span-2">4</li>
        </ul>

        <ul class="x-row x-row--padding-06">
          <li class="x-row__item x-row__item--span-2 x-row__item--start-1">0</li>
          <li class="x-row__item">1</li>
          <li class="x-row__item x-row__item--span-3 x-row__item--start-5">2</li>
          <li class="x-row__item x-row__item--start-9">3</li>
          <li class="x-row__item x-row__item--span-2">4</li>
        </ul>
      </article>

      <article>
        <h2 class="x-title2">Gap</h2>

        <ul class="x-row x-row--gap-02">
          <li class="x-row__item x-row__item--span-2 x-row__item--start-1">0</li>
          <li class="x-row__item">1</li>
          <li class="x-row__item x-row__item--span-3 x-row__item--start-5">2</li>
          <li class="x-row__item x-row__item--start-9">3</li>
          <li class="x-row__item x-row__item--span-2">4</li>
        </ul>

        <ul class="x-row x-row--gap-03">
          <li class="x-row__item x-row__item--span-2 x-row__item--start-1">0</li>
          <li class="x-row__item">1</li>
          <li class="x-row__item x-row__item--span-3 x-row__item--start-5">2</li>
          <li class="x-row__item x-row__item--start-9">3</li>
          <li class="x-row__item x-row__item--span-2">4</li>
        </ul>

        <ul class="x-row x-row--gap-04">
          <li class="x-row__item x-row__item--span-2 x-row__item--start-1">0</li>
          <li class="x-row__item">1</li>
          <li class="x-row__item x-row__item--span-3 x-row__item--start-5">2</li>
          <li class="x-row__item x-row__item--start-9">3</li>
          <li class="x-row__item x-row__item--span-2">4</li>
        </ul>

        <ul class="x-row x-row--gap-05">
          <li class="x-row__item x-row__item--span-2 x-row__item--start-1">0</li>
          <li class="x-row__item">1</li>
          <li class="x-row__item x-row__item--span-3 x-row__item--start-5">2</li>
          <li class="x-row__item x-row__item--start-9">3</li>
          <li class="x-row__item x-row__item--span-2">4</li>
        </ul>

        <ul class="x-row x-row--gap-06">
          <li class="x-row__item x-row__item--span-2 x-row__item--start-1">0</li>
          <li class="x-row__item">1</li>
          <li class="x-row__item x-row__item--span-3 x-row__item--start-5">2</li>
          <li class="x-row__item x-row__item--start-9">3</li>
          <li class="x-row__item x-row__item--span-2">4</li>
        </ul>
      </article>

      <article>
        <h2 class="x-title2">Alignment</h2>
        <div>
          <h3 class="x-title3">Stretch</h3>
          <ul class="x-row x-row--align-stretch">
            <li class="x-row__item x-row__item--span-2 x-row__item--start-1">0</li>
            <li class="x-row__item">1</li>
            <li class="x-row__item x-row__item--span-3 x-row__item--start-5">2</li>
            <li class="x-row__item x-row__item--start-9">3</li>
            <li class="x-row__item x-row__item--span-2">4</li>
          </ul>
        </div>
        <div>
          <h3 class="x-title3">Start</h3>
          <ul class="x-row x-row--align-start">
            <li class="x-row__item x-row__item--span-2 x-row__item--start-1">0</li>
            <li class="x-row__item">1</li>
            <li class="x-row__item x-row__item--span-3 x-row__item--start-5">2</li>
            <li class="x-row__item x-row__item--start-9">3</li>
            <li class="x-row__item x-row__item--span-2">4</li>
          </ul>
        </div>
        <div>
          <h3 class="x-title3">End</h3>
          <ul class="x-row x-row--align-end">
            <li class="x-row__item x-row__item--span-2 x-row__item--start-1">0</li>
            <li class="x-row__item">1</li>
            <li class="x-row__item x-row__item--span-3 x-row__item--start-5">2</li>
            <li class="x-row__item x-row__item--start-9">3</li>
            <li class="x-row__item x-row__item--span-2">4</li>
          </ul>
        </div>
        <div>
          <h3 class="x-title3">Center (default)</h3>
          <ul class="x-row x-row--align-center">
            <li class="x-row__item x-row__item--span-2 x-row__item--start-1">0</li>
            <li class="x-row__item">1</li>
            <li class="x-row__item x-row__item--span-3 x-row__item--start-5">2</li>
            <li class="x-row__item x-row__item--start-9">3</li>
            <li class="x-row__item x-row__item--span-2">4</li>
          </ul>
        </div>
      </article>

      <article>
        <h2 class="x-title2">Justify</h2>
        <div>
          <h3 class="x-title3">Stretch (default)</h3>
          <ul class="x-row x-row--justify-stretch">
            <li class="x-row__item x-row__item--span-2 x-row__item--start-1">0</li>
            <li class="x-row__item">1</li>
            <li class="x-row__item x-row__item--span-3 x-row__item--start-5">2</li>
            <li class="x-row__item x-row__item--start-9">3</li>
            <li class="x-row__item x-row__item--span-2">4</li>
          </ul>
        </div>
        <div>
          <h3 class="x-title3">Start</h3>
          <ul class="x-row x-row--justify-start">
            <li class="x-row__item x-row__item--span-2 x-row__item--start-1">0</li>
            <li class="x-row__item">1</li>
            <li class="x-row__item x-row__item--span-3 x-row__item--start-5">2</li>
            <li class="x-row__item x-row__item--start-9">3</li>
            <li class="x-row__item x-row__item--span-2">4</li>
          </ul>
        </div>
        <div>
          <h3 class="x-title3">End</h3>
          <ul class="x-row x-row--justify-end">
            <li class="x-row__item x-row__item--span-2 x-row__item--start-1">0</li>
            <li class="x-row__item">1</li>
            <li class="x-row__item x-row__item--span-3 x-row__item--start-5">2</li>
            <li class="x-row__item x-row__item--start-9">3</li>
            <li class="x-row__item x-row__item--span-2">4</li>
          </ul>
        </div>
        <div>
          <h3 class="x-title3">Center</h3>
          <ul class="x-row x-row--justify-center">
            <li class="x-row__item x-row__item--span-2 x-row__item--start-1">0</li>
            <li class="x-row__item">1</li>
            <li class="x-row__item x-row__item--span-3 x-row__item--start-5">2</li>
            <li class="x-row__item x-row__item--start-9">3</li>
            <li class="x-row__item x-row__item--span-2">4</li>
          </ul>
        </div>
      </article>
    </section>

    <section>
      <h1 class="x-title1">Row Item</h1>

      <article>
        <h2 class="x-title2">Default</h2>
        <ul class="x-row">
          <li class="x-row__item">0</li>
        </ul>
      </article>

      <article>
        <h2 class="x-title2">Span</h2>

        <ul v-for="span in 12" :key="span" class="x-row">
          <li class="x-row__item" :class="`x-row__item--span-${span}`">{{ span }}</li>
        </ul>
      </article>

      <article>
        <h2 class="x-title2">Start</h2>

        <ul v-for="start in 12" :key="start" class="x-row">
          <li class="x-row__item" :class="`x-row__item--start-${start}`">{{ start }}</li>
        </ul>
      </article>
    </section>

    <section>
      <h1 class="x-title1">Product image</h1>

      <article class="x-picture-show-case">
        <h2 class="x-title2">Default</h2>
        <picture class="x-picture">
          <img class="x-picture__image" :src="standardImageUrl" />
        </picture>
      </article>

      <article class="x-picture-show-case">
        <h2 class="x-title2">Card</h2>
        <picture class="x-picture x-picture--card">
          <img class="x-picture__image" :src="standardImageUrl" />
        </picture>
      </article>

      <article class="x-picture-show-case">
        <h2 class="x-title2">Cover</h2>
        <picture class="x-picture x-picture--cover">
          <img class="x-picture__image" :src="whiteBackgroundImageUrl" />
        </picture>
      </article>

      <article class="x-picture-show-case">
        <h2 class="x-title2">Colored</h2>
        <picture class="x-picture x-picture--colored">
          <img class="x-picture__image" :src="whiteBackgroundImageUrl" />
        </picture>
      </article>

      <article class="x-picture-show-case">
        <h2 class="x-title2">Fixed Ratio</h2>
        <picture class="x-picture x-picture--fixed-ratio">
          <img class="x-picture__image" :src="whiteBackgroundImageUrl" />
        </picture>
      </article>
    </section>

    <button @click="toggleTokens" class="info x-button x-button--tertiary x-button--round">
      i
    </button>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import SlidingPanel from '../components/sliding-panel.vue';

  @Component({
    components: { SlidingPanel }
  })
  export default class DesignSystem extends Vue {
    protected whiteBackgroundImageUrl =
      /* eslint-disable max-len */
      'https://images.unsplash.com/photo-1583345784606-9f59c99488de?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=clamp&w=200&q=80';
    protected standardImageUrl =
      'https://images.unsplash.com/photo-1605494708535-d7a7b2d2740e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200q=80';
    /* eslint-enable max-len */

    protected toggleTokens(): void {
      document.head.classList.toggle('show-tokens');
    }

    protected mounted(): void {
      Array.from(document.querySelectorAll<HTMLStyleElement>(`head style[type='text/css']`))
        .filter(element => element.innerText.startsWith(':root'))
        .forEach(element => element.setAttribute('contenteditable', 'true'));
    }
  }
</script>

<style lang="scss">
  .x-design-system {
    * {
      outline: none;
    }

    section {
      display: flex;
      flex-flow: column nowrap;
      align-items: flex-start;
      justify-content: flex-start;
      gap: var(--x-space-05);
      padding: var(--x-space-07);
    }

    article {
      display: flex;
      align-items: flex-start;
      column-gap: var(--x-space-09);
      row-gap: var(--x-space-03);
      flex-flow: row wrap;

      h2 {
        width: 100%;
      }
    }

    h1,
    h2 {
      margin: var(--x-space-04) 0 var(--x-space-02);
    }

    .x-input-group {
      width: 250px;
    }

    article > {
      .x-filter,
      .x-hierarchical-filter-container {
        width: 220px;
      }
    }

    .x-facet {
      width: 200px;

      &--card {
        --x-color-background-facet: var(--x-color-neutral-95);
      }
    }

    .x-suggestion {
      width: 220px;
    }

    .x-tag {
      max-width: 200px;
    }

    .x-list {
      list-style-type: none;
      background: var(--x-color-neutral-95);
      & > * {
        width: 100px;
        height: 30px;
        background: var(--x-color-auxiliary);
        border: solid 1px var(--x-color-neutral-95);
      }
      &--wrap {
        max-width: 306px;
      }

      &-alignment {
        .x-list {
          &--horizontal {
            width: 500px;
            height: 80px;
          }

          &--vertical {
            width: 150px;
            height: 120px;
          }
        }
      }
      &-sizing {
        .x-list {
          &--horizontal {
            width: 600px;
          }

          &--vertical {
            height: 120px;
          }
        }
      }
    }
    [class^='x-list__item'] {
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--x-color-neutral-95);
    }

    .info {
      position: fixed;
      right: var(--x-space-08);
      bottom: var(--x-space-08);
    }

    .x-dropdown-show-case {
      margin-bottom: 8em;
    }

    .x-row {
      background: var(--x-color-neutral-95);
      width: 500px;
      height: var(--x-space-08);

      &__item {
        box-sizing: border-box;
        background: var(--x-color-auxiliary);
        padding: var(--x-space-02);
        color: var(--x-color-neutral-70);
        vertical-align: middle;
        text-align: center;
        border: solid var(--x-border-width) var(--x-color-auxiliary);
      }
    }

    .x-sliding-panel {
      max-width: 500px;

      &__scroll {
        gap: var(--x-space-03);
      }
    }

    .x-picture-show-case {
      width: 100px;
    }
  }

  head {
    background: lightgoldenrodyellow;
    position: fixed;
    padding: var(--x-space-04) var(--x-space-09);
    bottom: 0;
    right: 0;
    height: 80%;
    overflow: auto;
    z-index: 10;

    &:before {
      font-family: var(--x-font-family);
      content: 'You can edit here the Design Tokens';
      display: block;
      font-size: var(--x-font-size-xl);
      padding-bottom: 10px;
    }

    style {
      white-space: pre;
      font-family: monospace;
      margin-block: var(--x-space-04);
    }
  }

  .show-tokens {
    display: block;

    [contenteditable='true'] {
      display: block;
    }
  }
</style>
