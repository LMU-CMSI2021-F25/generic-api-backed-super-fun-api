import { useEffect, useRef, useState } from 'react'
import './App.css'
import { fetchLatestSnapshots, type LatestSnapshot } from './api';

function App() {
  const [latestSnapshots, setLatestSnapshots] = useState<LatestSnapshot[]>([]);
  const [parkingFaculty, setParkingFaculty] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    fetchLatestSnapshots({ include_faculty_parking: parkingFaculty }).then(data => setLatestSnapshots(data));
    let interval = setInterval(() => {
      console.log('Fetching latest snapshots... ', parkingFaculty);
      fetchLatestSnapshots({ include_faculty_parking: parkingFaculty }).then(data => setLatestSnapshots(data));
    }, 10_000);
    return () => clearInterval(interval);
  }, [parkingFaculty]);

  useEffect(() => {
    if (!(latestSnapshots && canvasRef.current)) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'lightgray';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'green';
    ctx.font = '20px Arial';
    for (const snapshot of latestSnapshots) {
      
    }

    latestSnapshots.forEach((snapshot, index) => {
      const x = (index % 10) * 40 + 10;
      const y = Math.floor(index / 10) * 40 + 10;
      const width = 30;
      const height = 30;
      // const colorIntensity = availableSpots == 0 ? 
      ctx.fillStyle = 'green';
      ctx.fillRect(x, y, width, height);
      ctx.fillStyle = 'black';
      ctx.font = '16px Arial';
      ctx.fillText(`${snapshot.available}/${snapshot.total}`, x + 5, y + 20);
    });
  }, [latestSnapshots]);

  return (
    <div>
      <h1 style={{
        marginBottom: '0.3rem',
      }}>LSB EV Parking Spots</h1>
      <div>
        <label htmlFor="faculty_parking">Faculty Parking:</label>
        <select name="faculty_parking" id="faculty_parking" onChange={(e) => {
          setParkingFaculty(e.target.value === 'true');
        }}>
          <option value="true">Include</option>
          <option value="false">Exclude</option>
        </select>
        <div>
          <canvas ref={canvasRef} width={400} height={300}></canvas>
        </div>
        <div>
          {latestSnapshots ? JSON.stringify(latestSnapshots) : 'Loading...'}
        </div>
      </div>
    </div>
  )
}

export default App
