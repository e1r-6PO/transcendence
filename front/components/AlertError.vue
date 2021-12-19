<template>
  <v-alert
    v-model="alertCode"
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
import Vue from 'vue'

export default Vue.extend({
  middleware: 'login',
  name: "AlertError",

  data() {
    return {
      alertCode: false,
      alertType: 'error',
      alertText: '',
    }
  },

  methods: {
    
    activeAlert(alert: string) {
      this.alertType = 'error'
      this.alertText = alert
      this.alertCode = true
      setTimeout(() => {
        this.alertCode = false
      }, 2000)
      // this.$emit("alertEnd")
    },
  }
})
</script>