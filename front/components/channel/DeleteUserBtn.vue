<template>
  <BasicBtn
    @click="deleteUser()"
    content="mdi-account-minus"
    width="30"
    :iconSize="18"
    :smaller="small"
  />
</template>
      
<script lang="ts">
import { Component, Prop } from 'nuxt-property-decorator';
import Vue from 'vue'
import socket_chat from '../../plugins/chat.io'

@Component
export default class DeleteUserBtn extends Vue{
  
  @Prop({ type: String, default: ""})
  userName!: string

  @Prop({ type: Boolean, default: false})
  small!: Boolean
  
  async deleteUser() {
    const ret = await this.$axios.delete('/api/chat/' + this.$route.params.slug + '/deleteUser?userName=' + this.userName)
      .catch(function(error) {
        return error.response
    })
    if (ret.status == 403)
      this.activeAlert(ret.data.message)
    else if (ret.status == 404)
      this.$router.push('/chat?error=' + ret.data.message)
    else
      socket_chat.emit('deleteUser', this.$route.params.slug, this.userName)
  }

  activeAlert(error: string)
  {
    this.$emit('error', error)
  }
}
</script>
