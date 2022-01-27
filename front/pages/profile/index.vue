<template>
<v-container fluid class="pt-0">
	<AlertError @end="alert = false" :textError="alertText" :type="alertType" :state="alert"/>
  <ProfileNormal v-if="!isEditing && user.id != 0"
    :user="this.user"
    :pictureEdited="pictureEdited"
    :rank="rank"
    :matchHistory="matchHistory"
    @fetchMoreGames="fetchMoreGames()"
    @updateState="switchEditing"
  ></ProfileNormal>
  <ProfileEditing v-if="isEditing"
    :user="this.user"
    :pictureEdited="pictureEdited"
    @activeAlert="activeAlert"
    @desactiveAlert="desactiveAlert"
    @updateState="switchEditing"
    @updateNick="changeNick"
    @updatePicture="changePicture"
  ></ProfileEditing>
</v-container>
</template>

<script lang="ts">

import Vue from 'vue'
import Component from 'vue-class-component'
import login from '../../middleware/login'
import { User } from '../../assets/Classes-ts/User';
import { Match } from '../../assets/Classes-ts/Match';

@Component({
  middleware: login,
  head: {
    title: 'Profile'
  }
})
export default class extends Vue {

  user : User = new User;
  isEditing = false
  alert = false
  alertText = ""
  alertType = "success"
  pictureEdited = false
  rank = 0
  matchHistory: Array<Match> = new Array

  async mounted() {
    this.user = await this.$axios.$get('/api/profile/me')
      .catch(function(error) {
        return error.response
      })

    this.rank = await this.$axios.$get('/api/leaderboard/' + this.user.id)

    this.matchHistory = await this.$axios.$get('/api/users/' + this.user.id + '/matchs')

    const ret2fa = await this.$axios.get('/api/auth/2fa/is_enabled')
    .catch(function (error) {
      alert("error in mounted")
      return error.response
    })
    
    if (ret2fa.status == 200) {
      if (this.$route.fullPath.search("2fa=on") != -1)
      {
        this.activeAlert("2fa successfully enabled", "success")
        this.$router.replace('/profile')
      }
    }
  }

  async fetchMoreGames() {
    this.matchHistory.push(await this.$axios.$get('/api/users/' + this.user.id + '/matchs?page=' + this.matchHistory.length))
  }

  activeAlert(text: string, type: string) {
    this.alertText = text
    this.alertType = type
    this.alert = true
  }

  desactiveAlert() {
    this.alert = false
  }

  switchEditing() {
    this.isEditing = !this.isEditing;
  }

  changeNick(newNick: string){
    this.user.nickName = newNick
  }

  changePicture(url: string){
    this.user.picture = url
    this.pictureEdited = !this.pictureEdited
  }

}
</script>

<style scoped>

</style>
