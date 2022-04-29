import Editor from '@monaco-editor/react';
import { useRef } from 'react';
import './App.css';

function App() {
  const editorRef = useRef(null);
  let ast = null;

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  function ejecutar() {
    var obj = { 'codigo': editorRef.current.getValue() }

    fetch(`http://localhost:5000/ejecutar`, {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    })
      .then(res => res.json())
      .catch(err => {
        console.error('Error:', err)
        alert("Ocurrio un error, ver la consola")
      })
      .then(response => {
        console.log(response);
        document.getElementById('consola').textContent = response.message;
        ast = response.ast;
        //editorRef.current.getModel().setValue(response.message);
      })
  }

  function leerArchivo(e) {
    var archivo = e.target.files[0];
    if (!archivo) {
      return;
    }
    var lector = new FileReader();
    lector.onload = function (e) {
      var contenido = e.target.result;
      mostrarContenido(contenido);
    };
    lector.readAsText(archivo);
  }

  function mostrarContenido(contenido) {
    editorRef.current.getModel().setValue(contenido);
  }

  function downloadFiles() {
    let file_name = 'Nuevo'
    let data = editorRef.current.getValue();
    let file_type = '.cst';
    var file = new Blob([data], { type: file_type });
    if (window.navigator.msSaveOrOpenBlob)
      window.navigator.msSaveOrOpenBlob(file, file_name);
    else {
      var a = document.createElement("a"),
        url = URL.createObjectURL(file);
      a.href = url;
      a.download = file_name;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    }
  }

  function verSimbolos(){
    if(ast!=null){
      let simbs = ast._simbolos;
      let func = ast._funciones;
      let tabla = document.getElementById('tsimbolos');
      var a = '';
      simbs.forEach(simbolo =>{
        a += '<tr> <td>'+ simbolo.id +'<td> Variable <td>'+ simbolo.tipo +'<td> Global';
      });
      func.forEach(simbolo =>{
        a += '<tr> <td>'+ simbolo.id +'<td> Función <td>'+ simbolo.tipo_dato +'<td> Global';
        let params = simbolo.parametros;
        let instr = simbolo.instrucciones;
        params.forEach(par =>{
          a += '<tr> <td>'+ par.identificador +'<td> Variable <td>'+ par.tipo_dato +'<td>' + simbolo.id;
        });
        instr.forEach(instruccion =>{
          if(instruccion.tipo === 'INSTR_DECLARACION'){
            a += '<tr>';
            let ids = instruccion.identificadores;
            ids.forEach(idd =>{
              a+= '<td>'+ idd +'<td> Variable <td>'+ instruccion.tipo_dato +'<td>' + simbolo.id;
            });
          }
        });
      });
      tabla.innerHTML = a;
    }
  }

  return (

    <div>
      <form class="form-inline">
        <div class="form-group">
          <input required class="form-control" type="file" id="file-input" onChange={leerArchivo} style={{ marginTop: '2%', width: '50%' }}></input>
          <button onClick={downloadFiles} type="button" required class="btn btn-outline-dark" style={{ marginBottom: '1%', marginLeft: '84%' }}>
            Guardar
          </button>
          <button onClick={ejecutar} type="button" required class="btn btn-outline-dark" style={{ marginBottom: '1%', marginLeft: '2%' }}>
            Ejecutar
          </button>
        </div>
      </form>
      <p>

      </p>
      <div className='max-w-[60rem] w-full flex flex-col gap-5'>
        <div className='w-full rounded-xl'>
          <Editor
            height="70vh"
            defaultLanguage="java"
            defaultValue="// CompScript :)"
            onMount={handleEditorDidMount}
            className={'rounded-xl'}
            theme="vs-dark"
          />
        </div>
      </div>
      <p>

      </p>
      <textarea disabled style={{ width: '100%', height: '200px', background: 'gray', color: 'black' }} id="consola">

      </textarea>

      <p>

      </p>
      <button type="button" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#modalSimbolos" style={{ marginBottom: '2%' }} onClick={verSimbolos}>
        Ver Tabla De Simbolos
      </button>
      <button type="button" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#modalErrores" style={{ marginBottom: '2%', marginLeft: '2%' }}>
        Ver Tabla De Errores
      </button>
      <button type="button" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#modalAST" style={{ marginBottom: '2%', marginLeft: '2%' }}>
        Ver AST
      </button>

      <div class="modal fade" id="modalSimbolos" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-fullscreen">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Tabla De Simbolos</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <table class="table table-striped" style={{width:'80%', margin: 'auto'}}>
                <thead class="table table-dark">
                  <tr>
                    <th scope="col">IDENTIFICADOR</th>
                    <th scope="col">TIPO</th>
                    <th scope="col">TIPO DE DATO</th>
                    <th scope="col">ENTORNO</th>
                  </tr>
                </thead>
                <tbody id='tsimbolos'>
                </tbody>
              </table>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

      <div class="modal fade" id="modalErrores" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-fullscreen">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Tabla De Errores</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              ...
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

      <div class="modal fade" id="modalAST" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-fullscreen">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">AST</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              ...
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

    </div>



  );
}

export default App;
