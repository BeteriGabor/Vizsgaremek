import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter as Router, Routes , Route } from 'react-router-dom';
import Register from './components/Pages/Register'
import Blackjack from './components/Pages/Blackjack';
import Sign_in from './components/Pages/Sign_in';
import Slot from './components/Pages/Slot';
import PasswordChange from './components/Pages/PasswordChange';
import App from './App';
import Aviator from './components/Pages/Aviator';
import ChickenGame from './components/Pages/Chicken';
import OtherGames from './components/Pages/OtherGames';
import Roulette from './components/Pages/Roulette';
import Deposit from './components/Pages/Deposit';
import Withdraw from './components/Pages/Withdraw';
import Wallet from './components/Pages/Wallet';


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
        <Route path='roulette' element={<Roulette/>}></Route>
        <Route path='deposit' element={<Deposit/>}></Route>
        <Route path='wallet' element={<Wallet/>}></Route>
        <Route path='withdraw' element={<Withdraw/>}></Route>
      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();