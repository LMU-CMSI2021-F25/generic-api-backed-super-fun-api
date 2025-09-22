// const API_BASE_URL = 'https://lsb-api.compiles.me';
const API_BASE_URL = 'http://localhost:8001';

export function fetchLatestSnapshots({
  include_faculty_parking = false,
} = {}) {
  return fetch(`${API_BASE_URL}/snapshots?include_faculty_parking=${include_faculty_parking}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    });
}