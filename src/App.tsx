import { useEffect, useState } from 'react'
import './App.css'
import { fetchLatestSnapshots, type LatestSnapshot } from './api';

function App() {
  const [latestSnapshots, setLatestSnapshots] = useState<LatestSnapshot[]>([]);
  const [parkingFaculty, setParkingFaculty] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('name');

  function sortSnaps(snapshots: LatestSnapshot[], sort: string) {
    if (sort === 'name') {
      snapshots.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'last_updated') {
      snapshots.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } else if (sort === 'available') {
      snapshots.sort((a, b) => b.available - a.available);
    } else if (sort === 'inUse') {
      snapshots.sort((a, b) => b.used - a.used);
    } else if (sort === 'total') {
      snapshots.sort((a, b) => b.total - a.total);
    }
    return snapshots;
  }

  useEffect(() => {
    fetchLatestSnapshots({ include_faculty_parking: parkingFaculty }).then(data => setLatestSnapshots(sortSnaps(data, sortBy)));
    let interval = setInterval(() => {
      console.log('Fetching latest snapshots... ', parkingFaculty);
      fetchLatestSnapshots({ include_faculty_parking: parkingFaculty }).then(data => setLatestSnapshots(sortSnaps(data, sortBy)));
    }, 10_000);
    return () => clearInterval(interval);
  }, [parkingFaculty, sortBy]);

  return (
    <div>
      <h1 style={{
        marginBottom: '0.3rem',
      }}>LSB EV Parking Spots</h1>
      <div>
        <div className="selection-row">
          <div>
            <label htmlFor="faculty_parking">Faculty Parking:</label>
            <select name="faculty_parking" id="faculty_parking" defaultValue={parkingFaculty.toString()} onChange={(e) => {
              setParkingFaculty(e.target.value === 'true');
            }}>
              <option value="true">Include</option>
              <option value="false">Exclude</option>
            </select>
          </div>
          <div>
            <label htmlFor="sort">Sort:</label>
            <select name="sort" id="sort" defaultValue={sortBy} onChange={(e) => {
              setSortBy(e.target.value);
            }}>
              <option value="name">Name</option>
              <option value="timestamp">Timestamp</option>
              <option value="available">Spots - Available</option>
              <option value="inUse">Spots - In Use</option>
              <option value="total">Spots - Total</option>
            </select>
          </div>
        </div>
        <div>
          {latestSnapshots ? JSON.stringify(latestSnapshots) : 'Loading...'}
        </div>
      </div>
    </div>
  )
}

export default App
