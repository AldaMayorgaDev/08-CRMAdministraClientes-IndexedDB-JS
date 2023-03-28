(function (){
    let DB;

    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');

    
    document.addEventListener("DOMContentLoaded", ()=>{

        //Abrir y conectar a BD;
        conectarDB();

        //Verificar y obtener el ID de la URL

        //1.- Obtener de la URL el ?=id 
        const parametrosURL = new URLSearchParams(window.location.search);
        console.log('parametrosURL :>> ', window.location.search);

        //2.- Obener y asignar el id de cliente
        const idCliente = parametrosURL.get('id');
        console.log('idCliente :>> ', idCliente);

        //3.- Si se tiene idCliente se manda llamar la funcion obtenerDatosCliente dando el parametro idCliente, y se manda llamar dentro de un sertTimeOut para dar tiempo a que se abra la conexion a la BD 
        if(idCliente){
            setTimeout(() => {
                obtenerDatosCliente(idCliente);
            }, 180);
            
        }
    });

    function obtenerDatosCliente(id) {
        //console.log('id :>> ', id);
        const transaction = DB.transaction(['crm_clientes'], 'readwrite');
        const objectStore = transaction.objectStore('crm_clientes');

        console.log('objectStore :>> ', objectStore);

        const cliente = objectStore.openCursor();
        cliente.onsuccess = function (e) {
            const cursorCliente = e.target.result;

            if(cursorCliente){
                //console.log('cursorCliente.value', cursorCliente.value);
                //const {nombre, empresa, email, telefono, id} = cursorCliente.value;

                //Se hace una especie de select where id= id, donde comparamos el id que viene de cursor con el id de la url para solo seleecionar uno
                if(cursorCliente.value.id === Number(id)){
                    llenarFormulario(cursorCliente.value);
                }
                cursorCliente.continue();
            }
        }
    }

    function conectarDB() {
        const abrirConexion = window.indexedDB.open('db_crm', 1);

        abrirConexion.onerror = function(){
            console.log('Hubo un error al conectarse a la Base de datos...');
        };

        abrirConexion.onsuccess = function(){
            console.log('Se establecio conexion con la Base de datos...');

            DB = abrirConexion.result; //Instancia de la BD;
        }
    };

    function llenarFormulario(datosCliente){
        const {nombre, empresa, email, telefono, id} = datosCliente;

        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value =telefono;
        empresaInput.value = empresa;

    }
})();