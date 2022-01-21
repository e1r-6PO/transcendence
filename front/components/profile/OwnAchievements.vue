<template>
<div class="pt-4 pb-5">
  <p class="white--text text-h5 font-weight-medium mb-8" style="font-family: OrbitronM !important">
    Achievements
  </p>
  <v-row justify="center">
    <div v-for="(key, i) in achievementsList" :key="i">
      <AchievementCard :achievement="key" :value="getValuePercent(key)" />
    </div>
  </v-row>
</div>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import Vue from 'vue'
import { Achievements } from '../../assets/Classes-ts/Achievements'

@Component({})
export default class OwnAchievement extends Vue {
  
  achievementsList: Array<Achievements> = new Array<Achievements>()

  async mounted() {
    this.achievementsList = await this.$axios.$get('/api/profile/me/achievements?filter=completed')
  }

  getValuePercent(achievement: Achievements): string {
    return Math.min(((achievement.count / achievement.goal) * 100), 100).toFixed(1)
  }
}
</script>