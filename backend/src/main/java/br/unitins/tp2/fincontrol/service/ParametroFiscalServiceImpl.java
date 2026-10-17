package br.unitins.tp2.fincontrol.service;

import java.time.LocalDate;
import java.util.List;

import br.unitins.tp2.fincontrol.dto.ParametroFiscalRequestDTO;
import br.unitins.tp2.fincontrol.exception.ResourceNotFoundException;
import br.unitins.tp2.fincontrol.model.ParametroFiscal;
import br.unitins.tp2.fincontrol.model.Usuario;
import br.unitins.tp2.fincontrol.repository.ParametroFiscalRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;

// Valores fiscais (tetos, DAS, salário mínimo...) ficam no banco, com vigência, e não no código.
// Desativar tira o parâmetro de uso sem apagar o histórico.
@ApplicationScoped
public class ParametroFiscalServiceImpl implements ParametroFiscalService {

    @Inject
    ParametroFiscalRepository repository;

    @Inject
    AuditoriaService auditoria;

    @Override
    public List<ParametroFiscal> findAll() {
        return repository.find("order by chave asc, vigenciaInicio desc").list();
    }

    @Override
    public ParametroFiscal findById(Long id) {
        ParametroFiscal parametro = repository.findById(id);

        if (parametro == null) {
            throw new ResourceNotFoundException("Parâmetro fiscal não encontrado.");
        }

        return parametro;
    }

    @Override
    @Transactional
    public ParametroFiscal create(ParametroFiscalRequestDTO dto, Usuario autor) {
        validarPeriodo(dto);

        verificarSobreposicao(
                normalizarChave(dto.chave()),
                dto.vigenciaInicio(),
                dto.vigenciaFim(),
                null
        );

        ParametroFiscal parametro = new ParametroFiscal();
        aplicarDados(parametro, dto, autor);

        repository.persist(parametro);

        auditoria.registrar(autor, "PARAMETRO_CRIADO", alvo(parametro), descrever(parametro));
        return parametro;
    }

    @Override
    @Transactional
    public ParametroFiscal update(Long id, ParametroFiscalRequestDTO dto, Usuario autor) {
        validarPeriodo(dto);

        ParametroFiscal parametro = findById(id);

        if (parametro.isAtivo()) {
            verificarSobreposicao(
                    normalizarChave(dto.chave()),
                    dto.vigenciaInicio(),
                    dto.vigenciaFim(),
                    id
            );
        }

        String antes = descrever(parametro);
        aplicarDados(parametro, dto, autor);

        auditoria.registrar(autor, "PARAMETRO_ALTERADO", alvo(parametro), antes + " → " + descrever(parametro));
        return parametro;
    }

    @Override
    @Transactional
    public ParametroFiscal alterarAtivo(Long id, boolean ativo, Usuario autor) {
        ParametroFiscal parametro = findById(id);

        // Reativar não pode criar dois valores ativos para o mesmo período.
        if (ativo && !parametro.isAtivo()) {
            verificarSobreposicao(parametro.getChave(), parametro.getVigenciaInicio(), parametro.getVigenciaFim(), id);
        }

        parametro.setAtivo(ativo);
        parametro.setAlteradoPor(autor);

        auditoria.registrar(autor, ativo ? "PARAMETRO_ATIVADO" : "PARAMETRO_DESATIVADO", alvo(parametro), null);
        return parametro;
    }

    @Override
    @Transactional
    public void delete(Long id, Usuario autor) {
        ParametroFiscal parametro = findById(id);

        auditoria.registrar(autor, "PARAMETRO_EXCLUIDO", alvo(parametro), descrever(parametro));
        repository.delete(parametro);
    }

    private void aplicarDados(ParametroFiscal parametro, ParametroFiscalRequestDTO dto, Usuario autor) {
        parametro.setChave(normalizarChave(dto.chave()));
        parametro.setValor(dto.valor());
        parametro.setVigenciaInicio(dto.vigenciaInicio());
        parametro.setVigenciaFim(dto.vigenciaFim());
        parametro.setDescricao(dto.descricao() == null || dto.descricao().isBlank() ? null : dto.descricao().trim());
        parametro.setTipoEmpresa(dto.tipoEmpresa());
        parametro.setAlteradoPor(autor);
    }

    // Chaves padronizadas: "limite faturamento mei" e "LIMITE_FATURAMENTO_MEI" são a mesma.
    private String normalizarChave(String chave) {
        return chave.trim().toUpperCase().replaceAll("\\s+", "_");
    }

    private static String alvo(ParametroFiscal parametro) {
        return "Parâmetro " + parametro.getChave() + (parametro.getId() != null ? " #" + parametro.getId() : "");
    }

    private static String descrever(ParametroFiscal parametro) {
        return parametro.getValor() + " de " + parametro.getVigenciaInicio() + " a " + parametro.getVigenciaFim();
    }

    private void validarPeriodo(ParametroFiscalRequestDTO dto) {
        if (dto.vigenciaInicio() == null || dto.vigenciaFim() == null) {
            throw new BadRequestException(
                    "As datas inicial e final da vigência devem ser informadas."
            );
        }

        if (dto.vigenciaFim().isBefore(dto.vigenciaInicio())) {
            throw new BadRequestException(
                    "A data final da vigência deve ser igual ou posterior à data inicial."
            );
        }
    }

    // Só parâmetros ativos contam: um desativado não impede cadastrar outro no mesmo período.
    private void verificarSobreposicao(
            String chave,
            LocalDate vigenciaInicio,
            LocalDate vigenciaFim,
            Long idIgnorado
    ) {
        List<ParametroFiscal> conflitantes = repository.find(
                "ativo = true and chave = ?1 and vigenciaInicio <= ?2 and vigenciaFim >= ?3",
                chave,
                vigenciaFim,
                vigenciaInicio
        ).list();

        boolean existeSobreposicao = conflitantes.stream()
                .anyMatch(parametro ->
                        idIgnorado == null
                                || !parametro.getId().equals(idIgnorado)
                );

        if (existeSobreposicao) {
            throw new BadRequestException(
                    "Já existe um parâmetro ativo nesse período para essa chave."
            );
        }
    }
}
