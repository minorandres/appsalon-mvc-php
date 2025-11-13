<?php 
include_once __DIR__ . '/../templates/barra.php';

$idCita = '';
?>
<h1 class="nombre-pagina">Panel de Administración</h1>

<h2>Buscar Citas</h2>
<div class="busqueda">
    <form class="formulario">
        <label for="fecha">Fecha</label>
        <input type="date" id="fecha" name="fecha" value="<?php echo $fecha; ?>"/>
    </form>
</div>

<?php
 if(count($citas) === 0) { ?>
    <h2>No hay citas en esta fecha</h2>
<?php } ?>

<div id="citas-admin">
    <ul class="citas">
        <?php 
    foreach($citas as $key => $cita) { 
    
        if($idCita !== $cita->id) {
            $total = 0;
        ?>
        <li class="cita">
            <p>ID: <span><?php echo $cita->id; ?></span></p>
            <p>Hora: <span><?php echo $cita->hora; ?></span></p>
            <p>Cliente: <span><?php echo $cita->cliente; ?></span></p>
            <p>Email: <span><?php echo $cita->email; ?></span></p>
            <p>Teléfono: <span><?php echo $cita->telefono; ?></span></p>
            <h3>Servicios:</h3>
            
        <?php 
            $idCita = $cita->id;
        } //Fin del if 
            $total += $cita->precio;
        ?> 
            <p class="servicio"><?php echo $cita->servicio . " $" . $cita->precio; ?></p>  
        
        <?php
        $actual = $cita->id;
        $proximo = $citas[$key+1]->id ?? 0;

        if(esUltimo($actual, $proximo)) { ?>
            <p class="total">Total: <span>$ <?php echo $total; ?></span></p>

            <form action="/api/eliminar" method="POST">
                <input type="hidden" name="id" value="<?php echo $cita->id; ?>">
                <input type="submit" class="boton-eliminar" value="Eliminar Cita">
            </form>
        <?php 
        }

    } //Fin del foreach ?>
    </ul>
    
</div>

<?php
    $script = "<script src='build/js/buscador.js'></script>";

?>