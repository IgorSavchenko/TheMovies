//=====================================================================
// siema slider
import Siema from 'siema';
//default function
function onInitCallback() {
  console.log('Siema initialised bro :)');
}
//default function
function onChangeCallback() {
  console.log(`The index of current slide is: ${this.currentSlide}`);
}
//init slider
function initSlider() {
  const mySiema = new Siema({
    selector: '.slider',
    perPage: 1,
    startIndex: 0,
    loop: true,
    draggable: true,
    onInit: addNavigation,
    onChange: setActiveButton
  });
  // listen for keydown event
  setInterval(() => mySiema.next(), 5000);
  // Add a function that generates pagination to Siema
  function addNavigation() {
    let length = this.innerElements.length;
    for (let i = 0; i < length; i++) {
      const BTN = document.createElement('button');
      BTN.classList.add('slider-button');
      if (i == 0) BTN.classList.add('slider-button--active');
      BTN.addEventListener('click', () => this.goTo(i));
      this.selector.nextSibling.appendChild(BTN);
    }
  }
  // Add a function that change buttons in slider
  function setActiveButton(){
    document.querySelectorAll('.slider-button').forEach((b, i) => {
      if (i == (this.currentSlide || 0)){
        b.classList.add("slider-button--active");
      } else {
        b.classList.remove("slider-button--active");
      }
    });
  }
}
//=====================================================================
//navigation menu open/close
const ACTIVE_CLASS = 'is-active';
const HAMBURGER = $('.navbar-burger');
const MENU = $('.navbar-menu');

HAMBURGER.click(() => {
  MENU.toggleClass(ACTIVE_CLASS);
  HAMBURGER.toggleClass(ACTIVE_CLASS);
});
//=====================================================================
//smooth scroll effect
// Select all links with hashes
$('a[href*="#"]')
  // Remove links that don't actually link to anything
  .not('[href="#"]')
  .not('[href="#0"]')
  .click(function(event) {
    // On-page links
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
      &&
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000, function() {
          // Callback after animation
          // Must change focus!
          var $target = $(target);
          $target.focus();
          if ($target.is(":focus")) { // Checking if the target was focused
            return false;
          } else {
            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
          };
        });
      }
    }
  });
//=====================================================================
//external database usage
axios.defaults.baseURL = "https://api.themoviedb.org/3";
const API_KEY = 'b38536f32716ab63ab8de5cb6ef96724';
var BASE_IMG_URL;
var IMG_SIZE_S;
var IMG_SIZE_M;
var IMG_SIZE_L;
var IMG_SIZE_XL;
// get base configuration for images database
axios.get(`/configuration?api_key=${API_KEY}`)
  .then(function (response) {
    BASE_IMG_URL = response.data.images.secure_base_url;
    IMG_SIZE_S = response.data.images.backdrop_sizes[0];
    IMG_SIZE_M = response.data.images.backdrop_sizes[1];
    IMG_SIZE_L = response.data.images.backdrop_sizes[2];
    IMG_SIZE_XL = response.data.images.backdrop_sizes[3];
  })
  .catch(err => console.log(err));
//=====================================================================
showActualMovies();
//initialize modal window and button
function initModals() {
  document.querySelectorAll('[data-modal-open], [data-modal-close]').forEach(function(item) {
    item.addEventListener('click', function(event) {
      event.preventDefault();
      $('.modal-image').attr('src', ``);
      if (item.dataset['modalOpen']) {
        // console.log(item.dataset['id']);
        searchMovieById(item.dataset['id']);
      }
      let key = item.dataset['modalOpen'] || item.dataset['modalClose'];
      document.querySelector('[data-modal='+key+']').classList.toggle(ACTIVE_CLASS);
    });
  });
}

//search movie by id
function searchMovieById(id) {
  axios.get(`/movie/${id}?api_key=${API_KEY}&language=en-US`)
  .then(function (response) {
    // console.log(response.data);
    let file_path = response.data.poster_path;
    let imgURL = BASE_IMG_URL + IMG_SIZE_M + file_path;
    $('.modal-image').attr('src', `${imgURL}`);
    $('.modal-title').text(`${response.data.original_title}`);
    if (response.data.production_companies.length > 0) {
      $('.modal-company').text(`${response.data.production_companies[0].name}`);
    } else {$('.modal-company').text('Information not available')};
    $('.modal-release').text(`${response.data.release_date}`);
    $('.modal-overwiew').text(`${response.data.overview}`);
    $('.modal-budget').text(`${response.data.budget} $`);
    $('.modal-duration').text(`${response.data.runtime} min`);
    $('.modal-raiting').text(`${response.data.vote_average*10}%`);
    $('.modal-reference').attr('href', `${response.data.homepage}`);
  })
  .catch(err => console.log(err));
}

// search movies by entered name
$("#search-button").click( () => {
    let value = $("#search-input").val().replace(/ /g, '+');
    // console.log(value);
    searchMoviesByName(value);
    initModals();
});

function searchMoviesByName(name) {
  // request example: https://api.themoviedb.org/3/search/movie?api_key={api_key}&query=Jack+Reacher
  axios.get(`/search/movie?api_key=${API_KEY}&query=${name}&page=1`)
  .then(function (response) {
    renderMediaContent(response.data.results);
    initModals();
  })
  .catch(err => console.log(err));
}

function searchUpcomingMovies() {
  // request example: https://api.themoviedb.org/3/movie/upcoming?api_key=<<api_key>>&language=en-US&page=1
  axios.get(`movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`)
  .then(function (response) {
    renderMediaContent(response.data.results);
    initModals();
  })
  .catch(err => console.log(err));
}

function searchPopularMovies() {
  // request example: https://api.themoviedb.org/3/movie/popular?api_key=<<api_key>>&language=en-US&page=1
  axios.get(`movie/popular?api_key=${API_KEY}&language=en-US&page=1`)
  .then(function (response) {
    renderMediaContent(response.data.results);
    initModals();
  })
  .catch(err => console.log(err));
}

function searchTopRatedMovies() {
  // request example: https://api.themoviedb.org/3/movie/top_rated?api_key=<<api_key>>&language=en-US&page=1
  axios.get(`movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`)
  .then(function (response) {
    renderMediaContent(response.data.results);
    initModals();
  })
  .catch(err => console.log(err));
}

function showActualMovies() {
  // request example: https://api.themoviedb.org/3/movie/now_playing?api_key=<<api_key>>&language=en-US&page=1
  axios.get(`/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`)
  .then(function (response) {
    // console.log(response.data.results);
    renderSliderContent(response.data.results);
    initSlider();
    initModals();
  })
  .catch(err => console.log(err));
}

function renderSliderContent(arr) {
  let sliderHTML = '';
  let slider = $('.slider');
  slider.html('');
  //render every single slider-item content
  $(arr).each(function (index, item) {
    let id = item.id;
    let file_path = item.backdrop_path;
    let imgURL = BASE_IMG_URL + IMG_SIZE_M + file_path;
    let title = item.title;
    let release = item.release_date;
    // console.log(item);
    sliderHTML += renderSliderTemplate(id, imgURL, title, release);
  });
  slider.append(sliderHTML);
}

let renderSliderTemplate = (id, imgURL, title, release) => {
  return `<div class="slider-item">
    <figure class="slider-image">
      <a href="#" data-modal-open="modal" data-id="${id}">
        <img src="${imgURL}" alt="More info">
      </a>
      <figcaption class="slider-text">${title}<br>Release date: ${release}</figcaption>
    </figure>
  </div>`;
}

  function renderMediaContent(arr){
    let mediaHTML = '';
    let cards = $('.cards .columns');
    cards.html('');
    //render every single card content
    $(arr).each(function (index, item) {
      let id = item.id;
      // let file_path = item.poster_path;
      let file_path = item.backdrop_path;
      let imgURL = BASE_IMG_URL + IMG_SIZE_M + file_path;
      let title = item.title;
      let raiting = item.vote_average*10;
      let content = item.overview;
      let release = item.release_date;
      // console.log(item);
      mediaHTML += renderCardTemplate(id, imgURL, title, raiting, content, release);
    });
    cards.append(mediaHTML);
  }

  let renderCardTemplate = (id, imgURL, title, raiting, content, release) => {
    return `<div class="column is-mobile is-half-tablet is-one-third-desktop">
      <div class="card">
        <div class="card-image">
          <figure class="image is-16by9">
            <a href="#" data-modal-open="modal" data-id="${id}">
              <img src="${imgURL}" alt="More info">
            </a>
          </figure>
        </div>
        <div class="card-content">
          <p class="title is-6">${title}</p>
          <p class="subtitle is-6">Raiting: ${raiting}%</p>
          <div class="content">
            <p>${content}</p>
            Release: <time datetime="${release}"><em>${release}</em></time>
          </div>
        </div>
      </div>
    </div>`;
  }

//navbar menu links
$('.navbar-item').click(function(event) {
  // event.preventDefault();
  let dataRequest = $(this).data('request');
  if (dataRequest === 'comingSoon') {
    //show upcoming videos
    searchUpcomingMovies();
    initModals();
  } else
  if (dataRequest === 'popular') {
    //show popular videos
    searchPopularMovies();
    initModals();
  } else
  if (dataRequest === 'topRated') {
    //show top rated videos
    searchTopRatedMovies();
    initModals();
  } else
  if (dataRequest === 'watchNow') {
    //show actual movies in theatres
    // showActualMovies();
    // initModals();
  }
});


//=====================================================================
