import { useState } from 'react'
import './App.css'

type PromptPart = 'persona' | 'goal' | 'task' | 'context'
type Category = 'marketing' | 'system' | 'programming' | 'design'

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
  },
  system: {
    persona: '복잡한 요구사항을 구조화하는 시스템 설계자의 관점을 부여하세요.',
    goal: '안정성, 확장성, 운영 효율 중 달성할 기준을 정하세요.',
    task: '구성 요소와 의존 관계를 단계별로 설계하도록 요청하세요.',
    context: '현재 환경, 사용자 권한, 데이터 흐름과 운영 제약을 알려주세요.',
  },
  programming: {
    persona: '실무 경험이 풍부한 시니어 프로그래머의 관점을 부여하세요.',
    goal: '구현할 기능과 성공 조건, 성능 기준을 명확히 하세요.',
    task: '코드, 테스트, 예외 처리와 함께 해결 과정을 요청하세요.',
    context: '언어, 프레임워크, 실행 환경과 기존 코드의 제약을 알려주세요.',
  },
  design: {
    persona: '사용자 중심의 경험을 설계하는 UX/UI 디자이너의 관점을 부여하세요.',
    goal: '사용자에게 전달할 경험과 행동 변화를 정의하세요.',
    task: '정보 구조, 화면 흐름과 시각적 방향을 함께 제안하도록 요청하세요.',
    context: '사용자, 브랜드 분위기, 사용 기기와 접근성 조건을 알려주세요.',
  },
}

const personaSuggestions: Record<Category, string> = {
  marketing: '타깃 고객과 시장을 분석하는 10년 경력의 마케팅 전략가',
  system: '확장성과 안정성을 설계하는 시니어 시스템 아키텍트',
  programming: '테스트와 유지보수까지 고려하는 시니어 풀스택 개발자',
  design: '사용자 리서치부터 프로토타입까지 수행하는 UX/UI 디자이너',
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
    title: '페르소나',
    hint: 'AI에게 어떤 전문가의 역할을 부여할까요?',
    placeholder: '예: 10년 경력의 콘텐츠 전략가',
  },
  {
    key: 'goal',
    number: '02',
    title: '목표',
    hint: '최종적으로 무엇을 달성하고 싶나요?',
    placeholder: '예: 초보자도 이해하기 쉬운 블로그 글 작성',
  },
  {
    key: 'task',
    number: '03',
    title: '과제',
    hint: 'AI가 구체적으로 무엇을 해야 하나요?',
    placeholder: '예: 핵심 내용을 5개의 소제목으로 나누어 작성',
  },
  {
    key: 'context',
    number: '04',
    title: '맥락',
    hint: '배경정보, 조건, 제한사항을 알려주세요.',
    placeholder: '예: 독자는 마케팅을 처음 접하는 직장인입니다.',
  },
]

const emptyPrompt = { persona: '', goal: '', task: '', context: '' }

function App() {
  const [prompt, setPrompt] = useState(emptyPrompt)
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
  const [result, setResult] = useState('')
  const [isDark, setIsDark] = useState(false)
  const [copied, setCopied] = useState(false)

  const updatePrompt = (key: PromptPart, value: string) => {
    setPrompt((current) => ({ ...current, [key]: value }))
  }

  const toggleCategory = (category: Category) => {
    setSelectedCategories((current) => current.includes(category)
      ? current.filter((item) => item !== category)
      : [...current, category])
  }

  const getGuide = (part: PromptPart, fallback: string) => {
    if (!selectedCategories.length) return fallback
    return selectedCategories.map((category) => categoryGuides[category][part]).join(' ')
  }

  const applyPersonaSuggestion = (category: Category) => {
    updatePrompt('persona', personaSuggestions[category])
  }

  const generatePrompt = () => {
    const sections = promptFields
      .map(({ key, title }) => prompt[key].trim() ? `${title}:\n${prompt[key].trim()}` : '')
      .filter(Boolean)

    setResult(sections.join('\n\n'))
    setCopied(false)
  }

  const resetPrompt = () => {
    setPrompt(emptyPrompt)
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
          <p className="eyebrow">Prompt workshop / 01</p>
          <h1>PGTC<br /><em>프롬프트 생성기</em></h1>
          <p className="hero-copy">Persona, Goal, Task, Context를 조합하여<br />아이디어를 바로 실행 가능한 프롬프트로 만들어보세요.</p>
        </section>

        <section className="generator" aria-label="프롬프트 입력 영역">
          <div className="section-heading">
            <div>
              <span className="section-label">BUILD YOUR PROMPT</span>
              <h2>네 가지 재료를 입력하세요.</h2>
            </div>
            <span className="step-count">{Object.values(prompt).filter(Boolean).length} / 4 완료</span>
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
          </div>

          <div className="field-grid">
            {promptFields.map(({ key, number, title, hint, placeholder }) => (
              <label className="prompt-field" htmlFor={key} key={key}>
                <span className="field-topline"><span className="field-number">{number}</span><strong>{title}</strong></span>
                <span className="field-hint">{getGuide(key, hint)}</span>
                <textarea id={key} value={prompt[key]} onChange={(event) => updatePrompt(key, event.target.value)} placeholder={placeholder} rows={4} />
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