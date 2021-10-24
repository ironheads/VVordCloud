
<script>
export default {
    name: 'WordCloudFigure',
    props: {
        animationDuration: {
            type: Number,
            default: 1000,
        },

        animationEasing: {
            type: String,
            default: 'ease',
        },

        animationOverlap: {
            type: Number,
            default: 1,
        },

        color: {
            type: [String, Function],
            default: 'Black',
        },

        createCanvas: {
            type: Function,
            default() {
                return document.createElement('canvas');
            },
        },

        createWorker: {
            type: Function,
            default(code) {
                return new Worker(URL.createObjectURL(new Blob([code])));
            },
        },

        enterAnimation: {
            type: [Object, String],
            default: '{opacity: 0}',
        },

        fontFamily: {
            type: [String, Function],
            default: 'serif',
        },

        fontSizeRatio: {
            type: Number,
            default: 0,
        },

        fontStyle: {
            type: [String, Function],
            default: 'normal',
        },

        fontVariant: {
            type: [String, Function],
            default: 'normal',
        },

        fontWeight: {
            type: [String, Function],
            default: 'normal',
        },

        leaveAnimation: {
            type: [Object, String],
            default: '{opacity: 0}',
        },

        loadFont: {
            type: Function,
            default(fontFamily, fontStyle, fontWeight, text) {
                return document.fonts.load([fontStyle, fontWeight, '1px', fontFamily].join(' '), text);
            },
        },

        rotation: {
            type: [Number, Function],
            default: 0,
        },

        rotationUnit: {
            type: [String, Function],
            default: 'turn',
        },

        spacing: {
            type: Number,
            default: 0,
        },

        text: {
            type: [String, Function],
            default: '',
        },

        weight: {
            type: [Number, Function],
            default: 1,
        },

        words: {
            type: Array,
            default: [],
        },
        level:{
            type: Number,
            default: 1,
        }
    },
    data: () => ({
        
    }),

    computed:{

    },
    components:{
    },
    methods:{

    },
    // render: function (createElement) {
    //     return createElement(
    //         'h' + this.level,   // 标签名称
    //         // this.$slots.default // 子节点数组
    //         this.animationEasing
    //     )
    // }
}
</script>