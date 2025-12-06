<?php
/**
 * Funciones auxiliares compartidas para el sistema de matrículas
 */

/**
 * Lee las matrículas del archivo JSON
 * @return array Arreglo de matrículas
 */
function leerMatriculas() {
    $archivo_datos = __DIR__ . '/matriculas.json';
    $matriculas = array();
    
    if (file_exists($archivo_datos)) {
        $contenido = file_get_contents($archivo_datos);
        if (!empty($contenido)) {
            $matriculas = json_decode($contenido, true);
            if (!is_array($matriculas)) {
                $matriculas = array();
            }
        }
    }
    
    return $matriculas;
}

/**
 * Guarda las matrículas en el archivo JSON
 * @param array $matriculas Arreglo de matrículas a guardar
 * @return bool True si se guardó correctamente, False en caso contrario
 */
function guardarMatriculas($matriculas) {
    $archivo_datos = __DIR__ . '/matriculas.json';
    $json_data = json_encode($matriculas, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    
    if ($json_data === false) {
        return false;
    }
    
    return file_put_contents($archivo_datos, $json_data) !== false;
}

/**
 * Valida el formato de un email
 * @param string $email Email a validar
 * @return bool True si es válido, False en caso contrario
 */
function validarEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Valida el formato de un DNI (8 dígitos)
 * @param string $dni DNI a validar
 * @return bool True si es válido, False en caso contrario
 */
function validarDNI($dni) {
    return preg_match('/^\d{8}$/', $dni) === 1;
}

/**
 * Valida el formato de un teléfono (9 dígitos)
 * @param string $telefono Teléfono a validar
 * @return bool True si es válido, False en caso contrario
 */
function validarTelefono($telefono) {
    return preg_match('/^\d{9}$/', $telefono) === 1;
}

/**
 * Sanitiza un string para prevenir XSS
 * @param string $texto Texto a sanitizar
 * @return string Texto sanitizado
 */
function sanitizar($texto) {
    return htmlspecialchars(trim($texto), ENT_QUOTES, 'UTF-8');
}

?>

