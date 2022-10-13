<template>
  <div class="x-flex x-flex-col x-gap-16">
    <h1 class="x-text-lg">Button</h1>
    <div
      v-for="(classes, section) in sections"
      :key="section"
      class="x-flex x-flex-row x-items-start x-gap-12 x-align-items-baseline"
    >
      <h2 class="x-text-md">{{ section }}</h2>
      <button v-for="cssClass in classes" :key="cssClass" @click="copyCSSClasses" :class="cssClass">
        {{ removeBase(cssClass) }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';

  @Component
  export default class XdsButtonShowcase extends Vue {
    @Prop({ default: () => 'x-button' })
    public base!: string;
    @Prop({ default: () => ['x-button-xs', 'x-button-sm', 'x-button-md', 'x-button-lg'] })
    public sizes!: string[];
    @Prop({
      default: () => [
        'x-button-neutral',
        'x-button-primary',
        'x-button-secondary',
        'x-button-accent',
        'x-button-highlight',
        'x-button-success',
        'x-button-warning',
        'x-button-error'
      ]
    })
    public colors!: string[];

    @Prop({ default: () => ['x-button-circle', 'x-button-square'] })
    public layouts!: string[];

    @Prop({ default: () => ['x-button-ghost'] })
    public ghost!: string;

    @Prop({ default: () => ['x-button-outlined'] })
    public outline!: string;

    @Prop({
      default: () => [
        'x-button-primary x-button-xs',
        'x-button-secondary x-button-circle x-button-outlined'
      ]
    })
    public combinations!: string[];

    protected get sections(): Record<string, string[]> {
      return {
        Default: [this.base],
        Colors: this.colors.map(this.prefixWith(this.base)),
        Sizes: this.sizes.map(this.prefixWith(this.base)),
        Layout: this.layouts.map(this.prefixWith(this.base)),
        Outline: this.colors.map(this.prefixWith(this.base, this.outline)),
        Ghost: this.colors.map(this.prefixWith(this.base, this.ghost)),
        Combinations: this.combinations.map(this.prefixWith(this.base))
      };
    }

    protected prefixWith(...prefix: string[]): (value: string) => string {
      return cssClass => `${prefix.join(' ')} ${cssClass}`;
    }

    protected removeBase(cssClass: string): string {
      return cssClass.replace(new RegExp(`${this.base}-?`, 'g'), '') || 'button';
    }

    protected copyCSSClasses(event: MouseEvent): void {
      navigator.clipboard.writeText((event.target as HTMLElement).classList.value);
    }
  }
</script>
