<template>
  <main>
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
        <div class="x-tag x-tag--selected">
          <span class="x-icon">＋</span>
          <span>text tag</span>
        </div>
        <div class="x-tag x-tag--selected">
          <span class="x-icon">＋</span>
          <span>text tag extra large name</span>
        </div>
        <div class="x-tag x-tag--selected">
          <span>text tag</span>
        </div>
        <div class="x-tag x-tag--selected">
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
        <div class="x-tag x-tag--card x-tag--selected">
          <span class="x-icon">＋</span>
          <span>text tag</span>
        </div>
        <div class="x-tag x-tag--card x-tag--selected">
          <span class="x-icon">＋</span>
          <span>text tag extra large name</span>
        </div>
        <div class="x-tag x-tag--card x-tag--selected">
          <span>text tag</span>
        </div>
        <div class="x-tag x-tag--card x-tag--selected">
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
        <div class="x-tag x-tag--pill x-tag--selected">
          <span class="x-icon">＋</span>
          <span>text tag</span>
        </div>
        <div class="x-tag x-tag--pill x-tag--selected">
          <span class="x-icon">＋</span>
          <span>text tag extra large name</span>
        </div>
        <div class="x-tag x-tag--pill x-tag--selected">
          <span>text tag</span>
        </div>
        <div class="x-tag x-tag--pill x-tag--selected">
          <span>text tag extra large name</span>
        </div>
        <div class="x-tag x-tag--pill x-tag--selected">
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
        <div class="x-tag x-tag--ghost x-tag--selected">
          <span class="x-icon">＋</span>
          <span>text tag</span>
        </div>
        <div class="x-tag x-tag--ghost x-tag--selected">
          <span class="x-icon">＋</span>
          <span>text tag extra large name</span>
        </div>
        <div class="x-tag x-tag--ghost x-tag--selected">
          <span>text tag</span>
        </div>
        <div class="x-tag x-tag--ghost x-tag--selected">
          <span>text tag extra large name</span>
        </div>
      </article>
    </section>

    <button @click="showTokens" class="info x-button x-button--tertiary x-button--round">i</button>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';

  @Component
  export default class DesignSystem extends Vue {
    protected showTokens(): void {
      const styleElement = document.querySelector(`head style[type='text/css']`);
      const isShown = styleElement?.classList.contains('show-tokens');
      if (isShown) {
        styleElement?.classList.remove('show-tokens');
      } else {
        styleElement?.setAttribute('contenteditable', 'true');
        styleElement?.classList.add('show-tokens');
      }
    }
  }
</script>

<style lang="scss" scoped>
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

  .x-filter,
  .x-hierarchical-filter-container {
    width: 220px;
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
</style>

<style lang="scss">
  .info {
    position: fixed;
    right: var(--x-space-08);
    bottom: var(--x-space-08);
  }
  head {
    display: block;
    visibility: hidden;

    .show-tokens {
      visibility: visible;
      display: block;
      position: fixed;
      background: lightgoldenrodyellow;
      padding: var(--x-space-04) var(--x-space-09);
      bottom: 0;
      right: 0;
      white-space: pre;
      height: 80%;
      overflow: auto;
      font-family: monospace;

      &:before {
        font-family: var(--x-font-family);
        content: 'You can edit here the Design Tokens';
        display: block;
        font-size: var(--x-font-size-xl);
        padding-bottom: 10px;
      }
    }
  }
</style>
