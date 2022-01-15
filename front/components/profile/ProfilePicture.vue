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
      :style="'width: ' + size + 'px;'"
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

  @Prop({ default: false })
  isActive!: Boolean | Number

  @Prop({ type: Boolean, default: false})
  disable!: Boolean

  @Prop({ type: String, default: "" })
  neonColor!: String

  getClasses(): string {
    var classes = ""
    if (this.neonColor != "")
      classes = "profile-picture-" + this.neonColor
    else if (this.isActive != null)
      classes = this.isActive ? 'profile-picture-green' : 'profile-picture-red'
    return classes
  }

  sendClick() {
    this.$emit("click")
  }
}
</script>

<style>
@import '../../assets/Classes-scss/profilePicture_colors.scss';
</style>