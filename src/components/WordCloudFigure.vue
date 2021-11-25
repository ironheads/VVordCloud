<template>
  <div style="height: 100%; position: relative;width:100%;">
    <div style="bottom: 50%; position: absolute;right: 50%;transform: translate(50%, 50%)">
      <word-element
                    transition
                    v-for="(item, index) in Word"
                    :key="item.text+index"
                    :index="index"
                    :text="item.text"
                    :color="item.color"
                    :animation-easing="animationEasing"
                    :separate-animation-duration="separateAnimationDuration"
                    :separate-animation-delay="separateAnimationDelay"
                    :font="item.font"
                    :left="item.left"
                    :top="item.top"
                    :weight="item.weight"
                    :rotation="item.rotation"
      >
      </word-element>
    </div>
  </div>
</template>
<script>
import Word from '@/utils/Word'
import WordElement from '@/components/WordElement'
export default {
  name: 'WordCloudFigure',
  props: {
    animationDuration: {
      type: Number,
      default: 1000
    },

    animationEasing: {
      type: String,
      default: 'ease'
    },

    animationOverlap: {
      type: Number,
      default: 1
    },

    color: {
      type: [String, Function],
      default: 'Black'
    },

    createCanvas: {
      type: Function,
      default () {
        return document.createElement('canvas')
      }
    },

    createWorker: {
      type: Function,
      default (func) {
        return new Worker(URL.createObjectURL(new Blob([`(${func.toString()})()`])))
        // return new Worker(code)
      }
    },

    fontFamily: {
      type: [String, Function],
      default: 'serif'
    },

    fontStyle: {
      type: [String, Function],
      default: 'normal'
    },

    fontVariant: {
      type: [String, Function],
      default: 'normal'
    },

    fontWeight: {
      type: [String, Function],
      default: 'normal'
    },

    loadFont: {
      type: Function,
      default (fontFamily, fontStyle, fontWeight, text) {
        return document.fonts.load([fontStyle, fontWeight, '1px', fontFamily].join(' '), text)
      }
    },

    rotation: {
      type: [Number, Function],
      default: 0.125
    },

    rotationUnit: {
      type: [String, Function],
      default: 'turn'
    },

    spacing: {
      type: Number,
      default: 0.15
    },

    text: {
      type: [String, Function],
      default: ''
    },

    weight: {
      type: [Number, Function],
      default: 1
    },
    words: {
      type: Array,
      default: () => { return [] }
    },
    level: {
      type: Number,
      default: 1
    }
  },
  data: () => ({
    elementWidth: undefined,
    elementHeight: undefined
  }),

  asyncComputed: {
    Word
  },

  watch: {

  },

  computed: {
    normalizedAnimationOverlap () {
      let { animationOverlap } = this
      animationOverlap = Math.abs(animationOverlap)
      if (animationOverlap === 0) {
        animationOverlap += 0.1
      }
      if (animationOverlap < 1) {
        animationOverlap = 1 / animationOverlap
      }
      return animationOverlap
    },
    separateAnimationDelay () {
      const { Word } = this
      if (Word.length > 1) {
        const {
          animationDuration,
          separateAnimationDuration
        } = this
        return (animationDuration - separateAnimationDuration) / (Word.length - 1)
      }
      return 0
    },
    separateAnimationDuration () {
      const { Word } = this
      if (Word.length > 0) {
        const {
          animationDuration,
          normalizedAnimationOverlap: animationOverlap
        } = this
        return animationDuration / Math.min(animationOverlap, Word.length)
      }
      return 0
    }
  },
  components: {
    WordElement
  },

  methods: {
    updateElementSize () {
      const { $el } = this
      if ($el) {
        this.elementWidth = $el.offsetWidth
        this.elementHeight = $el.offsetHeight
      }
    }
  },

  created () {
  },

  beforeCreate () {
  },

  mounted () {
    this.updateElementSize()
    var elementResizeDetectorMaker = require('element-resize-detector')
    var erd = elementResizeDetectorMaker()
    const that = this
    erd.listenTo(this.$el, function (element) {
      that.elementWidth = element.offsetWidth
      that.elementHeight = element.offsetHeight
    })
  }
}
</script>
