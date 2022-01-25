<template>
  <v-card :class="'achievements-card-' + neonColor" class="white--text ml-2 mr-2 mt-4" :width="!width ? 220: width" align="center">
    <v-list-item>
    <v-list-item-content>
    <v-list-item-title v-text="achievement.title"
      align="start"
      class="white--text text-h6 pl-1 pb-2"
      :class="value == '100.0' ? 'neonText-light-blue': 'neonText'"
    />
    <v-list-item-subtitle v-text="achievement.action" class="white--text" align="start" />
    </v-list-item-content>
    <v-icon
      color="white"
      :class="value == '100.0' ? 'neonText-light-blue': 'neonText'"
    >
      {{ achievement.icon }}
    </v-icon>
    </v-list-item>
    <v-card-actions class="justify-center pt-0 pb-4">
      <CircleProgress :value="value" />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop } from 'nuxt-property-decorator'
import Vue from 'vue'
import { Achievements } from '../../assets/Classes-ts/Achievements'

@Component({})
export default class AchievementCard extends Vue{
  
  @Prop({ type: Object, default: new Achievements()})
  achievement!: Achievements

  @Prop({ default: 0 })
	value!: Number | String
	
	@Prop({ default: 0 })
  width!: Number | String

  @Prop({ type: String, default: 'purple'})
  neonColor!: String

}
</script>

<style>
@import '../../assets/Classes-scss/neonText_colors.scss';

.achievements-card-purple {
	border: 3px solid #cd78ff !important;
	box-shadow: inset 0px 0px 30px 0px #a200ff, 0px 0px 15px 0px #a200ff !important;
	border-radius: 15px !important;
	background-color: #181818 !important;
	/* min-width: 260px; */
	/* width: 275px; */
}

.achievements-card-light-blue {
	border: 3px solid #a5fafa !important;
	box-shadow: inset 0px 0px 30px 0px #0affff, 0px 0px 15px 0px #0affff !important;
	border-radius: 15px !important;
	background-color: #181818 !important;
	/* min-width: 260px; */
	/* width: 275px; */
}

.achievements-card-yellow {
	border: 3px solid #f7e687 !important;
	box-shadow: inset 0px 0px 30px 0px #b8a435, 0px 0px 15px 0px #b8a435 !important;
	border-radius: 15px !important;
	background-color: #181818 !important;
	/* min-width: 150px; */
	/* width: 95%; */
	/* max-width: 250px; */
}

.achievements-card-red {
	border: 3px solid #d14949 !important;
	box-shadow: inset 0px 0px 30px 0px #d61c1c, 0px 0px 15px 0px #d61c1c !important;
	border-radius: 15px !important;
	background-color: #181818 !important;
	/* min-width: 260px; */
	/* width: 275px; */
}

.achievements-card-blue {
	border: 3px solid #3c58d3 !important;
	box-shadow: inset 0px 0px 30px 0px #1b019b, 0px 0px 15px 0px #1b019b !important;
	border-radius: 15px !important;
	background-color: #181818 !important;
	/* min-width: 260px; */
	/* width: 275px; */
}

.achievements-card-green {
	border: 3px solid #82e492 !important;
	box-shadow: inset 0px 0px 30px 0px #32c44a, 0px 0px 15px 0px #32c44a !important;
	border-radius: 15px !important;
	background-color: #181818 !important;
	/* min-width: 260px; */
	/* width: 275px; */
}

.achievements-card-orange {
	border: 3px solid #ffa768 !important;
	box-shadow: inset 0px 0px 30px 0px #fc6500, 0px 0px 15px 0px #fc6500 !important;
	border-radius: 15px !important;
	background-color: #181818 !important;
	/* min-width: 260px; */
	/* width: 275px; */
}

.achievements-card-pink {
	border: 3px solid #ee8be9 !important;
	box-shadow: inset 0px 0px 30px 0px #e232d9, 0px 0px 15px 0px #e232d9 !important;
	border-radius: 15px !important;
	background-color: #181818 !important;
	/* min-width: 260px; */
	/* width: 275px; */
}

.achievements-card-white {
	border: 3px solid #ece3e3 !important;
	box-shadow: inset 0px 0px 30px 0px #dfdfdf, 0px 0px 15px 0px #dfdfdf !important;
	border-radius: 15px !important;
	background-color: #181818 !important;
	/* min-width: 260px; */
	/* width: 275px; */
}
</style>