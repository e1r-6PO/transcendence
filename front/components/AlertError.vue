<template>
  <v-alert v-if="state" :textError="textError" :state="state"
    outlined
    :type="type"
    text
    dismissible
    style="position: absolute; right: 0px; top: 30px; z-index: 12; width: 100%"
    align="center"
  >
    {{ textError }}
  </v-alert>
</template>

<script lang="ts">
import { Watch, Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class AlertError extends Vue{

  @Prop({ type: Boolean, default: false})
  state!: boolean

  @Prop({ type: String, default: "" })
  textError!: string

  @Prop({ type: String, default: "error" })
  type!: string

  alertCode: boolean = true
  alert: boolean = false

  @Watch('state', { immediate: true })
  onStateChange()
  {
    this.activeAlert()
  }

  activeAlert()
  {
      this.alert = true
      setTimeout(() => {
        this.$emit('end')
    }, 2000)
  }
}
</script>