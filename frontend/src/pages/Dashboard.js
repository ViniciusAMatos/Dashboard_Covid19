import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import "../App.css";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeartbeat,
  faHeadSideMask,
  faLungsVirus,
} from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import { MDBDataTable } from "mdbreact";
import UserService from "../services/UserService";
import { Bar, Pie } from "react-chartjs-2";

import Maps from '../components/Map/index'
import * as  FS from 'fs';
import  {fn1} from "../Models/neural_wts.txt";
let U = require("../utilities_lib.js");
//let NN = require("../NeuralTeste.js");

class NeuralNet
{
  constructor(numInput, numHidden, numOutput, seed)
  {
    this.rnd = new U.Erratic(seed);

    this.ni = numInput; 
    this.nh = numHidden;
    this.no = numOutput;

    this.iNodes = U.vecMake(this.ni, 0.0);
    this.hNodes = U.vecMake(this.nh, 0.0);
    this.oNodes = U.vecMake(this.no, 0.0);

    this.ihWeights = U.matMake(this.ni, this.nh, 0.0);
    this.hoWeights = U.matMake(this.nh, this.no, 0.0);

    this.hBiases = U.vecMake(this.nh, 0.0);
    this.oBiases = U.vecMake(this.no, 0.0);

    this.initWeights();
  }

  initWeights()
  {
    let lo = -0.01;
    let hi = 0.01;
    for (let i = 0; i < this.ni; ++i) {
      for (let j = 0; j < this.nh; ++j) {
        this.ihWeights[i][j] = (hi - lo) * this.rnd.next() + lo;
      }
    }

    for (let j = 0; j < this.nh; ++j) {
      for (let k = 0; k < this.no; ++k) {
        this.hoWeights[j][k] = (hi - lo) * this.rnd.next() + lo;
      }
    }
  } 

  eval(X)
  {
    // regresion: no output activation
    let hSums = U.vecMake(this.nh, 0.0);
    let oSums = U.vecMake(this.no, 0.0);
    
    this.iNodes = X;

    for (let j = 0; j < this.nh; ++j) {
      for (let i = 0; i < this.ni; ++i) {
        hSums[j] += this.iNodes[i] * this.ihWeights[i][j];
      }
      hSums[j] += this.hBiases[j];
      this.hNodes[j] = U.hyperTan(hSums[j]);
    }

    for (let k = 0; k < this.no; ++k) {
      for (let j = 0; j < this.nh; ++j) {
        oSums[k] += this.hNodes[j] * this.hoWeights[j][k];
      }
      oSums[k] += this.oBiases[k];
    }

    // this.oNodes = U.softmax(oSums);
    for (let k = 0; k < this.no; ++k) {  // aka "Identity"
      this.oNodes[k] = oSums[k];
    }

    let result = [];
    for (let k = 0; k < this.no; ++k) {
      result[k] = this.oNodes[k];
    }
    return result;
  } // eval()

  setWeights(wts)
  {
    // order: ihWts, hBiases, hoWts, oBiases
    let p = 0;

    for (let i = 0; i < this.ni; ++i) {
      for (let j = 0; j < this.nh; ++j) {
        this.ihWeights[i][j] = wts[p++];
      }
    }

    for (let j = 0; j < this.nh; ++j) {
      this.hBiases[j] = wts[p++];
    }

    for (let j = 0; j < this.nh; ++j) {
      for (let k = 0; k < this.no; ++k) {
        this.hoWeights[j][k] = wts[p++];
      }
    }

    for (let k = 0; k < this.no; ++k) {
      this.oBiases[k] = wts[p++];
    }
  } // setWeights()

  getWeights()
  {
    // order: ihWts, hBiases, hoWts, oBiases
    let numWts = (this.ni * this.nh) + this.nh +
      (this.nh * this.no) + this.no;
    let result = U.vecMake(numWts, 0.0);
    let p = 0;
    for (let i = 0; i < this.ni; ++i) {
      for (let j = 0; j < this.nh; ++j) {
        result[p++] = this.ihWeights[i][j];
      }
    }

    for (let j = 0; j < this.nh; ++j) {
      result[p++] = this.hBiases[j];
    }

    for (let j = 0; j < this.nh; ++j) {
      for (let k = 0; k < this.no; ++k) {
        result[p++] = this.hoWeights[j][k];
      }
    }

    for (let k = 0; k < this.no; ++k) {
      result[p++] = this.oBiases[k];
    }
    return result;
  } // getWeights()

  shuffle(v)
  {
    // Fisher-Yates
    let n = v.length;
    for (let i = 0; i < n; ++i) {
      let r = this.rnd.nextInt(i, n);
      let tmp = v[r];
      v[r] = v[i];
      v[i] = tmp;
    }
  }

  train(trainX, trainY, lrnRate, maxEpochs)
  {
    // regression: no output activation => f(x)=x => f'(x)=1 
    let hoGrads = U.matMake(this.nh, this.no, 0.0);
    let obGrads = U.vecMake(this.no, 0.0);
    let ihGrads = U.matMake(this.ni, this.nh, 0.0);
    let hbGrads = U.vecMake(this.nh, 0.0);

    let oSignals = U.vecMake(this.no, 0.0);
    let hSignals = U.vecMake(this.nh, 0.0);

    let n = trainX.length;  // 406
    let indices = U.arange(n);  // [0,1,..,405]
    let freq = Math.trunc(maxEpochs / 10);
    
    for (let epoch = 0; epoch < maxEpochs; ++epoch) {
      this.shuffle(indices);  //
      for (let ii = 0; ii < n; ++ii) {  // each item
        let idx = indices[ii];
        let X = trainX[idx];
        let Y = trainY[idx];
        this.eval(X);  // output stored in this.oNodes

        // compute output node signals
        for (let k = 0; k < this.no; ++k) {
          // let derivative = (1 - this.oNodes[k]) * this.oNodes[k];  // softmax
          let derivative = 1;  // identity activation
          oSignals[k] = derivative * (this.oNodes[k] - Y[k]);  // E=(t-o)^2 
        }      

        // compute hidden-to-output weight gradients using output signals
        for (let j = 0; j < this.nh; ++j) {
          for (let k = 0; k < this.no; ++k) {
            hoGrads[j][k] = oSignals[k] * this.hNodes[j];
          }
        }

        // compute output node bias gradients using output signals
        for (let k = 0; k < this.no; ++k) {
          obGrads[k] = oSignals[k] * 1.0;  // 1.0 dummy input can be dropped
        }

        // compute hidden node signals
        for (let j = 0; j < this.nh; ++j) {
          let sum = 0.0;
          for (let k = 0; k < this.no; ++k) {
            sum += oSignals[k] * this.hoWeights[j][k];
          }
          let derivative = (1 - this.hNodes[j]) * (1 + this.hNodes[j]);  // tanh
          hSignals[j] = derivative * sum;
        }

        // compute input-to-hidden weight gradients using hidden signals
        for (let i = 0; i < this.ni; ++i) {
          for (let j = 0; j < this.nh; ++j) {
            ihGrads[i][j] = hSignals[j] * this.iNodes[i];
          }
        }

        // compute hidden node bias gradients using hidden signals
        for (let j = 0; j < this.nh; ++j) {
          hbGrads[j] = hSignals[j] * 1.0;  // 1.0 dummy input can be dropped
        }

        // update input-to-hidden weights
        for (let i = 0; i < this.ni; ++i) {
          for (let j = 0; j < this.nh; ++j) {
            let delta = -1.0 * lrnRate * ihGrads[i][j];
            this.ihWeights[i][j] += delta;
          }
        }

        // update hidden node biases
        for (let j = 0; j < this.nh; ++j) {
          let delta = -1.0 * lrnRate * hbGrads[j];
          this.hBiases[j] += delta;
        }  

        // update hidden-to-output weights
        for (let j = 0; j < this.nh; ++j) {
          for (let k = 0; k < this.no; ++k) { 
            let delta = -1.0 * lrnRate * hoGrads[j][k];
            this.hoWeights[j][k] += delta;
          }
        }

        // update output node biases
        for (let k = 0; k < this.no; ++k) {
          let delta = -1.0 * lrnRate * obGrads[k];
          this.oBiases[k] += delta;
        }
      } // ii

      if (epoch % freq == 0) {
        let mse = this.meanSqErr(trainX, trainY).toFixed(4);
        let acc = this.accuracy(trainX, trainY, 0.15).toFixed(4);

        let s1 = "epoch: " + epoch.toString();
        let s2 = " MSE = " + mse.toString();
        let s3 = " acc = " + acc.toString();

        console.log(s1 + s2 + s3);
      }
      
    } // epoch
  } // train()

  // cross entropy error not applicable to regression problems

  meanSqErr(dataX, dataY)
  {
    let sumSE = 0.0;
    for (let i = 0; i < dataX.length; ++i) {  // each data item
      let X = dataX[i];
      let y = dataY[i];  // target output like [2.3] as matrix
      let oupt = this.eval(X);  // computed like [2.07]

      for (let k = 0; k < this.no; ++k) {
        let err = y[k] - oupt[k];
      }
      let err = y[0] - oupt[0];
      sumSE += err * err;
    }
    return sumSE / dataX.length;
  } 

  accuracy(dataX, dataY, pctClose)
  {
    // correct if predicted is within pctClose of target
    let nc = 0; let nw = 0;
    for (let i = 0; i < dataX.length; ++i) {  // each data item
      let X = dataX[i];
      let y = dataY[i];  // target output 
      let oupt = this.eval(X);  // computed output

      if (Math.abs(oupt[0] - y[0]) < Math.abs(pctClose * y[0])) {
        ++nc;
      }
      else {
        ++nw;
      }
    }
    return nc / (nc + nw);
  }
  saveWeights(fn)
  {
    let wts = this.getWeights();
    let n = wts.length;
    let s = "";
    for (let i = 0; i < n-1; ++i) {
      s += wts[i].toString() + ",";
    }
    s += wts[n-1];

    FS.writeFileSync(fn, s);
  }

  loadWeights(fn)
  {
    let n = (this.ni * this.nh) + this.nh + (this.nh * this.no) + this.no;
    let wts = U.vecMake(n, 0.0);
    //let all = FS.readFileSync(fn, "utf8");
    let all = fn.toString("utf8");
    let strVals = all.split(",");
    let nn = strVals.length;
    if (n != nn) {
      throw("Size error in NeuralNet.loadWeights()");
    }
    for (let i = 0; i < n; ++i) {
      wts[i] = parseFloat(strVals[i]);
    }
    this.setWeights(wts);
  }


}

function Dashboard() {
  const [countries3, setCountries3] = useState([]);
  const [global, setGlobal] = useState([]);
  const [states, setEstado] = useState([]);
  const [historic, setHistoric] = useState([]);
  const [calc, setCalcs] = useState([]);
  useEffect(() => {
    async function loadCountries() {
      const response3 = await UserService.get("/countries");
      setCountries3(response3.data);
    }
    async function loadGlobal() {
      const response2 = await UserService.get("/global");
      setGlobal(response2.data);
    }
    async function loadStates() {
      const response = await UserService.get("/states");
      setEstado(response.data);
    }
    async function loadHistoric() {
      const response4 = await UserService.get("/historic");
      setHistoric(response4.data);
    }
    async function loadCalcs() {
      const respostacalculo = await UserService.get("/calcs");
      setCalcs(respostacalculo.data);
    }
    loadGlobal();
    loadCountries();
    loadStates();
    loadHistoric();
    loadCalcs();
  }, []);
  const data = {
    columns: [
      {
        label: "País",
        field: "Country",
      },
      {
        label: "Sigla",
        field: "CountryCode",
      },
      {
        label: "Novos Casos",
        field: "NewConfirmed",
      },
      {
        label: "Casos Confirmados",
        field: "TotalConfirmed",
      },
      {
        label: "Novos Óbitos",
        field: "NewDeaths",
      },
      {
        label: "Total Óbitos",
        field: "TotalDeaths",
      },
      {
        label: "Novos Recuperados",
        field: "NewRecovered",
      },
      {
        label: "Total Recuperados",
        field: "TotalRecovered",
      },
      {
        label: "Data",
        field: "Date",
      },
    ],
    rows: countries3,
  };
  const data2 = {
    columns: [
      {
        label: "Sigla",
        field: "uf",
      },
      {
        label: "Estado",
        field: "state",
      },
      {
        label: "Casos",
        field: "cases",
      },
      {
        label: "Mortes",
        field: "deaths",
      },
      {
        label: "Suspeitos",
        field: "suspects",
      },
      {
        label: "Descartados",
        field: "refuses",
      },
      {
        label: "Data",
        field: "datetime",
      },
    ],
    rows: states,
  };




  let x = [];
  states.map((s) => x.push(s.state));
  console.log(x);
  let y = [];
  states.map((s) => y.push(s.cases));
  const grafico_pie = {
    labels: x,
    datasets: [
      {
        label: '# of Votes',
        data: y,
        backgroundColor: [
          'rgba(255, 99, 132,0.9)',
          'rgba(255, 99, 132,0.9)',
          'rgba(255, 99, 132,0.9)',
          'rgba(255, 99, 132,0.9)',
          'rgba(255, 99, 132,0.9)',
          'rgba(255, 99, 132,0.9)',
          'rgba(255, 99, 132,0.9)',
          'rgba(54, 162, 235,0.9)',
          'rgba(54, 162, 235,0.9)',
          'rgba(54, 162, 235,0.9)',
          'rgba(54, 162, 235,0.9)',
          'rgba(54, 162, 235,0.9)',
          'rgba(54, 162, 235,0.9)',
          'rgba(54, 162, 235,0.9)',
          'rgba(54, 162, 235,0.9)',
          'rgba(54, 162, 235,0.9)',
          'rgba(255, 206, 86,0.9)',
          'rgba(255, 206, 86,0.9)',
          'rgba(255, 206, 86,0.9)',
          'rgba(255, 206, 86,0.9)',
          'rgba(75, 192, 192,0.9)',
          'rgba(75, 192, 192,0.9)',
          'rgba(75, 192, 192,0.9)',
          'rgba(153, 102, 255,0.9)',
          'rgba(153, 102, 255,0.9)',
          'rgba(153, 102, 255,0.9)',
          'rgba(153, 102, 255,0.9)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(153, 102, 255)',
        ],
        borderWidth: 1,
      },
    ],
  }
  const datagrafico1 = {
    labels: x,
    datasets: [
      {
        data: y,
        backgroundColor: "blue",
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        label: "Quantidade de casos.",
      },
    ],
  };
  let x2 = [];
  states.map((s) => x2.push(s.state));
  let y2 = [];
  states.map((s) => y2.push(s.deaths));
  const datagrafico2 = {
    labels: x2,
    datasets: [
      {
        data: y2,
        backgroundColor: "red",
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        label: "Quantidade de mortos.",
      },
    ],
  };
  let x3 = [];
  historic.map((s) => x3.push(s.Date));
  let y3 = [];
  historic.map((s) => y3.push(s.Active));
  y3[410] = 988487;
  const datagrafico3 = {
    labels: x3,
    datasets: [
      {
        data: y3,
        backgroundColor: "orange",
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        label: "Quantidade ativos do Brasil.",
      },
    ],
  };

  let seed = 0;
  let nn = new NeuralNet(1, 100, 1, seed);
  let w = [-0.0016503781131379574,0.007428344365616786,-0.005490749365217592,0.0026483564472594492,-0.006367397653306766,0.007013981064738953,0.006809145833142964,0.0015686736710283007,0.0004244090613802746,0.005364394364570402,-0.010124938488794887,0.002491563995341543,-0.002170997879648229,0.007506554854669257,-0.005450328899105041,-0.0013108383941523136,0.005465291446033248,0.004083904136103984,-0.00696372792632645,-0.0006456317171675408,-0.0006688613784648229,0.0005879630490877545,-0.0016632842010467813,0.005407934308190174,0.0030446222492092785,0.0037275663271123765,-0.01096515458061118,-0.007976836022842156,-0.006783356623258492,0.0038382735348276463,0.009823014965876148,-0.006438486772996079,0.002785282590819547,-0.00185914210030818,0.002013237593946356,0.0008875840514612587,-0.004495343204474289,0.00900552013548531,0.010052155422269332,0.007459640179532332,0.0019377997970802035,0.006528504154417442,-0.0022814595469080527,0.0008801773925652786,0.009155389595804295,0.0035015101069647797,-0.006251789455123942,-0.007574375949256247,-0.004422180893971696,0.006581152547012735,0.0010328560725355075,0.00489435559940618,0.002980641515441954,0.0004009098637321488,0.0030759899318597954,0.003234593033361317,0.0013466691096884356,0.008506760952457313,0.003299376671661945,-0.009755321538666427,0.0018428209915876226,-0.006067112113071791,0.004174661637184426,-0.007014367564597365,0.0034217723182615742,0.009460315271183338,-0.003929371996965968,-0.006348398200798351,-0.00041620760095533,0.00024215320860335163,-0.006006627287397105,0.00723921076117535,-0.0035398466631436634,-0.0039055157862838193,-0.006950743571393827,-0.0030492053724091423,-0.005680419353325124,-0.006886371205333235,-0.001470614036537321,-0.0010157081029347034,0.0037292552758412937,0.009980494083167594,-0.00043857290855767227,0.009373394748410388,-0.002115310993811973,-0.006863702185512443,-0.008049761892101907,-0.00046067060630973846,-0.0051458895407643975,0.010423697074689,0.009855250164132256,0.0025470382553804934,-0.0034712761607954366,-0.0010568256166672767,-0.001642185094647541,-0.0007464868020480604,0.00804844290116998,-0.009534945431355307,0.00047218884377261814,-0.0035652223922472415,-0.00015208743035094842,0.0010319501744794192,-0.0006115370970655705,0.0009208121219356089,0.0006464265897107397,0.0010256031799301558,0.0006825696137207434,-0.0007860791459185602,-0.0005303503379737593,-0.0007561612318716892,-0.0007516527359046654,-0.00046777491422637447,0.0003876292479014814,0.0005219164993444333,0.0009769319636812452,-0.0008420965504844789,-0.0008502556669052559,-0.0007811521038880098,0.00007447968283087437,-0.00008888218374441657,0.0008181853343945445,-0.000030115521665351316,0.00023123795378296956,0.0007881061281191853,-0.0006454454540342138,0.0002385939299488636,-0.0014037891553749804,0.0003390727348592082,0.00038964055700169354,0.00017144898593555256,0.0009256832560961329,-0.0004633578571269699,0.0004261976955425862,0.00017926381934389702,-0.000896559743058786,-0.0011181699479358748,0.00028373189790616274,0.001298116831635499,0.0013276070862833303,-0.0005835412271011067,-0.0003216829021102684,0.0012658020737761906,0.0005782436130434479,-0.0005388611133354445,-0.00032111483368647126,0.0009054842511056634,0.0006703294581893385,0.00039134891543518634,0.0008637447497783353,0.0008691787391069453,-0.0005789013932600353,0.00013678962780480807,0.00040798658893107485,-0.00022884075057318055,0.001201351142023048,-0.0008526701249980402,0.0002447485125455987,-0.0006563375666556055,-0.000050729665520406696,-0.0001596079907663297,0.0007433449570606194,-0.0004701955449122592,0.0006541250503848845,-0.0004949861436096131,-0.0006375021053840065,0.00037057822835760517,0.000789990023730188,-0.00030105169396202146,0.000484800332684904,-0.0010868172884111085,-0.0011018706119736823,-0.0007210338940782927,-0.0004770784521091818,0.00006440052632467821,0.00008673512961964298,0.000391055680984465,0.0005023575112439251,-0.00024249797671405278,-0.000289066142674947,-0.00047731113480640726,0.0009354589957461148,0.0006022021631536351,-0.0001748925740841866,0.0008793525846969621,0.0006485749793928031,-0.00040159906816670735,-0.0006778162184133001,-0.00023043682164145947,0.0005808922180674033,0.0012587100071167322,0.001113509411673179,0.00022749504974659676,0.0006421118754790099,0.00011205421314469548,0.000022930579167407974,-0.0007005365524979093,-0.00014470378479473754,-0.0009534497438411642,0.0010705623501900618,-0.00011915769631155423,-0.0011859281341773647,0.008353014715297046,-0.004861937986719564,0.00778218265294574,0.006137923815961498,0.008332027830945249,0.005370665635167061,-0.006959161300022852,-0.004643042192955312,-0.007009937689487956,-0.005699648581936152,-0.004269045523967355,0.003546346986568976,0.003918649319737183,0.008935552289753053,-0.007208740867422586,-0.007835869584466472,-0.007122596137687961,0.0012169925107869094,-0.0007192653788539482,0.007164119312088487,-0.0003099581022826308,0.002145786316567266,0.0064021435058486025,-0.005858247911461472,0.0017670497361672748,-0.011288118587363517,0.003597742011417777,0.003940417119029464,0.0011746420405033553,0.0072344442786895875,-0.003497396767553542,0.0034742210225900167,0.001710252946635473,-0.007955715089070042,-0.009788663874670608,0.0028338617965929054,0.010532897650452702,0.01070252240743536,-0.005680010667946732,-0.0029541965087492247,0.010457096693935308,0.00521172163060081,-0.004754452775920644,-0.0035367939995446128,0.007578631914745898,0.0063362461012912204,0.004019369339541117,0.007867995559531382,0.00700963872739207,-0.0051149127435590825,0.0007870733976451276,0.003299959993612477,-0.0020213110973887768,0.010183466577341902,-0.00767456499135061,0.0020159659312200813,-0.006397091024971083,-0.0007115286572620021,-0.0005900992497497239,0.006306983990187986,-0.0035871645442634194,0.005339957755805049,-0.0037249930367337656,-0.005820113292342535,0.00244574279433224,0.007186760053842244,-0.0020951074785213763,0.0042465877895167805,-0.009462998640973372,-0.00907718376294988,-0.00685693661558619,-0.003854237155041717,0.0008799428667549904,0.0013224014745983012,0.00364810719273288,0.004830169328051658,-0.0015426515604379939,-0.0023908377666326548,-0.00406378239581356,0.007820177335100546,0.004414296348652685,-0.0014836042844375936,0.0068691071348238,0.005809229437299818,-0.0029262991202439062,-0.005227882578122094,-0.00196440363324179,0.005469054406505644,0.010074424331824334,0.00886148031729672,0.0017674819637447155,0.005864223791168925,0.0010604178880156223,0.00033408260637279185,-0.006025384927790857,-0.0019149892343891584,-0.007498917939353531,0.00926279359067335,-0.0007427187451047067,0.11418894992650228];
  nn.setWeights(w);
  let predValores = [];
  for (let i = 17; i < 32; ++i) {
    let unknownNorm = [i];
    let predicted = nn.eval(unknownNorm);
    let predValor = predicted[0] * 100000000;
    predValores[i-17] = predValor;
  }
  let x4 = [];
  historic.map((s) => x4.push(s.Date));

  let y4 = [];
  
  historic.map((s) => y4.push(s.Confirmed));
  for (let i = 0; i < 15; ++i){
    x4.push(i+1);
    y4.push(predValores[i].toFixed(0));
  }
  
  
  
  const datagrafico4 = {
    labels: x4,
    datasets: [
      {
        data: y4,
        backgroundColor: "yellow",
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        label: "Quantidade de confirmados do Brasil.",
      },
    ],
  };

  w = [-0.0019270265178154664,0.009406220256556934,-0.006631032795793956,0.004350607460398118,-0.005186159821835048,0.008971806852701342,0.008097079838319324,0.0001340589611725652,-0.0005431046850140648,0.003984673386205191,-0.011596864754138882,0.0016382278400641143,-0.0014637614698978583,0.00849401647692938,-0.003669410791859026,-0.002857398961448144,0.003914551800507475,0.002659466501060109,-0.006829272406338648,-0.00080720386741356,0.0008263922155130759,0.0005327563393053032,-0.0012411210582612177,0.006883086707388541,0.0018675297278163742,0.004164547382426389,-0.013804303983106872,-0.007356327309071416,-0.006069830718478156,0.004151830340742798,0.011637255504259064,-0.007305756099002378,0.003566267744322453,-0.0015315043097681971,0.0003767634352553178,-0.00116146399698821,-0.003975852228674162,0.011558277395970599,0.01269822410972077,0.006391954106834439,0.0013507759134270627,0.008953600736876404,-0.0012269548820157724,-0.00010264951731763139,0.00856943472938865,0.00518182510107398,-0.005027210167393057,-0.006857767489486719,-0.0028473575830072484,0.008226365623834142,-0.00002308263501281617,0.0051458376018435345,0.0037284814410466463,-0.00001620661161114191,0.005316283114204425,0.0016797518579332441,0.001792622019879091,0.007305712103451748,0.003205480318343231,-0.010071979528947134,0.003208147903689239,-0.00694470055573521,0.00538588331368277,-0.007946056356829271,0.0022590177845110337,0.010177487813152628,-0.0024888813561447154,-0.006909962857221283,0.0004680079401535499,-0.0017519944376263232,-0.008097062641687622,0.005921505237758329,-0.0044173232464274565,-0.0037866437718141947,-0.006793628987317605,-0.002335180794321409,-0.0047618647359473675,-0.0073410236912255546,-0.001997698324307604,-0.0018874566615149659,0.005468562205177001,0.011154408780820028,-0.0007570293450971606,0.011085334753331143,-0.0009325286232729392,-0.00761734887833487,-0.0093435012032805,-0.0008804407218797667,-0.004084900782837233,0.012937363087333216,0.01205181031266963,0.0029620717374568154,-0.0023001103373644916,-0.0008520908777945034,-0.0015994944626017847,-0.002028571892981061,0.007786465890341631,-0.011398774640601456,0.002440259442295516,-0.0037824093589868485,-0.0005646369007890631,0.0034883677962768127,-0.0021660292846158655,0.002744864204031387,0.0011692465879954421,0.0034328035682829705,0.0024806332953273215,-0.0019902389883650704,-0.0014010335924658749,-0.0015594558329677603,-0.002974515437077944,-0.0010409785275874298,0.0008528644089908939,0.0021081395852350403,0.002150808090915449,-0.0024076383714381634,-0.0018055670508686714,-0.0017452333244488592,-0.0004380776042883477,-0.00030066556530224103,0.00216031336898348,-0.000027725921597997792,0.00047494136388022136,0.0026384353671591878,-0.0014724750054204252,0.0009905326621180224,-0.004829558340603723,0.000186923727410217,0.0004340325652741207,0.000818367840155355,0.0034203546222614,-0.001850591680909798,0.0014134039667927504,0.0003158269745311199,-0.0022493622562171677,-0.0029552413315955574,0.0003570553335216123,0.004359482190867467,0.004536943845631198,-0.0008979978347270749,-0.0006952623236081483,0.004042029524011711,0.0013602402242346519,-0.001382218876444332,-0.000029655781546338883,0.002781847467012142,0.0012447650347735,0.0003658558753335704,0.0019383016192794486,0.002967154317062592,-0.0014769056351303894,0.0008213714657314182,0.0013819088239993072,-0.0005844786865052733,0.0035473495156779816,-0.0020176452958028212,0.0007883260377555403,-0.000999062079519565,0.00016554017749526495,-0.0013308148330044328,0.0021882858191619677,-0.0018349741844736489,0.0021605638049799025,-0.0019895916930199003,-0.001416197231797256,0.0018768575343376204,0.0017834600756511,-0.0014013031640102173,0.0012780909461207516,-0.002929575151825627,-0.0035473501252718865,-0.0012914102449657862,-0.0016210443455642962,-0.00018415183060461102,-0.0004036095216658546,0.0007814052273446253,0.0008414739440386448,-0.00129176131534845,-0.0009200657945904997,-0.0013894587675794985,0.0028843583760646244,0.0025545810580602196,-0.0005151664808192148,0.0032526598165976825,0.0015665001180031374,-0.0017219254205165463,-0.002582106093692016,-0.0006680140941570338,0.0011038363178954257,0.004383476871998372,0.003934975599703008,0.0008518355423822927,0.001424156149754262,0.00020710024291939114,-0.00008867916952539848,-0.001971032296200516,0.00034726208830012517,-0.0034693316708012596,0.0029512889120801634,-0.0006512624905074707,-0.0016430564728362569,0.010578308835416715,-0.006434523193615992,0.008854450898925422,0.004997656285746171,0.010458853625652423,0.007282375194314353,-0.006995489969108116,-0.004813678263010071,-0.006157049932442734,-0.008411716577172731,-0.003932176369052045,0.0032427177519034193,0.005911850217079808,0.008174779044983009,-0.007934765288258476,-0.007007445861862713,-0.006577600467767107,-0.0003515788127565573,-0.0009129882258303644,0.007423411532052581,-0.00018980253453393554,0.0018798634941580184,0.008043100761703208,-0.00548395436896376,0.002746455446521875,-0.014505830037341691,0.0019286715378552927,0.002573395719904854,0.002145695171562512,0.009961032131578826,-0.005214805276726768,0.004331018398882254,0.001372870519370413,-0.007945414048050404,-0.010147666556305465,0.0019416892035300796,0.013248854981596284,0.013673706473995144,-0.004255085827470647,-0.0026708707677305012,0.012588137075809637,0.00497915681797336,-0.004824512212512817,-0.0015851888093396838,0.008839233279652112,0.005234849675513162,0.0024701069948870266,0.007286866911214405,0.008960566694437204,-0.005170054503445766,0.001984220409405037,0.004192581922800957,-0.002044907192753764,0.011491761815315353,-0.007361272997269442,0.0024500124883558537,-0.004766619408135236,0.00002291049036710247,-0.0029236371433979556,0.0071059444471323905,-0.0052222763124503135,0.006630657037861435,-0.005591116217304264,-0.005354927053528395,0.004816076245365904,0.006681835285534143,-0.003710565788349933,0.004396117624509962,-0.009954433150457404,-0.011009348951605531,-0.005553026686053965,-0.004910322003129593,0.000012653841521546898,-0.0002369665394809092,0.0031438738495055793,0.0037753987806937858,-0.003253051891746635,-0.0028758196659654416,-0.0045390280748243295,0.00914787876021365,0.007019750726865013,-0.001673197252664753,0.009469272702864805,0.005650464658625028,-0.004711091173769201,-0.007423634796296661,-0.0021871989072645803,0.004577603814454348,0.013098953099150351,0.011685727205767412,0.002469268296327105,0.0053899674949329035,0.0008737911251869987,-0.00003254113942553683,-0.0065509369996206036,-0.00013076254597369803,-0.010172288582290037,0.009909974337040316,-0.001624410821486941,0.2762448118216205];
  nn.setWeights(w);
  let predValores2 = [];
  for (let i = 17; i < 32; ++i) {
    let unknownNorm = [i];
    let predicted = nn.eval(unknownNorm);
    let predValor = predicted[0] * 1000000;
    predValores2[i-17] = predValor;
  }
  let x5 = [];
  historic.map((s) => x5.push(s.Date));
  let y5 = [];
  historic.map((s) => y5.push(s.Deaths));
  for (let i = 0; i < 15; ++i){
    x5.push(i+1);
    y5.push(predValores2[i].toFixed(0));
  }
  const datagrafico5 = {
    labels: x5,
    datasets: [
      {
        data: y5,
        backgroundColor: "red",
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        label: "Quantidade de mortos do Brasil.",
      },
    ],
  };
  let x6 = [];
  historic.map((s) => x6.push(s.Date));
  let y6 = [];
  historic.map((s) => y6.push(s.Confirmed));
  const datagrafico6 = {
    labels: x6,
    datasets: [
      {
        data: y6,
        backgroundColor: "rgba(75, 192, 192,0.9)",
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        label: "Quantidade de recuperados do Brasil.",
      },
    ],
  };
  return (
    <div className="App" style={{ backgroundColor: "rgb(106,212,178,0.1)" }}>
      <Header />
      <section>
        <div style={{ "padding-bottom": "50px" }}>
          <Row style={{ alignContent: "center" }}>
            <Col>
              <Card
                style={{
                  height: "20rem",
                  width: "15rem",
                  backgroundColor: "#6AD4B2",
                  "border-radius": "30px",
                }}
              >
                <Card.Body>
                  <Card.Title
                    style={{
                      color: "white",
                      fontSize: "20px",
                      fontWeight: 600,
                      height: "4rem",
                      fontFamily: "Roboto",
                    }}
                  >
                    Casos Recuperados{" "}
                  </Card.Title>
                  <FontAwesomeIcon
                    icon={faHeartbeat}
                    size="3x"
                    style={{ color: "#363636" }}
                  />
                  <Card.Text style={{ color: "white" }}>
                    <Row>
                      <Col>
                        Total
                        {countries3.map((item) =>
                        item.Country === "Brazil" ? (
                          <h1
                            className="Brazil"
                            style={{
                              fontSize: "20px",
                              fontWeight: "700",
                              fontFamili: "Roboto",
                            }}
                          >

                            {Intl.NumberFormat('pt-BR').format(item.TotalRecovered)}
                          </h1>
                        ) : (
                            <div className="Brazil">{item.title}</div>
                          )
                      )}
                      </Col>
                      <Col>
                        Novos
                        {countries3.map((item) =>
                        item.Country === "Brazil" ? (
                          <h1
                            className="Brazil"
                            style={{
                              fontSize: "20px",
                              fontWeight: "700",
                              fontFamili: "Roboto",
                            }}
                          >
                            {Intl.NumberFormat('pt-BR').format(item.NewRecovered)}
                          </h1>
                        ) : (
                            <div className="Brazil">{item.title}</div>
                          )
                      )}
                      </Col>
                    </Row>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card
                style={{
                  height: "20rem",
                  width: "15rem",
                  "border-radius": "30px",
                }}
              >
                <Card.Body>
                  <Card.Title
                    style={{
                      color: "#363636",
                      fontSize: "20px",
                      height: "3rem",
                      fontFamily: "Roboto",
                      fontWeight: "500",
                    }}
                  >
                    Casos Confirmados{" "}
                  </Card.Title>
                  <FontAwesomeIcon
                    icon={faHeadSideMask}
                    size="2x"
                    style={{ color: "#363636" }}
                  />
                  <Card.Text>
                    <Row>
                      <Col>
                        Acumulados
                        {countries3.map((item) =>
                        item.Country === "Brazil" ? (
                          <h1
                            className="Brazil"
                            style={{
                              fontSize: "20px",
                              fontWeight: "700",
                              fontFamili: "Roboto",
                            }}
                          >
                            {Intl.NumberFormat('pt-BR').format(item.TotalConfirmed)}
                          </h1>
                        ) : (
                            <div className="Brazil">{item.title}</div>
                          )
                      )}
                      </Col>
                      <Col>
                        Novos Casos
                        {countries3.map((item) =>
                        item.Country === "Brazil" ? (
                          <h1
                            className="Brazil"
                            style={{
                              fontSize: "20px",
                              fontWeight: "700",
                              fontFamili: "Roboto",
                            }}
                          >
                            {Intl.NumberFormat('pt-BR').format(item.NewConfirmed)}
                          </h1>
                        ) : (
                            <div className="Brazil">{item.title}</div>
                          )
                      )}
                      </Col>
                      <Col>
                        Incidência*
                        {calc.map((item) =>
                        (
                          <h1
                            className="Brazil"
                            style={{
                              fontSize: "20px",
                              fontWeight: "700",
                              fontFamili: "Roboto",
                            }}
                          >
                            {Intl.NumberFormat('pt-BR').format(item.incidencia)}
                          </h1>
                        ) 
                      )}
                      </Col>
                    </Row>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card
                style={{
                  height: "20rem",
                  width: "15rem",
                  "border-radius": "30px",
                }}
              >
                <Card.Body>
                  <Card.Title
                    style={{
                      color: "#363636",
                      fontSize: "20px",
                      height: "3rem",
                      fontFamily: "Roboto",
                      fontWeight: "500",
                    }}
                  >
                    Óbitos Confirmados
                  </Card.Title>
                  <FontAwesomeIcon
                    icon={faLungsVirus}
                    size="2x"
                    style={{ color: "#363636" }}
                  />
                  <Card.Text>
                    <Row>
                      <Col>
                        Acumulados
                        {countries3.map((item) =>
                        item.Country === "Brazil" ? (
                          <h1
                            className="Brazil"
                            style={{
                              fontSize: "20px",
                              fontWeight: "700",
                              fontFamili: "Roboto",
                            }}
                          >
                            {Intl.NumberFormat('pt-BR').format(item.TotalDeaths)}
                          </h1>
                        ) : (
                            <div className="Brazil">{item.title}</div>
                          )
                      )}
                      </Col>
                      <Col>
                        Novos Casos
                        {countries3.map((item) =>
                        item.Country === "Brazil" ? (
                          
                          <h1
                            className="Brazil"
                            style={{
                              fontSize: "20px",
                              fontWeight: "700",
                              fontFamili: "Roboto",
                            }}
                          >
                            {Intl.NumberFormat('pt-BR').format(item.NewDeaths)}
                          </h1> 
                        ) : (
                            <div className="Brazil">{item.title}</div>
                          )
                      )}
                      </Col>
                      <Col>
                        Mortalidade*
                        {calc.map((item) =>
                        (
                          
                          <h1
                            className="Brazil"
                            style={{
                              fontSize: "20px",
                              fontWeight: "700",
                              fontFamili: "Roboto",
                            }}
                          >
                            {Intl.NumberFormat('pt-BR').format(item.mortalidade)}
                          </h1>  
                        ) 
                      )}
                      </Col>
                      <Col>
                        Letalidade
                        {calc.map((item) =>
                        (
                          <h1
                            className="Brazil"
                            style={{
                              fontSize: "20px",
                              fontWeight: "700",
                              fontFamili: "Roboto",
                            }}
                          >
                            {Intl.NumberFormat('pt-BR').format(item.letalidade)}%
                          </h1>
                        ) 
                      )}
                      </Col>
                    </Row>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card
                style={{
                  height: "20rem",
                  width: "15rem",
                  "border-radius": "30px",
                }}
              >
                <Card.Body>
                  <Card.Title
                    style={{
                      color: "#363636",
                      fontSize: "20px",
                      height: "3rem",
                      fontFamily: "Roboto",
                      fontWeight: "500",
                    }}
                  >
                    Custo UTI (óbitos)
                  </Card.Title>
                  <FontAwesomeIcon
                    icon={faLungsVirus}
                    size="2x"
                    style={{ color: "#363636" }}
                  />
                  <Card.Text>
                    <Row>
                      <Col>
                        
                        {calc.map((item) =>
                        (
                          <h1
                            className="Brazil"
                            style={{
                              paddingTop: "50px",
                              fontSize: "20px",
                              fontWeight: "700",
                              fontFamili: "Roboto",
                            }}
                          >
                            R$ {Intl.NumberFormat('pt-BR').format(item.custoUti)},00 
                          </h1>
                        ) 
                      )}
                      </Col>
                    </Row>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </section>
      <Maps/>
      <div className="w-100 ">
        <Row
          className="w-100 p-3 d-flex flex-row"
          style={{ paddingTop: "50px", background: "#f0fbf7" }}
        >
          <Col>
            <div className='header'>
              <h1 className='title' style={{ textAlign: "left", fontSize: "28px", fontFamily: "Roboto", fontWeight: "800" }}>Casos para cada estado do brasil.</h1>
              <div className='links'>
                <a
                  className='btn btn-gh'
                  href='https://github.com/reactchartjs/react-chartjs-2/blob/react16/example/src/charts/Pie.js'
                >
                </a>
              </div>
            </div>
            <Pie data={grafico_pie} />
          </Col>
          <Col>
            <h3
              style={{
                textAlign: "left",
                fontSize: "28px",
                fontFamily: "Roboto",
                fontWeight: "800",
              }}
            >
              Mortes para cada estado do brasil.
            </h3>
            <Bar data={datagrafico2} width={100} height={50} options={{}} />
          </Col>
        </Row>

        <br />
        <br />
        <br />
        <Row
          className="w-100 p-3 d-flex flex-row"
          style={{ paddingTop: "50px", background: "#f0fbf7" }}
        >
          <Col>
            <h3
              style={{
                textAlign: "left",
                fontSize: "25px",
                fontFamily: "Roboto",
                fontWeight: "800",
              }}
            >
              Total de ativos do Brasil.
            </h3>
            <Bar data={datagrafico3} width={100} height={50} options={{}} />
          </Col>
          <Col>
            <h3
              style={{
                textAlign: "left",
                fontSize: "25px",
                fontFamily: "Roboto",
                fontWeight: "800",
              }}
            >
              Total de confirmados Brasil.
            </h3>
            <Bar data={datagrafico4} width={100} height={50} options={{}} />
          </Col>
        </Row>
        <br />
        <br />
        <Row
          className="w-100 p-3 d-flex flex-row"
          style={{ paddingTop: "50px", background: "#f0fbf7" }}
        >
          <Col>
            <h3
              style={{
                textAlign: "left",
                fontSize: "25px",
                fontFamily: "Roboto",
                fontWeight: "800",
              }}
            >
              Total de mortos Brasil.
            </h3>
            <Bar data={datagrafico5} width={100} height={50} options={{}} />
          </Col>
          <Col>
            <h3
              style={{
                textAlign: "left",
                fontSize: "25px",
                fontFamily: "Roboto",
                fontWeight: "800",
              }}
            >
              Total de recuperados Brasil.
            </h3>
            <Bar data={datagrafico6} width={100} height={50} options={{}} />
          </Col>
        </Row>
      </div>
      {/* <Mapa /> */}

      <section>
        <div class="container">
          <div class="tabela1" id="tabela_1_id">
            <div
              className="w-100 p-3 d-flex flex-column align-items-center"
              style={{ backgroundColor: "#f0fbf7", display: "flex" }}
            >
              <h3 style={{ marginTop: "20px", fontWeight: "bold" }}>
                Síntese Covid-19 no mundo
              </h3>
              <MDBDataTable
                entries={5}
                className="w-100 p-3"
                striped
                hover
                data={data}
                style={{ fontWeight: "bold", "font-size": "10px" }}
              />
            </div>
          </div>
          <div class="tabela2" id="tabela_2_id">
            <div
              className="w-100 p-3 d-flex flex-column align-items-center"
              style={{ backgroundColor: "#f0fbf7", display: "flex" }}
            >
              <h3 style={{ marginTop: "20px", fontWeight: "bold" }}>
                Síntese Covid-19 no Brasil
              </h3>
              <MDBDataTable
                entries={5}
                className="w-75 p-3"
                striped
                style={{ fontWeight: "bold", "font-size": "10px" }}
                hover
                data={data2}
              />
            </div>
          </div>
        </div>
      </section>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path
          fill="#00cba9"
          fill-opacity="0.5"
          d="M0,64L48,80C96,96,192,128,288,133.3C384,139,480,117,576,144C672,171,768,245,864,266.7C960,288,1056,256,1152,213.3C1248,171,1344,117,1392,90.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
    </div>
  );
}

export default Dashboard;
