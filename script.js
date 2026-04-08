document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('result');
    const MAX_CHARS = 14;

    let firstOperand = '';
    let secondOperand = '';
    let currentOperation = null;
    let shouldResetScreen = false;

    function reset() {
        display.textContent = '0';
        firstOperand = '';
        secondOperand = '';
        currentOperation = null;
        shouldResetScreen = false;
    }

    function formatResult(value) {
        let res = value.toString();
        
        
        if (res.length > MAX_CHARS) {
            const numValue = parseFloat(value);
            
            if (Math.abs(numValue) >= 1e14 || (Math.abs(numValue) < 1e-7 && numValue !== 0)) {
                return numValue.toExponential(7); 
            }
            
            return res.substring(0, MAX_CHARS);
        }
        return res;
    }

    function appendNumber(number) {
        if (display.textContent.length >= MAX_CHARS && !shouldResetScreen) return;

        if (display.textContent === '0' || shouldResetScreen) {
            display.textContent = number;
            shouldResetScreen = false;
        } else {
            display.textContent += number;
        }
    }

    function appendPoint() {
        if (shouldResetScreen) {
            display.textContent = '0.';
            shouldResetScreen = false;
            return;
        }
        if (!display.textContent.includes('.') && display.textContent.length < MAX_CHARS) {
            display.textContent += '.';
        }
    }

    function setOperation(operator) {
        if (currentOperation !== null) calculate();
        firstOperand = display.textContent;
        currentOperation = operator;
        shouldResetScreen = true;
    }

    function calculate() {
        if (currentOperation === null || shouldResetScreen) return;

        secondOperand = display.textContent;
        let result = 0;
        const a = parseFloat(firstOperand);
        const b = parseFloat(secondOperand);

        switch (currentOperation) {
            case '+': result = a + b; break;
            case '-': result = a - b; break;
            case '×': result = a * b; break;
            case '/': 
                if (b === 0) {
                    display.textContent = "Error";
                    shouldResetScreen = true;
                    currentOperation = null;
                    return;
                }
                result = a / b; 
                break;
        }

        display.textContent = formatResult(result);
        currentOperation = null;
        shouldResetScreen = true;
    }

    document.querySelectorAll('.my-btn').forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent;
            const id = button.id;

            if (id.includes('digit')) {
                if (id === 'btn_digit_dot') appendPoint();
                else appendNumber(value);
            } else if (button.classList.contains('primary') && id !== 'btn_op_equal') {
                setOperation(value);
            }
        });
    });

    const btnClear = document.getElementById('btn_op_clear');
    if (btnClear) btnClear.onclick = reset;

    const btnEqual = document.getElementById('btn_op_equal');
    if (btnEqual) btnEqual.onclick = calculate;

    const btnSign = document.getElementById('btn_op_sign');
    if (btnSign) {
        btnSign.onclick = () => {
            let val = parseFloat(display.textContent);
            display.textContent = formatResult(val * -1);
        };
    }

    const btnPercent = document.getElementById('btn_op_percent');
    if (btnPercent) {
        btnPercent.onclick = () => {
            let val = parseFloat(display.textContent);
            display.textContent = formatResult(val / 100);
        };
    }
});