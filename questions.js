// 성인 애착유형 체크리스트 문항 데이터 (Sheet1 기반)
// A: 불안형 (Anxious), B: 안정형 (Secure), C: 회피형 (Avoidant)
const ATTACHMENT_QUESTIONS = [
  { id: 1, text: "파트너에게 더 이상 사랑받지 못할까봐 두렵다.", category: "A" },
  { id: 2, text: "파트너에게 쉽게 애정을 갖는다.", category: "B" },
  { id: 3, text: "파트너가 내 본 모습을 알게 되면 나를 좋아하지 않을까 봐 두렵다.", category: "A" },
  { id: 4, text: "이별 후 회복이 빠르다. 누구든 쉽게 잊을 수 있는 자신이 신기할 정도이다.", category: "C" },
  { id: 5, text: "파트너가 없으면 내가 불안하고 불완전한 사람처럼 느껴진다.", category: "A" },
  { id: 6, text: "기분이 저조한 파트너를 격려하는 일은 힘들다.", category: "C" },
  { id: 7, text: "떨어져 있는 동안 파트너가 다른 사람에게 관심이 생길까 봐 두렵다.", category: "A" },
  { id: 8, text: "파트너에게 의지하는 것이 편하다.", category: "B" },
  { id: 9, text: "관계보다 독립성이 더 중요하다.", category: "C" },
  { id: 10, text: "깊은 속내까지 파트너에게 털어놓기는 싫다.", category: "C" },
  { id: 11, text: "파트너에게 내 감정을 드러냈을 때 파트너가 나와 같은 감정이 아닐까 봐 두렵다.", category: "A" },
  { id: 12, text: "파트너와의 관계에 대체로 만족한다.", category: "B" },
  { id: 13, text: "연인 관계에 특별한 연출이 필요하다고 생각하지 않는다.", category: "B" },
  { id: 14, text: "관계에 대해 생각을 많이 한다.", category: "A" },
  { id: 15, text: "파트너에게 의지하는 것이 불편하다.", category: "C" },
  { id: 16, text: "파트너에게 금방 애착을 갖는 편이다.", category: "A" },
  { id: 17, text: "별 어려움 없이 나의 욕구나 욕망을 파트너에게 표현할 수 있다.", category: "B" },
  { id: 18, text: "가끔 이유 없이 파트너에게 화나 짜증이 날 때가 있다.", category: "C" },
  { id: 19, text: "파트너의 기분에 매우 민감하다.", category: "A" },
  { id: 20, text: "대부분의 사람들은 정직하고 신뢰할 만하다고 생각한다.", category: "B" },
  { id: 21, text: "늘 같은 사람과 하는 섹스보다는 낯선 사람과의 가벼운 섹스가 좋다.", category: "C" },
  { id: 22, text: "얼마든지 내 개인적인 생각을 파트너와 공유할 수 있다.", category: "B" },
  { id: 23, text: "지금의 파트너와 헤어지면 다른 사람을 만나지 못할까 봐 걱정된다.", category: "A" },
  { id: 24, text: "파트너와 너무 친밀해지면 불안하다.", category: "C" },
  { id: 25, text: "싸울 때는 논리보다 감정에 치우쳐 나중에 후회할 말이나 행동을 하는 편이다.", category: "A" },
  { id: 26, text: "싸웠다고 해서 파트너와의 관계에 회의를 품지는 않는다.", category: "B" },
  { id: 27, text: "부모님은 종종 나에게 불편할 정도의 친밀감을 기대하신다.", category: "C" },
  { id: 28, text: "내 매력이 부족할까봐 걱정이다.", category: "A" },
  { id: 29, text: "극적인 사건을 일으키지 않아 종종 지루한 사람처럼 보이기도 한다.", category: "B" },
  { id: 30, text: "떨어져 있을 때는 파트너가 보고 싶지만, 함께 있을 때는 벗어나고 싶다.", category: "C" },
  { id: 31, text: "상대방과 의견이 다를 때도 편하게 이야기할 수 있다.", category: "B" },
  { id: 32, text: "누군가가 내게 의지하고 있다는 느낌이 너무 싫다.", category: "C" },
  { id: 33, text: "좋아하는 사람이 다른 사람에게 관심을 보여도 당황하지 않는다. 질투가 생겨도 잠깐이다.", category: "B" },
  { id: 34, text: "좋아하는 사람이 다른 사람에게 관심을 보이면 오히려 안심이 된다. 나에게 자기 말고 다른 사람은 만나지 말라고 하지 않을 것이기 때문이다.", category: "C" },
  { id: 35, text: "좋아하는 사람이 다른 사람에게 관심을 보이면 우울해진다.", category: "A" },
  { id: 36, text: "파트너가 차가운 태도로 나를 멀리하기 시작하면 왜 그러는지 궁금해지지만 나 때문은 아닐 것이라고 생각한다.", category: "B" },
  { id: 37, text: "파트너가 차가운 태도로 나를 멀리하기 시작해도 상관없다. 오히려 안심이 된다.", category: "C" },
  { id: 38, text: "파트너가 차가운 태도로 나를 멀리하기 시작하면 내 잘못 때문일까 봐 걱정된다.", category: "A" },
  { id: 39, text: "파트너가 나와 헤어지려고 하면 나는 최선을 다해 그가 놓치게 될 것을 상기시켜줄 것이다.", category: "A" },
  { id: 40, text: "몇 달동안 사귀었던 사람이 그만 만나자고 하면 처음에는 상처받겠지만 곧 괜찮아질 것이다.", category: "B" },
  { id: 41, text: "연인 관계에서 원했던 것을 얻고 나면 더 이상 원했던 것이 무엇인지도 모르겠다.", category: "C" },
  { id: 42, text: "옛 연인과 (철저히 플라토닉하게) 계속 연락을 주고 받아도 불편하지 않다. 아직도 우리 사이에는 공통점이 많다.", category: "B" }
];

// Sheet2 등급 체계 기준 (0~4: 낮음, 5~9: 보통, 10~14: 높음)
const SCORE_LEVELS = [
  { min: 0, max: 4, level: "낮음", badgeClass: "level-low" },
  { min: 5, max: 9, level: "보통", badgeClass: "level-medium" },
  { min: 10, max: 14, level: "높음", badgeClass: "level-high" }
];

function getScoreLevel(score) {
  if (score <= 4) return { level: "낮음", badgeClass: "level-low" };
  if (score <= 9) return { level: "보통", badgeClass: "level-medium" };
  return { level: "높음", badgeClass: "level-high" };
}
