<template>
  <v-app style="z-index: 10">
    <!-- Add fixed prop to v-navigation drawer to not blur the page -->
    <v-navigation-drawer
      v-model="drawer"
      app
      class="side-bar mt-15"
      color="#0f0f0f"
      style="z-index: 7"
      clipped
      temporary
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
          @click="redirect(item.to)"
          router
          exact
          plain
          text
        >
          <v-icon style="margin-left: 0px; margin-top: -20px">
            {{ item.icon }}
          </v-icon>
          <span style="margin-left: 20px; margin-top: -17px; font-family: OrbitronM; font-size: 115%">{{ item.title }}</span>
        </v-btn>
      </div>
    </v-navigation-drawer>
    <AlertError @end="closeAlert" :state="alert" :type="alertType" :textError="alertText" :width="250" :height="100" class="mt-11" style="position: absolute !important; right: 4px" />

    <v-app-bar
      fixed
      app
      color="#0f0f0f"
      class="top_bar_style"
      style="z-index: 10"
      clipped-left
    >
      <v-app-bar-nav-icon class="open-menu" @click.stop="drawer = !drawer" />
      <v-toolbar-title class="neonText" style="font-family: Tr2n; font-size: 220%; text-overflow: clip; overflow: visible; margin-top: 9px" v-text="title" />
      <v-spacer /> 
      <div style="padding-right: 20px">
        <v-row align="center" justify="center">
          <v-col align="right" justify="right">
            <TextField class="mb-2" @enterPress="searchbar" v-model="search"
              neonColor="orange" prepend_inner_icon="mdi-magnify" placeholder="Search"
              style="font-size: 115%; display: flex"
            />
          </v-col>
        </v-row>
      </div>
      <v-btn
        icon
        href="/api/auth/logout"
        class="logout-btn"
        style="margin-top: 2px"
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
      <Nuxt @inQueue="activeAlert" />
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
      alert: false,
      alertType: "warning",
      alertText: "",
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
        },
        {
          icon: 'mdi-medal',
          title: 'Achievements',
          to: '/achievements'
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
    this.$nuxt.$on('inQueue', () => this.activeAlert())
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

    redirect(url: string) {
      this.$router.push(url)
      this.drawer = !this.drawer
    },

    activeAlert() {
      if (this.alert == true)
        return
      this.alertText = "Do not refresh the page, we are looking for a match"
      this.alertType = 'warning'
      this.alert = true
    },

    closeAlert() {
      this.alert = false
    },
  }
});
</script>

<style scoped>
  @import '../assets/Classes-scss/main_page.scss';
  @import '../assets/Classes-scss/neon_effects.scss';
  @import '../assets/Classes-scss/neonText_colors.scss';

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