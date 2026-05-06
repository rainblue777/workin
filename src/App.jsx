import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'
import './App.css'

const studentGuides = [
  {
    title: '비자 상태 기반 알바 유형 안내',
    description:
      '내 비자 상태에서 확인해야 할 근무 조건과 준비 서류를 쉽게 살펴볼 수 있게 안내합니다.',
  },
  {
    title: '학교별 알바 절차 안내',
    description:
      '학교마다 다른 사전 확인 절차와 담당 부서를 놓치지 않도록 한곳에 정리합니다.',
  },
  {
    title: '유학생 친화 가게 탐색',
    description:
      '서류 협조, 시간표 조율, 외국어 가능 여부를 기준으로 일하기 좋은 가게를 찾습니다.',
  },
]

const ownerGuides = [
  {
    title: '가게 등록',
    description:
      '유학생에게 필요한 기본 정보를 간단하게 보여줄 수 있는 등록 흐름을 준비합니다.',
  },
  {
    title: '장점 표시',
    description:
      '초보 가능, 친절한 교육, 유연한 근무 같은 가게의 강점을 한눈에 전달합니다.',
  },
  {
    title: '근무 조건 안내',
    description:
      '시간표 조율, 외국어 가능, 서류 협조 가능 여부를 명확하게 표시합니다.',
  },
]

const routeMap = {
  student: '#/student',
  registerStore: '#/register-store',
  home: '#/',
}

function getCurrentRoute() {
  return window.location.hash || routeMap.home
}

function getStoreText(value) {
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(', ') : '정보 없음'
  }

  if (value === null || value === undefined || value === '') {
    return '정보 없음'
  }

  return value
}

function getGuideText(value) {
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(', ') : '정보 없음'
  }

  if (value === null || value === undefined || value === '') {
    return '정보 없음'
  }

  return value
}

function getGuideListItems(value) {
  if (!Array.isArray(value)) {
    return value ? [String(value)] : []
  }

  // DB에 배열로 저장된 절차와 서류를 화면에서 읽기 좋은 목록으로 바꿉니다.
  return value
    .map((item) => String(item).trim())
    .filter((item) => item.length > 0)
}

function App() {
  const [route, setRoute] = useState(getCurrentRoute)

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getCurrentRoute())
    }

    // 라우팅 라이브러리 없이 주소의 # 뒤 값을 보고 보여줄 화면만 바꿉니다.
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [route])

  if (route === routeMap.student) {
    return <StudentPage />
  }

  if (route === routeMap.registerStore) {
    return <RegisterStorePage />
  }

  return <LandingPage />
}

function SiteHeader({ compact = false }) {
  return (
    <nav className="top-nav" aria-label="workin 주요 메뉴">
      <a className="brand" href={routeMap.home} aria-label="workin 홈">
        <span className="brand-mark" aria-hidden="true">
          w
        </span>
        <span>workin’</span>
      </a>

      <div className="nav-links">
        <a href={routeMap.student}>유학생</a>
        <a href={routeMap.registerStore}>사장님</a>
        {compact && <a href={routeMap.home}>홈</a>}
      </div>
    </nav>
  )
}

function LandingPage() {
  return (
    <main className="landing-page">
      <section className="hero-section" aria-labelledby="hero-title">
        <SiteHeader />

        <div className="hero-layout">
          <div className="hero-copy">
            <p className="eyebrow">workin’</p>
            <h1 id="hero-title">유학생을 위한 가장 쉬운 알바 찾기</h1>
            <p className="hero-description">
              비자 상태와 학교 절차를 확인하고, 유학생 친화 가게를
              찾아보세요.
            </p>

            {/* 이번 단계의 버튼은 hash 주소만 바꿉니다. 로그인, 저장, 추천 로직은 연결하지 않았습니다. */}
            <div className="hero-actions" aria-label="주요 이동 버튼">
              <a className="button primary" href={routeMap.student}>
                알바 찾아보기
              </a>
              <a className="button secondary" href={routeMap.registerStore}>
                가게 등록하기
              </a>
            </div>
          </div>

          {/* 실제 데이터가 없기 때문에, 서비스가 보여줄 정보를 간단한 미리보기 형태로만 표현합니다. */}
          <div className="hero-preview" aria-label="workin 서비스 화면 미리보기">
            <div className="preview-header">
              <span>오늘 확인할 것</span>
              <strong>3단계</strong>
            </div>
            <div className="preview-list">
              <div className="preview-row">
                <span className="status-dot green" aria-hidden="true"></span>
                <div>
                  <strong>비자 조건 확인</strong>
                  <p>근무 가능 시간과 필요 서류를 먼저 체크</p>
                </div>
              </div>
              <div className="preview-row">
                <span className="status-dot blue" aria-hidden="true"></span>
                <div>
                  <strong>학교 절차 확인</strong>
                  <p>신청 전 담당 부서와 제출 순서를 확인</p>
                </div>
              </div>
              <div className="preview-row">
                <span className="status-dot orange" aria-hidden="true"></span>
                <div>
                  <strong>친화 가게 탐색</strong>
                  <p>시간표 조율과 서류 협조 가능 여부를 비교</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="info-section student-section" id="students">
        <div className="section-header">
          <p className="section-kicker">For students</p>
          <h2>유학생이 먼저 확인해야 할 정보를 쉽게 정리합니다</h2>
        </div>

        <div className="feature-grid">
          {studentGuides.map((guide) => (
            <article className="feature-card" key={guide.title}>
              <h3>{guide.title}</h3>
              <p>{guide.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="info-section owner-section" id="owners">
        <div className="section-header">
          <p className="section-kicker">For owners</p>
          <h2>사장님은 유학생에게 필요한 조건을 명확하게 보여줄 수 있습니다</h2>
        </div>

        <div className="feature-grid">
          {ownerGuides.map((guide) => (
            <article className="feature-card" key={guide.title}>
              <h3>{guide.title}</h3>
              <p>{guide.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

function StudentPage() {
  const [stores, setStores] = useState([])
  const [isStoresLoading, setIsStoresLoading] = useState(true)
  const [storesError, setStoresError] = useState(false)
  const [schoolGuide, setSchoolGuide] = useState(null)
  const [schoolGuideCondition, setSchoolGuideCondition] = useState(null)
  const [hasSearchedSchoolGuide, setHasSearchedSchoolGuide] = useState(false)
  const [isSchoolGuideLoading, setIsSchoolGuideLoading] = useState(false)
  const [schoolGuideError, setSchoolGuideError] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadApprovedStores() {
      setIsStoresLoading(true)
      setStoresError(false)

      // Supabase에서 공개 승인된 가게만 가져옵니다. 아직 추천 계산이나 로그인은 연결하지 않습니다.
      const { data, error } = await supabase
        .from('stores')
        .select(
          'store_name, category, location, position, wage, student_friendly_points',
        )
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      if (!isMounted) {
        return
      }

      if (error) {
        setStores([])
        setStoresError(true)
      } else {
        setStores(data ?? [])
      }

      setIsStoresLoading(false)
    }

    loadApprovedStores()

    return () => {
      isMounted = false
    }
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const schoolName = String(formData.get('schoolName') ?? '').trim()

    const currentCondition = {
      visaType: formData.get('visaType') || '선택 안 함',
      schoolName: schoolName || '입력 안 함',
      koreanLevel: formData.get('koreanLevel') || '선택 안 함',
      workType: formData.get('workType') || '선택 안 함',
    }

    setSchoolGuideCondition(currentCondition)
    setHasSearchedSchoolGuide(true)
    setIsSchoolGuideLoading(true)
    setSchoolGuideError(false)
    setSchoolGuide(null)

    try {
      // 입력한 학교 이름과 공개 상태가 모두 맞는 안내 정보만 가져옵니다.
      const { data, error } = await supabase
        .from('school_guides')
        .select(
          'school_name, office_name, summary, process_steps, required_documents, caution_notes',
        )
        .eq('school_name', schoolName)
        .eq('status', 'published')
        .limit(1)

      if (error) {
        throw error
      }

      setSchoolGuide(data?.[0] ?? null)
    } catch (error) {
      console.error('학교 안내 정보 조회 실패:', error)
      setSchoolGuideError(true)
    } finally {
      setIsSchoolGuideLoading(false)
    }
  }

  const processSteps = getGuideListItems(schoolGuide?.process_steps)
  const requiredDocuments = getGuideListItems(schoolGuide?.required_documents)

  return (
    <main className="form-page">
      <SiteHeader compact />

      <section className="form-layout" aria-labelledby="student-title">
        <div className="form-intro">
          <p className="section-kicker">For students</p>
          <h1 id="student-title">유학생 알바 정보 확인</h1>
          <p>
            비자 상태와 학교 정보를 입력하면 가능한 알바 유형과 절차를
            확인할 수 있습니다.
          </p>
        </div>

        <form className="form-card" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>비자 종류 선택</span>
            <select name="visaType" defaultValue="">
              <option value="" disabled>
                비자 종류를 선택하세요
              </option>
              <option>D-2 유학</option>
              <option>D-4 일반연수</option>
              <option>F 계열 비자</option>
              <option>기타 또는 확인 필요</option>
            </select>
          </label>

          <label className="form-field">
            <span>학교 이름 입력</span>
            <input name="schoolName" type="text" placeholder="예: 한국대학교" />
          </label>

          <label className="form-field">
            <span>한국어 수준 선택</span>
            <select name="koreanLevel" defaultValue="">
              <option value="" disabled>
                한국어 수준을 선택하세요
              </option>
              <option>초급</option>
              <option>중급</option>
              <option>고급</option>
              <option>업무 대화 가능</option>
            </select>
          </label>

          <label className="form-field">
            <span>희망 근무 형태 선택</span>
            <select name="workType" defaultValue="">
              <option value="" disabled>
                희망 근무 형태를 선택하세요
              </option>
              <option>평일 파트타임</option>
              <option>주말 파트타임</option>
              <option>방학 중 단기 근무</option>
              <option>시간표에 맞춘 유연 근무</option>
            </select>
          </label>

          <div className="form-actions">
            <button className="button primary" type="submit">
              내 조건 확인하기
            </button>
            <a className="button secondary" href={routeMap.home}>
              홈으로 돌아가기
            </a>
          </div>
        </form>

        {hasSearchedSchoolGuide && (
          <section className="school-guide-result" aria-live="polite">
            {isSchoolGuideLoading && (
              <p className="school-guide-state" role="status">
                학교별 절차를 불러오는 중입니다...
              </p>
            )}

            {!isSchoolGuideLoading && schoolGuideError && (
              <p className="school-guide-state error" role="alert">
                학교 안내 정보를 불러오지 못했습니다.
              </p>
            )}

            {!isSchoolGuideLoading && !schoolGuideError && !schoolGuide && (
              <p className="school-guide-state">
                아직 이 학교의 안내 정보는 준비 중입니다.
              </p>
            )}

            {!isSchoolGuideLoading && !schoolGuideError && schoolGuide && (
              <article className="school-guide-card">
                <div className="condition-summary">
                  <h2>내 조건 요약</h2>
                  <dl className="condition-list">
                    <div>
                      <dt>비자 종류</dt>
                      <dd>{schoolGuideCondition?.visaType}</dd>
                    </div>
                    <div>
                      <dt>학교</dt>
                      <dd>{schoolGuideCondition?.schoolName}</dd>
                    </div>
                    <div>
                      <dt>한국어 수준</dt>
                      <dd>{schoolGuideCondition?.koreanLevel}</dd>
                    </div>
                    <div>
                      <dt>희망 근무 형태</dt>
                      <dd>{schoolGuideCondition?.workType}</dd>
                    </div>
                  </dl>
                </div>

                <div className="school-guide-content">
                  <h2>{getGuideText(schoolGuide.school_name)}</h2>
                  <dl className="school-guide-details">
                    <div>
                      <dt>학교 이름</dt>
                      <dd>{getGuideText(schoolGuide.school_name)}</dd>
                    </div>
                    <div>
                      <dt>담당 부서</dt>
                      <dd>{getGuideText(schoolGuide.office_name)}</dd>
                    </div>
                    <div>
                      <dt>요약</dt>
                      <dd>{getGuideText(schoolGuide.summary)}</dd>
                    </div>
                  </dl>

                  <div className="school-guide-block">
                    <h3>절차</h3>
                    {processSteps.length > 0 ? (
                      <ol>
                        {processSteps.map((step, index) => (
                          <li key={`${step}-${index}`}>{step}</li>
                        ))}
                      </ol>
                    ) : (
                      <p>정보 없음</p>
                    )}
                  </div>

                  <div className="school-guide-block">
                    <h3>필요 서류</h3>
                    {requiredDocuments.length > 0 ? (
                      <ul>
                        {requiredDocuments.map((document, index) => (
                          <li key={`${document}-${index}`}>{document}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>정보 없음</p>
                    )}
                  </div>

                  <div className="school-guide-block">
                    <h3>주의사항</h3>
                    <p>{getGuideText(schoolGuide.caution_notes)}</p>
                  </div>
                </div>
              </article>
            )}
          </section>
        )}
      </section>

      <section className="student-stores-section" aria-labelledby="stores-title">
        <div className="store-section-header">
          <p className="section-kicker">Friendly stores</p>
          <h2 id="stores-title">유학생 친화 가게</h2>
          <p>유학생이 일하기 좋은 조건을 가진 승인 가게를 확인해보세요.</p>
        </div>

        {isStoresLoading && (
          <p className="store-state" role="status">
            가게 정보를 불러오는 중입니다...
          </p>
        )}

        {!isStoresLoading && storesError && (
          <p className="store-state error" role="alert">
            가게 정보를 불러오지 못했습니다.
          </p>
        )}

        {!isStoresLoading && !storesError && stores.length === 0 && (
          <p className="store-state">아직 공개된 가게가 없습니다.</p>
        )}

        {!isStoresLoading && !storesError && stores.length > 0 && (
          <div className="store-grid">
            {stores.map((store, index) => (
              <article
                className="store-card"
                key={`${store.store_name}-${store.location}-${index}`}
              >
                <div className="store-card-header">
                  <span>{getStoreText(store.category)}</span>
                  <h3>{getStoreText(store.store_name)}</h3>
                </div>

                <dl className="store-details">
                  <div>
                    <dt>위치</dt>
                    <dd>{getStoreText(store.location)}</dd>
                  </div>
                  <div>
                    <dt>모집 포지션</dt>
                    <dd>{getStoreText(store.position)}</dd>
                  </div>
                  <div>
                    <dt>시급</dt>
                    <dd>{getStoreText(store.wage)}</dd>
                  </div>
                  <div className="store-friendly-point">
                    <dt>유학생에게 좋은 점</dt>
                    <dd>{getStoreText(store.student_friendly_points)}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

function RegisterStorePage() {
  const initialStoreForm = {
    store_name: '',
    category: '',
    location: '',
    position: '',
    wage: '',
    contact: '',
    student_friendly_points: '',
  }

  const [storeForm, setStoreForm] = useState(initialStoreForm)
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleInputChange(event) {
    const { name, value } = event.target

    setStoreForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    // Supabase에 보내기 전에 필수 입력값이 모두 채워졌는지 먼저 확인합니다.
    const hasEmptyRequiredValue = Object.values(storeForm).some(
      (value) => value.trim() === '',
    )

    if (hasEmptyRequiredValue) {
      setMessage('필수 입력값을 모두 입력해주세요.')
      return
    }

    setIsSubmitting(true)
    setMessage('등록 중...')

    // DB 컬럼 이름과 같은 key로 정리해두면 어떤 값이 저장되는지 바로 확인할 수 있습니다.
    const storePayload = {
      store_name: storeForm.store_name.trim(),
      category: storeForm.category.trim(),
      location: storeForm.location.trim(),
      position: storeForm.position.trim(),
      wage: storeForm.wage.trim(),
      contact: storeForm.contact.trim(),
      student_friendly_points: storeForm.student_friendly_points.trim(),
      status: 'pending',
    }

    try {
      const { error } = await supabase.from('stores').insert([storePayload])

      if (error) {
        throw error
      }

      setMessage('가게 등록이 완료되었습니다. 검토 후 공개됩니다.')
      setStoreForm(initialStoreForm)
    } catch (error) {
      console.error('가게 등록 실패:', error)
      setMessage('가게 등록에 실패했습니다. 입력값을 다시 확인해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="form-page">
      <SiteHeader compact />

      <section className="form-layout" aria-labelledby="store-title">
        <div className="form-intro">
          <p className="section-kicker">For owners</p>
          <h1 id="store-title">가게 등록하기</h1>
          <p>유학생에게 어필할 수 있는 가게 정보를 등록해보세요.</p>
        </div>

        <form className="form-card" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>가게 이름</span>
            <input
              name="store_name"
              type="text"
              placeholder="예: workin 카페"
              value={storeForm.store_name}
              onChange={handleInputChange}
            />
          </label>

          <label className="form-field">
            <span>업종</span>
            <input
              name="category"
              type="text"
              placeholder="예: 카페, 식당"
              value={storeForm.category}
              onChange={handleInputChange}
            />
          </label>

          <label className="form-field">
            <span>위치</span>
            <input
              name="location"
              type="text"
              placeholder="예: 서울 마포구"
              value={storeForm.location}
              onChange={handleInputChange}
            />
          </label>

          <label className="form-field">
            <span>모집 포지션</span>
            <input
              name="position"
              type="text"
              placeholder="예: 홀 스태프"
              value={storeForm.position}
              onChange={handleInputChange}
            />
          </label>

          <label className="form-field">
            <span>시급</span>
            <input
              name="wage"
              type="text"
              placeholder="예: 12,000원"
              value={storeForm.wage}
              onChange={handleInputChange}
            />
          </label>

          <label className="form-field">
            <span>연락처</span>
            <input
              name="contact"
              type="text"
              placeholder="예: 010-0000-0000"
              value={storeForm.contact}
              onChange={handleInputChange}
            />
          </label>

          <label className="form-field full">
            <span>유학생에게 어필할 점</span>
            <textarea
              name="student_friendly_points"
              placeholder="예: 시간표 조율 가능, 서류 협조 가능, 영어 응대 가능"
              rows="4"
              value={storeForm.student_friendly_points}
              onChange={handleInputChange}
            ></textarea>
          </label>

          <div className="form-actions">
            <button
              className="button primary"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? '등록 중...' : '가게 등록하기'}
            </button>
            <a className="button secondary" href={routeMap.home}>
              홈으로 돌아가기
            </a>
          </div>

          {message && (
            <p className="form-message" role="status">
              {message}
            </p>
          )}
        </form>
      </section>
    </main>
  )
}

export default App
