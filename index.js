const listaPokemon = document.querySelector("#listaPokemon");
const headerButtons = document.querySelectorAll('.btn-header');
let URL = "https://pokeapi.co/api/v2/pokemon/";

// Función fetch anterior =/=> problema --- carga los elementos en desorden xXx
// for (let i = 1; i <= 151; i++) {
//     fetch(URL + i)
//         .then((response) => response.json())
//         .then(data => mostrarPokemon(data))
    
// }


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
        for(let i = 1; i <= maxQuery; i++) {
            const pokemon = await fetch(`${URL}${i}`);
            if(!pokemon.ok) {
                throw new Error('Error de transferencia de datos');
            }
            const pokemonJson =  await pokemon.json();
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
        for(let i = 1; i <= maxQuery; i++) {
            const pokemon = await fetch(`${URL}${i}`);
            if(!pokemon.ok) {
                throw new Error('Error de transferencia de datos');
            }
            const pokemonJson =  await pokemon.json();
            
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
/*  Inicializadores del DOM                                                     */
/*------------------------------------------------------------------------------*/

//Inicializa la funcion de carga de Pokemon inicial
chargePokemons(151);
// Activa la función de filtrado de los botones
headerButtons.forEach(boton => boton.addEventListener('click', event => filterPokemon(event, 151)));

/* Funciones requeridas faltantes => {
    -agregar event click a las tarjetas para desplegar mas información acerca del pokemon
    -agregar un buscador utilizando un metodo filter que pueda desplegar la misma funcionalidad de los botones
}
*/