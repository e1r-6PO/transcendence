<template>
  <BasicBtn
    v-on:click="changeGrade()"
    :content="grade == isAdmin() ? 'mdi-account-arrow-down' : 'mdi-account-arrow-up'"
    :smaller="small"
  />
</template>
      
<script lang="ts">
import { Component, Prop } from 'nuxt-property-decorator';
import Vue from 'vue'
import { ChannelUser, ChannelUserStatus } from '../../assets/Classes-ts/ChannelUser';

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
    console.log(ret)
    if (ret.status == 403)
      this.activeAlert(ret.data.message)
    else if (ret.status == 404)
      this.$router.push('/chat?error=' + ret.data.message)
    else
      this.$emit('refreshUser')
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
