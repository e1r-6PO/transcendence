<template>
  <BasicBtn
    @click="changeGrade()"
    width="30"
    :content="grade == isAdmin() ? 'mdi-account-arrow-down' : 'mdi-account-arrow-up'"
    :iconSize="18"
    :smaller="small"
  />
</template>
      
<script lang="ts">
import { Component, Prop } from 'nuxt-property-decorator';
import Vue from 'vue'
import { ChannelUser, ChannelUserStatus } from '../../assets/Classes-ts/ChannelUser';
import socket_chat from '../../plugins/chat.io'

@Component
export default class ChangeGradeUserBtn extends Vue{
  
  @Prop({ type: String, default: ""})
  userName!: string

  @Prop({ type: String, default: ""})
  grade!: string

  @Prop({ type: String, default: "default"})
  status!: string

  @Prop({ type: Boolean, default: false})
  small!: Boolean
  
  changeGrade() {
      this.switchGradeUser()
  }

  async switchGradeUser() {
    const ret = await this.$axios.patch('/api/chat/' + this.$route.params.slug + '/changeGrade?userName=' + this.userName)
      .catch(function(error) {
        return error.response
    })
    if (ret.status == 403)
      this.activeAlert(ret.data.message)
    else if (ret.status == 404)
      this.$router.push('/chat?error=' + ret.data.message)
    else
    {
      socket_chat.emit('refreshUser')
      socket_chat.emit('switchGrade', this.$route.params.slug, this.userName)
    }
  }

  activeAlert(error: string)
  {
    this.$emit('error', error)
  }

  isAdmin() {
    return (ChannelUserStatus.ADMINISTRATOR)
  }
}
</script>
