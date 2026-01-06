/**
 * 8가지 실제 달 사진 디자인
 * 각 디자인은 고유한 색상과 크레이터 패턴을 가지고 있습니다
 */

export interface MoonDesign {
  id: string;
  name: string;
  imagePath: string;
  description: string;
}

export const MOON_DESIGNS: MoonDesign[] = [
  {
    id: 'moon-1',
    name: '푸른 달',
    imagePath: '/images/moon-designs/c511662aa7a6f4fd6a1303309.png',
    description: '푸른 색감의 신비로운 달'
  },
  {
    id: 'moon-2',
    name: '회색 달',
    imagePath: '/images/moon-designs/다운로드파일_20260106_114552.png',
    description: '밝은 회색의 고전적인 달'
  },
  {
    id: 'moon-3',
    name: '황금 달',
    imagePath: '/images/moon-designs/다운로드파일_20260106_114546.png',
    description: '황금색의 따뜻한 달'
  },
  {
    id: 'moon-4',
    name: '어두운 달',
    imagePath: '/images/moon-designs/c511662aa7a6f19ba11973309.png',
    description: '어두운 갈색의 신비로운 달'
  },
  {
    id: 'moon-5',
    name: '보라 달',
    imagePath: '/images/moon-designs/153541351b02eb.png',
    description: '보라색의 부드러운 달'
  },
  {
    id: 'moon-6',
    name: '파란 달',
    imagePath: '/images/moon-designs/다운로드파일_20260106_114600.png',
    description: '파란색의 차가운 달'
  },
  {
    id: 'moon-7',
    name: '회색 크레이터 달',
    imagePath: '/images/moon-designs/다운로드파일_20260106_114537.png',
    description: '크레이터가 선명한 회색 달'
  },
  {
    id: 'moon-8',
    name: '베이지 달',
    imagePath: '/images/moon-designs/1767668562365.png',
    description: '따뜻한 베이지색의 달'
  }
];

export const getMoonDesignById = (id: string): MoonDesign | undefined => {
  return MOON_DESIGNS.find(design => design.id === id);
};

export const getMoonDesignByIndex = (index: number): MoonDesign | undefined => {
  return MOON_DESIGNS[index];
};
