<template>
<v-main>
  <div justify="center" align="center" style="padding-top: 3%" v-if="!isEditing">
    <v-avatar class="overflow-visible" size="128">
      <img v-if="user.picture != ''"
        class="round_card item profile-picture"
        :src=user.picture
      />
        <v-btn
          color="#8124be"
          class="edit-button"
          fab
          small
          @click="isEditing = !isEditing"
          style="z-index: 6"
          absolute
          bottom
          right
        >
          <v-icon color="#ffffff">
            mdi-pencil
          </v-icon>
        </v-btn>
    </v-avatar>
    </div>
    <div class="flex-container-editing" justify="center" align="center" style="padding-top: 3%" v-else>
      <v-btn
          color="#8124be"
          class="foreground_element cross-item edit-button"
          fab
          small
          @click="switchEditing"
        >
          <v-icon color="error" v-if="isEditing" >
            mdi-close
          </v-icon>
        </v-btn>
      <v-row align="center" justify="center">
        <v-btn v-if="isEditing"
          class="text-none foreground_element btn_camera"
          :disabled="isEditing ? false: true"
          :loading="isSelecting"
          @click="onButtonClick"
          color="#333333"
        >
          <v-icon
            x-large
          >
            mdi-camera-enhance
          </v-icon>
          <input
            ref="uploader"
            class="d-none"
            type="file"
            accept="image/*"
            @change="onFileChanged"
          >
        </v-btn>
      </v-row>
    </div>
    <div class="flex-container-editing" style="padding-top: 3%">
      <v-text-field v-if="isEditing"
        class="foreground_element text-field-nick-neon custom-placeholder-color custom-input-color"
        v-model="nick"
        placeholder="Nickname"
        color="#e6ffff"
        hide-details
        filled
        rounded
        dense
        counter="20"
      >
      </v-text-field>
      <v-card class="foreground_element card_profile"
        v-if="!isEditing"
      >
        <v-card-text align="center">
          <p class="color_text text-h4 font-weight-medium" align="center">{{ nick }}</p>
          <p class="color_text text-h5" align="center">{{ user.email }}</p>
          <p v-if="user.provider === 'github'" class="color_text text-h6" align="center">Connected via :</p>
          <icon-github v-if="user.provider === 'github'"
              width="50"
              height="50"
          />
          <p v-if="user.provider === '42'" class="color_text text-h6" align="center"> Connected via :</p>
          <icon-42 v-if="user.provider === '42'"
            width="50"
            height="50"
          />
          <p v-if="user.provider === 'google'" class="color_text text-h6" align="center"> Connected via :</p>
          <v-icon v-if="user.provider === 'google'"
              color="primary"
              x-large
          >
            mdi-google
          </v-icon>
        </v-card-text>
      </v-card>
    </div>
    <div class="flex-container" v-if="!isEditing">
      <v-card class="foreground_element card_game flex-item" margin-top="5%">
        <h1 class="color_win" align="center">Win</h1>
        <h3 class="color_text" align="center">{{ user.gameWin }} </h3>
      </v-card>
      <v-card class="foreground_element card_game flex-item" margin-top="5%">
        <h1 class="color_lose" align="center">Lose</h1>
        <h3 class="color_text" align="center" justify="center"> {{ user.gameLose }} </h3>
      </v-card>
  </div>
  <div class="flex-container" style="padding-top: 3%" justify="center" align="center" v-if="isEditing">
    <v-card class="foreground_element editing_card" width="500"><!--  <v-btn
        class="foreground_element"
        to="/profile/2fa" nuxt
        rounded
        elevation="2"
      >
        2fa
      </v-btn> -->
        <v-switch
        class="v-input--reverse"
        :input-value="tfa_status"
        @change="change2fa"
        >
          <template #label>
            <h2 style="margin-left: 3%">Do you want active 2fa ?</h2>
          </template>
        </v-switch>
    </v-card>
  </div>
  <div class="flex-container-editing" justify="center" align="center" style="padding-top: 3%">
    <v-btn v-if="isEditing"
    class="foreground_element save-item neon-button"
    :disabled="nick == user.nickName && selectedFile == null"
    rounded
    text
    color="#0ADAA8"
    @click="saveChange"
    >
      Save
    </v-btn>
  </div>
</v-main>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import login from '../../middleware/login'
import { User } from '../../assets/User';

@Component({
  middleware: login
})
export default class extends Vue {

  user : User = new User;
  isEditing = false
  isSelecting = false
  selectedFile: null | Blob = null
  nick = ""
  tfa_status = false

  async mounted() {
    this.user = await this.$axios.$get('/api/profile/me')
    
    const ret2fa = await this.$axios.get('/api/auth/2fa/is_enabled')
    .catch(function (error) {
      alert("error in mounted")
      return error.response
    })
    
    if (ret2fa.status == 200) {
      this.tfa_status = ret2fa.data['isTwoFactorAuthenticationEnabled']
    console.log(this.tfa_status)
    this.nick = this.user.nickName
    }
  }

  switchEditing() {
    this.isEditing = !this.isEditing;
  }

  onFileChanged(e: any) {
    if (!e.target.files[0]) {
        e.preventDefault();
        alert('No file chosen');
        return;
      }
      
      if (e.target.files[0].size > 1000000) {
        e.preventDefault();
        alert('File too big (> 1MB)');
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
    if (this.user.nickName != this.nick) {
      const ret = await this.$axios.post('api/profile/me/nickname?nickname=' + this.nick)
        .catch(function (error) {
          alert("nick is already taken")
            return error.response
        });
      this.user.nickName = this.nick
      if (this.isEditing == true)
        this.isEditing = false
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
        alert("2fa disabled")
      }
    }
  }

  is2fa() {
    console.log("is2fa")
    console.log(this.tfa_status)
    return this.tfa_status
  }

}
</script>

<style scoped>
@import '../../assets/main_page.scss';

.edit-button {
  /* border: 3px solid #e9c8ff !important;
  box-shadow: 0px 0px 10px 0px #9141c7 !important; */
  border: 3px solid #e9c8ff !important;
  box-shadow: 0px 0px 10px 0px #9141c7 !important;
}

.profile-picture {
  border: 3px solid #a5fafa !important;
  /* border: 3px solid #e7b3ff !important; */
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
  border-radius: 30px!important;
  box-shadow: 0px 0px 20px 0px rgba(31, 31, 50, 0.89);
  color: #38393b;
  min-width: 200px;
  width: 200px;
  min-height: 200px;
  height: 200px;
}

.card_game {
  border: 3px solid #a5fafa !important;
  /* border-radius:17px!important; */
  box-shadow: inset 0px 0px 110px 0px #0affff, 0px 0px 40px 0px #0affff !important;
  border-radius: 15px !important;
  background-color: #181818 !important;
  min-width: 260px;
  width: 275px;
  /* box-shadow: 0px 0px 20px 0px rgba(58, 189, 182, 0.7) !important;  */
}

.card_profile {
  border: 3px solid #a5fafa !important;
  /* border: 3px solid #e7b3ff !important; */
  box-shadow: inset 0px 0px 500px 20px #0affff, 0px 0px 40px 0px #0affff !important;
  /* box-shadow: inset 0px 0px 1000px 0px #cb5cff, 0px 0px 40px 0px #cb5cff !important; */
  border-radius: 15px !important;
  background-color: #181818 !important;
  /* background-color: #35b4b2 !important; */
  /* box-shadow: 0px 0px 20px 0px rgba(58, 189, 182, 0.7) !important;  */
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

.flex-container {
  /* We first create a flex layout context */
  display: flex;
  
  /* Then we define the flow direction 
     and if we allow the items to wrap 
   * Remember this is the same as:
   * flex-direction: row;
   * flex-wrap: wrap;
   */
  flex-flow: row wrap;
  
  /* Then we define how is distributed the remaining space */
  justify-content: space-evenly;
  align-content: center;
  list-style: none;

}

.flex-container-editing {
  /* We first create a flex layout context */
  display: flex;
  
  /* Then we define the flow direction 
     and if we allow the items to wrap 
   * Remember this is the same as:
   * flex-direction: row;
   * flex-wrap: wrap;
   */
  flex-flow: column wrap;
  
  /* Then we define how is distributed the remaining space */
  justify-content: center;
  align-content: center;
  list-style: none;
  padding-top: 1%;
  column-gap: 100px !important;
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
