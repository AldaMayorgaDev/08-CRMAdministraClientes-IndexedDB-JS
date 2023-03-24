(function(){

    let DB;
    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', ()=>{
        //Conectar a DB
        conectarDB();

        //Escuchando eventos del formulario
        formulario.addEventListener('submit', validarFormulario);
    });


    function conectarDB(){
        const abrirConexion = window.indexedDB.open('db_crm', 1);

        abrirConexion.onerror = function(){
            console.log('Hubo un error al conectarse a la Base de datos...');
        };

        abrirConexion.onsuccess = function(){
            console.log('Se establecio conexicon con la Base de datos...');

            DB = abrirConexion.result; //Instancia de la BD;
        }
    }

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
            mostrarAlerta('Todos los campos del formulario son obligatorios', 'error');
        }else{

        }
    }


    //Mostrar alerta
    function mostrarAlerta(mensaje, tipo){

        const alerta = document.querySelector('.alerta');

        if(!alerta){
            const divAlerta = document.createElement('div');
            divAlerta.classList.add('px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'border', 'alerta');


            if (tipo === 'error') {
                divAlerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
            } else {
                divAlerta.classList.add('bg-green-100', 'border-green-400', 'text-green-700');
            }


            divAlerta.textContent = mensaje;

            formulario.appendChild(divAlerta);


            setTimeout(() => {
                divAlerta.remove();
            }, 3000);
        }

    }

})();