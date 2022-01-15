<template>
  <v-btn
  color="#8124be"
  class="rank-card overflow-visible"
  :absolute="absolute"
  small
  @click="btnClicked()"
  >
  <v-icon color="#ffffff">
    {{ rank }}
  </v-icon>
  </v-btn>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "nuxt-property-decorator";

@Component
export default class LeaderboardRank extends Vue {
  
  @Prop({ type: String, default: "" })
  content!: string

  @Prop({ type: Boolean, default: false })
  isText!: Boolean
  
  @Prop({ type: Boolean, default: false })
  disable!: Boolean

  @Prop({ type: Boolean, default: false})
  smaller!: Boolean

  @Prop({ default: 0 })
  width!: Number | String
  
  @Prop({ type: Number, default: 0 })
  height!: Number

  @Prop({ type: String, default: "" })
  backgroundColor!: String

  @Prop({ type: String, default: "" })
  color!: String

  @Prop({ type: String, default: "" })
  neonColor!: String

  @Prop({type: Number, default: 25 })
  iconSize!: Number

  @Prop({type: Boolean, default: true })
  absolute!: boolean

  @Prop({type: Number, default: 0 })
  rank!: number

  btnFocus: boolean = false

  btnClicked() {
    this.$emit('click')
  }

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