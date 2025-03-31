import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter as Router, Routes , Route } from 'react-router-dom';
import Register from './components/Register/Register'
import Blackjack from './components/BlackJack/Blackjack';
import Sign_in from './components/Sign_in/Sign_in';
import Slot from './components/Slot/Slot';
import PasswordChange from './components/PasswordChange/PasswordChange';
import App from './App';
import Aviator from './components/Aviator/Aviator';
import ChickenGame from './components/Chicken/Chicken';
import OtherGames from './components/OtherGames/OtherGames';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path='/' element={<App/>}></Route>
        <Route path='password_change' element={<PasswordChange />}></Route>
        <Route path='slot' element={<Slot/>}></Route>
        <Route path='chicken' element={<ChickenGame/>}></Route>
        <Route path='aviator' element={<Aviator/>}></Route>
        <Route path='sign_in' element={<Sign_in />}></Route>
        <Route path='register' element={<Register/>}></Route>
        <Route path='blackjack' element={<Blackjack/>}></Route>
        <Route path='othergames' element={<OtherGames/>}></Route>
      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();