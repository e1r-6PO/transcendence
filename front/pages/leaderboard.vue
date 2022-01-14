<template>
<v-container>
	<div justify="center" align="center" style="padding-top: 20px">
		<TextField v-model="filterStr" placeholder="Filter" width="330" class="mt-10" />

    <div v-for="relationship in relationships" :key="relationship.id"
      style="padding-top:30px"
      v-on:bind="relationships"
      v-on:change="update"
    >
      <v-card
        class="foreground_element card_profile"
        align="left"
        justify="center"
      >
        <v-row align="center" justify="start" style="padding-left: 20px; padding-top: 7px">
          <ProfilePicture @click="goToProfile(relationship)" :src="relationship.peer.picture" :isActive="relationship.peer.isActive" />
          <v-card-title @click="goToProfile(relationship)" class="color_text text-h5 font-weight-medium" align="center">{{relationship.peer.nickName}}</v-card-title>
          <BasicBtn
            v-if="selectedStatus == 'Pending' && relationship.status == status.incomming"
            style="position: absolute; bottom: -20px; right: 58px"
            @click="edit_friend(relationship, true)"
            :width="40"
            content="mdi-account-remove"
            color="black"
            backgroundColor="#18124be0"
          />
          <!-- <BasicBtn
            style="position: absolute; bottom: -20px; right: 13px"
            @click="edit_friend(relationship, false)"
            :width="40"
            :content="getStatusIcon(relationship)"
            color="black"
            backgroundColor="#18124be0"
          /> -->
        </v-row>
      </v-card>
    </div>
	</div>
</v-container>
</template>

<script lang='ts'>

import Vue from 'vue'
import { LightUser } from '../assets/Classes-ts/User'

export default Vue.extend({

  data() {
    return {
      relationships: [{
        id: 0,
        peer: new LightUser(),
        status: '',
        isActive: false
      }],
      selectedStatus: '',
      filterStr: '',
      update: false,
    }
  },

  async mounted() {
    this.relationships = await this.$axios.$get('/api/leaderboard')
    console.log(this.relationships)
  },

  methods: {
    goToProfile(relationship: any)
    {
      this.$router.push('/users/' + relationship.peer.nickName)
    },

    getStatusIcon(relationship : any) : string
    {
        if (relationship.status == this.status.completed)
          return ('mdi-account-minus')
        else if (relationship.status == this.status.blocked)
          return ('mdi-lock-open-variant')
        else if (relationship.status == this.status.sent)
          return ('mdi-account-remove')
        else if (relationship.status == this.status.incomming)
          return ('mdi-account-plus')
        else
          return ('mdi-account-minus')
    },
  },
})

</script>

<style scoped>
@import '../assets/Classes-scss/neon_effects.scss';
@import '../assets/Classes-scss/main_page.scss';
.card_profile {
  border: 3px solid #a5fafa !important;
	box-shadow: inset 0px 0px 20px 0px #0affff, 0px 0px 20px 0px #0affff !important;
  /* box-shadow: 0px 0px 40px 0px #0affff !important; */
  border-radius: 15px !important;
  background-color: #181818 !important;
  height: 60px;
  width: 100%;
}

.color_text { 
  color: #ffffff;
}

.friend-button {
  border: 3px solid #e9c8ff !important;
  box-shadow: 0px 0px 15px 3px #9141c7 !important;
}
</style>
