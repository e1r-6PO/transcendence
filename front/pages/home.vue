<template>  
</template>

<script lang='ts'>

import login from '../middleware/login'

import Component from 'vue-class-component'

import Vue from 'vue'

@Component({
    middleware: login,
})
export default class extends Vue {

}
</script>
