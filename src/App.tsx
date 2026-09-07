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
    persona: '예: B2B SaaS 고객 여정을 분석하고 전환 캠페인을 설계해 온 10년 경력의 콘텐츠 마케팅 전략가',
    goal: '예: IT 의사결정자를 대상으로 3개월 안에 뉴스레터 가입 전환율을 20% 높이는 콘텐츠 전략 수립',
    task: '예: 타깃 고객의 문제를 정의하고, 인지도부터 전환까지 이어지는 콘텐츠 주제 8개와 채널별 실행안을 제안',
    context: '예: 월간 광고 예산은 500만 원이며, 브랜드는 전문적이지만 친근한 말투를 사용하고 주요 채널은 블로그와 LinkedIn임',
    output: '예: 전략 개요, 고객 세그먼트 표, 채널별 콘텐츠 캘린더와 측정 지표를 Markdown 표로 작성',
    constraint: '예: 과장된 성과 표현과 검증되지 않은 통계는 사용하지 말고, 모든 제안은 월 예산 500만 원 안에서 설계',
    example: '예: “문제 제기 → 실무 팁 3가지 → 제품의 자연스러운 연결 → 행동 유도” 순서의 LinkedIn 게시물',
  },
  system: {
    persona: '예: 대규모 트래픽 환경에서 장애 대응과 확장성 높은 구조를 설계해 온 15년 경력의 시스템 아키텍트',
    goal: '예: 피크 시간대 동시 접속자 10만 명을 안정적으로 처리하면서 배포 중단 시간을 최소화하는 서비스 구조 설계',
    task: '예: 컴포넌트 구성, 데이터 흐름, 장애 격리 전략과 모니터링 항목을 포함한 시스템 아키텍처와 도입 순서를 작성',
    context: '예: 클라우드 환경은 AWS이고 개인정보를 다루며, 기존 모놀리식 서비스와의 단계적 전환 및 월 운영비 300만 원 제한이 있음',
    output: '예: Mermaid 구성도, 핵심 컴포넌트 표, 단계별 마이그레이션 일정과 위험 대응표로 작성',
    constraint: '예: 개인정보는 암호화하고 단일 장애점을 만들지 않으며, 기존 서비스 중단 없이 월 운영비 300만 원 이하로 설계',
    example: '예: “현재 구조 → 목표 구조 → 전환 단계 → 장애 발생 시 롤백” 순서로 정리된 아키텍처 문서',
  },
  programming: {
    persona: '예: React와 TypeScript로 유지보수 가능한 웹 서비스를 구축하고 코드 리뷰를 해 온 10년 경력의 시니어 풀스택 개발자',
    goal: '예: 사용자가 입력한 데이터를 안전하게 저장하고 실패 상황에서도 복구 가능한 업무 관리 기능 구현',
    task: '예: 타입 정의부터 컴포넌트, API 연동, 유효성 검사, 예외 처리와 단위 테스트까지 실행 가능한 코드로 작성',
    context: '예: React 19와 TypeScript를 사용하며 기존 Vite 프로젝트에 추가해야 하고, 외부 상태 관리 라이브러리 없이 구현해야 함',
    output: '예: 변경 파일 목록, 전체 코드 블록, 테스트 코드, 실행 명령과 구현상의 주의점을 순서대로 작성',
    constraint: '예: TypeScript strict 모드를 유지하고 any를 사용하지 않으며, 기존 컴포넌트 API와 npm 스크립트를 깨뜨리지 않음',
    example: '예: 입력값 검증 실패, 네트워크 오류, 정상 저장 상태를 모두 처리하는 React 컴포넌트 코드',
  },
  design: {
    persona: '예: 사용자 리서치와 접근성 기준을 바탕으로 복잡한 업무 도구를 설계해 온 10년 경력의 UX/UI 디자이너',
    goal: '예: 처음 방문한 사용자도 3분 안에 핵심 기능을 이해하고 첫 작업을 완료할 수 있는 직관적인 경험 설계',
    task: '예: 사용자 흐름, 정보 구조, 화면별 핵심 컴포넌트와 상태, 모바일 대응 원칙을 포함한 디자인 방향을 제안',
    context: '예: 사용자는 디지털 도구에 익숙하지 않은 소상공인이며, 밝고 신뢰감 있는 브랜드 톤과 WCAG AA 접근성을 준수해야 함',
    output: '예: 핵심 사용자 흐름, 화면별 와이어프레임 설명, 컴포넌트 상태와 디자인 토큰을 문서로 작성',
    constraint: '예: WCAG AA 명도 대비를 지키고 모바일 360px부터 대응하며, 한 화면에 핵심 행동을 하나만 배치',
    example: '예: “한눈에 현황 확인 → 큰 시작 버튼 → 단계별 입력 → 완료 피드백”으로 이어지는 모바일 화면 흐름',
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
    title: 'Persona(페르소나)',
    hint: 'AI에게 어떤 전문가의 역할을 부여할까요?',
    placeholder: '예: B2B SaaS 고객 여정을 분석하고 전환 캠페인을 설계해 온 10년 경력의 콘텐츠 마케팅 전략가',
  },
  {
    key: 'goal',
    number: '02',
    title: 'Goal(목표)',
    hint: '최종적으로 무엇을 달성하고 싶나요?',
    placeholder: '예: IT 의사결정자를 대상으로 3개월 안에 뉴스레터 가입 전환율을 20% 높이는 콘텐츠 전략 수립',
  },
  {
    key: 'task',
    number: '03',
    title: 'Task(과제)',
    hint: 'AI가 구체적으로 무엇을 해야 하나요?',
    placeholder: '예: 타깃 고객의 문제를 정의하고 인지도부터 전환까지 이어지는 콘텐츠 주제 8개와 채널별 실행안을 제안',
  },
  {
    key: 'context',
    number: '04',
    title: 'Context(맥락)',
    hint: '배경정보, 조건, 제한사항을 알려주세요.',
    placeholder: '예: 월간 광고 예산은 500만 원이며 브랜드는 전문적이지만 친근한 말투를 사용하고 주요 채널은 블로그와 LinkedIn임',
  },
  {
    key: 'output',
    number: '05',
    title: 'Output(출력 형식)',
    hint: '어떤 형식으로 결과를 받아보고 싶나요?',
    placeholder: '예: 전략 개요, 실행안, 측정 지표를 Markdown 표와 단계별 목록으로 작성',
  },
  {
    key: 'constraint',
    number: '06',
    title: 'Constraint(제약 조건)',
    hint: '반드시 지켜야 할 조건은 무엇인가요?',
    placeholder: '예: 검증되지 않은 통계는 사용하지 않고 예산 500만 원 안에서 제안',
  },
  {
    key: 'example',
    number: '07',
    title: 'Example(예시)',
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
        <a className="brand" href="#top" aria-label="AI Study Lab 홈">
          <span className="brand-mark">AI</span>
          <span>STUDY LAB</span>
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
          <p className="hero-copy">Persona, Goal, Task, Context, Output, Constraint, Example을 조합하여<br />아이디어를 바로 실행 가능한 프롬프트로 만들어보세요.</p>
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

      <footer><span>AI STUDY LAB</span><span>작은 도구로 큰 아이디어를 시작하세요.</span></footer>
    </div>
  )
}

export default App