<template> 
</template>

<script lang='ts'>

import Vue from 'vue'

export default Vue.extend({

  middleware: 'login',

  data() {
    return {
      message: '',
      messages: Array<string>(),
    }
  },

  methods: {
    sendMessage(): void {
      this.$socket.client.emit('msgToServer', this.message);
        this.message = '';
      }
  },

  mounted() {
    this.$socket.$subscribe('msgToClient', (msg: string) => {
      this.messages.push(msg);
    })
  }
})

</script>
