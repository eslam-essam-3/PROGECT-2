function toggleInputs() {
    const type = document.getElementById('toolType').value;
    const inputsDiv = document.getElementById('inputs');
    inputsDiv.innerHTML = "";

    if (type === 'resultant') {
        inputsDiv.innerHTML = '<input type="number" id="f1" placeholder="F1"><input type="number" id="f2" placeholder="F2"><input type="number" id="angle" placeholder="الزاوية">';
    } else if (type === 'components') {
        inputsDiv.innerHTML = '<input type="number" id="f1" placeholder="F"><input type="number" id="angle" placeholder="الزاوية">';
    } else if (type === 'moment') {
        inputsDiv.innerHTML = '<input type="number" id="f1" placeholder="F"><input type="number" id="dist" placeholder="المسافة">';
    }
}

function runCalculation() {
    const type = document.getElementById('toolType').value;
    const resDiv = document.getElementById('result');
    const f1 = parseFloat(document.getElementById('f1').value);
    
    let result = 0;
    if (type === 'resultant') {
        const f2 = parseFloat(document.getElementById('f2').value);
        const ang = parseFloat(document.getElementById('angle').value) * (Math.PI / 180);
        result = Math.sqrt(f1**2 + f2**2 + 2*f1*f2*Math.cos(ang)).toFixed(2);
    } else if (type === 'components') {
        const ang = parseFloat(document.getElementById('angle').value) * (Math.PI / 180);
        result = "Fx: " + (f1 * Math.cos(ang)).toFixed(2) + ", Fy: " + (f1 * Math.sin(ang)).toFixed(2);
    } else if (type === 'moment') {
        const d = parseFloat(document.getElementById('dist').value);
        result = (f1 * d).toFixed(2);
    }
    // مثال لتطوير عرض النتائج
resDiv.innerHTML = `
    <div class="report">
        <h3>تقرير التحليل الهندسي</h3>
        <p><strong>العملية:</strong> ${type}</p>
        <p><strong>المدخلات:</strong> القوة = ${f1} N</p>
        <div class="result-box">النتيجة النهائية: ${result}</div>
        <button onclick="window.print()">تحميل التقرير كـ PDF</button>
    </div>
`;
}
drawForce(f1, angle); // هي دي اللي هتشغل الرسم أوتوماتيك
// تشغيل الأداة فوراً
toggleInputs();
// دالة الحفظ
function saveResult(operation, result) {
    let history = JSON.parse(localStorage.getItem('engHistory')) || [];
    history.unshift({ op: operation, res: result, date: new Date().toLocaleTimeString() });
    localStorage.setItem('engHistory', JSON.stringify(history.slice(0, 5))); // بنحفظ آخر 5 مسائل
    displayHistory();
}

// دالة عرض التاريخ
function displayHistory() {
    let history = JSON.parse(localStorage.getItem('engHistory')) || [];
    let html = "<h4>آخر المسائل:</h4>";
    history.forEach(item => {
        html += `<p>${item.op}: ${item.res} <small>(${item.date})</small></p>`;
    });
    document.getElementById('historyBox').innerHTML = html;
}
class EngineeringSolver {
    static getResultant(F1, F2, theta) {
        const rad = theta * (Math.PI / 180);
        const R = Math.sqrt(F1**2 + F2**2 + 2*F1*F2*Math.cos(rad));
        return {
            value: R.toFixed(2),
            steps: `R = √(${F1}² + ${F2}² + 2*${F1}*${F2}*cos(${theta})) = ${R.toFixed(2)} N`
        };
    }

    static getStress(F, A) {
        const stress = F / A;
        return {
            value: stress.toFixed(2),
            steps: `σ = F / A = ${F} / ${A} = ${stress.toFixed(2)} N/m²`
        };
    }
}
function isValid(value) {
    return value !== "" && value > 0; // بيتأكد إن القيمة مش فاضية وأكبر من صفر
}
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}
// ضيف دي في ملف الـ HTML بتاعك: <canvas id="myChart"></canvas>
let myChart; // متغير عام عشان نمسح الرسمة القديمة قبل ما نرسم الجديدة

function drawForce(F, angle) {
    const ctx = document.getElementById('myChart').getContext('2d');
    
    // لو فيه رسمة قديمة، امسحها
    if (myChart) myChart.destroy();

    myChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'اتجاه القوة',
                data: [{x: 0, y: 0}, {x: F * Math.cos(angle * Math.PI/180), y: F * Math.sin(angle * Math.PI/180)}],
                borderColor: 'red',
                borderWidth: 3,
                showLine: true
            }]
        },
        options: {
            scales: {
                x: { min: -F, max: F },
                y: { min: -F, max: F }
            }
        }
    });
}
// تشغيل الدالة فوراً عشان تملأ الخانات أول ما الصفحة تفتح
window.onload = function() {
    toggleInputs();
};