<template>
  <v-app v-cloak :theme="theme">
    <v-navigation-drawer app v-model="drawer" >
      <div style="padding: 8px;">
        <v-switch
          class="ma-0 pa-0"
          hide-details
          label="show progress"
          v-model="progressVisible"
        ></v-switch>
			</div>
			<v-divider></v-divider>
      <div style="display: grid; gap: 8px; padding: 8px;">
      <v-textarea
          :rows="9"
          variant
          label="words & weights"
          v-model='wordsText'
          ></v-textarea>
        <v-btn
          block
          color="primary"
          @click="generateWordsText"
        >generate randomly</v-btn>
      </div>	
      <v-divider></v-divider>
    </v-navigation-drawer>
    <v-app-bar app dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>词云</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn href="https://github.com/ironheads/VVordCloud" icon target="_blank">
        <v-icon>mdi-github</v-icon>
			</v-btn>
    </v-app-bar>
    <v-content>
      <v-container fill-height overflow-hidden>
        <Figure/>
      </v-container>
    </v-content>
  </v-app>
</template>


<script>
import Figure from './components/Figure'
import 'chance'
export default {
  name: 'App',
  props:{
  },
  data: () => ({
    drawer: false,
    theme: "light",
    progressVisible: true,
    wordsText: undefined,
  }),
  components: {
    Figure
  },
  methods: {
    generateWordsText: function() {
        var chance = new Chance(Math.random);
				this.wordsText = [
					[9, 1, 3],
					[4, 5, 15],
					[2, 5, 15],
					[1, 25, 150],
				]
					.reduce(function(returns, item) {
						var weight = item[0];
						var minCount = item[1];
						var maxCount = item[2];
						var count = chance.integer({min: minCount, max: maxCount});
						chance.n(function() {
							var word = chance.word();
							returns.push(word+' '+weight);
						}, count);
						return returns;
					}, [])
					.join('\n');
			}
  },
  created: function() {
    this.generateWordsText()
  },
  computed: {
    words: function() {
				return this.wordsText
					.split(/[\r\n]+/)
					.map(function(line) {
						return /^(.+)\s+(-?\d+)$/.exec(line);
					})
					.filter(function(matched) {
						return matched;
					})
					.map(function(matched) {
						var text = matched[1];
						var weight = Number(matched[2]);
						return [text, weight];
					});
			},
  }
}
</script>
