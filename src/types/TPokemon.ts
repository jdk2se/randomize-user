export type Pokemon = {
  url: string;
  name: string;
};

export type PokemonResponse = {
  count: number;
  results: Pokemon[];
};

export type PokemonDetails = {
  flavor_text_entries: {
    flavor_text: string;
  }[];
};
