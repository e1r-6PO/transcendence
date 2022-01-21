<template>
  <v-progress-circular
      :rotate="-90"
      :size="75"
      :width="10"
      :color="value == '100.0' ? '#a5fafa': '#fc6500'"
      :class="value == '100.0' ? 'success-circular': 'test'"
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