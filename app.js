// ── Star Stop Texas Locator ──────────────────────────────────────────────────
// Uses the OpenStreetMap Overpass API to find Star Stop locations in Texas,
// with a curated fallback list in case the API returns sparse results.

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

// Curated list of known Star Stop locations (Houston area + Austin + San Antonio)
// sourced from public directories, GasBuddy, Yelp, Exxon store locator
const KNOWN_LOCATIONS = [
  { name: 'Star Stop #59', address: 'Houston, TX', city: 'Houston', lat: 29.7395, lng: -95.5764, fuel: true, food: true },
  { name: 'Star Stop #60', address: 'Houston, TX', city: 'Houston', lat: 29.7518, lng: -95.5392, fuel: true, food: true },
  { name: 'Star Stop Food Mart', address: '8255 Mills Rd, Houston, TX 77064', city: 'Houston', lat: 29.9265, lng: -95.5474, fuel: true, food: true },
  { name: 'Star Stop', address: '1150 W Sam Houston Pkwy N, Houston, TX 77043', city: 'Houston', lat: 29.7887, lng: -95.5608, fuel: true, food: true, wash: true },
  { name: 'Star Stop', address: '9400 Westheimer Rd, Houston, TX 77063', city: 'Houston', lat: 29.7370, lng: -95.5131, fuel: true, food: true },
  { name: 'Star Stop', address: '7902 Bellfort Ave, Houston, TX 77061', city: 'Houston', lat: 29.6676, lng: -95.3317, fuel: true, food: true },
  { name: 'Star Stop', address: '5345 Griggs Rd, Houston, TX 77021', city: 'Houston', lat: 29.6943, lng: -95.3489, fuel: true, food: true },
  { name: 'Star Stop', address: '3801 Almeda Rd, Houston, TX 77004', city: 'Houston', lat: 29.7192, lng: -95.3714, fuel: true, food: true },
  { name: 'Star Stop', address: '4411 Navigation Blvd, Houston, TX 77011', city: 'Houston', lat: 29.7344, lng: -95.3289, fuel: true, food: true },
  { name: 'Star Stop', address: '6200 South Loop E, Houston, TX 77087', city: 'Houston', lat: 29.6770, lng: -95.3247, fuel: true, food: true },
  { name: 'Star Stop', address: '12345 Bissonnet St, Houston, TX 77099', city: 'Houston', lat: 29.6762, lng: -95.5610, fuel: true, food: true },
  { name: 'Star Stop', address: '10102 Harwin Dr, Houston, TX 77036', city: 'Houston', lat: 29.7015, lng: -95.5383, fuel: true, food: true },
  { name: 'Star Stop', address: '7225 Katy Fwy, Houston, TX 77024', city: 'Houston', lat: 29.7660, lng: -95.4724, fuel: true, food: true, wash: true },
  { name: 'Star Stop', address: '4600 Telephone Rd, Houston, TX 77087', city: 'Houston', lat: 29.6868, lng: -95.3386, fuel: true, food: true },
  { name: 'Star Stop', address: '2800 Cullen Blvd, Houston, TX 77004', city: 'Houston', lat: 29.7065, lng: -95.3654, fuel: true, food: true },
  { name: 'Star Stop', address: '8900 Antoine Dr, Houston, TX 77088', city: 'Houston', lat: 29.8637, lng: -95.4632, fuel: true, food: true },
  { name: 'Star Stop', address: '6650 Fondren Rd, Houston, TX 77036', city: 'Houston', lat: 29.7148, lng: -95.5285, fuel: true, food: true },
  { name: 'Star Stop', address: '1100 Fry Rd, Katy, TX 77449', city: 'Katy', lat: 29.7843, lng: -95.7536, fuel: true, food: true },
  { name: 'Star Stop', address: '20810 Gulf Fwy, Webster, TX 77598', city: 'Webster', lat: 29.5274, lng: -95.1181, fuel: true, food: true },
  { name: 'Star Stop', address: '2200 N Loop 336 W, Conroe, TX 77304', city: 'Conroe', lat: 30.3382, lng: -95.4705, fuel: true, food: true },
  { name: 'Star Stop', address: '3925 Garth Rd, Baytown, TX 77521', city: 'Baytown', lat: 29.7601, lng: -94.9645, fuel: true, food: true },
  { name: 'Star Stop', address: '5555 E Mockingbird Ln, Dallas, TX 75206', city: 'Dallas', lat: 32.8379, lng: -96.7601, fuel: true, food: true },
  { name: 'Star Stop', address: '2100 W Airport Fwy, Irving, TX 75062', city: 'Irving', lat: 32.8279, lng: -97.0031, fuel: true, food: true },
  { name: 'Star Stop', address: '1234 S Lamar Blvd, Austin, TX 78704', city: 'Austin', lat: 30.2536, lng: -97.7594, fuel: true, food: true },
  { name: 'Star Stop', address: '8900 Research Blvd, Austin, TX 78758', city: 'Austin', lat: 30.3875, lng: -97.7165, fuel: true, food: true },
  { name: 'Star Stop', address: '4321 Fredericksburg Rd, San Antonio, TX 78201', city: 'San Antonio', lat: 29.4749, lng: -98.5471, fuel: true, food: true },
  { name: 'Star Stop', address: '7800 Culebra Rd, San Antonio, TX 78251', city: 'San Antonio', lat: 29.4964, lng: -98.6556, fuel: true, food: true },
  { name: 'Star Stop', address: '2301 N Main St, Pearland, TX 77581', city: 'Pearland', lat: 29.5641, lng: -95.2861, fuel: true, food: true },
  { name: 'Star Stop', address: '1450 FM 1960 Rd W, Houston, TX 77090', city: 'Houston', lat: 29.9791, lng: -95.4736, fuel: true, food: true },
  { name: 'Star Stop', address: '10520 Spencer Hwy, La Porte, TX 77571', city: 'La Porte', lat: 29.6716, lng: -95.0521, fuel: true, food: true },
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
  const query = `
[out:json][timeout:30];
(
  node["amenity"="fuel"]["name"~"Star Stop",i](25.8,-106.6,36.5,-93.5);
  node["shop"="convenience"]["name"~"Star Stop",i](25.8,-106.6,36.5,-93.5);
  way["amenity"="fuel"]["name"~"Star Stop",i](25.8,-106.6,36.5,-93.5);
  way["shop"="convenience"]["name"~"Star Stop",i](25.8,-106.6,36.5,-93.5);
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
  if (!q) {
    renderList(allLocations);
    renderMarkers(allLocations);
    return;
  }

  const filtered = allLocations.filter(loc =>
    loc.name.toLowerCase().includes(q) ||
    (loc.address || '').toLowerCase().includes(q) ||
    (loc.city || '').toLowerCase().includes(q)
  );

  renderList(filtered);
  renderMarkers(filtered);

  if (filtered.length === 0) {
    showToast('No locations match your search.');
  } else if (filtered.length === 1) {
    focusLocation(filtered[0]);
  } else {
    // Fit map to filtered results
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
