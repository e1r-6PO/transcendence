<template>
    <div>
        <h1>{{ ouaish.msg }}</h1>
    </div>
</template>
<script>
import axios from "axios";

export default {
    async asyncData() {

    var url

    url = window.location.origin
    url += '/api/auth/google/callback'
    url += window.location.search

    const ouaish = await axios.get(url).then(response => response.data)

    console.log(ouaish)

    return { ouaish }
  }
}
</script>