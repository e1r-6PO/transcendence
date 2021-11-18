<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      app
      color="#000000"
      style="z-index: 7"
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
            <v-icon class="icon_color">{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content >
            <v-list-item-title class="title_color neonText" v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      fixed
      app
      height="80"
      color="#000000"
      class="top_bar_style"
    >
      <!-- <v-app-bar-nav-icon/> -->
      <v-app-bar-nav-icon class="icon_color" @click.stop="drawer = !drawer" />
      <v-toolbar-title class="title neonText" v-text="title" />
      <v-spacer />
      <v-container fill-height>
        <v-row align="center" justify="center">
          <v-col align="right" justify="right">
            <v-text-field
              class="foreground_element text-field_search"
              label="Search"
              v-model="search"
              dense
              filled
              shaped
              prepend-inner-icon="mdi-magnify"
              @keydown.enter="searchbar"
              background-color="#f27719"
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

<script lang='ts'>
// import Particles from '~/components/Particles.vue'

import Vue from 'vue'

export default Vue.extend({

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
      this.$router.push({path: '/search', query: { nick: this.search }})
    }
  }
});
</script>

<style scoped lang="scss">
  @import '../assets/main_page.scss';

  .v-application{
    background: #181818 !important;
  }

.text-field_search {
  min-width: 15%;
  max-width: 15%;
  width: 15%;
  padding-top: 0% !important;
}

.title {
  text-overflow: clip;
  overflow: visible;
}

.neonText {
  color: #e6ffff;
  text-shadow:
    0 0 7px #69acb8,
    0 0 10px #49A2B2,
    0 0 21px #49A2B2,
    0 0 31px #225560,
}

.icon_color {
  color: #f27719 !important;
  box-shadow: 0px 0px 20px 0px #f27719;
  border: 0.2rem solid #fff;
  border-radius: 2rem;
}

.top_bar_style {
  color: #ffffff;
  border-bottom: 3px solid #ffffff !important;
  box-shadow: inset 0px -14px 20px -10px #63f3f3, 0px 0px 20px 0px #63f3f3 !important;
}

</style>

