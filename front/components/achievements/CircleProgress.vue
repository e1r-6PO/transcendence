<template>
  <v-progress-circular
      :rotate="-90"
      :size="75"
      :width="10"
      :color="value == '100.0' ? '#0affff': '#fc6500'"
      :class="value == '100.0' ? 'circular-light-blue': 'test'"
      :value="value"
    >
      {{ value }}%
    </v-progress-circular>
</template>

<script lang="ts">
import { Component, Prop } from 'nuxt-property-decorator'
import Vue from 'vue'
import { Achievements } from '../../assets/Classes-ts/Achievements'

@Component({})
export default class AchievementCard extends Vue{

  @Prop({default: 0})
  value!: Number | String

}
</script>

<style>

.test{
	border-radius: 100% !important;
  border: 1px solid #ffa768 !important;
	box-shadow: inset 0px 0px 15px 0px #fc6500, 0px 0px 15px 0px #fc6500 !important;

}

.circular-light-blue{
	border-radius: 100% !important;
  border: 1px solid #a5fafa !important;
	box-shadow: inset 0px 0px 20px 0px #0affff, 0px 0px 15px 0px #0affff !important;

}

.circular-gold{
	border-radius: 100% !important;
  border: 1px solid #fff9d7 !important;
	box-shadow: inset 0px 0px 20px 0px #FFD700, 0px 0px 15px 0px #FFD700 !important;

}

.circular-yellow{
	border-radius: 100% !important;
  border: 1px solid #f7e687 !important;
	box-shadow: inset 0px 0px 20px 0px #b8a435, 0px 0px 15px 1px #b8a435 !important;

}
</style>