<template>
<v-main>
  <v-row>
    <v-col justify="center" align="center">
      <p v-if="$fetchState.pending">Loading....</p>
      <p v-else-if="$fetchState.error">Error while fetching</p>
      <ul v-else>
        <p>This is {{ user.nickName }} profile</p>
      </ul>
    </v-col>
  </v-row>
</v-main>
</template>

<script lang="ts">

export default {
  
  data() {
    return {
      user: []
    }    
  },

  async fetch() {
      const { params: { slug } } = this.$route

    this.user = await this.$axios.$get('/api/users/' + slug)
        .catch(function(error) {
    })
  }
}
</script>
