document.addEventListener('DOMContentLoaded', () => {
  let worksData = [];

  function fetchWorks() {
    fetch("http://localhost:5678/api/works")
      .then(response => response.json())
      .then(data => {
        worksData = data;
        addWorksToModalGallery(worksData);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des travaux:', error);
      });
  }
  function fetchCategories() {
    fetch("http://localhost:5678/api/categories")
      .then(response => response.json())
      .then(data => {
        categoriesData = data;
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des catégories:', error);
      });
  }

  function addWorksToModalGallery(works) {
    const modalGallery = document.querySelector(".modal-gallery");
    if (modalGallery) {
      modalGallery.innerHTML = '';
      works.forEach(work => {
        const workItem = document.createElement("div");
        workItem.className = "modal-gallery-item";
        workItem.id = `modal-work-${work.id}`;

        const workImg = document.createElement("img");
        workImg.src = work.imageUrl;
        workImg.alt = work.title;
        
        const iconDiv = document.createElement("div");
        iconDiv.classList.add("icon-div");
        const icon = document.createElement("i");
        icon.classList.add("fa-solid", "fa-trash-can"); 
        iconDiv.appendChild(icon);
         icon.addEventListener("click", () => {
                    deleteWork(work.id, workItem);
                });

        workItem.appendChild(workImg);
        workItem.appendChild(iconDiv);
        modalGallery.appendChild(workItem);
      });
    }
  }
  function deleteWork(workId, workItem) {
    fetch("http://localhost:5678/api/works/${workId}", {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Suppression réussie, retirer l'élément du DOM
            workItem.remove();
        } else {
            console.error('Échec de la suppression du travail');
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
    });
}

  function formCategorySelect() {
    const categorySelect = document.getElementById("photo-category");
    if (categorySelect) {
      categorySelect.innerHTML = '';
      categoriesData.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
      });
    }
  }

  const modal = document.getElementById("open-modal");
  const modalLink = document.getElementById("modal-link");
  const closeModalButtons = document.querySelectorAll(".close-modal");
  const addPhotoButton = document.getElementById("add-photo-1");
  const modalContent1 = document.querySelector(".modal-content-1");
  const modalContent2 = document.querySelector(".modal-content-2");
  const arrowReturn = document.querySelector (".arrow-return");

  if (modalLink) {
    modalLink.addEventListener("click", (event) => {
      event.preventDefault();
      modal.style.display = "block";
      modalContent1.style.display ="flex";
      modalContent2.style.display = "none";
    });
  }

  if (closeModalButtons) {
    closeModalButtons.forEach(element => {
      element.addEventListener("click", () => {
        modal.style.display = "none";
      });
    });
  }

  if (window) {
    window.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  }

  if (addPhotoButton) {
    addPhotoButton.addEventListener("click", () => {
      modalContent1.style.display ="none";
      modalContent2.style.display="flex";
      formCategorySelect();
    });
  }
  if (arrowReturn) {
    arrowReturn.addEventListener("click", () => {
      modalContent1.style.display ="flex";
      modalContent2.style.display="none";
      console.log ("bouton cliqué");
    });
  }
  fetchWorks();
  fetchCategories(); 
});