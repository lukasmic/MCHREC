import { capitalize, getAspectName, getSelectedRadioButtonValue, hamburger, loadHeaderFooter } from "./utils.js";

loadHeaderFooter().then(header => {
  hamburger(header);
});