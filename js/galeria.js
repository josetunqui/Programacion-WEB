// Galería simple - Ver imágenes en grande
document.addEventListener('DOMContentLoaded', function() {
    
    var imagenes = document.querySelectorAll('.gallery-item img');
    
    for (var i = 0; i < imagenes.length; i++) {
        imagenes[i].style.cursor = 'pointer';
        
        imagenes[i].addEventListener('click', function() {
            // Crear overlay
            var overlay = document.createElement('div');
            overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:9999; display:flex; align-items:center; justify-content:center; cursor:pointer;';
            
            // Agregar imagen grande
            var imgGrande = document.createElement('img');
            imgGrande.src = this.src;
            imgGrande.style.cssText = 'max-width:90%; max-height:90%; border-radius:10px;';
            overlay.appendChild(imgGrande);
            
            // Cerrar al hacer clic
            overlay.addEventListener('click', function() {
                document.body.removeChild(overlay);
            });
            
            document.body.appendChild(overlay);
        });
    }
    
});

