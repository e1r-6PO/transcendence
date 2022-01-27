<template>
  <div class="pt-15 pb-10 pr-10 pl-10">
    <v-row justify="center">
      <p class="white--text text-h4 neonTextYellow" style="font-family: OrbitronM !important; font-size: 225% !important"> Achievements :</p>
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

  head() {
    return {
      title: 'Achievements' 
    }
  },

  data() {
    return {
      achievementsList: new Object(),
      achievementsUser: Array<Achievements>(),
    }
  },

  async mounted() {
    var ret = await this.$axios.get('/api/profile/me/achievements').then()
    var retAll = await this.$axios.get('/api/achievements')
    this.achievementsUser = ret.data
    this.achievementsList = retAll.data
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