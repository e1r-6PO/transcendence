<template>
  <v-card>
    <v-card-title>
      Ranking 🏆
      <v-spacer></v-spacer>
      <v-text-field
        v-model="email"
        prepend-inner-icon="mdi-account-search"
        label="Email"
        type="text"
        hide-details
      ></v-text-field>

    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="scoreboardList"
      :search="search"
      :disable-sort="true"

    >
      <template v-slot:items="props">
        <td class="text-xs-center">{{ props.item.email }}</td>
        <td class="text-xs-center">{{ props.item.lose }}</td>
        <td class="text-xs-center">{{ props.item.win }}</td>
      </template>
      <template v-slot:no-results>
        <v-alert :value="true" color="error" icon="warning">
          Your search for "{{ search }}" found no results.
        </v-alert>
      </template> 
    </v-data-table> 
  </v-card>
</template>

<script>
  export default {

  layout: 'home',

    async asyncData () {
       const scoreboardList = await fetch(
      '/api/users/scoreboard'
    ).then((res) => res.json())

      scoreboardList.sort(function(a, b){
    return (a.win / a.lose) - (b.win / b.lose);
});
      return {
        search: "",
        email: "",
        scoreboardList,
      };
    },
    computed: {
    headers() {
      return [
        {
          text: "Email",
          align: "left",
          sortable: false,
          value: "email",
          filter: f => { return ( f + '' ).toLowerCase().includes( this[ 'email' ].toLowerCase() ) }
        },
        {
          text: "Lose",
          value: "lose"
        },
        {
          text: "Win",
          value: "win"
        }
      ];
    }
  }
}
</script>
