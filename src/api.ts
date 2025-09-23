// const API_BASE_URL = 'https://lsb-api.compiles.me';
const API_BASE_URL = 'http://localhost:8001';

export interface LatestSnapshot {
  device_id: number;
  available: number;
  inUse: number;
  total: number;
  timestamp: string;
  name: string;
};

export function fetchLatestSnapshots({
  include_faculty_parking = false,
} = {}) {
  return new Promise<LatestSnapshot[]>((resolve, reject) => {
    fetch(`${API_BASE_URL}/snapshots?include_faculty_parking=${include_faculty_parking}`)
      .then(response => {
        if (response.status === 200) return resolve(response.json() as Promise<LatestSnapshot[]>);
        else return reject("Failed to fetch latest snapshots");
      })
      .catch(error => reject(error));
  });
}