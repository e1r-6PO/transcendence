<template>
<v-main>
  <v-row>
    <v-col justify="center" align="center">
      <p v-if="$fetchState.pending">Loading....</p>
      <p v-else-if="$fetchState.error">Error while fetching</p>
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

<script lang="ts">
export default {

  data() {
    return {
      users: []
    }
  },

  methods: {
    toToProfile(nick) {
      window.location.href = "/users/" + nick
    }
  },

  async fetch() {
    const urlParams = new URLSearchParams(window.location.search);
    
    this.users = await this.$axios.$get('/api/users/search?nick=' + urlParams.get('nick'))
  }
}
</script>
