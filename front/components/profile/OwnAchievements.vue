<template>
<div class="pt-4">
  <p class="white--text text-h5 font-weight-medium mb-8" style="font-family: OrbitronM !important">
    Achievements
  </p>
  <v-row justify="center" class="pt-2">
    <div  style="min-width: 200px" v-for="(key, i) in achievementsPage" :key="i">
      <AchievementCard class="mb-4" :achievement="key" :value="getValuePercent(key)" />
    </div>
  </v-row>
    <v-pagination
      v-model="page"
      class="pt-11"
      :length="Math.ceil(achievementsList.length / 4)"
      @input="switchPage()"
      circle
    ></v-pagination>
</div>
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
  achievementsList: Array<Achievements> = new Array<Achievements>()
  achievementsPage: Array<Achievements> = new Array<Achievements>()

  async mounted() {
    var ret = await this.$axios.get('/api/users/' + this.user.id + '/achievements' + this.isCompletedOnly())
    this.achievementsList = ret.data
    this.achievementsPage = this.achievementsList.slice(0, 4)
    console.log("this.achievementsList")
    console.log(this.achievementsList)
    console.log(this.user)
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
    this.achievementsPage = this.achievementsList.slice((this.page - 1) * 4, this.page * 4)
  }
}
</script>