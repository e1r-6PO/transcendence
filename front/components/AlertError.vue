<template>
  <v-alert v-if="state" :state="state"
    outlined
    :type=alertType
    text
    dismissible
    style="position: absolute; right: 0px; top: 30px; z-index: 12; width: 100%"
    align="center"
  >
    {{ alertText }}
    <slot></slot>
  </v-alert>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class AlertError extends Vue{

  @Prop({ type: Boolean, default: false})
  state!: boolean

      alertCode: boolean = true
      alertType: string = 'error'
      alertText: string = ""
}
</script>