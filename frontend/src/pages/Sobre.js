import React from "react";
import "../App.css";
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faViruses,
  faArrowDown,
  faBiohazard,
  faHeartbeat,
  faHeadSideMask,
  faLungsVirus,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";

class Sobre extends React.Component {
  render() {
    return (
      <div style={{ backgroundColor: "rgb(106,212,178,0.1)", height: "100%" }}>
        <Header />
        <div
          style={{
            textAlign: "center",
            fontSize: "35px",
            fontFamily: "Roboto",
            fontWeight: "800",
          }}>
          Sobre
            </div>

        <div class="centralizar_sobre">
          <div class="sobre">
            <p>Somos alunos da Universidade Estadual do Maranhão, essa Dashboard de coronavírus foi criada como projeto para a disciplina de programação web cliente do curso de Engenharia da computação (2021). </p>
            <p>Incidência: Número de casos confirmados de COVID-19 em residentes X 100.000 População* total residente no período determinado.</p>
            <p>Mortalidade: Número de óbitos confirmados de COVID-19 em residentes X 100.000 População* total residente no período determinado.</p>
            <p>Letalidade: Número de óbitos confirmados de COVID-19 em determinada área e período X 100 Número de casos confirmados de COVID-19 em determinada área e período.</p>
          </div><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
          <div class="imagem_sobre" ></div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#00cba9" fill-opacity="0.5" d="M0,64L48,80C96,96,192,128,288,133.3C384,139,480,117,576,144C672,171,768,245,864,266.7C960,288,1056,256,1152,213.3C1248,171,1344,117,1392,90.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
      </div>
    );
  }
}
export default Sobre;
