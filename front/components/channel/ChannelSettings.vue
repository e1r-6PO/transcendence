<template>
  <div>
    <v-dialog
      v-model="dialog"
      max-width="500"
      content-class="custom-dialog-card-shadow"
      transition="dialog-top-transition"
    >
      <template v-slot:activator="{}">
        <v-row align="center" justify="center" style="margin-top: 0px">
          <BasicBtn 
            content="mdi-cog"
            @click="dialog = !dialog"
            :width="40"
          />
        </v-row>
      </template>
      <v-card class="dialog_card"> 
        <div align="end">
          <BasicBtn @click="dialog = false" content="mdi-close" neonColor="red" class="mt-3 mr-3" />
        </div>
        <v-card-title v-if="status == isOwner()" class="justify-center">
          <p align="center" class="text-h4 white--text">{{ channName }}</p>
        </v-card-title>
        <v-card-text v-if="status == isOwner()">
          <v-container>
            <v-row>
              <v-col>
                <Select :itemsList="typeList" v-model="channAccess" placeholder="Channel type" />
                <TextField v-model="channPass" :disable="channAccess != 'Protected'" placeholder="Password"/>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      <v-card-actions v-if="status == isOwner()">
        <LeaveOwnerBtn @error="activeAlert" />
        <DeleteChannelBtn class="ml-2"/>
        <v-spacer></v-spacer>
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
          class="ml-3 mr-3 dialog_card"
        />
      <v-card-actions v-if="status != isOwner()">
        <ChannelLeaveBtn @refreshUser="updateToken"/>
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
      this.actualPass = ret.data.channPass
    }
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

<style scoped>
@import '../../assets/Classes-scss/main_page.scss';
@import '../../assets/Classes-scss/neon_effects.scss';
@import '../../assets/Classes-scss/chat_bubble.scss';
</style>