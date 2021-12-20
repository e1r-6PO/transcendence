<template>
  <v-btn
    icon
    class="neon-button"
    :color="btnFocus == true ? '#9141c7' : 'black'"
    @click.stop="btnClicked()"
    v-on:mouseover="btnFocus = true"
    v-on:mouseleave="btnFocus = false"
  >
    <v-icon> {{customMdi}} </v-icon>
  </v-btn>
</template>

<script lang="ts">
import { Component, Prop } from "nuxt-property-decorator";
import Vue from 'vue'

@Component
export default class CloseBtn extends Vue {
  
  @Prop({default: ""})
  customMdi!: string

  btnFocus: boolean = false

  btnClicked() {
    this.$emit('click')
  }
}
</script>

<style>
@import '../../../assets/Classes-scss/main_page.scss';
</style>