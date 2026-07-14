// Valores por defecto iniciales
const DEFAULT_USD_EXTRANJERA = 930.90; // Ej: CLP (Peso Chileno)
const DEFAULT_USD_LOCAL = 1500.00;     // Ej: ARS (Peso Argentino)

// Al cargar la página, inicializar localStorage si es la primera vez, cargar inputs y tema
window.onload = function() {
    if (!localStorage.getItem('usd_extranjera')) {
        localStorage.setItem('usd_extranjera', DEFAULT_USD_EXTRANJERA);
    }
    if (!localStorage.getItem('usd_local')) {
        localStorage.setItem('usd_local', DEFAULT_USD_LOCAL);
    }

    // Cargar los valores de localStorage en los campos de configuración
    document.getElementById('inputUsdExtranjera').value = localStorage.getItem('usd_extranjera');
    document.getElementById('inputUsdLocal').value = localStorage.getItem('usd_local');

    // Inicializar tema guardado o detectar preferencia del sistema
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', initialTheme);
    actualizarIconoTema(initialTheme);
};

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    actualizarIconoTema(newTheme);
}

function actualizarIconoTema(theme) {
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.innerText = theme === 'light' ? '🌙' : '☀️';
    }
}

function toggleConfig() {
    const configSection = document.getElementById('configSection');
    if (configSection.style.display === 'block') {
        configSection.style.display = 'none';
    } else {
        configSection.style.display = 'block';
    }
}

function guardarConfiguracion() {
    const extranjeraTasa = parseFloat(document.getElementById('inputUsdExtranjera').value);
    const localTasa = parseFloat(document.getElementById('inputUsdLocal').value);

    if (isNaN(extranjeraTasa) || extranjeraTasa <= 0 || isNaN(localTasa) || localTasa <= 0) {
        alert('Por favor, ingrese valores válidos mayores a 0.');
        return;
    }

    localStorage.setItem('usd_extranjera', extranjeraTasa);
    localStorage.setItem('usd_local', localTasa);

    alert('¡Cotizaciones actualizadas con éxito!');
    toggleConfig();
    
    // Si ya había un cálculo hecho, recalculamos automáticamente con las nuevas tasas
    if (document.getElementById('inputExtranjera').value) {
        convertirMoneda();
    }
}

function convertirMoneda() {
    const inputVal = parseFloat(document.getElementById('inputExtranjera').value);
    
    if (isNaN(inputVal) || inputVal < 0) {
        alert('Por favor, ingrese un número válido.');
        return;
    }

    // Obtener las tasas guardadas en localStorage o usar las por defecto si algo falla
    const tasaUsdExtranjera = parseFloat(localStorage.getItem('usd_extranjera')) || DEFAULT_USD_EXTRANJERA;
    const tasaUsdLocal = parseFloat(localStorage.getItem('usd_local')) || DEFAULT_USD_LOCAL;

    // 1. Calcular precio en dólares dividiendo el precio en moneda extranjera por su cotización actual
    const precioDolares = inputVal / tasaUsdExtranjera;
    
    // 2. Calcular precio en moneda local multiplicando el resultado en dólares por su cotización actual
    const precioLocal = precioDolares * tasaUsdLocal;

    // Formatear resultados para la interfaz
    const usdFormateado = precioDolares.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
    const localFormateado = precioLocal.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // Mostrar resultados
    document.getElementById('usdResult').innerText = '$ ' + usdFormateado + ' USD';
    document.getElementById('localResult').innerText = '$ ' + localFormateado;
    
    // Hacer visible la caja de resultados
    document.getElementById('resultsBox').style.display = 'block';
}
