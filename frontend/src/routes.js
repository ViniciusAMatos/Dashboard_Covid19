import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard';
import Comoseproteger from './pages/Comoseproteger';
import Graficos from './pages/Graficos';
import Sobre from './pages/Sobre';

function Routes(){
    return(
        <BrowserRouter>
            <Route path="/" exact component={Dashboard} />   
            <Route path="/como-se-proteger" component={Comoseproteger} />   
            <Route path="/graficos" component={Graficos} />  
            <Route path="/sobre" component={Sobre} />  
        </BrowserRouter>
    )
}

export default Routes;