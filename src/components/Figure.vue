
<script>
import Word from '@/utils/Word'
import { constFunction, convertMap, isObject, isString, stubNullFunction } from '@/utils/BasicOps'

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
      default: constFunction({opacity: 0})
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
      default: '0.25'
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
    animationOptions () {
      const {
        animationDuration,
        enterAnimation,
        leaveAnimation
      } = this
      if (isString(enterAnimation) && isString(leaveAnimation)) {
        return {
          props: {
            duration: animationDuration,
            appear: true,
            appearActiveClass: enterAnimation,
            enterActiveClass: enterAnimation,
            leaveActiveClass: leaveAnimation
          }
        }
      }
      if (isObject(enterAnimation) && isObject(leaveAnimation)) {
        const remainAnimation = convertMap(
          {
            ...enterAnimation,
            ...leaveAnimation
          },
          stubNullFunction
        )
        const beforeEnter = (el) => {
          Object.assign(el.style, enterAnimation)
        }
        const enter = (el, done) => {
          setTimeout(
            () => {
              Object.assign(el.style, remainAnimation)
              setTimeout(done, animationDuration)
            },
            1
          )
        }
        const leave = (el, done) => {
          Object.assign(el.style, leaveAnimation)
          setTimeout(done, animationDuration)
        }
        const beforeAppear = beforeEnter
        const appear = enter
        return {
          props: {
            css: false
          },
          on: {
            beforeAppear,
            appear,
            beforeEnter,
            enter,
            leave
          }
        }
      }

      return {}
    },
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
    // console.log('beforeCreated')
    // this.updateElementSize()
  },

  mounted () {
    console.log('mounted')
    // console.log(this.$el)
    this.updateElementSize()

    this.$asyncComputed.Word.update()
  },
  render (createElement) {
    let {
      $scopedSlots,
      animationEasing,
      animationOptions,
      Word,
      separateAnimationDelay,
      separateAnimationDuration
    } = this
    // console.log($scopedSlots)
    $scopedSlots = {
      default ({ text }) {
        // console.log(text)
        return text
      },
      ...$scopedSlots
    }
    // console.log($scopedSlots)
    return createElement(
      'div',
      {
        style: {
          height: '100%',
          position: 'relative',
          width: '100%'
        }
      },
      [createElement(
        'div',
        {
          style: {
            bottom: '50%',
            position: 'absolute',
            right: '50%',
            transform: 'translate(50%,50%)'
          }
        },
        Word.map(({
          color,
          font,
          left,
          rotation,
          text,
          top,
          weight,
          word
        }, index) => createElement(
          'transition',
          { ...animationOptions },
          [createElement(
            'div',
            {
              key: index,
              style: {
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
            },
            [createElement(
              'div',
              {
                style: {
                  bottom: '50%',
                  color: color,
                  font: font,
                  position: 'absolute',
                  right: '50%',
                  transform: [
                    'translate(50%,50%)',
                    `rotate(${rotation}rad)`
                  ].join(' '),
                  whiteSpace: 'nowrap',
                  ...((separateAnimationDuration > 0)
                    ? {
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
              },
              [$scopedSlots.default({
                color,
                font,
                left,
                text,
                top,
                weight,
                word
              })]
            )]
          )]
        ))
      )]
    )
  }

}
</script>
