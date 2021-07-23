package uema.pw.dash.services;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uema.pw.dash.model.Global;
import uema.pw.dash.repository.GlobalRepository;

@Service
public class GlobalService {
  @Autowired
  GlobalRepository globalRepository;

  public Iterable<Global> getAllGlobal() {
    return globalRepository.findAll();
  }

}
