package br.unitins.tp2.fincontrol.repository;

import java.time.LocalDate;
import java.util.List;

import br.unitins.tp2.fincontrol.model.ParametroFiscal;
import br.unitins.tp2.fincontrol.model.TipoEmpresa;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ParametroFiscalRepository implements PanacheRepository<ParametroFiscal> {

    public List<ParametroFiscal> findByChave(String chave) {
        return find("chave = ?1 order by vigenciaInicio desc", chave).list();
    }

    public ParametroFiscal findVigente(String chave, LocalDate data) {
        return find(
                "ativo = true and chave = ?1 and vigenciaInicio <= ?2 and vigenciaFim >= ?2",
                chave,
                data
        ).firstResult();
    }

    // Parâmetros ativos e vigentes na data que valem para o tipo de empresa (ou para todos).
    public List<ParametroFiscal> findVigentes(TipoEmpresa tipo, LocalDate data) {
        return find(
                "ativo = true and vigenciaInicio <= ?1 and vigenciaFim >= ?1"
                        + " and (tipoEmpresa is null or tipoEmpresa = ?2) order by chave",
                data,
                tipo
        ).list();
    }

    public ParametroFiscal findByChaveAndVigenciaInicio(String chave, LocalDate inicio) {
        return find(
                "chave = ?1 and vigenciaInicio = ?2",
                chave,
                inicio
        ).firstResult();
    }
}