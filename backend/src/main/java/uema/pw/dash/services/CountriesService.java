package uema.pw.dash.services;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uema.pw.dash.model.Countries;
import uema.pw.dash.repository.CountriesRepository;

@Service
public class CountriesService {

    @Autowired
    CountriesRepository countriesRepository;
    public List<Countries> getAllCountries() {
        List<Countries> countries = new ArrayList<Countries>();
        countriesRepository.findAll().forEach(country -> countries.add(country));
        return countries;
    }




}
