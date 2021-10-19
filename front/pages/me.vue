<template>
  <v-row>
    <v-col class="text-center">
      <img
        src="/v.png"
        alt="Vuetify.js"
        class="mb-5"
      >
      <v-card>
        <v-card-title class="justify-center">
          Signed in
        </v-card-title>
        <p>You are connected as: {{ me.email }}</p>
        <p>Nickname: {{ me.nickName }}</p>
      </v-card>
      <!-- <blockquote class="blockquote">
        &#8220;First, solve the problem. Then, write the code.&#8221;
        <footer>
          <small>
            <em>&mdash;John Johnson</em>
          </small>
        </footer>
      </blockquote> -->
    </v-col>
  </v-row>
</template>

<script>
export default {

  layout: 'home',

  async asyncData() {
    const me = await fetch(
      '/api/users/me'
    ).then((res) => res.json())

    return { me }
  }
}
</script>
