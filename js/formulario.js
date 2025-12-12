// Validación del formulario de matrícula con mensajes específicos
document.addEventListener('DOMContentLoaded', function() {
    
    // *** NUEVO: Arreglo para guardar los datos visualmente ***
    var listaMatriculados = []; 

    var botonEnviar = document.querySelector('.form-button');
    var formulario = document.querySelector('form');
    
    if (botonEnviar && formulario) {
        
        // VALIDACIÓN: Solo números en DNI y teléfonos
        var camposNumericos = [
            document.getElementById('student-dni'),
            document.getElementById('parent-dni'),
            document.getElementById('parent-cellphone'),
            document.getElementById('contact-cellphone')
        ];
        
        for (var i = 0; i < camposNumericos.length; i++) {
            if (camposNumericos[i]) {
                camposNumericos[i].addEventListener('input', function() {
                    this.value = this.value.replace(/[^0-9]/g, ''); // Solo números
                });
            }
        }
        
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
                // Recopilar todos los datos del formulario
                var formData = new FormData(formulario);
                
                // Agregar el campo de turno si está visible y seleccionado
                var turnoSeleccionado = formulario.querySelector('input[name="turno"]:checked');
                if (turnoSeleccionado) {
                    formData.append('turno', turnoSeleccionado.value);
                }
                
                // Enviar datos al servidor PHP usando fetch
                fetch('../php/guardar_matricula.php', {
                    method: 'POST',
                    body: formData
                })
                .then(function(response) {
                    // Verificar si la respuesta es OK
                    if (!response.ok) {
                        throw new Error('Error del servidor: ' + response.status);
                    }
                    // Intentar parsear como JSON
                    return response.text().then(function(text) {
                        try {
                            return JSON.parse(text);
                        } catch (e) {
                            // Si no es JSON, mostrar el texto de respuesta
                            throw new Error('Respuesta del servidor: ' + text);
                        }
                    });
                })
                .then(function(data) {
                    if (data.success) {
                        // Mostrar notificación de éxito
                        mostrarNotificacion('✅ ¡Registro exitoso! Tu solicitud ha sido enviada correctamente.');

                        // *** NUEVO: Agregar a la tabla visualmente ***
                        agregarFilaVisual(); 

                        // Limpiar formulario después de 2 segundos
                        setTimeout(function() {
                            formulario.reset();
                            // Limpiar todos los mensajes de error
                            for (var k = 0; k < campos.length; k++) {
                                quitarError(campos[k]);
                            }
                            // Ocultar turno si estaba visible
                            if (campoTurno) campoTurno.style.display = 'none';
                        }, 2000);
                    } else {
                        // Mostrar errores específicos si existen
                        var mensajeError = '❌ Error: ' + (data.message || 'No se pudo guardar la matrícula');
                        
                        // Si hay errores específicos, mostrarlos
                        if (data.errores && data.errores.length > 0) {
                            mensajeError += '\n\n';
                            for (var i = 0; i < data.errores.length; i++) {
                                mensajeError += '• ' + data.errores[i] + '\n';
                            }
                        }
                        
                        mostrarNotificacion(mensajeError);
                    }
                })
                .catch(function(error) {
                    console.error('Error completo:', error);
                    var mensajeError = '❌ Error al enviar los datos. ';
                    
                    // Mensajes más específicos según el tipo de error
                    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                        mensajeError += 'No se puede conectar al servidor. Se guardará localmente en la lista.';
                        
                        // *** NUEVO: Si no hay conexión (PHP falla), lo mostramos en la tabla igual ***
                        agregarFilaVisual();
                    } else if (error.message.includes('404')) {
                        mensajeError += 'No se encontró el archivo PHP. Verifica la ruta.';
                    } else {
                        mensajeError += error.message || 'Por favor, intenta nuevamente.';
                    }
                    
                    mostrarNotificacion(mensajeError);
                });
            }
        });
    }
    
    // funciones auxiliraes
    
    // *** NUEVO: Función para dibujar en la tabla ***
function agregarFilaVisual() {
        console.log("Intentando dibujar tabla..."); 
        var dni = document.getElementById('student-dni').value;
        var nombre = document.getElementById('student-name').value;
        var apellido = document.getElementById('student-lastname').value;
        var grado = document.getElementById('student-grade').value;

        var contenedor = document.getElementById('contenedor-tabla');
        var cuerpo = document.getElementById('cuerpo-tabla');
        
        if (contenedor && cuerpo) {
            contenedor.style.display = 'block';
            
            var tr = document.createElement('tr');
            tr.innerHTML = 
                '<td style="padding:10px;">' + dni + '</td>' +
                '<td style="padding:10px;">' + nombre + ' ' + apellido + '</td>' +
                '<td style="padding:10px;">' + grado + '</td>';
            
            cuerpo.appendChild(tr);
        } else {
            console.error("Error: No se encontró el contenedor-tabla o cuerpo-tabla en el HTML");
        }
    }

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
    
    function mostrarNotificacion(mensaje) {
        // Crear notificación
        var notificacion = document.createElement('div');
        notificacion.style.cssText = 'position:fixed; top:20px; left:50%; transform:translateX(-50%); background:#4CAF50; color:white; padding:20px 30px; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.3); z-index:10000; font-size:16px; font-weight:bold; text-align:center; max-width:90%;';
        
        if (mensaje.includes('❌') || mensaje.includes('Error')) {
             notificacion.style.background = '#ff4444'; 
        }

        notificacion.textContent = mensaje;
        
        document.body.appendChild(notificacion);
        
        // Eliminar después de 3 segundos
        setTimeout(function() {
            notificacion.style.opacity = '0';
            notificacion.style.transition = 'opacity 0.5s';
            setTimeout(function() {
                if (document.body.contains(notificacion)) {
                    document.body.removeChild(notificacion);
                }
            }, 500);
        }, 3000);
    }
    
});