// ---------- DOM refs ----------
const statType = document.getElementById('statType');
const dailyDateField = document.getElementById('dailyDateField');
const weeklyDateField = document.getElementById('weeklyDateField');
const dailyDateInput = document.getElementById('dailyDate');
const weekStart = document.getElementById('weekStart');
const weekEnd = document.getElementById('weekEnd');
const workerSelect = document.getElementById('workerName');
const engineerSelect = document.getElementById('engineerName');
const workDesc = document.getElementById('workDesc');
const workHint = document.getElementById('workHint');
const moneyInput = document.getElementById('moneyInput');
const addBtn = document.getElementById('addBtn');
const okBtn = document.getElementById('okBtn');
const tableBody = document.getElementById('tableBody');
const summaryDateLabel = document.getElementById('summaryDateLabel');
const summaryTotalMoney = document.getElementById('summaryTotalMoney');
const downloadPdfBtn = document.getElementById('downloadPdfBtn');

// ---------- STATE ----------
let currentWorkers = [];

// ---------- Populate selects from names.js ----------
function populateSelects() {
    workerSelect.innerHTML = '<option value="">— select worker —</option>';
    workerAndEngNames.workers.forEach(w => {
        const opt = document.createElement('option');
        opt.value = w;
        opt.textContent = w;
        workerSelect.appendChild(opt);
    });

    engineerSelect.innerHTML = '<option value="">— select engineer —</option>';
    workerAndEngNames.engineers.forEach(e => {
        const opt = document.createElement('option');
        opt.value = e;
        opt.textContent = e;
        engineerSelect.appendChild(opt);
    });
}

// ---------- Toggle daily / weekly fields ----------
function toggleStatFields() {
    const isDaily = statType.value === 'daily';

    dailyDateField.classList.toggle('hidden', !isDaily);
    weeklyDateField.classList.toggle('hidden', isDaily);

    workDesc.disabled = !isDaily;
    if (!isDaily) {
        workDesc.value = '';
        workHint.textContent = 'Work description is disabled for weekly statistics.';
    } else {
        workHint.textContent = 'Write a short paragraph about the work.';
    }
}

// ---------- Reset form (except statistic & date) ----------
function resetFormExceptStatAndDate() {
    workerSelect.value = '';
    engineerSelect.value = '';
    moneyInput.value = '';
    workDesc.value = '';
    workerSelect.focus();
}

// ---------- Validate & collect form data ----------
function getFormData() {
    const stat = statType.value;
    const isDaily = stat === 'daily';

    let dateLabel = '';
    if (isDaily) {
        const d = dailyDateInput.value;
        if (!d) { alert('Please select a date.'); return null; }
        dateLabel = d;
    } else {
        const start = weekStart.value;
        const end = weekEnd.value;
        if (!start || !end) { alert('Please select both start and end dates.'); return null; }
        if (start > end) { alert('Start date must be before or equal to end date.'); return null; }
        dateLabel = `${start} → ${end}`;
    }

    const name = workerSelect.value;
    if (!name) { alert('Please select a worker.'); return null; }

    let work = '';
    if (isDaily) {
        work = workDesc.value.trim();
        if (!work) { alert('Please write a work description.'); return null; }
    }

    const eng = engineerSelect.value;
    if (!eng) { alert('Please select an engineer.'); return null; }

    const moneyRaw = moneyInput.value.trim();
    if (moneyRaw === '') { alert('Please enter money amount.'); return null; }
    const money = parseFloat(moneyRaw);
    if (isNaN(money) || money < 0) { alert('Money must be a positive number.'); return null; }

    return { name, work: isDaily ? work : '', eng, money, stat, dateLabel };
}

// ---------- Add button ----------
addBtn.addEventListener('click', () => {
    const data = getFormData();
    if (!data) return;

    currentWorkers.push({
        name: data.name,
        work: data.work,
        eng: data.eng,
        money: data.money
    });

    resetFormExceptStatAndDate();
    console.log('Worker added. Current list:', currentWorkers);
});

// ---------- OK button ----------
okBtn.addEventListener('click', () => {
    const stat = statType.value;
    const isDaily = stat === 'daily';
    let dateLabel = '';

    if (isDaily) {
        const d = dailyDateInput.value;
        if (!d) { alert('Please select a date.'); return; }
        dateLabel = d;
    } else {
        const start = weekStart.value;
        const end = weekEnd.value;
        if (!start || !end) { alert('Please select both start and end dates.'); return; }
        if (start > end) { alert('Start date must be before or equal to end date.'); return; }
        dateLabel = `${start} → ${end}`;
    }

    summaryDateLabel.textContent = dateLabel;

    const total = currentWorkers.reduce((sum, w) => sum + w.money, 0);
    summaryTotalMoney.textContent = total.toFixed(2);

    renderTable(currentWorkers, isDaily);
});

// ---------- Render table ----------
function renderTable(workers, isDaily) {
    if (!workers.length) {
        tableBody.innerHTML = `<tr class="empty-row"><td colspan="4">No worker records added yet. Use "Add worker".</td></tr>`;
        return;
    }

    let html = '';
    workers.forEach(w => {
        const workDisplay = isDaily ? (w.work || '—') : '—';
        html += `<tr>
            <td>${escapeHtml(w.name)}</td>
            <td>${escapeHtml(workDisplay)}</td>
            <td>${escapeHtml(w.eng)}</td>
            <td class="money-col">${w.money.toFixed(2)}</td>
        </tr>`;
    });
    tableBody.innerHTML = html;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ---------- PDF Download ----------
function loadHtml2Pdf(callback) {
    if (window.html2pdf) { callback(); return; }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.onload = callback;
    document.head.appendChild(script);
}

downloadPdfBtn.addEventListener('click', () => {
    loadHtml2Pdf(() => {
        const wrapper = document.createElement('div');
        wrapper.style.padding = '24px';
        wrapper.style.fontFamily = 'Segoe UI, Roboto, sans-serif';
        wrapper.style.background = 'white';
        wrapper.style.color = '#1c3a57';

        // Title
        const title = document.createElement('h2');
        title.textContent = 'Worker Statistics Report';
        title.style.color = '#0b2b4b';
        title.style.marginTop = '0';
        title.style.marginBottom = '6px';
        wrapper.appendChild(title);

        // Date + Total
        const info = document.createElement('div');
        info.style.display = 'flex';
        info.style.justifyContent = 'space-between';
        info.style.alignItems = 'center';
        info.style.background = '#e9f2fa';
        info.style.borderRadius = '12px';
        info.style.padding = '10px 16px';
        info.style.marginBottom = '16px';
        info.style.fontWeight = '600';
        info.style.color = '#0b2b4b';

        const dateSpan = document.createElement('span');
        dateSpan.textContent = 'Date: ' + summaryDateLabel.textContent;
        const totalSpan = document.createElement('span');
        totalSpan.textContent = 'Total money: ' + summaryTotalMoney.textContent;
        info.appendChild(dateSpan);
        info.appendChild(totalSpan);
        wrapper.appendChild(info);

        // Table
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.fontSize = '13px';

        const thead = document.createElement('thead');
        const headRow = document.createElement('tr');
        ['Name', 'Work', 'Eng', 'Money'].forEach(h => {
            const th = document.createElement('th');
            th.textContent = h;
            th.style.background = '#0b2b4b';
            th.style.color = 'white';
            th.style.padding = '10px 12px';
            th.style.textAlign = 'left';
            headRow.appendChild(th);
        });
        thead.appendChild(headRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        currentWorkers.forEach(w => {
            const isDaily = statType.value === 'daily';
            const tr = document.createElement('tr');
            const cells = [
                w.name,
                isDaily ? (w.work || '—') : '—',
                w.eng,
                w.money.toFixed(2)
            ];
            cells.forEach((val, idx) => {
                const td = document.createElement('td');
                td.textContent = val;
                td.style.padding = '8px 12px';
                td.style.borderBottom = '1px solid #e7eef7';
                if (idx === 3) td.style.fontWeight = '600';
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        wrapper.appendChild(table);

        const opt = {
            margin: 10,
            filename: 'worker-statistics.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(wrapper).save();
    });
});

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
    populateSelects();
    toggleStatFields();
    statType.addEventListener('change', toggleStatFields);

    // If weekly, ensure work area is disabled
    if (statType.value === 'weekly') workDesc.disabled = true;
});