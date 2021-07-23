import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';


function Header() {
  return (

    <header>

      <div className="top-bar-container">

        <div class="container" >
          <div class="menu_principal">

            <div class="item_menu">
              <Link to="/">
                Dashboard
            </Link>
            </div>
            {/*          
            <div class="item_menu2">
            <Link to="/graficos">
               Graficos
            </Link>
            </div>
  */}

            <div class="item_menu2">
              <Link to="/como-se-proteger">
                Como se proteger
            </Link>
            </div>
            <div class="item_menu2">
              <Link to="/sobre">
                Sobre
            </Link>
            </div>
          </div>
          <br /><br />
          <div style={{ color: 'white', textAlign: 'center', fontSize: '35px', fontFamily: 'Roboto', fontWeight: '800' }}>Painel Coronavírus</div>
          <br /><br />
          {/* <div class="centro" id="logo_informacao">
            <div class="centro centro_coluna">
              <div id="informacao_coronavirus">
                Coronavírus é uma família de vírus que causa infecções respiratórias. Atualmente, seu nome está sendo associado à pandemia de COVID-19 - doença causada por uma nova espécie de coronavírus, o SARS-CoV-2, cujos sintomas variam desde manifestações leves, como perda de olfato e paladar, até quadros mais graves, que provocam falta de ar e podem levar à morte.
              </div>
            </div>
          </div> */}
        </div>

      </div>
    </header>

  )
}

export default Header;