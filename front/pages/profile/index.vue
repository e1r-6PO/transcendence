<template>
<v-container fluid class="mt-9">
	<AlertError @end="alert = false" :textError="alertText" :type="alertType" :state="alert"/>
  <ProfileNormal v-if="!isEditing"
    :user="this.user"
    :pictureEdited="pictureEdited"
    :rank="rank"
    @updateState="switchEditing"
  ></ProfileNormal>
  <ProfileEditing v-if="isEditing"
    :user="this.user"
    :pictureEdited="pictureEdited"
    @activeAlert="activeAlert"
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

@Component({
  middleware: login,
})
export default class extends Vue {

  user : User = new User();
  isEditing = false
  alert = false
  alertText = ""
  alertType = "success"
  pictureEdited = false
  rank = 0

  async mounted() {
    this.user = await this.$axios.$get('/api/profile/me')
      .catch(function(error) {
        return error.response
      })

    this.rank = await this.$axios.$get('/api/leaderboard/' + this.user.id)

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

  activeAlert(text: string, type: string) {
    this.alertText = text
    this.alertType = type
    this.alert = true
  }

  switchEditing() {
    this.isEditing = !this.isEditing;
  }

  changeNick(newNick: string){
    this.user.nickName = newNick
  }

  changePicture(){
    this.pictureEdited = !this.pictureEdited
  }

}
</script>

<style scoped>

</style>
