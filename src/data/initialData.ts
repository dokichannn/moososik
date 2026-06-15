/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArchiveItem, FooterConfig } from '../types';

export const initialArchiveItems: ArchiveItem[] = [
  {
    id: 'v1',
    category: 'Visual',
    title: 'Poster Design 2026',
    year: '2026',
    summary: 'A study on silent typography and structural grid tension.',
    createdAt: '2026-06-01T10:00:00Z',
    type: 'Poster',
    imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=85',
    artist: 'Design Archive In-house',
    keywords: ['Swiss Style', 'Typography', 'Minimalism', 'Contrast'],
    tools: ['Illustrator', 'InDesign', 'Photoshop'],
    images: [
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=85'
    ],
    description: '이 포스터 시리즈는 침묵 속의 강렬한 레이아웃을 표현하기 위해 여백과 그리드 스케일을 극단적으로 대조시켰습니다. 아주 거대한 단어와 거의 보이지 않는 서술문의 공존은 지각적 감각을 날카롭게 환기시킵니다.'
  },
  {
    id: 'v2',
    category: 'Visual',
    title: 'Branding to Organize Senses',
    year: '2025',
    summary: 'Visual system for a quiet tea room and sensory sanctuary.',
    createdAt: '2025-11-15T08:30:00Z',
    type: 'Branding',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
    artist: 'Mu-Heum Tea Room (무흠다실)',
    keywords: ['Branding', 'Identity', 'Warm Minimalism', 'Sensory'],
    tools: ['Figma', 'Illustrator', 'Paper Selection'],
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=85'
    ],
    description: '소음에서 벗어나 향과 미각에 집중하는 고요한 다원 무흠(無흠)의 브랜딩 아이덴티티입니다. 안개가 자욱한 새벽 숲의 따뜻함과 차분한 회녹색을 시그니처 컬러로 삼아 오감을 편안하게 다듬는 그래픽 시스템을 조율했습니다.'
  },
  {
    id: 'v3',
    category: 'Visual',
    title: 'Editorial Layout System',
    year: '2025',
    summary: 'A standard editorial layout referencing classical Swiss grid principles.',
    createdAt: '2025-09-10T14:22:00Z',
    type: 'Editorial',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85',
    artist: 'Monthly Typography',
    keywords: ['Swiss Grid', 'Book Design', 'Aesthetic Alignment', 'Spacing'],
    tools: ['InDesign', 'Glyphs'],
    images: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=85'
    ],
    description: '텍스트가 가진 서사적 비중과 미세 정렬의 상관관계를 조립했습니다. 서체의 비례와 자간, 줄 바꿈의 흐름을 억제함으로써 정보 전달을 넘어 지면 전체가 하나의 깊은 정취를 표현하는 그리드 아트를 연출했습니다.'
  },
  {
    id: 't1',
    category: 'Texts',
    title: '디자인은 왜 여백을 필요로 하는가',
    year: '2026',
    summary: '여백은 물리적 비어있음이 아닌, 사유가 지나갈 길을 터주는 설계다.',
    createdAt: '2026-06-05T11:45:00Z',
    previewImageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
    author: 'MOOSOSIK',
    content: `우리는 채워지지 않은 공간을 대할 때 본능적인 불안을 느낀다. 빈 캔버스, 빈 종이, 빈 화면마저 무언가로 빠르게 가득 메우기를 강요받는 오늘날의 타임라인 속에서 여백은 일종의 사치이자 낭비로 통하기도 한다.

하지만 정제된 디자인에서 여백은 비어 있는 것(Empty)이 아니라 가득 채운 침묵(Silent Tension)과 같다. 여백은 단순히 대상과 대상 사이를 떼어 놓는 빈틈이 아닌, 관람자가 비로소 대상의 본질적인 윤곽을 똑바로 응시하고 느낄 수 있도록 돕는 감각의 완충 장치다.

이탈리아 작가 루치오 폰타나(Lucio Fontana)가 날카롭게 찢어발긴 캔버스를 통해 빈 공간에 가치를 구여했듯, 잡지 편집 디자인에서 행간과 서체 주변부의 면적이 기하학적으로 배치될 때 독자의 호흡 또한 깊어진다. 비움으로써 비로소 정보가 흐르고 사유가 들어설 여지가 생기는 것, 그것이 여백이 존재하는 실천적 이유다.`
  },
  {
    id: 't2',
    category: 'Texts',
    title: '브랜딩은 취향을 설계하는 일이다',
    year: '2026',
    summary: '브랜드는 한 사람의 마음 깊숙이 스며드는 취향의 집합적 초상이다.',
    createdAt: '2026-04-12T16:10:00Z',
    previewImageUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=400&q=80',
    author: 'MOOSOSIK',
    content: `유행은 빠르게 확산되며 순식간에 소비되고 증발하지만, 취향은 오랜 습관과 기질의 우연하고도 긴밀한 결합으로 굳어진 화석과 같다. 좋은 브랜딩은 사람들에게 유행을 유도하지 않는다. 오히려 그들이 이미 내밀하게 품고 있던 미적 호기심과 가치 지향점을 가만히 일깨우는 섬세한 조형 작업이다.

예를 들어 문구 브랜드를 떠올릴 때, 제품의 가격이나 스펙보다도 "서걱거리는 연필 소리", "종이 상자가 차곡차곡 쌓인 나무 스튜디오의 향"을 동경하게 되는 것은 극도로 정제된 취향의 연쇄적 설계 때문이다.

물건은 팔릴 때 소모되고 끝나지만, 취향으로 새겨진 브랜드는 그가 앉는 의자, 읽는 소설, 마시는 차, 즐기는 소음에 스며 들어 마침내 그의 라이프스타일을 함께 그리는 예술이 된다. 고유한 안목을 키우고, 그것을 기하학적 형태나 로고 따위에 진직하게 수프해내는 일이야말로 디자이너가 세상을 설계하는 가장 아름다운 방식이다.`
  },
  {
    id: 'o1',
    category: 'Object',
    title: 'Model 3107 Series 7 Chair',
    year: '2026',
    summary: 'Organic veneer structure curving space gracefully.',
    createdAt: '2026-05-24T09:12:00Z',
    brand: 'Fritz Hansen',
    designer: 'Arne Jacobsen',
    material: 'Pressure Molded Veneer, Chrome-plated steel',
    imageUrl: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=85',
    memo: '비례감과 유기적인 실루엣이 평면 공간의 공기를 완전히 정돈한다.',
    reasonArchived: '하나의 베니어 판을 가열하여 이처럼 극단적인 각도의 미려한 곡률을 조형해냈다는 기하학적인 디테일이 깊은 울림을 줍니다. 등받이의 시각적 긴장과 가벼운 다리 라인의 대조는 바우하우스 가구 계보의 정수를 느낄 수 있게 만듭니다.'
  },
  {
    id: 'o2',
    category: 'Object',
    title: 'Original 1227 Brass Desk Lamp',
    year: '2025',
    summary: 'Mechanical balance revealed with sincere structural simplicity.',
    createdAt: '2025-12-05T13:00:00Z',
    brand: 'Anglepoise',
    designer: 'George Carwardine',
    material: 'Aluminium shade and arms, Brass fittings, Cast iron base',
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=85',
    memo: '스프링과 도르래의 정직한 역학 작용이 그대로 노출된 순수 조형물.',
    reasonArchived: '디자인이란 무엇인가라는 질문에 언제든 무심코 지칭하게 되는 등불입니다. 인간관절의 움직임을 닮은 구조체로서, 숨김 없이 드러난 기하학적 지지대와 용융된 형태의 음영만으로도 기계미의 극치를 보이며 영감을 선사합니다.'
  },
  {
    id: 'o3',
    category: 'Object',
    title: 'Analog Mechanical Rangefinder M6',
    year: '2025',
    summary: 'Tactile reliance created by solid weight and perfect proportions.',
    createdAt: '2025-08-18T17:05:00Z',
    brand: 'Leica',
    designer: 'Heinrich Janke',
    material: 'Brass physical plates, Leather upholstery',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=85',
    memo: '정교한 촉각과 묵직한 무게감이 완성하는 아날로그 감각의 신뢰도.',
    reasonArchived: '이 기기에서 불필요하게 가미된 곡선이나 부품은 전혀 찾을 수 없습니다. 미려하게 사다리꼴로 떨어지는 바디 측면 라인, 매끄러운 셔터 버튼의 반발력은 훌륭한 관찰자의 정적인 도구가 되기 충족한 하드웨어적인 비율의 정수입니다.'
  },
  {
    id: 'f1',
    category: 'Films',
    title: 'All About Lily Chou-Chou',
    year: '2001',
    summary: 'Melancholic teenage frames wrapped in green fields and analog lens flare.',
    createdAt: '2026-05-10T11:00:00Z',
    director: 'Shunji Iwai (이와이 슌지)',
    actor: 'Hayato Ichihara, Shugo Oshinari, Ayumi Ito',
    imageUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1200&q=85',
    favoriteQuote: '그 속에 에테르가 있어요. 고독하지만, 영원히 잊을 수 없이 포근하고 푸르스름한 빛.',
    music: 'Takeshi Kobayashi (코바야시 타케시)의 숨막힐 듯 아름답고 우울한 드뷔시풍 피아노 선율과 몽환적인 보컬 트랙이 결합되어 영화 전체를 지배하는 푸른 에테르적 공감각을 자아냅니다.',
    reasonArchived: '사춘기의 처절한 소외와 찬란한 초록빛 들판의 서글픈 불균형을 시각적 레이어로 구축한 영화입니다. 2000년대 초반 초기 디지털 핸드헬드 카메라 고유의 가볍고 바스러지는 색조와 아날로그 역광의 미장센은 마음에 오래 도록 스칩니다.',
    relatedIds: ['t1', 'o3'],
    youtubeUrl: 'https://www.youtube.com/watch?v=F71tca8tqD0'
  },
  {
    id: 'f2',
    category: 'Films',
    title: 'Chungking Express',
    year: '1994',
    summary: 'Speed-printing aesthetics and primary lights painting a romantic night of Hong Kong.',
    createdAt: '2026-03-02T15:30:00Z',
    director: 'Wong Kar-wai (왕가위)',
    actor: 'Tony Leung, Faye Wong, Brigitte Lin, Takeshi Kaneshiro',
    imageUrl: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&w=1200&q=85',
    favoriteQuote: '내 기억이 통조림에 들어 있다면 유통기한이 삼만 년 정도였으면 좋겠다.',
    music: 'The Mamas & The Papas의 "California Dreamin\'"이 반복적으로 흐르며 좁고 비좁은 미드레벨 에스컬레이터 속에서 닿을 듯 말 듯 한 주인공들의 거리감을 기묘하고 아름답게 연결하는 공기를 디자인합니다.',
    reasonArchived: '네온사인이 비처럼 쏟아지는 도심을 어안 렌즈와 지연 촬영(Step Printing) 기법으로 흔들어 놓았습니다. 시간의 지루함을 공간 속 역동적인 리듬으로 편집해낸 독창적 감각은 프레임을 가공할 디자이너들에게 좋은 고취를 줍니다.',
    relatedIds: ['v1', 'o2'],
    youtubeUrl: 'https://www.youtube.com/watch?v=IAH-0GLvSxo'
  },
  {
    id: 'e1',
    category: 'Etc',
    title: 'The Bauhaus Archive Berlin Tour',
    year: '2026',
    summary: 'Encountering functional grids and geometry on physical concrete walls.',
    createdAt: '2026-05-30T10:44:00Z',
    subCategory: 'Exhibition',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=85',
    description: '규격화되고 직관적인 현대 디자인 사상의 고향, 바우하우스 아카이브를 순례했습니다. 기능이 형식을 결정하되, 조형의 비례만이 진정으로 대상을 완성한다는 것을 묵묵한 콘크리트 계단과 창문의 배율을 보고 깊게 수집했습니다.',
    gridSize: 'tall'
  },
  {
    id: 'e2',
    category: 'Etc',
    title: 'Brian Eno — Music For Airports',
    year: '2025',
    summary: 'Aural representation of negative space and calming intervals.',
    createdAt: '2025-10-20T16:00:00Z',
    subCategory: 'Music',
    imageUrl: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=85',
    description: '소리로 공간을 구획하고 긴장감을 완화하는 앰비언트 음악 장르의 서막입니다. 의식적으로 흘려듣다가 어느 순간 침묵과 화음의 대수적 비율에 전율하게 만드는 브라이언 이노의 음학적 설계는 디자이너가 레이아웃 여백을 그리는 태도와 정확히 등가입니다.',
    gridSize: 'wide'
  },
  {
    id: 'e3',
    category: 'Etc',
    title: 'Concrete Asymmetry & Light Studio',
    year: '2025',
    summary: 'Broken grid architecture creating random yet harmonious entry points.',
    createdAt: '2025-07-02T11:15:00Z',
    subCategory: 'Space',
    imageUrl: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=800&q=85',
    description: '스위스 모더니즘의 구조적 견고함을 의도적으로 어지럽힌 한 건축 스튜디오의 빛 구멍 설계입니다. 불규칙성 속에서도 시선은 고요하게 통제되어 일관된 리듬을 선사합니다.',
    gridSize: 'medium'
  }
];

export const initialFooterConfig: FooterConfig = {
  authorName: 'moososik.',
  email: 'moososikkk@gmail.com',
  instagram: 'moososik.mag',
  youtube: 'soon'
};
