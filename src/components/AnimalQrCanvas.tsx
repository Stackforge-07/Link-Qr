"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import QRCode from "qrcode";

export type AnimalType = "cat" | "panda" | "fox" | "dog" | "bunny";

interface AnimalQrCanvasProps {
  text: string;
  onDataUrlChange?: (dataUrl: string) => void;
  className?: string;
}

interface AnimalMeta {
  id: AnimalType;
  name: string;
  emoji: string;
  themeColor: string;
  accentColor: string;
  innerEarColor: string;
}

export const ANIMALS: AnimalMeta[] = [
  {
    id: "cat",
    name: "Sky Cat",
    emoji: "🐱",
    themeColor: "#38bdf8",
    accentColor: "#0284c7",
    innerEarColor: "#bae6fd",
  },
  {
    id: "panda",
    name: "Cyber Panda",
    emoji: "🐼",
    themeColor: "#7dd3fc",
    accentColor: "#0369a1",
    innerEarColor: "#e0f2fe",
  },
  {
    id: "fox",
    name: "Cloud Fox",
    emoji: "🦊",
    themeColor: "#38bdf8",
    accentColor: "#0284c7",
    innerEarColor: "#bae6fd",
  },
  {
    id: "dog",
    name: "Sky Pup",
    emoji: "🐶",
    themeColor: "#38bdf8",
    accentColor: "#0369a1",
    innerEarColor: "#e0f2fe",
  },
  {
    id: "bunny",
    name: "Star Bunny",
    emoji: "🐰",
    themeColor: "#7dd3fc",
    accentColor: "#0284c7",
    innerEarColor: "#bae6fd",
  },
];

export default function AnimalQrCanvas({
  text,
  onDataUrlChange,
  className = "",
}: AnimalQrCanvasProps) {
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalType>("cat");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawAnimalQr = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Use 2x scaling for high DPI retina rendering
    const W = 640;
    const H = 720;
    canvas.width = W;
    canvas.height = H;

    // Clear
    ctx.clearRect(0, 0, W, H);

    // Current animal config
    const animal = ANIMALS.find((a) => a.id === selectedAnimal) || ANIMALS[0];

    // Background gradient - soft atmospheric sky glass
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, "#081b33");
    bgGrad.addColorStop(1, "#030c17");

    // Outer card container
    const cardX = 30;
    const cardY = 90;
    const cardW = W - 60;
    const cardH = H - 110;
    const cardRadius = 36;

    // 1. Draw Animal Ears (positioned above card)
    ctx.save();
    if (selectedAnimal === "cat") {
      // Left ear
      ctx.beginPath();
      ctx.moveTo(cardX + 45, cardY + 25);
      ctx.lineTo(cardX + 85, cardY - 65);
      ctx.lineTo(cardX + 155, cardY + 5);
      ctx.closePath();
      ctx.fillStyle = animal.accentColor;
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = animal.themeColor;
      ctx.stroke();

      // Inner left ear
      ctx.beginPath();
      ctx.moveTo(cardX + 60, cardY + 15);
      ctx.lineTo(cardX + 88, cardY - 45);
      ctx.lineTo(cardX + 135, cardY + 5);
      ctx.closePath();
      ctx.fillStyle = animal.innerEarColor;
      ctx.fill();

      // Right ear
      ctx.beginPath();
      ctx.moveTo(cardX + cardW - 155, cardY + 5);
      ctx.lineTo(cardX + cardW - 85, cardY - 65);
      ctx.lineTo(cardX + cardW - 45, cardY + 25);
      ctx.closePath();
      ctx.fillStyle = animal.accentColor;
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = animal.themeColor;
      ctx.stroke();

      // Inner right ear
      ctx.beginPath();
      ctx.moveTo(cardX + cardW - 135, cardY + 5);
      ctx.lineTo(cardX + cardW - 88, cardY - 45);
      ctx.lineTo(cardX + cardW - 60, cardY + 15);
      ctx.closePath();
      ctx.fillStyle = animal.innerEarColor;
      ctx.fill();
    } else if (selectedAnimal === "panda") {
      // Panda round left ear
      ctx.beginPath();
      ctx.arc(cardX + 105, cardY - 15, 52, 0, Math.PI * 2);
      ctx.fillStyle = "#0c1a2e";
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = animal.themeColor;
      ctx.stroke();

      // Inner left
      ctx.beginPath();
      ctx.arc(cardX + 105, cardY - 15, 30, 0, Math.PI * 2);
      ctx.fillStyle = animal.innerEarColor;
      ctx.fill();

      // Panda round right ear
      ctx.beginPath();
      ctx.arc(cardX + cardW - 105, cardY - 15, 52, 0, Math.PI * 2);
      ctx.fillStyle = "#0c1a2e";
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = animal.themeColor;
      ctx.stroke();

      // Inner right
      ctx.beginPath();
      ctx.arc(cardX + cardW - 105, cardY - 15, 30, 0, Math.PI * 2);
      ctx.fillStyle = animal.innerEarColor;
      ctx.fill();
    } else if (selectedAnimal === "fox") {
      // Fox pointy tall ears
      // Left ear
      ctx.beginPath();
      ctx.moveTo(cardX + 40, cardY + 30);
      ctx.lineTo(cardX + 80, cardY - 80);
      ctx.lineTo(cardX + 165, cardY);
      ctx.closePath();
      ctx.fillStyle = "#0284c7";
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = animal.themeColor;
      ctx.stroke();

      // Inner fluff
      ctx.beginPath();
      ctx.moveTo(cardX + 60, cardY + 20);
      ctx.lineTo(cardX + 84, cardY - 55);
      ctx.lineTo(cardX + 145, cardY - 5);
      ctx.closePath();
      ctx.fillStyle = "#f0f9ff";
      ctx.fill();

      // Right ear
      ctx.beginPath();
      ctx.moveTo(cardX + cardW - 165, cardY);
      ctx.lineTo(cardX + cardW - 80, cardY - 80);
      ctx.lineTo(cardX + cardW - 40, cardY + 30);
      ctx.closePath();
      ctx.fillStyle = "#0284c7";
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = animal.themeColor;
      ctx.stroke();

      // Inner fluff right
      ctx.beginPath();
      ctx.moveTo(cardX + cardW - 145, cardY - 5);
      ctx.lineTo(cardX + cardW - 84, cardY - 55);
      ctx.lineTo(cardX + cardW - 60, cardY + 20);
      ctx.closePath();
      ctx.fillStyle = "#f0f9ff";
      ctx.fill();
    } else if (selectedAnimal === "dog") {
      // Puppy floppy ears droop down the sides
      // Left ear
      ctx.beginPath();
      ctx.ellipse(cardX + 35, cardY + 80, 48, 85, -Math.PI / 8, 0, Math.PI * 2);
      ctx.fillStyle = animal.accentColor;
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.strokeStyle = animal.themeColor;
      ctx.stroke();

      // Right ear
      ctx.beginPath();
      ctx.ellipse(cardX + cardW - 35, cardY + 80, 48, 85, Math.PI / 8, 0, Math.PI * 2);
      ctx.fillStyle = animal.accentColor;
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.strokeStyle = animal.themeColor;
      ctx.stroke();
    } else if (selectedAnimal === "bunny") {
      // Bunny tall ears
      // Left ear
      ctx.beginPath();
      ctx.ellipse(cardX + 130, cardY - 45, 36, 85, -Math.PI / 24, 0, Math.PI * 2);
      ctx.fillStyle = animal.accentColor;
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = animal.themeColor;
      ctx.stroke();

      // Inner left
      ctx.beginPath();
      ctx.ellipse(cardX + 130, cardY - 45, 20, 65, -Math.PI / 24, 0, Math.PI * 2);
      ctx.fillStyle = animal.innerEarColor;
      ctx.fill();

      // Right ear
      ctx.beginPath();
      ctx.ellipse(cardX + cardW - 130, cardY - 45, 36, 85, Math.PI / 24, 0, Math.PI * 2);
      ctx.fillStyle = animal.accentColor;
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = animal.themeColor;
      ctx.stroke();

      // Inner right
      ctx.beginPath();
      ctx.ellipse(cardX + cardW - 130, cardY - 45, 20, 65, Math.PI / 24, 0, Math.PI * 2);
      ctx.fillStyle = animal.innerEarColor;
      ctx.fill();
    }
    ctx.restore();

    // 2. Draw Main Animal Card Body
    ctx.save();
    ctx.shadowColor = "rgba(56, 189, 248, 0.4)";
    ctx.shadowBlur = 32;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, cardRadius);
    ctx.fillStyle = bgGrad;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = animal.themeColor;
    ctx.stroke();
    ctx.restore();

    // 3. Draw Side Whiskers (for Cat & Fox)
    if (selectedAnimal === "cat" || selectedAnimal === "fox") {
      ctx.save();
      ctx.strokeStyle = "rgba(56, 189, 248, 0.6)";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";

      // Left whiskers
      [-18, 0, 18].forEach((offset) => {
        ctx.beginPath();
        ctx.moveTo(cardX - 5, cardY + 180 + offset);
        ctx.lineTo(cardX - 45, cardY + 175 + offset * 1.5);
        ctx.stroke();
      });

      // Right whiskers
      [-18, 0, 18].forEach((offset) => {
        ctx.beginPath();
        ctx.moveTo(cardX + cardW + 5, cardY + 180 + offset);
        ctx.lineTo(cardX + cardW + 45, cardY + 175 + offset * 1.5);
        ctx.stroke();
      });
      ctx.restore();
    }

    // 4. White / Light Sky Canvas Plate for QR Matrix
    const qrPad = 42;
    const qrSize = cardW - qrPad * 2;
    const qrX = cardX + qrPad;
    const qrY = cardY + 45;

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(qrX, qrY, qrSize, qrSize, 24);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
    ctx.stroke();
    ctx.restore();

    // 5. Generate and Draw QR Matrix
    try {
      const qrData = QRCode.create(text, { errorCorrectionLevel: "H" });
      const modules = qrData.modules;
      const modCount = modules.size;
      const modMargin = 16;
      const activeQrSize = qrSize - modMargin * 2;
      const modSize = activeQrSize / modCount;

      const originX = qrX + modMargin;
      const originY = qrY + modMargin;

      const centerMod = Math.floor(modCount / 2);
      // Safe radius for center animal emblem (in modules)
      const centerKeepout = 4;

      ctx.save();
      for (let r = 0; r < modCount; r++) {
        for (let c = 0; c < modCount; c++) {
          if (!modules.get(c, r)) continue;

          // Don't draw modules in the dead center circle area to keep the mascot emblem clean
          const distCenter = Math.hypot(c - centerMod, r - centerMod);
          if (distCenter <= centerKeepout + 0.5) {
            continue;
          }

          const px = originX + c * modSize;
          const py = originY + r * modSize;

          // Check if this module belongs to one of the 3 large finder patterns (corners)
          const isTopLeftFinder = r < 7 && c < 7;
          const isTopRightFinder = r < 7 && c >= modCount - 7;
          const isBottomLeftFinder = r >= modCount - 7 && c < 7;

          if (isTopLeftFinder || isTopRightFinder || isBottomLeftFinder) {
            // Stylized sky blue eye finder corners
            ctx.fillStyle = "#0284c7";
            ctx.beginPath();
            ctx.roundRect(px, py, modSize, modSize, modSize * 0.35);
            ctx.fill();
          } else {
            // Deep sky-navy body dots
            ctx.fillStyle = "#0a1e38";
            ctx.beginPath();
            ctx.arc(px + modSize / 2, py + modSize / 2, modSize * 0.42, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      ctx.restore();

      // 6. Draw Center Mascot Emblem Badge
      const emblemCenterX = qrX + qrSize / 2;
      const emblemCenterY = qrY + qrSize / 2;
      const emblemRadius = modSize * (centerKeepout + 0.8);

      ctx.save();
      // Outer glow & circle
      ctx.shadowColor = "rgba(56, 189, 248, 0.5)";
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(emblemCenterX, emblemCenterY, emblemRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = animal.themeColor;
      ctx.stroke();
      ctx.restore();

      // Draw mascot vector face in center
      drawMascotFace(ctx, emblemCenterX, emblemCenterY, emblemRadius, selectedAnimal);

      // 7. Animal Paws at the bottom of the card holding the QR plate
      drawPaws(ctx, cardX, cardY, cardW, cardH, qrY + qrSize, animal);

      // 8. Card Footer Label: Animal Name & Security Stamp
      ctx.save();
      ctx.fillStyle = "#94a3b8";
      ctx.font = "600 17px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(
        `🛡️ SECURE QR • ${animal.name.toUpperCase()}`,
        W / 2,
        cardY + cardH - 24
      );
      ctx.restore();

      // Notify parent of updated data URL
      if (onDataUrlChange) {
        onDataUrlChange(canvas.toDataURL("image/png"));
      }
    } catch (err) {
      console.error("Failed to draw animal QR:", err);
    }
  }, [text, selectedAnimal, onDataUrlChange]);

  useEffect(() => {
    drawAnimalQr();
  }, [drawAnimalQr]);

  return (
    <div className={`animal-qr-wrapper ${className}`}>
      {/* Animal Selector Tabs */}
      <div className="animal-selector" role="tablist" aria-label="Select Animal Form">
        <span className="animal-selector-title">Animal Form:</span>
        <div className="animal-tabs">
          {ANIMALS.map((a) => (
            <button
              key={a.id}
              type="button"
              className={`animal-tab ${selectedAnimal === a.id ? "animal-tab--active" : ""}`}
              onClick={() => setSelectedAnimal(a.id)}
              id={`animal-tab-${a.id}`}
            >
              <span className="animal-tab-emoji">{a.emoji}</span>
              <span className="animal-tab-name">{a.name.split(" ")[1] || a.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Rendered Animal Canvas */}
      <div className="animal-canvas-container">
        <canvas
          ref={canvasRef}
          className="animal-canvas"
          id="animal-qr-canvas"
          style={{ width: "100%", maxWidth: "340px", height: "auto" }}
        />
        <div className="animal-canvas-glow" />
      </div>
    </div>
  );
}

/**
 * Draw cute vector animal face inside the center emblem
 */
function drawMascotFace(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  type: AnimalType
) {
  ctx.save();

  if (type === "cat") {
    // Cat eyes
    ctx.fillStyle = "#0284c7";
    ctx.beginPath();
    ctx.ellipse(cx - 16, cy - 6, 5, 8, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + 16, cy - 6, 5, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eye highlights
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(cx - 15, cy - 9, 2.5, 0, Math.PI * 2);
    ctx.arc(cx + 17, cy - 9, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.moveTo(cx - 6, cy + 4);
    ctx.lineTo(cx + 6, cy + 4);
    ctx.lineTo(cx, cy + 10);
    ctx.closePath();
    ctx.fill();

    // Mouth
    ctx.strokeStyle = "#0284c7";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(cx - 5, cy + 13, 6, Math.PI * 0.1, Math.PI * 0.9);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + 5, cy + 13, 6, Math.PI * 0.1, Math.PI * 0.9);
    ctx.stroke();

    // Cheeks
    ctx.fillStyle = "rgba(56, 189, 248, 0.35)";
    ctx.beginPath();
    ctx.ellipse(cx - 24, cy + 8, 7, 4, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + 24, cy + 8, 7, 4, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === "panda") {
    // Panda dark eye patches
    ctx.fillStyle = "#0c1a2e";
    ctx.beginPath();
    ctx.ellipse(cx - 17, cy - 5, 12, 10, -Math.PI / 8, 0, Math.PI * 2);
    ctx.ellipse(cx + 17, cy - 5, 12, 10, Math.PI / 8, 0, Math.PI * 2);
    ctx.fill();

    // White eyes
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(cx - 16, cy - 6, 4, 0, Math.PI * 2);
    ctx.arc(cx + 16, cy - 6, 4, 0, Math.PI * 2);
    ctx.fill();

    // Pupils
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.arc(cx - 15, cy - 6, 2.5, 0, Math.PI * 2);
    ctx.arc(cx + 17, cy - 6, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = "#0c1a2e";
    ctx.beginPath();
    ctx.ellipse(cx, cy + 8, 7, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Mouth
    ctx.strokeStyle = "#0c1a2e";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx - 4, cy + 14, 5, 0, Math.PI * 0.85);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + 4, cy + 14, 5, Math.PI * 0.15, Math.PI);
    ctx.stroke();
  } else if (type === "fox") {
    // Fox eyes
    ctx.fillStyle = "#0369a1";
    ctx.beginPath();
    ctx.ellipse(cx - 17, cy - 6, 6, 4, -Math.PI / 10, 0, Math.PI * 2);
    ctx.ellipse(cx + 17, cy - 6, 6, 4, Math.PI / 10, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = "#0284c7";
    ctx.beginPath();
    ctx.arc(cx, cy + 8, 5, 0, Math.PI * 2);
    ctx.fill();

    // Snout lines
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy + 13);
    ctx.lineTo(cx, cy + 18);
    ctx.stroke();

    // Cheeks
    ctx.fillStyle = "rgba(56, 189, 248, 0.4)";
    ctx.beginPath();
    ctx.arc(cx - 25, cy + 6, 6, 0, Math.PI * 2);
    ctx.arc(cx + 25, cy + 6, 6, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === "dog") {
    // Puppy eyes
    ctx.fillStyle = "#0369a1";
    ctx.beginPath();
    ctx.arc(cx - 16, cy - 6, 6, 0, Math.PI * 2);
    ctx.arc(cx + 16, cy - 6, 6, 0, Math.PI * 2);
    ctx.fill();

    // Eye highlights
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(cx - 14, cy - 8, 2.5, 0, Math.PI * 2);
    ctx.arc(cx + 18, cy - 8, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = "#0284c7";
    ctx.beginPath();
    ctx.ellipse(cx, cy + 6, 8, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Happy tongue
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.arc(cx, cy + 16, 6, 0, Math.PI);
    ctx.fill();
  } else if (type === "bunny") {
    // Bunny eyes
    ctx.fillStyle = "#0284c7";
    ctx.beginPath();
    ctx.arc(cx - 15, cy - 6, 5, 0, Math.PI * 2);
    ctx.arc(cx + 15, cy - 6, 5, 0, Math.PI * 2);
    ctx.fill();

    // Eye highlight
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(cx - 13, cy - 8, 2, 0, Math.PI * 2);
    ctx.arc(cx + 17, cy - 8, 2, 0, Math.PI * 2);
    ctx.fill();

    // Cute nose
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.arc(cx, cy + 6, 4, 0, Math.PI * 2);
    ctx.fill();

    // Whiskers
    ctx.strokeStyle = "#7dd3fc";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 10, cy + 8);
    ctx.lineTo(cx - 30, cy + 6);
    ctx.moveTo(cx - 10, cy + 12);
    ctx.lineTo(cx - 28, cy + 14);
    ctx.moveTo(cx + 10, cy + 8);
    ctx.lineTo(cx + 30, cy + 6);
    ctx.moveTo(cx + 10, cy + 12);
    ctx.lineTo(cx + 28, cy + 14);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Draw animal paws gripping the QR plate
 */
function drawPaws(
  ctx: CanvasRenderingContext2D,
  cardX: number,
  cardY: number,
  cardW: number,
  cardH: number,
  plateBottomY: number,
  animal: AnimalMeta
) {
  const pawY = plateBottomY - 14;
  const leftPawX = cardX + 110;
  const rightPawX = cardX + cardW - 110;

  ctx.save();

  [leftPawX, rightPawX].forEach((px) => {
    // Main paw pad
    ctx.beginPath();
    ctx.ellipse(px, pawY + 8, 32, 22, 0, 0, Math.PI * 2);
    ctx.fillStyle = animal.accentColor;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = animal.themeColor;
    ctx.stroke();

    // 3 Cute paw toe beans
    ctx.fillStyle = animal.innerEarColor;
    [-18, 0, 18].forEach((toeOffset) => {
      ctx.beginPath();
      ctx.arc(px + toeOffset, pawY - 4, 8, 0, Math.PI * 2);
      ctx.fill();
    });

    // Center bottom bean
    ctx.beginPath();
    ctx.ellipse(px, pawY + 12, 14, 9, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}
