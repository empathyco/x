<script lang="ts">
  import { Prop, Provide, Component } from 'vue-property-decorator';
  import { NoElement } from '../components/no-element';
  import { FeatureLocation } from '../types';

  /**
   * Location Injector component.
   * This component injects the location with value passed as prop.
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
