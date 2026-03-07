const NMIMS_LOCATION = { lat: 19.1044, lng: 72.8370 };

const AUTO_RATE_PER_KM = 18;
const AUTO_BASE_FARE = 23;
const BUS_FARE = 8;
const METRO_BASE_FARE = 10;
const METRO_RATE_PER_KM = 3;
const WALKING_SPEED_KMH = 5;

export function calculateTravelCost(hostelLat, hostelLng) {
  const distance = getDistanceKm(hostelLat, hostelLng, NMIMS_LOCATION.lat, NMIMS_LOCATION.lng);

  const autoFare = Math.round(AUTO_BASE_FARE + (distance * AUTO_RATE_PER_KM));
  const busFare = distance < 2 ? BUS_FARE : BUS_FARE + 5;
  const metroFare = distance < 1 ? 0 : Math.round(METRO_BASE_FARE + (distance * METRO_RATE_PER_KM));
  const walkingTime = Math.round((distance / WALKING_SPEED_KMH) * 60);
  const autoTime = Math.max(5, Math.round(distance * 3.5));
  const busTime = Math.max(8, Math.round(distance * 5));

  return {
    distance: Math.round(distance * 10) / 10,
    auto: { fare: autoFare, time: autoTime },
    bus: { fare: busFare, time: busTime },
    metro: distance > 1.5 ? { fare: metroFare, time: Math.round(distance * 4) } : null,
    walking: distance <= 2 ? { time: walkingTime } : null,
  };
}

function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}
