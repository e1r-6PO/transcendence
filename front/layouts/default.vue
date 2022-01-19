<template>
  <v-app style="z-index: 10">
    <v-navigation-drawer
      v-model="drawer"
      fixed
      app
      class="side-bar"
      color="#0f0f0f"
      style="z-index: 7"
      clipped
      stateless
    >
      <div style="display: flex ; flex-direction: column; margin-top: 10px">
        <v-btn
          depressed
          class="title_color neonText no-uppercase pt-5"
          color="white"
          style="margin-top: 10px; justify-content: start !important"
          x-large
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          @click="drawer = !drawer"
          router
          exact
          plain
          text
        >
          <v-icon style="margin-left: 20px; margin-top: -20px">
            {{ item.icon }}
          </v-icon>
          <span style="margin-left: 20px; margin-top: -20px">{{ item.title }}</span>
        </v-btn>
      </div>
    </v-navigation-drawer>

    <v-app-bar
      fixed
      app
      color="#0f0f0f"
      class="top_bar_style"
      style="z-index: 10"
      clipped-left
    >
      <v-app-bar-nav-icon class="open-menu mt-3" @click.stop="drawer = !drawer" />
      <v-toolbar-title class="title neonText" v-text="title" />
      <v-spacer />
      <div style="padding-right: 15px">
        <v-row align="center" justify="center">
          <v-col align="right" justify="right">
            <TextField @enterPress="searchbar" v-model="search" neonColor="orange" prepend_inner_icon="mdi-magnify" placeholder="Search" />
          </v-col>
        </v-row>
      </div>
      <v-btn
        icon
        href="/api/auth/logout"
        class="logout-btn mt-3"
        :color="exitFocus == true ? '#ffc79c' : 'black'"
        v-on:mouseover="exitFocus = true"
        v-on:mouseleave="exitFocus = false"
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

import Vue from 'vue'
import socket_active from '../plugins/active.io'
import socket_game from '../plugins/game.io'

export default Vue.extend({

  data () {
    return {
      search: "",
      drawer: false,
      fixed: false,
      exitFocus: false,
      channMenu: false,
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
          title: 'Leaderboard',
          to: '/leaderboard'
        }
      ],
      right: true,
      rightDrawer: false,
      title: 'Tronscendence'
    }
  },

  async mounted() {
    if (!socket_active.connected)
      socket_active.connect()
    if (!socket_game.connected)
      socket_game.connect()
  },

  async created() {
    socket_game.on('notificationPrivateGameInvite', (info) => {
      // you received an invitation to play a private game, accept or deny it

      // socket_game.emit('denyGame', { id: info })
      // or
      // socket_game.emit('acceptGame', { id: info })
    })
    socket_game.on('privateGameStarting', (info) => {
      // the other personne accepted the invitation
      this.$router.push('/game/' + info + '?next=' + window.location.pathname)
    })
    socket_game.on('notificationPrivateGameInviteSent', (info) => {
      // you invited someone to a game and it was successfully sent
    })
  },

  methods: {
    searchbar() {
      this.$router.push({path: '/search', query: { nick: this.search }})
    },
  }
});
</script>

<style scoped>
  @import '../assets/Classes-scss/main_page.scss';
  @import '../assets/Classes-scss/neon_effects.scss';

.v-application{
    background: #181818 !important;
  }

.no-uppercase {
  text-transform: none;
}

.v-btn {
  justify-content: space-evenly;
}

</style>