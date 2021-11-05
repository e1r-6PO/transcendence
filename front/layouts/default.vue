<template>
  <v-app dark>
    <client-only class="background_effect">
      <Particles
        :move-straight="false"
        :hover-effect="false"
        :click-effect="false"
        :move-speed=0.666
      />
    </client-only>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      fixed
      app
      height="80"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-container fill-height>
        <v-row align="center" justify="center">
          <v-col align="right" justify="right">
            <v-text-field
              class="foreground_element"
              label="Search"
              v-model="search"
              dense
              filled
              rounded
              prepend-inner-icon="mdi-magnify"
              @keydown.enter="searchbar"
            >
            </v-text-field>
          </v-col>
        </v-row>
      </v-container>
      <v-btn
        icon
        href="/api/auth/logout"
      >
        <v-icon
          large
        >
          mdi-exit-to-app
        </v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Particles from '~/components/Particles.vue'

export default {

  components: {
    Particles
  },

  data () {
    return {
      search: "",
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Home',
          to: '/home'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Profile',
          to: '/profile'
        },
        {
          icon: 'mdi-clipboard-account',
          title: 'Scoreboard',
          to: '/scoreboard'
        }
      ],
      right: true,
      rightDrawer: false,
      title: 'TranscendanceGod'
    }
  },

  methods: {
    searchbar() {
      window.location.href = "/search?nick=" + this.search
    }
  }
}
</script>

<style lang="scss">

  .v-application{
    background-color: #202b58 !important;
  }
  @import '../assets/main_page.scss';

  div[id^="particles-instance-"] {
    height: 100vh !important;
    width: 100vw !important;
    position: fixed !important;
    top: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    // background: rgba($color: #05114e, $alpha: 0.4);
    z-index: 2 !important;
  }

.v-text-field{
      max-width: 250px;
}

</style>

