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
				:disabled="isEditing ? false: true"
				:loading="isSelecting"
				@click="onButtonClick"
				color="#333333"
			>
				<v-img class="background_element"
					style="border-radius: 100%; position: absolute;"
					v-if="userPicture != null" v-bind:src="userPicture"
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
			<v-text-field v-if="isEditing"
				class="foreground_element text-field-nick-neon custom-placeholder-color custom-input-color"
				v-model="userNick"
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

	@Prop({ type: Boolean, default: false})
	isEditing!: boolean

	@Prop({ type: String, default: "" })
	userPicture!: string

	@Prop({ type: Boolean, default: false })
	state!: boolean

	switchEditing() {
		this.$emit('updateState')
	}

	updateState(){
		this.$emit('updateState')
	}

	close_btn() {
		this.$emit('close_btn')
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

</style>
