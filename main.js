let pets = [
    {
        nombre: "Max",
        tipo: "Perro",
        salud: 100,
        felicidad: 100,
        nivel: 1,
        experiencia: 0,
        experienciaNecesaria: 20,
        tiempoUltimaActualizacion: Date.now()
    }
];

function renderPets() {
    const petList = document.getElementById("petList");
    petList.innerHTML = "";

    pets.forEach((pet, index) => {
        const petDiv = document.createElement("div");
        petDiv.classList.add("pet");

        petDiv.innerHTML = `
            <h3>${pet.nombre} (Nivel ${pet.nivel})</h3>
            <p>Tipo: ${pet.tipo}</p>
            
            <!-- Barra de felicidad con formato actual/maximo -->
            <div class="progress-bar">
                <div class="progress" style="width: ${pet.felicidad}%;"></div>
            </div>
            <p>Felicidad: ${pet.felicidad}/100</p>

            <!-- Barra de salud con formato actual/maximo -->
            <div class="progress-bar">
                <div class="progress progress-health" style="width: ${pet.salud}%;"></div>
            </div>
            <p>Salud: ${pet.salud}/100</p>

            <!-- Barra de experiencia con formato actual/maximo -->
            <div class="progress-bar">
                <div class="progress progress-exp" style="width: ${(pet.experiencia / pet.experienciaNecesaria) * 100}%;"></div>
            </div>
            <p>Experiencia: ${pet.experiencia}/${pet.experienciaNecesaria}</p>
        `;

        const feedButton = document.createElement("button");
        feedButton.textContent = "Alimentar";
        feedButton.addEventListener("click", () => alimentarMascota(index));
        petDiv.appendChild(feedButton);

        const playButton = document.createElement("button");
        playButton.textContent = "Jugar";
        playButton.addEventListener("click", () => jugarConMascota(index));
        petDiv.appendChild(playButton);

        petList.appendChild(petDiv);
    });
}

function agregarMascota() {
    const nombre = document.getElementById('newPetName').value;
    const tipo = document.getElementById('newPetType').value;

    if (nombre === "" || tipo === "") {
        alert("Por favor, llena todos los campos para agregar una nueva mascota.");
        return;
    }

    const nuevaMascota = {
        nombre: nombre,
        tipo: tipo,
        salud: 100,
        felicidad: 100,
        nivel: 1,
        experiencia: 0,
        experienciaNecesaria: 20,
        tiempoUltimaActualizacion: Date.now()
    };

    pets.push(nuevaMascota);
    savePets();
    renderPets();

    document.getElementById('newPetName').value = "";
    document.getElementById('newPetType').value = "";
}

function alimentarMascota(index) {
    const pet = pets[index];
    const incrementoSalud = Math.max(5 - (pet.nivel * 0.5), 1);
    pet.salud += incrementoSalud;
    pet.salud = Math.min(pet.salud, 100);
    pet.experiencia += 5;
    checkNivel(pet);
    renderPets();
}

function jugarConMascota(index) {
    const pet = pets[index];
    const incrementoFelicidad = Math.max(5 - (pet.nivel * 0.5), 1);
    pet.felicidad += incrementoFelicidad;
    pet.felicidad = Math.min(pet.felicidad, 100);
    pet.experiencia += 7;
    checkNivel(pet);
    savePets();
    renderPets();
}

function checkNivel(pet) {
    if (pet.experiencia >= pet.experienciaNecesaria) {
        pet.nivel++;
        pet.experiencia = 0;
        pet.experienciaNecesaria += 10;
        alert(`${pet.nombre} ha subido al nivel ${pet.nivel}!`);
    }
}

// Reducción gradual de salud y felicidad
function reducirSaludYFelicidad() {
    pets.forEach(pet => {
        const tiempoActual = Date.now();
        const tiempoTranscurrido = (tiempoActual - pet.tiempoUltimaActualizacion) / 1000;

        if (tiempoTranscurrido >= 10) { 
            pet.salud -= Math.min(2 + pet.nivel, 5);
            pet.felicidad -= Math.min(2 + pet.nivel, 5);
            pet.salud = Math.max(pet.salud, 0);
            pet.felicidad = Math.max(pet.felicidad, 0);

            pet.tiempoUltimaActualizacion = tiempoActual;
            savePets();
            renderPets();
        }
    });
}

function savePets() {
    localStorage.setItem('pets', JSON.stringify(pets));
}

function loadPets() {
    const savedPets = localStorage.getItem('pets');
    if (savedPets) {
        pets = JSON.parse(savedPets);
    }
}

function resetPets() {
    pets = [
        {
            nombre: "Max",
            tipo: "Perro",
            salud: 100,
            felicidad: 100,
            nivel: 1,
            experiencia: 0,
            experienciaNecesaria: 20,
            tiempoUltimaActualizacion: Date.now()
        }
    ];

    localStorage.removeItem('pets');

    renderPets();
}

document.getElementById("addPetButton").addEventListener("click", agregarMascota);

document.getElementById("resetButton").addEventListener("click", () => {
    if (confirm("¿Estás seguro de que quieres reiniciar el progreso de las mascotas?")) {
        resetPets();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    loadPets();
    renderPets();

    setInterval(reducirSaludYFelicidad, 1000);
});