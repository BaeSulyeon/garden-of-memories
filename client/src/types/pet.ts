export interface Pet {
  id: number;
  name: string;
  type?: string; // 강아지, 고양이 등
  gender?: string; // 수컷, 암컷
  species?: string;
  age?: number | string;
  favoriteFood?: string;
  story: string;
  photo?: string;
  profileImage?: string; // 대표 사진 URL
  description?: string; // 반려동물 설명
  dateOfPassing?: string;
  status?: "함께하는 중" | "영원한 인연";
  moonType?: "full" | "crescent" | "gibbous";
  moonDesign?: string; // 달 디자인 ID (moon-1 ~ moon-8)
  position?: {
    x: number; // percentage
    y: number; // percentage
  };
  size?: "small" | "medium" | "large";
}
