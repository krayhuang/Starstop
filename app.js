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

// PRIMARY SOURCE: Texas Lottery promotional retailer list (Feb 2023) — complete PDF.
// Secondary: Exxon.com, Texas Comptroller (opengovus.com), TABC, GasBuddy, BBB, Waze.
// Coordinates ≈ ±150 m of address.
const KNOWN_LOCATIONS = [
  // ── Houston metro ────────────────────────────────────────────────────────
  { name: 'Star Stop #1',   address: '4 Maxey Rd, Houston, TX 77013',                  city: 'Houston',       lat: 29.7585, lng: -95.2480, fuel: true, food: true },
  { name: 'Star Stop #3',   address: '12546 East Fwy, Houston, TX 77015',              city: 'Houston',       lat: 29.7580, lng: -95.1850, fuel: true, food: true },
  { name: 'Star Stop #4',   address: '6929 North Loop E, Houston, TX 77028',           city: 'Houston',       lat: 29.8097, lng: -95.2841, fuel: true, food: true },
  { name: 'Star Stop #5',   address: '6001 East Mount Houston Rd, Houston, TX 77050',  city: 'Houston',       lat: 29.9199, lng: -95.3201, fuel: true, food: true },
  { name: 'Star Stop #7',   address: '6625 Pinemont Dr, Houston, TX 77092',            city: 'Houston',       lat: 29.8364, lng: -95.4736, fuel: true, food: true },
  { name: 'Star Stop #8',   address: '8610 Almeda Rd, Houston, TX 77054',              city: 'Houston',       lat: 29.6848, lng: -95.3714, fuel: true, food: true },
  { name: 'Star Stop #9',   address: '1010 West Alabama St, Houston, TX 77006',        city: 'Houston',       lat: 29.7399, lng: -95.3836, fuel: true, food: true },
  { name: 'Star Stop #10',  address: '16983 Gleneagle Dr, Conroe, TX 77385',           city: 'Conroe',        lat: 30.1047, lng: -95.4529, fuel: true, food: true },
  { name: 'Star Stop #11',  address: '1302 North Loop W, Houston, TX 77009',           city: 'Houston',       lat: 29.8119, lng: -95.3867, fuel: true, food: true },
  { name: 'Star Stop #12',  address: '2490 S Wayside Dr, Houston, TX 77023',           city: 'Houston',       lat: 29.7181, lng: -95.3289, fuel: true, food: true },
  { name: 'Star Stop #14',  address: '1450 Aldine Bender Rd, Houston, TX 77032',       city: 'Houston',       lat: 29.9322, lng: -95.3534, fuel: true, food: true },
  { name: 'Star Stop #15',  address: '3215 S Loop W, Houston, TX 77025',               city: 'Houston',       lat: 29.6812, lng: -95.4516, fuel: true, food: true },
  { name: 'Star Stop #16',  address: '23780 Loop 494, Porter, TX 77365',               city: 'Porter',        lat: 30.1117, lng: -95.3141, fuel: true, food: true },
  { name: 'Star Stop #18',  address: '5418 Telephone Rd, Houston, TX 77087',           city: 'Houston',       lat: 29.6755, lng: -95.3445, fuel: true, food: true },
  { name: 'Star Stop #19',  address: '19555 McKay Rd, Humble, TX 77338',               city: 'Humble',        lat: 29.9887, lng: -95.2466, fuel: true, food: true },
  { name: 'Star Stop #21',  address: '11302 Fondren Rd, Houston, TX 77035',            city: 'Houston',       lat: 29.6568, lng: -95.5237, fuel: true, food: true },
  { name: 'Star Stop #22',  address: '733 N Loop W, Houston, TX 77008',                city: 'Houston',       lat: 29.8110, lng: -95.4090, fuel: true, food: true },
  { name: 'Star Stop #23',  address: '11302 Westheimer Rd, Houston, TX 77077',         city: 'Houston',       lat: 29.7371, lng: -95.5952, fuel: true, food: true },
  { name: 'Star Stop #25',  address: '5505 Lockwood Dr, Houston, TX 77026',            city: 'Houston',       lat: 29.7734, lng: -95.3239, fuel: true, food: true },
  { name: 'Star Stop #26',  address: '3810 Little York Rd, Houston, TX 77093',         city: 'Houston',       lat: 29.8600, lng: -95.4112, fuel: true, food: true },
  { name: 'Star Stop #27',  address: '4328 Gulf Fwy, La Marque, TX 77568',             city: 'La Marque',     lat: 29.3680, lng: -94.9978, fuel: true, food: true },
  { name: 'Star Stop #28',  address: '7410 Cullen Blvd, Houston, TX 77051',            city: 'Houston',       lat: 29.6628, lng: -95.3663, fuel: true, food: true, wash: true },
  { name: 'Star Stop #29',  address: '111 Rankin Rd, Houston, TX 77090',               city: 'Houston',       lat: 29.9752, lng: -95.4284, fuel: true, food: true },
  { name: 'Star Stop #30',  address: '15050 Old Humble Rd, Humble, TX 77396',          city: 'Humble',        lat: 29.9841, lng: -95.2283, fuel: true, food: true },
  { name: 'Star Stop #31',  address: '15505 Wallisville Rd, Houston, TX 77049',        city: 'Houston',       lat: 29.8334, lng: -95.1601, fuel: true, food: true },
  { name: 'Star Stop #39',  address: '12602 Southwest Fwy, Stafford, TX 77477',        city: 'Stafford',      lat: 29.6616, lng: -95.5766, fuel: true, food: true },
  { name: 'Star Stop #41',  address: '26205 SW Freeway, Rosenberg, TX 77471',          city: 'Rosenberg',     lat: 29.5569, lng: -95.7858, fuel: true, food: true },
  { name: 'Star Stop #42',  address: '14304 Gulf Freeway, Houston, TX 77034',          city: 'Houston',       lat: 29.6219, lng: -95.2246, fuel: true, food: true },
  { name: 'Star Stop #43',  address: '5440 East Fwy, Houston, TX 77020',               city: 'Houston',       lat: 29.7583, lng: -95.3024, fuel: true, food: true },
  { name: 'Star Stop #44',  address: '424 Sheldon Rd, Channelview, TX 77530',          city: 'Channelview',   lat: 29.7893, lng: -95.1105, fuel: true, food: true },
  { name: 'Star Stop #45',  address: '8909 N Hwy 146, Mont Belvieu, TX 77523',         city: 'Mont Belvieu',  lat: 29.8520, lng: -94.8994, fuel: true, food: true },
  { name: 'Star Stop #46',  address: '5248 Allum Rd, Houston, TX 77045',               city: 'Houston',       lat: 29.6531, lng: -95.4348, fuel: true, food: true },
  { name: 'Star Stop #47',  address: '6141 South Loop E, Houston, TX 77087',           city: 'Houston',       lat: 29.6809, lng: -95.3247, fuel: true, food: true },
  { name: 'Star Stop #48',  address: '9350 North Fwy, Houston, TX 77037',              city: 'Houston',       lat: 29.9046, lng: -95.4065, fuel: true, food: true },
  { name: 'Star Stop #49',  address: '8255 Mills Rd, Houston, TX 77064',               city: 'Houston',       lat: 29.9265, lng: -95.5474, fuel: true, food: true },
  { name: 'Star Stop #52',  address: '13920 Fondren Rd, Missouri City, TX 77489',      city: 'Missouri City', lat: 29.5857, lng: -95.5285, fuel: true, food: true },
  { name: 'Star Stop #53',  address: '202 North Loop W, Houston, TX 77018',            city: 'Houston',       lat: 29.8186, lng: -95.4259, fuel: true, food: true },
  { name: 'Star Stop #54',  address: '13233 Dairy Ashford Rd, Sugar Land, TX 77478',   city: 'Sugar Land',    lat: 29.6235, lng: -95.6241, fuel: true, food: true },
  { name: 'Star Stop #55',  address: '12503 Northwest Fwy, Houston, TX 77092',         city: 'Houston',       lat: 29.8277, lng: -95.5075, fuel: true, food: true },
  { name: 'Star Stop #56',  address: '7065 Will Clayton Pkwy, Humble, TX 77338',       city: 'Humble',        lat: 29.9975, lng: -95.2596, fuel: true, food: true },
  { name: 'Star Stop #57',  address: '1225 Broadway St, Houston, TX 77012',            city: 'Houston',       lat: 29.7244, lng: -95.3289, fuel: true, food: true },
  { name: 'Star Stop #59',  address: '2211 North Fwy, Houston, TX 77009',              city: 'Houston',       lat: 29.8177, lng: -95.3727, fuel: true, food: true },
  { name: 'Star Stop #60',  address: '2111 Southmore Blvd, Houston, TX 77004',         city: 'Houston',       lat: 29.7271, lng: -95.3683, fuel: true, food: true },
  { name: 'Star Stop #61',  address: '14101 Northwest Fwy, Houston, TX 77040',         city: 'Houston',       lat: 29.8449, lng: -95.5355, fuel: true, food: true },
  { name: 'Star Stop #62',  address: '5401 Katy Fwy, Houston, TX 77007',               city: 'Houston',       lat: 29.7666, lng: -95.4527, fuel: true, food: true },
  { name: 'Star Stop #63',  address: '24645 FM 1314, Porter, TX 77365',                city: 'Porter',        lat: 30.1151, lng: -95.3133, fuel: true, food: true },
  { name: 'Star Stop #64',  address: '10801 Eastex Fwy, Houston, TX 77093',            city: 'Houston',       lat: 29.9095, lng: -95.3365, fuel: true, food: true },
  { name: 'Star Stop #65',  address: '1751 Mangum Rd, Houston, TX 77092',              city: 'Houston',       lat: 29.8189, lng: -95.5021, fuel: true, food: true },
  { name: 'Star Stop #66',  address: '3003 Ella Blvd, Houston, TX 77018',              city: 'Houston',       lat: 29.8064, lng: -95.4306, fuel: true, food: true },
  { name: 'Star Stop #67',  address: '12303 Eastex Fwy, Houston, TX 77039',            city: 'Houston',       lat: 29.9432, lng: -95.3239, fuel: true, food: true },
  { name: 'Star Stop #68',  address: '102 Cavalcade St, Houston, TX 77009',            city: 'Houston',       lat: 29.8014, lng: -95.3720, fuel: true, food: true },
  { name: 'Star Stop #69',  address: '10721 S Post Oak Rd, Houston, TX 77035',         city: 'Houston',       lat: 29.6508, lng: -95.4810, fuel: true, food: true },
  { name: 'Star Stop #97',  address: '11863 N Sam Houston Pkwy E, Humble, TX 77396',   city: 'Humble',        lat: 29.9934, lng: -95.2015, fuel: true, food: true },
  { name: 'Star Stop #99',  address: '782 Fish Creek Thoroughfare, Montgomery, TX 77316', city: 'Montgomery', lat: 30.3507, lng: -95.7027, fuel: true, food: true },
  { name: 'Star Stop #101', address: '5823 New Territory Blvd, Sugar Land, TX 77479',  city: 'Sugar Land',    lat: 29.6096, lng: -95.6427, fuel: true, food: true },
  { name: 'Star Stop #103', address: '11525 Northwest Fwy, Houston, TX 77092',         city: 'Houston',       lat: 29.8293, lng: -95.4960, fuel: true, food: true },
  { name: 'Star Stop #105', address: '16271 Imperial Valley Dr, Houston, TX 77060',    city: 'Houston',       lat: 29.9517, lng: -95.3908, fuel: true, food: true },
  { name: 'Star Stop #106', address: '451 TC Jester Blvd, Houston, TX 77007',          city: 'Houston',       lat: 29.7801, lng: -95.4253, fuel: true, food: true },
  { name: 'Star Stop #107', address: '15640 Woodland Hill Dr, Humble, TX 77346',       city: 'Humble',        lat: 29.9773, lng: -95.1654, fuel: true, food: true },
  { name: 'Star Stop #108', address: '2440 N Shepherd Dr, Houston, TX 77008',          city: 'Houston',       lat: 29.7996, lng: -95.4202, fuel: true, food: true },
  { name: 'Star Stop #109', address: '12805 Buffalo Speedway, Houston, TX 77045',      city: 'Houston',       lat: 29.6611, lng: -95.4648, fuel: true, food: true },
  { name: 'Star Stop #110', address: '1415 Studemont St, Houston, TX 77007',           city: 'Houston',       lat: 29.7671, lng: -95.4016, fuel: true, food: true },
  { name: 'Star Stop #112', address: '1202 Telephone Rd, Houston, TX 77023',           city: 'Houston',       lat: 29.7152, lng: -95.3260, fuel: true, food: true },
  { name: 'Star Stop #114', address: '10230 East Fwy, Jacinto City, TX 77029',         city: 'Jacinto City',  lat: 29.7715, lng: -95.2256, fuel: true, food: true },
  { name: 'Star Stop #115', address: '1101 Jackson St, Richmond, TX 77469',            city: 'Richmond',      lat: 29.5795, lng: -95.7601, fuel: true, food: true },
  { name: 'Star Stop #116', address: '12110 Northwest Fwy, Houston, TX 77092',         city: 'Houston',       lat: 29.8337, lng: -95.5032, fuel: true, food: true },
  { name: 'Star Stop #117', address: '2502 North Loop W, Houston, TX 77092',           city: 'Houston',       lat: 29.8056, lng: -95.4858, fuel: true, food: true },
  { name: 'Star Stop #119', address: '12777 East Fwy, Houston, TX 77015',              city: 'Houston',       lat: 29.7551, lng: -95.2062, fuel: true, food: true },
  { name: 'Star Stop #121', address: '9351 North Fwy, Houston, TX 77037',              city: 'Houston',       lat: 29.8970, lng: -95.4073, fuel: true, food: true },
  { name: 'Star Stop #125', address: '3535 Hwy 6 S, Houston, TX 77082',               city: 'Houston',       lat: 29.6490, lng: -95.6355, fuel: true, food: true },
  { name: 'Star Stop #126', address: '1150 W Sam Houston Pkwy N, Houston, TX 77043',   city: 'Houston',       lat: 29.7887, lng: -95.5608, fuel: true, food: true },
  { name: 'Star Stop #127', address: '10231 Clay Rd, Houston, TX 77043',               city: 'Houston',       lat: 29.8159, lng: -95.5843, fuel: true, food: true },
  { name: 'Star Stop #128', address: '1300 E NASA Pkwy, Houston, TX 77058',            city: 'Houston',       lat: 29.5396, lng: -95.0832, fuel: true, food: true },
  { name: 'Star Stop #129', address: '11050 S Post Oak Rd, Houston, TX 77035',         city: 'Houston',       lat: 29.6482, lng: -95.4804, fuel: true, food: true, wash: true },
  { name: 'Star Stop #131', address: '2320 Meridiana Pkwy, Rosharon, TX 77583',        city: 'Rosharon',      lat: 29.3688, lng: -95.4379, fuel: true, food: true },
  { name: 'Star Stop #132', address: '9811 Bissonnet St, Houston, TX 77036',           city: 'Houston',       lat: 29.6982, lng: -95.5349, fuel: true, food: true },

  // ── Austin / Central Texas ───────────────────────────────────────────────
  { name: 'Star Stop #33',  address: '10706 N MoPac Expy, Austin, TX 78759',           city: 'Austin',        lat: 30.4145, lng: -97.7564, fuel: true, food: true },
  { name: 'Star Stop #34',  address: '4545 S Lamar Blvd, Austin, TX 78745',            city: 'Austin',        lat: 30.2258, lng: -97.7877, fuel: true, food: true },
  { name: 'Star Stop #35',  address: '3828 N IH 35, Austin, TX 78751',                 city: 'Austin',        lat: 30.2987, lng: -97.7244, fuel: true, food: true },
  { name: 'Star Stop #36',  address: '7510 N MoPac Expy, Austin, TX 78731',            city: 'Austin',        lat: 30.3584, lng: -97.7494, fuel: true, food: true },
  { name: 'Star Stop #37',  address: '8224 Burnet Rd, Austin, TX 78757',               city: 'Austin',        lat: 30.3593, lng: -97.7268, fuel: true, food: true },
  { name: 'Star Stop #38',  address: '4912 Monterey Oaks Blvd, Austin, TX 78749',      city: 'Austin',        lat: 30.2194, lng: -97.8253, fuel: true, food: true },
  { name: 'Star Stop #40',  address: '7701 Cameron Rd, Austin, TX 78752',              city: 'Austin',        lat: 30.3391, lng: -97.6864, fuel: true, food: true },
  { name: 'Star Stop #50',  address: '6310 E Ben White Blvd, Austin, TX 78741',        city: 'Austin',        lat: 30.2095, lng: -97.7135, fuel: true, food: true },
  { name: 'Star Stop #72',  address: '3404 Hwy 183 S, Austin, TX 78744',               city: 'Austin',        lat: 30.1934, lng: -97.7768, fuel: true, food: true },
  { name: 'Star Stop #73',  address: '1919 S Pleasant Valley Rd, Austin, TX 78741',    city: 'Austin',        lat: 30.2205, lng: -97.7035, fuel: true, food: true },
  { name: 'Star Stop #74',  address: '2819 Guadalupe St, Austin, TX 78705',            city: 'Austin',        lat: 30.2941, lng: -97.7396, fuel: true, food: true },
  { name: 'Star Stop #75',  address: '5801 N IH 35, Austin, TX 78723',                 city: 'Austin',        lat: 30.3289, lng: -97.7101, fuel: true, food: true },
  { name: 'Star Stop #76',  address: '2909 W Anderson Ln, Austin, TX 78757',           city: 'Austin',        lat: 30.3594, lng: -97.7354, fuel: true, food: true },
  { name: 'Star Stop #77',  address: '13466 Hwy 183 N, Austin, TX 78750',              city: 'Austin',        lat: 30.4568, lng: -97.7830, fuel: true, food: true },
  { name: 'Star Stop #78',  address: '13775 Research Blvd, Austin, TX 78750',          city: 'Austin',        lat: 30.4340, lng: -97.7888, fuel: true, food: true },
  { name: 'Star Stop #79',  address: '12801 FM 620 N, Austin, TX 78750',               city: 'Austin',        lat: 30.4564, lng: -97.8010, fuel: true, food: true },
  { name: 'Star Stop #80',  address: '409 W Palm Valley Blvd, Round Rock, TX 78664',   city: 'Round Rock',    lat: 30.5107, lng: -97.6795, fuel: true, food: true },
  { name: 'Star Stop #81',  address: '1015 Leander Rd, Georgetown, TX 78628',          city: 'Georgetown',    lat: 30.6328, lng: -97.6839, fuel: true, food: true },
  { name: 'Star Stop #82',  address: '6903 Brodie Ln, Austin, TX 78745',               city: 'Austin',        lat: 30.1873, lng: -97.8359, fuel: true, food: true },

  // ── San Antonio ───────────────────────────────────────────────────────────
  { name: 'Star Stop #90',  address: '2706 Culebra Ave, San Antonio, TX 78228',        city: 'San Antonio',   lat: 29.4736, lng: -98.5671, fuel: true, food: true },
  { name: 'Star Stop #92',  address: '2142 E Southcross Blvd, San Antonio, TX 78223',  city: 'San Antonio',   lat: 29.3857, lng: -98.4540, fuel: true, food: true, wash: true },

  // ── DFW ───────────────────────────────────────────────────────────────────
  { name: 'Star Stop',      address: '2216 N Collins St, Arlington, TX 76011',         city: 'Arlington',     lat: 32.7415, lng: -97.1050, fuel: true, food: true },
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

// ── Browser-side geocoding with localStorage cache ───────────────────────────
const GEO_CACHE_KEY = 'starstop_geocache_v1';

function loadGeoCache() {
  try { return JSON.parse(localStorage.getItem(GEO_CACHE_KEY) || '{}'); }
  catch { return {}; }
}

function saveGeoCache(cache) {
  try { localStorage.setItem(GEO_CACHE_KEY, JSON.stringify(cache)); } catch {}
}

async function nominatimGeocode(address) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&countrycodes=us`;
  const res = await fetch(url, { headers: { 'User-Agent': 'StarStopLocator/1.0' } });
  const data = await res.json();
  if (data && data[0]) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lng || data[0].lon) };
  return null;
}

// Geocodes any locations whose coords are still approximate.
// Runs in background after initial render; updates markers as results arrive.
async function improveCoordinates() {
  const cache = loadGeoCache();
  const toGeocode = allLocations.filter(loc => !cache[loc.address] && loc.address);
  if (toGeocode.length === 0) return;

  showToast(`Improving pin accuracy (${toGeocode.length} addresses)…`);

  let improved = 0;
  for (const loc of toGeocode) {
    await new Promise(r => setTimeout(r, 1100)); // Nominatim rate limit: 1 req/s
    try {
      const coords = await nominatimGeocode(loc.address);
      if (coords) {
        cache[loc.address] = coords;
        saveGeoCache(cache);
        // Update the location in-place and move its marker
        loc.lat = coords.lat;
        loc.lng = coords.lng;
        const marker = markers[loc.id];
        if (marker) marker.setLatLng([coords.lat, coords.lng]);
        improved++;
      }
    } catch { /* skip on error */ }
  }

  if (improved > 0) showToast(`Pin accuracy updated for ${improved} locations`);
}

// Applies cached coordinates to all locations immediately (before geocoding runs)
function applyCachedCoords() {
  const cache = loadGeoCache();
  for (const loc of allLocations) {
    const cached = cache[loc.address];
    if (cached) { loc.lat = cached.lat; loc.lng = cached.lng; }
  }
}


async function main() {
  initMap();

  // Load curated locations immediately — no waiting
  allLocations = mergeLocations([]);

  // Apply any previously-geocoded coords from localStorage before first render
  applyCachedCoords();

  renderList(allLocations);
  renderMarkers(allLocations);

  if (allLocations.length > 0) {
    const bounds = L.latLngBounds(allLocations.map(l => [l.lat, l.lng]));
    map.fitBounds(bounds.pad(0.1));
  }

  // Geocode uncached addresses in the background to improve pin accuracy
  improveCoordinates();

  // Fetch live OSM data silently in the background; merge if anything new found
  fetchFromOverpass().then(osmLocs => {
    if (osmLocs.length === 0) return;
    const merged = mergeLocations(osmLocs);
    if (merged.length > allLocations.length) {
      allLocations = merged;
      renderList(allLocations);
      renderMarkers(allLocations);
      showToast(`Updated: ${allLocations.length} locations`);
    }
  }).catch(() => { /* OSM unavailable — curated list is fine */ });

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
