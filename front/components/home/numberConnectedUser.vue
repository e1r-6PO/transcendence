<template>
  <div style="color: white">
    {{ amount }}
    <v-icon
      color="red"
    >
      mdi-account
    </v-icon>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import Vue from 'vue'

@Component
export default class numberConnectedUser extends Vue {

  @Prop({type: Number})
  amount!: number
}
</script>

<style>

</style>