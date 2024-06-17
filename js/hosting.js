window.addEventListener('load', () => {
    // Función para obtener la IP codificada
    function getEncodedIP() {
        return btoa(window.location.hostname);
    }

    // Mostrar la IP codificada en el elemento con id "ipAddress"
    const ipAddressElement = document.getElementById('ipAddress');
    ipAddressElement.innerText = getEncodedIP();

    // Obtener el botón de copiar
    const copyButton = document.getElementById('copyButton');

    // Añadir evento click al botón para copiar la IP
    copyButton.addEventListener('click', () => {
        // Crear un elemento de texto temporal
        const tempElement = document.createElement('textarea');
        tempElement.value = `Unete a mi partida de Lobo!!\n${getEncodedIP()}`;

        // Añadir el elemento al DOM
        document.body.appendChild(tempElement);

        // Seleccionar el texto dentro del elemento
        tempElement.select();
        tempElement.setSelectionRange(0, 99999); // Para dispositivos móviles

        // Copiar el texto seleccionado al portapapeles
        document.execCommand('copy');

        // Eliminar el elemento temporal
        document.body.removeChild(tempElement);

        // Cambiar el texto del botón temporalmente
        const originalButtonText = copyButton.innerText;
        copyButton.innerText = '¡Copiado!';
        setTimeout(() => {
            copyButton.innerText = originalButtonText;
        }, 2000); // Restaurar el texto original después de 2 segundos
    });

    // Obtener el botón para ir a otra página
    const goToAnotherPageButton = document.getElementById('goToAnotherPageButton');

    // Añadir evento click al botón para ir a otra página
    goToAnotherPageButton.addEventListener('click', () => {
        window.location.href = '../pages/host.html';
    });
});
