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
        <div
            v-if="!isLoading && !description"
            class="pokemon-card__info"
            @click="loadDescription"
        >
          Show description
        </div>
        <LoadingIcon v-if="isLoading"/>
        <div v-if="description">
          {{ description }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup
        lang="ts">
import { computed, ref } from 'vue';
import { Pokemon, PokemonDetails } from '../types/TPokemon';
import fetchHelper from '../helpers/fetchHelper';
import LoadingIcon from './LoadingIcon.vue';

const props = defineProps<{
  pokemon: Pokemon;
}>();

const pokemonId = props.pokemon.url.match(/\d+(?=\D*$)/)[0];
let description = ref<string>('');
let isLoading = ref<boolean>(false);

/**
 * Set first letter in the string to Capital
 * @param {string} name
 * @return string
 */
const capitalized = (name: string): string => {
  const capitalizedFirst = name[0].toUpperCase();
  const rest = name.slice(1);

  return capitalizedFirst + rest;
};

const pokemonName = computed(() => capitalized(props.pokemon.name));

/**
 * Because pokemon's description lives separately, load it when it is needed
 */
const loadDescription = () => {
  isLoading.value = true;
  fetchHelper(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`).then(
      (data: PokemonDetails) => {
        isLoading.value = false;
        description.value = data.flavor_text_entries[0].flavor_text;
      },
  );
};
</script>

<style lang="scss">
.pokemon-card {
  display: flex;
  background: #e1ecdf;
  padding: 20px;
  height: 90px;
  border-radius: 10px;
  transform: translateX(100px);
  opacity: 0;
  transition: 150ms;

  &.show {
    transform: translateX(0);
    opacity: 1;
  }

  &__image-wrapper {
    display: flex;
    align-items: center;
    margin-right: 20px;
    width: 100px;
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
}
</style>
