<template>
	<div justify="center" align="center" style="padding-top: 1%">
		<v-row justify="end" class="mr-3 pb-4">
			<BasicBtn @click="switchEditing(); close_btn()" content="mdi-close" neonColor="red" />
		</v-row>
		<v-row align="center" justify="center">
			<v-btn
				class="text-none foreground_element btn_camera"
				:loading="isSelecting"
				@click="onButtonClick"
				color="#333333"
			>
				<v-img v-if="user.picture != null"
					@change="pictureEdited"
					:src="url != '' ? url : user.picture"
					class="background_element"
					style="border-radius: 100%"
					height="200px"
					width="200px"
				/>
				<v-icon
					x-large
					style="position: absolute;"
				>
					mdi-camera-enhance
				</v-icon>
				<input
					ref="uploader"
					class="d-none"
					type="file"
					accept="image/*"
					@change="onFileChanged"
				>
			</v-btn>
		</v-row>
		<TextField @enterPress="saveChange" v-model="nick" autofocus placeholder="Nickname" width="330" class="mt-10" />
		<div class="pt-8" justify="center" align="center">
			<span style="color: #e6ffff">2fa is currently</span>
			<span style="padding-right: 10px" :style="is2faEnable() ? 'color: #0ADAA8' : 'color: red'"> {{ is2faEnable() ? 'enable' : 'disable' }} </span>
			<BasicBtn
				style="border-radius: 30px"
				isText
				:content="is2faEnable() ? 'disable' : 'enable'"
				:color="is2faEnable() ? 'red': '#0ADAA8'"
				@click="change2fa"
			/>
		</div>
		<ChangePaddleBtn @error="activeAlert" :neonColor="user.paddleColor" v-model="selectedPaddleColor"/>
		<BasicBtn
			class="mt-6"
			style="border-radius: 30px"
			isText
			content="Save"
			color="#0ADAA8"
			:disable="disableSave()"
			@click="saveChange"
		/>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'nuxt-property-decorator';
import Vue from 'vue'
import { User } from '../../assets/Classes-ts/User';

@Component
export default class ProfileEditing extends Vue {

	@Prop({ type: Boolean, default: false })
	pictureEdited!: boolean

	@Prop({ type: Object, default: new User() })
	user!: User

	isSelecting = false
	selectedFile: null | Blob = null
	nick = ""
	tfa_status = false
	url = ""
	selectedPaddleColor = this.user.paddleColor

	switchEditing() {
		this.$emit('updateState')
	}

	is2faEnable(): boolean {
		return this.user.isTwoFactorAuthenticationEnabled
	}

	disableSave(): boolean {
		if ((this.nick == this.user.nickName || this.nick == "") && this.selectedFile == null && this.selectedPaddleColor == this.user.paddleColor)
			return true
		return false
	}

	close_btn() {
		this.selectedFile = null
		this.nick = this.user.nickName
	}

	activeAlert(text: string, type: string) {
		this.$emit('activeAlert', text, type)
  }

	$refs!: {
		uploader: HTMLFormElement
	}

	onButtonClick() {
		this.isSelecting = true
		window.addEventListener('focus', () => {
			this.isSelecting = false
		}, { once: true })
		this.$refs.uploader.click()
	}

	onFileChanged(e: any) {
		if (!e.target.files[0]) {
			e.preventDefault();
			this.activeAlert("No file chosen", "error")
			return;
		}
			
		if (e.target.files[0].size > 1000000) {
			e.preventDefault();
			this.activeAlert("File too big (> 1MB)", "error")
			return;
		}
		this.selectedFile = e.target.files[0]
		this.url = URL.createObjectURL(e.target.files[0])
		this.$emit('updatePicture')
	}

	async saveChange() {
		if (this.user.nickName == this.nick && this.selectedFile == null && this.user.paddleColor != this.selectedPaddleColor)
			return
		if (this.user.paddleColor != this.selectedPaddleColor) {
			this.$axios.post('/api/profile/me/paddleColor?color=' + this.selectedPaddleColor)
			this.user.paddleColor = this.selectedPaddleColor
			this.$emit('updateState')
		}
		if (this.user.nickName != this.nick && this.nick != "") {
			const ret = await this.$axios.post('api/profile/me/nickname?nickname=' + this.nick)
				.catch(function (error) {
						return error.response
				});
			if (ret.status == 409)
			{
				this.activeAlert("Nick is alredy taken", "error")
				return
			}
			else
			{
				this.$emit('updateNick', this.nick)
				this.$emit('updateState')
			}
		}
		if (this.selectedFile != null) {
			var formData = new FormData();
			formData.append("image", this.selectedFile);
			this.$emit('updatePicture')
			await this.$axios.$post('api/profile/me/picture', formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			this.$emit('updateState')
			this.selectedFile = null
			this.url = ""
		}
	}

	async change2fa() {
		if (this.user.isTwoFactorAuthenticationEnabled == false)
			this.$router.push("/profile/2fa")
		else
		{
			const qr = await this.$axios.post('/api/auth/2fa/turn-off')
			.catch(function (error) {
				return error.response
			});
			if (qr.status == 403)
				this.activeAlert("Cant turn off 2fa", "error")
			else if (qr.status == 201) {
				this.user.isTwoFactorAuthenticationEnabled = false
				this.activeAlert("2fa successfully disabled", "warning")
			}
		}
	}

}

</script>

<style scoped lang="scss">
@import '../../assets/Classes-scss/main_page.scss';
@import '../../assets/Classes-scss/custom_flexBox.scss';

.btn_camera {
	border-radius: 100%!important;
	box-shadow: 0px 0px 20px 0px rgba(31, 31, 50, 0.89);
	color: #38393b;
	min-width: 200px;
	width: 200px;
	min-height: 200px;
	height: 200px;
}

</style>
