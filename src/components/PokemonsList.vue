<template>
  <div ref="container" class="container">
    <PokemonItem v-for="pokemon in pokemons" :key="pokemon.name" :pokemon="pokemon" />
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeMount, onMounted, ref, watch } from "vue";
import { Pokemon } from "../types/TPokemon";
import PokemonItem from "./PokemonItem.vue";
import fetchHelper from "../helpers/fetchHelper";

const pokemons = ref<Array<Pokemon>>([]);

let offset = ref<number>(0);
const container = ref<HTMLDivElement>(null);
const observer = ref<IntersectionObserver>(null);

const getData = () => {
  offset.value = pokemons.value.length;
  const url = `https://pokeapi.co/api/v2/pokemon?limit=10&offset=${offset}`;
  fetchHelper(url)
      .then(data => {
        pokemons.value.push(...data.results);
      });
}

onBeforeMount(() => {
    getData();
});

onMounted(() => {
  observer.value = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle('show', entry.isIntersecting);
      if (entry.isIntersecting) {
        observer.value.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: "-100px"
  });
});

watch(() => pokemons.value.length, async () => {
  await nextTick();
  const cards = Array.from(container.value.children);

  cards.forEach(card => {
    observer.value.observe(card);
  });
});
</script>

<style lang="scss">
.container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 900px;
  margin: 0 auto;
  min-height: 100vh;
  padding: 20px;
}
</style>
