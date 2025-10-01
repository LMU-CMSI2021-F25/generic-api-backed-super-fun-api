import { useEffect, useRef } from "react";
import type { LatestSnapshot } from "../api";

const RED = "oklch(0.8 0.2 30)";
const ORANGE = "oklch(0.8 0.2 80)";
const GREEN = "oklch(0.8 0.2 150)";
const BLUE = "oklch(0.8 0.2 250)";

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
      const availabilityColor = (y == 1 && x == 4) ? (snapshot.available > 0 ? BLUE : RED) : (snapshot.available == 0 ? RED : snapshot.available > 1 ? GREEN : ORANGE);
      ctx.fillStyle = availabilityColor;

      const posX = 75;

      ctx.fillRect(posX*x - (posX-10), y * 45, posX-5, 40);

      ctx.fillStyle = "black";
      ctx.fillText(
        `${snapshot.available}/${snapshot.total}`,
        x * posX - (posX - 10) + 5,
        y * 45 + 27,
      );
    }
  }, [latestSnapshots, refreshedAt]);

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={227}
      style={{ 
        backgroundImage: `url("https://discord.mx/5Xyq89e1xv.png")`,
        backgroundRepeat: 'repeat',
      }}
    ></canvas>
  );
}
