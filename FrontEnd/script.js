document.addEventListener('DOMContentLoaded', () => {
    function fetchWorks() {
      fetch("http://localhost:5678/api/works")
        .then(response => response.json())
        .then(data => {
          addWorks(data);
        })
        .catch(error => {
          console.error('Erreur:', error);
        });
    }
  

    function addWorks(works) {
      const workGallery = document.querySelector(".gallery");
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
  
 
    fetchWorks();
  });
  