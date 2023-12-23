<template>
  <div class="pokemon-card">
    <div class="pokemon-card__image-wrapper">
      <img
          class="pokemon-card__image"
          :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`"
          :alt="pokemon.name"
      />
    </div>
    <div>
      <div class="pokemon-card__title">{{ pokemonName }}</div>
      <div>
        <span
            v-if="!isLoading && !description"
            @click="loadDescription"
            class="pokemon-card__info"
        >
          Show description
        </span>
        <div class="loader" v-if="isLoading"></div>
        <div v-if="description">
          {{ description }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Pokemon } from "../types/TPokemon";
import { computed, ref } from "vue";

const props = defineProps<{
  pokemon: Pokemon
}>();

const pokemonId = props.pokemon.url.match(/\d+(?=\D*$)/)[0];
let description = ref<string>('');
let isLoading = ref<boolean>(false);

const capitalized = (name: string) => {
  const capitalizedFirst = name[0].toUpperCase();
  const rest = name.slice(1);

  return capitalizedFirst + rest;
}

const pokemonName = computed(() => capitalized(props.pokemon.name));
const loadDescription = () => {
  isLoading.value = true;
  fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`)
      .then(result => result.json())
      .then(data => {
        isLoading.value = false;

        // @TODO Данные довольно муторные, не стал описывать интерфейс
        description.value = data.flavor_text_entries[0].flavor_text;
      });
}
</script>

<style lang="scss">
.pokemon-card {
  display: flex;
  background: #e1ecdf;
  margin: 30px 0;
  padding: 20px;
  border-radius: 10px;

  &__image-wrapper {
    display: flex;
    align-items: center;
    margin-right: 20px;
  }

  &__image {
    background: wheat;
    border-radius: 50%;
  }

  &__title {
    font-size: 20px;
  }

  &__info:hover {
    cursor: pointer;
    text-decoration: underline;
  }

  .loader {
    width: 20px;
    aspect-ratio: 1;
    border-radius: 50%;
    border: 2px solid #514b82;
    animation:
        l20-1 0.8s infinite linear alternate,
        l20-2 1.6s infinite linear;
  }
  @keyframes l20-1{
    0%    {clip-path: polygon(50% 50%,0       0,  50%   0%,  50%    0%, 50%    0%, 50%    0%, 50%    0% )}
    12.5% {clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100%   0%, 100%   0%, 100%   0% )}
    25%   {clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100% 100%, 100% 100%, 100% 100% )}
    50%   {clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100% 100%, 50%  100%, 0%   100% )}
    62.5% {clip-path: polygon(50% 50%,100%    0, 100%   0%,  100%   0%, 100% 100%, 50%  100%, 0%   100% )}
    75%   {clip-path: polygon(50% 50%,100% 100%, 100% 100%,  100% 100%, 100% 100%, 50%  100%, 0%   100% )}
    100%  {clip-path: polygon(50% 50%,50%  100%,  50% 100%,   50% 100%,  50% 100%, 50%  100%, 0%   100% )}
  }
  @keyframes l20-2{
    0%    {transform:scaleY(1)  rotate(0deg)}
    49.99%{transform:scaleY(1)  rotate(135deg)}
    50%   {transform:scaleY(-1) rotate(0deg)}
    100%  {transform:scaleY(-1) rotate(-135deg)}
  }
}
</style>
