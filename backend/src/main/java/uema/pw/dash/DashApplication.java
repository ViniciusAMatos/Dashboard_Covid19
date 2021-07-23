package uema.pw.dash;

import java.io.IOException;
import java.net.URL;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import uema.pw.dash.model.Calc;
import uema.pw.dash.model.Countries;
import uema.pw.dash.model.Data;
import uema.pw.dash.model.HistoricCovid;
import uema.pw.dash.model.StateData;
import uema.pw.dash.model.States;
import uema.pw.dash.repository.CalcRepository;
import uema.pw.dash.repository.CountriesRepository;
import uema.pw.dash.repository.GlobalRepository;
import uema.pw.dash.repository.HistoricCovidRepository;
import uema.pw.dash.repository.StateRepository;
import uema.pw.dash.services.CalcService;
import uema.pw.dash.services.CountriesService;

@SpringBootApplication
public class DashApplication {
	Data data;
	StateData states;
	HistoricCovid[] historics;
	@Autowired
	public static void main(String[] args) {
		SpringApplication.run(DashApplication.class);

	}

	@Bean
	CommandLineRunner runner(CountriesRepository countriesRepository, GlobalRepository globalRepository,
			StateRepository stateRepository, HistoricCovidRepository historicCovidRepository, CalcRepository calcRepository, CalcService calcService) {
		
		return args -> {
			ObjectMapper objectMapper = new ObjectMapper();
			try {
				
				data = objectMapper.readValue((new URL("https://api.covid19api.com/summary")), Data.class);

				globalRepository.save(data.getGlobal());

				for (Countries country : data.getCountries()) {
					countriesRepository.save(country);
				}

				states = objectMapper.readValue((new URL("https://covid19-brazil-api.now.sh/api/report/v1")), StateData.class);

				for (States state : states.getStates()) {
					stateRepository.save(state);
				}

				historics = objectMapper.readValue((new URL("https://api.covid19api.com/total/country/brazil")),
						HistoricCovid[].class);

				for (HistoricCovid historic : historics) {
					historicCovidRepository.save(historic);
				}
					
				calcRepository.save(calcService.getCalcs());
	
				calcService.getCalcs();

			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

		};
	}
}