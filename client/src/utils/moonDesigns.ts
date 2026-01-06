/**
 * Moon Design Utilities
 * 8가지 캔버스 기반 달 디자인을 렌더링하는 함수들
 */

export type MoonDesignType = 
  | "full-bright" 
  | "full-dark" 
  | "crescent-light" 
  | "crescent-dark" 
  | "gibbous-light" 
  | "gibbous-dark" 
  | "half-light" 
  | "half-dark";

export const MOON_DESIGNS: MoonDesignType[] = [
  "full-bright",
  "full-dark",
  "crescent-light",
  "crescent-dark",
  "gibbous-light",
  "gibbous-dark",
  "half-light",
  "half-dark",
];

export const MOON_DESIGN_LABELS: Record<MoonDesignType, string> = {
  "full-bright": "보름달 (밝음)",
  "full-dark": "보름달 (어두움)",
  "crescent-light": "초승달 (밝음)",
  "crescent-dark": "초승달 (어두움)",
  "gibbous-light": "상현달 (밝음)",
  "gibbous-dark": "상현달 (어두움)",
  "half-light": "반달 (밝음)",
  "half-dark": "반달 (어두움)",
};

/**
 * 캔버스에 달을 그리는 함수
 */
export function drawMoon(
  ctx: CanvasRenderingContext2D,
  size: number,
  design: MoonDesignType
) {
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2.2;

  // 배경 (투명)
  ctx.clearRect(0, 0, size, size);

  // 달 기본 원
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);

  // 디자인별 색상 및 효과
  switch (design) {
    case "full-bright":
      ctx.fillStyle = "rgba(255, 250, 200, 0.95)";
      ctx.fill();
      // 밝은 글로우
      ctx.strokeStyle = "rgba(255, 255, 150, 0.6)";
      ctx.lineWidth = 2;
      ctx.stroke();
      // 크레이터 표현
      drawCraters(ctx, centerX, centerY, radius, "rgba(200, 180, 100, 0.3)");
      break;

    case "full-dark":
      ctx.fillStyle = "rgba(100, 90, 70, 0.9)";
      ctx.fill();
      // 어두운 테두리
      ctx.strokeStyle = "rgba(50, 40, 30, 0.8)";
      ctx.lineWidth = 2;
      ctx.stroke();
      // 크레이터 표현
      drawCraters(ctx, centerX, centerY, radius, "rgba(50, 40, 30, 0.5)");
      break;

    case "crescent-light":
      ctx.fillStyle = "rgba(255, 250, 200, 0.95)";
      ctx.fill();
      // 초승달 음영 (오른쪽에서 빛)
      ctx.fillStyle = "rgba(30, 20, 10, 0.7)";
      ctx.beginPath();
      ctx.arc(centerX + radius * 0.4, centerY, radius * 0.8, 0, Math.PI * 2);
      ctx.fill();
      break;

    case "crescent-dark":
      ctx.fillStyle = "rgba(100, 90, 70, 0.9)";
      ctx.fill();
      // 초승달 음영
      ctx.fillStyle = "rgba(10, 5, 0, 0.8)";
      ctx.beginPath();
      ctx.arc(centerX + radius * 0.4, centerY, radius * 0.8, 0, Math.PI * 2);
      ctx.fill();
      break;

    case "gibbous-light":
      ctx.fillStyle = "rgba(255, 250, 200, 0.95)";
      ctx.fill();
      // 상현달 음영 (왼쪽에서 빛)
      ctx.fillStyle = "rgba(30, 20, 10, 0.5)";
      ctx.beginPath();
      ctx.arc(centerX - radius * 0.3, centerY, radius * 0.6, 0, Math.PI * 2);
      ctx.fill();
      break;

    case "gibbous-dark":
      ctx.fillStyle = "rgba(100, 90, 70, 0.9)";
      ctx.fill();
      // 상현달 음영
      ctx.fillStyle = "rgba(10, 5, 0, 0.7)";
      ctx.beginPath();
      ctx.arc(centerX - radius * 0.3, centerY, radius * 0.6, 0, Math.PI * 2);
      ctx.fill();
      break;

    case "half-light":
      ctx.fillStyle = "rgba(255, 250, 200, 0.95)";
      ctx.fill();
      // 반달 음영 (왼쪽)
      ctx.fillStyle = "rgba(30, 20, 10, 0.8)";
      ctx.beginPath();
      ctx.arc(centerX - radius * 0.5, centerY, radius, 0, Math.PI * 2);
      ctx.fill();
      break;

    case "half-dark":
      ctx.fillStyle = "rgba(100, 90, 70, 0.9)";
      ctx.fill();
      // 반달 음영
      ctx.fillStyle = "rgba(10, 5, 0, 0.9)";
      ctx.beginPath();
      ctx.arc(centerX - radius * 0.5, centerY, radius, 0, Math.PI * 2);
      ctx.fill();
      break;
  }

  // 외곽 테두리
  ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.stroke();
}

/**
 * 달 표면의 크레이터를 그리는 함수
 */
function drawCraters(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  color: string
) {
  ctx.fillStyle = color;

  // 무작위 크레이터 (시드 기반으로 일관성 유지)
  const craters = [
    { x: 0.3, y: 0.2, r: 0.08 },
    { x: 0.6, y: 0.4, r: 0.06 },
    { x: 0.4, y: 0.7, r: 0.07 },
    { x: 0.7, y: 0.6, r: 0.05 },
    { x: 0.2, y: 0.5, r: 0.06 },
  ];

  craters.forEach((crater) => {
    ctx.beginPath();
    ctx.arc(
      centerX + (crater.x - 0.5) * radius * 1.8,
      centerY + (crater.y - 0.5) * radius * 1.8,
      crater.r * radius,
      0,
      Math.PI * 2
    );
    ctx.fill();
  });
}
