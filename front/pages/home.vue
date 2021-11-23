<template>
  <v-main>
    <div>
      <li v-for=" (msg, index) in messages" :key="`msg-${index}`">
      </li>
    </div>
    <div>
        <v-footer absolute class="foregound_element">
          <v-row>
            <v-col justify="center" align="center">
          <v-text-field
            v-model="message"
            append-outer-icon="mdi-send"
            filled
            clear-icon="mdi-close-circle"
            clearable
            label="Message"
          ></v-text-field>
          </v-col>
          </v-row>
        </v-footer>
    </div>
  </v-main>
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
  flex-flow: row wrap;
  
  /* Then we define how is distributed the remaining space */
  justify-content: space-around;
  align-content: center;
  list-style: none;

}

</style>
