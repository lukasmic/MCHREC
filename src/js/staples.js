import { createHistoryRadio, createRadios } from "./hero_selector.js";
import { capitalize, getAspectName, getSelectedRadioButtonValue, hamburger, loadHeaderFooter } from "./utils.js";

loadHeaderFooter().then(header => {
  hamburger(header);
});

const radio = document.getElementById("aspect-select");
const radioMaker = createRadios("staple-radio", true);
radio.appendChild(radioMaker);
const radios = document.getElementsByName("staple-radio");

//deck-history
const historyDiv = document.getElementById("history-select");
historyDiv.innerHTML = "<span>Deck History: </span>";
// historyDiv.setAttribute("id", "history-selector");
const historyOptions = [30, 90, 180, 360, 900];
for (let i in historyOptions) {
  historyDiv.appendChild(createHistoryRadio(historyOptions[i]));
}
const historyRadios = document.getElementsByName("history-selector");


//make sure that clicking to change either the aspect or history will reload the system
for (let i = 0; i < radios.length; i++) {
  radios[i].addEventListener("change", receiveClick);
  historyRadios[i].addEventListener("change", receiveClick);
}


async function receiveClick() {

  displayStaples(getSelectedRadioButtonValue(radios), getSelectedRadioButtonValue(historyRadios));
}


async function displayStaples(aspect, history) {

  // console.log(aspect, history);
  if(isNaN(aspect) || isNaN(history)){
    console.log("nope");
    return;
  }

  try {
    const cardResultsDiv = document.getElementById("staple-results");
    cardResultsDiv.innerHTML = '<h1 class="center">Loading results, please wait...</h1>';
    
    const response = await fetch(`/api/staples?aspect=${aspect}&history=${history}`);
    const results = await response.json();
    const cardInfo = results.map(row => {
      return {
        code: row.master_code,
        cardName: row.name,
        cardPhoto: row.photo_url,
        popularity: row.popularity,
        cardUrl: row.card_url,
        deckCount: row.deck_count
      }; 
    });
      const heroHeaderDiv = document.getElementById("staple-header");
      const aspectName = (aspect == 0) ? "" : await getAspectName(aspect);
      const Aspect = capitalize(aspectName);
      //clear it in case it's a resubmit
      heroHeaderDiv.innerHTML = `<h2>${Aspect} Staples</h2>`;
  
      
      cardResultsDiv.innerHTML = "";
      buildCardDiv(cardInfo, cardResultsDiv, aspect);
  } catch (error) {
    console.error('Error processing staple call:', error);
    cardResultsDiv.innerHTML = '<h1 class="center">Error loading results. Please try again, refresh the page, or contact the creator on Reddit at the bottom of the page.</h1>'; // Show error message to the user
  }


}


//unfortunately also can't import this because we have no "synergy percentage" now
export function buildCardDiv(cardInfo, cardResultsDiv) {
  const ul = document.createElement("ul");
  ul.setAttribute("class", "center");
  
  cardInfo.forEach(({ code, cardName, cardPhoto, popularity, cardUrl, deckCount }) => {
    if (code == 0) {
      return;
    }
    const li = document.createElement("li");
    li.setAttribute("class", "center");
    li.innerHTML = `<p id="${code}"><a href="${cardUrl}"><strong>${cardName}</strong></a></p>`;
    //in case of bad photo, use placeholder
    if (cardPhoto == "" || cardPhoto === "") {
      li.innerHTML += `<img src="/images/not_found.png"><br>`;
    } else {
      li.innerHTML += `<img src="${cardPhoto}"><br>`;
    }
    li.innerHTML += `${popularity}% of ${deckCount} decks<br>`;
    ul.appendChild(li);
  });
  cardResultsDiv.appendChild(ul);
}