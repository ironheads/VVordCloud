<template>
  <transition>
    <div
      :key="left.toString()+top.toString()"
      :style="{
                  left: `${left}px`,
                  position: 'absolute',
                  top: `${top}px`,
                  ...((separateAnimationDuration > 0)
                    ? {
                      animation: [
                          `${separateAnimationDuration}ms`,
                          animationEasing,
                          `${separateAnimationDelay * index}ms`
                      ].join(' '),
                      transition: [
                        'all',
                          `${separateAnimationDuration}ms`,
                          animationEasing,
                          `${separateAnimationDelay * index}ms`
                      ].join(' ')
                    }
                    : {}
                  )
                }
      ">

      <div v-bind:style="{
                  bottom: '50%',
                      color: (hover)?'green':color,
                      font: font,
                      position: 'absolute',
                      right: '50%',
                      transform: [
                        'translate(50%,50%)',
                        `rotate(${rotation}rad)`,
                      ].join(' '),
                      whiteSpace: 'nowrap',
                  }"
      >
        <v-tooltip top>
          <template v-slot:activator="{on}">
            <div
              style="cursor: pointer;"
              v-on="on"
              @mouseover="hover = true"
              @mouseout="hover = false"
            >
              {{ text }}
            </div>
          </template>
          <div
            style="text-align: center;"
          >词：{{ text }}<br/>权重：{{ weight }}</div>
        </v-tooltip>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  name: 'WordElement',
  props: {
    index: {
      type: Number,
      default: undefined
    },
    text: {
      type: String,
      default: 'Default'
    },
    font: {
      type: String,
      default: 'normal 1px'
    },
    weight: {
      type: Number,
      default: 5
    },
    color: {
      type: String,
      default: 'green'
    },
    rotation: {
      type: Number,
      default: 0
    },
    left: {
      type: Number,
      default: 0
    },
    top: {
      type: Number,
      default: 0
    },
    separateAnimationDuration: {
      type: Number,
      default: 0
    },
    animationEasing: {
      type: String,
      default: 'ease'
    },
    separateAnimationDelay: {
      type: Number,
      default: 0
    }
  },
  data: () => ({
    hover: false
  })
}
</script>
