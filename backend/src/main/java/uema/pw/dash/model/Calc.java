package uema.pw.dash.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table
public class Calc {
    @Id @GeneratedValue
    int id;
    @Column
    float mortalidade;
    @Column
    float letalidade;
    @Column
    float custoUti;
    @Column
    float incidencia;

    public float getCustoUti() {
        return custoUti;
    }
    public float getIncidencia() {
        return incidencia;
    }
    public float getLetalidade() {
        return letalidade;
    }
    public float getMortalidade() {
        return mortalidade;
    }

   public Calc(){
       super();
   }

   public Calc(float mortalidade, float letalidade, float custoUti, float incidencia) {
       this.mortalidade = mortalidade;
       this.letalidade = letalidade;
       this.custoUti = custoUti;
       this.incidencia = incidencia;
   }

   

   

   

   
}