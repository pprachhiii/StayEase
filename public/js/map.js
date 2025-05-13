const [lng, lat] = coordinates;

const map = L.map("map").setView([lat, lng], 12);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

const offsetLat = lat + (Math.random() - 0.5) * 0.01;
const offsetLng = lng + (Math.random() - 0.5) * 0.01;

L.marker([offsetLat, offsetLng])
  .addTo(map)
  .bindPopup("Exact location shared after booking.")
  .openPopup();
