function showSection(sectionId) {
    // Oculta todas las secciones
    var sections = document.querySelectorAll('.section');
    sections.forEach(function(section) {
        section.classList.remove('active');
    });

    // Muestra la sección seleccionada
    var activeSection = document.getElementById(sectionId);
    activeSection.classList.add('active');
}
