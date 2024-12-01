import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {AuthProvider} from "./components/AuthProvider.jsx";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {


  return (
    <AuthProvider>
        <Router>
            <Route path={"/"} element={<Home/>}/>
            <
        </Router>
    </AuthProvider>
  )
}

export default App
