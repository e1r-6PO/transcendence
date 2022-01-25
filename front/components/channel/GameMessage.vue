<template>
<v-card :class="getClasse()" align="center" min-width="350" max-width="500" width="50%" min-heigt="100" max-height="300">
  <v-list-item class="justify-center">
    <v-list-item-content>
    <v-icon large :color="getColorIcon()"> mdi-fencing </v-icon>
    <v-list-item-title v-if="msg.game_state == 'pending'" class="white--text">
      <p class="mb-1" style="font-size: 110%">{{ msg.sender.nickName }} challenges you in a pong game.</p>
      <p class="mb-4">Rules are the following :</p>
      <p class="mb-1 ml-10" align="start">- Total balls : {{ gameParam.ballAmount }}</p>
      <p class="mb-1 ml-10" align="start">- The size of paddles is : {{ gameParam.paddleSize }}</p>
      <p class="mb-1 ml-10" align="start">- First to {{ gameParam.pointsToWin }} points</p>
    </v-list-item-title>
    <v-list-item-title v-if="msg.game_state == 'canceled'" class="white--text">
      <p class="mb-1" style="font-size: 110%">{{ msg.target.nickName }} refused the challenge.</p>
    </v-list-item-title>
    <v-list-item-title v-if="msg.game_state == 'finish'" class="white--text">
      <p class="mb-1" style="font-size: 110%">{{ msg.winner.nickName }} win the game</p>
    </v-list-item-title>
    
    <!-- <BasicBtn v-if="msg.game_state == 'pending' && !isYourMsg(msg)" content="mdi-check" v-on:click="acceptGame(msg)"></BasicBtn> -->
              <!-- <BasicBtn v-if="msg.game_state == 'pending'" content="mdi-close" v-on:click="denyGame(msg)"></BasicBtn> -->
    </v-list-item-content>
  </v-list-item>
  <div v-if="msg.game_state == 'pending'" class="d-flex justify-center align-center pb-2">
    <BasicBtn @click="acceptGame()" content="mdi-check" neonColor="red" class="mr-2" />
    <BasicBtn @click="denyGame()" content="mdi-close" neonColor="green" class="ml-2" />
  </div>
</v-card>
</template>

<script lang="ts">
import { Component, Prop } from 'nuxt-property-decorator'
import Vue from 'vue'
import { Messages } from '../../assets/Classes-ts/Messages'
import { PrivateMessages } from '../../assets/Classes-ts/PrivateMessages'
import socket_game from '../../plugins/game.io'

@Component({})
export default class GameMessage extends Vue {
  
  @Prop({ type: Object, default: new PrivateMessages() })
  msg!: PrivateMessages

  @Prop({ type: Boolean, default: false})
  ownerMsg!: Number

  @Prop({ type: Number, default: '10' })
  meId!: Number

  gameParam = JSON.parse(this.msg.message)

  mounted() {
    console.log(this.msg)
    console.log(this.gameParam)
  }

  acceptGame() {
    socket_game.emit('acceptGame', {id: this.msg.game_id})
  }

  denyGame() {
    console.log(this.msg.game_id)
    socket_game.emit('denyGame', {id: this.msg.game_id})
  }

  getClasse(): string {
    if (this.ownerMsg)
    {
      console.log(this.meId)
      if(this.msg.game_state == 'finish')
      console.log(this.msg.winner.id)
      if (this.msg.game_state == 'finish' && this.msg.winner.id == this.meId)
        return 'bubble bubble_right-game-win'
      else if (this.msg.game_state == 'finish' && this.msg.winner.id != this.meId)
        return 'bubble bubble_right-game-lose'
      else if (this.msg.game_state != 'finish')
        return 'bubble bubble_right-game'
    }
    else
    {
      if (this.msg.game_state == 'finish' && this.msg.winner.id == this.meId)
        return 'bubble bubble_left-game-win'
      else if (this.msg.game_state == 'finish' && this.msg.winner.id != this.meId)
        return 'bubble bubble_left-game-lose'
      else if (this.msg.game_state != 'finish')
        return 'bubble bubble_left-game'
    }
  }

  getColorIcon(): string {
    if (this.msg.game_state == 'pending' && this.ownerMsg)
      return '#0affff'
    else if (this.msg.game_state == 'pending' && !this.ownerMsg)
      return '#f27719'
    else if (this.msg.game_state == 'finish' && this.msg.winner.id == this.meId)
      return '#32c44a'
    else if (this.msg.game_state == 'finish' && this.msg.winner.id != this.meId)
      return '#d61c1c'
// ?    if (this.msg.game_state == 'finish' && this.msg.winner.id == this.meId)
//  ?     return '#0affff'
  }

}
</script>

<style>
@import '../../assets/Classes-scss/chat_bubble.scss';
</style>