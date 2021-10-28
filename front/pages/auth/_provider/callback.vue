<template>
</template>

<script>
export default {
    async mounted() {
      const { params: { provider } } = this.$route

    var url

    url = window.location.origin
    url += '/api/auth/'
    url += provider
    url += '/callback'
    url += window.location.search

    const ret = await this.$axios.$get(url)

    window.location.href = await this.getRedirectUrl(this.$axios)
  },

  methods: {
    async getRedirectUrl({ $axios }) {
      const ret = await this.$axios.$get('api/users/me/nickname')
        
      if (ret.nickname == "")
        return '/profile/set_nickname'
      return '/me'
    }
  },
}
</script>
