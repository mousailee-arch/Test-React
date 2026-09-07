import { useState } from 'react'
import './App.css'

type PromptPart = 'persona' | 'goal' | 'task' | 'context' | 'output' | 'constraint' | 'example'
type Category = 'marketing' | 'system' | 'programming' | 'design'

const subcategories: Record<Category, Array<{ key: string; label: string }>> = {
  marketing: [
    { key: 'strategy', label: '마케팅 전략' },
    { key: 'content', label: '콘텐츠 마케팅' },
    { key: 'campaign', label: '광고·캠페인' },
    { key: 'market-analysis', label: '고객·시장 분석' },
    { key: 'brand', label: '브랜드 마케팅' },
  ],
  system: [
    { key: 'ai-planning', label: 'AI 시스템 기획' },
    { key: 'architecture', label: '시스템 아키텍처' },
    { key: 'pipeline', label: '데이터·AI 파이프라인' },
    { key: 'agent', label: 'AI Agent 시스템' },
    { key: 'operations', label: '시스템 운영·최적화' },
  ],
  programming: [
    { key: 'web', label: '웹 개발' },
    { key: 'app', label: '앱 개발' },
    { key: 'backend', label: '백엔드 개발' },
    { key: 'ml', label: 'AI·ML 개발' },
    { key: 'automation', label: '자동화·도구 개발' },
  ],
  design: [
    { key: 'ui', label: 'UI 디자인' },
    { key: 'ux', label: 'UX 디자인' },
    { key: 'brand-design', label: '브랜드 디자인' },
    { key: 'graphic', label: '그래픽·콘텐츠 디자인' },
    { key: 'product', label: '제품·서비스 디자인' },
  ],
}

const categories: Array<{ key: Category; label: string; description: string }> = [
  { key: 'marketing', label: '마케팅', description: '고객과 시장을 움직이는 콘텐츠' },
  { key: 'system', label: '시스템', description: '구조와 운영을 설계하는 문서' },
  { key: 'programming', label: '프로그래밍', description: '코드와 기술 문제를 해결' },
  { key: 'design', label: '디자인', description: '사용자 경험과 시각 언어' },
]

const categoryGuides: Record<Category, Record<PromptPart, string>> = {
  marketing: {
    persona: '브랜드와 고객을 이해하는 마케팅 전문가의 관점을 부여하세요.',
    goal: '고객 반응과 비즈니스 성과로 연결되는 목표를 구체화하세요.',
    task: '타깃, 채널, 핵심 메시지를 고려해 실행 가능한 결과물을 요청하세요.',
    context: '타깃 고객, 브랜드 톤, 캠페인 일정과 활용 채널을 알려주세요.',
    output: '표, 단계별 실행안, 채널별 카피처럼 바로 활용할 수 있는 형식을 지정하세요.',
    constraint: '예산, 금지 표현, 브랜드 가이드와 반드시 지켜야 할 일정 또는 수치 기준을 정하세요.',
    example: '원하는 캠페인 문구나 성공한 레퍼런스의 분위기를 보여주세요.',
  },
  system: {
    persona: '복잡한 요구사항을 구조화하는 시스템 설계자의 관점을 부여하세요.',
    goal: '안정성, 확장성, 운영 효율 중 달성할 기준을 정하세요.',
    task: '구성 요소와 의존 관계를 단계별로 설계하도록 요청하세요.',
    context: '현재 환경, 사용자 권한, 데이터 흐름과 운영 제약을 알려주세요.',
    output: '구성도, 의사결정 표, 단계별 도입 계획 등 검토하기 쉬운 형식을 지정하세요.',
    constraint: '보안, 가용성, 비용, 호환성과 같은 필수 운영 기준을 정하세요.',
    example: '선호하는 아키텍처 다이어그램이나 기존 시스템 문서의 형식을 보여주세요.',
  },
  programming: {
    persona: '실무 경험이 풍부한 시니어 프로그래머의 관점을 부여하세요.',
    goal: '구현할 기능과 성공 조건, 성능 기준을 명확히 하세요.',
    task: '코드, 테스트, 예외 처리와 함께 해결 과정을 요청하세요.',
    context: '언어, 프레임워크, 실행 환경과 기존 코드의 제약을 알려주세요.',
    output: '파일별 코드 블록, 테스트 코드, 실행 방법과 설명의 순서를 지정하세요.',
    constraint: '사용할 버전, 금지 라이브러리, 성능 기준과 기존 API 호환 조건을 정하세요.',
    example: '원하는 코드 스타일이나 입력과 출력이 포함된 구현 예시를 보여주세요.',
  },
  design: {
    persona: '사용자 중심의 경험을 설계하는 UX/UI 디자이너의 관점을 부여하세요.',
    goal: '사용자에게 전달할 경험과 행동 변화를 정의하세요.',
    task: '정보 구조, 화면 흐름과 시각적 방향을 함께 제안하도록 요청하세요.',
    context: '사용자, 브랜드 분위기, 사용 기기와 접근성 조건을 알려주세요.',
    output: '사용자 흐름, 와이어프레임 설명, 컴포넌트 목록과 화면별 명세 형식을 지정하세요.',
    constraint: '브랜드 색상, 반응형 기준, 접근성 등 반드시 지켜야 할 디자인 원칙을 정하세요.',
    example: '선호하는 레이아웃, 참고 화면 또는 원하는 시각적 분위기의 예시를 보여주세요.',
  },
}

const categoryExamples: Record<Category, Record<PromptPart, string>> = {
  marketing: {
    persona: '예: B2B SaaS 고객 여정과 퍼널 데이터를 분석해 온 10년 경력의 콘텐츠 마케팅 전략가로서, 의사결정자에게 신뢰를 주는 메시지를 설계',
    goal: '예: IT 의사결정자의 문제 인식과 신뢰 형성을 높여 3개월 안에 뉴스레터 가입 전환율을 현재 4%에서 6%로 개선',
    task: '예: 타깃 세그먼트별 핵심 문제를 정의하고, 인지도·검토·전환 단계에 맞춘 콘텐츠 주제 8개와 채널별 실행안, 측정 지표를 제안',
    context: '예: 월간 광고 예산은 500만 원이고 주요 채널은 블로그와 LinkedIn이며, 브랜드는 전문적이지만 친근한 말투를 사용하고 영업팀이 후속 상담을 진행함',
    output: '예: 전략 요약, 고객 세그먼트 표, 퍼널별 콘텐츠 캘린더, 채널별 카피 초안, KPI와 측정 방법을 Markdown 표와 단계별 목록으로 작성',
    constraint: '예: 검증되지 않은 통계와 과장된 성과 표현은 사용하지 말고, 모든 제안은 월 예산 500만 원과 3개월 일정 안에서 실행 가능해야 함',
    example: '예: LinkedIn 게시물을 “현업의 문제 제기 → 실무 팁 3가지 → 짧은 사례 → 제품의 자연스러운 연결 → 상담 유도” 순서와 700자 이내로 작성',
  },
  system: {
    persona: '예: 대규모 트래픽 환경에서 장애 대응과 확장성 높은 구조를 설계해 온 15년 경력의 시스템 아키텍트로서, 비용과 운영 현실까지 함께 검토',
    goal: '예: 피크 시간대 동시 접속자 10만 명과 월 99.9% 가용성을 달성하면서 무중단 배포가 가능한 서비스 구조 설계',
    task: '예: 현재 문제를 진단하고 컴포넌트 구성, 데이터 흐름, 장애 격리, 백업·복구, 모니터링과 단계별 전환 순서를 설계',
    context: '예: AWS 환경에서 개인정보를 다루고 있으며 기존 모놀리식 서비스를 운영 중이고, 서비스 중단 없이 6개월 안에 전환해야 함',
    output: '예: Mermaid 구성도, 요구사항-설계 대응표, 핵심 컴포넌트 표, 단계별 마이그레이션 일정, 장애 시나리오와 롤백 절차로 작성',
    constraint: '예: 개인정보는 저장·전송 구간 모두 암호화하고 단일 장애점을 만들지 않으며, 기존 API 호환성을 유지하고 월 운영비 300만 원 이하로 설계',
    example: '예: 문서를 “현재 구조와 문제 → 목표 아키텍처 → 데이터 흐름 → 전환 단계 → 장애 대응과 롤백 → 비용 추정” 순서로 작성',
  },
  programming: {
    persona: '예: React와 TypeScript로 유지보수 가능한 웹 서비스를 구축하고 코드 리뷰를 해 온 10년 경력의 시니어 풀스택 개발자로서, 구현 이유까지 설명',
    goal: '예: 사용자가 업무 데이터를 안전하게 저장하고 네트워크 실패 후에도 입력을 복구할 수 있는 업무 관리 기능을 구현',
    task: '예: 타입 정의, 컴포넌트 설계, API 연동, 입력 검증, 로딩·오류·빈 상태, 예외 처리와 단위 테스트까지 실행 가능한 코드로 작성',
    context: '예: React 19와 TypeScript strict 모드의 기존 Vite 프로젝트이며 외부 상태 관리 라이브러리는 사용할 수 없고 기존 컴포넌트 API를 유지해야 함',
    output: '예: 변경 파일 목록, 구현 단계, 파일별 전체 코드 블록, 테스트 코드, 실행 명령, 예상 오류와 검증 방법을 순서대로 작성',
    constraint: '예: any와 숨은 전역 상태를 사용하지 말고 기존 npm 스크립트를 깨뜨리지 않으며, 입력값·API 응답·네트워크 실패를 모두 안전하게 처리',
    example: '예: 유효한 입력 저장, 필수값 누락, API 500 오류, 재시도와 정상 완료 상태를 모두 포함한 React 컴포넌트 및 테스트 코드',
  },
  design: {
    persona: '예: 사용자 리서치와 접근성 기준을 바탕으로 복잡한 업무 도구를 설계해 온 10년 경력의 UX/UI 디자이너로서, 시각과 사용성을 함께 검토',
    goal: '예: 처음 방문한 소상공인도 3분 안에 핵심 기능을 이해하고 첫 작업을 완료할 수 있는 직관적인 제품 경험 설계',
    task: '예: 사용자 흐름, 정보 구조, 화면별 핵심 컴포넌트와 상태, 오류·빈 상태, 모바일 대응과 접근성 원칙을 포함한 디자인 방향을 제안',
    context: '예: 사용자는 디지털 도구에 익숙하지 않은 소상공인이고, 밝고 신뢰감 있는 브랜드 톤을 선호하며 모바일 360px부터 데스크톱까지 지원해야 함',
    output: '예: 사용자 흐름도, 화면별 와이어프레임 설명, 컴포넌트 상태 표, 디자인 토큰, 접근성 점검 목록과 검증 방법을 문서로 작성',
    constraint: '예: WCAG AA 명도 대비를 지키고 한 화면에 핵심 행동을 하나만 배치하며, 전문 용어를 줄이고 모든 주요 상태를 모바일에서도 확인 가능하게 설계',
    example: '예: 모바일 흐름을 “현재 현황 한눈에 확인 → 큰 시작 버튼 → 단계별 입력 → 검토 → 완료 피드백” 순서로 설계하고 각 화면의 문구까지 제안',
  },
}

const personaSuggestions: Record<Category, string> = {
  marketing: 'B2B SaaS 고객 여정을 분석하고 전환 캠페인을 설계해 온 10년 경력의 콘텐츠 마케팅 전략가',
  system: '대규모 트래픽 환경에서 장애 대응과 확장성 높은 구조를 설계해 온 15년 경력의 시스템 아키텍트',
  programming: 'React와 TypeScript로 유지보수 가능한 웹 서비스를 구축하고 코드 리뷰를 해 온 10년 경력의 시니어 풀스택 개발자',
  design: '사용자 리서치와 접근성 기준을 바탕으로 복잡한 업무 도구를 설계해 온 10년 경력의 UX/UI 디자이너',
}

const subcategoryDescriptors: Record<Category, Record<string, string>> = {
  marketing: {
    strategy: '시장 기회와 성장 전략', content: '콘텐츠 기획과 배포', campaign: '광고 캠페인 성과 최적화', 'market-analysis': '고객 세그먼트와 시장 조사', brand: '브랜드 포지셔닝과 메시지',
  },
  system: {
    'ai-planning': 'AI 시스템 요구사항과 로드맵', architecture: '확장 가능한 시스템 구조', pipeline: '데이터와 AI 모델 파이프라인', agent: '자율형 AI Agent 워크플로', operations: '시스템 안정성과 운영 자동화',
  },
  programming: {
    web: '웹 프론트엔드와 사용자 기능', app: '모바일 앱 기능과 배포', backend: '서버 API와 데이터 처리', ml: '머신러닝 모델과 추론 기능', automation: '반복 업무 자동화와 개발 도구',
  },
  design: {
    ui: '인터페이스 구성과 시각 계층', ux: '사용자 흐름과 사용성 개선', 'brand-design': '브랜드 아이덴티티와 시각 체계', graphic: '그래픽 에셋과 콘텐츠 제작', product: '제품 경험과 서비스 전체 흐름',
  },
}

const promptFields: Array<{
  key: PromptPart
  number: string
  title: string
  hint: string
  placeholder: string
}> = [
  {
    key: 'persona',
    number: '01',
    title: 'Persona (페르소나)',
    hint: 'AI에게 어떤 전문가의 역할을 부여할까요?',
    placeholder: '예: B2B SaaS 고객 여정을 분석하고 전환 캠페인을 설계해 온 10년 경력의 콘텐츠 마케팅 전략가',
  },
  {
    key: 'goal',
    number: '02',
    title: 'Goal (목표)',
    hint: '최종적으로 무엇을 달성하고 싶나요?',
    placeholder: '예: IT 의사결정자를 대상으로 3개월 안에 뉴스레터 가입 전환율을 20% 높이는 콘텐츠 전략 수립',
  },
  {
    key: 'task',
    number: '03',
    title: 'Task (과제)',
    hint: 'AI가 구체적으로 무엇을 해야 하나요?',
    placeholder: '예: 타깃 고객의 문제를 정의하고 인지도부터 전환까지 이어지는 콘텐츠 주제 8개와 채널별 실행안을 제안',
  },
  {
    key: 'context',
    number: '04',
    title: 'Context (맥락)',
    hint: '배경정보, 조건, 제한사항을 알려주세요.',
    placeholder: '예: 월간 광고 예산은 500만 원이며 브랜드는 전문적이지만 친근한 말투를 사용하고 주요 채널은 블로그와 LinkedIn임',
  },
  {
    key: 'output',
    number: '05',
    title: 'Output (출력 형식)',
    hint: '어떤 형식으로 결과를 받아보고 싶나요?',
    placeholder: '예: 전략 개요, 실행안, 측정 지표를 Markdown 표와 단계별 목록으로 작성',
  },
  {
    key: 'constraint',
    number: '06',
    title: 'Constraint (제약 조건)',
    hint: '반드시 지켜야 할 조건은 무엇인가요?',
    placeholder: '예: 검증되지 않은 통계는 사용하지 않고 예산 500만 원 안에서 제안',
  },
  {
    key: 'example',
    number: '07',
    title: 'Example (예시)',
    hint: '원하는 결과의 예시나 참고 방향이 있나요?',
    placeholder: '예: 문제 제기, 실무 팁, 제품 연결, 행동 유도 순서의 게시물',
  },
]

const emptyPrompt: Record<PromptPart, string> = {
  persona: '', goal: '', task: '', context: '', output: '', constraint: '', example: '',
}

const generatorName = 'Prompt Element Builder'

function App() {
  const [prompt, setPrompt] = useState(emptyPrompt)
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
  const [selectedSubcategories, setSelectedSubcategories] = useState<Record<Category, string[]>>({
    marketing: [], system: [], programming: [], design: [],
  })
  const [selectedParts, setSelectedParts] = useState<PromptPart[]>(promptFields.map(({ key }) => key))
  const [result, setResult] = useState('')
  const [isDark, setIsDark] = useState(false)
  const [copied, setCopied] = useState(false)

  const updatePrompt = (key: PromptPart, value: string) => {
    setPrompt((current) => ({ ...current, [key]: value }))
  }

  const toggleCategory = (category: Category) => {
    setSelectedCategories((current) => {
      const isSelected = current.includes(category)
      if (isSelected) {
        setSelectedSubcategories((subcategoriesByCategory) => ({ ...subcategoriesByCategory, [category]: [] }))
        return current.filter((item) => item !== category)
      }
      return [...current, category]
    })
  }

  const toggleSubcategory = (category: Category, subcategory: string) => {
    setSelectedSubcategories((current) => ({
      ...current,
      [category]: current[category].includes(subcategory)
        ? current[category].filter((item) => item !== subcategory)
        : [...current[category], subcategory],
    }))
  }

  const togglePromptPart = (part: PromptPart) => {
    setSelectedParts((current) => current.includes(part)
      ? current.filter((item) => item !== part)
      : [...current, part])
  }

  const getSelectedSubcategoryLabels = (category: Category) => (
    selectedSubcategories[category].map((key) => subcategories[category].find((item) => item.key === key)?.label ?? key)
  )

  const getSelectedFocus = () => selectedCategories.flatMap((category) => (
    selectedSubcategories[category].map((key) => subcategoryDescriptors[category][key])
  ))

  const getFocusText = () => {
    const focus = getSelectedFocus()
    return focus.length ? ` 선택한 세부 분야(${focus.join(', ')})에 초점을 맞춰 안내하세요.` : ''
  }

  const getGuide = (part: PromptPart, fallback: string) => {
    if (!selectedCategories.length) return fallback
    return selectedCategories.map((category) => categoryGuides[category][part]).join(' ') + getFocusText()
  }

  const getPlaceholder = (part: PromptPart, fallback: string) => {
    if (!selectedCategories.length) return fallback
    return selectedCategories.map((category) => categoryExamples[category][part]).join(' 또는 ')
  }

  const applyPersonaSuggestion = (category: Category) => {
    const focus = getSelectedSubcategoryLabels(category)
    const focusText = focus.length ? `${focus.join(', ')} 분야에 특히 전문성을 가진 ` : ''
    updatePrompt('persona', `${focusText}${personaSuggestions[category]}`)
  }

  const generatePrompt = () => {
    const focus = selectedCategories.flatMap((category) => {
      const categoryLabel = categories.find((item) => item.key === category)?.label ?? category
      const subcategoryLabels = getSelectedSubcategoryLabels(category)
      return subcategoryLabels.length ? `${categoryLabel}: ${subcategoryLabels.join(', ')}` : categoryLabel
    })
    const categorySection = focus.length ? `분야 및 세부 분야:\n${focus.join('\n')}` : ''
    const sections = [categorySection, ...promptFields
      .filter(({ key }) => selectedParts.includes(key))
      .map(({ key, title }) => prompt[key].trim() ? `${title}:\n${prompt[key].trim()}` : '')
      .filter(Boolean)]

    setResult(sections.join('\n\n'))
    setCopied(false)
  }

  const resetPrompt = () => {
    setPrompt(emptyPrompt)
    setSelectedCategories([])
    setSelectedSubcategories({ marketing: [], system: [], programming: [], design: [] })
    setSelectedParts(promptFields.map(({ key }) => key))
    setResult('')
    setCopied(false)
  }

  const copyPrompt = async () => {
    if (!result) return
    await navigator.clipboard.writeText(result)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className={`site-shell ${isDark ? 'dark' : ''}`}>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="MOUSAI 홈">
          <span className="brand-mark">AI</span>
          <span>MOUSAI</span>
        </a>
        <button className="theme-toggle" type="button" onClick={() => setIsDark((current) => !current)}>
          <span aria-hidden="true">{isDark ? '☀' : '☾'}</span>
          {isDark ? '라이트모드' : '다크모드'}
        </button>
      </header>

      <main className="page-content" id="top">
        <section className="hero">
          <p className="eyebrow">Prompt Element Builder / 01</p>
          <h1>Prompt Element<br /><em>Builder</em></h1>
          <p className="hero-copy">Persona (페르소나), Goal (목표), Task (과제), Context (맥락),<br /> Output (출력 형식), Constraint (제약 조건), Example (예시)을 조합하여<br /> 아이디어를 바로 실행 가능한 프롬프트로 만들어보세요.</p>
        </section>

        <section className="generator" aria-label={`${generatorName} 입력 영역`}>
          <div className="section-heading">
            <div>
              <span className="section-label">BUILD YOUR PROMPT</span>
              <h2>필요한 요소 범위를 선택하세요.</h2>
            </div>
            <span className="step-count">{selectedParts.filter((part) => prompt[part].trim()).length} / {selectedParts.length} 완료</span>
          </div>

          <div className="category-picker">
            <div className="category-heading">
              <div>
                <span className="section-label">CHOOSE A DIRECTION</span>
                <h3>어떤 분야의 도움을 받을까요?</h3>
              </div>
              <span className="category-note">복수 선택 가능</span>
            </div>
            <div className="category-grid">
              {categories.map(({ key, label, description }) => (
                <label className={`category-option ${selectedCategories.includes(key) ? 'selected' : ''}`} key={key}>
                  <input type="checkbox" checked={selectedCategories.includes(key)} onChange={() => toggleCategory(key)} />
                  <span className="checkmark" aria-hidden="true">✓</span>
                  <span><strong>{label}</strong><small>{description}</small></span>
                </label>
              ))}
            </div>
            {selectedCategories.length > 0 && (
              <>
              <div className="subcategory-picker">
                <div className="subcategory-heading">
                  <span className="section-label">SELECT A SPECIALTY</span>
                  <span className="category-note">2차 세부 분야 · 복수 선택 가능</span>
                </div>
                <div className="subcategory-groups">
                  {selectedCategories.map((category) => (
                    <div className="subcategory-group" key={category}>
                      <strong>{categories.find((item) => item.key === category)?.label}</strong>
                      <div className="subcategory-list">
                        {subcategories[category].map(({ key, label }) => (
                          <label className={`subcategory-option ${selectedSubcategories[category].includes(key) ? 'selected' : ''}`} key={key}>
                            <input type="checkbox" checked={selectedSubcategories[category].includes(key)} onChange={() => toggleSubcategory(category, key)} />
                            <span className="sub-checkmark" aria-hidden="true">✓</span>
                            <span>{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="element-picker">
                <div className="subcategory-heading">
                  <span className="section-label">CHOOSE ELEMENTS</span>
                  <span className="category-note">입력·생성할 요소 범위</span>
                </div>
                <div className="element-list">
                  {promptFields.map(({ key, number, title }) => (
                    <label className={`element-option ${selectedParts.includes(key) ? 'selected' : ''}`} key={key}>
                      <input type="checkbox" checked={selectedParts.includes(key)} onChange={() => togglePromptPart(key)} />
                      <span className="sub-checkmark" aria-hidden="true">✓</span>
                      <span><small>{number}</small>{title}</span>
                    </label>
                  ))}
                </div>
              </div>
              </>
            )}
          </div>

          <div className="field-grid">
            {promptFields.filter(({ key }) => selectedParts.includes(key)).map(({ key, number, title, hint, placeholder }) => (
              <label className="prompt-field" htmlFor={key} key={key}>
                <span className="field-topline"><span className="field-number">{number}</span><strong>{title}</strong></span>
                <span className="field-hint">{getGuide(key, hint)}</span>
                <textarea id={key} value={prompt[key]} onChange={(event) => updatePrompt(key, event.target.value)} placeholder={getPlaceholder(key, placeholder)} rows={4} />
                {key === 'persona' && selectedCategories.length > 0 && (
                  <span className="suggestion-area">
                    <span className="suggestion-label">1차 제안</span>
                    <span className="suggestion-list">
                      {selectedCategories.map((category) => (
                        <button className="suggestion-button" type="button" key={category} onClick={() => applyPersonaSuggestion(category)}>
                          {categories.find((item) => item.key === category)?.label} 제안 ↗
                        </button>
                      ))}
                    </span>
                  </span>
                )}
              </label>
            ))}
          </div>

          <div className="action-row">
            <button className="secondary-button" type="button" onClick={resetPrompt}>초기화</button>
            <button className="primary-button" type="button" onClick={generatePrompt}>최종 프롬프트 생성 <span aria-hidden="true">↗</span></button>
          </div>
        </section>

        <section className={`result-panel ${result ? 'has-result' : ''}`} aria-live="polite">
          <div className="result-heading">
            <div><span className="section-label">YOUR OUTPUT</span><h2>최종 프롬프트</h2></div>
            <button className="copy-button" type="button" onClick={copyPrompt} disabled={!result}>{copied ? '복사 완료' : '⌘ 프롬프트 복사'}</button>
          </div>
          <div className="result-box">
            {result || <span className="result-placeholder">입력한 내용이 하나의 프롬프트로 이곳에 나타납니다.</span>}
          </div>
        </section>
      </main>

      <footer><span>MOUSAI</span><span>작은 도구로 큰 아이디어를 시작하세요.</span></footer>
    </div>
  )
}

export default App