<template>
  <v-row>
    <v-col>
      <v-footer absolute>
        <v-row justify="align-center">
          <v-col justify="center" align="center">
        <v-text-field
          v-model="message"
          append-outer-icon="mdi-send"
          filled
          clear-icon="mdi-close-circle"
          clearable
          label="Message"
          @click:append-outer="sendMessage"
          @click:clear="clearMessage"
        ></v-text-field>
        </v-col>
        </v-row>
      </v-footer>
    </v-col>
  </v-row>
</template>

<script lang="ts">

export default {
  
    mounted() {
    this.socket = this.$nuxtSocket({
      channel: '/index'
    })
    /* Listen for events: */
    this.socket
    .on('someEvent', (msg, cb) => {
      /* Handle event */
    })
  },
    data: () => ({
      message: '',
    }),

    methods: {
      sendMessage () {
        this.clearMessage()
      },
      clearMessage () {
        this.message = ''
      },
    },
  }
</script>
