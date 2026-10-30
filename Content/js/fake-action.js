const presets = window.presets;
const colorPresets = presets.colorPresets;
const namePresets = presets.namePresets;
const actionPresets = presets.actionPresets;

const picker = document.getElementById('colorPicker');
const hexInput = document.getElementById('color');
picker.oninput = () => hexInput.value = picker.value;
hexInput.oninput = () => picker.value = hexInput.value;

function applyColor(value) {
  if (value) {
    hexInput.value = value;
    picker.value = value;
  }
}
function applyName(value) {
  if (value) document.getElementById('name').value = value;
}
function applyAction(value) {
  if (value) document.getElementById('action').value = value;
}

function generate() {
  const actionType = document.getElementById('actionType').value;
  const color = hexInput.value.trim();
  let name = document.getElementById('name').value.trim();
  let action = document.getElementById('action').value.trim();

  if (!name) name = "name";
  if (!action) action = "does something";

  let output = "";
  if (actionType === "global") {
    output = `/it {#888888 [}{#ff0000 RP}{#888888 ]} {${color} ${name}}: ${action}`;
  } else {
    output = `/it {${color} ${name} ${action}}`;
  }
  document.getElementById('output').value = output;
}

function copy() {
  const out = document.getElementById('output');
  out.select();
  navigator.clipboard.writeText(out.value);
}

function buildCustomSelect(containerId, presets, onSelectCallback) {
  const container = document.getElementById(containerId);
  const trigger = container.querySelector('.select-trigger');
  const dropdownDiv = container.querySelector('.select-dropdown');
  const searchInput = dropdownDiv.querySelector('.dropdown-search');
  const optionsList = dropdownDiv.querySelector('.options-list');

  let currentOptions = [...presets];
  let selectedValue = presets[0]?.value || "";

  function renderOptions(filterText = "") {
    optionsList.innerHTML = "";
    const lowerFilter = filterText.toLowerCase();
    const filtered = currentOptions.filter(opt => 
      opt.label.toLowerCase().includes(lowerFilter)
    );
    if (filtered.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'option';
      empty.textContent = '-- no matches --';
      empty.style.cursor = 'default';
      empty.style.opacity = '0.6';
      optionsList.appendChild(empty);
      return;
    }
    filtered.forEach(opt => {
      const optionDiv = document.createElement('div');
      optionDiv.className = 'option';
      optionDiv.textContent = opt.label;
      if (opt.value === selectedValue) optionDiv.classList.add('selected');
      optionDiv.addEventListener('click', (e) => {
        e.stopPropagation();
        selectedValue = opt.value;
        trigger.textContent = opt.label;
        onSelectCallback(opt.value);
        container.classList.remove('open');
      });
      optionsList.appendChild(optionDiv);
    });
  }

  searchInput.addEventListener('input', (e) => {
    renderOptions(e.target.value);
  });

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = container.classList.contains('open');
    document.querySelectorAll('.custom-select').forEach(cs => cs.classList.remove('open'));
    if (!isOpen) {
      container.classList.add('open');
      renderOptions(searchInput.value);
      searchInput.focus();
    } else {
      container.classList.remove('open');
    }
  });

  document.addEventListener('click', function(e) {
    if (!container.contains(e.target)) {
      container.classList.remove('open');
    }
  });

  renderOptions("");
  const defaultPreset = presets.find(p => p.value === "") || presets[0];
  if (defaultPreset) trigger.textContent = defaultPreset.label;
}

buildCustomSelect('colorCustomSelect', colorPresets, (val) => applyColor(val));
buildCustomSelect('nameCustomSelect', namePresets, (val) => applyName(val));
buildCustomSelect('actionCustomSelect', actionPresets, (val) => applyAction(val));