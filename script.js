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