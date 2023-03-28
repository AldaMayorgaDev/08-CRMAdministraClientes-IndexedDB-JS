(function(){

    let DB;
    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', ()=>{
        //Conectar a DB
        conectarDB();

        //Escuchando eventos del formulario
        formulario.addEventListener('submit', validarFormulario);
    });




    //Función para validar los campos del formulario
    function validarFormulario(e){
        e.preventDefault();

        console.log('validando');

        //leer todos los inputs
        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;

        if(nombre == '' || email == '' || telefono == '' || empresa == ''){
            console.error('Todos los campos del formulario son obligatorios');
            mostrarAlerta('Todos los campos del formulario son obligatorios ❌', 'error');
        }

        //Crear un objeto con la informacion

        const cliente = {
            /* nombre : nombre,
            email : email,
            telefono : telefono,
            empresa : empresa */

            nombre,
            email,
            telefono,
            empresa,
            id : Date.now()
        }

       crearNuevoCliente(cliente);
    }

    // Creacion de un nuevo registro de Cliente

    function crearNuevoCliente(cliente){
        const transaction = DB.transaction('crm_clientes', 'readwrite');
        const objectStore = transaction.objectStore('crm_clientes');

        objectStore.add(cliente);

        transaction.onerror = ()=>{
            mostrarAlerta('Hubo un error al registrar cliente en DB', 'error');
        };

        transaction.oncomplete = ()=>{
            mostrarAlerta('Se registró correctamente cliente a DB', 'success');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        }
    }


})();