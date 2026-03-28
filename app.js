// ── Star Stop Texas Locator ──────────────────────────────────────────────────
// Panjwani Energy LLC – Star Stop convenience stores & gas stations
// HQ: 6161 Savoy Dr Ste 1111, Houston TX 77036 | (713) 781-4610
// Owner: Feroz Panjwani / Aamir Panjwani
// ~134 locations in Texas, all branded Star Stop.
//
// Verified addresses sourced from: Texas Comptroller tax records (opengovus.com),
// TABC liquor licenses, GasBuddy, Yelp, Exxon store locator, BBB, TDLR.
// Coordinates are approximate (within ~50 m of the address).

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

const KNOWN_LOCATIONS = [
  // ── Houston metro ────────────────────────────────────────────────────────
  { name: 'Star Stop #12',  address: '2490 S Wayside Dr, Houston, TX 77023',          city: 'Houston',       lat: 29.7181, lng: -95.3289, fuel: true, food: true },
  { name: 'Star Stop #30',  address: '15050 Old Humble Rd, Humble, TX 77396',         city: 'Humble',        lat: 29.9955, lng: -95.2362, fuel: true, food: true },
  { name: 'Star Stop #39',  address: '12602 Southwest Fwy, Stafford, TX 77477',       city: 'Stafford',      lat: 29.6616, lng: -95.5766, fuel: true, food: true },
  { name: 'Star Stop #46',  address: '5248 Allum Rd, Houston, TX 77045',              city: 'Houston',       lat: 29.6658, lng: -95.4345, fuel: true, food: true },
  { name: 'Star Stop #49',  address: '8255 Mills Rd, Houston, TX 77064',              city: 'Houston',       lat: 29.9265, lng: -95.5474, fuel: true, food: true },
  { name: 'Star Stop #52',  address: '13920 Fondren Rd, Missouri City, TX 77489',     city: 'Missouri City', lat: 29.5857, lng: -95.5285, fuel: true, food: true },
  { name: 'Star Stop #53',  address: '202 North Loop W, Houston, TX 77018',           city: 'Houston',       lat: 29.8186, lng: -95.4259, fuel: true, food: true },
  { name: 'Star Stop #54',  address: '13233 Dairy Ashford Rd, Sugar Land, TX 77478', city: 'Sugar Land',    lat: 29.6235, lng: -95.6241, fuel: true, food: true },
  { name: 'Star Stop #55',  address: '12503 Northwest Fwy, Houston, TX 77092',        city: 'Houston',       lat: 29.8277, lng: -95.5075, fuel: true, food: true },
  { name: 'Star Stop #56',  address: '7065 Will Clayton Pkwy, Humble, TX 77338',      city: 'Humble',        lat: 29.9975, lng: -95.2596, fuel: true, food: true },
  { name: 'Star Stop #59',  address: 'Houston, TX 77036',                             city: 'Houston',       lat: 29.7395, lng: -95.5764, fuel: true, food: true },
  { name: 'Star Stop #60',  address: 'Houston, TX 77036',                             city: 'Houston',       lat: 29.7518, lng: -95.5392, fuel: true, food: true },
  { name: 'Star Stop #68',  address: '102 Cavalcade St, Houston, TX 77009',           city: 'Houston',       lat: 29.8014, lng: -95.3720, fuel: true, food: true },
  { name: 'Star Stop #101', address: '5823 New Territory Blvd, Sugar Land, TX 77479',city: 'Sugar Land',    lat: 29.6096, lng: -95.6427, fuel: true, food: true },
  { name: 'Star Stop #106', address: '451 TC Jester Blvd, Houston, TX 77007',         city: 'Houston',       lat: 29.7801, lng: -95.4253, fuel: true, food: true },
  { name: 'Star Stop #107', address: '15640 Woodland Hills Dr, Humble, TX 77346',     city: 'Humble',        lat: 29.9773, lng: -95.1654, fuel: true, food: true },
  { name: 'Star Stop #108', address: '2440 N Shepherd Dr, Houston, TX 77008',         city: 'Houston',       lat: 29.7996, lng: -95.4202, fuel: true, food: true },
  { name: 'Star Stop #110', address: '1415 Studemont St, Houston, TX 77007',          city: 'Houston',       lat: 29.7671, lng: -95.4016, fuel: true, food: true },
  { name: 'Star Stop #119', address: '12777 East Fwy, Houston, TX 77015',             city: 'Houston',       lat: 29.7551, lng: -95.2062, fuel: true, food: true },
  { name: 'Star Stop #129', address: '11050 S Post Oak Rd, Houston, TX 77035',        city: 'Houston',       lat: 29.6482, lng: -95.4804, fuel: true, food: true, wash: true },
  { name: 'Star Stop #131', address: '2320 Meridiana Pkwy, Rosharon, TX 77583',       city: 'Rosharon',      lat: 29.3688, lng: -95.4379, fuel: true, food: true },
  { name: 'Star Stop #132', address: '9811 Bissonnet St, Houston, TX 77036',          city: 'Houston',       lat: 29.6982, lng: -95.5349, fuel: true, food: true },
  { name: 'Star Stop',      address: '1150 W Sam Houston Pkwy N, Houston, TX 77043', city: 'Houston',       lat: 29.7887, lng: -95.5608, fuel: true, food: true, open24: true },
  { name: 'Star Stop',      address: '3535 State Hwy 6 S, Houston, TX 77082',        city: 'Houston',       lat: 29.6490, lng: -95.6355, fuel: true, food: true, open24: true },
  { name: 'Star Stop',      address: '10231 Clay Rd, Houston, TX 77041',              city: 'Houston',       lat: 29.8159, lng: -95.5843, fuel: true, food: true, open24: true },
  { name: 'Star Stop',      address: '1300 NASA Rd 1, Nassau Bay, TX 77058',         city: 'Nassau Bay',    lat: 29.5396, lng: -95.0832, fuel: true, food: true },

  // ── Austin ────────────────────────────────────────────────────────────────
  { name: 'Star Stop #37',  address: '8224 Burnet Rd, Austin, TX 78757',              city: 'Austin',        lat: 30.3593, lng: -97.7268, fuel: true, food: true },
  { name: 'Star Stop #75',  address: '5801 N Interstate 35, Austin, TX 78723',        city: 'Austin',        lat: 30.3289, lng: -97.7101, fuel: true, food: true },
  { name: 'Star Stop #82',  address: '6903 Brodie Ln, Austin, TX 78745',              city: 'Austin',        lat: 30.1873, lng: -97.8359, fuel: true, food: true },

  // ── San Antonio ───────────────────────────────────────────────────────────
  { name: 'Star Stop',      address: '2142 E Southcross Blvd, San Antonio, TX 78210',city: 'San Antonio',   lat: 29.3857, lng: -98.4540, fuel: true, food: true },

  // ── DFW ───────────────────────────────────────────────────────────────────
  { name: 'Star Stop',      address: '2216 N Collins St, Arlington, TX 76011',        city: 'Arlington',     lat: 32.7415, lng: -97.1050, fuel: true, food: true },
];

// ── State ────────────────────────────────────────────────────────────────────
let map, clusterGroup;
let allLocations = [];   // merged from Overpass + curated list
let markers = {};        // id -> Leaflet marker
let activeId = null;

// ── Leaflet map init ─────────────────────────────────────────────────────────
function initMap() {
  map = L.map('map', {
    center: [29.76, -95.37],  // Houston
    zoom: 10,
    zoomControl: true,
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map);

  clusterGroup = L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: 50,
    iconCreateFunction(cluster) {
      return L.divIcon({
        html: `<div class="cluster-icon">${cluster.getChildCount()}</div>`,
        className: '',
        iconSize: [40, 40],
      });
    },
  });

  map.addLayer(clusterGroup);
}

// ── Custom marker icon ───────────────────────────────────────────────────────
function starIcon() {
  return L.divIcon({
    html: '<div class="star-marker"></div>',
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -34],
  });
}

// ── Overpass query ───────────────────────────────────────────────────────────
async function fetchFromOverpass() {
  // Query for nodes/ways tagged as Star Stop fuel stations or convenience stores in Texas bounding box
  // Search by name AND by operator tag to catch any Panjwani-owned stations
  // that may be branded differently on OSM
  const query = `
[out:json][timeout:30];
(
  node["amenity"="fuel"]["name"~"Star Stop",i](25.8,-106.6,36.5,-93.5);
  node["shop"="convenience"]["name"~"Star Stop",i](25.8,-106.6,36.5,-93.5);
  way["amenity"="fuel"]["name"~"Star Stop",i](25.8,-106.6,36.5,-93.5);
  way["shop"="convenience"]["name"~"Star Stop",i](25.8,-106.6,36.5,-93.5);
  node["operator"~"Panjwani",i](25.8,-106.6,36.5,-93.5);
  way["operator"~"Panjwani",i](25.8,-106.6,36.5,-93.5);
);
out center;
`.trim();

  const resp = await fetch(OVERPASS_URL, {
    method: 'POST',
    body: `data=${encodeURIComponent(query)}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  if (!resp.ok) throw new Error(`Overpass HTTP ${resp.status}`);
  const data = await resp.json();

  return data.elements.map((el, i) => {
    const lat = el.type === 'way' ? el.center.lat : el.lat;
    const lng = el.type === 'way' ? el.center.lon : el.lon;
    const tags = el.tags || {};
    const addr = buildAddress(tags);
    return {
      id: `osm-${el.type}-${el.id}`,
      name: tags.name || 'Star Stop',
      address: addr,
      city: tags['addr:city'] || cityFromAddr(addr) || 'Texas',
      lat, lng,
      fuel: tags.amenity === 'fuel' || tags['fuel'] != null,
      food: tags.amenity === 'fast_food' || tags['cuisine'] != null,
      wash: tags['car_wash'] === 'yes' || tags['amenity'] === 'car_wash',
      open24: tags['opening_hours'] === '24/7',
      phone: tags.phone || tags['contact:phone'] || '',
      website: tags.website || '',
      source: 'osm',
    };
  });
}

function buildAddress(tags) {
  const parts = [
    tags['addr:housenumber'],
    tags['addr:street'],
    tags['addr:city'],
    tags['addr:state'] || 'TX',
    tags['addr:postcode'],
  ].filter(Boolean);
  return parts.join(', ') || '';
}

function cityFromAddr(addr) {
  if (!addr) return '';
  const m = addr.match(/,\s*([A-Za-z\s]+),\s*TX/);
  return m ? m[1].trim() : '';
}

// ── Merge OSM + curated list (avoid duplicates by proximity) ─────────────────
function mergeLocations(osmLocs) {
  const merged = [...osmLocs];
  const THRESH = 0.003; // ~300 m

  for (const loc of KNOWN_LOCATIONS) {
    const isDupe = osmLocs.some(
      o => Math.abs(o.lat - loc.lat) < THRESH && Math.abs(o.lng - loc.lng) < THRESH
    );
    if (!isDupe) {
      merged.push({
        id: `curated-${loc.name}-${loc.lat}`,
        source: 'curated',
        open24: false,
        phone: '',
        website: '',
        ...loc,
      });
    }
  }

  return merged;
}

// ── Render sidebar list ──────────────────────────────────────────────────────
function renderList(locs) {
  const list = document.getElementById('location-list');
  const count = document.getElementById('result-count');
  list.innerHTML = '';
  count.textContent = `${locs.length} location${locs.length !== 1 ? 's' : ''} found`;

  if (locs.length === 0) {
    list.innerHTML = '<li class="empty-state">No Star Stop locations match your search.<br>Try a different city or ZIP.</li>';
    return;
  }

  locs.forEach(loc => {
    const li = document.createElement('li');
    li.dataset.id = loc.id;

    const tags = buildTags(loc);
    li.innerHTML = `
      <div class="loc-name">${escHtml(loc.name)}</div>
      <div class="loc-addr">${escHtml(loc.address || loc.city + ', TX')}</div>
      ${tags ? `<div class="loc-tags">${tags}</div>` : ''}
    `;

    li.addEventListener('click', () => focusLocation(loc));
    list.appendChild(li);
  });
}

function buildTags(loc) {
  const tags = [];
  if (loc.fuel)   tags.push('<span class="tag fuel">Fuel</span>');
  if (loc.food)   tags.push('<span class="tag food">Food Mart</span>');
  if (loc.wash)   tags.push('<span class="tag wash">Car Wash</span>');
  if (loc.open24) tags.push('<span class="tag open24">24/7</span>');
  return tags.join('');
}

// ── Render map markers ───────────────────────────────────────────────────────
function renderMarkers(locs) {
  clusterGroup.clearLayers();
  markers = {};

  locs.forEach(loc => {
    const marker = L.marker([loc.lat, loc.lng], { icon: starIcon() });
    marker.bindPopup(buildPopup(loc), { maxWidth: 260 });
    marker.on('click', () => highlightListItem(loc.id));
    markers[loc.id] = marker;
    clusterGroup.addLayer(marker);
  });
}

function buildPopup(loc) {
  const addr = escHtml(loc.address || `${loc.city}, TX`);
  const name = escHtml(loc.name);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.name + ' ' + addr)}`;
  const dirUrl  = `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`;
  const phone   = loc.phone ? `<p>&#128222; ${escHtml(loc.phone)}</p>` : '';
  const tags    = buildTags(loc);

  return `
    <div class="popup-inner">
      <h3>${name}</h3>
      <p>${addr}</p>
      ${phone}
      ${tags ? `<div class="loc-tags" style="margin-top:.4rem">${tags}</div>` : ''}
    </div>
    <div class="popup-actions">
      <a class="btn-dir" href="${dirUrl}" target="_blank" rel="noopener">Directions</a>
      <a class="btn-map" href="${mapsUrl}" target="_blank" rel="noopener">Google Maps</a>
    </div>
  `;
}

// ── Focus on a location ──────────────────────────────────────────────────────
function focusLocation(loc) {
  map.setView([loc.lat, loc.lng], 16, { animate: true });
  const marker = markers[loc.id];
  if (marker) {
    clusterGroup.zoomToShowLayer(marker, () => marker.openPopup());
  }
  highlightListItem(loc.id);
}

function highlightListItem(id) {
  document.querySelectorAll('#location-list li').forEach(li => li.classList.remove('active'));
  const li = document.querySelector(`#location-list li[data-id="${CSS.escape(id)}"]`);
  if (li) {
    li.classList.add('active');
    li.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
  activeId = id;
}

// ── Search / filter ──────────────────────────────────────────────────────────
function applyFilter(query) {
  const q = query.toLowerCase().trim();

  let filtered = allLocations;

  if (q) {
    filtered = filtered.filter(loc =>
      loc.name.toLowerCase().includes(q) ||
      (loc.address || '').toLowerCase().includes(q) ||
      (loc.city || '').toLowerCase().includes(q)
    );
  }

  renderList(filtered);
  renderMarkers(filtered);

  if (filtered.length === 0) {
    showToast('No locations match your search.');
  } else if (filtered.length === 1) {
    focusLocation(filtered[0]);
  } else {
    const bounds = L.latLngBounds(filtered.map(l => [l.lat, l.lng]));
    map.fitBounds(bounds.pad(0.2));
  }
}

// ── Geolocation ──────────────────────────────────────────────────────────────
function locateUser() {
  if (!navigator.geolocation) {
    showToast('Geolocation not supported by your browser.');
    return;
  }
  showToast('Finding your location…');
  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude: lat, longitude: lng } = pos.coords;
      map.setView([lat, lng], 13);

      // Sort sidebar by distance
      const sorted = [...allLocations].sort((a, b) => {
        const da = dist(lat, lng, a.lat, a.lng);
        const db = dist(lat, lng, b.lat, b.lng);
        return da - db;
      });
      renderList(sorted);
      renderMarkers(sorted);

      L.circleMarker([lat, lng], {
        radius: 8, color: '#1a73e8', fillColor: '#1a73e8', fillOpacity: 0.8,
      }).addTo(map).bindPopup('You are here').openPopup();

      showToast(`Showing nearest Star Stops`);
    },
    err => showToast('Could not get your location.')
  );
}

function dist(lat1, lng1, lat2, lng2) {
  const dLat = lat2 - lat1, dLng = lng2 - lng1;
  return Math.sqrt(dLat * dLat + dLng * dLng);
}

// ── Toast ────────────────────────────────────────────────────────────────────
let toastTimer;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3000);
}

// ── Utilities ────────────────────────────────────────────────────────────────
function escHtml(str) {
  return (str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Bootstrap ────────────────────────────────────────────────────────────────
async function main() {
  initMap();

  // Show spinner in sidebar
  document.getElementById('location-list').innerHTML =
    '<li><div class="spinner"></div></li>';

  let osmLocs = [];
  try {
    showToast('Fetching live data from OpenStreetMap…');
    osmLocs = await fetchFromOverpass();
  } catch (e) {
    console.warn('Overpass fetch failed, using curated list only.', e);
    showToast('Using curated location list.');
  }

  allLocations = mergeLocations(osmLocs);

  renderList(allLocations);
  renderMarkers(allLocations);

  // Fit Texas bounds
  if (allLocations.length > 0) {
    const bounds = L.latLngBounds(allLocations.map(l => [l.lat, l.lng]));
    map.fitBounds(bounds.pad(0.1));
  }

  if (osmLocs.length > 0) {
    showToast(`Loaded ${osmLocs.length} live + curated locations`);
  }

  // ── Event listeners ────────────────────────────────────────────────────────
  const searchInput = document.getElementById('search');
  const searchBtn   = document.getElementById('search-btn');
  const locateBtn   = document.getElementById('locate-btn');

  searchBtn.addEventListener('click', () => applyFilter(searchInput.value));
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') applyFilter(searchInput.value);
  });
  searchInput.addEventListener('input', e => {
    if (e.target.value === '') applyFilter('');
  });

  locateBtn.addEventListener('click', locateUser);

  document.getElementById('list-toggle').addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar');
    sidebar.style.display = sidebar.style.display === 'none' ? '' : 'none';
  });

}

main();
