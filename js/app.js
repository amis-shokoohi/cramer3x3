const calc = document.getElementById('calc').addEventListener('click', calculate);
const clearBtn = document.getElementById('clear').addEventListener('click', clear);
const list = document.querySelectorAll('input');
const answer = document.getElementById('answer');

function calculate(e) {
  let inputs = [...list].map(item => item.value);
  const reg = /^[-+]?([0-9]+)(\.[0-9]+)?$/;
  let err = '';

  for(let i = 0; i < inputs.length; ++i) {
    if(inputs[i] === '') {
      err = 'Please fill in all fields.';
      break;
    } else if(reg.test(inputs[i]) !== true) {
      err = 'Invalid input';
      break;
    } else {
      err = '';
    }
  }

  let html = '';

  if(err !== '') {
    html = `
      <div class="red">
        <p>${err}</p>
      </div>
    `;

    answer.innerHTML = html;
  } else {
    let vals = inputs.map(val => parseFloat(val));

    let head = (
      (vals[0] * ((vals[4] * vals[8]) - (vals[5] * vals[7])))
      - (vals[1] * ((vals[3] * vals[8]) - (vals[5] * vals[6])))
      + (vals[2] * ((vals[3] * vals[7]) - (vals[4] * vals[6])))
    ).toFixed(4);
    head = parseFloat(head);
    if(head === Math.sign(-0)) {
      head = 0;
    }
  
    let tale = (
      (vals[9] * ((vals[13] * vals[17]) - (vals[14] * vals[16])))
      - (vals[10] * ((vals[12] * vals[17]) - (vals[14] * vals[15])))
      + (vals[11] * ((vals[12] * vals[16]) - (vals[13] * vals[15])))
    ).toFixed(4);
    tale = parseFloat(tale);
    if(tale === Math.sign(-0)) {
      tale = 0;
    }
  
    let total = (tale !== 0) ? head / tale : 'tale is zero';
    
    if(total !== 'tale is zero') {
      total = parseFloat(total.toFixed(4));
      html = `
        <div class="purple">
          <p>= ${head} / ${tale}</p>
          <p>= ${total}</p>
        </div>
      `;
    } else {
      html = `
        <div class="red">
          <p>= ${head} / ${tale}</p>
          <p>The fraction does not have answer, because denominator is zero.</p>
        </div>
      `;
    }
    
    answer.innerHTML = html;
  }

  e.preventDefault();
}

function clear(e) {
  location.reload();

  e.preventDefault();
}

// Register the service worker
if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('Service worker registered', reg))
    .catch(err => console.log('Service worker not registered', err));
}