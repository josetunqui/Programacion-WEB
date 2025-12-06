<?php
/**
 * Archivo PHP para recibir y guardar los datos del formulario de matrícula
 * Utiliza arreglos para almacenar los datos en un archivo JSON
 */

// Incluir funciones auxiliares
require_once __DIR__ . '/funciones.php';

// Habilitar reporte de errores para desarrollo (comentar en producción)
error_reporting(E_ALL);
ini_set('display_errors', 0); // No mostrar errores directamente, usar JSON

// Configurar headers para JSON y CORS
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Verificar que la solicitud sea POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

// Recibir y limpiar los datos del formulario
$datos_matricula = array(
    'id' => uniqid('MAT-', true), // ID único para cada matrícula
    'fecha_registro' => date('Y-m-d H:i:s'),
    
    // Información del estudiante
    'estudiante' => array(
        'nombre' => isset($_POST['student-name']) ? trim($_POST['student-name']) : '',
        'apellidos' => isset($_POST['student-lastname']) ? trim($_POST['student-lastname']) : '',
        'dni' => isset($_POST['student-dni']) ? trim($_POST['student-dni']) : '',
        'fecha_nacimiento' => isset($_POST['student-birthday']) ? trim($_POST['student-birthday']) : '',
        'genero' => isset($_POST['student-gender']) ? trim($_POST['student-gender']) : '',
        'grado' => isset($_POST['studentgrade']) ? trim($_POST['studentgrade']) : '',
        'turno' => isset($_POST['turno']) ? trim($_POST['turno']) : ''
    ),
    
    // Taller técnico
    'taller' => isset($_POST['taller']) ? trim($_POST['taller']) : '',
    
    // Información del apoderado
    'apoderado' => array(
        'nombre' => isset($_POST['parent-name']) ? trim($_POST['parent-name']) : '',
        'apellidos' => isset($_POST['parent-lastname']) ? trim($_POST['parent-lastname']) : '',
        'dni' => isset($_POST['parent-dni']) ? trim($_POST['parent-dni']) : '',
        'relacion' => isset($_POST['parent-relation']) ? trim($_POST['parent-relation']) : '',
        'telefono' => isset($_POST['parent-cellphone']) ? trim($_POST['parent-cellphone']) : '',
        'correo' => isset($_POST['parent-mail']) ? trim($_POST['parent-mail']) : ''
    ),
    
    // Información de contacto
    'contacto' => array(
        'direccion' => isset($_POST['contact-address']) ? trim($_POST['contact-address']) : '',
        'distrito' => isset($_POST['contact-town']) ? trim($_POST['contact-town']) : '',
        'telefono_emergencia' => isset($_POST['contact-cellphone']) ? trim($_POST['contact-cellphone']) : '',
        'contacto_emergencia' => isset($_POST['contact-name']) ? trim($_POST['contact-name']) : ''
    ),
    
    // Transporte
    'transporte' => isset($_POST['transporte']) ? trim($_POST['transporte']) : '',
    
    // Términos aceptados
    'terminos_aceptados' => isset($_POST['terminos']) ? true : false
);

// Validar campos obligatorios con mensajes específicos
$errores = array();

// Validar información del estudiante
if (empty($datos_matricula['estudiante']['nombre'])) {
    $errores[] = 'El nombre del estudiante es obligatorio';
}
if (empty($datos_matricula['estudiante']['apellidos'])) {
    $errores[] = 'Los apellidos del estudiante son obligatorios';
}
if (empty($datos_matricula['estudiante']['dni'])) {
    $errores[] = 'El DNI del estudiante es obligatorio';
} elseif (!validarDNI($datos_matricula['estudiante']['dni'])) {
    $errores[] = 'El DNI del estudiante debe tener 8 dígitos';
}
if (empty($datos_matricula['estudiante']['fecha_nacimiento'])) {
    $errores[] = 'La fecha de nacimiento es obligatoria';
}
if (empty($datos_matricula['estudiante']['genero'])) {
    $errores[] = 'El género es obligatorio';
}
if (empty($datos_matricula['estudiante']['grado'])) {
    $errores[] = 'El grado es obligatorio';
}
if (empty($datos_matricula['taller'])) {
    $errores[] = 'El taller técnico es obligatorio';
}

// Validar información del apoderado
if (empty($datos_matricula['apoderado']['nombre'])) {
    $errores[] = 'El nombre del apoderado es obligatorio';
}
if (empty($datos_matricula['apoderado']['apellidos'])) {
    $errores[] = 'Los apellidos del apoderado son obligatorios';
}
if (empty($datos_matricula['apoderado']['dni'])) {
    $errores[] = 'El DNI del apoderado es obligatorio';
} elseif (!validarDNI($datos_matricula['apoderado']['dni'])) {
    $errores[] = 'El DNI del apoderado debe tener 8 dígitos';
}
if (empty($datos_matricula['apoderado']['relacion'])) {
    $errores[] = 'La relación con el estudiante es obligatoria';
}
if (empty($datos_matricula['apoderado']['telefono'])) {
    $errores[] = 'El teléfono del apoderado es obligatorio';
} elseif (!validarTelefono($datos_matricula['apoderado']['telefono'])) {
    $errores[] = 'El teléfono del apoderado debe tener 9 dígitos';
}
if (empty($datos_matricula['apoderado']['correo'])) {
    $errores[] = 'El correo del apoderado es obligatorio';
} elseif (!validarEmail($datos_matricula['apoderado']['correo'])) {
    $errores[] = 'El correo del apoderado no tiene un formato válido';
}

// Validar información de contacto
if (empty($datos_matricula['contacto']['direccion'])) {
    $errores[] = 'La dirección es obligatoria';
}
if (empty($datos_matricula['contacto']['distrito'])) {
    $errores[] = 'El distrito es obligatorio';
}
if (empty($datos_matricula['contacto']['telefono_emergencia'])) {
    $errores[] = 'El teléfono de emergencia es obligatorio';
} elseif (!validarTelefono($datos_matricula['contacto']['telefono_emergencia'])) {
    $errores[] = 'El teléfono de emergencia debe tener 9 dígitos';
}
if (empty($datos_matricula['contacto']['contacto_emergencia'])) {
    $errores[] = 'El contacto de emergencia es obligatorio';
}
if (empty($datos_matricula['transporte'])) {
    $errores[] = 'El medio de transporte es obligatorio';
}

// Si hay errores, devolverlos
if (!empty($errores)) {
    http_response_code(400);
    echo json_encode([
        'success' => false, 
        'message' => 'Errores de validación',
        'errores' => $errores
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Leer datos existentes del archivo JSON usando función auxiliar
$matriculas = leerMatriculas();

// Agregar la nueva matrícula al arreglo
$matriculas[] = $datos_matricula;

// Guardar el arreglo actualizado usando función auxiliar
if (!guardarMatriculas($matriculas)) {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Error al guardar los datos. Verifica permisos de escritura.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Respuesta exitosa
echo json_encode([
    'success' => true,
    'message' => 'Matrícula registrada correctamente',
    'id' => $datos_matricula['id']
], JSON_UNESCAPED_UNICODE);
?>

