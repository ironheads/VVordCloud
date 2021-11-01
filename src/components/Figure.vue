<template>
  <div>somethinghappens</div>
</template>>

<script>
import Word from '@/components/Word'

export default {
  name: 'wordCloudFigure',
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

    enterAnimation: {
      type: [Object, String],
      default: '{opacity: 0}'
    },

    fontFamily: {
      type: [String, Function],
      default: 'serif'
    },

    fontSizeRatio: {
      type: Number,
      default: 0
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

    leaveAnimation: {
      type: [Object, String],
      default: '{opacity: 0}'
    },

    loadFont: {
      type: Function,
      default (fontFamily, fontStyle, fontWeight, text) {
        return document.fonts.load([fontStyle, fontWeight, '1px', fontFamily].join(' '), text)
      }
    },

    rotation: {
      type: [Number, Function],
      default: 0
    },

    rotationUnit: {
      type: [String, Function],
      default: 'turn'
    },

    spacing: {
      type: Number,
      default: 0
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
    test: 34
  }),

  asyncComputed: {
    Word
  },

  watch: {
    // Word: (val) => {
    //   this.$emit('Update:Word', val)
    // }
  },

  computed: {

  },
  components: {

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
  // render: function (createElement) {
  //   // let {$scopedSlots,test}=this;
  //   return createElement(
  //     'h' + this.level, // 标签名称
  //     // this.$slots.default // 子节点数组
  //     test
  //   )
  // }
  created () {
  },

  beforeCreate () {
    // console.log('beforeCreated')
    // this.updateElementSize()
  },

  mounted () {
    console.log('mounted')
    // console.log(this.$el)
    this.updateElementSize()

    this.$asyncComputed.Word.update()
  }
}
</script>
