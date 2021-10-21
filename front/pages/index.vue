<template>
  <v-app>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-card-text class="text-center main_title_test">
          Welcome to Transcendence
        </v-card-text>
        <v-main>
          <v-btn
            color="white"
            rounded
            elevation="12"
            width="110"
            height="110"
            href="/api/auth/42"
            style="float: left; backgroundColor:'white' !important"
            @click="loader = 'loading3'"
          >
            <icon-42 
              width="75"
              height="75"
            />
          </v-btn>
          <v-btn
            color="white"
            rounded
            elevation="12"
            width="110"
            height="110"
            href="/api/auth/google"
            style="float: right;"
            @click="loader = 'loading3'"
          >
            <v-icon
              color="primary"
              x-large
            >
            mdi-google
            </v-icon>
          </v-btn>
        </v-main>
      </v-col>
    </v-row>
  </v-app>
</template>

<style>
  @import '../assets/main_page.scss';

  .v-application{
    background-color: darkgrey !important;
  }

  .v-button{
    color: whitesmoke !important;
  }
</style>
