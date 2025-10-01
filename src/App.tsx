import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { fetchLatestSnapshots, type LatestSnapshot } from './api';
import ParkingCanvas from './components/parking-canvas';

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

function useMinuteTask(task: () => void) {
  useEffect(() => {
    const now = new Date();
    const delay =
      60000 - (now.getSeconds() * 1000 + now.getMilliseconds());

    let intervalId: NodeJS.Timeout | null = null;
    const timeoutId: NodeJS.Timeout = setTimeout(() => {
      task(); // run at the start of next minute

      intervalId = setInterval(() => {
        task();
      }, 60000);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [task]);
}

function MinuteRenderer() {
  
}

function App() {
  const [rawLatestSnapshots, setRawLatestSnapshots] = useState<LatestSnapshot[]>([]);
  const [parkingFaculty, setParkingFaculty] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('name');
  const [refreshedAt, setRefreshedAt] = useState<Date | null>(null);
  const [minute, setMinute] = useState<number>(new Date().getMinutes());

  // Cache/Memoize the result based on last fetched data (preventing spam of api calls)
  const latestSnapshots = useMemo(() => {
    return sortSnaps([...rawLatestSnapshots], sortBy).filter((snap) => (parkingFaculty ? true : !snap.name.includes('P3')));
  }, [rawLatestSnapshots, sortBy, parkingFaculty]);

  useEffect(() => {
    fetchLatestSnapshots().then((data) => {
      setRawLatestSnapshots(data);
      setRefreshedAt(new Date());
    });
    let interval = setInterval(() => {
      console.log('Fetching latest snapshots... ');
      fetchLatestSnapshots().then((data) => {
        setRawLatestSnapshots(data);
        setRefreshedAt(new Date());
      });
    }, 10_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let minInterval = setInterval(() => {
      setMinute(new Date().getMinutes());
    }, 60_000);
    return () => clearInterval(minInterval);
  }, [])

  return (
    <>
      <h1 className="non-standard-font">LSB EV Parking Spots</h1>
      <div className="canvas-container">
        <ParkingCanvas latestSnapshots={rawLatestSnapshots} refreshedAt={refreshedAt} />
      </div>
      <div id="latest-snapshot">
        <div className="selection-row" id="snapshot-options">
          <div>
            <label htmlFor="faculty_parking">Faculty Parking:</label>
            <select
              name="faculty_parking"
              id="faculty_parking"
              defaultValue={parkingFaculty.toString()}
              onChange={(e) => {
                setParkingFaculty(e.target.value === 'true');
              }}
            >
              <option value="true">Include</option>
              <option value="false">Exclude</option>
            </select>
          </div>
          <div>
            <label htmlFor="sort">Sort:</label>
            <select
              name="sort"
              id="sort"
              defaultValue={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
              }}
            >
              <option value="name">Name</option>
              <option value="timestamp">Timestamp</option>
              <option value="available">Spots - Available</option>
              <option value="inUse">Spots - In Use</option>
              <option value="total">Spots - Total</option>
            </select>
          </div>
        </div>

        <div id="snapshot-table">
          {latestSnapshots && (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Available</th>
                  <th>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {latestSnapshots.map((snapshot) => {
                  const age = Math.floor((new Date().getTime() - new Date(snapshot.timestamp).getTime()) / 1000);
                  return (
                    <tr
                      key={snapshot.name}
                      className={snapshot.available === 0 ? 'full' : snapshot.available / snapshot.total <= 0.2 ? 'almost-full' : 'empty'}
                    >
                      <td>{snapshot.name}</td>
                      <td>{snapshot.available}</td>
                      <td>{age}</td>
                      <td>{new Date(snapshot.timestamp).toLocaleString()}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
          {refreshedAt && (
            <p className="text-muted" style={{ marginTop: '2px' }}>
              Last refreshed at: {refreshedAt?.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
