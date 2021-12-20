<template>
  <v-btn
    :icon="!isText"
    class="neon-button"
    :text="isText"
    :color="btnFocus == true ? '#9141c7' : 'black'"
    @click.stop="btnClicked()"
    v-on:mouseover="btnFocus = true"
    v-on:mouseleave="btnFocus = false"
  >
    <v-icon v-if="!isText"> {{content}} </v-icon>
    <h4 v-else>{{ content }} </h4>
  </v-btn>
</template>

<script lang="ts">
import { Component, Prop } from "nuxt-property-decorator";
import Vue from 'vue'

@Component
export default class CloseBtn extends Vue {
  
  @Prop({default: "" })
  content!: string

  @Prop({ default: false })
  isText!: boolean

  btnFocus: boolean = false

  btnClicked() {
    this.$emit('click')
  }
}
</script>

<style>
@import '../../../assets/Classes-scss/main_page.scss';
</style>