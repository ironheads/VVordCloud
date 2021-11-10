<template>
  <v-app v-cloak :theme="theme">
    <v-navigation-drawer app v-model="drawer" >
      <v-card style="display: grid; gap: 8px;padding: 8px;">
        <v-select :items="fontFamilyValues" filled label="字体" v-model="fontFamily"></v-select>
      </v-card>
      <v-card style="display: grid; gap: 8px; padding: 8px;">
      <v-textarea
          :rows="9"
          variant
          label="词 & 权重"
          v-model='wordsText'
          ></v-textarea>
        <v-btn
          block
          color="primary"
          @click="generateWordsText"
        >随机生成</v-btn>
      </v-card>
      <v-card>
      <div>
        <v-subheader>颜色</v-subheader>
        <v-card-text>
            <v-btn-toggle
              dense
              mandatory
              v-model="colorItemIndex"
            >
              <v-btn
                v-for="(item, itemIndex) in colorItems"
                :key="itemIndex"
                :value="itemIndex"
                icon
              >
                <div
                  style="
                        display: flex;
                        height: 24px;
                        margin: 2px;
                        width: 24px;
                      "
                >
                  <div
                    v-for="(color,index) in item"
                    :key="index"
                    :style="{backgroundColor: color}"
                    style="flex: 1 1 0%;"
                  ></div>
                </div>
              </v-btn>
            </v-btn-toggle>
          </v-card-text>
      </div>
      </v-card>
<!--      <v-divider></v-divider>-->
      <v-card>
        <v-subheader>旋转角度范围</v-subheader>
        <v-range-slider
          v-model.lazy="rotationRate"
          :min="-90"
          :max="90"
          thumb-label
          prepend-icon="mdi-format-text-rotation-angle-up"
          append-icon="mdi-format-text-rotation-angle-down"
          step="15"
        ></v-range-slider>
      </v-card>
    </v-navigation-drawer>
    <v-app-bar app dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>词云</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn href="https://github.com/ironheads/VVordCloud" icon target="_blank">
        <v-icon>mdi-github</v-icon>
			</v-btn>
    </v-app-bar>
    <v-main>
      <v-container fill-height overflow-hidden>
        <word-cloud-figure
          :words="words"
          :color="color"
          :font-family="fontFamily"
          :rotation-unit="'deg'"
          :rotation="rotation"
        >
        </word-cloud-figure>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import 'chance'
import WordCloudFigure from '@/components/WordCloudFigure'
export default {
  name: 'App',
  props: {
  },
  data: () => ({
    drawer: true,
    theme: 'light',
    progressVisible: true,
    wordsText: undefined,
    chance: new Chance(Math.random),
    colorItemIndex: undefined,
    colorItems: [
      ['#d99cd1', '#c99cd1', '#b99cd1', '#a99cd1'],
      ['#99f574', '#be3d3d'],
      ['#a1ec88', '#eed35f', '#f1a674'],
      ['#ffd077', '#53f2f6', '#3ba4f5', '#fa536c', '#461e47']
    ],
    fontFamily: undefined,
    fontFamilyValues: [
      'Abril Fatface',
      'Annie Use Your Telescope',
      'Anton',
      'Bahiana',
      'Baloo Bhaijaan',
      'Barrio',
      'Finger Paint',
      'Fredericka the Great',
      'Indie Flower',
      'Life Savers',
      'Londrina Sketch',
      'Love Ya Like A Sister',
      'Merienda',
      'Nothing You Could Do',
      'Pacifico',
      'Quicksand',
      'Righteous',
    ],
    loadFont: function (fontFamily, fontStyle, fontWeight, text) {
      return (new FontFaceObserver(fontFamily, { style: fontStyle, weight: fontWeight })).load(text)
    },
    rotationRate: undefined
  }),
  components: {
    WordCloudFigure
  },
  methods: {
    generateWordsText: function () {
      this.wordsText = [
        [9, 1, 3],
        [4, 5, 15],
        [2, 5, 15],
        [1, 25, 150]
      ]
        .reduce(function (returns, item) {
          var weight = item[0]
          var minCount = item[1]
          var maxCount = item[2]
          var count = chance.integer({ min: minCount, max: maxCount })
          chance.n(function () {
            var word = chance.word()
            returns.push(word + ' ' + weight)
          }, count)
          return returns
        }, [])
        .join('\n')
    },
    MoveIn: function () {
      console.log(this)
    },
    MoveOut: function () {
      console.log(this)
    }
  },

  created: function () {
    // var chance = new Chance(Math.random())
    this.generateWordsText()
    this.colorItemIndex = chance.integer({ min: 0, max: this.colorItems.length - 1 })
    this.fontFamily = chance.pickone(this.fontFamilyValues)
    this.rotationRate = [-30, 30]
    // console.log(this.rotation())
  },

  computed: {
    words: function () {
      return this.wordsText
        .split(/[\r\n]+/)
        .map(function (line) {
          return /^(.+)\s+(-?\d+)$/.exec(line)
        })
        .filter(function (matched) {
          return matched
        })
        .map(function (matched) {
          var text = matched[1]
          var weight = Number(matched[2])
          return [text, weight]
        })
    },
    color: function () {
      var colors = this.colorItems[this.colorItemIndex]
      // console.log(this.colorItemIndex)
      return function () {
        return chance.pickone(colors)
      }
    },
    rotation: function () {
      const minval = this.rotationRate[0]
      const maxval = this.rotationRate[1]
      return function () {
        return chance.integer({ min: minval, max: maxval })
      }
    }
  }
}
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Abril+Fatface|Annie+Use+Your+Telescope|Anton|Bahiana|Baloo+Bhaijaan|Barrio|Finger+Paint|Fredericka+the+Great|Gloria+Hallelujah|Indie+Flower|Life+Savers|Londrina+Sketch|Love+Ya+Like+A+Sister|Merienda|Nothing+You+Could+Do|Pacifico|Quicksand|Righteous|Roboto:100,300,400,500,700,900|Sacramento|Shadows+Into+Light");
</style>
