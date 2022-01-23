<template>
<v-card color="#181818" height="558" flat>
  <v-card-title  class="white--text text-h5 font-weight-medium justify-center" style="font-family: OrbitronM !important">
    Achievements
  </v-card-title>
  <v-row justify="center" class="pt-9">
    <div  style="min-width: 200px" v-for="(key, i) in achievementsPage" :key="i">
      <AchievementCard class="mb-4" neonColor="yellow" :achievement="key" :value="getValuePercent(key)" />
    </div>
  </v-row>

  <div class="custom-position-bottom-center d-flex flex-row mb-2 justify-center">
    <BasicBtn @click="previousPage()" content="mdi-arrow-left" :disable="page <= 1" class="mr-1 mt-1" />
      <span class="mr-1 ml-1 neonText-purple" style="font-size: 180%">{{ page }} </span>
    <BasicBtn @click="nextPage()" content="mdi-arrow-right" :disable="page >= totalPage" class="ml-1 mt-1" />
    <span v-if="achievementsList.length == 0" class="white--text text-h7" style="font-family: OrbitronM">No game played</span>
  </div>
</v-card>
</template>

<script lang="ts">
import { Component, Prop } from 'nuxt-property-decorator'
import Vue from 'vue'
import { Achievements } from '../../assets/Classes-ts/Achievements'
import { User } from '../../assets/Classes-ts/User'



@Component({})
export default class OwnAchievement extends Vue {
  
  @Prop({ type: Boolean, default: false})
  completedOnly!: Boolean

	@Prop({ type: Object, default: new User() })
	user!: User

  page: number = 1
  numberAchievementByPage: number = 4
  totalPage: number = 0

  achievementsList: Array<Achievements> = new Array<Achievements>()
  achievementsPage: Array<Achievements> = new Array<Achievements>()

  async mounted() {
    var ret = await this.$axios.get('/api/users/' + this.user.id + '/achievements' + this.isCompletedOnly())
    this.achievementsList = ret.data
    this.achievementsPage = this.achievementsList.slice(0, this.numberAchievementByPage)
    console.log(this.achievementsList.length)
    console.log(this.numberAchievementByPage)
    this.totalPage = Math.ceil(this.achievementsList.length / this.numberAchievementByPage)
    this.myEventHandler(window.innerWidth)
  }

  created() {
    window.addEventListener("resize", this.myEventHandler);
  }

  destroyed() {
    window.removeEventListener("resize", this.myEventHandler);
  }

  myEventHandler(e) {
    console.log(window.innerWidth)
    if (window.innerWidth >= 1888)
      this.numberAchievementByPage = 8
    else if (window.innerWidth >= 1432 && window.innerWidth < 1888)
      this.numberAchievementByPage = 6
    else if (window.innerWidth < 1432 && window.innerWidth >= 960)
      this.numberAchievementByPage = 4
    else if (window.innerWidth < 960 && window.innerWidth >= 944)
      this.numberAchievementByPage = 8
    else if (window.innerWidth < 944 && window.innerWidth >= 708)
      this.numberAchievementByPage = 6
    else if (window.innerWidth < 472)
      this.numberAchievementByPage = 2
    else
      this.numberAchievementByPage = 4
    this.totalPage = Math.ceil(this.achievementsList.length / this.numberAchievementByPage)
    this.switchPage()
  }

  getValuePercent(achievement: Achievements): string {
    return Math.min(((achievement.count / achievement.goal) * 100), 100).toFixed(1)
  }

  isCompletedOnly(): string {
    if (this.completedOnly == true)
      return "?filter=completed"
    return ""
  }
  
  switchPage() {
    this.achievementsPage = this.achievementsList.slice((this.page - 1) * this.numberAchievementByPage, this.page * this.numberAchievementByPage)
  }

  nextPage() {
    this.page = this.page < this.totalPage ? this.page + 1 : this.page;
    this.switchPage()
  }

  previousPage() {
    this.page = this.page > 1 ? this.page - 1 : this.page;
    this.switchPage()
  }
  
}
</script>

<style>
@import '../../assets/Classes-scss/custom_flexBox.scss';
@import '../../assets/Classes-scss/neonText_colors.scss';
</style>