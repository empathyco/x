<script lang="ts">
  import { Prop, Provide, Component } from 'vue-property-decorator';
  import { NoElement } from '../components/no-element';
  import { FeatureLocation } from '../types';

  /**
   * Location Injector component. This component inject the value passed as
   * prop as the location.
   *
   * @public
   */
  @Component
  export default class LocationInjector extends NoElement {
    /**
     * {@link FeatureLocation | Location} To inject.
     *
     * @public
     */
    @Prop({ required: true })
    @Provide('location')
    protected location!: FeatureLocation;
  }
</script>
