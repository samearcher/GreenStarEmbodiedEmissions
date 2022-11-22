import './App.css';
import A1_a3Table from './a1_a3Table';
import C1Table from './c1Table';
import MainAppBar from './mainAppBar.js';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <MainAppBar />
        <Routes>
          <Route path="/a1_a3Table" element={<A1_a3Table />}/>
          <Route path="/c1Table" element={<C1Table />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
