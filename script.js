// script.js

import {
  db,
  doc,
  getDoc,
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

async function loadMovies(){

  try{

    const response =
      await fetch("movies.json");

    const movies =
      await response.json();

    moviesData = movies;

    listenRealtime();

  }catch(error){

    console.error(error);

    timeline.innerHTML =
      `<div class="error-box">
        Error cargando películas
      </div>`;
  }
}

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

async function toggleMovie(movieTitle){

  const roadmapRef =
    doc(db,"roadmaps","marvel");

  watchedMovies[movieTitle] =
    !watchedMovies[movieTitle];

  await setDoc(
    roadmapRef,
    watchedMovies
  );
}

function renderMovies(movies){

  timeline.innerHTML = "";

  movies.forEach((movie,index)=>{

    const watched =
      watchedMovies[movie.title];

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
            ? "✅ VISTO"
            : "🎬 PENDIENTE"}
        </div>

      </div>

      <button class="watch-btn">

        ${watched
          ? "Marcar como pendiente"
          : "Marcar como visto"}

      </button>
    `;

    const button =
      card.querySelector(".watch-btn");

    button.addEventListener("click",()=>{

      toggleMovie(movie.title);
    });

    timeline.appendChild(card);
  });

  updateProgress(movies);
}

function updateProgress(movies){

  let watchedCount = 0;

  movies.forEach(movie=>{

    if(watchedMovies[movie.title]){
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

loadMovies();