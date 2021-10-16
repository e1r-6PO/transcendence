<template>
  <div>
    <h1>You are connected as: {{ me.email }}</h1>
    <h2>Nickname: {{ me.nickName }}</h2>
    <!-- <p>Path: {{ $route.path }}</p> -->
    <NuxtLink to="/">Back to Home page</NuxtLink>
  </div>
</template>

<script>
export default {
  async asyncData() {
    const me = await fetch(
      '/api/users/me'
    ).then((res) => res.json())

    return { me }
  }
}
</script>
