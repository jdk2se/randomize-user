<template>
  <div class="container">1
    <PokemonItem v-for="pokemon in pokemons" :key="pokemon.name" :pokemon="pokemon" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { Pokemon } from "../types/TPokemon";
import PokemonItem from "./PokemonItem.vue";

const pokemons: Pokemon[] = [];

let offset = ref<number>(0);
const getData = () => {
  fetch(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=${offset}`)
      .then(data => data.json())
      .then(result => {
        pokemons.push(...result.results);
      });
}


onBeforeMount(() => {
    getData();
});
</script>

<style lang="scss">
.container {
  width: 900px;
  margin: 0 auto;
  min-height: 100vh;
  padding: 20px;
}
</style>
