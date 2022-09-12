import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { XInject } from '../decorators/injection.decorators';
import { DISABLE_ANIMATIONS_KEY } from '../decorators/injection.consts';

/**
 * Mixin to ease disabling animations.
 *
 * @public
 */
@Component
export default class DisableAnimationMixin extends Vue {
  /**
   * The name of the animation.
   *
   * @public
   */
  protected animationName!: string;

  /**
   * Flag to disable the animation.
   *
   * @public
   */
  @XInject(DISABLE_ANIMATIONS_KEY)
  public disableAnimation!: boolean;

  /**
   * The animation's name based on the {@link DisableAnimationMixin.disableAnimation} flag.
   *
   * @returns The animation name.
   * @internal
   */
  protected get name(): string {
    return this.disableAnimation ? '__no-animation__' : this.animationName;
  }
}
