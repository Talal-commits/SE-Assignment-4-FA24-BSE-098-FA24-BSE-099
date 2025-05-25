document.addEventListener("DOMContentLoaded", () => {
  // Initial pets data same as your hardcoded ones:
  const initialPets = [
    {
      name: "Whiskey",
      type: "dog",
      age: "4",
      image: "../images/1.jpg"
    },
    {
      name: "Buddy",
      type: "dog",
      age: "4",
      image: "../images/2.jpg"
    }
  ];

  // Initialize localStorage with initialPets if empty
  if (!localStorage.getItem("pets")) {
    localStorage.setItem("pets", JSON.stringify(initialPets));
  }

  const animalTypeSelect = document.getElementById("animal-type");
  const filterBySelect = document.getElementById("filter-by");
  const searchInput = document.getElementById("search-input");
  const petContainer = document.querySelector("main"); // Adjust if needed
  const paginationContainer = document.getElementById("pagination");

  const petsPerPage = 9;
  let currentPage = 1;

  function renderPets(petList, page) {
    petContainer.querySelectorAll(".card").forEach(card => card.remove());

    const startIndex = (page - 1) * petsPerPage;
    const endIndex = page * petsPerPage;
    const petsToShow = petList.slice(startIndex, endIndex);

    petsToShow.forEach((pet) => {
      const card = document.createElement("div");
      card.className = "card";
      card.setAttribute("data-name", pet.name.toLowerCase());
      card.setAttribute("data-species", pet.type.toLowerCase());
      card.setAttribute("data-age", pet.age);

      card.innerHTML = `
        <div class="pet_image">
          <img src="${pet.image}" alt="${pet.name}" />
          <p><b>${pet.name}</b></p>
          <p>Age: ${pet.age} years</p>
          <button>Adopt Now</button>
        </div>
      `;

      petContainer.appendChild(card);
    });
  }

  function renderPagination(totalItems, currentPage) {
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(totalItems / petsPerPage);

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className = i === currentPage ? 'active' : '';
      btn.addEventListener("click", () => {
        currentPage = i;
        applyFilters(); // reapply filters and re-render page
      });
      paginationContainer.appendChild(btn);
    }
  }

  function applyFilters() {
    // Always read fresh pets from localStorage to include newly added pets
    const pets = JSON.parse(localStorage.getItem("pets")) || [];

    const selectedType = animalTypeSelect.value.toLowerCase();
    const filterBy = filterBySelect.value;
    const searchTerm = searchInput.value.toLowerCase();

    const filteredPets = pets.filter(pet => {
      const matchesType = selectedType === "all" || pet.type.toLowerCase() === selectedType;
      const matchesFilter = 
        (filterBy === "name" && pet.name.toLowerCase().includes(searchTerm)) ||
        (filterBy === "age" && pet.age.includes(searchTerm));

      return matchesType && matchesFilter;
    });

    renderPets(filteredPets, currentPage);
    renderPagination(filteredPets.length, currentPage);
  }

  // Attach event listeners
  animalTypeSelect.addEventListener("change", () => {
    currentPage = 1;
    applyFilters();
  });

  filterBySelect.addEventListener("change", () => {
    currentPage = 1;
    applyFilters();
  });

  searchInput.addEventListener("input", () => {
    currentPage = 1;
    applyFilters();
  });

  // Initial display
  applyFilters();
});
