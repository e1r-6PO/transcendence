<template>
    <v-main justify-content="center">
        <canvas
            width="700"
            height="400"
        >
        </canvas>
        <h4>
            Move Paddle up and down with arrow keys
        </h4>
        <script type="text/javascript" src="@/game/game.js"></script>
    </v-main>
</template>

<script>
    export default{
        layout: 'game_layout',
    }
</script>

<style lang="scss">
  @import '../assets/game.scss';
  @import '../assets/main_page.scss';

    main div canvas{
        margin-top: 10%;
    }

    main div h4{
        margin-top: 10%;
    }

</style>
