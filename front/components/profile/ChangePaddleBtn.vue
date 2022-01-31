<template>
  <div>
    <v-dialog
      v-model="dialogPaddleColor"
      max-width="600px"
      content-class="custom-dialog-card-shadow"
    >
      <template v-slot:activator="{}">
        <v-row align="center" justify="center" style="margin-top: 20px; margin-bottom: 20px">
          <BasicBtn @change="selectedColor" :neonColor="selectedColor" @click="dialogPaddleColor = true" isText content="PADDLE customization" :width="220" :height="40"/>
        </v-row>
      </template>
      <v-card class="dialog_card">
        <v-card-title class="white--text justify-center">
          <span class="text-h5">Paddle Color</span>
          <v-spacer />
            <BasicBtn @click="dialogPaddleColor = false" content="mdi-close" neonColor="red" />
        </v-card-title>
        <v-card-text class="pb-1 pt-3">
          <v-container>
            <v-row align="center" justify="center">
              <BasicBtn
                v-for="color in colors"
                :key="color"
                :color="color"
                class="mr-3 mb-3"
                @click="set_color(color)"
                :content="color == 'white' ? 'OG' : color"
                isText
                :neonColor="color"
                :width="color == selectedColor ? '500px' : '90px'"
              >
              </BasicBtn>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'nuxt-property-decorator';
import Vue from 'vue'
import { ChannAccess } from '../../assets/Classes-ts/Messages'
import socket_chat from '../../plugins/chat.io'

@Component
export default class ChangePaddleBtn extends Vue{
  
  @Prop({ type: String, default: "cyan"})
  neonColor! :string

  dialogPaddleColor: boolean = false
  selectedColor: string = this.neonColor
  colors: Array<string> = [ 'red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple', 'pink' ]

  async mounted() {
    var ret = await this.$axios.$get('api/achievements/God of Pong')

    if (ret && ret.count >= ret.goal)
      this.colors.push("white")
  }

  async set_color(color: string) {
    this.selectedColor = color
    this.$emit('input', this.selectedColor)
    this.dialogPaddleColor = false
  }
}
</script>

<style>
@import '../../assets/Classes-scss/main_page.scss';
@import '../../assets/Classes-scss/neon_effects.scss';

</style>