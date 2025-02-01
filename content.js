let modalTimeout = null;
let currentLink = null;

const setOnOff = (isOn) => {
  chrome.storage.local.set({isOn : isOn},()=>{
    console.log('Value set to:',isOn);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  
  const toggleButton = document.querySelector('#toggle');

  chrome.storage.local.get(['isOn'],(result)=>{
    
    if(result.isOn === 'On') toggleButton.checked = true;
    else toggleButton.checked = false;

  });

  toggleButton.addEventListener('change',()=>{

    const check = toggleButton.checked ? 'On' : 'Off';

    setOnOff(check);
    document.querySelector('#isActive').textContent = check === 'On' ? 'active' : 'inactive';
    console.log('Is On:',check);
  });

});

document.addEventListener('mouseover', (event) => {
  const checkIfAnchorTag = event.target.tagName === 'A';

  chrome.storage.local.get(['isOn'],(result)=>{

    const isOn = result.isOn === 'On';

    console.log('Is On:',isOn);

    if (checkIfAnchorTag && !modalTimeout && checkIfGmail() && isOn) {
      
      modalTimeout = setTimeout(() => {
        showPickPopup(event);
      }, 2000);
      return;
    }
  });

  const checkPopup = document.querySelector('#popup-phishguard');

  if(checkPopup && checkPopup.contains(event.target))
    clearTimeout(modalTimeout);

});

document.addEventListener('mouseout',()=>{
  const checkPopup = document.querySelector('#popup-phishguard');

  if(checkPopup){
    clearTimeout(modalTimeout);
    modalTimeout = setTimeout(()=>{
      removePickPopup(checkPopup);
    },2000);
    return;
  }
  clearTimeout(modalTimeout);
  modalTimeout = null;
});


const checkIfGmail = () => {
  const url = window.location.href;
  return url.includes('mail.google.com');
}

const removePickPopup = (checkPopup) => {
  
  if(checkPopup)
    checkPopup.remove();

  
  if (modalTimeout) {
    clearTimeout(modalTimeout);
    modalTimeout = null;
    currentLink = null;
  }
}

const injectStylesheet = () => {
  if (!document.querySelector('link[href*="./css/styles.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = chrome.runtime.getURL('./css/styles.css');
      document.head.appendChild(link);
  }
};

const responsivePopup = (popup,rect) =>{

  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;

  console.log('Window Height:',windowHeight);
  console.log('Window Width:',windowWidth);

  const popupWidth = 250; // Approximate width of the popup
  const popupHeight = 150; // Approximate height of the popup

  // Get the initial positions for the popup
  let topPosition = window.scrollY + rect.top;
  let leftPosition = window.scrollX + rect.right + 5; // Small margin to the right of the link

  // Determine if the popup should appear above or below based on available space
  let spaceBelow = windowHeight - (topPosition + rect.height); // Space below the link
  let spaceAbove = topPosition - window.scrollY; // Space above the link

  // Determine if the popup should appear to the left or right based on available space
  let spaceLeft = leftPosition - window.scrollX; // Space to the left of the link
  let spaceRight = windowWidth - (leftPosition + popupWidth); // Space to the right of the link

  // Adjust vertical position
  if (spaceBelow >= popupHeight) {
    // There's enough space below, so place the popup below
    topPosition += rect.height + 5; // Position the popup below the link
  } else if (spaceAbove >= popupHeight) {
    // Otherwise, place the popup above
    topPosition -= popupHeight + 5; // Position the popup above the link
  } else {
    // If neither direction has enough space, move it to the center
    topPosition = (windowHeight - popupHeight) / 2 + window.scrollY; // Center it vertically
  }

  // Adjust horizontal position
  if (spaceRight >= popupWidth) {
    // There's enough space on the right, so place the popup to the right
    leftPosition += 5; // Position the popup to the right of the link
  } else if (spaceLeft >= popupWidth) {
    // Otherwise, place the popup to the left
    leftPosition -= popupWidth + 5; // Position the popup to the left of the link
  } else {
    // If neither direction has enough space, move it to the center
    leftPosition = (windowWidth - popupWidth) / 2 + window.scrollX; // Center it horizontally
  }

  // Ensure the popup stays within the viewport boundaries
  if (topPosition + popupHeight > windowHeight + window.scrollY) {
    topPosition = windowHeight + window.scrollY - popupHeight - 5; // Keep it within the bottom of the screen
  }
  if (topPosition < window.scrollY) {
    topPosition = window.scrollY + 5; // Keep it within the top of the screen
  }
  if (leftPosition + popupWidth > windowWidth + window.scrollX) {
    leftPosition = windowWidth + window.scrollX - popupWidth - 5; // Keep it within the right of the screen
  }
  if (leftPosition < window.scrollX) {
    leftPosition = window.scrollX + 5; // Keep it within the left of the screen
  }

  popup.style.top = `${topPosition}px`;
  popup.style.left = `${leftPosition}px`;

}

const showPickPopup = async (event) => {

  const checkPopup = document.querySelector('#popup-phishguard');
  if (checkPopup && currentLink === event.target)
    return;

  if(currentLink !== event.target)
    removePickPopup(checkPopup);

  currentLink = event.target;

  injectStylesheet();

  const popup = document.createElement('div');
  popup.id = 'popup-phishguard';
  popup.classList.add('modal');

  const div = document.createElement('div');
  div.classList.add('modal-content');

  const h2 = document.createElement('h2');
  h2.textContent = 'Check URL Safety';

  const p = document.createElement('p');
  p.textContent = 'Would you like us to ensure this link is safe?';

  const rect = currentLink.getBoundingClientRect();
  responsivePopup(popup,rect);

  const yesButton = document.createElement('button');
  yesButton.addEventListener('click',() => checkUrl(currentLink));
  yesButton.classList.add('yes-btn');
  yesButton.textContent = 'Yes';

  const noButton = document.createElement('button');
  noButton.classList.add('no-btn');
  noButton.addEventListener('click', () => removePickPopup(popup));
  noButton.textContent = 'No';

  // buttonDiv.appendChild(yesButton);
  // buttonDiv.appendChild(noButton);

  div.appendChild(h2);
  div.appendChild(p);
  div.appendChild(yesButton);
  div.appendChild(noButton);

  popup.appendChild(div);
  // popup.appendChild(buttonDiv);
  document.body.appendChild(popup);

}

const urlLocal = 'http://localhost:8080';
const urlProd = 'https://phish-alert.onrender.com';
const checkUrl = async (event) =>{

  try{

    const requestUrl = event.href.toString();
    console.log('Request URL:',requestUrl);
    const response = await fetch(`${urlProd}/api/check-url`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Client-Type': 'FRONTEND'
        },
        body: JSON.stringify({url: requestUrl})
    });

    if(!response.ok){
        throw await response.json();
    }

    const data = await response.json();

    const checkPopup = document.querySelector('#popup-phishguard');

    if(checkPopup)
      checkPopup.remove();

    console.log(data);

    if(data.response === 'Suspicious' || data.response === 'Safe')
      await showResponse(data.response,event);

  }catch(error){
    console.error(error.error);
    await showResponse(error.error,event);
  }

}

const showResponse = async (data,event) =>{

  const checkModalResponse = document.querySelector('#show-response');
  if(checkModalResponse){
    checkModalResponse.remove();
  }

  const main = document.createElement('div');
  main.id = 'show-response';
  main.classList.add('response-modal');

  const div1 = document.createElement('div');
  div1.classList.add('response-modal-content');

  const h2 = document.createElement('h2');
  h2.textContent = 'URL Safety Check Result';

  const p = document.createElement('p');
  p.textContent = 'The URL you selected has been checked.';

  const div2 = document.createElement('div');
  div2.classList.add('result');

  const span = document.createElement('span');
  span.textContent = `${data}`;
  span.classList.remove('safe','suspicious');

  span.classList.add(`${data === 'Safe' ? 'safe' : data === 'Suspicious' ? 'suspicious' : 'error'}`);

  div2.appendChild(span);

  const button = document.createElement('button');
  button.textContent = 'Close';
  button.addEventListener('click',removeResponse);
  button.classList.add('close-btn');

  const rect = event.getBoundingClientRect();
  responsivePopup(main,rect);

  div1.appendChild(h2);
  div1.appendChild(p);
  div1.appendChild(div2);
  div1.appendChild(button);
  main.appendChild(div1);
  document.body.appendChild(main);

}

const removeResponse = () =>{

  const modal = document.querySelector('#show-response');

  if(modal)
    modal.remove();

}