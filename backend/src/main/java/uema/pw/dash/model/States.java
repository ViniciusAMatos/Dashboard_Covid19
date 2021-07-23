package uema.pw.dash.model; 
import javax.persistence.Column;  
import javax.persistence.Entity;  
import javax.persistence.Id;  
import javax.persistence.Table; 
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
@JsonIgnoreProperties (ignoreUnknown = true)
@Entity 
@Table  
public class States{
    @Id
    @Column   
    private @JsonProperty ("uid") int uid;
    @Column  
    private @JsonProperty ("uf") String uf;
    @Column  
    private @JsonProperty ("state") String state;
    @Column  
    private @JsonProperty ("cases") int cases;
    @Column  
    private @JsonProperty ("deaths") int deaths;
    @Column  
    private @JsonProperty ("suspects") int susp;
    @Column  
    private @JsonProperty ("refuses") int ref;
    @Column   
    private @JsonProperty ("datetime") String date;
    public String getUf() {
        return uf;
    }
    public int getCases() {
        return cases;
    }
    public String getDate() {
        return date;
    }
    public int getDeaths() {
        return deaths;
    }
    public int getRef() {
        return ref;
    }
    public String getState() {
        return state;
    }
    public int getSusp() {
        return susp;
    }
    public int getUid() {
        return uid;
    }
    public void setCases(int cases) {
        this.cases = cases;
    }
    public void setDate(String date) {
        this.date = date;
    }
    public void setDeaths(int deaths) {
        this.deaths = deaths;
    }
    public void setRef(int ref) {
        this.ref = ref;
    }
    public void setState(String state) {
        this.state = state;
    }
    public void setSusp(int susp) {
        this.susp = susp;
    }
    public void setUf(String uf) {
        this.uf = uf;
    }
    public void setUid(int uid) {
        this.uid = uid;
    }

}