<template>
</template>
<script>
export default {
    async mounted() {
      const { params: { provider } } = this.$route
0

    var url

    url = window.location.origin
    url += '/api/auth/'
    url += provider
    url += '/callback'
    url += window.location.search

    console.log(url)

    const ret = await this.$axios.$get(url)

    window.location.href = '/me'
  }
}
</script>
