<template>
  <v-alert v-if="state" :textError="textError" :state="state"
    text
    class="font-weight-bold custom-alert pt-3"
    :class="getClasse()"
    :color="getColor()"
    :width="width > 0 ? width: '80%'"
    :height="height > 0 ? height: '60'"
    style="position: absolute; right: 10%; top: 30px; z-index: 12; border-radius: 15px;"
    align="center"
  >
    <template v-slot:close="{}">
      <BasicBtn @click="closeAlert()" :neonColor="colorType" width="30" :iconSize="18" content="mdi-close" />
    </template>
    <span :class="'custom-alert-text-' + colorType">{{ textError }}</span>
  </v-alert>
</template>

<script lang="ts">
import { Watch, Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class AlertError extends Vue{

  @Prop({ type: Boolean, default: false})
  state!: boolean

  @Prop({ type: String, default: "" })
  textError!: string

  @Prop({ type: String, default: "error" })
  type!: string

  @Prop({type: Number, default: 2 })
  time!: number
  
  @Prop({type: Number, default: 0 })
  width!: number

  @Prop({type: Number, default: 0 })
  height!: number


  alertCode: boolean = true
  alert: boolean = false
  colorType: string = "orange"

  assignColor() {
    if (this.type == "info")
      this.colorType = "blue"
    else if (this.type == "error")
      this.colorType = "red"
    else if (this.type == "warning")
      this.colorType = "orange"
    else if (this.type == "success")
      this.colorType = "green"
    else
      this.colorType = this.type
  }

  @Watch('state', { immediate: true })
  onStateChange()
  {
    this.assignColor()
    this.activeAlert()
  }

  getClasse(): string {
    var classes = ""

    classes += "custom-alert-" + this.colorType + " "
    classes += "custome-alert-text-" + this.colorType + " "
    return classes
  }

  getColor(): string {
    var color = "#ffeddb"

    if (this.colorType == "blue")
      color = "#adbbf8"
    else if (this.colorType == "orange")
      color = "#f1d8c6"
    else if (this.colorType == "red")
      color = "#ffeddb"
      else if (this.colorType == "green")
      color = "#32c44a"

    return color
  }

  activeAlert()
  {
      this.alert = true
      setTimeout(() => {
        // this.$emit('end')
    }, this.time * 1000)
  }

  closeAlert() {
    this.$emit('end')
  }
}
</script>

<style scoped>

.custom-alert-purple {
  border: 2px solid #cd78ff !important;
  box-shadow: inset 0px 0px 20px 0px #a200ff, 0px 0px 20px 0px #a200ff !important;

}

.custom-alert-red {
  border: 2px solid #d14949 !important;
  box-shadow: inset 0px 0px 20px 0px #d61c1c, 0px 0px 20px 0px #d61c1c !important;
  background-color: #d1494999 !important;
}

.custom-alert-error {
  border: 2px solid #d14949 !important;
  box-shadow: inset 0px 0px 20px 0px #d61c1c, 0px 0px 20px 0px #d61c1c !important;
  background-color: #d1494999 !important;
}

.custom-alert-orange {
  border: 2px solid #ffa768 !important;
  box-shadow: inset 0px 0px 20px 0px #fc6500, 0px 0px 20px 0px #fc6500 !important;
  background-color: #fc6500cc !important;
}

.custom-alert-warning {
  border: 2px solid #ffa768 !important;
  box-shadow: inset 0px 0px 20px 0px #fc6500, 0px 0px 20px 0px #fc6500 !important;
  background-color: #ffa76899 !important;
}

.custom-alert-blue {
  border: 2px solid #3c58d3 !important;
  box-shadow: inset 0px 0px 20px 0px #1b019b, 0px 0px 20px 0px #1b019b !important;
  background-color: #3c58d399 !important;
}

.custom-alert-info {
  border: 2px solid #3c58d3 !important;
  box-shadow: inset 0px 0px 20px 0px #1b019b, 0px 0px 20px 0px #1b019b !important;
  background-color: #3c58d399 !important;
}

.custom-alert-green {
  border: 2px solid #82e492 !important;
  box-shadow: inset 0px 0px 20px 0px #32c44a, 0px 0px 20px 0px #32c44a !important;
  background-color: #6cbb7999 !important;
}

.custom-alert-success {
  border: 2px solid #82e492 !important;
  box-shadow: inset 0px 0px 20px 0px #32c44a, 0px 0px 20px 0px #32c44a !important;
  background-color: #82e49299 !important;
}

.custom-alert-text-purple {
  color: #fff9d7;
  text-shadow:
      0 0 7px #cd78ff,
      0 0 8px #cd78ff,
      0 0 9px #cd78ff !important;
}

.custom-alert-text-red {
  color: #fff9d7;
  text-shadow:
      0 0 7px #d14949,
      0 0 8px #d14949,
      0 0 9px #d14949 !important;
}

.custom-alert-text-error {
  color: #fff9d7;
  text-shadow:
      0 0 7px #d14949,
      0 0 8px #d14949,
      0 0 9px #d14949 !important;
}

.custom-alert-text-warning {
  color: #faf1e9;
  text-shadow:
      0 0 7px #CD7F32,
      0 0 8px #CD7F32,
      0 0 9px #CD7F32 !important;
}

.custom-alert-text-orange {
  color: #faf5f1;
  text-shadow:
      0 0 7px #CD7F32,
      0 0 8px #CD7F32,
      0 0 9px #CD7F32 !important;
}

.custom-alert-text-info {
  color: #c3cdfa;
  text-shadow:
      0 0 7px #3c58d3,
      0 0 8px #3c58d3,
      0 0 9px #c3cdfa !important;
}

.custom-alert-text-blue {
  color: #c3cdfa;
  text-shadow:
      0 0 7px #3c58d3,
      0 0 8px #3c58d3,
      0 0 9px #3c58d3 !important;
}

.custom-alert-text-success {
  color: #ffffff;
  text-shadow:
      0 0 5px #82e49299,
      0 0 6px #82e49299 !important;
}

.custom-alert-text-green {
  color: #c3cdfa;
  text-shadow:
      0 0 7px #82e49299,
      0 0 8px #82e49299,
      0 0 9px #82e49299 !important;
}
</style>