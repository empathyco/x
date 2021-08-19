<template>
  <ExtraParams :values="extraRequestParams" />
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Watch } from 'vue-property-decorator';
  import { xComponentMixin, XInject } from '../../../components';
  import { Dictionary, forEach } from '../../../utils';
  import { SnippetConfig } from '../../../x-installer';
  import { extraParamsXModule } from '../x-module';
  import ExtraParams from './extra-params.vue';

  /**
   * It renders a {@link ExtraParams} component and pass the snippetConfig.
   *
   * @public
   */
  @Component({
    components: { ExtraParams },
    mixins: [xComponentMixin(extraParamsXModule)]
  })
  export default class SnippetConfigExtraRequestParams extends Vue {
    @XInject('snippetConfig')
    public snippetConfig!: SnippetConfig;

    public extraRequestParams: Dictionary<unknown> = {};

    @Watch('snippetConfig', { deep: true, immediate: true })
    syncExtraRequestParams({
      lang,
      searchLang,
      instance,
      scope,
      ...extraRequestParams
    }: SnippetConfig): void {
      forEach(extraRequestParams, (name, value) => {
        this.$set(this.extraRequestParams, name, value);
      });
    }
  }
</script>
