import { useState } from 'react'
import './App.css'

type PromptPart = 'persona' | 'goal' | 'task' | 'context'

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
  const [result, setResult] = useState('')
  const [isDark, setIsDark] = useState(false)
  const [copied, setCopied] = useState(false)

  const updatePrompt = (key: PromptPart, value: string) => {
    setPrompt((current) => ({ ...current, [key]: value }))
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

          <div className="field-grid">
            {promptFields.map(({ key, number, title, hint, placeholder }) => (
              <label className="prompt-field" htmlFor={key} key={key}>
                <span className="field-topline"><span className="field-number">{number}</span><strong>{title}</strong></span>
                <span className="field-hint">{hint}</span>
                <textarea id={key} value={prompt[key]} onChange={(event) => updatePrompt(key, event.target.value)} placeholder={placeholder} rows={4} />
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