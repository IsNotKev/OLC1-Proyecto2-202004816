import Editor from '@monaco-editor/react';
import { useRef } from 'react';
import './App.css';

function App() {

  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor; 
  }

  function ejecutar() {
    var obj = {'codigo':editorRef.current.getValue()}
    
    fetch(`http://localhost:5000/ejecutar`, {
      method: 'POST',
      body:JSON.stringify(obj),
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
        console.log(response.message)  ; 
        document.getElementById('consola').textContent = response.message;
        //editorRef.current.getModel().setValue(response.message);
      })
  }

  function leerArchivo(e) {
    var archivo = e.target.files[0];
    if (!archivo) {
      return;
    }
    var lector = new FileReader();
    lector.onload = function(e) {
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
    var file = new Blob([data], {type: file_type});
    if (window.navigator.msSaveOrOpenBlob) 
        window.navigator.msSaveOrOpenBlob(file, file_name);
    else { 
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = file_name;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

  return (
    
    <div>
      <form class="form-inline">
      <div class="form-group">
          <input required class="form-control" type="file" id="file-input" onChange={leerArchivo} style={{marginTop:'2%',width:'50%'}}></input>
          <button onClick={downloadFiles} type="button" required class="btn btn-outline-dark" style={{marginTop:'2%',marginLeft:'93%'}}>Guardar</button> 
          <button onClick={ejecutar} type="button" required class="btn btn-outline-dark" style={{marginTop:'2%',marginLeft:'93%'}}>Ejecutar</button> 
      </div>
      </form>
      <p>

      </p>
      <div className='max-w-[60rem] w-full flex flex-col gap-5'>      
        <div className='w-full rounded-xl'>
          <Editor
            height="70vh"
            defaultLanguage="typescript"
            defaultValue="// CompScript :)"
            onMount={handleEditorDidMount}
            className={'rounded-xl'}
            theme="vs-dark"
          />
        </div>    
      </div>
      <p>

      </p>
      <textarea disabled style={{width:'100%',height:'100px',background:'gray',color:'black'}} id="consola">
      
      </textarea>
    </div>
  );
}

export default App;
