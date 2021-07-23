import React from 'react'  
import Header from '../components/Header'
import {Link} from 'react-router-dom'


class Comoseproteger extends React.Component {  
  render() {  
    return (
      
      <div style={{ backgroundColor: "rgb(106,212,178,0.1)",height: "100%"}}>

       
        <Header />
  
      
        <div class="centralizar_comoseproteger">
          <div class="comoseproteger">
          <br/>
          <p  class="comoseproteger_paragrafo">Lave com frequência as mãos até a altura dos punhos, com água e sabão, ou então higienize com álcool em gel 70%. Essa frequência deve ser ampliada quando estiver em algum ambiente público (ambientes de trabalho, prédios e instalações comerciais, etc), quando utilizar estrutura de transporte público ou tocar superfícies e objetos de uso compartilhado.</p>
          <p class="comoseproteger_paragrafo">Ao tossir ou espirrar, cubra nariz e boca com lenço ou com a parte interna do cotovelo.
Não tocar olhos, nariz, boca ou a máscara de proteção fácil com as mãos não higienizadas.
Se tocar olhos, nariz, boca ou a máscara, higienize sempre as mãos como já indicado.</p>
<div class="comoseproteger_imagem"></div>
          </div>
          <div class="comoseproteger">
          <br/>
          <p  class="comoseproteger_paragrafo">Mantenha distância mínima de 1 (um) metro entre pessoas em lugares públicos e de convívio social. Evite abraços, beijos e apertos de mãos. Adote um comportamento amigável sem contato físico, mas sempre com um sorriso no rosto.</p>
          <p class="comoseproteger_paragrafo">Higienize com frequência o celular, brinquedos das crianças e outro objetos que são utilizados com frequência.</p>
            <div class="comoseproteger_imagem_2"></div>
          </div>
          <div class="comoseproteger">
          <br/>
          <p  class="comoseproteger_paragrafo">Não compartilhe objetos de uso pessoal como talheres, toalhas, pratos e copos.</p>
          <p class="comoseproteger_paragrafo">Se estiver doente, evite contato próximo com outras pessoas, principalmente idosos e doentes crônicos, busque orientação pelos canais on-line disponibilizados pelo SUS ou atendimento nos serviços de saúde e siga as recomendações do profissional de saúde.</p>
          <div class="comoseproteger_imagem_3"></div>
          </div>
          <br/>
          <div class="comoseproteger">
          <p  class="comoseproteger_paragrafo">Recomenda-se a utilização de máscaras em todos os ambientes.  As máscaras de tecido (caseiras/artesanais), não são Equipamentos de Proteção Individual (EPI), mas podem funcionar como uma barreira física, em especial contra a saída de gotículas potencialmente contaminadas.</p>
          <p class="comoseproteger_paragrafo">Durma bem e tenha uma alimentação saudável.</p>
          <div class="comoseproteger_imagem_4"></div>
          </div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#00cba9" fill-opacity="0.5" d="M0,64L48,80C96,96,192,128,288,133.3C384,139,480,117,576,144C672,171,768,245,864,266.7C960,288,1056,256,1152,213.3C1248,171,1344,117,1392,90.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
      </div>
    );
  }  
}  
export default Comoseproteger  