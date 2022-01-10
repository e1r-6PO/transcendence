<template>
  <v-btn
    :class="getClasse()"
    :small="smaller"
    :disabled="disable"
    :icon="!isText"
    :text="isText"
    :width="setWidthIcon()"
    :height="!isText ? setWidthIcon(): setHeightText()"
    :style="getStyle()"
    @click.stop="btnClicked()"
    v-on:mouseover="btnFocus = true"
    v-on:mouseleave="btnFocus = false"
  >
    <v-icon :size="iconSize" :small="smaller" v-if="!isText"> {{content}} </v-icon>
    <h4 v-else>{{ content }} </h4>
  </v-btn>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "nuxt-property-decorator";

@Component
export default class CloseBtn extends Vue {
  
  @Prop({ type: String, default: "" })
  content!: string

  @Prop({ type: Boolean, default: false })
  isText!: Boolean
  
  @Prop({ type: Boolean, default: false })
  disable!: Boolean

  @Prop({ type: Boolean, default: false})
  smaller!: Boolean

  @Prop({ type: Number, default: 0 })
  width!: Number
  
  @Prop({ type: Number, default: 0 })
  height!: Number

  @Prop({ type: String, default: "" })
  backgroundColor!: String

  @Prop({ type: String, default: "" })
  color!: String

  @Prop({ type: String, default: "" })
  neonColor!: String

  @Prop({type: Number, default: 25 })
  iconSize!: Number

  btnFocus: boolean = false

  btnClicked() {
    this.$emit('click')
  }

  setWidthIcon() {
    if (this.width != 0)
      return this.width
  }

  setHeightText() {
    if (this.height != 0)
      return this.height
  }

  @Watch('disable', {immediate: true})
  getClasse(): string {
    var classes = ""

    if (this.disable)
    {
      this.btnFocus = false
      return "neon-button"
    }
    if (this.neonColor == "purple")
      classes += "neon-button"
    else if (this.neonColor == "red")
      classes += "neon-button-red"
    else if (this.neonColor == "blue")
      classes += "neon-button-blue"
    else if (this.neonColor == "yellow")
      classes += "neon-button-yellow"
    else if (this.neonColor == "green")
      classes += "neon-button-green"
    else if (this.neonColor == "orange")
      classes += "neon-button-orange"
    else if (this.neonColor == "pink")
      classes += "neon-button-pink"
    else if (this.neonColor == "white")
      classes += "neon-button-white"
    else if (this.neonColor == "light-blue")
      classes += "neon-button-light-blue"
    else if (this.neonColor == 'none')
      classes += ""
    else
      classes += "neon-button"
    return classes
  }

  getStyle() {
    var style = ""
    
    if (this.backgroundColor != "")
      style += "background-color: " + this.backgroundColor + ";"
    if (this.isText)
      style += "border-radius: 10px;"
    if (this.btnFocus && !this.disable && this.color == "")
    {
      style += "color: "
      if (this.neonColor == "red")
        style += "#d61c1c"
      else if (this.neonColor == "blue")
        style += "#3c58d3"
      else if (this.neonColor == "yellow")
        style += "#fff3b2"
      else if (this.neonColor == "green")
        style += "#32c44a"
      else if (this.neonColor == "orange")
        style += "#ffc79c"
      else if (this.neonColor == "pink")
        style += "#ee8be9"
      else if (this.neonColor == "white")
        style += "#ece3e3"
      else if (this.neonColor == "light-blue")
        style += "#a5fafa"
      else if (this.neonColor == 'none')
        style += "grey"
      else
        style += "#cd78ff"
      style += ";"
    }
    else
      style += "color: " + (this.color != "" ? this.color : "#616161") + ";"
    return style
  }
}
</script>

<style>
@import '../../../assets/Classes-scss/main_page.scss';
@import '../../../assets/Classes-scss/neon_effects.scss';
@import '../../../assets/Classes-scss/basicBtn_colors.scss';
</style>