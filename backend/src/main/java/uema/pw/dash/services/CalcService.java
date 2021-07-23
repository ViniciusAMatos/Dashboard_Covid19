package uema.pw.dash.services;

import uema.pw.dash.controller.CountriesController;
import uema.pw.dash.model.Calc;
import uema.pw.dash.model.Countries;
import uema.pw.dash.repository.CalcRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CalcService {

  @Autowired
  CountriesController countriesController;
  @Autowired
  CalcRepository calcRepository;
    public  Calc getCalcs() {
        for (Countries countries : countriesController.getAllCountries()) {
          if (countries.getCountry().equals("Brazil")) {

            float letalidade = countries.getTotalDeaths();
            letalidade = (letalidade*100)/countries.getTotalConfirmed();

            float mortalidade = countries.getTotalDeaths();
						mortalidade = (mortalidade*100000)/209500000;

            float incidencia  = countries.getTotalConfirmed();
					  incidencia = (incidencia*100000)/209500000;


            float custo = countries.getTotalDeaths();
					  custo = custo*2102;

            Calc calc = new Calc(mortalidade, letalidade, custo, incidencia);

            return calc;
          }
        }
        return null;
      } 
      
    

}