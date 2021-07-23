package uema.pw.dash.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import uema.pw.dash.model.HistoricCovid;
import uema.pw.dash.repository.HistoricCovidRepository;

@Service
public class HistoricCovidService {
  @Autowired
  HistoricCovidRepository historicCovidRepository;

  public List<HistoricCovid> getAllHistoric() {
    List<HistoricCovid> historics = new ArrayList<HistoricCovid>();
    historicCovidRepository.findAll().forEach(historic -> historics.add(historic));
    return historics;
  }

}