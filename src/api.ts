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
}

const force_fail = false;

export function fetchLatestSnapshots({ include_faculty_parking = true } = {}) {
  return new Promise<LatestSnapshot[]>((resolve, reject) => {
    if (force_fail) reject('Failed to fetch latest snapshots');
    fetch(`${API_BASE_URL}/snapshots?include_faculty_parking=${include_faculty_parking}`, {
      cache: 'no-cache',
    })
      .then((response) => {
        if (response.status === 200)
          return resolve(
            response.json().then((r) => r.filter((snap: LatestSnapshot) => snap.name.startsWith('P'))) as Promise<LatestSnapshot[]>
          );
        else return reject('Failed to fetch latest snapshots');
      })
      .catch((error) => reject(error));
  });
}

export interface AllTimeWeeklyHourlyAverage {
  day_of_week_num: string;
  hour_num: string;
  hour_label: string;
  avg_available: string;
}

export function fetchWeeklyHourlyAverages() {
  return new Promise<AllTimeWeeklyHourlyAverage[]>((resolve, reject) => {
    if (force_fail) reject('Failed to fetch latest snapshots');
    fetch(`${API_BASE_URL}/weekly-hourly/alltime`, {
      cache: 'no-cache',
    })
      .then((response) => {
        if (response.status === 200) return resolve(response.json() as Promise<AllTimeWeeklyHourlyAverage[]>);
        else return reject('Failed to fetch weekly hourly averages');
      })
      .catch((error) => reject(error));
  });
}

export interface ThisWeeklyHourlyAverage {
  calendar_date: string;
  day_of_week_num: string;
  hour_num: string;
  hour_label: string;
  avg_available: string;
}

export function fetchThisWeeklyHourlyAverages() {
  return new Promise<ThisWeeklyHourlyAverage[]>((resolve, reject) => {
    if (force_fail) reject('Failed to fetch latest snapshots');
    fetch(`${API_BASE_URL}/weekly-hourly/thisweek`, {
      cache: 'no-cache',
    })
      .then((response) => {
        if (response.status === 200) return resolve(response.json() as Promise<ThisWeeklyHourlyAverage[]>);
        else return reject('Failed to fetch this weekly hourly averages');
      })
      .catch((error) => reject(error));
  });
}

export function fetchSnapshotHistory(device_id: number) {
  return new Promise<Snapshot[]>((resolve, reject) => {
    if (force_fail) reject('Failed to fetch latest snapshots');
    fetch(`${API_BASE_URL}/snapshots/${device_id}`, {
      cache: 'no-cache',
    })
      .then((response) => {
        if (response.status === 200) return resolve(response.json() as Promise<Snapshot[]>);
        else return reject('Failed to fetch snapshot history');
      })
      .catch((error) => reject(error));
  });
}
