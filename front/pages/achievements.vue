<template>
  <div class="pt-10 pb-10 pr-10 pl-10">
    <v-row justify="center">
      <p class="white--text text-h4 neonTextYellow"> Achievements :</p>
    </v-row>
    <v-row justify="center">
      <div v-for="(key, i) in achievementsList" :key="i">
        <AchievementCard :achievement="key" class="achievements-card-yellow" :value="getAchievementValue(key.title)"/>
      </div>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator';
import Vue from 'vue'
import login from '../middleware/login';
import { Achievements, AchievementsList } from '../assets/Classes-ts/Achievements'

export default Vue.extend({
  
  middleware: 'login',

  data() {
    return {
      achievementsList: new Object(),
      achievementsUser: Array<Achievements>(),
    }
  },

  async mounted() {
    // this.achievementsList = AchievementsList
    var ret = await this.$axios.get('/api/profile/me/achievements').then()
    var retAll = await this.$axios.get('/api/achievements')
    this.achievementsUser = ret.data
    this.achievementsList = retAll.data
    console.log(this.achievementsList)
    console.log(this.achievementsUser)
  },

  methods: {
    
    getAchievementValue(title: string): string {
      var achievement = this.achievementsUser.find(el => el.title == title)
      if (achievement)
      {
        return Math.min(((achievement.count / achievement.goal) * 100), 100).toFixed(1)
      }
      return "0"
    },


    test(): number {
      return (50)
    }
  }
})

</script>

<style>
</style>