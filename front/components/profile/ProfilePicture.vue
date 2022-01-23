<template>
  <v-btn
    @click="sendClick()"
    :width="size"
    :disabled="disable"
    icon
    class="ml-3"
    style="border-radius: 100%"
  >
    <img
      style="border-radius: 100% !important;"
      :style="getStyle()"
      :src="src"
      :class="getClasses()"
    />
  </v-btn>
</template>

<script lang="ts">
import { Component, Prop } from 'nuxt-property-decorator'
import Vue from 'vue'

@Component
export default class ProfilePicture extends Vue {
  
  @Prop({ default: "40" })
  size!: Number | String

  @Prop({ type: String, default: "" })
  src!: String

  @Prop({ default: null })
  isActive!: Boolean | Number

  @Prop({ default: "" })
  currentGame!: string

  @Prop({ type: Boolean, default: false})
  disable!: Boolean

  @Prop({ type: String, default: "" })
  neonColor!: String

  getClasses(): string {
    var classes = ""
    if (this.neonColor != "")
      classes = "profile-picture-" + this.neonColor
    else if (this.currentGame != "")
      classes = 'profile-picture-purple'
    else if (this.isActive != null)
      classes = this.isActive ? 'profile-picture-green' : 'profile-picture-red'
      // console.log(this.size)
    return classes
  }

  getStyle(): string {
    var style = ""

    style += "width: "
    // console.log(typeof(this.size))
    // console.log(typeof("42"))
    if (typeof(this.size) == typeof(42))
      style += this.size + "px"
    else if (typeof(this.size) == typeof("42"))
    {
      // console.log("string")
      // console.log(this.size)
      var strSize: String = this.size.toString()
      style += strSize
      if (strSize.search('%') == -1)
        style += "px"
    }
    style += ";"
    return style
}

  sendClick() {
    this.$emit("click")
  }
}
</script>

<style>
@import '../../assets/Classes-scss/profilePicture_colors.scss';
</style>