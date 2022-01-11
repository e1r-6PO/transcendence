<template>
  <v-text-field
    v-model="content"
    :placeholder="placeholder"
    class="mt-3 custom-select-color text-white"
    :class="disable ? 'placeholder-color-disable' : 'placeholder-color'"
    :style="doStyle()"
    color="blue"
    hide-details
    filled
    dense
    rounded
    :disabled="disable"
    :autofocus="autofocus"
    @input="updateValue"
    @keypress.enter="sendClick"
  >
    <template v-slot:append v-if="content != ''">
      <v-icon @click="clearMessage()" color="#b8a435"> mdi-close-circle </v-icon>
    </template>
    <v-icon v-if="append_outer_icon != '' " slot="append-outer" @click="sendClick" color="#b8a435" class="mr-5"> {{ append_outer_icon }} </v-icon>
  </v-text-field>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'nuxt-property-decorator'
import Vue from 'vue'

@Component
export default class TextField extends Vue {
  
  @Prop({ type: String, default: "" })
  placeholder!: String

  @Prop({ default: 0 })
  width!: Number | String
  
  @Prop({ type: String, default: "" })
  value!: String

  @Prop({ type: Boolean, default: false })
  disable!: Boolean

  @Prop({ type: Boolean, default: false })
  autofocus!: Boolean

  @Prop({ type: String, default: '' })
  append_outer_icon!: String

  content: String = this.value

  updateValue() {
    this.$emit('input', this.content)
  }

  sendClick() {
    this.content = ""
    this.$emit('enterPress')
  }

  @Watch('value', {immediate: true})
  valueChange() {
    this.content = this.value
  }

  clearMessage() {
    this.content = ""
    this.updateValue()
  }

  doStyle(): string {
    var style = ""

    if (this.width > 200)
      style += "width: " + this.width + "px;"
    else
      style += "width: 100% !important;"
    return style
  }
}
</script>

<style>
@import '../../../assets/Classes-scss/main_page.scss';
@import '../../../assets/Classes-scss/neon_effects.scss';

.text-white input {
  color: #e6ffff !important;
}

.placeholder-color-disable input::placeholder {
  color: #efffff22 !important;
}

.placeholder-color input::placeholder {
  color: #efffff !important;
  opacity: 0.65;
}
</style>