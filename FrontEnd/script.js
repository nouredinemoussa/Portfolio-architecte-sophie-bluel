document.addEventListener('DOMContentLoaded', () => {
  let worksData = [];

  function fetchWorks() {
    fetch("http://localhost:5678/api/works")
      .then(response => response.json())
      .then(data => {
        worksData = data;
        addWorks(worksData);
      });
  }

  function addWorks(works) {
    const workGallery = document.querySelector(".gallery");
    workGallery.innerHTML = '';
    works.forEach(work => {
      const workFigure = document.createElement("figure");
      workFigure.id = `work-${work.id}`;

      const workImg = document.createElement("img");
      workImg.src = work.imageUrl;
      workImg.alt = work.title;

      const workFigCaption = document.createElement("figcaption");
      workFigCaption.textContent = work.title;

      workFigure.appendChild(workImg);
      workFigure.appendChild(workFigCaption);

      workGallery.appendChild(workFigure);
    });
  }

  function fetchCategories() {
    fetch("http://localhost:5678/api/categories")
      .then(response => response.json())
      .then(data => {
        addCategories(data);
      });
  }

  function addCategories(categories) {
    const categoriesGroup = document.querySelector(".categories");

    const buttonTous = document.createElement("button");
    buttonTous.textContent = "Tous";
    buttonTous.className = "filter";
    buttonTous.id = "filter-tous"
    buttonTous.addEventListener("click", () => {
      addWorks(worksData);
      setActiveButton(buttonTous);
    });
    categoriesGroup.appendChild(buttonTous);

    categories.forEach(category => {
      const buttonCategory = document.createElement("button");
      buttonCategory.textContent = category.name;
      buttonCategory.id = `filter-${category.id}`
      buttonCategory.addEventListener("click", () => {
        categoryFilter(category.id);
        activeFilterButton(buttonCategory);
      });
      buttonCategory.className = "filter";
      categoriesGroup.appendChild(buttonCategory);
    });

    activeFilterButton(buttonTous);
  }

  function categoryFilter(categoryId) {
    const filteredWorks = worksData.filter(work => work.categoryId === categoryId);
    addWorks(filteredWorks);
  }

  function activeFilterButton(activeButton) {
    const buttons = document.querySelectorAll('.filter');
    buttons.forEach(button => {
      button.classList.remove('active-filter');
    });
    activeButton.classList.add('active-filter');
  }

  fetchCategories();
  fetchWorks();

  const loginForm = document.getElementById('login-form');
  const errorMessage = document.getElementById('error-message');

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = document.getElementById('mail').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:5678/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: email, password: password })
    })
    .then(response => response.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        window.location.href = 'index.html';
      } else {
        errorMessage.textContent = 'Identifiant ou mot de passe incorrect.';
      }
    })
    .catch(error => {
      console.error('Erreur:', error);
      errorMessage.textContent = 'Une erreur est survenue. Veuillez réessayer plus tard.';
    });
  });
});
