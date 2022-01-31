<template>
<div>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    :nudge-width="220"
    offset-y
    content-class="elevation-0"
    :nudge-left="122"
  >
    <template v-slot:activator="{ }">
      <BasicBtn content="mdi-volume-medium" @click="menu = !menu" width="48" :iconSize="30" class="mr-5" neonColor="orange" style="margin-top: 2px">
      </BasicBtn>
    </template>

      <v-card outlined class="sound-setting-box mt-4">
          <v-item-group active-class="list-group-none">
            <v-list-item>
              <v-list-item-action>
                <basic-btn neonColor="orange" @click="toggleMusic" :content="isMusicEnabled ? 'mdi-volume-high' : 'mdi-volume-off'" />
              </v-list-item-action>
              <v-slider :min="0" :max="10" style="padding-top: 23px" color="#0affff" track-color="#f27719" ticks="always"/>
            </v-list-item>

            <v-list-item>
              <v-list-item-action>
                <basic-btn neonColor="orange" @click="toggleSound" :content="isSoundEnabled ? 'mdi-music-note-eighth' : 'mdi-music-note-off'" />
              </v-list-item-action>
              <v-slider :min="0" :max="10" style="padding-top: 23px" color="#0affff" track-color="#f27719" ticks="always"/>
            </v-list-item>
          </v-item-group>
      </v-card>
    
  </v-menu>
</div>
</template>



<script lang="ts">
import { Watch, Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class SoundSettings extends Vue{

  menu = false

  @Prop()
  isSoundEnabled!: boolean

  @Prop()
  isMusicEnabled!: boolean

  toggleSound() {
    this.$emit('toggleSound');
  }
  toggleMusic() {
    this.$emit('toggleMusic')
  }

}
</script>

<style scoped>

.sound-setting-box {
  border: 3px solid #f0b185 !important;
  border-radius: 15px !important;
  background-color: #181818;
  box-shadow: inset 0px 0px 10px 1px #f27719 !important;
}

.sound-setting-box:after {
  content: '';
  border: 10px solid transparent !important;
  border-bottom-color: #f0b185 !important; /* arrow color */
  top: -22px !important;
  left: 134px;

  position: absolute;
}

</style>
