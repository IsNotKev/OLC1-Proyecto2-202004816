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

  return (
    
    <div className='min-h-screen min-w-full bg-gray-500 flex justify-center items-center flex-col gap-10'>
      <button onClick={ejecutar} type="button" class="btn btn-outline-dark" style={{align:'center',marginTop:'2%'}}>Ejecutar</button>
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
