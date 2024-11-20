import React from 'react'
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom'
import TransferFunds from './pages/transferFunds/TransferFunds'
import CheckAccountBalances from './pages/checkAccountBalances/CheckAccountBalances'
import ExchangeTokens from './pages/exchangeTokens/ExchangeTokens'
import Home from './pages/Home/Home'

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path="/transferFunds" element={<TransferFunds/>} />
          <Route path="/checkAccountBalances" element={<CheckAccountBalances/>} />
          <Route path="/exchangeTokens" element={<ExchangeTokens/>} />
        </Routes>
      </Router>  
    </div>
  )
}

export default App
