<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { xComponentMixin } from '../../../components/x-component.mixin';
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
      this.$x.emit('UrlConfigProvided', {
        urlParamNames: {
          query: this.$attrs['query'] ?? 'q',
          page: this.$attrs['page'] ?? 'page',
          filters: this.$attrs['filters'] ?? 'filters',
          relatedTags: this.$attrs['relatedTags'] ?? 'tag',
          sort: this.$attrs['sort'] ?? 'sort'
        }
      });
    }
  }
</script>
