# Comparador de Armas - Cabal Online

App web local para estimar a diferença de Pontos de Combate ao trocar uma arma de Mago e avaliar o custo-benefício da compra.

Versão atual: `v0.5.4`.

## Como usar

1. Abra `index.html` no navegador.
2. Preencha os atributos da arma atual.
3. Preencha os atributos da arma nova manualmente ou use o OCR para ler um print do item.
4. Confira a diferença estimada de Pontos de Combate.
5. Informe o preço da arma nova em `kk` ou `bi` para calcular o custo-benefício.
6. Opcionalmente, informe o preço da arma atual para calcular o custo líquido da troca.
7. Clique em "Adicionar arma à lista" para salvar a arma candidata no ranking.
8. Repita o preenchimento para comparar várias armas do mercado.
9. Se tiver a diferença real vista no jogo, informe no campo "Comparar com o jogo" para medir o erro.
10. Clique em "Registrar teste" para guardar a validação no histórico e acompanhar o erro médio.

Exemplos de preço:

```text
500 kk = 0,5 bi
250 kk = 0,25 bi
1,5 bi = 1.500 kk
```

## Fórmula inicial

O cálculo usa uma soma ponderada:

```text
Diferença estimada = soma((atributo da arma nova - atributo da arma atual) * peso do atributo)
```

Os pesos iniciais foram baseados na calculadora pública do Mr. Wormy para Combat Power. Para Mago, a própria calculadora orienta usar Ataque Mágico como "Todos os Ataques" e Amp. Mágica como "Todas as Téc. Amp.".

Todos os pesos podem ser editados na tela. Os dados ficam salvos no navegador via `localStorage`.

## Custo-benefício

A partir da versão `v0.3`, a ferramenta calcula:

- Preço da arma nova.
- Custo líquido da troca, quando o preço da arma atual é informado.
- PC ganho por kk de Alzes.
- Avaliação automática: excelente, bom, razoável, caro pelo ganho ou não compensa pelo PC.

O cálculo principal é:

```text
Eficiência = diferença estimada de PC / custo em kk de Alzes
```

Se o preço da arma atual for informado, o custo usado é:

```text
Custo líquido = preço da arma nova - preço da arma atual
```

## Ranking de armas

A versão `v0.4` permite salvar várias armas candidatas e comparar todas contra a arma atual.

O ranking pode ser ordenado por:

- Melhor custo-benefício.
- Maior ganho de PC.
- Menor preço.

As armas salvas são recalculadas automaticamente quando a arma atual ou os pesos são alterados.

## OCR por print

A versão `v0.5` adiciona leitura de print do tooltip do item usando OCR no navegador.

Fluxo recomendado:

1. Tire um print ou recorte do tooltip do item.
2. Selecione, arraste ou cole a imagem na área de OCR.
3. Use o modo `Preto e branco`, que é o padrão recomendado para tooltips do Cabal.
4. Clique em "Ler imagem".
5. Revise o texto reconhecido.
6. Se necessário, corrija linhas ignoradas escolhendo o atributo e o valor manualmente.
7. Clique em "Aplicar na arma nova".

O OCR usa `Tesseract.js` via CDN, então a página precisa de internet para carregar a biblioteca e os dados de idioma. A biblioteca é carregada somente quando você clica em "Ler imagem".

## Validação atual

Com os dois testes informados até agora, o erro médio absoluto está em torno de `5 PC`, com erro percentual médio abaixo de `0,05%`.

## Changelog

### v0.5.4

- Definido `Preto e branco` como modo padrão do OCR.
- Ajustada a ordem dos modos para priorizar o melhor resultado observado nos prints do Cabal.

### v0.5.3

- Adicionados modos de OCR: `Contraste`, `Preto e branco`, `Ampliado` e `Original`.
- Adicionado pré-processamento da imagem com ampliação, contraste e binarização.
- Melhorada a detecção aproximada de linhas com `Taxa Crítica` e `Danos Críticos`.
- Adicionada correção manual das linhas ignoradas pelo OCR.

### v0.5.2

- Melhorado reconhecimento de `Taxa Crítica` quando o OCR lê `Taxa` como `Texa`.
- Adicionado fallback para recuperar percentuais quando o OCR confunde `8` com `H` ou `B` antes do `%`.

### v0.5.1

- Corrigido carregamento do app quando a CDN do OCR demora ou falha.
- O `Tesseract.js` agora é carregado sob demanda ao clicar em "Ler imagem".
- Melhorada a colagem de imagem com area focável, Ctrl+V e botão "Colar imagem".
- Melhoradas as mensagens de erro/status do OCR.

### v0.5

- Adicionado upload, arrastar/soltar e colar imagem para OCR.
- Adicionada leitura de print do tooltip com `Tesseract.js`.
- Adicionado parser de atributos reconhecidos no texto do OCR.
- Adicionado preenchimento automático da arma nova a partir do OCR.
- Adicionado relatório de atributos reconhecidos e linhas ignoradas.

### v0.4.1

- Alterada a métrica de eficiência de `PC/bi` para `PC/kk`.
- Ajustadas as faixas de avaliação automática para a nova unidade.

### v0.4

- Adicionado cadastro de múltiplas armas candidatas.
- Adicionado ranking de armas salvas.
- Adicionada ordenação por custo-benefício, ganho de PC e preço.
- Adicionadas ações para carregar e remover opções salvas.
- As opções salvas são recalculadas contra a arma atual e os pesos configurados.

### v0.3

- Adicionado cálculo de custo-benefício.
- Adicionados campos de preço em `kk` e `bi`.
- Adicionado cálculo de eficiência por Alzes investido.
- Adicionada avaliação automática de compra.
- Adicionado campo de observação do item.

### v0.2

- Adicionado histórico de validações.
- Adicionado erro médio e erro percentual médio.
- Adicionado registro de testes com diferença real vista no jogo.

### v0.1

- Criado comparador manual de armas para Mago.
- Adicionados pesos editáveis por atributo.
- Adicionado cálculo de diferença estimada de Pontos de Combate.
