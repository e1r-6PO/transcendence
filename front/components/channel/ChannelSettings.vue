<template>
  <div>
    <v-dialog
      v-model="dialog"
      max-width="500"
      transition="dialog-top-transition"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-row align="center" justify="center" style="margin-top: 0px">
          <v-card
            class="neon-button"
            color="#181818"
            style="border-radius: 15px;"
            link
            width="100"
            v-bind="attrs"
            v-on="on"
            v-on:mouseover="settingsFocus = true"
            v-on:mouseleave="settingsFocus = false"
          >
            <v-card-text align="center" :class="settingsFocus == true ? 'purple--text text--lighten-1' : 'white--text'"> 
              <b>Settings </b>
            </v-card-text>
          </v-card>
        </v-row>
      </template>
      <v-card
        style="background-color: #181818"
      > 
        <v-card-title v-if="status == isOwner()" class="justify-center">
          <p align="center" class="text-h4 white--text">{{ channName }}</p>
        </v-card-title>
        <v-card-text v-if="status == isOwner()">
          <v-container>
            <v-row>
              <v-col>
                <v-select
                  v-model="channAccess"
                  :items="typeList"
                  class="custom-select-color"
                  placeholder="Channel type"
                  color="yellow"
                  background-color="#181818"
                  item-color="yellow"
                  hide-details
                  filled
                  dense
                  rounded
                ></v-select>
                <v-text-field
                  v-model="channPass"
                  placeholder="Password"
                  class="mt-3 custom-select-color custom-placeholder-color custom-input-color neonText"
                  color="blue"
                  hide-details
                  filled
                  dense
                  rounded
                  :disabled="channAccess != 'Protected'"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      <v-card-actions v-if="status == isOwner()">
        <LeaveOwnerBtn @error="activeAlert" />
        <v-spacer></v-spacer>
        <BasicBtn @click="dialog = false" :isText="true" content="Close" />
        <BasicBtn :disable="disableSave()" @click="saveSettings()" isText content="Save" />
      </v-card-actions>
      <v-divider v-if="status == isOwner()" class="mt-4 mb-4 divider" style="border-color: #f27719;"> </v-divider>
        <v-row class="justify-center">
          <v-card-title>
            <p class="text-h4 white--text"> Users </p>
          </v-card-title>
          <AddUserBtn @refreshUser="updateToken" @error="activeAlert" />
        </v-row>
        <ChannelUserList
          @refreshUser="updateToken"
          :refresh="refreshToken"
          :ownerAction="true"
          :status="status"
          :meId="meId"
          class="ml-3 mr-3"
          style="background-color: #181818"
        />
      <v-card-actions v-if="status != isOwner()">
        <ChannelLeaveBtn @refreshUser="updateToken"/>
        <v-spacer></v-spacer>
        <BasicBtn @click="dialog = false" :isText="true" content="Close" />
      </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue} from 'nuxt-property-decorator'
import { ChannelUser, ChannelUserStatus } from '../../assets/Classes-ts/ChannelUser'
import { ChannAccess } from '../../assets/Classes-ts/Messages'
import { User } from '../../assets/Classes-ts/User'
import  AlertError  from '../AlertError.vue'
import AddUserBtn from './AddUserBtn.vue'
import ChannelUserList from './ChannelUserList.vue'

@Component
export default class ChannelSettings extends Vue{
  
  @Prop({ type: String, default: ChannelUserStatus.DEFAULT })
  status!: String

  @Prop({ type: Number, default: 0})
  refreshToken!: Boolean

  @Prop({ type: Number, default: -1 })
  meId!: Number

  actualAccess: string = ""
  actualPass: string = ""
  channName: string = this.$route.params.slug
  channAccess: string = ""
  channPass: string = ""
  typeList: Array<string> = [
    'Public',
    'Private',
    'Protected'
  ]
  userList: Array<ChannelUser> = []
  dialog: boolean = false
  settingsFocus: boolean = false
  btnFocus: boolean = false

  async mounted() {
    var ret = await this.$axios.get('/api/chat/' + this.$route.params.slug + '/info')
      .catch(function(error) {
        return error.response
      })
    if (ret.status == 409)
      this.$router.push('/chat?error=Channel%20does%20not%20exist')
    else if (ret.status == 403)
      this.$router.push('/chat?error=Not%20in%20channel')
    else
    {
      this.actualAccess = ret.data.channAccess
      this.channAccess = ret.data.channAccess
      this.actualPass = ret.data.channPass
    }
    var userListRet = await this.$axios.get('/api/chat/' + this.$route.params.slug + '/users')
    .catch(function(error) {
      return error.response
    })
    if (userListRet.status == 403)
      this.$router.push('/chat?error=' + userListRet.data.message)
    else
      this.userList = userListRet.data
  }

  disableSave() {
    if (this.channAccess == this.actualAccess && this.channAccess != ChannAccess.PROTECTED)
      return true
    if (this.channAccess == ChannAccess.PROTECTED && this.channPass == "")
      return true
    return false
  }

  async saveSettings() {
    var ret = await this.$axios.patch('/api/chat/' + this.$route.params.slug + '/info?channAccess=' + this.channAccess + '&channPass=' + this.channPass)
      .catch(function(error) {
        return error.response
      })
    if (ret.status == 404)
      this.$router.push('/chat?error=' + ret.data.message)
    else if (ret.status == 403)
      this.activeAlert(ret.data.message)
    else
    {
      this.dialog = false
      this.actualAccess = this.channAccess
      this.actualPass = this.channPass
    }
    this.channPass = ""
  }
  
  activeAlert(error: any)
  {
    this.$emit('error', error)
  }

  updateToken()
  {
    this.$emit('refreshUser')
  }

  newOwner(userName: string) {
    this.$emit('newOwner', userName)
  }

  isOwner()
  {
    return ChannelUserStatus.OWNER
  }
}

</script>

<style>
@import '../../assets/Classes-scss/main_page.scss';
@import '../../assets/Classes-scss/neon_effects.scss';
</style>