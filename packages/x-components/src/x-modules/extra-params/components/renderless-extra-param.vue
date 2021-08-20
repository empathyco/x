<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { xComponentMixin } from '../../../components';
  import { extraParamsXModule } from '../x-module';

  /**
   * It emits a {@link ExtraParamsXEvents.UserChangedExtraParam} with the values
   * received as a prop.
   *
   * @public
   */

  @Component({
    mixins: [xComponentMixin(extraParamsXModule)]
  })
  export default class RenderlessExtraParam extends Vue {
    @Prop({ required: true })
    protected extraParamName!: string;

    @Prop
    protected defaultValue?: string;

    protected updateValue(newValue: string): void {
      this.$x.emit('UserChangedExtraParam', { [this.extraParamName]: newValue });
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    render(): void {}
  }
</script>
