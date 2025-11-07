// Configuración del tema (modo oscuro/claro)
function configurarTema() {
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Aplicar tema guardado
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    
    // Alternar tema al hacer clic
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    });
}

// Configurar filtros de recetas
function configurarFiltros() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remover clase active de todos los botones
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Agregar clase active al botón clickeado
            this.classList.add('active');
            
            // Aplicar filtro
            const filtro = this.getAttribute('data-filter');
            aplicarFiltro(filtro);
        });
    });
}

// Aplicar filtro a las recetas
function aplicarFiltro(filtro) {
    cargarRecetas(filtro);
    
    // Actualizar URL sin recargar la página
    if (filtro === 'todos') {
        history.pushState({}, '', 'recetas.html');
    } else {
        history.pushState({}, '', `recetas.html?categoria=${filtro}`);
    }
}

// Configurar modal
function configurarModal() {
    const modal = document.getElementById('recipe-modal');
    const closeBtn = document.querySelector('.close');
    
    if (!modal || !closeBtn) return;
    
    // Cerrar modal al hacer clic en la X
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });
}

// Validar formulario de contacto
function validarFormulario() {
    let esValido = true;
    
    // Limpiar mensajes de error
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });
    
    // Validar nombre
    const nombre = document.getElementById('nombre');
    if (!nombre.value.trim()) {
        document.getElementById('nombre-error').textContent = 'El nombre es obligatorio';
        esValido = false;
    }
    
    // Validar email
    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        document.getElementById('email-error').textContent = 'El email es obligatorio';
        esValido = false;
    } else if (!emailRegex.test(email.value)) {
        document.getElementById('email-error').textContent = 'El formato del email no es válido';
        esValido = false;
    }
    
    // Validar asunto
    const asunto = document.getElementById('asunto');
    if (!asunto.value.trim()) {
        document.getElementById('asunto-error').textContent = 'El asunto es obligatorio';
        esValido = false;
    }
    
    // Validar mensaje
    const mensaje = document.getElementById('mensaje');
    if (!mensaje.value.trim()) {
        document.getElementById('mensaje-error').textContent = 'El mensaje es obligatorio';
        esValido = false;
    }
    
    return esValido;
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    configurarTema();
    
    // Solo configurar elementos específicos si existen en la página
    if (document.querySelector('.filter-btn')) {
        configurarFiltros();
    }
    
    if (document.getElementById('recipe-modal')) {
        configurarModal();
    }
});
// Tarjetas de categorías clickeables
function configurarCategoriasClick() {
    const categoryCards = document.querySelectorAll('.category-card[data-category]');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const categoria = this.getAttribute('data-category');
            window.location.href = `recetas.html?categoria=${categoria}`;
        });
        
        card.style.cursor = 'pointer';
    });
}