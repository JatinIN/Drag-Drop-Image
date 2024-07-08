document.addEventListener("DOMContentLoaded", () => {
    const dropZone = document.getElementById("dropZone");
    const fileInput = document.getElementById("fileInput");
    const imageContainer = document.getElementById("fileList");
    const popup = document.getElementById("popup");
    const closePopup = document.getElementById("closePopup");
    const savePopup = document.getElementById("savePopup");
    const maxImages = 5;

    dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.classList.add("dragover");
    });

    dropZone.addEventListener("dragleave", () => {
        dropZone.classList.remove("dragover");
    });

    dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.classList.remove("dragover");
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    });

    dropZone.addEventListener("click", () => {
        fileInput.click();
    });

    fileInput.addEventListener("change", () => {
        const files = Array.from(fileInput.files);
        handleFiles(files);
    });

    closePopup.addEventListener("click", () => {
        popup.style.display = "none";
    });

     savePopup.addEventListener("click", () => {
        popup.style.display = "none";
    });

    function handleFiles(files) {
        if (imageContainer.children.length + files.length > maxImages) {
            alert(`You can only upload a maximum of ${maxImages} images.`);
            return;
        }

        files.forEach(file => {
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imageWrapper = document.createElement("div");
                    imageWrapper.classList.add("image-wrapper");

                    const img = document.createElement("img");
                    img.src = e.target.result;

                    const deleteButton = document.createElement("button");
                    deleteButton.classList.add("delete-button");
                    deleteButton.textContent = "×";
                    deleteButton.addEventListener("click", () => {
                        imageContainer.removeChild(imageWrapper);
                        updateSessionStorage();
                    });
                    
                    const descriptionInput = document.createElement("input");
                    descriptionInput.type = "text";
                    descriptionInput.placeholder = "Enter description...";
                    descriptionInput.classList.add("description");
                    descriptionInput.addEventListener("blur", () => {
                        showPopup();
                        updateSessionStorage();
                    });

                    imageWrapper.appendChild(img);
                    imageWrapper.appendChild(deleteButton);
                    imageWrapper.appendChild(descriptionInput);
                    imageContainer.appendChild(imageWrapper);
                    updateSessionStorage();
                };
                reader.readAsDataURL(file);
            }
        });
    }

    function showPopup() {
        // popup.style.display = "block";
        // setTimeout(() => {
        //     popup.style.display = "none";
        // }, 2000);

         alert(`Description Save Successfully.`);
    }

    function updateSessionStorage() {
        const imagesData = [];
        const imageWrappers = document.querySelectorAll(".image-wrapper");
        imageWrappers.forEach(wrapper => {
            const img = wrapper.querySelector("img").src;
            const description = wrapper.querySelector(".description").value;
            imagesData.push({ img, description });
        });
        sessionStorage.setItem("imagesData", JSON.stringify(imagesData));
    }

    function loadSessionStorage() {
        const imagesData = JSON.parse(sessionStorage.getItem("imagesData")) || [];
        imagesData.forEach(data => {
            const imageWrapper = document.createElement("div");
            imageWrapper.classList.add("image-wrapper");

            const img = document.createElement("img");
            img.src = data.img;

            const deleteButton = document.createElement("button");
            deleteButton.classList.add("delete-button");
            deleteButton.textContent = "×";
            deleteButton.addEventListener("click", () => {
                imageContainer.removeChild(imageWrapper);
                updateSessionStorage();
            });

            const descriptionInput = document.createElement("input");
            descriptionInput.type = "text";
            descriptionInput.placeholder = "Enter description";
            descriptionInput.value = data.description;
            descriptionInput.classList.add("description");
            descriptionInput.addEventListener("blur", () => {
                showPopup();
                updateSessionStorage();
            });

            imageWrapper.appendChild(img);
            imageWrapper.appendChild(deleteButton);
            imageWrapper.appendChild(descriptionInput);
            imageContainer.appendChild(imageWrapper);
        });
    }

    loadSessionStorage();
});