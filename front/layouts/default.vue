<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      app
      color="#bababa"
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
      color="#ececec"
    >
      <!-- <v-app-bar-nav-icon/> -->
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-container fill-height>
        <v-row align="center" justify="center">
          <v-col align="right" justify="right">
            <v-text-field
              class="foreground_element text-field_search"
              label="Search"
              v-model="search"
              solo
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
    <Nuxt />
  </v-app>
</template>

<script>
// import Particles from '~/components/Particles.vue'

export default {

  data () {
    return {
      search: "",
      drawer: true,
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

<style scoped lang="scss">
  @import '../assets/main_page.scss';

  .v-application{
    background: #ececec !important;
  }

.text-field_search {
  min-width: 250px;
  width: 250px;
  padding-top: 4px !important;
}

</style>

