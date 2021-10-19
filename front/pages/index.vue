<template>
  <v-app dark>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-card-text 
          class="text-center main_title_test"
        >
          Welcome to Transcendence
        </v-card-text>
        <v-card>
          <v-card class="logo py-4 d-flex justify-center">
            <hr class="my-3">
            <a href="/api/auth/42">
              <img
              src="../assets/42_Logo.png" 
              width="150"
              height="150"
              />
              <!-- Nuxt Documßntation -->
            </a>
            <br>
            <a href="/api/auth/google">
              <img
                src="../assets/Google_Button.png" 
                width="200"
                height="150"
              />
              <!-- Nuxt GitHub -->
            </a>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
  </v-app>
</template>

<style>
  @import '../assets/main_page.scss';
</style>
