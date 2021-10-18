<!---
<template>
  <div>
    <nav>
      <ul>
        <li>
          <NuxtLink to="/">Home page</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/me">Profile</NuxtLink>
        </li>
      </ul>
    </nav>
    <main>
      <img src="~/assets/logo.svg" />
      <Nuxt />
    </main>
  </div>
</template>
--->
<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      app
    >
    </v-navigation-drawer>
    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Application</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <!-- -->
    </v-main>
  </v-app>
</template>

<script>
  export default {
    data: () => ({ drawer: null }),
  }
</script>

<style>
/* :root {
  --primary-color: #00c58e;
}

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
    Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji,
    Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
  margin: 0;
  background-image: linear-gradient(to top, #30cfd0 0%, #330867 100%);
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-size: auto;
}

a {
  color: inherit;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

nav a:hover {
  text-decoration: none;
}

main {
  margin: 0 auto;
  margin-top: 100px;
  padding: 0 1rem;
  max-width: 1280px;
  text-align: center;
}

img {
  margin-bottom: 1rem;
}

ul {
  list-style-type: none;
  padding: 0;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
li {
  margin: 0 0.5rem;
  padding: 0.25rem;
  font-size: 1.2rem;
}

nav {
  padding: 0 1rem;
}
a.nuxt-link-exact-active {
  color: #00c58e;
} */

</style>
