<template>
  <div>
    <main>
        <a href='https://api.intra.42.fr/oauth/authorize?client_id=740cf1518fafc4f3e8ee35aa2d800ed16a3ab341405c531f7bb5d6b7b719aac1&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fauth%2Fcallback&response_type=code'>
          <img
            src="../assets/42_Logo.png" 
            width="100"
            height="100"
            style="float: left; margin-left: 350px; margin-top: 200px"
            
          />
        </a>
        <a href='/api/auth/google'>
          <img
            src="../assets/Google_Button.png" 
            width="150"
            height="100"
            style="float: right; margin-right: 350px; margin-top: 200px;"
          />
        </a>
    </main>
  </div>
</template>

<!-- <script>
// export default {
//   async asyncData() {
//     const users = await fetch(
//       'api/user'
//     ).then((res) => res.json())

//     return { users }
//   }
// }
</script> --->

