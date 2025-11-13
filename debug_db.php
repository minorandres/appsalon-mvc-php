<?php
// Script temporal para inspeccionar tablas relacionadas con 'cita'
require_once __DIR__ . '/includes/database.php';

$db = $db ?? null; // includes/database.php crea $db
if (!$db) {
    echo "No se pudo conectar a la DB\n";
    exit;
}

echo "Conectado a DB\n\n";

// Buscar tablas que coincidan con %cita% y usar la primera coincidencia
$sql = "SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = 'appsalon_mvc' AND TABLE_NAME LIKE '%cita%'";
$res = $db->query($sql);
$foundTable = null;
if ($res) {
    echo "Tablas que coinciden con %cita%:\n";
    while ($row = $res->fetch_assoc()) {
        echo " - " . $row['TABLE_NAME'] . "\n";
        if (!$foundTable) $foundTable = $row['TABLE_NAME'];
    }
} else {
    echo "Error al consultar information_schema.tables: " . $db->error . "\n";
}

if (!$foundTable) {
    echo "No se encontró ninguna tabla relacionada con 'cita'.\n";
    exit;
}

$tbl = $foundTable; // usar la tabla real encontrada (por ejemplo 'citasservicios')
$r = $db->query("SHOW COLUMNS FROM `".$tbl."`");
if ($r && $r->num_rows > 0) {
    echo "\nColumnas de $tbl:\n";
    while ($c = $r->fetch_assoc()) {
        echo " - " . $c['Field'] . "\n";
    }
    echo "\nÚltimas 10 filas de $tbl:\n";
    $rows = $db->query("SELECT * FROM `".$tbl."` ORDER BY id DESC LIMIT 10");
    if ($rows) {
        while ($row = $rows->fetch_assoc()) {
            print_r($row);
            echo "\n";
        }
    } else {
        echo "No se pueden leer filas de $tbl: " . $db->error . "\n";
    }
} else {
    echo "\nLa tabla $tbl no existe o no se puede leer.\n";
}

    // Comprobar específicamente la tabla 'citasservicios' (sin mayúsculas)
    $check = 'citasservicios';
    $r2 = @ $db->query("SHOW TABLES LIKE '".$check."'");
    if ($r2 && $r2->num_rows > 0) {
        echo "\nColumnas de $check:\n";
        $cols = $db->query("SHOW COLUMNS FROM `".$check."`");
        while ($c = $cols->fetch_assoc()) {
            echo " - " . $c['Field'] . "\n";
        }
        echo "\nÚltimas 20 filas de $check:\n";
        $rows2 = $db->query("SELECT * FROM `".$check."` ORDER BY id DESC LIMIT 20");
        if ($rows2) {
            while ($row = $rows2->fetch_assoc()) {
                print_r($row);
                echo "\n";
            }
        } else {
            echo "No se pueden leer filas de $check: " . $db->error . "\n";
        }
    } else {
        echo "\nNo existe la tabla $check exactamente.\n";
    }

echo "\nHecho.\n";