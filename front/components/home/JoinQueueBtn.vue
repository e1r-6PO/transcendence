<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" class="custom-svg" @click="emitEvent()">
    <circle id="arc0" :class="getCircleSpeed()" class="circle circle-white" cx="300" cy="300" r="270" opacity="1" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="square" stroke-opacity=".99213" paint-order="fill markers stroke"/>
    <circle id="arc1" :class="getCircleColor()" class="circle" cx="300" cy="300" r="240" opacity=".89" fill="none" stroke="#632b26" stroke-width="12" stroke-linecap="square" stroke-opacity=".99213" paint-order="fill markers stroke"/>
    <circle id="arc2" :class="getCircleColor()" class="circle" cx="300" cy="300" r="240" opacity=".49" fill="none" stroke="#632b26" stroke-width="8" stroke-linecap="square" stroke-opacity=".99213" paint-order="fill markers stroke"/>
    <circle id="arc3" :class="getCircleColor()" class="circle" cx="300" cy="300" r="200" opacity=".49" fill="none" stroke="#632b26" stroke-width="17" stroke-linecap="square" stroke-opacity=".99213" paint-order="fill markers stroke"/>
    <circle id="arc4" :class="getCircleColor()" class="circle" cx="300" cy="300" r="220" opacity=".49" fill="none" stroke="#632b26" stroke-width="17" stroke-linecap="square" stroke-opacity=".99213" paint-order="fill markers stroke"/>
    <circle id="arc5" :class="getCircleColor()" class="circle" cx="300" cy="300" r="200" opacity=".89" fill="none" stroke="#632b26" stroke-width="8" stroke-linecap="square" stroke-opacity=".99213" paint-order="fill markers stroke"/>
    <circle id="arc6" :class="getCircleColor()" class="circle" cx="300" cy="300" r="180" opacity=".49" fill="none" stroke="#632b26" stroke-width="16" stroke-linecap="square" stroke-opacity=".99213" paint-order="fill markers stroke"/>
    <circle id="arc7" :class="getCircleColor()" class="circle" cx="300" cy="300" r="180" opacity=".89" fill="none" stroke="#632b26" stroke-width="8" stroke-linecap="square" stroke-opacity=".99213" paint-order="fill markers stroke"/>
    <circle id="arc8" :class="getCircleColor()" class="circle" cx="300" cy="300" r="160" opacity=".79" fill="#4DD0E1"
    fill-opacity="0"         stroke="#632b26" stroke-width="8" stroke-linecap="square" stroke-opacity=".99213" paint-order="fill markers stroke"/>

    <text :x="inQueue ? 197 : 213" :y="inQueue ? 305 : 308" :style="'font-size: ' + (inQueue ? '270%;' : '320%;')">{{msg}}</text>
  </svg>
</template>

<script lang="ts">
import { Component, Prop } from 'nuxt-property-decorator'
import Vue from 'vue'

@Component
export default class JoinQueueBtn extends Vue{

  @Prop({ type: Boolean })
  inQueue!: boolean

  @Prop({ type: String })
  msg!: boolean

  emitEvent() {
    this.$emit('click')
  }

  getCircleColor() {
    if (this.inQueue == false)
      return 'circle-blue'
    else if (this.inQueue == true) {
      return 'circle-orange'
    }
  }

  getCircleSpeed() {
    if (this.inQueue == false)
      return 'arc0-no-queue'
    else if (this.inQueue == true) {
      return 'arc0-queue'
    }
  }
}

</script>

<style scoped>
  body{
    background: #000000;
    background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Cg fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.4"%3E%3Cpath opacity=".5" d="M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z"/%3E%3Cpath d="M6 5V0H5v5H0v1h5v94h1V6h94V5H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');
  }

  .custom-svg{
    /* position: relative; */
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    cursor: pointer;
  }
  
  /* svg circle{
    stroke: #4DD0E1;
  } */

  .circle-blue{
    stroke: #4DD0E1;
  }

  .circle-orange{
    stroke: #f27719;
  }

  .circle-white{
    stroke: #ffffff;
  }

  .circle{
    transform-origin: center ;
  }
  .arc0-queue{
    stroke-dasharray: 60;
    stroke-dashoffset: 18;
    animation: 5s -2s rota infinite linear;
  }
  .arc0-no-queue{
    stroke-dasharray: 60;
    stroke-dashoffset: 18;
    animation: 25s -2s rota infinite linear;
  }
  #arc1{
    stroke-dasharray: 30;
    stroke-dashoffset: 18;
    animation: 10s -2s rota infinite linear;
  }
  #arc3{
    stroke-dasharray: 400;
    stroke-dashoffset: 400;
    animation: 16s 1s rota infinite linear;
  }
  #arc4{
    stroke-dasharray: 400;
    stroke-dashoffset: 400;
    animation: 6s 1s rota infinite linear reverse;
  }
  #arc5{
    stroke-dasharray: 400;
    stroke-dashoffset: 400;
    animation: 4s 1s rota infinite linear;
  }
  #arc6{
    stroke-dasharray: 400;
    stroke-dashoffset: 400;
    animation: 8s 1s rota infinite linear alternate;
  }
  #arc7{
    stroke-dasharray: 400;
    stroke-dashoffset: 400;
    animation: 4s 1s rota infinite linear reverse;
  }
  #arc8{
    stroke-dasharray: 400;
    stroke-dashoffset: 400;
    animation: 4s 1s rota infinite linear reverse;
  }
  text{
    fill: #ffffff;
    font: bold 45px OrbitronM;
  }
  @keyframes rota{
    from{
      transform: rotate(0deg);
    }
    to{
      transform: rotate(360deg);
    }
  }
</style>