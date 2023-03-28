(function (){

    let DB;
    const listadoClientes = document.querySelector('#listado-clientes');

    document.addEventListener('DOMContentLoaded', ()=>{
        crearDB();

        //verifica si la BD esta creada
        if(window.indexedDB.open('db_crm', 1)){
            obtenerClientes();
        };

        listadoClientes.addEventListener('click', eliminarRegistro);
    });


    //Crea la Base de datos de IndexedDB
    function crearDB() {
        const crearDB = window.indexedDB.open('db_crm', 1);

        crearDB.onerror = function(){
            console.error('Error al crear la DB');
        };

        crearDB.onsuccess = function(){
            DB = crearDB.result;
            console.log('DB creada exitosamente');
        };

        crearDB.onupgradeneeded = function(e) {
            const db = e.target.result;

            const objectStore = db.createObjectStore('crm_clientes', {keyPath: 'id', autoIncrement: true});

            //Crear campos de la bd
            objectStore.createIndex('nombre', 'nombre', {unique: false});
            objectStore.createIndex('email', 'email', {unique: true});
            objectStore.createIndex('telefono', 'telefono', {unique: false});
            objectStore.createIndex('empresa', 'empresa', {unique: false});
            objectStore.createIndex('id', 'id', {unique: true});

            console.log('DB lista y creada')
        }


    };


    //Obtener Clientes

    function obtenerClientes() {
        //1.- Abrir conexion
        const abrirConexion = window.indexedDB.open('db_crm', 1);

        abrirConexion.onerror = function(){
            console.error('Hubo un error al intentar conectarse a la BD');
        };

        abrirConexion.onsuccess = function(){
            DB = abrirConexion.result;
            console.log('Conexion a BD exitosamente');

            const objectStore = DB.transaction('crm_clientes', 'readonly').objectStore('crm_clientes');


            objectStore.openCursor().onsuccess = function(e){
                /* Para acceder a los datos del la bse se utiliza un cursor, en este caso cursor funciona como un iterador */
                const cursor = e.target.result;

                if (cursor){
                    console.log('cursor.value', cursor.value);
                    const {nombre, empresa, email, telefono, id} = cursor.value;

                    //Inserta los datos en el HTML
                    
                    listadoClientes.innerHTML += `
                     <tr>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                                <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                                <p class="text-gray-700">${telefono}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                                <p class="text-gray-600">${empresa}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                                <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 inline-block">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                              </svg>
                              Editar</a>
                                <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 inline-block">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                                Eliminar</a>
                            </td>
                        </tr>`;
                    cursor.continue(); //Con esto indicamos que continue y siga iterando en la BD hasta que no encuentre registros
                }else{
                    console.log('No hay más registros...');
                }
            }
        };
    };

    function eliminarRegistro(e) {

        if(e.target.classList.contains('eliminar')){
            const idEliminar = Number(e.target.dataset.cliente);
            //console.log('idEliminar :>> ', idEliminar);

            //const confirmar = confirm('¿Está seguro que desea eliminar este cliente?');
            //console.log('confirmar :>> ', confirmar);

            Swal.fire({
                title: '¿Está seguro que desea eliminar este cliente?',
                text: "Se perderá el registro de la Base de datos",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, deseo eliminar',
                cancelButtonText: 'Cancelar'
              }).then((result) => {
                const confirmar = result.value;
              
                if (confirmar) {
                  const transaction = DB.transaction(['crm_clientes'], 'readwrite');
                  const objectStore = transaction.objectStore('crm_clientes');

                  objectStore.delete(idEliminar);

                  transaction.oncomplete = () => {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Eliminado exitosamente',
                        showConfirmButton: false,
                        timer: 1500
                      });
                    e.target.parentElement.parentElement.remove();
                  };

                  transaction.onerror = ()=>{
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'No ha sido posible eliminar este registro'
                      })
                  }
                }
        }
              )}
    }

})();