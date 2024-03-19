import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import ShowProductos from './components/ShowProductos';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ShowProductos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;