let currentOperand = '0';
let previousOperand = '';
let operation = undefined;

const currentOperandTextElement = document.getElementById('current-operand');
const previousOperandTextElement = document.getElementById('previous-operand');

// --- Fungsi Logic Utama ---

function appendNumber(number) {
    // Mencegah input '0' berulang di awal (cth: 0000)
    if (number === '0' && currentOperand === '0') return;
    
    // Mencegah input '.' lebih dari satu kali
    if (number === '.' && currentOperand.includes('.')) return;
    
    // Jika saat ini '0' dan input bukan '.', ganti '0' dengan angka baru
    if (currentOperand === '0' && number !== '.') {
        currentOperand = number.toString();
    } else {
        currentOperand = currentOperand.toString() + number.toString();
    }
    updateDisplay();
}

function appendOperator(op) {
    if (currentOperand === '') return;
    
    // Jika sudah ada operasi sebelumnya, hitung dulu
    if (previousOperand !== '') {
        compute();
    }
    
    operation = op;
    previousOperand = currentOperand;
    currentOperand = '';
    updateDisplay();
}

function compute() {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '*':
            computation = prev * current;
            break;
        case '÷':
            if (current === 0) {
                alert("Tidak bisa membagi dengan 0!");
                clearDisplay();
                return;
            }
            computation = prev / current;
            break;
        default:
            return;
    }

    // Membulatkan desimal panjang agar tidak error floating point (cth: 0.1 + 0.2)
    currentOperand = Math.round(computation * 100000000) / 100000000;
    operation = undefined;
    previousOperand = '';
    updateDisplay();
}

function clearDisplay() {
    currentOperand = '0';
    previousOperand = '';
    operation = undefined;
    updateDisplay();
}

function deleteNumber() {
    if (currentOperand === '0') return;
    
    currentOperand = currentOperand.toString().slice(0, -1);
    
    if (currentOperand === '') {
        currentOperand = '0';
    }
    updateDisplay();
}

// --- Fungsi Update Tampilan (UI) ---

function getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    
    let integerDisplay;
    if (isNaN(integerDigits)) {
        integerDisplay = '';
    } else {
        // Menambahkan koma untuk ribuan (cth: 1,000)
        integerDisplay = integerDigits.toLocaleString('id-ID', { maximumFractionDigits: 0 });
    }
    
    if (decimalDigits != null) {
        return `${integerDisplay}.${decimalDigits}`;
    } else {
        return integerDisplay;
    }
}

function updateDisplay() {
    currentOperandTextElement.innerText = getDisplayNumber(currentOperand);
    
    if (operation != null) {
        previousOperandTextElement.innerText = `${getDisplayNumber(previousOperand)} ${operation}`;
    } else {
        previousOperandTextElement.innerText = '';
    }
}

// --- Event Listener Keyboard (Bonus) ---

document.addEventListener('keydown', function(event) {
    let key = event.key;
    
    if (/[0-9]/.test(key)) {
        appendNumber(key);
    }
    if (key === '.') {
        appendNumber(key);
    }
    if (key === '+' || key === '-') {
        appendOperator(key);
    }
    if (key === '*') {
        appendOperator('*');
    }
    if (key === '/') {
        appendOperator('÷');
    }
    if (key === 'Enter' || key === '=') {
        event.preventDefault(); // Mencegah enter menekan tombol terakhir
        compute();
    }
    if (key === 'Backspace') {
        deleteNumber();
    }
    if (key === 'Escape') {
        clearDisplay();
    }
});
