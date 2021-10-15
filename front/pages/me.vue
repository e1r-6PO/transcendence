<template>
  <div>
    <h1>You are connected as: {{ me.email }}</h1>
    <h2>Nickname: {{ me.nickname }}</h2>
    <!-- <p>Path: {{ $route.path }}</p> -->
    <NuxtLink to="/">Back to Home page</NuxtLink>
  </div>
</template>

<script>
export default {
  async mounted() {
    const me = await fetch(
      '/api/user/me'
    ).then((res) => res.json())
  }
}
</script>
