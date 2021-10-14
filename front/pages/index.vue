<template>
  <div>
    <a href='https://api.intra.42.fr/oauth/authorize?client_id=740cf1518fafc4f3e8ee35aa2d800ed16a3ab341405c531f7bb5d6b7b719aac1&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fauth%2Fcallback&response_type=code'>
      <li>totally not a button</li>
    </a> 
  </div>
</template>
<script>
export default {
  async asyncData() {
    const users = await fetch(
      'api/user'
    ).then((res) => res.json())

    return { users }
  }
}
</script>
