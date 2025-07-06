document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const themeToggle = document.getElementById('themeToggle');
  const showFormBtn = document.getElementById('showFormButton');
  const closeFormBtn = document.getElementById('closeForm');
  const formOverlay = document.getElementById('formOverlay');
  const dogForm = document.getElementById('dogForm');
  const dogGallery = document.getElementById('dogGallery');

  // Initialize dogs array
  let dogs = [];

  // Initialize the app
  init();

  function init() {
    // Load saved dogs from localStorage if available
    const savedDogs = localStorage.getItem('dogs');
    if (savedDogs) {
      dogs = JSON.parse(savedDogs);
    }

    renderDogGallery();
    setupEventListeners();
  }

  function setupEventListeners() {
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);

    // Form buttons
    showFormBtn.addEventListener('click', () => {
      formOverlay.classList.add('visible');
    });

    closeFormBtn.addEventListener('click', () => {
      formOverlay.classList.remove('visible');
    });

    // Form submission - CHANGED TO preventDefault properly
    dogForm.addEventListener('submit', function(e) {
      e.preventDefault();
      handleFormSubmit();
    });

    // Close overlay when clicking outside form
    formOverlay.addEventListener('click', (e) => {
      if (e.target === formOverlay) {
        formOverlay.classList.remove('visible');
      }
    });
  }

  function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');

    if (currentTheme === 'dark') {
      body.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
      themeToggle.textContent = '🌙 Modo Oscuro';
    } else {
      body.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      themeToggle.textContent = '☀️ Modo Claro';
    }
  }

  function handleFormSubmit() {
    const submitBtn = dogForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    
    const newDog = {
      id: Date.now(),
      name: document.getElementById('name').value,
      birthdate: document.getElementById('birthdate').value,
      passedAway: document.getElementById('passedAway').checked,
      funFacts: document.getElementById('funFacts').value
    };

    const photoInput = document.getElementById('photo');
    
    if (!photoInput.files || !photoInput.files[0]) {
      newDog.photo = 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=400&auto=format&fit=crop';
      addDogAndSave(newDog, submitBtn);
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      newDog.photo = e.target.result;
      addDogAndSave(newDog, submitBtn);
    };
    reader.onerror = function() {
      newDog.photo = 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=400&auto=format&fit=crop';
      addDogAndSave(newDog, submitBtn);
    };
    reader.readAsDataURL(photoInput.files[0]);
  }

  function addDogAndSave(newDog, submitBtn) {
    dogs.push(newDog);
    saveDogs();
    renderDogGallery();
    dogForm.reset();
    formOverlay.classList.remove('visible');
    submitBtn.disabled = false;
  }

  function renderDogGallery() {
    dogGallery.innerHTML = '';

    if (dogs.length === 0) {
      dogGallery.innerHTML = '<div class="no-dogs-container"><p class="no-dogs">Álbum vacío!<br>Agrega un perrito :)</p></div>';
      return;
    }

    dogs.forEach(dog => {
      const dogCard = document.createElement('div');
      dogCard.className = 'dog-card';

      dogCard.innerHTML = `
        ${dog.passedAway ? '<span class="status">✞</span>' : ''}
        <button class="delete-btn" data-id="${dog.id}">×</button>
        <img src="${dog.photo}" alt="${dog.name}">
        <h3>${dog.name}</h3>
        <p>Nacimiento: ${dog.birthdate ? formatDate(dog.birthdate) : 'No especificada'}</p>
        ${dog.funFacts ? `<p class="fun-fact">"${dog.funFacts}"</p>` : ''}
      `;

      dogGallery.appendChild(dogCard);
    });

    // Add event listeners to all delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const idToDelete = parseInt(this.getAttribute('data-id'));
        deleteDog(idToDelete);
      });
    });
  }

  function deleteDog(id) {
    if (confirm('¿Seguro de que quieres eliminar este perrito? :(')) {
      dogs = dogs.filter(dog => dog.id !== id);
      saveDogs();
      renderDogGallery();
    }
  }

  function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, month - 1, day);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  }

  function saveDogs() {
    localStorage.setItem('dogs', JSON.stringify(dogs));
  }

  // Check for saved theme preference
  if (localStorage.getItem('theme') === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    themeToggle.textContent = '☀️ Modo Claro';
  }
});
