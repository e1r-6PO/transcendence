<template>
  <v-main>
    <v-text-field
      class="foreground_element"
      v-model="login.nickname"
      label="Nickname"
      counter="20"
      shaped
      filled
      :rules="rules.nickname"
    >
    </v-text-field>
    <v-btn 
      class="foreground_element"
      text
      :disabled="!nickIsValid"
      @click="setNick"
    >
      Complet Registration
    </v-btn>
  </v-main>
</template>

<script>


export default {

  async asyncData({ $axios }) {
    const ret = await $axios.$get('api/users/me/nickname')

    if (ret.nickname != "")
      window.location.href = '/home'
  },
  data() {

    const defaultLogin = Object.freeze({
        nickname: ''
    })

    return {
      login: Object.assign({}, defaultLogin),
      rules: {
        nickname: [val => (val || '').length > 0 || 'This field is required'],
      }
    }
  },

  computed: {
    nickIsValid() {
      return this.login.nickname &&
      this.login.nickname.length <= 20
    },
  },

  methods: {
    async setNick() {
        const nick = this.login.nickname
        const ret = await this.$axios.post('api/users/me/nickname?nickname=' + nick)
          .catch(function (error) {
            alert("nick " + nick + " is already taken")
            return error.response
        });
        if (ret.status == 201)
          window.location.href = '/home'
      },
  }
}
</script>
