const tableRef = document.querySelector(".movies__table");
const actionsListRef = document.querySelector(".actions__list");
const actionButton = document.querySelector(".action__button");
const backdropRef = document.querySelector(".backdrop");
const formRef = document.querySelector("[data-form]");
const closeModalBtnRef = document.querySelector("[data-button=closeModal]");

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
    evt.target.addEventListener("click", () => {
      backdropRef.classList.toggle("is-hidden");
      if (!formRef.querySelector(".edit-movie__input")) {
        return;
      } else {
        document.querySelector(".edit-movie__input").remove();
      }
    });
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
        });
    });
  }

  if (evt.target.hasAttribute("data-edit")) {
    evt.target.addEventListener("click", () => {
      backdropRef.classList.toggle("is-hidden");
      if (!formRef.querySelector(".edit-movie__input")) {
        formRef.insertAdjacentHTML(
          "afterbegin",
          `<input type="text" placeholder="Film id" class="edit-movie__input"/>`
        );
      } else return;
    });

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
        });
    });
  }

  if (evt.target.hasAttribute("data-remove")) {
    backdropRef.classList.toggle("is-hidden");
    formRef.querySelectorAll("input").forEach((input) => input.remove());
    formRef.insertAdjacentHTML(
      "afterbegin",
      `<input placeholder="Remove movie id" class="remove-movie__input"/>`
    );

    if (!formRef.querySelector(".edit-movie__input")) {
      return;
    } else {
      document.querySelector(".edit-movie__input").remove();
    }

    formRef.addEventListener("submit", (e) => {
      e.preventDefault();

      const removeMovieInputRef = document.querySelector(
        ".remove-movie__input"
      );
      console.log(removeMovieInputRef.value);

      fetch(`http://localhost:3000/movies/id/${removeMovieInputRef.value}`, {
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
