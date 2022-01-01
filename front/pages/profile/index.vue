<template>
<v-container fluid>
  <div style="padding-top: 3%">
    <v-alert
      v-model="alertCode"
      outlined
      :type=alertType
      text
      dismissible
    >
      {{ alertText }}
    </v-alert>
  </div>
  <ProfileNormal
    :isEditing="isEditing"
    :user="this.user"
    :pictureEdited="pictureEdited"
    @updateState="switchEditing"
  ></ProfileNormal>
  <ProfileEditing
    :isEditing="isEditing"
    :user="this.user"
    :pictureEdited="pictureEdited"
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

  user : User = new User;
  isEditing = false
  isSelecting = false
  selectedFile: null | Blob = null
  nick = ""
  tfa_status = false
  alertCode = false
  alertText = ""
  alertType = "success"
  pictureEdited = false

  async mounted() {
    this.user = await this.$axios.$get('/api/profile/me')
    
    const ret2fa = await this.$axios.get('/api/auth/2fa/is_enabled')
    .catch(function (error) {
      alert("error in mounted")
      return error.response
    })
    
    if (ret2fa.status == 200) {
      this.tfa_status = ret2fa.data['isTwoFactorAuthenticationEnabled']
      this.nick = this.user.nickName
      if (this.$route.fullPath.search("2fa=on") != -1)
      {
        this.alertCode = true
        this.alertType = "success"
        this.alertText = "2fa successfully enabled"
        setTimeout(()=>{
          this.alertCode=false
        },5000)
        this.$router.replace('/profile')
      }
    }
  }

  switchEditing() {
    this.isEditing = !this.isEditing;
  }

  changeNick(newNick: string){
    this.user.nickName = newNick
  }

  async changePicture(){
    this.pictureEdited = !this.pictureEdited
  }

}
</script>

<style scoped>

</style>
