<template>
  <v-card
    color="#8124be"
    class="rank-card overflow-visible container3"
    :absolute="absolute"
  >
    <v-card-text class="white--text font-italic pl-10 d-flex flex-column" style="font-family: OrbitronM !important; font-size: 120% !important"> {{rank}} </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "nuxt-property-decorator";

@Component
export default class LeaderboardRank extends Vue {
  
  @Prop({ type: Boolean, default: false })
  disable!: Boolean

  @Prop({type: Boolean, default: true })
  absolute!: boolean

  @Prop({ default: 0 })
  rank!: Number | String

}
</script>

<style scoped>
@import '../assets/Classes-scss/main_page.scss';
@import '../assets/Classes-scss/neon_effects.scss';
@import '../assets/Classes-scss/basicBtn_colors.scss';

.rank-card {
	border: 3px solid #fff7c8 !important;
	box-shadow: 0px 0px 10px 0px #ffdc17 !important;
}

</style>