<template>
  <section class="xds:flex xds:flex-col xds:gap-16 xds:p-32">
    <div>
      <h1 class="row1">WAI-ARIA compliance - test pages</h1>
      <ul class="menu">
        <li>
          <router-link to="/accessibility-check/wai-base-event-button">
            Base Event Button
          </router-link>
        </li>
        <li>
          <router-link to="/accessibility-check/wai-base-dropdown-and-base-switch">
            Base Dropdown and Base Switch
          </router-link>
        </li>
        <li>
          <router-link to="/accessibility-check/wai-base-result-link">Base Result Link</router-link>
        </li>
      </ul>
      <router-view />
    </div>
  </section>
</template>
