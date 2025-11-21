// Menú hamburguesa para móviles
document.addEventListener('DOMContentLoaded', function() {
    
    var menu = document.querySelector('.nav-menu');
    
    if (menu) {
        // Crear botón hamburguesa
        var boton = document.createElement('button');
        boton.className = 'menu-hamburguesa';
        boton.innerHTML = '☰';
        boton.style.cssText = 'display:none; font-size:28px; background:none; border:none; color:white; cursor:pointer;';
        
        menu.parentElement.insertBefore(boton, menu);
        
        // Toggle menú al hacer clic
        boton.addEventListener('click', function() {
            menu.classList.toggle('menu-activo');
        });
    }
    
});

