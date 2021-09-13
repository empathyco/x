<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { UrlConfig } from '../config.types';
  import { urlXModule } from '../x-module';

  @Component({
    mixins: [xComponentMixin(urlXModule)]
  })
  export default class URLManager extends Vue {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    render(): void {}

    mounted(): void {
      this.saveURLConfig();

      window.onload = () => {
        // INIT URL STORE
      };

      window.onpopstate = () => {
        // UPDATE URL STORE
      };
    }

    private saveURLConfig(): void {
      if (Object.keys(this.$attrs).length > 0) {
        const params = Object.entries(this.$attrs).reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {} as Record<keyof UrlConfig['urlParamNames'], string>);

        this.$x.emit('UrlConfigProvided', {
          urlParamNames: {
            ...params
          }
        });
      }
    }
  }
</script>
