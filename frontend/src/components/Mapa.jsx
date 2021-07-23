import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import Header from "../components/Header";

function Mapa() {
    var divElement = document.getElementById('viz1616856830843');
    var vizElement = divElement.getElementsByTagName('object')[0];
    if (divElement.offsetWidth > 800) {
        vizElement.style.minWidth = '320px';
        vizElement.style.maxWidth = '750px';
        vizElement.style.width = '100%';
        vizElement.style.height = '627px';
    } else if (divElement.offsetWidth > 500) {
        vizElement.style.width = '100%';
        vizElement.style.height = (divElement.offsetWidth * 0.75) + 'px';
    } else {
        vizElement.style.width = '100%';
        vizElement.style.height = '527px';
    }
    var scriptElement = document.createElement('script');
    scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
    vizElement.parentNode.insertBefore(scriptElement, vizElement);
    return (

        <div style={{ backgroundColor: "rgb(106,212,178,0.1)", height: "100%" }}>

            <div
                style={{
                    textAlign: "center",
                    fontSize: "35px",
                    fontFamily: "Roboto",
                    fontWeight: "800",
                }}>
                Mapa
                  </div>


            <div class='tableauPlaceholder' id='viz1616856830843' style={{ position: 'relative' }}>
                <noscript>
                    <a href='https:&#47;&#47;especiais.gazetadopovo.com.br&#47'>
                        <img alt='mapa-atual ' src='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;co&#47;coronavirus-brasil-cidades&#47;mapa-atual&#47;1_rss.png' style='border: none' />
                    </a>
                </noscript>
                <object class='tableauViz' style={{ display: 'none' }}>
                    <param name='host_url' value='https%3A%2F%2Fpublic.tableau.com%2F' />
                    <param name='embed_code_version' value='3' />
                    <param name='site_root' value='' />
                    <param name='name' value='coronavirus-brasil-cidades&#47;mapa-atual' />
                    <param name='tabs' value='no' />
                    <param name='toolbar' value='yes' />
                    <param name='static_image' value='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;co&#47;coronavirus-brasil-cidades&#47;mapa-atual&#47;1.png' />
                    <param name='animate_transition' value='yes' />
                    <param name='display_static_image' value='yes' />
                    <param name='display_spinner' value='yes' />
                    <param name='display_overlay' value='yes' />
                    <param name='display_count' value='yes' />
                    <param name='filter' value='publish=yes' /></object>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#00cba9" fill-opacity="0.5" d="M0,64L48,80C96,96,192,128,288,133.3C384,139,480,117,576,144C672,171,768,245,864,266.7C960,288,1056,256,1152,213.3C1248,171,1344,117,1392,90.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
        </div>

    )
}

export default Mapa;
