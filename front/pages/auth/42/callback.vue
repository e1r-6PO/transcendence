<template>
</template>
<script>
import axios from "axios";

export default {
    async mounted() {

    var url

    url = window.location.origin
    url += '/api/auth/42/callback'
    url += window.location.search

    console.log(window.location.search)

    const ret = await axios.get(url).then(response => response.data)

    console.log(ret)

    window.location.href = '/'
  }
}
</script>