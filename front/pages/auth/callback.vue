<template>
    <div>
        
    </div>
</template>
<script>
import axios from "axios";

export default {
    async asyncData() {

    const params = new URLSearchParams(window.location.search)

    if (params.get('code') != null)
    {
        var url

        url = window.location.origin
        url += '/api/auth/callback'
        url += '?code='
        url += params.get('code')

        const response = await axios.post(url)
    }
    else
        window.location.replace('/')

  }
}
</script>