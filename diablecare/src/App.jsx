import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './components/Login/Login'
import Register from './components/Register/Register';
import Header from './components/Header/Header';

function App() {
  // const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Header/>}/>
        <Route path='/login' element={<><Header/><Login/></>}/>
        <Route path='/register' element={<><Header/><Register/></>}/>
      </Routes>
    </Router>
  )
}

export default App
