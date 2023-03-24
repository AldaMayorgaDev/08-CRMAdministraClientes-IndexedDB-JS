(function (){

    let DB;
    document.addEventListener('DOMContentLoaded', ()=>{
        crearDB();
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
})();