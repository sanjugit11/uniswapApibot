import './App.css';
import React from 'react';
import Display from './Display';
import InputFile from "./InputFile";
import {BrowserRouter,Routes,Route} from "react-router-dom"
function App() {

  return (
      <div className="App">
    <BrowserRouter>
      < Routes>
        <Route path= "/" element={ <Display/> }/>
        <Route path= "/bot" element={<InputFile/>}/>
      </Routes>
    </BrowserRouter>
    </div> 
  );
}

export default App;
