document.addEventListener('DOMContentLoaded', () => {
    let worksData = [];
    let categoriesData = [];

    function fetchWorks() {
        fetch("http://localhost:5678/api/works")
            .then(response => response.json())
            .then(data => {
                worksData = data;
                addWorksToModalGallery(worksData);
                addWorks(worksData);
            });
    }

    function fetchCategories() {
        fetch("http://localhost:5678/api/categories")
            .then(response => response.json())
            .then(data => {
                categoriesData = data;
                formCategorySelect();
            });
    }

    function addWorksToModalGallery(works) {
        const modalGallery = document.querySelector(".modal-gallery");
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
            icon.addEventListener("click", (event) => {
                event.preventDefault();
                removeWorkFromDOM(work.id);
            });

            workItem.appendChild(workImg);
            workItem.appendChild(iconDiv);
            modalGallery.appendChild(workItem);
        });
    }

    function removeWorkFromDOM(workId) {
        fetch(`http://localhost:5678/api/works/${workId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la suppression du travail');
            }
            const modalWorkElement = document.getElementById(`modal-work-${workId}`);
            if (modalWorkElement) {
                modalWorkElement.remove();
            }
            const workElement = document.getElementById(`work-${workId}`);
            if (workElement) {
                workElement.remove();
            }

            worksData = worksData.filter(work => work.id !== workId);
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert("Une erreur est survenue. Veuillez réessayer plus tard.");
        });
    }

    function getAuthToken() {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('Token d\'authentification manquant');
        }
        return token;
    }

    function addNewWork(formData) {
        const authToken = getAuthToken();
        if (!authToken) {
            console.error('Token d\'authentification manquant');
            return;
        }

        fetch("http://localhost:5678/api/works", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`, 
            },
            body: formData
        })
        .then(response => response.json().then(data => ({ status: response.status, body: data })))
        .then(({ status, body }) => {
            if (status === 201) {
                worksData.push(body);
                addWorksToModalGallery(worksData);
                const workGallery = document.querySelector(".gallery");
                const newWorkFigure = createWorkFigure(body);
                workGallery.appendChild(newWorkFigure);
            } else {
                alert("Erreur lors de l'ajout du travail.");
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert("Une erreur est survenue. Veuillez réessayer plus tard.");
        });
        return false;
    }

    function createWorkFigure(work) {
        const workFigure = document.createElement("figure");
        workFigure.id = `work-${work.id}`;

        const workImg = document.createElement("img");
        workImg.src = work.imageUrl;
        workImg.alt = work.title;

        const workFigCaption = document.createElement("figcaption");
        workFigCaption.textContent = work.title;

        workFigure.appendChild(workImg);
        workFigure.appendChild(workFigCaption);

        return workFigure;
    }


    function formCategorySelect() {
        const categorySelect = document.getElementById("photo-category");
        categorySelect.innerHTML = '';
        categoriesData.forEach(category => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    }

    const modal = document.getElementById("open-modal");
    const modalLink = document.getElementById("modal-link");
    const closeModalButtons = document.querySelectorAll(".close-modal");
    const addPhotoButton = document.getElementById("add-photo-1");
    const modalContent1 = document.querySelector(".modal-content-1");
    const modalContent2 = document.querySelector(".modal-content-2");
    const arrowReturn = document.querySelector(".arrow-return");
    const photoFileInput = document.getElementById("photo-file");
    const photoTitleInput = document.getElementById("photo-title");
    const photoCategorySelect = document.getElementById("photo-category");
    const addPhotoButton2 = document.getElementById("add-photo-2");
    const photoContainer = document.querySelector(".photo-container");

    modalLink.addEventListener("click", (event) => {
        event.preventDefault();
        modal.style.display = "block";
        modalContent1.style.display = "flex";
        modalContent2.style.display = "none";
    });

    closeModalButtons.forEach(element => {
        element.addEventListener("click", (event) => {
            event.preventDefault();
            modal.style.display = "none";
        });
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    addPhotoButton.addEventListener("click", (event) => {
        event.preventDefault();
        modalContent1.style.display = "none";
        modalContent2.style.display = "flex";
        formCategorySelect();
    });

    addPhotoButton2.addEventListener("click", (event) => {
        event.preventDefault();
        if (addPhotoButton2.classList.contains("active")) {
            const formData = new FormData();
            formData.append("image", photoFileInput.files[0]);
            formData.append("title", photoTitleInput.value);
            formData.append("category", photoCategorySelect.value);

            addNewWork(formData);
        }
    });

    arrowReturn.addEventListener("click", (event) => {
        event.preventDefault();
        modalContent1.style.display = "flex";
        modalContent2.style.display = "none";
    });

    photoFileInput.addEventListener("change", () => {
        const file = photoFileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                photoContainer.innerHTML = `<img src="${e.target.result}" id="preview-photo" alt="Prévisualisation de la photo">`;
                validateForm();
            };
            reader.readAsDataURL(file);
        }
    });

    function validateForm() {
        if (photoTitleInput.value.trim() !== "" && photoFileInput.files.length > 0 && photoCategorySelect.value !== "") {
            addPhotoButton2.classList.add("active");
        } else {
            addPhotoButton2.classList.remove("active");
        }
    }

    photoTitleInput.addEventListener("input", validateForm);
    photoCategorySelect.addEventListener("change", validateForm);

    fetchWorks();
    fetchCategories();
});
