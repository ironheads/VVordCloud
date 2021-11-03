<template>
  <v-app v-cloak :theme="theme">
    <v-navigation-drawer app v-model="drawer" >
      <div style="padding: 8px;">
        <v-switch
          class="ma-0 pa-0"
          hide-details
          label="显示进度"
          v-model="progressVisible"
        ></v-switch>
			</div>
			<v-divider></v-divider>
      <div style="display: grid; gap: 8px; padding: 8px;">
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
      </div>
      <v-divider></v-divider>
      <div style="display: grid; gap: 16px;padding: 8px;">
        <v-select :items="fontFamilyValues" filled label="字体" v-model="fontFamily"></v-select>
      </div>
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
        <Figure :words="words" :color="color" :font-family="fontFamily"> </Figure>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Figure from './components/Figure'
import 'chance'
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
      'Gloria Hallelujah',
      'Indie Flower',
      'Life Savers',
      'Londrina Sketch',
      'Love Ya Like A Sister',
      'Merienda',
      'Nothing You Could Do',
      'Pacifico',
      'Quicksand',
      'Righteous',
      'Sacramento',
      'Shadows Into Light',
    ]
  }),
  components: {
    Figure
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
    }
  },

  created: function () {
    // var chance = new Chance(Math.random())
    this.generateWordsText()
    this.colorItemIndex = chance.integer({ min: 0, max: this.colorItems.length - 1 })
    this.fontFamily = chance.pickone(this.fontFamilyValues)
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
      console.log(this.colorItemIndex)
      return function () {
        return chance.pickone(colors)
      }
    }
  }
}
</script>
