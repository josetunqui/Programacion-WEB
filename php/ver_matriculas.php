<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ver Matrículas Registradas - IE Fe y Alegría N.° 17</title>
    <link rel="stylesheet" href="../css/ver_matriculas.css">
</head>
<body>
    <div class="container">
        <h1>📋 Matrículas Registradas</h1>
        <p class="subtitle">IE Fe y Alegría N.° 17 – Villa El Salvador</p>
        
        <?php
        // Incluir funciones auxiliares
        require_once __DIR__ . '/funciones.php';
        
        // Leer datos del archivo usando función auxiliar
        $matriculas = leerMatriculas();
        
        // Mostrar estadísticas
        $total_matriculas = count($matriculas);
        ?>
        
        <div class="stats">
            <div class="stat-card">
                <h3><?php echo $total_matriculas; ?></h3>
                <p>Total de Matrículas</p>
            </div>
        </div>
        
        <?php if ($total_matriculas > 0): ?>
            <div class="matriculas-list">
                <?php
                // Mostrar las matrículas en orden inverso (más recientes primero)
                $matriculas_reversas = array_reverse($matriculas);
                
                foreach ($matriculas_reversas as $matricula):
                    $estudiante = $matricula['estudiante'];
                    $apoderado = $matricula['apoderado'];
                    $contacto = $matricula['contacto'];
                ?>
                    <div class="matricula-card">
                        <div class="matricula-header">
                            <div class="matricula-id"><?php echo htmlspecialchars($matricula['id']); ?></div>
                            <div class="matricula-fecha"><?php echo htmlspecialchars($matricula['fecha_registro']); ?></div>
                        </div>
                        
                        <div class="matricula-section">
                            <h3>👤 Información del Estudiante</h3>
                            <div class="matricula-grid">
                                <div class="matricula-item">
                                    <strong>Nombre:</strong>
                                    <span><?php echo htmlspecialchars($estudiante['nombre'] . ' ' . $estudiante['apellidos']); ?></span>
                                </div>
                                <div class="matricula-item">
                                    <strong>DNI:</strong>
                                    <span><?php echo htmlspecialchars($estudiante['dni']); ?></span>
                                </div>
                                <div class="matricula-item">
                                    <strong>Fecha de Nacimiento:</strong>
                                    <span><?php echo htmlspecialchars($estudiante['fecha_nacimiento']); ?></span>
                                </div>
                                <div class="matricula-item">
                                    <strong>Género:</strong>
                                    <span><?php echo htmlspecialchars($estudiante['genero']); ?></span>
                                </div>
                                <div class="matricula-item">
                                    <strong>Grado:</strong>
                                    <span><?php echo htmlspecialchars($estudiante['grado']); ?></span>
                                </div>
                                <?php if (!empty($estudiante['turno'])): ?>
                                <div class="matricula-item">
                                    <strong>Turno:</strong>
                                    <span><?php echo htmlspecialchars(ucfirst($estudiante['turno'])); ?></span>
                                </div>
                                <?php endif; ?>
                                <div class="matricula-item">
                                    <strong>Taller Técnico:</strong>
                                    <span><?php echo htmlspecialchars(ucfirst($matricula['taller'])); ?></span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="matricula-section">
                            <h3>👨‍👩‍👧 Apoderado</h3>
                            <div class="matricula-grid">
                                <div class="matricula-item">
                                    <strong>Nombre:</strong>
                                    <span><?php echo htmlspecialchars($apoderado['nombre'] . ' ' . $apoderado['apellidos']); ?></span>
                                </div>
                                <div class="matricula-item">
                                    <strong>DNI:</strong>
                                    <span><?php echo htmlspecialchars($apoderado['dni']); ?></span>
                                </div>
                                <div class="matricula-item">
                                    <strong>Relación:</strong>
                                    <span><?php echo htmlspecialchars($apoderado['relacion']); ?></span>
                                </div>
                                <div class="matricula-item">
                                    <strong>Teléfono:</strong>
                                    <span><?php echo htmlspecialchars($apoderado['telefono']); ?></span>
                                </div>
                                <div class="matricula-item">
                                    <strong>Correo:</strong>
                                    <span><?php echo htmlspecialchars($apoderado['correo']); ?></span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="matricula-section">
                            <h3>📍 Información de Contacto</h3>
                            <div class="matricula-grid">
                                <div class="matricula-item">
                                    <strong>Dirección:</strong>
                                    <span><?php echo htmlspecialchars($contacto['direccion']); ?></span>
                                </div>
                                <div class="matricula-item">
                                    <strong>Distrito:</strong>
                                    <span><?php echo htmlspecialchars($contacto['distrito']); ?></span>
                                </div>
                                <div class="matricula-item">
                                    <strong>Teléfono Emergencia:</strong>
                                    <span><?php echo htmlspecialchars($contacto['telefono_emergencia']); ?></span>
                                </div>
                                <div class="matricula-item">
                                    <strong>Contacto Emergencia:</strong>
                                    <span><?php echo htmlspecialchars($contacto['contacto_emergencia']); ?></span>
                                </div>
                                <div class="matricula-item">
                                    <strong>Transporte:</strong>
                                    <span><?php echo htmlspecialchars(ucfirst($matricula['transporte'])); ?></span>
                                </div>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php else: ?>
            <div class="no-data">
                <h2>📭 No hay matrículas registradas</h2>
                <p>Aún no se han registrado solicitudes de matrícula.</p>
            </div>
        <?php endif; ?>
        
        <a href="../Paginas/oferta.html" class="btn-back">← Volver al Formulario</a>
    </div>
</body>
</html>

