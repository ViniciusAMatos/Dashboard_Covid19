package uema.pw.dash.model;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
@JsonIgnoreProperties(ignoreUnknown = true)
public class StateData {
    private @JsonProperty("data")  States[] States;
    public States[] getStates() {
        return States;
    }
}