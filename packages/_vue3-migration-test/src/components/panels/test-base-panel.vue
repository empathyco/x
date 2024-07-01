<template>
  <div>
    <h2>Base header toggle panel</h2>
    <BaseHeaderTogglePanel :start-collapsed="false">
      <template #header-content="{ open }">
        <p>Header, open: {{ open ? 'close' : 'open' }}</p>
      </template>
      <p>Default content</p>
    </BaseHeaderTogglePanel>

    <h2>Base id toggle panel, Base id toggle panel button and Base Toggle panel</h2>
    <BaseIdTogglePanelButton panelId="myToggle">Toggle Aside</BaseIdTogglePanelButton>
    <BaseIdTogglePanel :startOpen="true" panelId="myToggle">
      <div>My toggle</div>
    </BaseIdTogglePanel>

    <h2>Base tabs panel component</h2>
    <BaseTabsPanel initial-tab="fall">
      <template #summer>
        <div>Summer Top Sales</div>
      </template>
      <template #fall>
        <div>Fall Top Sales</div>
      </template>
      <template #outlet>
        <div>Outlet Top Sales</div>
      </template>
    </BaseTabsPanel>
  </div>
</template>

<script setup>
  import BaseHeaderTogglePanel from '../../../../x-components/src/components/panels/base-header-toggle-panel.vue';
  import BaseIdTogglePanelButton from '../../../../x-components/src/components/panels/base-id-toggle-panel-button.vue';
  import BaseIdTogglePanel from '../../../../x-components/src/components/panels/base-id-toggle-panel.vue';
  import BaseTabsPanel from '../../../../x-components/src/components/panels/base-tabs-panel.vue';
</script>

<style scoped></style>
