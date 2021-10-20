<template>
  <v-app dark>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-card-text class="text-center main_title_test">
          Welcome to Transcendence
        </v-card-text>
        <v-main>
          <v-btn
            dark
            width="110"
            height="110"
            href="/api/auth/42"
            style="float: left;"
          >
            <icon-42 />
          </v-btn>
          <v-btn
            fab
            dark
            width="110"
            height="110"
            href="/api/auth/google"
            style="float: right;"
          >
            <v-icon
              width="100"
              height="100"
              large
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
</style>
