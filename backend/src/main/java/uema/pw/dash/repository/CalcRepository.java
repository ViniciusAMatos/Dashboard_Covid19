package uema.pw.dash.repository;

import org.springframework.data.repository.CrudRepository;
import uema.pw.dash.model.Calc;

public interface CalcRepository extends CrudRepository<Calc, Float> {

} 