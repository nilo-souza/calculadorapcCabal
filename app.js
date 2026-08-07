const STORAGE_KEY = "cabal-weapon-comparator-v1";
const TESSERACT_SCRIPT_URL = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
let tesseractScriptPromise = null;

const attributes = [
  {
    key: "magicAttack",
    label: "Ataque mágico",
    unit: "pontos",
    hint: "Mago: entra como Todos os Ataques.",
    defaultWeight: 34.5,
  },
  {
    key: "attack",
    label: "Ataque físico",
    unit: "pontos",
    hint: "Peso 0 por padrão para evitar duplicar o Ataque Mágico.",
    defaultWeight: 0,
  },
  {
    key: "attackPercent",
    label: "Ataque %",
    unit: "%",
    hint: "Calculado sobre Ataque mágico/Todos os ataques neste app de Mago.",
    defaultWeight: 34.5,
    percentOf: "magicAttack",
  },
  {
    key: "criticalRate",
    label: "Taxa crítica",
    unit: "%",
    hint: "Informe apenas o número, sem o símbolo de porcentagem.",
    defaultWeight: 750,
  },
  {
    key: "criticalDamage",
    label: "Dano crítico",
    unit: "%",
    hint: "Ex.: 24 para +24%.",
    defaultWeight: 177,
  },
  {
    key: "magicAmp",
    label: "Amp. mágica",
    unit: "%",
    hint: "Mago: entra como Todas as Téc. Amp.",
    defaultWeight: 349,
  },
  {
    key: "swordAmp",
    label: "Amp. espada",
    unit: "%",
    hint: "Peso 0 por padrão para Mago.",
    defaultWeight: 0,
  },
  {
    key: "accuracy",
    label: "Precisão",
    unit: "pontos",
    hint: "Attack Rate na calculadora base.",
    defaultWeight: 3,
  },
  {
    key: "hitAccuracy",
    label: "Acerto",
    unit: "pontos",
    hint: "Accuracy na calculadora base.",
    defaultWeight: 6.5,
  },
  {
    key: "penetration",
    label: "Penetração",
    unit: "pontos",
    hint: "Perfuração.",
    defaultWeight: 71,
  },
  {
    key: "addDamage",
    label: "Dano adicional",
    unit: "pontos",
    hint: "Add Damage na calculadora base.",
    defaultWeight: 35,
  },
  {
    key: "ignoreEvasion",
    label: "Ignorar evasão",
    unit: "pontos",
    hint: "Ignore Evasion; pode aparecer como Ignorar Bloqueio.",
    defaultWeight: 4.5,
  },
  {
    key: "finalDamageIncrease",
    label: "Aumento dano final",
    unit: "%",
    hint: "Final DMG Increase.",
    defaultWeight: 1604,
  },
  {
    key: "ignoreDamageReduction",
    label: "Ignorar redução de dano",
    unit: "pontos",
    hint: "Ignore DMG Reduce.",
    defaultWeight: 16.8,
  },
  {
    key: "ignoreResistCriticalRate",
    label: "Ign. res. taxa crítica",
    unit: "%",
    hint: "Ignore Resist Crit. Rate.",
    defaultWeight: 574,
  },
  {
    key: "ignoreResistCriticalDamage",
    label: "Ign. res. dano crítico",
    unit: "%",
    hint: "Ignore Resist Crit. DMG.",
    defaultWeight: 142.5,
  },
  {
    key: "ignoreResistSkillAmp",
    label: "Ign. res. amp.",
    unit: "%",
    hint: "Ignore Resist Skill Amp.",
    defaultWeight: 267,
  },
  {
    key: "normalDamageUp",
    label: "Aumento dano normal",
    unit: "%",
    hint: "Normal DMG Up.",
    defaultWeight: 85,
  },
  {
    key: "cancelIgnorePenetration",
    label: "Cancelar ignorar perfuração",
    unit: "pontos",
    hint: "Cancel Ignore Penetration.",
    defaultWeight: 47.8,
  },
  {
    key: "hp",
    label: "HP",
    unit: "pontos",
    hint: "HP na calculadora base.",
    defaultWeight: 5,
  },
  {
    key: "defense",
    label: "Defesa",
    unit: "pontos",
    hint: "Defense na calculadora base.",
    defaultWeight: 21,
  },
  {
    key: "defenseRate",
    label: "Bloqueio",
    unit: "pontos",
    hint: "Defense Rate na calculadora base.",
    defaultWeight: 2.4,
  },
  {
    key: "evasion",
    label: "Evasão",
    unit: "pontos",
    hint: "Evasion na calculadora base.",
    defaultWeight: 5.3,
  },
  {
    key: "damageReduction",
    label: "Redução de dano",
    unit: "pontos",
    hint: "DMG Reduce.",
    defaultWeight: 19.5,
  },
  {
    key: "resistCriticalRate",
    label: "Res. taxa crítica",
    unit: "%",
    hint: "Resist Crit. Rate.",
    defaultWeight: 636,
  },
  {
    key: "resistCriticalDamage",
    label: "Res. dano crítico",
    unit: "%",
    hint: "Resist Crit. DMG.",
    defaultWeight: 150,
  },
  {
    key: "resistSkillAmp",
    label: "Res. amp.",
    unit: "%",
    hint: "Resist Skill Amp.",
    defaultWeight: 296.5,
  },
  {
    key: "ignorePenetration",
    label: "Ignorar perfuração",
    unit: "pontos",
    hint: "Ignore Penetration.",
    defaultWeight: 53.1,
  },
  {
    key: "ignoreAccuracy",
    label: "Ignorar acerto",
    unit: "pontos",
    hint: "Ignore Accuracy.",
    defaultWeight: 5.3,
  },
  {
    key: "finalDamageDecrease",
    label: "Redução dano final",
    unit: "%",
    hint: "Final DMG Decrease.",
    defaultWeight: 1451,
  },
  {
    key: "cancelIgnoreDamageReduction",
    label: "Cancelar ignorar redução",
    unit: "pontos",
    hint: "Cancel Ignore DMG Reduce.",
    defaultWeight: 19.9,
  },
];

const seedValidationHistory = [
  {
    id: "sample-1",
    label: "Teste informado 1",
    estimate: 6043.5,
    real: 6041,
    createdAt: "2026-08-06T00:00:00.000Z",
  },
  {
    id: "sample-2",
    label: "Teste informado 2",
    estimate: 14989.5,
    real: 14997,
    createdAt: "2026-08-06T00:00:00.000Z",
  },
];

const defaultMarket = {
  currentPriceValue: "",
  currentPriceUnit: "kk",
  candidatePriceValue: "",
  candidatePriceUnit: "kk",
  note: "",
};

const ocrAttributePatterns = [
  {
    key: "magicAttack",
    labels: ["ataque magico", "ataquemagico", "ataques magicos", "ataquesmagicos", "todos os ataques", "all attack", "magic attack"],
  },
  {
    key: "attackPercent",
    labels: ["ataque %", "ataques %", "ataque percentual", "aumentou todos os ataques %", "todos os ataques %", "attack %", "attack percent"],
  },
  {
    key: "ignoreResistCriticalDamage",
    labels: ["ignorar resistencia a danos criticos", "ignorar resistencia danos criticos", "ign res dano critico", "ignore resist crit dmg", "ignore resist critical damage"],
  },
  {
    key: "ignoreResistCriticalRate",
    labels: ["ignorar resistencia a taxa", "ignorar resistencia taxa critica", "ign res taxa critica", "ignore resist crit rate", "ignore resist critical rate"],
  },
  {
    key: "ignoreResistSkillAmp",
    labels: ["ignorar resistencia a tecnica amp", "ignorar resistencia tecnica amp", "ignorar resistencia a todas as tec amp", "ignorar resistencia todas as tec amp", "ignorar resistencia amp", "ign res todas as tec amp", "ign res amp", "ignore resist skill amp", "ignore resist amp"],
  },
  {
    key: "resistCriticalDamage",
    labels: ["resistencia a danos criticos", "resistencia danos criticos", "res danos criticos", "res dano critico", "resist crit dmg", "resist critical damage"],
  },
  {
    key: "resistCriticalRate",
    labels: ["resistencia a taxa critica", "resistencia taxa critica", "res taxa critica", "resist crit rate", "resist critical rate"],
  },
  {
    key: "resistSkillAmp",
    labels: ["resistencia a tecnica amp", "resistencia tecnica amp", "resistencia a todas as tec amp", "resistencia todas as tec amp", "resistencia amp", "res todas as tec amp", "res amp", "resist skill amp", "resist amp"],
  },
  {
    key: "criticalRate",
    labels: ["taxa critica", "taxa critic", "ta critica", "ta critic", "texa critica", "texa critic", "crit rate", "critical rate"],
  },
  {
    key: "criticalDamage",
    labels: ["dano critico", "dano critic", "danos criticos", "danos critic", "criticos", "crit dmg", "critical damage"],
  },
  {
    key: "magicAmp",
    labels: ["amp magica", "magica amp", "amplificacao magica", "tec magica amp", "tecnica magica amp", "tecnica de magica amp", "tecnica de magia amp", "todas as tec amp", "all skill amp"],
  },
  {
    key: "swordAmp",
    labels: ["amp espada", "espada amp", "tec espada amp", "tecnica espada amp", "tecnica de espada amp", "sword amp"],
  },
  {
    key: "accuracy",
    labels: ["precisao", "attack rate"],
  },
  {
    key: "ignoreAccuracy",
    labels: ["ignorar acerto", "ignore accuracy"],
  },
  {
    key: "hitAccuracy",
    labels: ["acerto", "acertos", "taxa de acerto", "accuracy", "hit accuracy", "hit rate"],
  },
  {
    key: "cancelIgnorePenetration",
    labels: ["cancelar ignorar perfuracao", "cancelar ignorar penetracao", "cancel ignore penetration"],
  },
  {
    key: "ignorePenetration",
    labels: ["ignorar perfuracao", "ignorar penetracao", "ignore penetration"],
  },
  {
    key: "penetration",
    labels: ["perfuracao", "penetracao", "penetration"],
  },
  {
    key: "cancelIgnoreDamageReduction",
    labels: ["cancelar ignorar reducao de dano", "cancelar ignorar reducao de danos", "desfazer ignorar reducao de dano", "cancel ignore dmg reduce", "cancel ignore damage reduction"],
  },
  {
    key: "ignoreDamageReduction",
    labels: ["ignorar reducao de dano", "ignorar reducao de danos", "ignore dmg reduce", "ignore damage reduction"],
  },
  {
    key: "damageReduction",
    labels: ["reducao de dano", "reducao de danos", "dmg reduce", "damage reduction"],
  },
  {
    key: "ignoreEvasion",
    labels: ["ignorar evasao", "ignorar bloqueio", "ignore evasion", "ignore block"],
  },
  {
    key: "finalDamageIncrease",
    labels: ["aumento do dano final", "aumentou dano final", "dano final aumentado", "final dmg increase", "final damage increase"],
  },
  {
    key: "finalDamageDecrease",
    labels: ["reducao do dano final", "dano final reduzido", "final dmg decrease", "final damage decrease"],
  },
  {
    key: "normalDamageUp",
    labels: ["aumento do dano normal", "aumentou dano normal", "dano normal", "normal dmg up", "normal damage up"],
  },
  {
    key: "addDamage",
    labels: ["dano adicional", "add damage", "additional damage"],
  },
  {
    key: "defenseRate",
    labels: ["bloqueio", "defense rate"],
  },
  {
    key: "evasion",
    labels: ["evasao", "evasion"],
  },
  {
    key: "defense",
    labels: ["defesa", "defense"],
  },
  {
    key: "hp",
    labels: ["hp", "pontos de vida", "health points"],
  },
  {
    key: "attack",
    labels: ["ataque fisico", "ataque", "attack"],
  },
].map((attribute) => ({
  ...attribute,
  labels: attribute.labels.map(normalizeOcrText),
}));

const defaultState = createDefaultState(seedValidationHistory);

let state = loadState();
let latestEstimate = 0;
let ocrImageFile = null;
let ocrPreviewUrl = null;
let ocrPreviewRenderId = 0;

const elements = {
  currentName: document.querySelector("#current-name"),
  candidateName: document.querySelector("#candidate-name"),
  currentFields: document.querySelector("#current-fields"),
  candidateFields: document.querySelector("#candidate-fields"),
  weightFields: document.querySelector("#weight-fields"),
  impactTable: document.querySelector("#impact-table"),
  totalDifference: document.querySelector("#total-difference"),
  resultDirection: document.querySelector("#result-direction"),
  changedFields: document.querySelector("#changed-fields"),
  resetWeights: document.querySelector("#reset-weights"),
  clearItems: document.querySelector("#clear-items"),
  clearAll: document.querySelector("#clear-all"),
  realDifference: document.querySelector("#real-difference"),
  calibrationOutput: document.querySelector("#calibration-output"),
  saveValidation: document.querySelector("#save-validation"),
  clearValidationHistory: document.querySelector("#clear-validation-history"),
  validationSummary: document.querySelector("#validation-summary"),
  validationTable: document.querySelector("#validation-table"),
  costSummary: document.querySelector("#cost-summary"),
  saveCandidateOption: document.querySelector("#save-candidate-option"),
  candidateSort: document.querySelector("#candidate-sort"),
  clearCandidates: document.querySelector("#clear-candidates"),
  candidateTable: document.querySelector("#candidate-table"),
  ocrImage: document.querySelector("#ocr-image"),
  ocrDropZone: document.querySelector("#ocr-drop-zone"),
  ocrPreview: document.querySelector("#ocr-preview"),
  ocrProcessedPreview: document.querySelector("#ocr-processed-preview"),
  ocrMode: document.querySelector("#ocr-mode"),
  ocrText: document.querySelector("#ocr-text"),
  pasteOcrImage: document.querySelector("#paste-ocr-image"),
  runOcr: document.querySelector("#run-ocr"),
  testOcrModes: document.querySelector("#test-ocr-modes"),
  applyOcr: document.querySelector("#apply-ocr"),
  clearOcr: document.querySelector("#clear-ocr"),
  ocrStatus: document.querySelector("#ocr-status"),
  deleteLineDialog: document.querySelector("#delete-line-dialog"),
  confirmDeleteLine: document.querySelector("#confirm-delete-line"),
  cancelDeleteLine: document.querySelector("#cancel-delete-line"),
};

renderFields();
bindStaticEvents();
syncFormValues();
calculateAndRender();
renderOcrReport(parseOcrAttributes(state.ocr.text));

function renderFields() {
  elements.currentFields.innerHTML = attributes.map((attribute) => renderAttributeInput(attribute, "current")).join("");
  elements.candidateFields.innerHTML = attributes.map((attribute) => renderAttributeInput(attribute, "candidate")).join("");
  elements.weightFields.innerHTML = attributes.map(renderWeightInput).join("");

  document.querySelectorAll("[data-item]").forEach((input) => {
    input.addEventListener("input", () => {
      state[input.dataset.item][input.dataset.attribute] = input.value;
      persistAndRender();
    });
  });

  document.querySelectorAll("[data-weight]").forEach((input) => {
    input.addEventListener("input", () => {
      state.weights[input.dataset.weight] = input.value;
      persistAndRender();
    });
  });

  document.querySelectorAll("[data-market]").forEach((input) => {
    input.addEventListener("input", () => {
      state.market[input.dataset.market] = input.value;
      persistAndRender();
    });

    input.addEventListener("change", () => {
      state.market[input.dataset.market] = input.value;
      persistAndRender();
    });
  });
}

function renderAttributeInput(attribute, itemKey) {
  const id = `${itemKey}-${attribute.key}`;

  return `
    <div class="attribute-row">
      <label for="${id}">
        ${attribute.label}
        <small>${attribute.hint}</small>
      </label>
      <input id="${id}" data-item="${itemKey}" data-attribute="${attribute.key}" type="number" step="0.1" placeholder="0 ${attribute.unit}" />
    </div>
  `;
}

function renderWeightInput(attribute) {
  const id = `weight-${attribute.key}`;

  return `
    <div class="attribute-row">
      <label for="${id}">
        ${attribute.label}
        <small>${attribute.unit}</small>
      </label>
      <input id="${id}" data-weight="${attribute.key}" type="number" step="0.1" />
    </div>
  `;
}

function bindStaticEvents() {
  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", (event) => event.preventDefault());
  });

  elements.currentName.addEventListener("input", () => {
    state.currentName = elements.currentName.value;
    saveState();
  });

  elements.candidateName.addEventListener("input", () => {
    state.candidateName = elements.candidateName.value;
    saveState();
  });

  elements.realDifference.addEventListener("input", () => {
    state.realDifference = elements.realDifference.value;
    persistAndRender();
  });

  elements.ocrImage.addEventListener("change", () => {
    const file = getFirstImageFile(elements.ocrImage.files);

    if (file) {
      loadOcrImage(file);
    } else {
      setOcrStatus("O arquivo selecionado nao e uma imagem valida.");
    }
  });

  elements.ocrText.addEventListener("input", () => {
    state.ocr.text = elements.ocrText.value;
    state.ocr.appliedIgnoredLines = [];
    state.ocr.manualMatches = [];
    state.ocr.matchOverrides = {};
    state.ocr.deletedMatchClusters = [];
    state.ocr.deletedIgnoredLines = [];
    saveState();
    renderOcrReport(parseOcrAttributes(state.ocr.text));
  });

  elements.ocrMode.addEventListener("change", () => {
    state.ocr.mode = elements.ocrMode.value;
    saveState();
    setOcrStatus(`Modo ${getOcrModeLabel(state.ocr.mode)} selecionado. Clique em Ler imagem para testar.`);
    updateProcessedPreview();
  });

  elements.pasteOcrImage.addEventListener("click", pasteOcrImageFromClipboard);
  elements.runOcr.addEventListener("click", runOcrRecognition);
  elements.testOcrModes.addEventListener("click", testAllOcrModes);
  elements.applyOcr.addEventListener("click", applyOcrToCandidate);
  elements.clearOcr.addEventListener("click", clearOcr);
  elements.ocrStatus.addEventListener("click", handleOcrStatusClick);
  elements.ocrStatus.addEventListener("change", updateRecognizedOcrLine);

  elements.ocrDropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    elements.ocrDropZone.classList.add("dragging");
  });

  elements.ocrDropZone.addEventListener("dragleave", () => {
    elements.ocrDropZone.classList.remove("dragging");
  });

  elements.ocrDropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    elements.ocrDropZone.classList.remove("dragging");

    const file = getFirstImageFile(event.dataTransfer.files);

    if (file) {
      loadOcrImage(file);
    } else {
      setOcrStatus("Solte um arquivo de imagem valido.");
    }
  });

  elements.ocrDropZone.addEventListener("paste", handleOcrPaste);
  document.addEventListener("paste", handleOcrPaste);
  setOcrStatus("Nenhuma imagem selecionada. Clique na area de OCR e cole com Ctrl+V, ou selecione um arquivo.");

  function handleOcrPaste(event) {
    const file = getClipboardImageFile(event.clipboardData);

    if (!file) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    loadOcrImage(file);
  }

  elements.saveValidation.addEventListener("click", () => {
    if (state.realDifference === "") {
      elements.calibrationOutput.textContent = "Informe a diferença real antes de registrar o teste.";
      return;
    }

    state.validationHistory.unshift({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      label: buildValidationLabel(),
      estimate: latestEstimate,
      real: toNumber(state.realDifference),
      createdAt: new Date().toISOString(),
    });

    persistAndRender();
  });

  elements.clearValidationHistory.addEventListener("click", () => {
    state.validationHistory = [];
    persistAndRender();
  });

  elements.saveCandidateOption.addEventListener("click", () => {
    if (!hasCandidateInput()) {
      showCostMessage("Preencha pelo menos o nome ou um atributo da arma nova antes de adicionar à lista.");
      return;
    }

    state.candidateOptions.unshift({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: state.candidateName.trim() || `Arma candidata ${state.candidateOptions.length + 1}`,
      attributes: { ...state.candidate },
      market: {
        candidatePriceValue: state.market.candidatePriceValue,
        candidatePriceUnit: state.market.candidatePriceUnit,
        note: state.market.note,
      },
      createdAt: new Date().toISOString(),
    });

    persistAndRender();
  });

  elements.candidateSort.addEventListener("change", () => {
    state.candidateSort = elements.candidateSort.value;
    persistAndRender();
  });

  elements.clearCandidates.addEventListener("click", () => {
    state.candidateOptions = [];
    persistAndRender();
  });

  elements.candidateTable.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const loadButton = event.target.closest("[data-load-candidate]");

    if (loadButton) {
      const option = state.candidateOptions.find((candidateOption) => candidateOption.id === loadButton.dataset.loadCandidate);

      if (!option) {
        return;
      }

      state.candidateName = option.name;
      state.candidate = { ...defaultState.candidate, ...option.attributes };
      state.market = {
        ...state.market,
        candidatePriceValue: option.market?.candidatePriceValue || "",
        candidatePriceUnit: option.market?.candidatePriceUnit || "kk",
        note: option.market?.note || "",
      };
      syncFormValues();
      persistAndRender();
      return;
    }

    const button = event.target.closest("[data-remove-candidate]");

    if (!button) {
      return;
    }

    state.candidateOptions = state.candidateOptions.filter((option) => option.id !== button.dataset.removeCandidate);
    persistAndRender();
  });

  elements.resetWeights.addEventListener("click", () => {
    state.weights = Object.fromEntries(attributes.map((attribute) => [attribute.key, attribute.defaultWeight]));
    syncFormValues();
    persistAndRender();
  });

  elements.clearItems.addEventListener("click", () => {
    state.currentName = "";
    state.candidateName = "";
    state.current = Object.fromEntries(attributes.map((attribute) => [attribute.key, ""]));
    state.candidate = Object.fromEntries(attributes.map((attribute) => [attribute.key, ""]));
    state.realDifference = "";
    state.market = { ...defaultMarket };
    syncFormValues();
    persistAndRender();
  });

  elements.clearAll.addEventListener("click", () => {
    state = createDefaultState([]);
    clearOcrImagePreview();
    syncFormValues();
    persistAndRender();
  });
}

function syncFormValues() {
  elements.currentName.value = state.currentName || "";
  elements.candidateName.value = state.candidateName || "";
  elements.realDifference.value = state.realDifference || "";
  elements.candidateSort.value = state.candidateSort;
  elements.ocrMode.value = state.ocr.mode;
  elements.ocrText.value = state.ocr.text || "";

  Object.entries(state.market).forEach(([key, value]) => {
    setInputValue(`[data-market="${key}"]`, value);
  });

  attributes.forEach((attribute) => {
    setInputValue(`[data-item="current"][data-attribute="${attribute.key}"]`, state.current[attribute.key]);
    setInputValue(`[data-item="candidate"][data-attribute="${attribute.key}"]`, state.candidate[attribute.key]);
    setInputValue(`[data-weight="${attribute.key}"]`, state.weights[attribute.key]);
  });
}

function calculateAndRender() {
  const rows = getComparisonRows(state.candidate);

  const total = rows.reduce((sum, row) => sum + row.impact, 0);
  const changedRows = rows.filter((row) => row.difference !== 0 || row.impact !== 0);
  latestEstimate = total;

  renderSummary(total, changedRows.length);
  renderImpactTable(rows);
  renderCalibration(total);
  renderCostBenefit(total);
  renderCandidateOptions();
  renderValidationHistory();
}

function getComparisonRows(candidateAttributes) {
  return attributes.map((attribute) => {
    const current = toNumber(state.current[attribute.key]);
    const candidate = toNumber(candidateAttributes[attribute.key]);
    const weight = toNumber(state.weights[attribute.key]);
    const difference = candidate - current;
    const impact = calculateAttributeImpact(attribute, current, candidate, weight, candidateAttributes);

    return {
      ...attribute,
      current,
      candidate,
      difference,
      weight,
      impact,
    };
  });
}

function calculateAttributeImpact(attribute, current, candidate, weight, candidateAttributes) {
  if (!attribute.percentOf) {
    return (candidate - current) * weight;
  }

  const currentBase = toNumber(state.current[attribute.percentOf]);
  const candidateBase = toNumber(candidateAttributes[attribute.percentOf]);
  const currentImpact = Math.ceil((currentBase * current * weight) / 100);
  const candidateImpact = Math.ceil((candidateBase * candidate * weight) / 100);

  return candidateImpact - currentImpact;
}

function renderSummary(total, changedCount) {
  elements.totalDifference.textContent = formatSigned(total);
  elements.totalDifference.classList.toggle("negative", total < 0);

  if (total > 0) {
    elements.resultDirection.textContent = "A arma nova deve aumentar seu PC.";
  } else if (total < 0) {
    elements.resultDirection.textContent = "A arma nova deve diminuir seu PC.";
  } else {
    elements.resultDirection.textContent = "Sem diferença calculada.";
  }

  elements.changedFields.textContent = `${changedCount} ${changedCount === 1 ? "atributo alterado" : "atributos alterados"}`;
}

function renderImpactTable(rows) {
  const orderedRows = [...rows].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));

  elements.impactTable.innerHTML = orderedRows
    .map((row) => {
      const impactClass = row.impact > 0 ? "impact-positive" : row.impact < 0 ? "impact-negative" : "";

      return `
        <tr>
          <td>${row.label}</td>
          <td>${formatSigned(row.difference)}</td>
          <td>${formatNumber(row.weight)}</td>
          <td class="${impactClass}">${formatSigned(row.impact)}</td>
        </tr>
      `;
    })
    .join("");
}

function renderCalibration(total) {
  const realDifference = toNumber(state.realDifference);

  if (state.realDifference === "") {
    elements.calibrationOutput.textContent = "Informe a diferença real para ver o erro da estimativa.";
    return;
  }

  const error = total - realDifference;
  const multiplier = total === 0 ? null : realDifference / total;
  const multiplierText = multiplier === null ? "indisponível" : `${formatNumber(multiplier)}x`;

  elements.calibrationOutput.textContent = `Estimativa: ${formatSigned(total)} PC. Erro: ${formatSigned(error)} PC. Fator global sugerido: ${multiplierText}.`;
}

function renderValidationHistory() {
  if (state.validationHistory.length === 0) {
    elements.validationSummary.innerHTML = renderValidationStat("Testes", "0", "Registre validações reais para medir a confiabilidade.");
    elements.validationTable.innerHTML = `<tr><td colspan="5">Nenhum teste registrado.</td></tr>`;
    return;
  }

  const stats = state.validationHistory.reduce(
    (summary, record) => {
      const error = record.estimate - record.real;
      const absoluteError = Math.abs(error);
      const percentageError = record.real === 0 ? 0 : (absoluteError / Math.abs(record.real)) * 100;

      return {
        count: summary.count + 1,
        absoluteError: summary.absoluteError + absoluteError,
        percentageError: summary.percentageError + percentageError,
        maxError: Math.max(summary.maxError, absoluteError),
      };
    },
    { count: 0, absoluteError: 0, percentageError: 0, maxError: 0 },
  );

  const averageError = stats.absoluteError / stats.count;
  const averagePercentageError = stats.percentageError / stats.count;

  elements.validationSummary.innerHTML = [
    renderValidationStat("Testes", formatNumber(stats.count), "Comparações registradas"),
    renderValidationStat("Erro médio", `${formatNumber(averageError)} PC`, "Média absoluta"),
    renderValidationStat("Erro médio %", `${formatNumber(averagePercentageError, 3)}%`, `Maior erro: ${formatNumber(stats.maxError)} PC`),
  ].join("");

  elements.validationTable.innerHTML = state.validationHistory
    .map((record) => {
      const error = record.estimate - record.real;
      const percentageError = record.real === 0 ? 0 : (Math.abs(error) / Math.abs(record.real)) * 100;
      const errorClass = error > 0 ? "impact-positive" : error < 0 ? "impact-negative" : "";

      return `
        <tr>
          <td>${escapeHtml(record.label)}</td>
          <td>${formatSigned(record.estimate)}</td>
          <td>${formatSigned(record.real)}</td>
          <td class="${errorClass}">${formatSigned(error)}</td>
          <td>${formatNumber(percentageError, 3)}%</td>
        </tr>
      `;
    })
    .join("");
}

function renderCostBenefit(total) {
  const currentPriceBi = priceToBi(state.market.currentPriceValue, state.market.currentPriceUnit);
  const candidatePriceBi = priceToBi(state.market.candidatePriceValue, state.market.candidatePriceUnit);

  if (!candidatePriceBi || candidatePriceBi <= 0) {
    elements.costSummary.innerHTML = `
      <div class="cost-empty">Informe o preço da arma nova para calcular PC por kk e avaliar o custo-benefício.</div>
    `;
    return;
  }

  const hasCurrentPrice = currentPriceBi !== null && currentPriceBi > 0;
  const investmentBi = hasCurrentPrice ? candidatePriceBi - currentPriceBi : candidatePriceBi;
  const investmentKk = investmentBi * 1000;
  const efficiency = investmentKk > 0 ? total / investmentKk : null;
  const evaluation = getCostEvaluation(total, investmentBi, efficiency);
  const investmentHint = hasCurrentPrice ? "Preço novo - preço atual" : "Preço cheio da arma nova";

  elements.costSummary.innerHTML = `
    ${renderCostStat("Preço novo", formatAlzes(candidatePriceBi), "Valor informado para a arma candidata")}
    ${renderCostStat("Custo líquido", formatSignedAlzes(investmentBi), investmentHint)}
    ${renderCostStat("Eficiência", efficiency === null ? "Indisponível" : `${formatNumber(efficiency, 3)} PC/kk`, "PC ganho por kk de Alzes")}
    <div class="cost-evaluation ${evaluation.tone}">
      <span>Avaliação</span>
      <strong>${evaluation.label}</strong>
      <small>${evaluation.detail}</small>
    </div>
  `;
}

function loadOcrImage(file) {
  if (!file.type.startsWith("image/")) {
    setOcrStatus("Selecione um arquivo de imagem valido.");
    return;
  }

  ocrImageFile = file;

  if (ocrPreviewUrl) {
    URL.revokeObjectURL(ocrPreviewUrl);
  }

  ocrPreviewUrl = URL.createObjectURL(file);
  elements.ocrPreview.src = ocrPreviewUrl;
  elements.ocrPreview.hidden = false;
  updateProcessedPreview();
  setOcrStatus("Imagem carregada. Clique em Ler imagem para executar o OCR.");
}

async function runOcrRecognition() {
  if (!ocrImageFile) {
    setOcrStatus("Selecione, arraste ou cole uma imagem antes de executar o OCR.");
    return;
  }

  elements.runOcr.disabled = true;
  setOcrStatus("Preparando OCR... o primeiro uso pode demorar enquanto a biblioteca e baixada.");

  try {
    await loadTesseract();
    const ocrInput = await prepareOcrImage(ocrImageFile, state.ocr.mode);
    setOcrStatus(`Lendo imagem no modo ${getOcrModeLabel(state.ocr.mode)}...`);
    const text = await recognizeOcrInput(ocrInput, (message) => {
      if (message.status && typeof message.progress === "number") {
        setOcrStatus(`${message.status}: ${formatNumber(message.progress * 100, 0)}%`);
      }
    });
    state.ocr.text = text;
    state.ocr.appliedIgnoredLines = [];
    state.ocr.manualMatches = [];
    state.ocr.matchOverrides = {};
    state.ocr.deletedMatchClusters = [];
    state.ocr.deletedIgnoredLines = [];
    elements.ocrText.value = text;
    saveState();
    renderOcrReport(parseOcrAttributes(text));
  } catch (error) {
    setOcrStatus(`Nao foi possivel ler a imagem: ${error.message}`);
  } finally {
    elements.runOcr.disabled = false;
  }
}

async function recognizeOcrInput(ocrInput, logger) {
  const result = await window.Tesseract.recognize(ocrInput, "por+eng", {
    preserve_interword_spaces: "1",
    tessedit_pageseg_mode: "6",
    logger,
  });

  return result.data.text.trim();
}

async function prepareOcrImage(file, mode) {
  const image = await loadImageElement(file);
  const scale = mode === "original" ? 1 : 3;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });

  canvas.width = image.naturalWidth * scale;
  canvas.height = image.naturalHeight * scale;
  context.imageSmoothingEnabled = false;
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  if (mode === "original") {
    return canvas;
  }

  if (mode === "scale") {
    return canvas;
  }

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

  if (mode === "threshold") {
    applyThresholdPreprocess(imageData);
  } else {
    applyContrastPreprocess(imageData);
  }

  context.putImageData(imageData, 0, 0);
  return canvas;
}

function loadImageElement(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Nao foi possivel preparar a imagem para OCR."));
    };
    image.src = url;
  });
}

function applyContrastPreprocess(imageData) {
  const { data } = imageData;

  for (let index = 0; index < data.length; index += 4) {
    const value = Math.max(data[index], data[index + 1], data[index + 2]);
    const adjusted = clamp((value - 90) * 2.2 + 128, 0, 255);

    data[index] = adjusted;
    data[index + 1] = adjusted;
    data[index + 2] = adjusted;
  }
}

function applyThresholdPreprocess(imageData) {
  const { data } = imageData;

  for (let index = 0; index < data.length; index += 4) {
    const red = data[index];
    const green = data[index + 1];
    const blue = data[index + 2];
    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const saturation = max - min;
    const isLikelyText = max > 145 || (saturation > 45 && max > 90);
    const output = isLikelyText ? 0 : 255;

    data[index] = output;
    data[index + 1] = output;
    data[index + 2] = output;
  }
}

async function updateProcessedPreview() {
  const renderId = ++ocrPreviewRenderId;

  if (!ocrImageFile) {
    elements.ocrProcessedPreview.hidden = true;
    return;
  }

  try {
    const canvas = await prepareOcrImage(ocrImageFile, state.ocr.mode);

    if (renderId !== ocrPreviewRenderId) {
      return;
    }

    elements.ocrProcessedPreview.width = canvas.width;
    elements.ocrProcessedPreview.height = canvas.height;
    elements.ocrProcessedPreview.getContext("2d").drawImage(canvas, 0, 0);
    elements.ocrProcessedPreview.hidden = false;
  } catch (error) {
    setOcrStatus(`Nao foi possivel atualizar a previa do OCR: ${error.message}`);
  }
}

async function testAllOcrModes() {
  if (!ocrImageFile) {
    setOcrStatus("Selecione, arraste ou cole uma imagem antes de testar os modos.");
    return;
  }

  const modes = ["threshold", "contrast", "scale", "original"];
  elements.runOcr.disabled = true;
  elements.testOcrModes.disabled = true;
  setOcrStatus("Preparando OCR para testar todos os modos...");

  try {
    await loadTesseract();
    const results = [];

    for (const [index, mode] of modes.entries()) {
      setOcrStatus(`Testando ${getOcrModeLabel(mode)} (${index + 1}/${modes.length})...`);
      const input = await prepareOcrImage(ocrImageFile, mode);
      const text = await recognizeOcrInput(input);
      const report = parseOcrAttributes(text);

      results.push({
        mode,
        text,
        report,
        score: scoreOcrReport(text, report),
      });
    }

    const bestResult = results.sort((first, second) => second.score - first.score)[0];
    state.ocr.mode = bestResult.mode;
    state.ocr.text = bestResult.text;
    state.ocr.appliedIgnoredLines = [];
    state.ocr.manualMatches = [];
    state.ocr.matchOverrides = {};
    state.ocr.deletedMatchClusters = [];
    state.ocr.deletedIgnoredLines = [];
    elements.ocrMode.value = bestResult.mode;
    elements.ocrText.value = bestResult.text;
    saveState();
    updateProcessedPreview();
    renderOcrReport(bestResult.report, `Melhor modo: ${getOcrModeLabel(bestResult.mode)}.`);
  } catch (error) {
    setOcrStatus(`Nao foi possivel testar os modos: ${error.message}`);
  } finally {
    elements.runOcr.disabled = false;
    elements.testOcrModes.disabled = false;
  }
}

function scoreOcrReport(text, report) {
  const totals = getOcrAttributeTotals(report.matches);
  const uniqueAttributes = Object.keys(totals).length;
  const importantAttributes = attributes.filter((attribute) => attribute.key in totals).length;

  return report.matches.length * 15 + uniqueAttributes * 20 + importantAttributes * 12 - report.ignored.length + Math.min(text.length, 500) / 100;
}

function loadTesseract() {
  if (window.Tesseract) {
    return Promise.resolve();
  }

  if (tesseractScriptPromise) {
    return tesseractScriptPromise;
  }

  tesseractScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = TESSERACT_SCRIPT_URL;
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error("Nao foi possivel carregar a biblioteca OCR. Verifique sua conexao com a internet."));
    document.head.append(script);
  });

  return tesseractScriptPromise;
}

async function pasteOcrImageFromClipboard() {
  if (!navigator.clipboard?.read) {
    setOcrStatus("Este navegador nao permite ler imagem pelo botao. Clique na area de OCR e pressione Ctrl+V.");
    elements.ocrDropZone.focus();
    return;
  }

  try {
    const clipboardItems = await navigator.clipboard.read();
    const imageType = clipboardItems.flatMap((item) => item.types).find((type) => type.startsWith("image/"));

    if (!imageType) {
      setOcrStatus("Nenhuma imagem encontrada na area de transferencia.");
      return;
    }

    const clipboardItem = clipboardItems.find((item) => item.types.includes(imageType));
    const blob = await clipboardItem.getType(imageType);
    loadOcrImage(new File([blob], "print-colado.png", { type: imageType }));
  } catch (error) {
    setOcrStatus(`Nao foi possivel colar pelo botao. Clique na area de OCR e pressione Ctrl+V. Detalhe: ${error.message}`);
    elements.ocrDropZone.focus();
  }
}

function getFirstImageFile(files) {
  return Array.from(files || []).find((file) => file.type.startsWith("image/")) || null;
}

function getClipboardImageFile(clipboardData) {
  const fileFromFiles = getFirstImageFile(clipboardData?.files);

  if (fileFromFiles) {
    return fileFromFiles;
  }

  const imageItem = Array.from(clipboardData?.items || []).find((item) => item.type.startsWith("image/"));
  return imageItem?.getAsFile() || null;
}

function applyOcrToCandidate() {
  const report = parseOcrAttributes(state.ocr.text);
  const parsedEntries = Object.entries(getOcrAttributeTotals(report.matches));

  if (parsedEntries.length === 0) {
    renderOcrReport(report, "Nenhum atributo reconhecido para aplicar na arma nova.");
    return;
  }

  parsedEntries.forEach(([key, value]) => {
    state.candidate[key] = String(value);
  });

  syncFormValues();
  persistAndRender();
  renderOcrReport(report, `${parsedEntries.length} atributos aplicados na arma nova.`);
}

function clearOcr() {
  state.ocr.text = "";
  state.ocr.appliedIgnoredLines = [];
  state.ocr.manualMatches = [];
  state.ocr.matchOverrides = {};
  state.ocr.deletedMatchClusters = [];
  state.ocr.deletedIgnoredLines = [];
  elements.ocrText.value = "";
  clearOcrImagePreview();
  saveState();
  setOcrStatus("Nenhuma imagem selecionada.");
}

function clearOcrImagePreview() {
  elements.ocrImage.value = "";
  ocrImageFile = null;

  if (ocrPreviewUrl) {
    URL.revokeObjectURL(ocrPreviewUrl);
    ocrPreviewUrl = null;
  }

  elements.ocrPreview.hidden = true;
  elements.ocrPreview.removeAttribute("src");
  elements.ocrProcessedPreview.hidden = true;
}

function parseOcrAttributes(text) {
  const report = {
    matches: getManualOcrMatches().map(applyOcrMatchOverride).filter(Boolean),
    ignored: [],
  };
  let currentSection = "";

  text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      const normalizedLine = normalizeOcrText(line);
      const section = getOcrSectionLabel(line, normalizedLine);

      if (section) {
        currentSection = section;
        return;
      }

      if (isOcrLineAppliedManually(normalizedLine) || isIgnoredOcrLineDeleted(normalizedLine)) {
        return;
      }

      const attribute = findOcrAttribute(normalizedLine);
      const value = attribute ? extractOcrValue(line) : null;

      if (!attribute || value === null || hasMultipleSignedOcrValues(line)) {
        report.ignored.push({
          line,
          suggestedKey: attribute?.key || guessOcrAttribute(normalizedLine)?.key || "",
          suggestedValue: value ?? extractOcrValue(line) ?? "",
        });
        return;
      }

      createOcrMatches(attribute, normalizedLine, line, value, currentSection).forEach((match) => addOcrMatch(report.matches, match));
    });

  report.matches = dedupeOcrMatches(report.matches);
  return report;
}

function createOcrMatches(attribute, normalizedLine, line, value, section) {
  const keys = attribute.key === "magicAttack" && isAllAttackOcrLine(normalizedLine) ? ["magicAttack", "attack"] : [attribute.key];

  return keys.map((key) => ({
    key,
    label: getAttributeLabel(key),
    line,
    value,
    section,
    shared: keys.length > 1,
  }));
}

function isAllAttackOcrLine(normalizedLine) {
  return /\b(aumentou todos os ataques|todos os ataques|all attack)\b/.test(normalizedLine);
}

function getOcrSectionLabel(line, normalizedLine) {
  if (/[+＋-]\s*\d/.test(line)) {
    return "";
  }

  const bracketMatch = line.match(/\[\s*([^\]]+)\s*\]/);

  if (bracketMatch) {
    return bracketMatch[1].trim();
  }

  if (/\b(opcao geral|opcao epica|opcao|aprimoramento extremo|nivel do aprimoramento divino|nivel divino)\b/.test(normalizedLine)) {
    return line.replace(/[\[\]]/g, "").trim();
  }

  return "";
}

function hasMultipleSignedOcrValues(line) {
  return [...line.matchAll(/[+＋-]\s*[0-9OoIl|ZzSsBbHhDd&]+(?:[.,][0-9OoIl|ZzSsBbHhDd&]+)?/g)].length > 1;
}

function addOcrMatch(matches, candidate) {
  const match = applyOcrMatchOverride(candidate);

  if (match) {
    matches.push(match);
  }
}

function applyOcrMatchOverride(match) {
  const id = createOcrMatchId(match);
  const override = getOcrMatchOverrides()[id];

  if (override?.deleted || isOcrMatchDeletedByCluster(match)) {
    return null;
  }

  return {
    ...match,
    id,
    value: override?.value ?? match.value,
  };
}

function createOcrMatchId(match) {
  return [match.manual ? "manual" : "auto", match.key, match.section || "", normalizeOcrText(match.line)].join("|");
}

function getOcrMatchOverrides() {
  return state.ocr.matchOverrides && typeof state.ocr.matchOverrides === "object" ? state.ocr.matchOverrides : {};
}

function setOcrMatchOverride(id, patch) {
  state.ocr.matchOverrides = {
    ...getOcrMatchOverrides(),
    [id]: {
      ...getOcrMatchOverrides()[id],
      ...patch,
    },
  };
}

function getDeletedOcrMatchClusters() {
  return Array.isArray(state.ocr.deletedMatchClusters) ? state.ocr.deletedMatchClusters : [];
}

function deleteOcrMatchCluster(match) {
  const cluster = {
    key: match.key,
    section: match.section || "",
    signature: getOcrLineSignature(match.line),
    value: match.value,
  };

  state.ocr.deletedMatchClusters = [...getDeletedOcrMatchClusters(), cluster];
}

function isOcrMatchDeletedByCluster(match) {
  return getDeletedOcrMatchClusters().some((cluster) => {
    return cluster.key === match.key && cluster.section === (match.section || "") && cluster.signature === getOcrLineSignature(match.line) && areCloseOcrValues(cluster.value, match.value);
  });
}

function dedupeOcrMatches(matches) {
  const grouped = new Map();
  const output = [];

  matches.forEach((match, index) => {
    if (match.manual) {
      output.push({ match, index });
      return;
    }

    const key = [match.key, match.section || "", getOcrLineSignature(match.line)].join("|");
    const group = grouped.get(key) || [];
    group.push({ match, index });
    grouped.set(key, group);
  });

  grouped.forEach((group) => {
    getOcrValueClusters(group).forEach((cluster) => output.push(chooseBestOcrClusterMatch(cluster)));
  });

  return output.sort((first, second) => first.index - second.index).map((entry) => entry.match);
}

function getOcrValueClusters(group) {
  return group.reduce((clusters, entry) => {
    const cluster = clusters.find((candidate) => candidate.some((item) => areCloseOcrValues(item.match.value, entry.match.value)));

    if (cluster) {
      cluster.push(entry);
    } else {
      clusters.push([entry]);
    }

    return clusters;
  }, []);
}

function chooseBestOcrClusterMatch(cluster) {
  const valueCounts = cluster.reduce((counts, entry) => {
    const key = String(roundNumber(entry.match.value, 2));
    counts.set(key, (counts.get(key) || 0) + 1);
    return counts;
  }, new Map());

  return cluster
    .map((entry) => ({
      ...entry,
      valueCount: valueCounts.get(String(roundNumber(entry.match.value, 2))) || 0,
      lineLength: normalizeOcrText(entry.match.line).length,
    }))
    .sort((first, second) => {
      if (second.valueCount !== first.valueCount) {
        return second.valueCount - first.valueCount;
      }

      if (first.lineLength !== second.lineLength) {
        return first.lineLength - second.lineLength;
      }

      return first.match.value - second.match.value;
    })[0];
}

function getOcrLineSignature(line) {
  const normalizedLine = normalizeOcrText(line)
    .replace(/\bataquemagico\b/g, "ataque magico")
    .replace(/\btodososataques\b/g, "todos os ataques")
    .replace(/\d+(?:[.,]\d+)?/g, "#")
    .replace(/[^a-z#+%-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const valuePrefix = normalizedLine.match(/^(.*?[+-]\s*#%?)/);

  return valuePrefix ? valuePrefix[1].trim() : normalizedLine;
}

function areCloseOcrValues(firstValue, secondValue) {
  const tolerance = Math.max(1, Math.abs(firstValue) * 0.1, Math.abs(secondValue) * 0.1);
  return Math.abs(firstValue - secondValue) <= tolerance;
}

function isOcrLineAppliedManually(normalizedLine) {
  return state.ocr.appliedIgnoredLines?.includes(normalizedLine);
}

function addManualOcrMatch(line, key, value) {
  const normalizedLine = normalizeOcrText(line);

  if (!normalizedLine) {
    return;
  }

  state.ocr.appliedIgnoredLines = [...new Set([...(state.ocr.appliedIgnoredLines || []), normalizedLine])];
  state.ocr.manualMatches = [
    ...getManualOcrMatches().filter((match) => normalizeOcrText(match.line) !== normalizedLine),
    {
      key,
      label: getAttributeLabel(key),
      line,
      value,
      manual: true,
    },
  ];
}

function getManualOcrMatches() {
  return Array.isArray(state.ocr.manualMatches) ? state.ocr.manualMatches : [];
}

function isIgnoredOcrLineDeleted(normalizedLine) {
  return state.ocr.deletedIgnoredLines?.includes(normalizedLine);
}

function deleteIgnoredOcrLine(line) {
  const normalizedLine = normalizeOcrText(line);

  if (!normalizedLine) {
    return;
  }

  state.ocr.deletedIgnoredLines = [...new Set([...(state.ocr.deletedIgnoredLines || []), normalizedLine])];
}

function findOcrAttribute(normalizedLine) {
  if (/\b(limite|maxima|maximo)\b/.test(normalizedLine)) {
    return null;
  }

  const derivedAttribute = guessDerivedOcrAttribute(normalizedLine);

  if (derivedAttribute) {
    return derivedAttribute;
  }

  return ocrAttributePatterns.find((attribute) => attribute.labels.some((label) => normalizedLine.includes(label))) || guessOcrAttribute(normalizedLine);
}

function guessDerivedOcrAttribute(normalizedLine) {
  if (normalizedLine.includes("%") && /\b(aumentou todos os ataques|todos os ataques)\b|attack\s*%/.test(normalizedLine)) {
    return getOcrPatternByKey("attackPercent");
  }

  return null;
}

function guessOcrAttribute(normalizedLine) {
  const compactLine = normalizedLine.replace(/[^a-z0-9%+.,-]/g, "");
  const hasCriticalText = normalizedLine.includes("critic") || compactLine.includes("critic");

  if (hasCriticalText && /\b(dano|danos|damage|dmg)\b/.test(normalizedLine)) {
    return getOcrPatternByKey("criticalDamage");
  }

  if (hasCriticalText && /\b(ta|taxa|texa|rate|critica)\b/.test(normalizedLine)) {
    return getOcrPatternByKey("criticalRate");
  }

  return null;
}

function getOcrPatternByKey(key) {
  return ocrAttributePatterns.find((attribute) => attribute.key === key) || null;
}

function extractOcrValue(line) {
  const signedMatch = line.match(/[+＋-]\s*([0-9OoIl|ZzSsBbHhDd&]+(?:[.,][0-9OoIl|ZzSsBbHhDd&]+)?)/);

  if (signedMatch) {
    const value = parseOcrNumber(signedMatch[1]);
    return signedMatch[0].includes("-") ? -value : value;
  }

  const percentMatch = line.match(/(\d+(?:[.,]\d+)?)\s*%/);

  if (percentMatch) {
    return parseOcrNumber(percentMatch[1]);
  }

  const percentFallback = extractOcrPercentFallback(line);

  if (percentFallback !== null) {
    return percentFallback;
  }

  const allNumbers = [...line.matchAll(/\d+(?:[.,]\d+)?/g)].map((match) => parseOcrNumber(match[0]));

  if (allNumbers.length === 1 && /\b(slot|encaixe|opcao|opção)\b/i.test(line)) {
    return null;
  }

  return allNumbers.length > 0 ? allNumbers.at(-1) : null;
}

function parseOcrNumber(value) {
  return Number.parseFloat(correctOcrNumberText(value).replace(",", "."));
}

function correctOcrNumberText(value) {
  return String(value)
    .replace(/&/g, "8")
    .replace(/[OoDd]/g, "0")
    .replace(/[Il|]/g, "1")
    .replace(/[Zz]/g, "2")
    .replace(/[Ss]/g, "5")
    .replace(/[BbHh]/g, "8");
}

function extractOcrPercentFallback(line) {
  const percentIndex = line.indexOf("%");

  if (percentIndex === -1) {
    return null;
  }

  const tailBeforePercent = line.slice(Math.max(0, percentIndex - 8), percentIndex);
  const correctedTail = tailBeforePercent
    .replace(/[Oo]/g, "0")
    .replace(/[Il|]/g, "1")
    .replace(/[Zz]/g, "2")
    .replace(/[Ss]/g, "5")
    .replace(/[BbHh]/g, "8")
    .replace(/[^0-9.,]/g, "");

  const correctedMatch = correctedTail.match(/\d+(?:[.,]\d+)?/g);

  if (!correctedMatch) {
    return null;
  }

  return parseOcrNumber(correctedMatch.at(-1));
}

function renderOcrReport(report, message = "") {
  if (!state.ocr.text.trim()) {
    setOcrStatus("Nenhuma imagem selecionada.");
    return;
  }

  if (report.matches.length === 0 && report.ignored.length === 0) {
    setOcrStatus(message || "Nenhum atributo reconhecido. Voce pode corrigir o texto manualmente e tentar aplicar de novo.");
    return;
  }

  const recognizedText = report.matches.length > 0 ? renderRecognizedOcrLines(report.matches) : "";
  const ignoredText = report.ignored.length > 0 ? renderIgnoredOcrLines(report.ignored) : "";
  const summary = report.matches.length > 0 ? `${report.matches.length} linhas reconhecidas.` : "Nenhuma linha reconhecida automaticamente.";

  elements.ocrStatus.innerHTML = `
    <div class="ocr-report">
      <strong>${message || summary}</strong>
      ${recognizedText}
      ${ignoredText}
    </div>
  `;
}

function renderRecognizedOcrLines(matches) {
  const groups = getOcrAttributeGroups(matches);

  return `
    <div class="ocr-recognized">
      <strong>Linhas reconhecidas:</strong>
      ${groups
        .map((group) => `
          <div class="ocr-recognized-group">
            <div class="ocr-recognized-group-title">
              <strong>${escapeHtml(group.label)}</strong>
              <span>${group.count} ${group.count === 1 ? "linha" : "linhas"}</span>
            </div>
            ${group.matches
              .map((match) => `
                <div class="ocr-recognized-row">
                  <code>${escapeHtml(match.line)}</code>
                  <input data-ocr-match-value="${escapeHtml(match.id)}" type="number" step="0.1" value="${escapeHtml(match.value)}" aria-label="Valor reconhecido para ${escapeHtml(group.label)}" />
                  <button class="secondary-button table-button icon-button" type="button" data-delete-ocr-match="${escapeHtml(match.id)}" title="Excluir" aria-label="Excluir linha reconhecida">&#128465;</button>
                  ${match.manual ? `<small>Manual</small>` : ""}
                </div>
              `)
              .join("")}
            <div class="ocr-recognized-total">
              <span>Total ${escapeHtml(group.label)}</span>
              <strong>${formatNumber(group.total, 2)}</strong>
            </div>
          </div>
        `)
        .join("")}
    </div>
  `;
}

function getOcrAttributeGroups(matches) {
  const grouped = new Map();

  matches.forEach((match) => {
    const group = grouped.get(match.key) || {
      key: match.key,
      label: getAttributeLabel(match.key),
      total: 0,
      count: 0,
      matches: [],
    };

    group.total = roundNumber(group.total + match.value, 2);
    group.count += 1;
    group.matches.push(match);
    grouped.set(match.key, group);
  });

  return [...grouped.values()];
}

function getOcrAttributeTotals(matches) {
  return Object.fromEntries(getOcrAttributeGroups(matches).map((group) => [group.key, group.total]));
}

function renderIgnoredOcrLines(ignoredLines) {
  return `
    <div class="ocr-ignored">
      <strong>${ignoredLines.length} linhas ignoradas. Corrija manualmente se necessario:</strong>
      ${ignoredLines
        .map((ignoredLine, index) => `
          <div class="ocr-ignored-row" data-ignored-index="${index}">
            <code>${escapeHtml(ignoredLine.line)}</code>
            <select data-ignored-attribute>
              <option value="">Atributo...</option>
              ${renderAttributeOptions(ignoredLine.suggestedKey)}
            </select>
            <input data-ignored-value type="number" step="0.1" placeholder="Valor" value="${escapeHtml(ignoredLine.suggestedValue)}" />
            <button class="secondary-button table-button" type="button" data-apply-ignored-line>Aplicar</button>
            <button class="secondary-button table-button icon-button" type="button" data-delete-ignored-line title="Excluir" aria-label="Excluir linha ignorada">&#128465;</button>
          </div>
        `)
        .join("")}
    </div>
  `;
}

function renderAttributeOptions(selectedKey) {
  return attributes
    .map((attribute) => `<option value="${attribute.key}" ${attribute.key === selectedKey ? "selected" : ""}>${attribute.label}</option>`)
    .join("");
}

async function handleOcrStatusClick(event) {
  if (!(event.target instanceof Element)) {
    return;
  }

  const deleteButton = event.target.closest("[data-delete-ocr-match]");

  if (deleteButton) {
    if (!(await confirmOcrLineDeletion())) {
      return;
    }

    const report = parseOcrAttributes(state.ocr.text);
    const match = report.matches.find((candidate) => candidate.id === deleteButton.dataset.deleteOcrMatch);
    const matchesToDelete = match ? getLinkedOcrMatches(report.matches, match) : [];

    matchesToDelete.forEach((candidate) => {
      deleteOcrMatchCluster(candidate);
      setOcrMatchOverride(candidate.id, { deleted: true });
    });

    saveState();
    renderOcrReport(parseOcrAttributes(state.ocr.text), "Linha reconhecida removida do OCR.");
    return;
  }

  const deleteIgnoredButton = event.target.closest("[data-delete-ignored-line]");

  if (deleteIgnoredButton) {
    if (!(await confirmOcrLineDeletion())) {
      return;
    }

    const row = deleteIgnoredButton.closest("[data-ignored-index]");
    const line = row.querySelector("code").textContent;
    deleteIgnoredOcrLine(line);
    saveState();
    renderOcrReport(parseOcrAttributes(state.ocr.text), "Linha ignorada removida do OCR.");
    return;
  }

  applyIgnoredOcrLine(event);
}

function confirmOcrLineDeletion() {
  if (!elements.deleteLineDialog?.showModal) {
    return Promise.resolve(window.confirm("Esta linha será excluída do relatório OCR. Deseja continuar?"));
  }

  return new Promise((resolve) => {
    let settled = false;

    const finish = (result) => {
      if (settled) {
        return;
      }

      settled = true;
      elements.confirmDeleteLine.removeEventListener("click", confirm);
      elements.cancelDeleteLine.removeEventListener("click", cancel);
      elements.deleteLineDialog.removeEventListener("cancel", cancel);
      elements.deleteLineDialog.removeEventListener("close", close);

      if (elements.deleteLineDialog.open) {
        elements.deleteLineDialog.close();
      }

      resolve(result);
    };

    const confirm = () => finish(true);
    const cancel = (event) => {
      event?.preventDefault();
      finish(false);
    };
    const close = () => finish(false);

    elements.confirmDeleteLine.addEventListener("click", confirm);
    elements.cancelDeleteLine.addEventListener("click", cancel);
    elements.deleteLineDialog.addEventListener("cancel", cancel);
    elements.deleteLineDialog.addEventListener("close", close);
    elements.deleteLineDialog.showModal();
  });
}

function updateRecognizedOcrLine(event) {
  if (!(event.target instanceof Element) || !event.target.matches("[data-ocr-match-value]")) {
    return;
  }

  const value = toFlexibleNumber(event.target.value);

  if (value === null) {
    setOcrStatus("Informe um valor valido para ajustar a linha reconhecida.");
    return;
  }

  const report = parseOcrAttributes(state.ocr.text);
  const match = report.matches.find((candidate) => candidate.id === event.target.dataset.ocrMatchValue);
  const matchesToUpdate = match ? getLinkedOcrMatches(report.matches, match) : [];

  if (matchesToUpdate.length === 0) {
    setOcrMatchOverride(event.target.dataset.ocrMatchValue, { value });
  } else {
    matchesToUpdate.forEach((candidate) => setOcrMatchOverride(candidate.id, { value }));
  }

  saveState();
  renderOcrReport(parseOcrAttributes(state.ocr.text), "Valor reconhecido ajustado.");
}

function getLinkedOcrMatches(matches, match) {
  if (!match.shared) {
    return [match];
  }

  const line = normalizeOcrText(match.line);

  return matches.filter((candidate) => {
    return candidate.shared && candidate.section === match.section && normalizeOcrText(candidate.line) === line && areCloseOcrValues(candidate.value, match.value);
  });
}

function applyIgnoredOcrLine(event) {
  if (!(event.target instanceof Element)) {
    return;
  }

  const button = event.target.closest("[data-apply-ignored-line]");

  if (!button) {
    return;
  }

  const row = button.closest("[data-ignored-index]");
  const line = row.querySelector("code").textContent;
  const attributeKey = row.querySelector("[data-ignored-attribute]").value;
  const value = toFlexibleNumber(row.querySelector("[data-ignored-value]").value);

  if (!attributeKey || value === null) {
    setOcrStatus("Escolha um atributo e informe um valor para aplicar a linha ignorada.");
    return;
  }

  state.candidate[attributeKey] = String(value);
  addManualOcrMatch(line, attributeKey, value);
  syncFormValues();
  persistAndRender();
  renderOcrReport(parseOcrAttributes(state.ocr.text), `${getAttributeLabel(attributeKey)} aplicado manualmente.`);
}

function setOcrStatus(message) {
  elements.ocrStatus.textContent = message;
}

function renderCandidateOptions() {
  if (state.candidateOptions.length === 0) {
    elements.candidateTable.innerHTML = `<tr><td colspan="9">Nenhuma arma candidata salva.</td></tr>`;
    return;
  }

  const sortedOptions = state.candidateOptions.map(enrichCandidateOption).sort(compareCandidateOptions);

  elements.candidateTable.innerHTML = sortedOptions
    .map((option, index) => {
      const pcClass = option.total > 0 ? "impact-positive" : option.total < 0 ? "impact-negative" : "";
      const rowClass = index === 0 && option.total > 0 ? "best-candidate" : "";

      return `
        <tr class="${rowClass}">
          <td>${index + 1}</td>
          <td>${escapeHtml(option.name)}</td>
          <td class="${pcClass}">${formatSigned(option.total)}</td>
          <td>${option.candidatePriceBi === null ? "Sem preço" : formatAlzes(option.candidatePriceBi)}</td>
          <td>${option.investmentBi === null ? "Indisponível" : formatSignedAlzes(option.investmentBi)}</td>
          <td>${option.efficiency === null ? "Indisponível" : formatNumber(option.efficiency, 3)}</td>
          <td><span class="rating ${option.evaluation.tone}">${option.evaluation.label}</span></td>
          <td>${escapeHtml(option.note || "-")}</td>
          <td>
            <div class="table-actions">
              <button class="secondary-button table-button" type="button" data-load-candidate="${option.id}">Carregar</button>
              <button class="secondary-button table-button" type="button" data-remove-candidate="${option.id}">Remover</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

function enrichCandidateOption(option) {
  const rows = getComparisonRows(option.attributes || {});
  const total = rows.reduce((sum, row) => sum + row.impact, 0);
  const currentPriceBi = priceToBi(state.market.currentPriceValue, state.market.currentPriceUnit);
  const candidatePriceBi = priceToBi(option.market?.candidatePriceValue, option.market?.candidatePriceUnit || "kk");
  const hasCurrentPrice = currentPriceBi !== null && currentPriceBi > 0;
  const investmentBi = candidatePriceBi === null || candidatePriceBi <= 0 ? null : hasCurrentPrice ? candidatePriceBi - currentPriceBi : candidatePriceBi;
  const efficiency = investmentBi !== null && investmentBi > 0 ? total / (investmentBi * 1000) : null;
  const evaluation = investmentBi === null ? getMissingPriceEvaluation(total) : getCostEvaluation(total, investmentBi, efficiency);

  return {
    ...option,
    total,
    candidatePriceBi,
    investmentBi,
    efficiency,
    evaluation,
    note: option.market?.note || "",
  };
}

function compareCandidateOptions(first, second) {
  if (state.candidateSort === "pc") {
    return second.total - first.total;
  }

  if (state.candidateSort === "price") {
    return nullableSortValue(first.candidatePriceBi) - nullableSortValue(second.candidatePriceBi);
  }

  return getValueSortScore(second) - getValueSortScore(first);
}

function getValueSortScore(option) {
  if (option.total > 0 && option.investmentBi !== null && option.investmentBi < 0) {
    return Number.POSITIVE_INFINITY;
  }

  return option.efficiency ?? Number.NEGATIVE_INFINITY;
}

function nullableSortValue(value) {
  return value === null ? Number.POSITIVE_INFINITY : value;
}

function getMissingPriceEvaluation(total) {
  if (total <= 0) {
    return {
      label: "Não compensa pelo PC",
      detail: "A troca reduz ou não altera os Pontos de Combate.",
      tone: "negative",
    };
  }

  return {
    label: "Sem preço",
    detail: "Informe o preço para avaliar custo-benefício.",
    tone: "neutral",
  };
}

function renderCostStat(label, value, hint) {
  return `
    <div class="cost-stat">
      <span>${label}</span>
      <strong>${value}</strong>
      <small>${hint}</small>
    </div>
  `;
}

function getCostEvaluation(total, investmentBi, efficiency) {
  if (total <= 0) {
    return {
      label: "Não compensa pelo PC",
      detail: "A troca reduz ou não altera os Pontos de Combate.",
      tone: "negative",
    };
  }

  if (investmentBi < 0) {
    return {
      label: "Excelente custo-benefício",
      detail: "Ganha PC e a arma nova é mais barata que a atual.",
      tone: "positive",
    };
  }

  if (investmentBi === 0) {
    return {
      label: "Excelente custo-benefício",
      detail: "Ganha PC sem custo líquido informado.",
      tone: "positive",
    };
  }

  if (efficiency >= 5) {
    return {
      label: "Excelente custo-benefício",
      detail: "Muito PC ganho por kk investido.",
      tone: "positive",
    };
  }

  if (efficiency >= 2) {
    return {
      label: "Bom custo-benefício",
      detail: "Ganho de PC consistente para o preço.",
      tone: "positive",
    };
  }

  if (efficiency >= 1) {
    return {
      label: "Custo-benefício razoável",
      detail: "Pode valer se o item tiver outros benefícios.",
      tone: "neutral",
    };
  }

  return {
    label: "Caro pelo ganho",
    detail: "O ganho de PC é baixo para o preço informado.",
    tone: "negative",
  };
}

function renderValidationStat(label, value, hint) {
  return `
    <div class="validation-stat">
      <span>${label}</span>
      <strong>${value}</strong>
      <small>${hint}</small>
    </div>
  `;
}

function buildValidationLabel() {
  const currentName = state.currentName.trim() || "Arma atual";
  const candidateName = state.candidateName.trim() || "Arma nova";

  return `${currentName} -> ${candidateName}`;
}

function hasCandidateInput() {
  return Boolean(state.candidateName.trim()) || attributes.some((attribute) => state.candidate[attribute.key] !== "");
}

function showCostMessage(message) {
  elements.costSummary.innerHTML = `<div class="cost-empty">${message}</div>`;
}

function persistAndRender() {
  saveState();
  calculateAndRender();
}

function createDefaultState(validationHistory) {
  return {
    currentName: "",
    candidateName: "",
    current: Object.fromEntries(attributes.map((attribute) => [attribute.key, ""])),
    candidate: Object.fromEntries(attributes.map((attribute) => [attribute.key, ""])),
    weights: Object.fromEntries(attributes.map((attribute) => [attribute.key, attribute.defaultWeight])),
    realDifference: "",
    market: { ...defaultMarket },
    candidateOptions: [],
    candidateSort: "value",
    ocr: { text: "", mode: "threshold", appliedIgnoredLines: [], manualMatches: [], matchOverrides: {}, deletedMatchClusters: [], deletedIgnoredLines: [] },
    validationHistory: validationHistory.map((record) => ({ ...record })),
  };
}

function loadState() {
  try {
    const storedState = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (!storedState) {
      return structuredClone(defaultState);
    }

    return {
      ...structuredClone(defaultState),
      ...storedState,
      current: { ...defaultState.current, ...storedState.current },
      candidate: { ...defaultState.candidate, ...storedState.candidate },
      weights: { ...defaultState.weights, ...storedState.weights },
      market: { ...defaultState.market, ...storedState.market },
      candidateOptions: Array.isArray(storedState.candidateOptions) ? storedState.candidateOptions : defaultState.candidateOptions,
      candidateSort: storedState.candidateSort || defaultState.candidateSort,
      ocr: {
        text: storedState.ocr?.text || defaultState.ocr.text,
        mode: storedState.ocr?.mode || defaultState.ocr.mode,
        appliedIgnoredLines: Array.isArray(storedState.ocr?.appliedIgnoredLines) ? storedState.ocr.appliedIgnoredLines : [],
        manualMatches: Array.isArray(storedState.ocr?.manualMatches) ? storedState.ocr.manualMatches : [],
        matchOverrides: storedState.ocr?.matchOverrides && typeof storedState.ocr.matchOverrides === "object" ? storedState.ocr.matchOverrides : {},
        deletedMatchClusters: Array.isArray(storedState.ocr?.deletedMatchClusters) ? storedState.ocr.deletedMatchClusters : [],
        deletedIgnoredLines: Array.isArray(storedState.ocr?.deletedIgnoredLines) ? storedState.ocr.deletedIgnoredLines : [],
      },
      validationHistory: Array.isArray(storedState.validationHistory) ? storedState.validationHistory : defaultState.validationHistory,
    };
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function setInputValue(selector, value) {
  const input = document.querySelector(selector);

  if (input) {
    input.value = value ?? "";
  }
}

function toNumber(value) {
  const number = Number.parseFloat(value);
  return Number.isFinite(number) ? number : 0;
}

function priceToBi(value, unit) {
  const number = toFlexibleNumber(value);

  if (number === null) {
    return null;
  }

  return unit === "kk" ? number / 1000 : number;
}

function toFlexibleNumber(value) {
  const rawValue = String(value ?? "").trim();

  if (!rawValue) {
    return null;
  }

  const normalizedValue = rawValue.includes(",")
    ? rawValue.replace(/\./g, "").replace(",", ".")
    : rawValue;
  const number = Number.parseFloat(normalizedValue);

  return Number.isFinite(number) ? number : null;
}

function normalizeOcrText(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9%+.,-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getOcrModeLabel(mode) {
  const labels = {
    original: "Original",
    scale: "Ampliado",
    contrast: "Contraste",
    threshold: "Preto e branco",
  };

  return labels[mode] || labels.threshold;
}

function getAttributeLabel(key) {
  return attributes.find((attribute) => attribute.key === key)?.label || key;
}

function roundNumber(value, digits) {
  return Number(value.toFixed(digits));
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function formatSigned(value) {
  if (value === 0) {
    return "0";
  }

  return `${value > 0 ? "+" : "-"}${formatNumber(Math.abs(value))}`;
}

function formatNumber(value, maximumFractionDigits = 1) {
  return new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits,
  }).format(value);
}

function formatAlzes(valueBi) {
  if (Math.abs(valueBi) < 1) {
    return `${formatNumber(valueBi * 1000, 1)} kk (${formatNumber(valueBi, 3)} bi)`;
  }

  return `${formatNumber(valueBi, 3)} bi`;
}

function formatSignedAlzes(valueBi) {
  if (valueBi === 0) {
    return "0";
  }

  return `${valueBi > 0 ? "+" : "-"}${formatAlzes(Math.abs(valueBi))}`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
    };

    return entities[character];
  });
}
