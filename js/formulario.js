// Validación del formulario de matrícula con mensajes específicos
document.addEventListener('DOMContentLoaded', function() {
    
    var botonEnviar = document.querySelector('.form-button');
    var formulario = document.querySelector('form');
    
    if (botonEnviar && formulario) {
        
        // Control de visibilidad del campo Turno según el grado
        var selectGrado = document.getElementById('student-grade');
        var campoTurno = document.getElementById('campo-turno');
        var radiosTurno = formulario.querySelectorAll('input[name="turno"]');
        
        if (selectGrado && campoTurno) {
            selectGrado.addEventListener('change', function() {
                var grado = this.value.toLowerCase();
                
                // Mostrar turno solo si es Primaria
                if (grado.includes('primaria')) {
                    campoTurno.style.display = 'block';
                    // Hacer radios obligatorios
                    for (var i = 0; i < radiosTurno.length; i++) {
                        radiosTurno[i].setAttribute('required', '');
                    }
                } else {
                    campoTurno.style.display = 'none';
                    // Quitar obligatorio y limpiar selección
                    for (var i = 0; i < radiosTurno.length; i++) {
                        radiosTurno[i].removeAttribute('required');
                        radiosTurno[i].checked = false;
                    }
                }
            });
        }
        
        // Validación en tiempo real - mostrar mensaje al salir de un campo vacío
        var campos = formulario.querySelectorAll('input[required], select[required]');
        
        for (var i = 0; i < campos.length; i++) {
            campos[i].addEventListener('blur', function() {
                validarCampo(this);
            });
            
            campos[i].addEventListener('input', function() {
                if (this.value.trim() !== '') {
                    quitarError(this);
                }
            });
        }
        
        // Validación al hacer clic en Enviar
        botonEnviar.addEventListener('click', function(e) {
            e.preventDefault();
            
            var camposVacios = [];
            var primerCampoVacio = null;
            
            // Verificar inputs y selects normales
            for (var i = 0; i < campos.length; i++) {
                if (!campos[i].value || campos[i].value.trim() === '') {
                    mostrarError(campos[i], 'Este campo es obligatorio');
                    camposVacios.push(obtenerNombreCampo(campos[i]));
                    if (!primerCampoVacio) primerCampoVacio = campos[i];
                } else {
                    quitarError(campos[i]);
                }
            }
            
            // Verificar grupos de radio buttons
            var gruposRadio = ['taller', 'transporte'];
            for (var j = 0; j < gruposRadio.length; j++) {
                var radioSeleccionado = formulario.querySelector('input[name="' + gruposRadio[j] + '"]:checked');
                if (!radioSeleccionado) {
                    var primerRadio = formulario.querySelector('input[name="' + gruposRadio[j] + '"]');
                    if (primerRadio) {
                        camposVacios.push(obtenerNombreCampo(primerRadio.closest('.form-group')));
                        if (!primerCampoVacio) primerCampoVacio = primerRadio;
                    }
                }
            }
            
            // Verificar turno solo si es visible (Primaria)
            var campoTurnoVisible = document.getElementById('campo-turno');
            if (campoTurnoVisible && campoTurnoVisible.style.display !== 'none') {
                var turnoSeleccionado = formulario.querySelector('input[name="turno"]:checked');
                if (!turnoSeleccionado) {
                    var primerTurno = formulario.querySelector('input[name="turno"]');
                    if (primerTurno) {
                        camposVacios.push('Turno de clases');
                        if (!primerCampoVacio) primerCampoVacio = primerTurno;
                    }
                }
            }
            
            // Verificar checkbox de términos
            var checkTerminos = formulario.querySelector('input[name="terminos"]');
            if (checkTerminos && !checkTerminos.checked) {
                camposVacios.push('Aceptar terminos y condiciones');
                if (!primerCampoVacio) primerCampoVacio = checkTerminos;
            }
            
            // Si hay campos vacíos
            if (camposVacios.length > 0) {
                var mensaje = 'Por favor, completa los siguientes campos:\n\n';
                for (var j = 0; j < camposVacios.length; j++) {
                    mensaje += '• ' + camposVacios[j] + '\n';
                }
                alert(mensaje);
                
                // Hacer scroll al primer campo vacío
                if (primerCampoVacio) {
                    primerCampoVacio.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    primerCampoVacio.focus();
                }
                return;
            }
            
            // Si todo está completo
            if (confirm('¿Deseas enviar la solicitud de inscripción?')) {
                alert('¡Inscripción enviada con éxito!\n\nEn breve nos contactaremos contigo.');
                formulario.reset();
                // Limpiar todos los mensajes de error
                for (var k = 0; k < campos.length; k++) {
                    quitarError(campos[k]);
                }
            }
        });
    }
    
    // funciones auxiliraes
    
    function validarCampo(campo) {
        if (!campo.value || campo.value.trim() === '') {
            mostrarError(campo, 'Por favor, completa este campo');
        } else {
            quitarError(campo);
        }
    }
    
    function mostrarError(campo, mensaje) {
        campo.style.border = '2px solid #ff4444';
        campo.style.backgroundColor = '#fff5f5';
        
        // Buscar si ya existe mensaje de error
        var mensajeExistente = campo.parentElement.querySelector('.mensaje-error');
        if (!mensajeExistente) {
            var mensajeError = document.createElement('small');
            mensajeError.className = 'mensaje-error';
            mensajeError.style.cssText = 'color:#ff4444; font-size:12px; display:block; margin-top:5px;';
            mensajeError.textContent = mensaje;
            campo.parentElement.appendChild(mensajeError);
        }
    }
    
    function quitarError(campo) {
        campo.style.border = '';
        campo.style.backgroundColor = '';
        
        var mensajeError = campo.parentElement.querySelector('.mensaje-error');
        if (mensajeError) {
            mensajeError.remove();
        }
    }
    
    function obtenerNombreCampo(campo) {
        // Si es un form-group completo (para radios)
        if (campo.classList && campo.classList.contains('form-group')) {
            var label = campo.querySelector('label');
            if (label) {
                return label.textContent.replace('*', '').trim();
            }
        }
        // Para campos individuales
        var label = campo.parentElement.querySelector('label');
        if (label) {
            return label.textContent.replace('*', '').trim();
        }
        return campo.name || campo.id || 'Campo sin nombre';
    }
    
});
