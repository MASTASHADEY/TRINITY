const playButton = document.getElementById('playButton');

let playing = false;

playButton.addEventListener('click', () => {

  playing = !playing;

  if (playing) {
    playButton.textContent = 'Ⅱ';
  } else {
    playButton.textContent = '▶';
  }

});