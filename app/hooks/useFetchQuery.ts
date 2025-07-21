import { useInfiniteQuery, useQuery, useQueries } from "@tanstack/react-query";
import { Colors } from "../constants/Colors";

const endpoint = "https://pokeapi.co/api/v2";

type EvolutionChain = {
  species: {
    name: string;
    url: string;
  };
  evolves_to: EvolutionChain[];
};

type API = {
  "/pokemon?limit=21": {
    count: number;
    next: string | null;
    results: {
      name: string;
      url: string;
      names?: {
        name: string;
        language: {
          name: string;
        };
      }[];
    }[];
  };
  "/pokemon/[id]": {
    id: number;
    name: string;
    url: string;
    weight: number;
    height: number;
    moves: { move: { name: string } }[];
    stats: { base_stat: number; stat: { name: string } }[];
    cries: {
      latest: string;
    };
    types: {
      type: {
        name: keyof (typeof Colors)["type"];
      };
    }[];
  };
  "/type/[id]": {
    id: number;
    name: keyof (typeof Colors)["type"];
    names: {
      name: string;
      language: {
        name: string;
      };
    }[];
  };
  "/pokemon-species/[id]": {
    flavor_text_entries: {
      flavor_text: string;
      language: {
        name: string;
      };
    }[];
    names: {
      name: string;
      language: {
        name: string;
      };
    }[];
    evolution_chain: {
      url: string;
    };
  };
  "/evolution-chain/[id]": {
    chain: EvolutionChain[];
  };
};

export function useFetchQuery<T extends keyof API>(
  path: T,
  params?: Record<string, string | number>
) {
  const localUrl =
    endpoint +
    Object.entries(params ?? {}).reduce<string>(
      (acc, [key, value]) => acc.replaceAll(`[${key}]`, String(value)),
      path
    );
  return useQuery({
    queryKey: [localUrl],
    queryFn: async () => {
      await wait(1);
      return fetch(localUrl, {
        headers: {
          Accept: "application/json",
        },
      }).then(r => r.json() as Promise<API[T]>);
    },
  });
}

export function useInfiniteFetchQuery<T extends keyof API>(path: T) {
  return useInfiniteQuery({
    queryKey: [path],
    initialPageParam: endpoint + path,
    queryFn: async ({ pageParam }) => {
      return fetch(pageParam, {
        headers: {
          Accept: "application/json",
        },
      }).then(r => r.json() as Promise<API[T]>);
    },
    getNextPageParam: lastPage => {
      if ("next" in lastPage) {
        return lastPage.next;
      }
      return null;
    },
  });
}

export function useEvolutionSpecies(ids: (string | number)[]) {
  console.log(ids);
  return useQueries({
    queries: ids.map(id => ({
      queryKey: ["/pokemon-species/[id]", id],
      queryFn: () => fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`).then(r => r.json()),
      enabled: !!id,
    })),
  });
}

function wait(duration: number) {
  return new Promise(resolve => setTimeout(resolve, duration * 1000));
}

export type PokemonEvolution = {
  id: number;
  names: {
    name: string;
    language: {
      name: string;
    };
  }[];
  url: string;
};

export function getPokemonEvolutions(chainId: number): PokemonEvolution[] | undefined {
  const { data } = useFetchQuery("/evolution-chain/[id]", { id: chainId });
  function getEvolutionLine(chain: any): PokemonEvolution[] {
    const result: PokemonEvolution[] = [];
    let current = chain;
    console.log(current.evolves_to.length);
    let i = 0;
    while (current) {
      result.push({
        id: current.species.url.split("/").slice(0, -1).pop() ?? 0,
        names: [{ name: current.species.name, language: { name: "en" } }],
        url: current.species.url,
      });
      if (current.evolves_to && current.evolves_to.length > 0) {
        current = current.evolves_to[0];
      } else {
        current = null;
      }
    }
    return result;
  }
  const evolutions = data?.chain ? getEvolutionLine(data.chain) : [];
  return evolutions;
}
