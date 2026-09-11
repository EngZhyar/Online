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

// ---------- PDF Download using jsPDF + autotable (mobile-safe) ----------
function loadScript(src) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
        const s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = () => reject(new Error('Failed to load: ' + src));
        document.head.appendChild(s);
    });
}

async function ensurePdfLibs() {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js');
}

downloadPdfBtn.addEventListener('click', async () => {
    if (!currentWorkers.length) {
        alert('No data to export. Add workers and press OK first.');
        return;
    }

    try {
        await ensurePdfLibs();
    } catch (err) {
        alert('Could not load PDF library. Check your internet connection.');
        return;
    }

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: 'pt', format: 'a4' });

        const isDaily = statType.value === 'daily';
        const dateLabel = summaryDateLabel.textContent || '—';
        const total = summaryTotalMoney.textContent || '0.00';

        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 40;

        // Title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.setTextColor(11, 43, 75);
        doc.text('Worker Statistics Report', margin, margin + 10);

        // Date + total line
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(30, 60, 90);
        doc.text('Date: ' + dateLabel, margin, margin + 35);
        doc.text('Total money: ' + total, pageWidth - margin, margin + 35, { align: 'right' });

        // Table data
        const rows = currentWorkers.map(w => [
            w.name,
            isDaily ? (w.work || '—') : '—',
            w.eng,
            w.money.toFixed(2)
        ]);

        doc.autoTable({
            head: [['Name', 'Work', 'Eng', 'Money']],
            body: rows,
            startY: margin + 55,
            margin: { left: margin, right: margin },
            styles: {
                font: 'helvetica',
                fontSize: 10,
                cellPadding: 6,
                textColor: [28, 58, 87],
                lineColor: [200, 210, 220],
                lineWidth: 0.5
            },
            headStyles: {
                fillColor: [11, 43, 75],
                textColor: [255, 255, 255],
                fontStyle: 'bold'
            },
            alternateRowStyles: {
                fillColor: [245, 250, 255]
            },
            columnStyles: {
                0: { cellWidth: 120 },
                1: { cellWidth: 'auto' },
                2: { cellWidth: 120 },
                3: { cellWidth: 80, halign: 'right', fontStyle: 'bold' }
            }
        });

        doc.save('worker-statistics.pdf');
    } catch (err) {
        console.error(err);
        alert('PDF generation failed: ' + err.message);
    }
});

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
    populateSelects();
    toggleStatFields();
    statType.addEventListener('change', toggleStatFields);

    if (statType.value === 'weekly') workDesc.disabled = true;
});
