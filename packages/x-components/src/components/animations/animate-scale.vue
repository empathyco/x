<template>
  <Transition :name="`x-animate-scale--${animationOrigin} x-animate-scale-`">
    <slot />
  </Transition>
</template>

<script setup lang="ts">
import type { AnimationOrigin } from './animation-origin'

defineProps({
  animationOrigin: {
    type: String as () => AnimationOrigin,
    default: 'top',
  },
})
</script>

<style lang="css">
.x-animate-scale--enter-active,
.x-animate-scale--leave-active,
.x-animate-scale--enter-active *,
.x-animate-scale--leave-active * {
  animation-duration: var(--x-duration-animation, 0.3s);
  animation-timing-function: linear;
}
.x-animate-scale--enter-active,
.x-animate-scale--leave-active {
  overflow: hidden;
}
.x-animate-scale--enter-active.x-animate-scale--top,
.x-animate-scale--enter-active.x-animate-scale--bottom,
.x-animate-scale--enter-active.x-animate-scale--top-to-bottom,
.x-animate-scale--enter-active.x-animate-scale--bottom-to-top,
.x-animate-scale--leave-active.x-animate-scale--top,
.x-animate-scale--leave-active.x-animate-scale--bottom,
.x-animate-scale--leave-active.x-animate-scale--top-to-bottom,
.x-animate-scale--leave-active.x-animate-scale--bottom-to-top {
  animation-name: containerAnimationY;
}
.x-animate-scale--enter-active.x-animate-scale--top > *,
.x-animate-scale--enter-active.x-animate-scale--bottom > *,
.x-animate-scale--enter-active.x-animate-scale--top-to-bottom > *,
.x-animate-scale--enter-active.x-animate-scale--bottom-to-top > *,
.x-animate-scale--leave-active.x-animate-scale--top > *,
.x-animate-scale--leave-active.x-animate-scale--bottom > *,
.x-animate-scale--leave-active.x-animate-scale--top-to-bottom > *,
.x-animate-scale--leave-active.x-animate-scale--bottom-to-top > * {
  animation-name: contentAnimationY;
}
.x-animate-scale--enter-active.x-animate-scale--left,
.x-animate-scale--enter-active.x-animate-scale--right,
.x-animate-scale--enter-active.x-animate-scale--left-to-right,
.x-animate-scale--enter-active.x-animate-scale--right-to-left,
.x-animate-scale--leave-active.x-animate-scale--left,
.x-animate-scale--leave-active.x-animate-scale--right,
.x-animate-scale--leave-active.x-animate-scale--left-to-right,
.x-animate-scale--leave-active.x-animate-scale--right-to-left {
  animation-name: containerAnimationX;
}
.x-animate-scale--enter-active.x-animate-scale--left > *,
.x-animate-scale--enter-active.x-animate-scale--right > *,
.x-animate-scale--enter-active.x-animate-scale--left-to-right > *,
.x-animate-scale--enter-active.x-animate-scale--right-to-left > *,
.x-animate-scale--leave-active.x-animate-scale--left > *,
.x-animate-scale--leave-active.x-animate-scale--right > *,
.x-animate-scale--leave-active.x-animate-scale--left-to-right > *,
.x-animate-scale--leave-active.x-animate-scale--right-to-left > * {
  animation-name: contentAnimationX;
}
.x-animate-scale--leave-active,
.x-animate-scale--leave-active > * {
  animation-direction: reverse;
}
.x-animate-scale--top.x-animate-scale--enter-active,
.x-animate-scale--top.x-animate-scale--leave-active,
.x-animate-scale--top.x-animate-scale--enter-active > *,
.x-animate-scale--top.x-animate-scale--leave-active > * {
  transform-origin: top center;
}
.x-animate-scale--bottom.x-animate-scale--enter-active,
.x-animate-scale--bottom.x-animate-scale--leave-active,
.x-animate-scale--bottom.x-animate-scale--enter-active > *,
.x-animate-scale--bottom.x-animate-scale--leave-active > * {
  transform-origin: bottom center;
}
.x-animate-scale--left.x-animate-scale--enter-active,
.x-animate-scale--left.x-animate-scale--leave-active,
.x-animate-scale--left.x-animate-scale--enter-active > *,
.x-animate-scale--left.x-animate-scale--leave-active > * {
  transform-origin: left center;
}
.x-animate-scale--right.x-animate-scale--enter-active,
.x-animate-scale--right.x-animate-scale--leave-active,
.x-animate-scale--right.x-animate-scale--enter-active > *,
.x-animate-scale--right.x-animate-scale--leave-active > * {
  transform-origin: right center;
}
.x-animate-scale--top-to-bottom.x-animate-scale--enter-active,
.x-animate-scale--top-to-bottom > *.x-animate-scale--enter-active {
  transform-origin: top center;
}
.x-animate-scale--top-to-bottom.x-animate-scale--leave-active,
.x-animate-scale--top-to-bottom > *.x-animate-scale--leave-active {
  transform-origin: bottom center;
}
.x-animate-scale--bottom-to-top.x-animate-scale--enter-active,
.x-animate-scale--bottom-to-top > *.x-animate-scale--enter-active {
  transform-origin: bottom center;
}
.x-animate-scale--bottom-to-top.x-animate-scale--leave-active,
.x-animate-scale--bottom-to-top > *.x-animate-scale--leave-active {
  transform-origin: top center;
}
.x-animate-scale--left-to-right.x-animate-scale--enter-active,
.x-animate-scale--left-to-right > *.x-animate-scale--enter-active {
  transform-origin: left center;
}
.x-animate-scale--left-to-right.x-animate-scale--leave-active,
.x-animate-scale--left-to-right > *.x-animate-scale--leave-active {
  transform-origin: right center;
}
.x-animate-scale--right-to-left.x-animate-scale--enter-active,
.x-animate-scale--right-to-left > *.x-animate-scale--enter-active {
  transform-origin: right center;
}
.x-animate-scale--right-to-left.x-animate-scale--leave-active,
.x-animate-scale--right-to-left > *.x-animate-scale--leave-active {
  transform-origin: left center;
}

@keyframes containerAnimationY {
  0% {
    transform: scaleY(0);
  }
  5.5555555556% {
    transform: scaleY(0.0000762079);
  }
  11.1111111111% {
    transform: scaleY(0.0012193263);
  }
  16.6666666667% {
    transform: scaleY(0.0061728395);
  }
  22.2222222222% {
    transform: scaleY(0.0195092212);
  }
  27.7777777778% {
    transform: scaleY(0.0476299345);
  }
  33.3333333333% {
    transform: scaleY(0.0987654321);
  }
  38.8888888889% {
    transform: scaleY(0.1829751562);
  }
  44.4444444444% {
    transform: scaleY(0.3121475385);
  }
  50% {
    transform: scaleY(0.5);
  }
  55.5555555556% {
    transform: scaleY(0.6878524615);
  }
  61.1111111111% {
    transform: scaleY(0.8170248438);
  }
  66.6666666667% {
    transform: scaleY(0.9012345679);
  }
  72.2222222222% {
    transform: scaleY(0.9523700655);
  }
  77.7777777778% {
    transform: scaleY(0.9804907788);
  }
  83.3333333333% {
    transform: scaleY(0.9938271605);
  }
  88.8888888889% {
    transform: scaleY(0.9987806737);
  }
  94.4444444444% {
    transform: scaleY(0.9999237921);
  }
  100% {
    transform: scaleY(1);
  }
}
@keyframes contentAnimationY {
  0% {
    transform: scaleY(99999999);
  }
  5.5555555556% {
    transform: scaleY(13122);
  }
  11.1111111111% {
    transform: scaleY(820.125);
  }
  16.6666666667% {
    transform: scaleY(162);
  }
  22.2222222222% {
    transform: scaleY(51.2578125);
  }
  27.7777777778% {
    transform: scaleY(20.9952);
  }
  33.3333333333% {
    transform: scaleY(10.125);
  }
  38.8888888889% {
    transform: scaleY(5.4652228238);
  }
  44.4444444444% {
    transform: scaleY(3.2036132813);
  }
  50% {
    transform: scaleY(2);
  }
  55.5555555556% {
    transform: scaleY(1.4538001329);
  }
  61.1111111111% {
    transform: scaleY(1.2239529895);
  }
  66.6666666667% {
    transform: scaleY(1.1095890411);
  }
  72.2222222222% {
    transform: scaleY(1.0500120029);
  }
  77.7777777778% {
    transform: scaleY(1.019897404);
  }
  83.3333333333% {
    transform: scaleY(1.0062111801);
  }
  88.8888888889% {
    transform: scaleY(1.0012208149);
  }
  94.4444444444% {
    transform: scaleY(1.0000762137);
  }
  100% {
    transform: scaleY(1);
  }
}
@keyframes containerAnimationX {
  0% {
    transform: scaleX(0);
  }
  5.5555555556% {
    transform: scaleX(0.0000762079);
  }
  11.1111111111% {
    transform: scaleX(0.0012193263);
  }
  16.6666666667% {
    transform: scaleX(0.0061728395);
  }
  22.2222222222% {
    transform: scaleX(0.0195092212);
  }
  27.7777777778% {
    transform: scaleX(0.0476299345);
  }
  33.3333333333% {
    transform: scaleX(0.0987654321);
  }
  38.8888888889% {
    transform: scaleX(0.1829751562);
  }
  44.4444444444% {
    transform: scaleX(0.3121475385);
  }
  50% {
    transform: scaleX(0.5);
  }
  55.5555555556% {
    transform: scaleX(0.6878524615);
  }
  61.1111111111% {
    transform: scaleX(0.8170248438);
  }
  66.6666666667% {
    transform: scaleX(0.9012345679);
  }
  72.2222222222% {
    transform: scaleX(0.9523700655);
  }
  77.7777777778% {
    transform: scaleX(0.9804907788);
  }
  83.3333333333% {
    transform: scaleX(0.9938271605);
  }
  88.8888888889% {
    transform: scaleX(0.9987806737);
  }
  94.4444444444% {
    transform: scaleX(0.9999237921);
  }
  100% {
    transform: scaleX(1);
  }
}
@keyframes contentAnimationX {
  0% {
    transform: scaleX(99999999);
  }
  5.5555555556% {
    transform: scaleX(13122);
  }
  11.1111111111% {
    transform: scaleX(820.125);
  }
  16.6666666667% {
    transform: scaleX(162);
  }
  22.2222222222% {
    transform: scaleX(51.2578125);
  }
  27.7777777778% {
    transform: scaleX(20.9952);
  }
  33.3333333333% {
    transform: scaleX(10.125);
  }
  38.8888888889% {
    transform: scaleX(5.4652228238);
  }
  44.4444444444% {
    transform: scaleX(3.2036132813);
  }
  50% {
    transform: scaleX(2);
  }
  55.5555555556% {
    transform: scaleX(1.4538001329);
  }
  61.1111111111% {
    transform: scaleX(1.2239529895);
  }
  66.6666666667% {
    transform: scaleX(1.1095890411);
  }
  72.2222222222% {
    transform: scaleX(1.0500120029);
  }
  77.7777777778% {
    transform: scaleX(1.019897404);
  }
  83.3333333333% {
    transform: scaleX(1.0062111801);
  }
  88.8888888889% {
    transform: scaleX(1.0012208149);
  }
  94.4444444444% {
    transform: scaleX(1.0000762137);
  }
  100% {
    transform: scaleX(1);
  }
}
</style>
