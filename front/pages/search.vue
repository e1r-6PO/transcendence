<template>
<v-main>
  <v-row>
    <v-col justify="center" align="center">
      <p v-if="users == null">LOADING...</p>
      <ul v-else>
        <v-btn
          class="foreground_element"
          @click="toToProfile(user)"
          v-for="user of users"
          :key="user"
        >
          {{ user }}
        </v-btn>
      </ul>
    </v-col>
  </v-row>
</v-main>
</template>

<script lang='ts'>

import Vue from 'vue'

import login from '../middleware/login'

import Component from 'vue-class-component'

import { Watch } from 'vue-property-decorator'

import { Route } from 'vue-router'

@Component({
  middleware: login
})
export default class extends Vue {

  users = null

  toToProfile(nick : String) {
    this.$router.push("/users/" + nick)
  }

  @Watch('$route', { immediate: true, deep: true })
  async onUrlChange(newVal: any) {
    this.users = null
    const urlParams = new URLSearchParams(window.location.search);
    this.users = await this.$axios.$get('/api/users/search?nick=' + urlParams.get('nick'))
  }

  async fetch() {
    const urlParams = new URLSearchParams(window.location.search);

    this.users = await this.$axios.$get('/api/users/search?nick=' + urlParams.get('nick'))
  }
}
</script>
