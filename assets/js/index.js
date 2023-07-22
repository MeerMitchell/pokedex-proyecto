const listaPokemon = document.querySelector("#listaPokemon");
const headerButtons = document.querySelectorAll('.btn-header');
let URL = "https://pokeapi.co/api/v2/pokemon/";

/*
    Función agregada con el método async-await: propuesta para solucionar el problema de
    la carga desordenada de los Pokemon. Practicamente ahora solo espera a que carguen los
    respectivos datos de cada consulta antes de continuar al siguiente.
    Cuando la solicitud falla solo lanza un error por consola, pero igual se podria agregar
    un contador que permita volver a reintentar el request.
*/
/*------------------------------------------------------------------------------*/
/*  Función de carga para inicializar los pokemon                               */
/*------------------------------------------------------------------------------*/
const chargePokemons = async (maxQuery) => {
    try {
        for (let i = 1; i <= maxQuery; i++) {
            const pokemon = await fetch(`${URL}${i}`);
            if (!pokemon.ok) {
                throw new Error('Error de transferencia de datos');
            }
            const pokemonJson = await pokemon.json();
            mostrarPokemon(pokemonJson);
        }
    } catch (err) {
        console.error(err);
    }
}

/*------------------------------------------------------------------------------*/
/*  Función de renderizado de tarjetas                                          */
/*------------------------------------------------------------------------------*/
function mostrarPokemon(poke) {

    let tipos = poke.types.map(type => `<p class="${type.type.name} tipo">${type.type.name}</p>`).join('');

    // Función que formatea los numeros de tal manera que si: #3 => #003
    const pokemonID = poke.id.toString().padStart(3, 0);

    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
              <p class="pokemon-id-back">#${pokemonID}</p>
              <div class="pokemon-imagen">
                  <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
              </div>
              <div class="pokemon-info">
                  <div class="nombre-contenedor">
                      <p class="pokemon-id">#${pokemonID}</p>
                      <h2 class="pokemon-nombre">${poke.name}</h2>
                  </div>
                  <div class="pokemon-tipos">
                    ${tipos}
                  </div>
                  <div class="pokemon-stats">
                      <p class="stat">${poke.height}M</p>
                      <p class="stat">${poke.weight}</p>
                  </div>
    `;
    listaPokemon.append(div);
}

/*------------------------------------------------------------------------------*/
/*  Función para el filtrado de los pokemon con los botones                     */
/*------------------------------------------------------------------------------*/
const filterPokemon = async (event, maxQuery) => {
    const botonId = event.currentTarget.id;
    // Borra elementos de la lista
    listaPokemon.innerHTML = '';
    try {
        for (let i = 1; i <= maxQuery; i++) {
            const pokemon = await fetch(`${URL}${i}`);
            if (!pokemon.ok) {
                throw new Error('Error de transferencia de datos');
            }
            const pokemonJson = await pokemon.json();

            // Condicional para los tipos
            if (botonId === 'ver-todos') {
                mostrarPokemon(pokemonJson);
            } else {
                const tiposPokemon = pokemonJson.types.map(type => type.type.name);
                if (tiposPokemon.some(tipo => tipo.includes(botonId))) {
                    mostrarPokemon(pokemonJson);
                }
            }
        }
    } catch (err) {
        console.error(err);
    }
}

/*------------------------------------------------------------------------------*/
/*  Función para abrir opciones de filtrado en botón de búsqueda                */
/*------------------------------------------------------------------------------*/
const openFilterOptions = () => {
    const filterOptions = document.querySelector('#open-filters');
    const filterBox = document.querySelector('.filters-box');

    filterOptions.addEventListener('click', () => {
        filterBox.classList.toggle('active-hidden');
    })
}

/*------------------------------------------------------------------------------*/
/*  Función activar filtrado de la barra de búsqueda                            */
/*------------------------------------------------------------------------------*/
const activeFilterBar = () => {
    const input = document.querySelector('#inputSearchPokemon');
    input.addEventListener('keyup', (event) => {
        displayPokemonCoincidents(event, listaPokemon, 151);
    });
}

/*------------------------------------------------------------------------------*/
/*  Función para el filtrado de la barra de búsqueda                            */
/*------------------------------------------------------------------------------*/
const displayPokemonCoincidents = async (event, container, maxQuery) => {
    container.innerHTML = '';

    // Variables de filtrado
    let input = event.target.value.trim();
    let pokemonList = [];

    if (input === "") {
        chargePokemons(151);
        return; // Salir de la función
    }

    try {
        for (let i = 1; i <= maxQuery; i++) {
            const pokemon = await fetch(`${URL}${i}`);
            if (!pokemon.ok) {
                throw new Error('Error de transferencia de datos');
            }
            const pokemonJson = await pokemon.json();
            pokemonList.push(pokemonJson);
        }

        const matchPokemon = filterSBPokemon(pokemonList, input);
        console.log(matchPokemon);
        matchPokemon.forEach(pokemon => mostrarPokemon(pokemon));
    } catch (err) {
        console.error(err);
    }
}

function filterSBPokemon (pokemonArray, input) {
    // Obtiene los valores de las checkbox
    const ablePokemonName = document.querySelector('#forPokemon').checked;
    const ablePokemonNumber = document.querySelector('#forNumber').checked;

    // Normalizar input de entrada: (Árbol || árbol || áRbOl) => arbol
    const cleanedInput = input.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    // Crea una expresión regular para búsqueda.
    let regularExpresion = new RegExp(cleanedInput, "i");

    const matchArray = pokemonArray.filter(pokemon => {
        const normalizedPokemonName = pokemon.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        if (ablePokemonNumber && ablePokemonName) {
            return regularExpresion.test(normalizedPokemonName) || regularExpresion.test(pokemon.id.toString());
        } else if (ablePokemonName) {
            return regularExpresion.test(normalizedPokemonName);
        } else if (ablePokemonNumber) {
            return regularExpresion.test(pokemon.id.toString());
        } else {
            // Si ambos flags son false, no se aplica ningún filtro, así que devolvemos true para mantener todos los elementos.
            return true;
        }
    });

    return matchArray;
}

/*------------------------------------------------------------------------------*/
/*  Inicializadores del DOM                                                     */
/*------------------------------------------------------------------------------*/

//Inicializa la funcion de carga de Pokemon inicial
chargePokemons(151);
// Inicializa la funcion para las opciones de filtrado del botón
activeFilterBar();
// Activa la función de filtrato por medio de la barra de búsqueda
openFilterOptions();
// Activa la función de filtrado de los botones
headerButtons.forEach(boton => boton.addEventListener('click', event => filterPokemon(event, 151)));

/* Funciones requeridas faltantes => {
    -agregar event click a las tarjetas para desplegar mas información acerca del pokemon
    -agregar un buscador utilizando un metodo filter que pueda desplegar la misma funcionalidad de los botones
}
*/