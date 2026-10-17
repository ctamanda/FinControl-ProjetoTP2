package br.unitins.tp2.fincontrol.service;

import java.util.List;

import br.unitins.tp2.fincontrol.dto.CategoriaRequestDTO;
import br.unitins.tp2.fincontrol.exception.ResourceNotFoundException;
import br.unitins.tp2.fincontrol.exception.ValidationException;
import br.unitins.tp2.fincontrol.model.CategoriaPadrao;
import br.unitins.tp2.fincontrol.model.Usuario;
import br.unitins.tp2.fincontrol.repository.CategoriaPadraoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

// Categorias padrão: o modelo que toda conta nova recebe (ver CategoriasIniciais).
// Alterar ou desativar não mexe nas categorias que as contas já têm.
@ApplicationScoped
public class CategoriaPadraoService {

    @Inject
    CategoriaPadraoRepository repository;

    @Inject
    AuditoriaService auditoria;

    public List<CategoriaPadrao> listar() {
        return repository.listarTodas();
    }

    public CategoriaPadrao buscar(Long id) {
        CategoriaPadrao categoria = repository.findById(id);
        if (categoria == null) {
            throw new ResourceNotFoundException("Categoria padrão não encontrada.");
        }
        return categoria;
    }

    @Transactional
    public CategoriaPadrao criar(CategoriaRequestDTO dto, Usuario autor) {
        CategoriaPadrao categoria = new CategoriaPadrao();
        aplicarDados(categoria, dto);
        repository.persist(categoria);
        auditoria.registrar(autor, "CATEGORIA_PADRAO_CRIADA", alvo(categoria), categoria.getTipo().name());
        return categoria;
    }

    @Transactional
    public CategoriaPadrao atualizar(Long id, CategoriaRequestDTO dto, Usuario autor) {
        CategoriaPadrao categoria = buscar(id);
        String antes = categoria.getNome() + " (" + categoria.getTipo() + ")";
        aplicarDados(categoria, dto);
        auditoria.registrar(autor, "CATEGORIA_PADRAO_ALTERADA", alvo(categoria),
                antes + " → " + categoria.getNome() + " (" + categoria.getTipo() + ")");
        return categoria;
    }

    @Transactional
    public CategoriaPadrao alterarAtivo(Long id, boolean ativo, Usuario autor) {
        CategoriaPadrao categoria = buscar(id);
        categoria.setAtivo(ativo);
        auditoria.registrar(autor, ativo ? "CATEGORIA_PADRAO_ATIVADA" : "CATEGORIA_PADRAO_DESATIVADA", alvo(categoria), null);
        return categoria;
    }

    private void aplicarDados(CategoriaPadrao categoria, CategoriaRequestDTO dto) {
        String nome = dto.nome().trim();
        CategoriaPadrao existente = repository.findByNome(nome);
        if (existente != null && !existente.getId().equals(categoria.getId())) {
            throw ValidationException.of("nome", "Já existe uma categoria padrão com esse nome.");
        }
        categoria.setNome(nome);
        categoria.setTipo(dto.tipo());
        categoria.setCor(dto.cor() == null || dto.cor().isBlank() ? null : dto.cor().toUpperCase());
    }

    private static String alvo(CategoriaPadrao categoria) {
        return "Categoria padrão " + categoria.getNome() + (categoria.getId() != null ? " #" + categoria.getId() : "");
    }
}
