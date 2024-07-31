document.addEventListener("DOMContentLoaded", () => {
  let worksData = [];
  let categoriesData = [];

  function fetchWorks() {
    fetch("http://localhost:5678/api/works")
      .then((response) => response.json())
      .then((data) => {
        worksData = data;
        addWorks(worksData);
      });
  }

  function fetchCategories() {
    fetch("http://localhost:5678/api/categories")
      .then((response) => response.json())
      .then((data) => {
        categoriesData = data;
        addCategories(categoriesData);
      });
  }

  function addWorks(works) {
    const workGallery = document.querySelector(".gallery");
    workGallery.innerHTML = "";
    works.forEach((work) => {
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

  function addCategories(categories) {
    const categoriesGroup = document.querySelector(".categories");

    const buttonTous = document.createElement("button");
    buttonTous.textContent = "Tous";
    buttonTous.className = "filter";
    buttonTous.id = "filter-tous";
    buttonTous.addEventListener("click", () => {
      addWorks(worksData);
      activeFilterButton(buttonTous);
    });
    categoriesGroup.appendChild(buttonTous);

    categories.forEach((category) => {
      const buttonCategory = document.createElement("button");
      buttonCategory.textContent = category.name;
      buttonCategory.id = `filter-${category.id}`;
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
    const filteredWorks = worksData.filter(
      (work) => work.categoryId === categoryId
    );
    addWorks(filteredWorks);
  }

  function activeFilterButton(activeButton) {
    const buttons = document.querySelectorAll(".filter");
    buttons.forEach((button) => {
      button.classList.remove("active-filter");
    });
    activeButton.classList.add("active-filter");
  }
  const authLink = document.getElementById('auth-link');
  const editDiv = document.getElementById('edit');
  const modalLink = document.getElementById('update');
  const header = document.getElementById('header-container');


  function checkUserAuth() {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      authLink.textContent = 'logout';
      authLink.href = '#';
      authLink.addEventListener('click', logout);
     
      editDiv.style.display = 'flex';
      modalLink.style.display = 'flex';
      header.style.marginTop = '0';
    } else {
      authLink.textContent = 'login';
      authLink.href = 'login.html';
      authLink.removeEventListener('click', logout);
      
      editDiv.style.display = 'none';
      modalLink.style.display = 'none';
      header.style.marginTop = '50px';
    }
  }

  function logout(event) {
    event.preventDefault();
    localStorage.removeItem('authToken');
    checkUserAuth();
  }

  fetchCategories();
  fetchWorks();
  checkUserAuth();
});
