import { findHeroByCode, getAspectName } from "./utils.js";

export async function processHeroDecks(herocode, heroAspect, heroNamesData, percentageType, historyOption, packList) {
  // console.log(herocode, heroAspect, percentageType, historyOption, packList);
  
  // console.log(results);

  //Let's shoot the template literals into two different functions
  //Header and cards
  const heroHeaderDiv = document.getElementById("hero-header");
  // clear it in case it's a resubmit
  heroHeaderDiv.innerHTML = "";
  const heroName = findHeroByCode(heroNamesData, herocode);

  const cardResultsDiv = document.getElementById("card-results");
  cardResultsDiv.innerHTML = '<h1 class="center">Loading results, please wait...</h1>';



  try {
    const selectedPacksString = packList.join(",");
    const response = await fetch(`/api/calculate-synergy?herocode=${herocode}&heroAspect=${heroAspect}&percentageType=${percentageType}&history=${historyOption}&packs=${selectedPacksString}`);
    const results = await response.json();
  
    const cardInfo = results.map(row => {
      return {
        code: row.master_code,
        cardName: row.name,
        cardPhoto: row.photo_url,
        popularity: row.popularity,
        synergy: row.synergy,
        cardUrl: row.card_url,
        totalChosenDecks: row.chosen_count
      }; 
    });
    // console.log(cardInfo);
    const aspectName = (heroAspect == 0) ? "" : await getAspectName(heroAspect);
    buildHeroHeader(heroName, aspectName, cardInfo[0].totalChosenDecks, heroHeaderDiv);
    buildCardDiv(cardInfo, cardInfo[0].totalChosenDecks, cardResultsDiv);
  } catch (error) {
    console.error('Error processing hero decks:', error);
    cardResultsDiv.innerHTML = '<h1 class="center">Error loading results. Please try hitting the button again, refresh the page, or contact the creator on Reddit at the bottom of the page.</h1>'; // Show error message to the user
  }
}


function buildHeroHeader(heroName, aspectName, totalChosenDecks, heroHeaderDiv) {
  const heroHeader = document.createElement("h3");
  heroHeader.textContent = `Selected Hero: ${heroName} (${totalChosenDecks} ${aspectName} decks)`;
  heroHeaderDiv.appendChild(heroHeader);
}


export function buildCardDiv(cardInfo, totalChosenDecks, cardResultsDiv) {
  const ul = document.createElement("ul");
  ul.setAttribute("class", "center");
  
  cardInfo.forEach(({ code, cardName, cardPhoto, popularity, synergy, cardUrl }) => {
    if (code == 0) {
      return; 
    }
    const li = document.createElement("li"); 
    li.setAttribute("class", "center");
    li.innerHTML = `<p id="${code}"><a href="${cardUrl}"><strong>${cardName}</strong></a></p>`;
    // console.log(cardPhoto);
    //in case of bad photo, use placeholder
    if (cardPhoto == "" || cardPhoto === "") {
      li.innerHTML += `<img src="/images/not_found.png" alt="Image of ${cardName}"><br>`;
    } else {
      li.innerHTML += `<img src="${cardPhoto}" alt="Image of ${cardName}"><br>`;
    }
    li.innerHTML += `${popularity}% of ${totalChosenDecks} decks<br>`;
    //positive vs negative synergy
    if (synergy > 0) {
    li.innerHTML += `+${synergy}% synergy`;
    } else {
    li.innerHTML += `${synergy}% synergy`;
    }
    ul.appendChild(li);
  });
  cardResultsDiv.innerHTML = ""; //clear the loading message before proceeding
  cardResultsDiv.appendChild(ul);
}