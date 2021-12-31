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
  <ProfileNormal :isEditing="isEditing" :userPicture="this.user.picture" :userEmail="this.user.email" :userProvider="this.user.provider" :userNick="user.nickName" :userWins="user.gameWin" :userLost="user.gameLose" :pictureEdited="pictureEdited" :user="user" @updateState="switchEditing" ></ProfileNormal>
  <ProfileEditing :isEditing="isEditing" :userPicture="this.user.picture" :userNickName="this.user.nickName" :user="this.user" :pictureEdited="pictureEdited" @updateState="switchEditing" @updateNick="changeNick" @updatePicture="changePicture" ></ProfileEditing>
</v-container>
</template>

<script lang="ts">

import Vue from 'vue'
import Component from 'vue-class-component'
import login from '../../middleware/login'
import { User } from '../../assets/Classes-ts/User';

@Component({
  middleware: login,
  // components: { ProfileImg }
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
    console.log(this.isEditing)
  }

  changeNick(newNick: string){
    this.user.nickName = newNick
  }

  async changePicture(){
    console.log(this.pictureEdited)
    this.pictureEdited = !this.pictureEdited
    console.log(this.pictureEdited)
  }

  onFileChanged(e: any) {
    if (!e.target.files[0]) {
        e.preventDefault();
        this.alertType = "error"
        this.alertText = "No file chosen"
        this.alertCode = true
        setTimeout(()=>{
          this.alertCode=false
        },5000)
        return;
      }
      
      if (e.target.files[0].size > 1000000) {
        e.preventDefault();
        this.alertText = "File too big (> 1MB)"
        this.alertType = "error"
        this.alertCode = true
        setTimeout(()=>{
          this.alertCode=false
        },5000)
        return;
      }
      this.selectedFile = e.target.files[0]
  }

  $refs!: {
    uploader: HTMLFormElement
  }

  onButtonClick() {
      this.isSelecting = true
      window.addEventListener('focus', () => {
        this.isSelecting = false
      }, { once: true })
      this.$refs.uploader.click()
  }

  async saveChange() {
    if (this.user.nickName == this.nick && this.selectedFile == null)
      return
    if (this.user.nickName != this.nick) {
      const ret = await this.$axios.post('api/profile/me/nickname?nickname=' + this.nick)
        .catch(function (error) {
            return error.response
        });
      if (ret.status == 409)
      {
        this.alertText = "Nick is alredy taken" 
        this.alertType = "error"
        this.alertCode = true
        setTimeout(()=>{
          this.alertCode=false
        },5000)
        return
      }
      else
      {
        this.user.nickName = this.nick
        if (this.isEditing == true)
          this.isEditing = false
      }
    }
    if (this.selectedFile != null) {
      var formData = new FormData();
      formData.append("image", this.selectedFile);
      await this.$axios.$post('api/profile/me/picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      if (this.isEditing == true)
        this.isEditing = false
      this.selectedFile = null
    }
  }

  async change2fa() {
    if (this.tfa_status == false)
      this.$router.push("/profile/2fa")
    else
    {
      const qr = await this.$axios.post('/api/auth/2fa/turn-off')
      .catch(function (error) {
        alert("Cant turn off 2fa")
        return error.response
      });
      if (qr.status == 201) {
        this.tfa_status = false
        this.alertType = "warning"
        this.alertText = "2fa successfully disabled"
        this.alertCode = true
        setTimeout(()=>{
          this.alertCode=false
        },5000)
      }
    }
  }

}
</script>

<style scoped>
@import '../../assets/Classes-scss/main_page.scss';
@import '../../assets/Classes-scss/custom_flexBox.scss';

.edit-button {
  border: 3px solid #e9c8ff !important;
  box-shadow: 0px 0px 10px 0px #9141c7 !important;
}

.profile-picture {
  border: 3px solid #a5fafa !important;
  box-shadow: 0px 0px 15px 0px #63f3f3 !important;
}

.text-field_style {
  width: 15%;
  min-width: 15%;
  max-width: 15%;
  margin-top: 3%;
  box-shadow: 0px 0px 20px 0px rgba(224, 185, 10, 0.89) !important;
  background: #f27719 !important; /* orange tron color */
}

.text-field_style input {
  color: #7DFDFE !important; /* blue tron color */
}

.color_lose {
  z-index: 6;
  color: #c7401e;
}

.color_win {
  z-index: 6;
  color: #b8a435; 
}

.color_text { 
  z-index: 6;
  color: #ffffff;
}

.round_card {
  border-radius:100%!important;
}

.btn_camera {
  border-radius: 100%!important;
  box-shadow: 0px 0px 20px 0px rgba(31, 31, 50, 0.89);
  color: #38393b;
  min-width: 200px;
  width: 200px;
  min-height: 200px;
  height: 200px;
}

.card_game {
  border: 3px solid #a5fafa !important;
  box-shadow: inset 0px 0px 110px 0px #0affff, 0px 0px 40px 0px #0affff !important;
  border-radius: 15px !important;
  background-color: #181818 !important;
  min-width: 260px;
  width: 275px;
}

.card_profile {
  border: 3px solid #a5fafa !important;
  box-shadow: inset 0px 0px 500px 20px #0affff, 0px 0px 40px 0px #0affff !important;
  border-radius: 15px !important;
  background-color: #181818 !important;
  min-width: 400px;
  height: 250px;
  width: 30%;
}

.editing_card {
  height: 10%;
  width: 25% !important;
  min-width: 20%;
  border-radius: 15px !important;
  box-shadow: 0px 0px 20px 0px rgba(224, 185, 10, 0.89) !important;
  background-color: #f27719 !important;
}

.item {
  align-self: flex-end;
}

.flex-item {
  margin-top: 5%;
  color: white;
  font-weight: bold;
  text-align: center;
}

.cross-item {
  margin-left: 90%;
  margin-bottom: 2%;
  border: 3px solid #cd78ff !important;
  box-shadow: 0px 0px 25px 0px #a200ff !important;
}

.save-item {
  margin-left: 90%;
}

.v-input--reverse .v-input__slot {
  flex-direction: row-reverse;
  justify-content: flex-end;
  margin-right: 2px;
}

</style>
