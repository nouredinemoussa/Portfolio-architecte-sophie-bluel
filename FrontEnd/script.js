document.addEventListener('DOMContentLoaded', () => {
  let worksData = [];
    function fetchWorks() {
      fetch("http://localhost:5678/api/works")
        .then(response => response.json())
        .then(data => {
          worksData = data;
          addWorks(worksData);
        })
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
    })
  }

     function addCategories(categories) {
      const categoriesGroup = document.querySelector(".categories")

      const buttonTous = document.createElement("button");
      buttonTous.textContent = "Tous";
      buttonTous.className = "filter";
      buttonTous.addEventListener("click", () =>
      {
        addWorks(worksData);
      });
      categoriesGroup.appendChild(buttonTous);

      categories.forEach(category => {
        const buttonCategory = document.createElement("button");
        buttonCategory.textContent = category.name;
        buttonCategory.addEventListener("click", () => {
          categoryFilter(category.id);
        });
        buttonCategory.className = "filter";
        categoriesGroup.appendChild(buttonCategory);
      })
     }
     function categoryFilter(categoryId) {
      const filteredWorks = worksData.filter(work => work.categoryId === categoryId);
      addWorks(filteredWorks);
     }

     fetchCategories();
     fetchWorks();
  });
 