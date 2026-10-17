package br.unitins.tp2.fincontrol.service;

import br.unitins.tp2.fincontrol.dto.EmpresaRequestDTO;
import br.unitins.tp2.fincontrol.exception.ResourceNotFoundException;
import br.unitins.tp2.fincontrol.exception.ValidationException;
import br.unitins.tp2.fincontrol.model.Empresa;
import br.unitins.tp2.fincontrol.model.Escopo;
import br.unitins.tp2.fincontrol.model.Usuario;
import br.unitins.tp2.fincontrol.repository.CategoriaRepository;
import br.unitins.tp2.fincontrol.repository.EmpresaRepository;
import br.unitins.tp2.fincontrol.repository.TransacaoRepository;
import br.unitins.tp2.fincontrol.repository.UsuarioRepository;
import br.unitins.tp2.fincontrol.validation.Documentos;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class EmpresaService {

    @Inject
    EmpresaRepository repository;

    @Inject
    CategoriaRepository categoriaRepository;

    @Inject
    TransacaoRepository transacaoRepository;

    @Inject
    UsuarioRepository usuarioRepository;

    @Inject
    CategoriasIniciais categoriasIniciais;

    @Inject
    AuditoriaService auditoria;

    // Segunda etapa do cadastro de MEI/Microempresa. Quem cria vira o administrador principal.
    @Transactional
    public Empresa criar(EmpresaRequestDTO dto, Usuario logado) {
        // Recarrega dentro da transação para o vínculo com a empresa ser gravado.
        Usuario admin = usuarioRepository.findById(logado.getId());
        if (admin.getEmpresa() != null) {
            throw ValidationException.of("empresa", "A empresa desta conta já foi cadastrada.");
        }

        Empresa empresa = new Empresa();
        empresa.setResponsavel(admin);
        aplicarDados(empresa, dto);
        repository.persist(empresa);

        admin.setEmpresa(empresa);

        // Contas MEI/ME de antes dos tipos de conta tinham dados em nome do usuário:
        // passam a ser da empresa, para continuarem visíveis.
        categoriaRepository.update("empresa = ?1 where usuario = ?2 and empresa is null", empresa, admin);
        transacaoRepository.update("empresa = ?1, escopo = ?2 where usuario = ?3 and empresa is null",
                empresa, Escopo.EMPRESA, admin);

        if (categoriaRepository.countByDono(admin) == 0) {
            categoriasIniciais.criar(admin, empresa);
        }

        auditoria.registrar(admin, "EMPRESA_CADASTRADA", AuditoriaService.alvo(empresa),
                "CNPJ " + empresa.getCnpj() + ", " + empresa.getTipo());
        return empresa;
    }

    public Empresa buscar(Usuario usuario) {
        if (usuario.getEmpresa() == null) {
            throw new ResourceNotFoundException("Empresa não encontrada.");
        }
        return usuario.getEmpresa();
    }

    @Transactional
    public Empresa atualizar(EmpresaRequestDTO dto, Usuario admin) {
        return atualizarPorId(buscar(admin).getId(), dto, admin);
    }

    // ---------------------------------------------------------- SUPER_ADMIN (qualquer empresa)

    public Empresa buscarPorId(Long id) {
        Empresa empresa = repository.findById(id);
        if (empresa == null) {
            throw new ResourceNotFoundException("Empresa não encontrada.");
        }
        return empresa;
    }

    @Transactional
    public Empresa atualizarPorId(Long id, EmpresaRequestDTO dto, Usuario autor) {
        Empresa empresa = buscarPorId(id);
        aplicarDados(empresa, dto);
        auditoria.registrar(autor, "EMPRESA_ALTERADA", AuditoriaService.alvo(empresa), null);
        return empresa;
    }

    // Desativada, nenhum usuário da empresa entra (AcessoFilter); os dados continuam guardados.
    @Transactional
    public Empresa alterarAtivo(Long id, boolean ativo, Usuario autor) {
        Empresa empresa = buscarPorId(id);
        empresa.setAtivo(ativo);
        auditoria.registrar(autor, ativo ? "EMPRESA_ATIVADA" : "EMPRESA_DESATIVADA", AuditoriaService.alvo(empresa), null);
        return empresa;
    }

    private void aplicarDados(Empresa empresa, EmpresaRequestDTO dto) {
        String cnpj = Documentos.soDigitos(dto.cnpj());

        Empresa mesmoCnpj = repository.findByCnpj(cnpj);
        if (mesmoCnpj != null && !mesmoCnpj.getId().equals(empresa.getId())) {
            throw ValidationException.of("cnpj", "Já existe uma empresa cadastrada com este CNPJ.");
        }

        empresa.setRazaoSocial(dto.razaoSocial().trim());
        empresa.setNomeFantasia(dto.nomeFantasia() == null || dto.nomeFantasia().isBlank()
                ? null
                : dto.nomeFantasia().trim());
        empresa.setCnpj(cnpj);
        empresa.setTipo(dto.tipo());
        empresa.setTelefone(Documentos.soDigitos(dto.telefone()));
        empresa.setEmail(dto.email().trim().toLowerCase());
    }
}
