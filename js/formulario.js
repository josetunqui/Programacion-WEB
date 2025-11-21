// Validación simple del formulario de matrícula
document.addEventListener('DOMContentLoaded', function() {
    
    var botonEnviar = document.querySelector('.form-button');
    var formulario = document.querySelector('form');
    
    if (botonEnviar && formulario) {
        botonEnviar.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Obtener campos requeridos
            var campos = formulario.querySelectorAll('input[required], select[required]');
            var camposVacios = 0;
            
            // Verificar si hay campos vacíos
            for (var i = 0; i < campos.length; i++) {
                if (!campos[i].value || campos[i].value.trim() === '') {
                    campos[i].style.border = '2px solid red';
                    camposVacios++;
                } else {
                    campos[i].style.border = '';
                }
            }
            
            // Si hay campos vacíos, mostrar alerta
            if (camposVacios > 0) {
                alert('Por favor, completa todos los campos marcados en rojo.');
                return;
            }
            
            // Si todo está completo, confirmar
            if (confirm('¿Deseas enviar la solicitud de inscripción?')) {
                alert('¡Inscripción enviada con éxito!\n\nEn breve nos contactaremos contigo.');
                formulario.reset();
            }
        });
    }
    
});
