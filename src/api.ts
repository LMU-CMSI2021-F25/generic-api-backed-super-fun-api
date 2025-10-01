const API_BASE_URL = 'https://lsb-api.compiles.me';
// const API_BASE_URL = 'http://localhost:8001';

export interface Snapshot {
  device_id: number;
  timestamp: string;
  available: number;
  used: number;
  total: number;
}

export interface LatestSnapshot extends Snapshot {
  name: string;
};

export function fetchLatestSnapshots({
  include_faculty_parking = true,
} = {}) {
  return new Promise<LatestSnapshot[]>((resolve, reject) => {
    fetch(`${API_BASE_URL}/snapshots?include_faculty_parking=${include_faculty_parking}`)
      .then(response => {
        if (response.status === 200) return resolve(response.json().then(r => r.filter((snap: LatestSnapshot) => snap.name.startsWith("P"))) as Promise<LatestSnapshot[]>);
        else return reject("Failed to fetch latest snapshots");
      })
      .catch(error => reject(error));
  });
}

export function fetchSnapshotHistory(device_id: number) {
  throw new Error("Function not implemented."+ device_id);
}

// export function