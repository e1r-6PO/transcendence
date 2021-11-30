<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      app
      class="side-bar"
      color="#0f0f0f"
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
            <v-icon class="menu-icon">{{ item.icon }}</v-icon>
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
      color="#0f0f0f"
      class="top_bar_style"
    >
      <v-app-bar-nav-icon class="open-menu" @click.stop="drawer = !drawer" />
      <v-toolbar-title class="title neonText" v-text="title" />
      <v-spacer />
      <div style="padding-right: 15px">
        <v-row align="center" justify="center">
          <v-col align="right" justify="right">
            <v-text-field
              class="foreground_element text-field_search custom-placeholder-color custom-input-color neonText"
              placeholder="Search"
              color="#e6ffff"
              v-model="search"
              hide-details
              dense
              filled
              rounded
              prepend-inner-icon="mdi-magnify"
              @keydown.enter="searchbar"
            >
            </v-text-field>
          </v-col>
        </v-row>
      </div>
      <v-btn
        icon
        href="/api/auth/logout"
        class="logout-btn"
      >
        <v-icon
          large
        >
          mdi-exit-to-app
        </v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <Nuxt />
    </v-main>
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
          icon: 'mdi-home',
          title: 'Home',
          to: '/home'
        },
        {
          icon: 'mdi-account',
          title: 'Profile',
          to: '/profile'
        },

        {
          icon: 'mdi-account-group',
          title: 'Friends',
          to: '/friends'
        },
        {
          icon: 'mdi-wechat',
          title: 'Chat Room',
          to: '/chat'
        },
        {
          icon: 'mdi-ladder',
          title: 'Scoreboard',
          to: '/scoreboard'
        }
      ],
      right: true,
      rightDrawer: false,
      title: 'Tronscendence'
    }
  },

  methods: {
    searchbar() {
      this.$router.push({path: '/search', query: { nick: this.search }})
    }
  }
});
</script>

<style scoped>
  @import '../assets/main_page.scss';

  .v-application{
    background: #181818 !important;
  }

.side-bar {
  border-right: 3px solid #ffa768 !important;
  /* height: 69px !important; */
  /* max-height: 10%;
  min-height: 2%;
  padding-top: 0.2%; */
  box-shadow: inset -50px 0px 30px -45px #fc6500, 0px 0px 30px 7px #fc6500 !important;
}

.text-field_search {
  /* min-width: 100%;
  max-width: 100%; */
  width: 100%;
  box-shadow: inset 0px 0px 20px 0px #f27719, 0px 0px 20px 0px #f27719 !important;
  border: 3px solid #ffc79c !important;
}

.title {
  text-overflow: clip;
  overflow: visible;
}

.neonText {
  color: #e6ffff;
  text-shadow:
    0 0 7px #f27719,
    0 0 8px #f27719,
    0 0 9px #f27719 !important;
}

.menu-icon {
  color: #f27719 !important;
  box-shadow: 0px 0px 20px 0px #f27719, inset 0px 0px 10px 1px #f27719;
  border: 3px solid #ffc79c;
  border-radius: 7px;
}

.open-menu{
  color: #f27719 !important;
  box-shadow: 0px 0px 20px 0px #f27719, inset 0px 0px 10px 1px #f27719;
  border: 3px solid #ffc79c;
  border-radius: 40px;
}

.top_bar_style {
  border-bottom: 3px solid #ffa768 !important;
  height: 69px !important;
  /* max-height: 10%;
  min-height: 2%;
  padding-top: 0.2%; */
  box-shadow: inset 0px -30px 25px -25px #fc6500, 0px 0px 30px 0px #fc6500 !important;
}

.logout-btn {
  border: 3px solid #ffc79c !important;
  box-shadow: 0px 0px 20px 0px #f27719, inset 0px 0px 26px 1px #f27719;
}

</style>