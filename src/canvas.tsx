import { useEffect, useRef } from "react";
import type { LatestSnapshot } from "./api";

const RED = "rgba(255,0,0,0.5)";
const ORANGE = "rgba(255,165,0,0.5)";
const GREEN = "rgba(0,255,0,0.5)";
const BLUE = "rgba(0,0,255,0.5)";

export default function ParkingCanvas({
  latestSnapshots,
  refreshedAt,
}: {
  latestSnapshots: LatestSnapshot[];
  refreshedAt: Date | null;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!(latestSnapshots && canvasRef.current)) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "20px Arial";
    for (const snapshot of latestSnapshots) {
      const [y,x] = snapshot.name.slice(1).split(" ").map(x=>Number(x)).slice(0,2);
      if (isNaN(x) || isNaN(y)) continue;
      const availabilityColor = (x == 1 && y == 4) ? (snapshot.available > 0 ? BLUE : RED) : (snapshot.available == 0 ? RED : snapshot.available > 1 ? GREEN : ORANGE);
      ctx.fillStyle = availabilityColor;

      const posX = 75;

      ctx.fillRect(posX*x-(posX/2), y * 45, posX-5, 40);

      ctx.fillStyle = "black";
      ctx.fillText(
        `${snapshot.available}/${snapshot.total}`,
        x * posX + 10 - (posX / 2),
        y * 45 + 27,
      );
    }
  }, [latestSnapshots, refreshedAt]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={300}
      style={{ 
        backgroundImage: `url("https://discord.mx/5Xyq89e1xv.png")`,
        backgroundRepeat: 'repeat',
      }}
    ></canvas>
  );
}
