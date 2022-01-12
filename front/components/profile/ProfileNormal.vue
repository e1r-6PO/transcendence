<template>
	<div justify="center" align="center" style="padding-top: 2%">
		<v-avatar class="overflow-visible" size="128">
			<ProfilePicture :src="user.picture" disable neonColor="light-blue" :size="140" />
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

		<v-card class="foreground_element card_profile mt-10">
			<v-card-text align="center">
				<p class="color_text text-h4 font-weight-medium" align="center">{{ user.nickName }}</p>
				<p class="color_text text-h5" align="center">{{ user.email }}</p>
				<p class="color_text text-h6" align="center">Connected via :</p>
				<icon-github v-if="user.provider === 'github'"
					width="50"
					height="50"
				/>
				<icon-42 v-if="user.provider === '42'"
					width="50"
					height="50"
				/>
				<v-icon v-if="user.provider === 'google'"
						color="primary"
						x-large
				>
					mdi-google
				</v-icon>
			</v-card-text>
		</v-card>
		<div class="flex-container-row mt-10">
			<v-card class="foreground_element card_game flex-item" margin-top="5%">
				<h1 class="color_win" align="center">Win</h1>
				<h3 class="color_text" align="center">{{ user.gameWin }} </h3>
			</v-card>
			<v-card class="foreground_element card_game flex-item" margin-top="5%">
				<h1 class="color_lose" align="center">Lose</h1>
				<h3 class="color_text" align="center" justify="center"> {{ user.gameLose }} </h3>
			</v-card>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'nuxt-property-decorator';
import Vue from 'vue'
import { User } from '../../assets/Classes-ts/User';

@Component
export default class ProfileNormal extends Vue {

	@Prop({ type: Object, default: new User() })
	user!: User

	@Prop({ type: Boolean, default: false })
	pictureEdited!: boolean

	switchEditing() {
		this.$emit('updateState')
	}
}

</script>

<style scoped lang="scss">
@import '../../assets/Classes-scss/main_page.scss';
@import '../../assets/Classes-scss/custom_flexBox.scss';

.profile-picture {
	border-radius:100% !important;
	border: 3px solid #a5fafa !important;
	box-shadow: 0px 0px 15px 0px #63f3f3 !important;
}

.edit-button {
	border: 3px solid #e9c8ff !important;
	box-shadow: 0px 0px 10px 0px #9141c7 !important;
}

.card_profile {
	border: 3px solid #a5fafa !important;
	box-shadow: inset 0px 0px 500px 20px #0affff, 0px 0px 40px 0px #0affff !important;
	border-radius: 15px !important;
	background-color: #181818 !important;
	min-width: 400px;
	height: 250px;
	width: 30%;
}

.color_text { 
	z-index: 6;
	color: #ffffff;
}

.card_game {
	border: 3px solid #a5fafa !important;
	box-shadow: inset 0px 0px 110px 0px #0affff, 0px 0px 40px 0px #0affff !important;
	border-radius: 15px !important;
	background-color: #181818 !important;
	min-width: 260px;
	width: 275px;
}

.color_lose {
	z-index: 6;
	color: #c7401e;
}

.color_win {
	z-index: 6;
	color: #b8a435; 
}

</style>