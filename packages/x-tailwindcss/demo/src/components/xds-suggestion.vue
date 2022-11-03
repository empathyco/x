<template>
  <div class="x-flex x-flex-col x-gap-16">
    <h1 class="x-text-lg">Suggestion</h1>
    <div
      v-for="(classes, section) in sections"
      :key="section"
      class="x-flex x-flex-row x-items-start x-gap-12 x-align-items-baseline"
    >
      <h2 class="x-text-md">{{ section }}</h2>
      <button
        v-for="cssClass in classes"
        :key="cssClass"
        @click="copyCSSClasses"
        :class="cssClass"
        title="Click me to copy CSS classes"
      >
        🔎
        {{ removeBase(cssClass) }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';

  @Component
  export default class XdsSuggestion extends Vue {
    @Prop({ default: () => 'x-suggestion' })
    public base!: string;

    @Prop({
      default: () => ['x-suggestion-md', 'x-suggestion-lg']
    })
    public sizes!: string[];

    @Prop({
      default: () => [
        'x-suggestion-neutral',
        'x-suggestion-lead',
        'x-suggestion-auxiliary',
        'x-suggestion-accent',
        'x-suggestion-highlight',
        'x-suggestion-success',
        'x-suggestion-warning',
        'x-suggestion-error'
      ]
    })
    public colors!: string[];

    @Prop({ default: () => ['x-suggestion-outlined'] })
    public outline!: string;

    @Prop({ default: () => ['x-suggestion-filled'] })
    public filled!: string;

    @Prop({
      default: () => [
        'x-suggestion-outlined x-suggestion-md',
        'x-suggestion-outlined x-suggestion-lg',
        'x-suggestion-filled x-suggestion-md',
        'x-suggestion-filled x-suggestion-lg'
      ]
    })
    public combinations!: string[];

    protected get sections(): Record<string, string[]> {
      return {
        Default: [this.base],
        Colors: this.colors.map(this.prefixWith(this.base)),
        Sizes: this.sizes.map(this.prefixWith(this.base)),
        Outline: this.colors.map(this.prefixWith(this.base, this.outline)),
        Filled: this.colors.map(this.prefixWith(this.base, this.filled)),
        Combinations: this.combinations.map(this.prefixWith(this.base))
      };
    }

    protected prefixWith(...prefix: string[]): (value: string) => string {
      return cssClass => `${prefix.join(' ')} ${cssClass}`;
    }

    protected removeBase(cssClass: string): string {
      return cssClass.replace(new RegExp(`${this.base}-?`, 'g'), '') || 'suggestion';
    }

    protected copyCSSClasses(event: MouseEvent): void {
      navigator.clipboard.writeText((event.target as HTMLElement).classList.value);
    }
  }
</script>
