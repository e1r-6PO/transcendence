<template>
<v-main>
  <v-row>
    <v-col justify="center" align="center">
      <v-card class="foreground_element" color="indigo darken-3" height="150" width="450" elevation="12" shaped>
        <p v-if="$fetchState.pending">Loading....</p>
        <p v-else-if="$fetchState.error">Error while fetching</p>
        <ul v-else>
          <p>This is {{ user.nickName }} profile</p>
        </ul>
      </v-card>
    </v-col>
  </v-row>
</v-main>
</template>

<script>

export default {
  
  data() {
    return {
      user: []
    }    
  },

  async fetch() {
      const { params: { slug } } = this.$route

    const user = await this.$axios.get('api/users/' + slug)
        .catch(function(error) {
    })
    this.user = user.data[0]
  }
}
</script>
