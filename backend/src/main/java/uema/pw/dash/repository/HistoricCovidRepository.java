package uema.pw.dash.repository;

import org.springframework.data.repository.CrudRepository;

import uema.pw.dash.model.HistoricCovid;

public interface HistoricCovidRepository extends CrudRepository<HistoricCovid, Integer> {

}