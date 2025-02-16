function eulerMethod(f, a, b, n, alpha, decimalPlaces) {
    let h = (b - a) / n;
    let t = new Array(n + 1);
    let w = new Array(n + 1);

    t[0] = a;
    w[0] = alpha;

    for (let i = 0; i < n; i++) {
        w[i + 1] = w[i] + h * f(t[i], w[i]);
        t[i + 1] = t[i] + h;
    }

    return { t: t, w: w };
}

function parseFunction(funcStr) {
    try {
        if (!/^[a-zA-Z0-9\s\+\-\*\/\(\)\.\,\[\]\^\%\&\|\!\<\>\=\~\`\@\#\$\^\\]+$/.test(funcStr)) {
            throw new Error("Invalid characters in function.");
        }

        const mathFunctions = {
            Math: Math,
            exp: Math.exp,
            log: Math.log,
            sqrt: Math.sqrt,
            pow: Math.pow,
            sin: Math.sin,
            cos: Math.cos,
            tan: Math.tan,
            asin: Math.asin,
            acos: Math.acos,
            atan: Math.atan,
            sinh: Math.sinh,
            cosh: Math.cosh,
            tanh: Math.tanh,
            abs: Math.abs,
            floor: Math.floor,
            ceil: Math.ceil,
            round: Math.round,
            trunc: Math.trunc,
            random: Math.random
        };

        const functionString = `with(Math){return (${funcStr})}`;
        return new Function('t', 'y', functionString);
    } catch (error) {
        console.error("Error parsing function:", error);
        throw new Error("Invalid function input. Please make sure your function is correctly formatted.");
    }
}

function solveAndDisplay() {
    const a = parseFloat(document.getElementById('a').value);
    const b = parseFloat(document.getElementById('b').value);
    const n = parseInt(document.getElementById('n').value);
    const alpha = parseFloat(document.getElementById('alpha').value);
    const funcStr = document.getElementById('functionInput').value.trim();
    const decimalPlaces = parseInt(document.getElementById('decimalPlaces').value) || 4;

    if (!funcStr) {
        alert("Please enter a valid function.");
        return;
    }

    try {
        const f = parseFunction(funcStr);
        const result = eulerMethod(f, a, b, n, alpha, decimalPlaces);

        // Display calculations
        const calculationsContent = document.getElementById('calculationsContent');
        calculationsContent.innerHTML = '';

        const h = (b - a) / n;

        for (let i = 0; i < n; i++) {
            const step = document.createElement('div');
            step.className = 'step';
            step.innerHTML = `
                <div class="formula">Step ${i}: t = ${result.t[i]}, ω = ${result.w[i].toFixed(decimalPlaces)}</div>
                <div class="formula">h = ${h.toFixed(decimalPlaces)}</div>
                <div class="formula">Substitute t = ${result.t[i]} and ω = ${result.w[i].toFixed(decimalPlaces)} into the function:</div>
                <div class="formula">f(${result.t[i]}, ${result.w[i].toFixed(decimalPlaces)}) = ${funcStr}</div>
                <div class="formula">f(${result.t[i]}, ${result.w[i].toFixed(decimalPlaces)}) = ${f(result.t[i], result.w[i]).toFixed(decimalPlaces)}</div>
                <div class="formula">Update ω: ω<sub>${i+1}</sub> = ω<sub>${i}</sub> + h * f(${result.t[i]}, ${result.w[i].toFixed(decimalPlaces)})</div>
                <div class="formula">ω<sub>${i+1}</sub> = ${result.w[i].toFixed(decimalPlaces)} + ${h.toFixed(decimalPlaces)} * ${f(result.t[i], result.w[i]).toFixed(decimalPlaces)}</div>
                <div class="formula">ω<sub>${i+1}</sub> = ${result.w[i+1].toFixed(decimalPlaces)}</div>
                <div class="formula">Update t: t<sub>${i+1}</sub> = t<sub>${i}</sub> + h</div>
                <div class="formula">t<sub>${i+1}</sub> = ${result.t[i].toFixed(decimalPlaces)} + ${h.toFixed(decimalPlaces)}</div>
                <div class="formula">t<sub>${i+1}</sub> = ${result.t[i+1].toFixed(decimalPlaces)}</div>
            `;
            calculationsContent.appendChild(step);
        }

        // Display table results
        const tableBody = document.querySelector('#resultTable tbody');
        tableBody.innerHTML = '';
        for (let i = 0; i <= n; i++) {
            tableBody.innerHTML += `<tr><td>${i}</td><td>${result.t[i].toFixed(decimalPlaces)}</td><td>${result.w[i].toFixed(decimalPlaces)}</td></tr>`;
        }
    } catch (e) {
        alert(`Error: ${e.message}`);
    }
}

function adjustWidth(input) {
    const charCount = input.value.length;
    const minWidth = 100;
    const maxWidth = 300;
    const stepSize = (maxWidth - minWidth) / 1000; 

    const newWidth = Math.min(maxWidth, minWidth + charCount * stepSize);
    input.style.width = `${newWidth}px`;
}
