<template>
  <div justify="center" align="center" style="padding-top: 2%" v-if="!Editing">
		<v-avatar class="overflow-visible" size="128">
      <img v-if="userPicture != ''"
        class="round_card item profile-picture"
        :src=userPicture
      />
      <v-btn
        color="#8124be"
        class="edit-button"
        fab
        small
        @click="switchEditing()"
        style="z-index: 6"
        absolute
        bottom
        right
      >
        <v-icon color="#ffffff">
          mdi-pencil
        </v-icon>
      </v-btn>
    </v-avatar>

		<v-card class="foreground_element card_profile"
		
		>
			<v-card-text align="center">
				<p class="color_text text-h4 font-weight-medium" align="center">{{ userNick }}</p>
				<p class="color_text text-h5" align="center">{{ userEmail }}</p>
				<p v-if="userProvider === 'github'" class="color_text text-h6" align="center">Connected via :</p>
				<icon-github v-if="userProvider === 'github'"
						width="50"
						height="50"
				/>
				<p v-if="userProvider === '42'" class="color_text text-h6" align="center"> Connected via :</p>
				<icon-42 v-if="userProvider === '42'"
					width="50"
					height="50"
				/>
				<p v-if="userProvider === 'google'" class="color_text text-h6" align="center"> Connected via :</p>
				<v-icon v-if="userProvider === 'google'"
						color="primary"
						x-large
				>
					mdi-google
				</v-icon>
			</v-card-text>
		</v-card>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'nuxt-property-decorator';
import Vue from 'vue'
import { User } from '../../assets/Classes-ts/User';

export default class ProfileNormal extends Vue {

	@Prop({ type: Boolean, default: false })
	Editing!: boolean

	

	switchEditing() {
		this.$emit('updateState')
	}

}

</script>

<style scoped lang="scss">

</style>