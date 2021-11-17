<template>
<v-main>
  <div style="padding-top: 3%" justify="center" align="center">
      <v-btn
        class="foreground_element"
        to="/profile/2fa" nuxt
        rounded
        elevation="2"
      >
        2fa
      </v-btn>
  </div>
  <div justify="center" align="center" v-if="!isEditing">
    <v-avatar class="overflow-visible" size="128">
      <img v-if="me.picture != ''"
        class="round_card item"
        :src=me.picture
      />
        <v-btn
          color="blue darken-3"
          fab
          small
          elevation="2"
          @click="isEditing = !isEditing"
          style="z-index: 6"
          absolute
          bottom
          right
        >
          <v-icon color="blue-grey lighten-2">
            mdi-pencil
          </v-icon>
        </v-btn>
    </v-avatar>
    </div>
    <div class="flex-container-editing" justify="center" align="center" v-else>
      <v-btn
        color="blue darken-3"
        fab
        small
        elevation="2"
        @click="isEditing = !isEditing"
        v-if="isEditing"
      >
        <v-icon color="red lighten-2">
          mdi-close
        </v-icon>
      </v-btn>
      <v-btn v-if="isEditing"
        class="text-none foreground_element btn_camera"
        :disabled="isEditing ? false: true"
        :loading="isSelecting"
        @click="onButtonClick"
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
  </div>
  <div class="flex-container-editing" style="padding-top: 3%">
      <v-text-field v-if="isEditing"
        class="foreground_element text-field-dimension"
        v-model="nick"
        label="Nickname"
        counter="20"
        elevation="10"
        rounded
        filled
      >
      </v-text-field>
      <v-card class="foreground_element card_profile"
        elevation="4"
        v-if="!isEditing"
      > 
        <v-card-text align="center">
          <p class="color_text text-h4 font-weight-medium" align="center">{{ nick }}</p>
          <p class="color_text text-h5" align="center">{{ me.email }}</p>
          <p v-if="me.provider === 'github'" class="color_text text-h6" align="center"> Connected via :</p>
          <icon-github v-if="me.provider === 'github'"
              width="50"
              height="50"
          />
          <p v-if="me.provider === '42'" class="color_text text-h6" align="center"> Connected via :</p>
          <icon-42 v-if="me.provider === '42'"
            width="50"
            height="50"
          />
          <p v-if="me.provider === 'google'" class="color_text text-h6" align="center"> Connected via :</p>
          <v-icon v-if="me.provider === 'google'"
              color="primary"
              x-large
          >
            mdi-google
          </v-icon>
        </v-card-text>
      </v-card>
    </div>
    <div class="flex-container" v-if="!isEditing">
      <v-card class="foreground_element card_game flex-item" margin-top="5%" elevation="4">
        <h1 class="color_win" align="center"> Games Won </h1>
        <h3 class="color_text" align="center">{{ me.gameWin }} </h3>
      </v-card>
      <v-card class="foreground_element card_game flex-item" margin-top="5%" elevation="4">
        <h1 class="color_lose" align="center"> Games Lost </h1>
        <h3 class="color_text" align="center" justify="center"> {{ me.gameLose }} </h3>
      </v-card>
  </div>
  <v-row>
    <v-spacer></v-spacer>
    <v-btn v-if="isEditing"
    class="foreground_element"
    :disabled="(!isEditing || user.nickName.length > 20) && selectedFile == null"
    color="success"
    @click="saveChange"
    >
      Save
    </v-btn>
  </v-row>
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
  selectedFile: Blob | string = new Blob
  nick = ""

  async mounted() {
    this.user = await this.$axios.$get('/api/profile/me')
    this.nick = this.user.nickName
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
    }
    var formData = new FormData();
    formData.append("image", this.selectedFile);
    console.log(formData)
    await this.$axios.$post('api/profile/me/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    this.isEditing = !this.isEditing
  }

}
</script>

<style>

.text-field-dimension {
  width: 15%;
  min-width: 15%;
  max-width: 15%;
  margin-top: 3%;
}

.color_lose {
  z-index: 6;
  color: #E57373;
}

.color_win {
  z-index: 6;
  color: #00796B; 
}

.color_text { 
  z-index: 6;
  color: #90A4AE;
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
  border-radius:15px!important;
  background-color: #3C6E71 !important;
  min-width: 260px;
  width: 275px;
  /* box-shadow: 0px 0px 20px 0px rgba(29, 29, 48, 0.89) !important; */
}

.card_profile {
  border-radius: 15px !important;
  background-color: #3C6E71 !important;
  /* box-shadow: 0px 0px 20px 0px rgba(29, 29, 48, 0.89) !important; */
  /* min-width: 400px; */
  width: 30%;
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
  justify-content: space-evenly;
  align-content: center;
  list-style: none;
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

</style>
