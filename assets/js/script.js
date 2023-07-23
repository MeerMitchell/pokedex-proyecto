/* Variable del contenedor de tarjetas global */
const listaPokemon = document.querySelector("#listaPokemon");
const headerButtons = document.querySelectorAll('.btn-header');
const input = document.querySelector('#inputSearchPokemon');

const MAX_QUERY = 151; //Número de consultas a la APi

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

// Previene la desactivación de los checkbox
const checkValidFilter = ($checkbox_1, $checkbox_2) => {
    if ($checkbox_1.checked || $checkbox_2.checked) {
        return;
      } else {
        $checkbox_1.checked = true;
        return;
      }
}

/*------------------------------------------------------------------------------*/
/*  Función de renderizado de tarjetas                                          */
/*------------------------------------------------------------------------------*/
const displayPokemon = (pokemonData) => {
    const cardsTemplate = pokemonData.map(poke => {
        // Función que formatea y determina el tipo de cada pokemon
        const types = poke.types.map(type => {
            return `<p class="${type.type.name} tipo">${type.type.name}</p>`
        }).join('');

        // Función que formatea los numeros de tal manera que si: #3 => #003
        const pokemonID = poke.id.toString().padStart(3, 0);
        const template = `
            <div class="pokemon">
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
                        ${types}
                    </div>
                    <div class="pokemon-stats">
                        <p class="stat">${poke.height}M</p>
                        <p class="stat">${poke.weight}</p>
                    </div>
                </div>
            </div>`;
        return template;
    }).join('');
    listaPokemon.innerHTML = cardsTemplate;
}

/*------------------------------------------------------------------------------*/
/*  Función que ealizará las consultas a la API de PokeAPI.                     */
/*------------------------------------------------------------------------------*/
const requestPokemon = async (maxQuery) => {
    let URL = "https://pokeapi.co/api/v2/pokemon/";
    let pokemonRequest = []

    try {
        for (let i = 1; i <= maxQuery; i++) {
            const pokemon = await fetch(`${URL}${i}`);
            if (!pokemon.ok) {
                throw new Error('Error de transferencia de datos');
            }
            const pokemonJson = await pokemon.json();
            pokemonRequest.push(pokemonJson);
        }
        return pokemonRequest;
    } catch (err) {
        console.error(`Something is wrong: ${err}`);
    }
}

/*------------------------------------------------------------------------------*/
/*  Función para el filtrado de los pokemon con los botones                     */
/*------------------------------------------------------------------------------*/
// Filtra las coincidencias dentro del array pokemon
const filterPokemonWhitWord = (pokemonData, word) => {
    return pokemonData.filter((pokemon) => {
        return pokemon.types.some((type) => type.type.name === word);
    });
}

const filterButtons = (event, pokemonData) => {
    // Recoge los datos 'id' de cada botón
    const buttonId = event.currentTarget.id;
    // Borra elementos de la lista
    listaPokemon.innerHTML = '';
    try {
        if (buttonId === 'ver-todos') {
            displayPokemon(pokemonData);
            return
        }

        const filteredPokemon = filterPokemonWhitWord(pokemonData, buttonId);
        displayPokemon(filteredPokemon);
    } catch (err) {
        console.error(err);
    }
}

/*------------------------------------------------------------------------------*/
/*  Función para el filtrado de la barra de búsqueda                            */
/*------------------------------------------------------------------------------*/
// Normalizar input de entrada: (Árbol || árbol || áRbOl) => arbol
const normalizeInput = (input) => {
    return  input.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const displayPokemonCoincidents = (event, pokemonData) => {
    listaPokemon.innerHTML = '';
    const input = event.target.value.trim();

    try {
        if (input === "") {
            displayPokemon(pokemonData);
            return; // Salir de la función
        }

        const matchPokemon = filterSBPokemon(pokemonData, input);
        displayPokemon(matchPokemon)
    } catch (err) {
        console.error(`Non-valid operation: ${err}`);
    }
}

const filterSBPokemon = (pokemonArray, input) => {
    // Obtiene los valores de las checkbox
    const checkboxName = document.querySelector('#forPokemon');
    const checkboxNumber = document.querySelector('#forNumber');

    checkboxName.addEventListener('change', checkValidFilter(checkboxName, checkboxNumber));
    checkboxNumber.addEventListener('change', checkValidFilter(checkboxName, checkboxNumber));
    
    const cleanedInput = normalizeInput(input);
    let regularExpresion = new RegExp(cleanedInput, "i"); // Crea una expresión regular para búsqueda.

    const matchArray = pokemonArray.filter(pokemon => {
        const normalizedPokemonName = normalizeInput(pokemon.name);

        if (checkboxName.checked && checkboxNumber.checked) {
            return regularExpresion.test(normalizedPokemonName) || regularExpresion.test(pokemon.id.toString());
        } else if (checkboxName.checked) {
            return regularExpresion.test(normalizedPokemonName);
        } else {
            return regularExpresion.test(pokemon.id.toString());
        }
    });

    return matchArray;
}

/*------------------------------------------------------------------------------*/
/*  Función Inicializa los datos de consulta y la data Pokémon.                 */
/*------------------------------------------------------------------------------*/
const getData = async () => {
    try {
        const pokemonData = await requestPokemon(MAX_QUERY);
        displayPokemon(pokemonData);
        return pokemonData;
    } catch (err) {
        console.log(err);
    }
}

//Inicializa la funcion de carga de Pokemon inicial
const pokemonSotrage = getData();
pokemonSotrage.then(pokemonData => {
    // Inicializa la funcion para las opciones de filtrado del botón
    openFilterOptions();
    // Activa la función de filtrato por medio de la barra de búsqueda
    input.addEventListener('keyup', event => displayPokemonCoincidents(event, pokemonData));
    // Activa la función de filtrado de los botones
    headerButtons.forEach(boton => boton.addEventListener('click', event => filterButtons(event, pokemonData)));
})
.catch(err => {
    console.error(`Fail-operation: ${err}`);
})
