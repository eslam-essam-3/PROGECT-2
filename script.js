function toggleInputs() {
    const type = document.getElementById('toolType').value;
    const inputsDiv = document.getElementById('inputs');
    if (type === 'resultant') {
        inputsDiv.innerHTML = `
            <input type="number" id="f1" placeholder="القوة الأولى">
            <input type="number" id="f2" placeholder="القوة الثانية">
            <input type="number" id="angle" placeholder="الزاوية">`;
    } else if (type === 'moment') {
    inputsDiv.innerHTML = `
        <input type="number" id="f1" placeholder="القوة (F)">
        <input type="number" id="dist" placeholder="المسافة العمودية (d)">`;
}
}
function runCalculation() {
    const type = document.getElementById('toolType').value;
    const resDiv = document.getElementById('result');
    
    let resultObj;

    if (type === 'resultant') {
        const F1 = parseFloat(document.getElementById('f1').value);
        const F2 = parseFloat(document.getElementById('f2').value);
        const angle = parseFloat(document.getElementById('angle').value);

        if (!isValid(F1) || !isValid(F2)) {
            resDiv.innerHTML = "<h3 style='color:red;'>خطأ: تأكد من إدخال قيم صحيحة!</h3>";
            return;
        }
        // هنا بنستخدم الـ Class اللي أنت عملته
        resultObj = EngineeringSolver.getResultant(F1, F2, angle);

    } else if (type === 'stress') {
        const F = parseFloat(document.getElementById('f1').value);
        const A = parseFloat(document.getElementById('area').value);

        if (!isValid(F) || !isValid(A)) {
            resDiv.innerHTML = "<h3 style='color:red;'>خطأ: المساحة والقوة يجب أن تكون أكبر من صفر!</h3>";
            return;
        }
        // هنا بنستخدم الـ Class اللي أنت عملته
        resultObj = EngineeringSolver.getStress(F, A);
    }

    // عرض النتيجة والخطوات
    if (resultObj) {
        resDiv.innerHTML = `<h3>النتيجة: ${resultObj.value}</h3><p>${resultObj.steps}</p>`;
        saveResult(type, resultObj.value); // بنحفظ النتيجة في التاريخ
    }
}
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