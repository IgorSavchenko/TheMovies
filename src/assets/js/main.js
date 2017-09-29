// init siema slider
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
const mySiema = new Siema({
  selector: '.slider',
  perPage: 1,
  startIndex: 0,
  loop: true,
  onInit: addNavigation,
  onChange: setActiveButton
});
// listen for keydown event
setInterval(() => mySiema.next(), 4000);
// Add a function that generates pagination to Siema
function addNavigation() {
  let length = this.innerElements.length;
  for (let i = 0; i < length; i++) {
    const btn = document.createElement('button');
    console.log(btn);
    btn.classList.add('slider-button');
    if (i == 0) btn.classList.add('slider-button--active');
    btn.addEventListener('click', () => this.goTo(i));
    this.selector.nextSibling.appendChild(btn);
    console.log(this.selector.nextSibling);
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
