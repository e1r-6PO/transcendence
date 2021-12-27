<template>
  <v-btn
    class="neon-button"
    :small="smaller"
    :disabled="disable"
    :icon="!isText"
    :text="isText"
    :width="setWidth()"
    :height="!isText ? setWidth(): ''"
    :style="getStyle()"
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

  @Prop({ type: Number, default: 0 })
  width!: Number

  @Prop({ type: String, default: "" })
  backgroundColor!: String

  @Prop({ type: String, default: "" })
  color!: String

  btnFocus: boolean = false

  btnClicked() {
    this.$emit('click')
  }

  setWidth() {
    if (this.width != 0)
      return this.width
  }

  getStyle() {
    var style = ""
    
    if (this.backgroundColor != "")
      style += "background-color: " + this.backgroundColor + ";"
    if (this.isText)
      style += "border-radius: 10px;"
    if (this.btnFocus)
      style += "color: #cd78ff;"
    else
      style += "color: " + (this.color != "" ? this.color : "#616161") + ";"
    return style
  }
}
</script>

<style>
@import '../../../assets/Classes-scss/main_page.scss';
@import '../../../assets/Classes-scss/neon_effects.scss';
</style>