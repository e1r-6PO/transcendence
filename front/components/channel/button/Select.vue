<template>
  <v-select
    :items="itemsList"
    :placeholder="placeholder"
    v-model="content"
    hide-details
    filled
    dense
    rounded
    class="mt-3 custom-select-placeholder-color custom-select-color-yellow"
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
import { Component, Prop, Watch } from 'nuxt-property-decorator'
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

  @Watch('value')
  watchValue() {
    this.content = this.value
  }

  updateValue() {
    this.$emit('input', this.content)
  }

  test() {
    console.log(this.itemsList)
  }
}
</script>

<style>

.theme--light.v-list {
  background-color: #181818 !important;
}

.custom-select-placeholder-color .v-select__slot ::placeholder {
  color: #e6ffff !important;
  opacity: 0.65;
}

</style>