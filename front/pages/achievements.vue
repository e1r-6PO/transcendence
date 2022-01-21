<template>
  <div class="pt-10 pb-10">
    <v-row justify="center">
      <div v-for="(key, i) in achievementsList" :key="i">
        <AchievementCard :achievement="key" :value="getAchievementValue(key.title)"/>
        <!-- <v-list-item>
        <v-list-item-content>
        <v-list-item-title v-text="key.title"
          align="start"
          class="white--text text-h6 pl-1 pb-2"
          :class="getAchievementValue(key.title) == '100.0' ? 'neonText-light-blue': 'neonText'"
        />
        <v-list-item-subtitle v-text="key.action" class="white--text" align="start" />
        </v-list-item-content>
        <v-icon
          color="white"
          :class="getAchievementValue(key.title) == '100.0' ? 'neonText-light-blue': 'neonText'"
        >
          {{ key.icon }}
        </v-icon>
        </v-list-item>
        <v-card-actions class="justify-center pt-0 pb-4">
        <v-progress-circular
          :rotate="-90"
          :size="75"
          :width="10"
          :color="getAchievementValue(key.title) == '100.0' ? '#a5fafa': '#fc6500'"
          :class="getAchievementValue(key.title) == '100.0' ? 'success-circular': 'test'"
          :value="getAchievementValue(key.title)"
        >
          {{ getAchievementValue(key.title) }}%
        </v-progress-circular>
        </v-card-actions> -->
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
.card {
	border: 3px solid #cd78ff !important;
	box-shadow: inset 0px 0px 30px 0px #a200ff, 0px 0px 15px 0px #a200ff !important;
	border-radius: 15px !important;
	background-color: #181818 !important;
	min-width: 260px;
	width: 275px;
}

.test{
	border-radius: 100% !important;
  border: 1px solid #ffa768 !important;
	box-shadow: inset 0px 0px 15px 0px #fc6500, 0px 0px 15px 0px #fc6500 !important;

}

.success-circular{
	border-radius: 100% !important;
  border: 1px solid #a5fafa !important;
	box-shadow: inset 0px 0px 20px 0px #0affff, 0px 0px 15px 0px #0affff !important;

}
</style>