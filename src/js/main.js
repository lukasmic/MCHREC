import { processHeroDecks } from "./process_heroes.js";
import { createHeroSelector } from "./hero_selector.js";
import { checkAllPacks, disableRadios, getJSON, getSelectedRadioButtonValue, getSelectedPackIds, hamburger, loadHeaderFooter, showPacks, uncheckAllPacks } from "./utils.js";

const heroNamesData = await getJSON("/json/hero_names.json");

loadHeaderFooter().then(header => {
  hamburger(header);
});

await createHeroSelector(heroNamesData);

//Add event listeners for the hero and aspect selectors
const heroRadio = document.getElementsByName("hero");
const radio1 = document.getElementsByName("aspect");
const submitButton = document.getElementById("submitBtn");
const radio2Div = document.getElementById("aspect2");
const radio2 = document.getElementsByName("aspect2");
const packs = document.getElementsByName("pack-selector");
const showPacksBtn = document.getElementById("showPacksBtn");
const checkAllButton = document.getElementById("check-all");
const uncheckAllButton = document.getElementById("uncheck-all");

// Add event listeners to selector and radio buttons
// heroSelector.addEventListener("change", handleSelectionChange);
for (let i = 0; i < heroRadio.length; i++) {
  heroRadio[i].addEventListener("change", handleSelectionChange);
}

for (let i = 0; i < radio1.length; i++) {
  radio1[i].addEventListener("change", handleSelectionChange);
}
for (let i = 0; i < radio2.length; i++) {
  radio2[i].addEventListener("change", handleSelectionChange);
}
submitButton.addEventListener("click", handleSubmit);
showPacksBtn.addEventListener("click", showPacks);
checkAllButton.addEventListener("click", checkAllPacks);
uncheckAllButton.addEventListener("click", uncheckAllPacks);

incrementVisitCount();


// Function to handle selection changes
function handleSelectionChange() {
  
  if (getSelectedRadioButtonValue(heroRadio) == "21031a") { // Adam Warlock
    //disable aspect buttons and enable Get Results
    disableRadios(radio1, true);
    disableRadios(radio2, true);
    radio2Div.style.display = "none";
    submitButton.disabled = false;
  } else if (getSelectedRadioButtonValue(heroRadio) == "04031a") { //Spider-Woman
    //make sure Adam isn't screwing up radios
    disableRadios(radio1, false);
    disableRadios(radio2, false);
    radio2Div.style.display = "block";

    //if both aspects as selected and are not the same, activate
    if (getSelectedRadioButtonValue(radio1) && getSelectedRadioButtonValue(radio2) && (getSelectedRadioButtonValue(radio1) !== getSelectedRadioButtonValue(radio2))) {
      submitButton.disabled = false;
    } else {
      submitButton.disabled = true;
    }

  } else if (getSelectedRadioButtonValue(heroRadio) && getSelectedRadioButtonValue(radio1) && (getSelectedRadioButtonValue(heroRadio) !== "none")) {
    //ordinary hero, proceed
    disableRadios(radio1, false);
    disableRadios(radio2, false);
    radio2Div.style.display = "none";
    // Enable submit button
    submitButton.disabled = false;
  } else {
    //Fields are blank, don't proceed
    disableRadios(radio1, false);
    disableRadios(radio2, false);
    radio2Div.style.display = "none";
    // Disable submit button
    submitButton.disabled = true;
  }
}


async function handleSubmit(event) {
  event.preventDefault(); // Prevent page refresh
  const herocode = getSelectedRadioButtonValue(heroRadio);
  // console.log(herocode);
  const heroAspect = getSelectedRadioButtonValue(radio1);
  const percentageType = getSelectedRadioButtonValue(document.getElementsByName("percentage-selector"));
  const historyOption = getSelectedRadioButtonValue(document.getElementsByName("history-selector"));
  const packList = getSelectedPackIds(packs);

  if (herocode == "21031a") { //Adam Warlock 
    // await processAdamWarlockDecks(percentageType);
    await processHeroDecks("21031a", 0, heroNamesData, percentageType, historyOption, packList);
  } else if (herocode == "04031a") { //Spider-Woman
    const heroAspect2 = getSelectedRadioButtonValue(radio2); 
    //the SQL needs aspect 1 & 2 to be 12 so we're going to concat
    const swAspect = parseInt('' + Math.min(heroAspect, heroAspect2) + Math.max(heroAspect, heroAspect2));
    await processHeroDecks("04031a", swAspect, heroNamesData, percentageType, historyOption, packList);
  } else {
    await processHeroDecks(herocode, heroAspect, heroNamesData, percentageType, historyOption, packList);
  }
}


async function incrementVisitCount() {
  try {
    const response = await fetch('/increment-visit-count', { method: 'POST' });
    if (!response.ok) {
      throw new Error('Visit count increment failed');
    }
    // console.log('Visit count incremented successfully');
  } catch (error) {
    console.error('Error incrementing visit count:', error);
  }
}