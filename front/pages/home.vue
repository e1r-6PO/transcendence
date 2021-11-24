<template>
<v-container style="margin-top: 15%">
  <div class="flex-container">

    <div >
      <v-card color="grey" width="700" height="700">
      <li v-for=" msg in messages" :key="messages[msg]">
        {{ msg }}
      </li>
      </v-card>
    </div>
    <div>
      <v-text-field
        background-color="white"
        color="blue"
        v-model="message"
        filled
        clear-icon="mdi-close-circle"
        clearable
        label="Message"
        @keypress.enter="sendMessage"
      >
        <v-icon slot="append-outer" color="blue"> mdi-send </v-icon>
      </v-text-field>
    </div>
  </div>
</v-container>
</template>

<script lang='ts'>

import Vue from 'vue'

export default Vue.extend({

  middleware: 'login',

  data() {
    return {
      message: '',
      messages: new Array<string>(),
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
      console.log(this.$socket);
    })
  }
})

</script>

<style scoped>

.flex-container {
  /* We first create a flex layout context */
  display: flex;
  
  /* Then we define the flow direction 
     and if we allow the items to wrap 
   * Remember this is the same as:
   * flex-direction: row;
   * flex-wrap: wrap;
   */
  flex-flow: column wrap;
  
  /* Then we define how is distributed the remaining space */
  justify-content: center;
  align-content: center;
  list-style: none;
  row-gap: 50px;
}

</style>
