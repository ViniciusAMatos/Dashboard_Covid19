package uema.pw.dash.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import uema.pw.dash.model.Countries;
import uema.pw.dash.services.*;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class CountriesController {

  @Autowired
  CountriesService countriesService;

  @GetMapping("countries")
public List<Countries> getAllCountries() {
    return countriesService.getAllCountries();
  }

  @GetMapping("/countries/{country}")
  private Countries getCountry(@PathVariable("country") String country) {
    for (Countries countries : getAllCountries()) {
      if (countries.getCountry().equals(country)) {
        return countries;
      }
    }
    return null;
  }

}