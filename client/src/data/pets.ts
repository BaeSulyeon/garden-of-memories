import { Pet } from "@/types/pet";

export const samplePets: Pet[] = [
  {
    id: 1,
    name: "별이",
    species: "고양이",
    age: "12살",
    favoriteFood: "참치 캔",
    story:
      "별이는 항상 창가에 앉아 밤하늘을 바라보는 것을 좋아했어요. 조용하고 우아한 모습으로 우리 가족에게 평온함을 선물해주었습니다. 이제 별이는 진짜 별이 되어 밤하늘에서 우리를 지켜보고 있을 거예요.",
    dateOfPassing: "2024.11.15",
    moonType: "full",
    moonDesign: "moon-1", // 푸른 달
    position: { x: 25, y: 30 },
    size: "large",
  },
  {
    id: 2,
    name: "초코",
    species: "강아지",
    age: "8살",
    favoriteFood: "고구마",
    story:
      "초코는 언제나 꼬리를 흔들며 우리를 반겨주던 사랑스러운 친구였어요. 산책을 좋아했고, 특히 가을 낙엽 위를 뛰어다니는 걸 정말 좋아했습니다. 초코의 따뜻한 눈빛을 영원히 기억할게요.",
    dateOfPassing: "2024.09.22",
    moonType: "crescent",
    moonDesign: "moon-2", // 회색 달
    position: { x: 65, y: 25 },
    size: "medium",
  },
  {
    id: 3,
    name: "구름",
    species: "토끼",
    age: "5살",
    favoriteFood: "당근",
    story:
      "구름이는 이름처럼 하얗고 폭신폭신한 털을 가진 토끼였어요. 조용히 다가와 코를 킁킁거리며 애정을 표현하던 모습이 그립습니다. 이제 하늘의 구름이 되어 자유롭게 뛰어놀고 있을 거예요.",
    dateOfPassing: "2025.01.03",
    moonType: "gibbous",
    moonDesign: "moon-3", // 황금 달
    position: { x: 45, y: 45 },
    size: "small",
  },
  {
    id: 4,
    name: "달님",
    species: "고양이",
    age: "15살",
    favoriteFood: "연어",
    story:
      "달님은 우리 가족과 가장 오랜 시간을 함께한 소중한 친구였어요. 나이가 들어서도 여전히 장난기 가득한 모습을 보여주었고, 밤마다 내 곁에서 잠들곤 했습니다. 달님, 사랑해요.",
    dateOfPassing: "2024.12.10",
    moonType: "full",
    moonDesign: "moon-4", // 어두운 달
    position: { x: 80, y: 50 },
    size: "medium",
  },
  {
    id: 5,
    name: "봄이",
    species: "강아지",
    age: "6살",
    favoriteFood: "치즈",
    story:
      "봄이는 봄날처럼 따뜻하고 밝은 에너지를 가진 강아지였어요. 항상 웃는 얼굴로 우리를 맞이해주었고, 공놀이를 정말 좋아했습니다. 봄이가 남긴 행복한 기억들을 소중히 간직할게요.",
    dateOfPassing: "2024.08.18",
    moonType: "crescent",
    moonDesign: "moon-5", // 보라 달
    position: { x: 15, y: 60 },
    size: "small",
  },
  {
    id: 6,
    name: "하늘",
    species: "앵무새",
    age: "10살",
    favoriteFood: "해바라기씨",
    story:
      "하늘이는 아름다운 깃털과 맑은 목소리로 우리 집을 밝혀주었어요. '사랑해'라는 말을 따라하며 우리를 웃게 만들었던 하늘이. 이제 진짜 하늘을 자유롭게 날아다니고 있을 거예요.",
    dateOfPassing: "2024.10.05",
    moonType: "gibbous",
    moonDesign: "moon-6", // 파란 달
    position: { x: 55, y: 70 },
    size: "small",
  },
];
