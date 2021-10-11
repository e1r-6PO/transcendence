<template>
  <div>
    <ul v-for="user in users" :key="user.id">
      <li>{{ user.logName }}</li>
    </ul>
  </div>
</template>
<script>
export default {
  async asyncData() {
    const users = await fetch(
      'http://localhost:8000/api/users'
    ).then((res) => res.json())

    console.log(users)
    return { users }
  }
}
</script>
