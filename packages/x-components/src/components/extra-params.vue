<template>
  <div>Extra Params</div>
</template>
<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop, Watch } from 'vue-property-decorator';
  import { Dictionary } from '../utils';
  import { ExtraParamsXEvents, ExtraParamXEvent } from '../wiring';
  import { SnippetConfig } from '../x-installer';
  import { XInject } from './decorators/injection.decorators';

  @Component({})
  export default class ExtraParams extends Vue {
    /**
     * (Required) A object where the keys are the {@link ExtraParamXEvent} and the values
     * are the payload of each event.
     *
     * @public
     */
    @Prop({ required: true })
    protected events!: Partial<ExtraParamsXEvents>;

    @XInject('snippetConfig')
    public snippetConfig!: SnippetConfig;

    protected mounted(): void {
      this.emitEvents();
    }

    private emitEvents(): void {
      Object.entries(this.events).forEach(([event, payload]) => {
        this.emitEvent(event as ExtraParamXEvent, payload);
      });
    }

    protected get getExtraParamsFromTheSnippetConfig(): Dictionary {
      const {
        _instance,
        _env,
        _lang,
        _searchLang,
        _scope,
        _consent,
        _currency,
        _documentDirection,
        ...extraParams
      } = this.snippetConfig ?? {};

      return extraParams;
    }

    @Watch('getExtraParamsFromTheSnippetConfig', { immediate: true, deep: true })
    protected syncExtraParams(
      newExtraParams: Record<string, any>,
      oldExtraParams: Record<string, any>
    ): void {
      if (oldExtraParams) {
        Object.keys(this.events).forEach(event => {
          Object.entries(newExtraParams).forEach(([key, value]) => {
            if (newExtraParams[key] !== oldExtraParams[key]) {
              this.emitEvent(event as ExtraParamXEvent, { [key]: value });
            }
          });
        });
      }
    }

    protected emitEvent(event: ExtraParamXEvent, payload: Record<string, any>): void {
      this.$x.emit(event, payload, { target: this.$el as HTMLElement });
    }
  }
</script>
