// script.js

import {
  db,
  doc,
  setDoc,
  onSnapshot
}
from "./firebase.js";

const timeline =
  document.getElementById("timeline");

const progressFill =
  document.getElementById("progressFill");

const progressText =
  document.getElementById("progressText");

let moviesData = [];
let watchedMovies = {};

/* =========================
   LOAD MOVIES
========================= */

async function loadMovies(){

  try{

    const response =
      await fetch("movies.json");

    if(!response.ok){

      throw new Error(
        "No se pudo cargar movies.json"
      );
    }

    const movies =
      await response.json();

    moviesData = movies;

    listenRealtime();

  }catch(error){

    console.error(error);

    timeline.innerHTML = `
      <div class="error-box">
        Error cargando películas
      </div>
    `;
  }
}

/* =========================
   FIREBASE REALTIME
========================= */

function listenRealtime(){

  const roadmapRef =
    doc(db,"roadmaps","marvel");

  onSnapshot(roadmapRef,(snapshot)=>{

    if(snapshot.exists()){

      watchedMovies =
        snapshot.data();

    }else{

      watchedMovies = {};
    }

    renderMovies(moviesData);
  });
}

/* =========================
   TOGGLE WATCHED
========================= */

async function toggleMovie(movieTitle){

  const roadmapRef =
    doc(db,"roadmaps","marvel");

  const current =
    watchedMovies[movieTitle]?.watched || false;

  const comments =
    watchedMovies[movieTitle]?.comments || [];

  watchedMovies[movieTitle] = {

    watched: !current,

    comments
  };

  await setDoc(
    roadmapRef,
    watchedMovies
  );
}

/* =========================
   ADD COMMENT
========================= */

async function addComment(movieTitle,text){

  if(!text.trim()) return;

  const roadmapRef =
    doc(db,"roadmaps","marvel");

  const watched =
    watchedMovies[movieTitle]?.watched || false;

  const comments =
    watchedMovies[movieTitle]?.comments || [];

  comments.push({
    text
  });

  watchedMovies[movieTitle] = {

    watched,

    comments
  };

  await setDoc(
    roadmapRef,
    watchedMovies
  );
}

/* =========================
   RENDER
========================= */

function renderMovies(movies){

  timeline.innerHTML = "";

  movies.forEach((movie,index)=>{

    const watched =
      watchedMovies[movie.title]?.watched;

    const comments =
      watchedMovies[movie.title]?.comments || [];

    const card =
      document.createElement("div");

    card.className =
      `movie-card
      ${index % 2 === 0 ? "left":"right"}
      ${watched ? "completed":""}`;

    card.innerHTML = `

      <div class="movie-header">

        <div>

          <div class="movie-title">
            ${movie.title}
          </div>

          <div class="movie-year">
            ${movie.year}
          </div>

        </div>

        <div class="
          status
          ${watched ? "watched":"pending"}
        ">

          ${watched
            ? "Vista"
            : "Pendiente"}

        </div>

      </div>

      <div class="comments-section">

        <div class="comments-list">

          ${comments.map(comment => `

            <div class="comment-item">
              ${comment.text}
            </div>

          `).join("")}

        </div>

        <div class="comment-input-container">

          <input
            type="text"
            class="comment-input"
            placeholder="Añadir comentario..."
          />

          <button class="comment-btn">
            Guardar
          </button>

        </div>

      </div>

      <button class="watch-btn">

        ${watched
          ? "Marcar como pendiente"
          : "Marcar como vista"}

      </button>
    `;

    /* WATCH BUTTON */

    const button =
      card.querySelector(".watch-btn");

    button.addEventListener("click",()=>{

      toggleMovie(movie.title);
    });

    /* COMMENTS */

    const commentInput =
      card.querySelector(".comment-input");

    const commentBtn =
      card.querySelector(".comment-btn");

    commentBtn.addEventListener("click",()=>{

      addComment(
        movie.title,
        commentInput.value
      );

      commentInput.value = "";
    });

    commentInput.addEventListener("keypress",(e)=>{

      if(e.key === "Enter"){

        addComment(
          movie.title,
          commentInput.value
        );

        commentInput.value = "";
      }
    });

    timeline.appendChild(card);
  });

  updateProgress(movies);
}

/* =========================
   PROGRESS
========================= */

function updateProgress(movies){

  let watchedCount = 0;

  movies.forEach(movie=>{

    if(
      watchedMovies[movie.title]?.watched
    ){
      watchedCount++;
    }
  });

  const percentage =
    (watchedCount / movies.length) * 100;

  progressFill.style.width =
    `${percentage}%`;

  progressText.innerText =
    `${watchedCount} / ${movies.length} vistas`;
}

/* =========================
   INIT
========================= */

loadMovies();
