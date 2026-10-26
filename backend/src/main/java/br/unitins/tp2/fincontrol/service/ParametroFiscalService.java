package br.unitins.tp2.fincontrol.service;

import java.util.List;

import br.unitins.tp2.fincontrol.dto.ParametroFiscalRequestDTO;
import br.unitins.tp2.fincontrol.model.ParametroFiscal;
import br.unitins.tp2.fincontrol.model.TipoEmpresa;
import br.unitins.tp2.fincontrol.model.Usuario;

// "autor": SUPER_ADMIN que fez a alteração (vai para "alterado por" e para a auditoria).
public interface ParametroFiscalService {

    List<ParametroFiscal> findAll();

    ParametroFiscal findById(Long id);

    // Vigentes hoje para o tipo de empresa (consulta das empresas, sem auditoria).
    List<ParametroFiscal> findVigentes(TipoEmpresa tipo);

    ParametroFiscal create(ParametroFiscalRequestDTO dto, Usuario autor);

    ParametroFiscal update(Long id, ParametroFiscalRequestDTO dto, Usuario autor);

    ParametroFiscal alterarAtivo(Long id, boolean ativo, Usuario autor);

    void delete(Long id, Usuario autor);
}
