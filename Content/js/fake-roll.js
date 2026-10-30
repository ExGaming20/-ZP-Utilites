const presets = window.presets;
const colorPresets = presets.colorPresets;
const namePresets = presets.namePresets;
const typePresets = presets.typePresets;

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
function applyType(value) {
  if (value) document.getElementById('rollType').value = value;
}

document.getElementById('randomButton').addEventListener('click', () => {
  const randomNum = Math.floor(Math.random() * 100) + 1;
  document.getElementById('rollNumber').value = randomNum;
});

const hasBonusCheck = document.getElementById('hasBonus');
const bonusPanel = document.getElementById('bonusPanel');
hasBonusCheck.addEventListener('change', () => {
  bonusPanel.style.display = hasBonusCheck.checked ? 'block' : 'none';
});

function generate() {
  const rollType = document.getElementById('rollType').value.trim();
  const color = hexInput.value.trim();
  let name = document.getElementById('name').value.trim();
  let number = parseInt(document.getElementById('rollNumber').value, 10);
  const hasBonus = hasBonusCheck.checked;
  let bonus = hasBonus ? parseInt(document.getElementById('bonusValue').value, 10) : 0;

  if (isNaN(number)) number = 1;
  if (number < 1) number = 1;
  if (number > 100) number = 100;
  if (isNaN(bonus)) bonus = 0;

  const typeDisplay = rollType ? rollType : "unknown";

  let output = "";
  if (hasBonus && bonus !== 0) {
    const total = number + bonus;
	const positive = '+';
	
	if (bonus < 0) {
		positive = '';
	}
	
    output = `/it {#888888 [}{${color} ${typeDisplay.toUpperCase()}}{#888888 ]} {${color} ${name} rolled a ${total} (Base: ${number}, ${positive}${bonus} from ${typeDisplay.toLowerCase()})!}`;
  } else { // [LUCK] D-7790 Ex rolled a 29 (Base: 28, +1 from luck)!
    output = `/it {#888888 [}{${color} ${typeDisplay.toUpperCase()}}{#888888 ]} {${color} ${name} rolled a ${number}!}`;
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
buildCustomSelect('typeCustomSelect', typePresets, (val) => applyType(val));