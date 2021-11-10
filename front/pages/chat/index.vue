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

<script>

export default {
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
