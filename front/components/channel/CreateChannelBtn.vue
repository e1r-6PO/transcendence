<template>
  <div>
    <AlertError @alertEnd="activeAlert = !activeAlert" ref="alert" />
    <v-dialog
      v-model="dialog"
      max-width="600px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-row align="center" justify="center" style="margin-top: 0px">
          <v-card
            class="neon-button"
            color="#181818"
            style="border-radius: 15px;"
            link
            width="100"
            v-bind="attrs"
            v-on="on"
            v-on:mouseover="createFocus = true"
            v-on:mouseleave="createFocus = false"
          >
            <v-card-text align="center" :class="createFocus == true ? 'purple--text text--lighten-1' : 'white--text'"> 
              <b>Create +</b>
            </v-card-text>
          </v-card>
        </v-row>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Channel settings</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field
              label="Channel name"
              v-model="channName"
            ></v-text-field>
            <v-select
              :items="typeList"
              label="Channel type"
              v-model="channType"
            ></v-select>
            <v-text-field
              label="Password"
              v-model="channPass"
              required
              :disabled="channType != 'Protected'"
            ></v-text-field>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="createChannel()"
            :disabled="disableCreate()"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AlertError from '../../components/AlertError.vue'

export default Vue.extend({
  middleware: 'login',
  name: "CreateChannelBtn",

  data() {
    return {
      dialog: false,
      channName: '',
      channPass: '',
      channType: '',
      createFocus: false,
      activeAlert: false,
      typeList: [
        'Public',
        'Private',
        'Protected'
      ],
    }
  },

  methods: {

    async createChannel() {
      this.dialog = false
      const ret = await this.$axios.$post('/api/chat/create?name=' + this.channName + '&type=' + this.channType + '&pass=' + this.channPass)
        .catch(function (error) {
          return error.response
        });
      if (ret.status == 409)
        this.$refs.alert.activeAlert("Channel already exists")
      else
        this.$router.push("/chat/" + this.channName)
    },

    redirectToChannel(channName: string) {
        this.$router.push('/chat/' + channName)
    },

    disableCreate() {
      if (this.channName == '' || this.channName.length > 20)
        return true
      if (this.channType == '')
        return true
      if (this.channType == 'Protected' && (this.channPass == '' || this.channPass.length < 5))
        return true
      return false
    },
  },
})
</script>

<style >
@import '../../assets/main_page.scss';
</style>