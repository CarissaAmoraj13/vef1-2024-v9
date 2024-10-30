import { el } from './lib/elements.js';
import { weatherSearch } from './lib/weather.js';

/**
 * @typedef {Object} SearchLocation
 * @property {string} title
 * @property {number} lat
 * @property {number} lng
 */

/**
 * Allar staðsetning sem hægt er að fá veður fyrir.
 * @type Array<SearchLocation>
 */
const locations = [
  {
    title: 'Reykjavík',
    lat: 64.1355,
    lng: -21.8954,
  },
  {
    title: 'Akureyri',
    lat: 65.6835,
    lng: -18.0878,
  },
  {
    title: 'New York',
    lat: 40.7128,
    lng: -74.006,
  },
  {
    title: 'Tokyo',
    lat: 35.6764,
    lng: 139.65,
  },
  {
    title: 'Sydney',
    lat: 33.8688,
    lng: 151.2093,
  },
];

/**
 * Hreinsar fyrri niðurstöður, passar að niðurstöður séu birtar og birtir element.
 * @param {Element} element
 */
function renderIntoResultsContent(results) {
  const resultsContainer = document.getElementById('results');
  const empty = '<p>No results found.</p>'; 

  if (!results || results.length === 0) {
      resultsContainer.innerHTML = empty; 
      return;
  }

 
}


/**
 * Birtir niðurstöður í viðmóti.
 * @param {SearchLocation} location
 * @param {Array<import('./lib/weather.js').Forecast>} results
 */
function renderResults(location, results) {
  const resultsElement = document.querySelector('.results'); 
  renderIntoResultsContent(resultsElement); 

  const titleElement = el('h2', {}, `Veður fyrir ${location.title}`);
  resultsElement.appendChild(titleElement);

  for (const forecast of results) {
    const forecastElement = el(
      'div',
      { class: 'forecast' },
      `Tími: ${forecast.time}, Hitastig: ${forecast.temperature}°C, Rigning: ${forecast.precipitation}mm`
    );
    resultsElement.appendChild(forecastElement);
  }
}

/**
 * Birta villu í viðmóti.
 * @param {Error} error
 */
function renderError(error) {
  const resultsElement = document.querySelector('.results');
  renderIntoResultsContent(resultsElement); // Clear previous results
  const errorElement = el('div', { class: 'error' }, `Villa: ${error.message}`);
  resultsElement.appendChild(errorElement);
}

/**
 * Birta biðstöðu í viðmóti.
 */
function renderLoading() {
  const resultsElement = document.querySelector('.results');
  renderIntoResultsContent(resultsElement); 
  const loadingElement = el('div', { class: 'loading' }, 'Hleður...');
  resultsElement.appendChild(loadingElement);
}

/**
 * Framkvæmir leit að veðri fyrir gefna staðsetningu.
 * Birtir biðstöðu, villu eða niðurstöður í viðmóti.
 * @param {SearchLocation} location Staðsetning sem á að leita eftir.
 */
async function onSearch(location) {
  console.log('onSearch', location);
  renderLoading(); // Show loading state

  try {
    const results = await weatherSearch(location.lat, location.lng);
    console.log(results);
    renderResults(location, results); // Render results
  } catch (error) {
    renderError(error); // Render error if any
  }
}

/**
 * Framkvæmir leit að veðri fyrir núverandi staðsetningu.
 * Biður notanda um leyfi gegnum vafra.
 */
async function onSearchMyLocation() {
 
}

/**
 * Býr til takka fyrir staðsetningu.
 * @param {string} locationTitle
 * @param {() => void} onSearch
 * @returns {HTMLElement}
 */
function renderLocationButton(locationTitle, onSearch) {
  const locationElement = el(
    'li',
    { class: 'locations__location' },
    el(
      'button',
      { class: 'locations__button', click: onSearch },
      locationTitle,
    ),
  );

  return locationElement;
}

/**
 * Býr til grunnviðmót: haus og lýsingu, lista af staðsetningum og niðurstöður (falið í byrjun).
 * @param {Element} container HTML element sem inniheldur allt.
 * @param {Array<SearchLocation>} locations Staðsetningar sem hægt er að fá veður fyrir.
 * @param {(location: SearchLocation) => void} onSearch
 * @param {() => void} onSearchMyLocation
 */
function render(container, locations, onSearch, onSearchMyLocation) {
  const parentElement = document.createElement('main');
  parentElement.classList.add('weather');

  const headerElement = document.createElement('header');
  const heading = document.createElement('h1');
  heading.appendChild(document.createTextNode('Veðurspá'));
  headerElement.appendChild(heading);
  parentElement.appendChild(headerElement);

  const locationsElement = document.createElement('div');
  locationsElement.classList.add('locations');

  const locationsListElement = document.createElement('ul');
  locationsListElement.classList.add('locations__list');

  locationsElement.appendChild(locationsListElement);

  for (const location of locations) {
    const liButtonElement = renderLocationButton(location.title, () => {
      console.log('Halló!!', location);
      onSearch(location);
    });
    locationsListElement.appendChild(liButtonElement);
  }

  parentElement.appendChild(locationsElement);

  const resultsElement = el('div', { class: 'results' });
  parentElement.appendChild(resultsElement);

  container.appendChild(parentElement);
}


render(document.body, locations, onSearch, onSearchMyLocation);
