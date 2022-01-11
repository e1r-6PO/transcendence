<template>
  <div>
    <BasicBtn @click="leaveChannel()" :height="50" isText content="Leave" neonColor="red" />
  </div>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import Vue from 'vue'
import socket_chat from '../../plugins/chat.io'

@Component
export default class ChannelLeaveBtn extends Vue{
  
  leaveChannel() {
    this.$axios.post('/api/chat/' + this.$route.params.slug + '/leave')
    this.$router.push('/chat')
    this.$emit("refreshUser")
    socket_chat.emit('userLeaveChannel', this.$route.params.slug)
  }
}
</script>