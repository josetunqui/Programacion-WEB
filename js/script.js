document.addEventListener('DOMContentLoaded', function() {
    
    function activarAnimaciones() {
        var elementos = document.querySelectorAll(".slide-left, .slide-right, .zoom-in, .fade-up");

        for (var i = 0; i < elementos.length; i++) {
            var windowHeight = window.innerHeight;
            var elementTop = elementos[i].getBoundingClientRect().top;
            var elementVisible = 100;

            if (elementTop < windowHeight - elementVisible) {
                elementos[i].classList.add("active");
            }
        }
    }

    window.addEventListener("scroll", activarAnimaciones);
    activarAnimaciones();
});
document.addEventListener("DOMContentLoaded", function() {
  const formulario = document.getElementById("formMatricula");
  const modal = document.getElementById("modalAlerta");
  const btnCerrar = document.getElementById("btnCerrarModal");

  if (formulario) {
    formulario.addEventListener("submit", function(evento) {
      let esValido = true;
      let primerError = null;

      const camposRequeridos = formulario.querySelectorAll("[required]");

      camposRequeridos.forEach(function(campo) {
        if (!campo.value.trim()) {
          esValido = false;
          campo.classList.add("input-error");
          
          if (!primerError) primerError = campo;
        } else {
          campo.classList.remove("input-error");
        }
      });

      if (!esValido) {
        evento.preventDefault();
        // Mostramos el aviso
        if (modal) modal.style.display = "flex";
      }
    });

    const inputs = formulario.querySelectorAll("input, select");
    inputs.forEach(input => {
      input.addEventListener("input", function() {
        if (this.value.trim()) {
          this.classList.remove("input-error");
        }
      });
    });
  }

  if (btnCerrar && modal) {
    btnCerrar.addEventListener("click", function() {
      modal.style.display = "none";
    });

    modal.addEventListener("click", function(evento) {
      if (evento.target === modal) {
        modal.style.display = "none";
      }
    });
  }
});
document.addEventListener('DOMContentLoaded', function() {
        const form = document.getElementById('matriculaForm');
        const modal = document.getElementById('modalError');
        const closeBtn = document.querySelector('.close-btn');
        const btnEntendido = document.getElementById('btnEntendido');

        form.addEventListener('submit', function(e) {
            let hayErrores = false;
            const inputsRequeridos = form.querySelectorAll('input[required], select[required]');

            inputsRequeridos.forEach(input => {
                if (!input.value.trim()) {
                    hayErrores = true;
                    input.classList.add('input-error'); 
                    
                    input.addEventListener('input', function() {
                        input.classList.remove('input-error');
                    }, { once: true });
                    
                    input.addEventListener('change', function() {
                        input.classList.remove('input-error');
                    }, { once: true });
                } else {
                    input.classList.remove('input-error');
                }
            });

            if (hayErrores) {
                e.preventDefault();
                modal.style.display = "block";
            } else {
                alert("¡Formulario enviado correctamente!");
            }
        });

        function cerrarModal() {
            modal.style.display = "none";
        }

        closeBtn.onclick = cerrarModal;
        btnEntendido.onclick = cerrarModal;

        window.onclick = function(event) {
            if (event.target == modal) {
                cerrarModal();
            }
        }
    });
  </script>
</body>
</html>

