const listaPokemon = document.querySelector("#listaPokemon");
let URL = "https://pokeapi.co/api/v2/pokemon/";

// for (let i = 1; i <= 151; i++) {
//     fetch(URL + i)
//         .then((response) => response.json())
//         .then(data => mostrarPokemon(data))
    
// }

const chargePokemons = async (maxQuery) => {
    try {
        for(let i = 1; i <= maxQuery; i++) {
            const pokemon = await fetch(`${URL}${i}`);
            if(!pokemon.ok) {
                throw new Error('Error de conexión');
            }
            const pokemonJson =  await pokemon.json();
            mostrarPokemon(pokemonJson);
        }
    } catch (err) {
        console.error(err);
    }
}

function mostrarPokemon(poke) {
    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
              <p class="pokemon-id-back">#${poke.id}</p>
              <div class="pokemon-imagen">
                  <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
              </div>
              <div class="pokemon-info">
                  <div class="nombre-contenedor">
                      <p class="pokemon-id">#${poke.id}</p>
                      <h2 class="pokemon-nombre">${poke.name}</h2>
                  </div>
                  <div class="pokemon-tipos">
                      <p class="electric tipo">ELECTRIC</p>
                      <p class="fighting tipo">FIGHTING</p>
                  </div>
                  <div class="pokemon-stats">
                      <p class="stat">4m</p>
                      <p class="stat">60kg</p>
                  </div>
    `;
    listaPokemon.append(div);
}

chargePokemons(151);
/*
<div class="pokemon-todos" id="listaPokemon">
           <div class="pokemon">
              <p class="pokemon-id-back">#025</p>
              <div class="pokemon-imagen">
                  <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" alt="Pikachu">
              </div>
              <div class="pokemon-info">
                  <div class="nombre-contenedor">
                      <p class="pokemon-id">#025</p>
                      <h2 class="pokemon-nombre">Pikachu</h2>
                  </div>
                  <div class="pokemon-tipos">
                      <p class="electric tipo">ELECTRIC</p>
                      <p class="fighting tipo">FIGHTING</p>
                  </div>
                  <div class="pokemon-stats">
                      <p class="stat">4m</p>
                      <p class="stat">60kg</p>
                  </div>

                  </div>
                  */