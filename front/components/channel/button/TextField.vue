<template>
  <v-text-field
    v-model="content"
    :placeholder="placeholder"
    class="mt-3 text-white input-custom"
    :class="doClasses()"
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
    <v-icon v-if="append_outer_icon != '' " slot="append-outer" @click="sendClick" :color="neonColor" class="mr-5"> {{ append_outer_icon }} </v-icon>
    <v-icon v-if="prepend_inner_icon != ''" slot="prepend-inner" @click="sendClick" :color="neonColor"> {{ prepend_inner_icon }} </v-icon>
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

  @Prop({ type: String, default: '' })
  prepend_inner_icon!: String

  @Prop({ type: String, default: "yellow" })
  neonColor!: String

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

  doClasses(): string {
    var classes = ""

    classes += "custom-select-color-" + this.neonColor + " "
    classes += (this.disable ? 'placeholder-color-disable ' : 'placeholder-color ')
    return classes
  }

  doStyle(): string {
    var style = ""

    style += "min-width: 50px !important; "
    if (this.width >= 50)
      style += "width: " + this.width + "px;"
    else
      style += "width: 100% !important;"
    return style
  }
}
</script>

<style>
@import '../../../assets/Classes-scss/main_page.scss';
@import '../../../assets/Classes-scss/textfield_colors.scss';
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

.input-custom .v-input__slot {
  padding-right: 10px !important;
}
</style>