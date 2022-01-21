<template>
  <v-card class="white--text ml-2 mr-2 mt-4 card" width="200" align="center">
    <v-list-item>
    <v-list-item-content>
    <v-list-item-title v-text="achievement.title"
      align="start"
      class="white--text text-h6 pl-1 pb-2"
      :class="value == '100.0' ? 'neonText-light-blue': 'neonText'"
    />
    <v-list-item-subtitle v-text="achievement.action" class="white--text" align="start" />
    </v-list-item-content>
    <v-icon
      color="white"
      :class="value == '100.0' ? 'neonText-light-blue': 'neonText'"
    >
      {{ achievement.icon }}
    </v-icon>
    </v-list-item>
    <v-card-actions class="justify-center pt-0 pb-4">
      <CircleProgress :value="value" />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop } from 'nuxt-property-decorator'
import Vue from 'vue'
import { Achievements } from '../../assets/Classes-ts/Achievements'

@Component({})
export default class AchievementCard extends Vue{
  
  @Prop({ type: Object, default: new Achievements()})
  achievement!: Achievements

  @Prop({ default: 0 })
  value!: Number | String

}
</script>