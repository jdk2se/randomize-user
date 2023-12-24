<template>
  <div
      ref="container"
      class="container">
    <PokemonItem
        v-for="pokemon in pokemons"
        :key="pokemon.name"
        :pokemon="pokemon"
    />
    <LoadingIcon v-if="isLoading"/>
  </div>
</template>

<script setup
        lang="ts">
import { nextTick, onBeforeMount, ref, watch } from 'vue';
import { Pokemon, PokemonResponse } from '../types/TPokemon';
import PokemonItem from './PokemonItem.vue';
import LoadingIcon from './LoadingIcon.vue';
import fetchHelper from '../helpers/fetchHelper';

const pokemons = ref<Array<Pokemon>>([]);
const container = ref<HTMLDivElement>(null);
const page = ref<number>(0);
let total = ref<number>(0);
let isLoading = ref<boolean>(false);
const CHUNK_SIZE = 10;

/**
 * Observer for manipulation with card
 * when it's in the view field
 */
const observer: IntersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('show', entry.isIntersecting);
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: '-100px',
    },
);

/**
 * Add observer to last card for loading new data
 * whe the card becomes visible
 */
const lastCardObserver: IntersectionObserver = new IntersectionObserver(
    async (entries) => {
      const lastCard = entries[0];
      if (!lastCard.isIntersecting) return;

      lastCardObserver.unobserve(lastCard.target);
      const isSuccess = await loadNewCards();
      if (isSuccess) {
        const cards = Array.from(container.value.children);
        lastCardObserver.observe(cards.at(-1));
      }
    },
    {
      rootMargin: '100px',
    },
);

onBeforeMount(() => {
  fetchHelper(
      `https://pokeapi.co/api/v2/pokemon?limit=${CHUNK_SIZE}&offset=0`,
  ).then((data: PokemonResponse) => {
    total.value = data.count;
    pokemons.value.push(...data.results);
  });
});

/**
 * When user reached the last card it tries to load additional chunk
 * @return boolean
 */
const loadNewCards = async (): Promise<boolean> => {
  isLoading.value = false;
  const offset = page.value * CHUNK_SIZE;
  if (offset >= total.value) return false;

  isLoading.value = true;
  fetchHelper(
      `https://pokeapi.co/api/v2/pokemon?limit=${CHUNK_SIZE}&offset=${offset}`,
  ).then((data: PokemonResponse) => {
    pokemons.value.push(...data.results);
    isLoading.value = false;
  });

  return true;
};

watch(
    () => pokemons.value.length,
    async (newLength: number, oldLength: number) => {
      await nextTick();
      page.value += 1;
      const cards = Array.from(container.value.children).slice(
          oldLength - newLength,
      );

      lastCardObserver.observe(cards.at(-1));

      cards.forEach((card) => {
        observer.observe(card);
      });
    },
);
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
