/**
 * @file content.js
 * @description Content script for the Phish Shield browser extension that monitors link interactions in Gmail.
 * 
 * @global
 * @var {number|null} modalTimeout - Timer ID for controlling popup display/removal delays
 * @var {Element|null} currentLink - Reference to the currently hovered link element
 * 
 * @listens document#mouseover - Monitors mouse hover events on anchor tags
 * @listens document#mouseout - Handles mouse leaving elements and cleanup
 * 
 * @function checkIfGmail
 * @returns {boolean} True if current URL is Gmail, false otherwise
 * 
 * @function removePickPopup
 * @param {Element} checkPopup - The popup element to be removed
 * @description Removes the security check popup and cleans up associated timers and references
 * 
 * @function showPickPopup
 * @param {Event} event - Mouse event that triggered the popup
 * @description Creates and displays a security verification popup next to a hovered link
 * @requires chrome.runtime
 * @requires custom.css
 * 
 * @note Popup appears after 2 seconds of hovering over a link
 * @note Popup disappears after 2 seconds of mouse leaving the popup area
 */

let modalTimeout = null;
let currentLink = null;

document.addEventListener('mouseover', (event) => {
  const checkIfAnchorTag = event.target.tagName === 'A';

  if (checkIfAnchorTag && !modalTimeout && checkIfGmail()) {
    
    modalTimeout = setTimeout(() => {
      showPickPopup(event);
    }, 2000);
    return;
  }
  
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
  if (!document.querySelector('link[href*="custom.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = chrome.runtime.getURL('custom.css');
      document.head.appendChild(link);
  }
};


const showPickPopup = (event) => {
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
  popup.style.top = `${window.scrollY + rect.top}px`;
  popup.style.left = `${window.scrollX + rect.right + 5}px`;

  // const buttonDiv = document.createElement('div');
  // buttonDiv.classList.add('button-div');

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



const checkUrl = async (sendUrl) =>{

  const socket = new WebSocket('ws://localhost:8080/url-check');

  socket.onopen = () =>{
    socket.send(sendUrl);
  }

  socket.onmessage = (event) => {

    const checkPopup = document.querySelector('#popup-phishguard');

    if(checkPopup)
      checkPopup.remove();

    const message = event.data;
    console.log("Received from backend: ", message);
    showResponse(message,sendUrl);
    

    socket.close();
  };

  socket.onerror = (error) => {
    console.error('WebSocket Error: ', error);
    socket.close();
  };

  socket.onclose = (event) => {
    if (event.wasClean) {
        console.log('Closed cleanly, code=' + event.code + ', reason=' + event.reason);
    } else {
        console.error('WebSocket closed unexpectedly');
    }
  };

  
    // try{

    //     const response = await fetch(`${urlLocal}/check-url`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //           url : sendUrl.href
    //         })
    //     });

    //     if(!response.ok){
    //         throw new Error('Failed to pass URL');
    //     }

    //     const data = await response.json();
    //     console.log(data);

    //     await showResponse(data,sendUrl);
        
    //     const checkPopup = document.querySelector('#popup-phishguard');

    //     if(checkPopup)
    //       checkPopup.remove();

    // }catch(e){
    //     console.error(e);
    // }

}

const showResponse = (data,event) =>{

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

  span.classList.add(`${data === 'Safe' ? 'safe' : 'suspicious'}`);

  div2.appendChild(span);

  const button = document.createElement('button');
  button.textContent = 'Close';
  button.addEventListener('click',removeResponse);
  button.classList.add('close-btn');

  const rect = event.getBoundingClientRect();
  main.style.top = `${window.scrollY + rect.top}px`;
  main.style.left = `${window.scrollX + rect.right + 5}px`;

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