const tableRef = document.querySelector(".movies__table");
const actionsListRef = document.querySelector(".actions__list");
const actionButton = document.querySelector(".action__button");
const backdropRef = document.querySelector(".backdrop");
const formRef = document.querySelector("[data-form]");
const closeModalBtnRef = document.querySelector("[data-button=closeModal]");

let removedInputs = [];
formRef.querySelectorAll("input").forEach((input) => removedInputs.push(input));

closeModalBtnRef.addEventListener("click", () =>
  backdropRef.classList.toggle("is-hidden")
);

fetch("http://localhost:3000/movies")
  .then((res) => {
    if (!res.ok) {
      console.log("!res.ok");
    }
    return res.json();
  })
  .then((data) => {
    data.forEach((movie) => {
      tableRef.insertAdjacentHTML(
        "beforeend",
        `<tr>
        <td>${movie.title}</td>
        <td>${movie.genre}</td>
        <td>${movie.director}</td>
        <td>${movie.year}</td>
        <td>${movie.id}</td>
    </tr>`
      );
    });
  })
  .catch((err) => {
    console.log("err");
  });

actionsListRef.addEventListener("click", (evt) => {
  if (evt.target.nodeName === "UL" || evt.target.nodeName === "LI") {
    return;
  }

  if (evt.target.hasAttribute("data-add")) {
    backdropRef.classList.toggle("is-hidden");

    if (formRef.querySelectorAll("input").length !== 4) {
      removedInputs.forEach((input) => formRef.prepend(input));
    }

    if (formRef.querySelector(".edit-movie__input")) {
      document.querySelector(".edit-movie__input").remove();
    }
    if (formRef.querySelector(".remove-movie__input")) {
      document.querySelector(".remove-movie__input").remove();
    }

    formRef.addEventListener("submit", (e) => {
      e.preventDefault();

      const newMovie = {
        title: e.target.elements.name.value,
        genre: e.target.elements.genre.value,
        director: e.target.elements.director.value,
        year: e.target.elements.year.value,
      };

      fetch("http://localhost:3000/movies", {
        method: "POST",
        body: JSON.stringify(newMovie),
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      })
        .then((res) => {
          if (!res.ok) {
            console.log("!res.ok");
          }
          return res.json();
        })
        .then((data) => {
          console.log(data);
        })
        .catch((err) => console.log("err", err));
    });
  }

  if (evt.target.hasAttribute("data-edit")) {
    backdropRef.classList.toggle("is-hidden");
    if (!formRef.querySelector(".edit-movie__input")) {
      formRef.insertAdjacentHTML(
        "afterbegin",
        `<input type="text" placeholder="Film id" class="edit-movie__input"/>`
      );
    } else return;

    if (formRef.querySelector(".remove-movie__input")) {
      document.querySelector(".remove-movie__input").remove();
    }

    if (formRef.querySelectorAll("input").length !== 5) {
      removedInputs.forEach((input) =>
        formRef.querySelector(".edit-movie__input").after(input)
      );
    }

    document
      .querySelector(".edit-movie__input")
      .addEventListener("input", (event) => {
        fetch(`http://localhost:3000/movies/${event.target.value}`)
          .then((res) => res.json())
          .then((data) => {
            formRef.elements.name.value = data.title;
            formRef.elements.genre.value = data.genre;
            formRef.elements.director.value = data.director;
            formRef.elements.year.value = data.year;
          })
          .catch((err) => console.log("err", err));
      });

    formRef.addEventListener("submit", (e) => {
      const editInputRef = document.querySelector(".edit-movie__input");
      e.preventDefault();

      const updateMovie = {
        title: e.target.elements.name.value,
        genre: e.target.elements.genre.value,
        director: e.target.elements.director.value,
        year: e.target.elements.year.value,
      };

      fetch(`http://localhost:3000/movies/${editInputRef.value}`, {
        method: "PATCH",
        body: JSON.stringify(updateMovie),
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      })
        .then((res) => {
          if (!res.ok) {
            console.log("!res.ok");
          }
          return res.json();
        })
        .then((data) => {
          console.log(data);
        })
        .catch((err) => console.log("err", err));
    });
  }

  if (evt.target.hasAttribute("data-remove")) {
    backdropRef.classList.toggle("is-hidden");
    removedInputs = [];
    formRef.querySelectorAll("input").forEach((input) => {
      removedInputs.push(input);
      input.remove();
    });
    formRef.insertAdjacentHTML(
      "afterbegin",
      `<input placeholder="Remove movie id" class="remove-movie__input"/>`
    );

    formRef.addEventListener("submit", (e) => {
      const removeMovieInputValue = document.querySelector(
        ".remove-movie__input"
      );
      e.preventDefault();

      fetch(`http://localhost:3000/movies/${removeMovieInputValue.value}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (!res.ok) {
            console.log("!res.ok");
          }
          return res.json();
        })
        .then((data) => {
          console.log(data);
        })
        .catch((err) => console.log("err", err));
    });
  }
});
