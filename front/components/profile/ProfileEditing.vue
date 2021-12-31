<template>
	<div v-if="isEditing" class="flex-container-editing" justify="center" align="center" style="padding-top: 1%">
		<v-btn
			color="#8124be"
			class="foreground_element cross-item edit-button"
			fab
			small
			@click="switchEditing(); close_btn()"
		>
			<v-icon color="error" v-if="isEditing" >
				mdi-close
			</v-icon>
		</v-btn>
		<v-row align="center" justify="center">
			<v-btn v-if="isEditing"
				class="text-none foreground_element btn_camera"
				:loading="isSelecting"
				@click="onButtonClick"
				color="#333333"
			>
				<v-img class="background_element"
					style="border-radius: 100%; position: absolute;"
					v-if="userPicture != null"
					v-bind:src="userPicture"
					v-on:change="pictureEdited"
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
		<div class="flex-container-editing" style="padding-top: 3%">
			<v-text-field v-if="isEditing"
				class="foreground_element text-field-nick-neon custom-placeholder-color custom-input-color"
				v-model="nick"
				placeholder="Nickname"
				color="#e6ffff"
				hide-details
				filled
				rounded
				dense
				counter="20"
				@keydown.enter="saveChange"
			>
			</v-text-field>
			</div>
			<div class="flex-container-row" style="padding-top: 3%" justify="center" align="center" v-if="isEditing">
				<div v-if="this.tfa_status == true">
					<span style="color: #e6ffff">2fa is currently</span>
					<span style="color: #0ADAA8; padding-right: 10px">enabled</span>
					<v-btn
						class="neon-button"
						rounded
						text
						color="red"
						@click="change2fa"
					>
						disable
					</v-btn>
				</div>
				<div v-if="this.tfa_status == false">
				<span style="color: #e6ffff">2fa is currently</span>
				<span style="color: red; padding-right: 10px">disabled</span>
				<v-btn
					class="neon-button"
					rounded
					text
					color="#0ADAA8"
					@click="change2fa"
				>
					enable
				</v-btn>
			</div>
		</div>
		<div class="flex-container-editing" justify="center" align="center" style="padding-top: 3%">
			<v-btn v-if="isEditing"
			class="foreground_element save-item neon-button"
			:disabled="nick == userNickName && selectedFile == null"
			rounded
			text
			color="#0ADAA8"
			@click="saveChange"
			>
				Save
			</v-btn>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'nuxt-property-decorator';
import Vue from 'vue'
import { User } from '../../assets/Classes-ts/User';

@Component
export default class ProfileEditing extends Vue {
	isSelecting = false
	alertCode = false
	alertText = ""
	alertType = "success"
	selectedFile: null | Blob = null
	nick = ""
	tfa_status = false

	@Prop({ type: Boolean, default: false})
	isEditing!: boolean

	@Prop({ type: String, default: "" })
	userPicture!: string

	@Prop({ type: String, default: "" })
	userNickName!: string

	@Prop({ type: Boolean, default: false })
	pictureEdited!: boolean

	switchEditing() {
		this.$emit('updateState')
	}

	close_btn() {
		this.selectedFile = null
		this.nick = this.userNickName
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
				this.alertType = "error"
				this.alertText = "No file chosen"
				this.alertCode = true
				setTimeout(()=>{
					this.alertCode=false
				},5000)
				return;
			}
			
			if (e.target.files[0].size > 1000000) {
				e.preventDefault();
				this.alertText = "File too big (> 1MB)"
				this.alertType = "error"
				this.alertCode = true
				setTimeout(()=>{
					this.alertCode=false
				},5000)
				return;
			}
			this.selectedFile = e.target.files[0]
			this.pictureEdited = !this.pictureEdited
	}

	async saveChange() {
		if (this.userNickName == this.nick && this.selectedFile == null)
			return
		if (this.userNickName != this.nick && this.nick != "") {
			const ret = await this.$axios.post('api/profile/me/nickname?nickname=' + this.nick)
				.catch(function (error) {
						return error.response
				});
			if (ret.status == 409)
			{
				this.alertText = "Nick is alredy taken" 
				this.alertType = "error"
				this.alertCode = true
				setTimeout(()=>{
					this.alertCode = false
				},5000)
				return
			}
			else
			{
				this.$emit('updateNick', this.nick)
				if (this.isEditing == true)
					this.$emit('updateState')
			}
		}
		console.log(this.selectedFile)
		if (this.selectedFile != null) {
			var formData = new FormData();
			formData.append("image", this.selectedFile);
			// console.log(formData)
			this.$emit('updatePicture')
			await this.$axios.$post('api/profile/me/picture', formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			if (this.isEditing == true)
				this.$emit('updateState')
			this.selectedFile = null
		}
	}

	async change2fa() {
		if (this.tfa_status == false)
			this.$router.push("/profile/2fa")
		else
		{
			const qr = await this.$axios.post('/api/auth/2fa/turn-off')
			.catch(function (error) {
				alert("Cant turn off 2fa")
				return error.response
			});
			if (qr.status == 201) {
				this.tfa_status = false
				this.alertType = "warning"
				this.alertText = "2fa successfully disabled"
				this.alertCode = true
				setTimeout(()=>{
					this.alertCode=false
				},5000)
			}
		}
	}

}

</script>

<style scoped lang="scss">
@import '../../assets/Classes-scss/main_page.scss';
@import '../../assets/Classes-scss/custom_flexBox.scss';

.round_card {
	border-radius:100% !important;
}

.item {
	align-self: flex-end;
}

.profile-picture {
	border: 3px solid #a5fafa !important;
	box-shadow: 0px 0px 15px 0px #63f3f3 !important;
}

.cross-item {
	margin-left: 90%;
	margin-bottom: 2%;
	border: 3px solid #cd78ff !important;
	box-shadow: 0px 0px 25px 0px #a200ff !important;
}

.edit-button {
	border: 3px solid #e9c8ff !important;
	box-shadow: 0px 0px 10px 0px #9141c7 !important;
}

.btn_camera {
	border-radius: 100%!important;
	box-shadow: 0px 0px 20px 0px rgba(31, 31, 50, 0.89);
	color: #38393b;
	min-width: 200px;
	width: 200px;
	min-height: 200px;
	height: 200px;
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


</style>
