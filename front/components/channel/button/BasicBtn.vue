<template>
  <v-btn
    class="neon-button"
    :small="smaller"
    :disabled="disable"
    :icon="!isText"
    :text="isText"
    :style="isText ? 'border-radius: 10px': ''"
    :color="btnFocus == true ? '#cd78ff' : '#616161'"
    @click.stop="btnClicked()"
    v-on:mouseover="btnFocus = true"
    v-on:mouseleave="btnFocus = false"
  >
    <v-icon :small="smaller" v-if="!isText"> {{content}} </v-icon>
    <h4 v-else>{{ content }} </h4>
  </v-btn>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator";

@Component
export default class CloseBtn extends Vue {
  
  @Prop({ type: String, default: "" })
  content!: string

  @Prop({ type: Boolean, default: false })
  isText!: boolean

  @Prop({ default: false })
  disable!: boolean

  @Prop({ type: Boolean, default: false})
  smaller!: Boolean

  btnFocus: boolean = false

  btnClicked() {
    this.$emit('click')
  }
}
</script>

<style>
@import '../../../assets/Classes-scss/main_page.scss';
@import '../../../assets/Classes-scss/neon_effects.scss';
</style>