<template>
  <div>
    <BasicBtn @click="leaveChannel()" :height="50" isText content="Leave" neonColor="red" />
  </div>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import Vue from 'vue'

@Component
export default class ChannelLeaveBtn extends Vue{
  
  dialog: boolean = false
  btnFocus: boolean = false

  leaveChannel() {
    this.$axios.post('/api/chat/' + this.$route.params.slug + '/leave')
    this.$router.push('/chat')
    this.$emit("refreshUser")
  }
}
</script>