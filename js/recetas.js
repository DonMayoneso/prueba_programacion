// Variable global para almacenar las recetas
let recetas = [];

// Función para cargar las recetas desde el archivo JSON
async function cargarRecetasDesdeJSON() {
    try {
        const response = await fetch('data/recetas.json');
        const data = await response.json();
        recetas = data.recetas;
        return recetas;
    } catch (error) {
        console.error('Error al cargar las recetas:', error);
        return [];
    }
}

// Función para cargar recetas en la página de recetas
async function cargarRecetas(filtro = 'todos') {

    if (recetas.length === 0) {
        await cargarRecetasDesdeJSON();
    }
    
    const recipesGrid = document.getElementById('recipes-grid');
    
    if (!recipesGrid) return;
    
    recipesGrid.innerHTML = '';
    
    // Filtrar recetas si es necesario
    const recetasFiltradas = filtro === 'todos' 
        ? recetas 
        : recetas.filter(receta => receta.categoria === filtro);
    
    // Obtener favoritos del localStorage
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    
    // Crear tarjetas de recetas
    recetasFiltradas.forEach(receta => {
        const esFavorito = favoritos.includes(receta.id);
        
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        recipeCard.setAttribute('data-id', receta.id);
        recipeCard.setAttribute('data-categoria', receta.categoria);
        
        recipeCard.innerHTML = `
            <img src="${receta.imagen}" alt="${receta.nombre}" class="recipe-card-image">
            <div class="recipe-card-content">
                <span class="recipe-card-category">${obtenerNombreCategoria(receta.categoria)}</span>
                <h3>${receta.nombre}</h3>
                <div class="recipe-card-meta">
                    <span>${receta.tiempo}</span>
                    <span>${receta.dificultad}</span>
                </div>
                <div class="recipe-card-actions">
                    <button class="favorite-btn ${esFavorito ? 'active' : ''}" data-id="${receta.id}">
                        ${esFavorito ? '❤️' : '🤍'}
                    </button>
                    <button class="btn ver-receta" data-id="${receta.id}">Ver receta</button>
                </div>
            </div>
        `;
        
        recipesGrid.appendChild(recipeCard);
    });
    
    // Event listeners a los botones de favoritos
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleFavorito(parseInt(this.getAttribute('data-id')));
        });
    });
    
    // Event listeners de los botones de ver receta
    document.querySelectorAll('.ver-receta').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = parseInt(this.getAttribute('data-id'));
            mostrarRecetaModal(id);
        });
    });
    
    // Event listener de las tarjetas para abrir la receta al hacer clic
    document.querySelectorAll('.recipe-card').forEach(card => {
        card.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            mostrarRecetaModal(id);
        });
    });
}

// Cargar receta destacada en la página principal
async function cargarRecetaDestacada() {
    if (recetas.length === 0) {
        await cargarRecetasDesdeJSON();
    }
    
    const featuredRecipe = document.getElementById('featured-recipe');
    
    if (!featuredRecipe) return;
    
    // Seleccionar una receta aleatoria como destacada
    const recetaDestacada = recetas[Math.floor(Math.random() * recetas.length)];
    
    featuredRecipe.innerHTML = `
        <img src="${recetaDestacada.imagen}" alt="${recetaDestacada.nombre}" class="recipe-image">
        <div class="featured-recipe-content">
            <span class="recipe-card-category">${obtenerNombreCategoria(recetaDestacada.categoria)}</span>
            <h3>${recetaDestacada.nombre}</h3>
            <div class="recipe-meta">
                <span>${recetaDestacada.tiempo}</span>
                <span>${recetaDestacada.dificultad}</span>
            </div>
            <p>${recetaDestacada.ingredientes.slice(0, 3).join(', ')}...</p>
            <button class="btn ver-receta" data-id="${recetaDestacada.id}">Ver receta completa</button>
        </div>
    `;
    
    // Event listener del botón
    const verRecetaBtn = featuredRecipe.querySelector('.ver-receta');
    if (verRecetaBtn) {
        verRecetaBtn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            mostrarRecetaModal(id);
        });
    }
}

// Mostrar receta en modal
async function mostrarRecetaModal(id) {
    if (recetas.length === 0) {
        await cargarRecetasDesdeJSON();
    }
    
    const receta = recetas.find(r => r.id === id);
    if (!receta) return;
    
    const modal = document.getElementById('recipe-modal');
    const modalContent = document.getElementById('modal-recipe-content');
    
    if (!modal || !modalContent) return;
    
    // Obtener favoritos del localStorage
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    const esFavorito = favoritos.includes(receta.id);
    
    // Crear contenido del modal
    modalContent.innerHTML = `
        <div class="modal-recipe-header">
            <div>
                <h2 class="modal-recipe-title">${receta.nombre}</h2>
                <div class="modal-recipe-meta">
                    <span>${receta.tiempo}</span>
                    <span>${receta.dificultad}</span>
                    <span class="recipe-card-category">${obtenerNombreCategoria(receta.categoria)}</span>
                </div>
            </div>
            <button class="favorite-btn ${esFavorito ? 'active' : ''}" data-id="${receta.id}">
                ${esFavorito ? '❤️' : '🤍'}
            </button>
        </div>
        <img src="${receta.imagen}" alt="${receta.nombre}" class="modal-recipe-image">
        <div class="modal-recipe-content">
            <div class="modal-recipe-ingredients">
                <h3>Ingredientes</h3>
                ${receta.ingredientes.map(ingrediente => `
                    <div class="ingredient-item">
                        <input type="checkbox" id="ing-${receta.id}-${receta.ingredientes.indexOf(ingrediente)}">
                        <label for="ing-${receta.id}-${receta.ingredientes.indexOf(ingrediente)}">${ingrediente}</label>
                    </div>
                `).join('')}
            </div>
            <div class="modal-recipe-instructions">
                <h3>Preparación</h3>
                ${receta.instrucciones.map((instruccion, index) => `
                    <div class="instruction-step">
                        <strong>Paso ${index + 1}:</strong> ${instruccion}
                    </div>
                `).join('')}
            </div>
        </div>
        <div class="modal-recipe-actions">
            <button class="btn" id="imprimir-receta">Imprimir receta</button>
            <button class="btn-secondary" id="cerrar-modal">Cerrar</button>
        </div>
    `;
    
    // Mostrar modal
    modal.style.display = 'block';
    
    // Event listeners
    const favoriteBtn = modalContent.querySelector('.favorite-btn');
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', function() {
            toggleFavorito(parseInt(this.getAttribute('data-id')));

            const nuevosFavoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
            const nuevoEstado = nuevosFavoritos.includes(receta.id);
            this.className = `favorite-btn ${nuevoEstado ? 'active' : ''}`;
            this.innerHTML = nuevoEstado ? '❤️' : '🤍';

            if (window.location.pathname.includes('favoritos.html') && !nuevoEstado) {
                cargarRecetasFavoritas();
            }
        });
    }
    
    const imprimirBtn = modalContent.querySelector('#imprimir-receta');
    if (imprimirBtn) {
        imprimirBtn.addEventListener('click', function() {
            imprimirReceta(receta);
        });
    }
    
    const cerrarBtn = modalContent.querySelector('#cerrar-modal');
    if (cerrarBtn) {
        cerrarBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
}

// Función para cargar recetas favoritas
async function cargarRecetasFavoritas() {
    // Si las recetas no están cargadas, cargarlas primero
    if (recetas.length === 0) {
        await cargarRecetasDesdeJSON();
    }
    
    const favoritesGrid = document.getElementById('favorites-grid');
    const emptyState = document.getElementById('empty-favorites');
    const favoritesCount = document.getElementById('favorites-count');
    
    if (!favoritesGrid) return;
    favoritesGrid.innerHTML = '';
    
    // Obtener favoritos del localStorage
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    
    // Actualizar contador
    if (favoritesCount) {
        favoritesCount.textContent = `Tienes ${favoritos.length} receta${favoritos.length !== 1 ? 's' : ''} en favoritos`;
    }
    
    // Si no hay favoritos, mostrar estado vacío
    if (favoritos.length === 0) {
        if (emptyState) {
            emptyState.classList.add('show');
        }
        return;
    }
    
    // Ocultar estado vacío
    if (emptyState) {
        emptyState.classList.remove('show');
    }
    
    // Filtrar recetas favoritas
    const recetasFavoritas = recetas.filter(receta => favoritos.includes(receta.id));
    
    // Crear tarjetas de recetas favoritas
    recetasFavoritas.forEach(receta => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        recipeCard.setAttribute('data-id', receta.id);
        recipeCard.setAttribute('data-categoria', receta.categoria);
        
        recipeCard.innerHTML = `
            <img src="${receta.imagen}" alt="${receta.nombre}" class="recipe-card-image">
            <div class="recipe-card-content">
                <span class="recipe-card-category">${obtenerNombreCategoria(receta.categoria)}</span>
                <h3>${receta.nombre}</h3>
                <div class="recipe-card-meta">
                    <span>${receta.tiempo}</span>
                    <span>${receta.dificultad}</span>
                </div>
                <div class="recipe-card-actions">
                    <button class="favorite-btn active" data-id="${receta.id}">
                        ❤️
                    </button>
                    <button class="btn ver-receta" data-id="${receta.id}">Ver receta</button>
                </div>
            </div>
        `;
        
        favoritesGrid.appendChild(recipeCard);
    });
    
    // Botones de favoritos
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = parseInt(this.getAttribute('data-id'));
            toggleFavorito(id);
            
            // Recargar la página de favoritos después de quitar un favorito
            if (window.location.pathname.includes('favoritos.html')) {
                cargarRecetasFavoritas();
            }
        });
    });
    
    //Botones de ver receta
    document.querySelectorAll('.ver-receta').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = parseInt(this.getAttribute('data-id'));
            mostrarRecetaModal(id);
        });
    });
    
    // Abrir la receta al hacer clic
    document.querySelectorAll('.recipe-card').forEach(card => {
        card.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            mostrarRecetaModal(id);
        });
    });
}

// Imprimir receta
function imprimirReceta(receta) {
    const ventanaImpresion = window.open('', '_blank');
    ventanaImpresion.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${receta.nombre}</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; }
                h1 { color: #D9665B; border-bottom: 2px solid #D9AF32; padding-bottom: 10px; }
                .meta { color: #666; margin-bottom: 20px; }
                .categoria { display: inline-block; background: #D9AF32; color: white; padding: 5px 10px; border-radius: 15px; font-size: 0.9em; }
                .ingredientes, .instrucciones { margin: 20px 0; }
                .ingrediente { margin: 5px 0; }
                .paso { margin: 10px 0; padding-left: 15px; border-left: 3px solid #BFAF80; }
                @media print {
                    body { margin: 0; }
                    button { display: none; }
                }
            </style>
        </head>
        <body>
            <h1>${receta.nombre}</h1>
            <div class="meta">
                <span class="categoria">${obtenerNombreCategoria(receta.categoria)}</span>
                <span> | ${receta.tiempo} | ${receta.dificultad}</span>
            </div>
            <div class="ingredientes">
                <h2>Ingredientes</h2>
                ${receta.ingredientes.map(ingrediente => `<div class="ingrediente">• ${ingrediente}</div>`).join('')}
            </div>
            <div class="instrucciones">
                <h2>Preparación</h2>
                ${receta.instrucciones.map((instruccion, index) => `<div class="paso"><strong>Paso ${index + 1}:</strong> ${instruccion}</div>`).join('')}
            </div>
            <button onclick="window.print()">Imprimir</button>
            <button onclick="window.close()">Cerrar</button>
        </body>
        </html>
    `);
    ventanaImpresion.document.close();
}

// Nombre de categoría
function obtenerNombreCategoria(categoria) {
    const categorias = {
        'entrada': 'Entrada',
        'fuerte': 'Plato Fuerte',
        'postre': 'Postre'
    };
    
    return categorias[categoria] || categoria;
}

// Alternar favorito
function toggleFavorito(id) {
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    
    if (favoritos.includes(id)) {
        // Quitar de favoritos
        favoritos = favoritos.filter(favId => favId !== id);
    } else {
        // Agregar a favoritos
        favoritos.push(id);
    }
    
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    
    // Actualizar la vista si estamos en la página de recetas
    if (window.location.pathname.includes('recetas.html')) {
        const filtroActual = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'todos';
        cargarRecetas(filtroActual);
    }
}