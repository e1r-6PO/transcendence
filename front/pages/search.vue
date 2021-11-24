<template>
<v-container>
  <v-row style="padding-top: 2.5%">
    <v-col justify="center" align="center">
      <p v-if="users == null">LOADING...</p>
      <div v-else>
      <p class="resultMatch" style="padding-bottom: 1%; font-size:30px">{{ users.length }} result matched "{{ query }}"</p>
        <div>
          <v-btn
            class="foreground_element neon-button"
            rounded
            text
            color="#ffffff"
            @click="toToProfile(user)"
            v-for="user of users"
            :key="user"
          >
            {{ user }}
          </v-btn>
        </div>
      </div>
    </v-col>
  </v-row>
</v-container>
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
  query : string | null = null

  toToProfile(nick : String) {
    this.$router.push("/users/" + nick)
  }

  @Watch('$route', { immediate: true, deep: true })
  async onUrlChange(newVal: any) {
    this.users = null
    const urlParams = new URLSearchParams(window.location.search);
    this.query = urlParams.get('nick')
    this.users = await this.$axios.$get('/api/users/search?nick=' + this.query)
  }
}
</script>

<style>
@import '../assets/main_page.scss';

.resultMatch {
  color: #e6ffff;
  text-shadow:
    0 0 7px #63f3f3,
    0 0 8px #63f3f3,
    0 0 9px #63f3f3,
    0 0 0px #63f3f3
}
</style>