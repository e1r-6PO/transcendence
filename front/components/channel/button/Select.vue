<template>
  <v-select
    :items="itemsList"
    :placeholder="placeholder"
    v-model="content"
    hide-details
    filled
    dense
    rounded
    class="mt-3 custom-select-color custom-select-placeholder-color"
    color="yellow"
    item-color="yellow"
    @input="updateValue"
  >
    <template slot="item" slot-scope="data" style=" background-color: #181818 !important">
      <span @click="test()" style="color: white !important"> {{ data.item }} </span>
    </template>
    <template slot="selection" slot-scope="data" style=" background-color: #181818 !important">
      <span style="color: white !important"> {{ data.item }} </span>
    </template>
  </v-select>
</template>

<script lang="ts">
import { Component, Prop } from 'nuxt-property-decorator'
import Vue from 'vue'

@Component
export default class Select extends Vue {
  
  @Prop({ type: Array, default: new Array<String>() })
  itemsList!: Array<String>

  @Prop({ type: String, default: "" })
  placeholder!: String

  @Prop({ type: String, default: "" })
  value!: String

  content: String = this.value

  updateValue() {
    this.$emit('input', this.content)
  }
  
  test() {
    console.log(this.itemsList)
  }
}
</script>

<style scoped>
.theme--light.v-list {
  background-color: #181818 !important;
}

.custom-placeholder-color2 >>> .v-text-field__slot ::placeholder {
  color: #e6ffff !important;
}

</style>
</style>