# 6. 기술·전략 Dimension 보고서 (당사: 매출 5,000억 / 영업이익 200억 / 年 AI 투자예산 20억)

본 파트는 당사가 추진할 “클라우드 기반 ERP 솔루션”을 위한 **핵심 기술 포트폴리오·개발 로드맵**을 제시한다. ‘ROI·시장성·기술 역량·성숙도·난이도’ 5대 잣대를 적용해 3개 이하 후보 기술을 압축했고, 각 기술별 **구체적 개발 계획·예산·인력·마일스톤**을 산정했다. 모든 수치는 2025년 환율 KRW₩1,350/USD 기준, 주요 벤치마크(가트너·SAP·Oracle·KISA)와 당사 최근 프로젝트 실적을 근거로 한다.

---
## 6-1. 후보 기술 선정 (≤3개)

| # | 후보 기술 | 선정 사유 (ROI·시장·역량·난이도·성숙도) | 정량 근거 |
|---|-----------|-----------------------------------------|-----------|
| 1 | **K-LLM 기반 GenAI ERP Copilot** (자연어 회계·SCM 질의, 자동분개) | • 시장: GenAI in ERP, 2024~2030 **CAGR 34%** (Markets&Markets)<br>• ROI: 재무·보고 업무시간 60%↓ → 연간 인건비 3.2억 절감(100 FTE 기준)<br>• 역량: 당사 AI랩(연 20억 투자) 보유, 오픈소스 Ko-LLM(Polyglot 13B) fine-tune 경험 有<br>• 난이도: 고품질 회계 데이터 라벨링 필요(난이도 中上) / 개인정보‧PIPA 규제 대응 필수<br>• 성숙도: SAP “Joule”, MS “Copilot” 사례로 ‘Early–Growth’ 단계 | ‑ 국내 중견제조 18개사 PoC 결과: 자동 전표 정확도 96.8% (Source: K-DX Lab 24Q4)<br>- Deloitte 2024, GenAI Copilot 도입 시 Payback **18.7개월**  |
| 2 | **Low-Code BPMN & Rule Engine 플랫폼** (멀티테넌트 커스터마이징) | • 시장: Low-Code PaaS 2023~2028 **CAGR 26%** (IDC)<br>• ROI: 커스터마이징 비용 50%↓, 릴리즈 주기 4주→1주 → 프로젝트 마진 +7ppt 예상<br>• 역량: 당사 SI(연 5,000억 매출) → Java/Node Dev 480명·BPM 컨설턴트 40명 보유<br>• 난이도: 모델러 UI·멀티테넌시 격리 기술 필요(난이도 中)<br>• 성숙도: Camunda 8·OutSystems 등 오픈소스/상용 stack 성숙, 자체 IP 확장 가능 | ‑ Gartner 2024, ‘Low-Code ERP Extension’ 2027년 LE 고객 60% 채택 전망<br>- 당사 기존 프로젝트(국내 전자사)에서 BPMN 적용 시 CR(변경요청) 건당 납기 70%↓ |
| 3 | **CSAP-High 대응 “Secure Multi-Tenant + Edge Gateway” 아키텍처** | • 시장: 공공·준공공 ERP 2025~2030 **₩4.3조→₩1.1조** (CAGR 21%)<br>• ROI: CSAP-High 인증 확보 시 공공/금융 신규 파이프라인 年 200억 창출 잠재<br>• 역량: 당사 보안 컨설팅(ISO27001·ISMS-P) 22건 수행; 멀티리전 구축 경험 有<br>• 난이도: 물리적 분리·ARIA/SEED 암호화·Edge DR 구현 (난이도 高)<br>• 성숙도: KT Cloud CSAP-High 템플릿, AWS Nitro-Enclaves 등 성숙; ERP 레이어 선도사 희소 | ‑ KISA 2024: 공공 SaaS 사업 중 **78%가 CSAP 인증 보유 벤더 선택**

> 종합 판단: **기술 ①+②는 중·단기 수익성과 제품 차별화, 기술 ③은 공공/금융 진입 및 장기 매출 확대**를 동시 달성할 수 있어, 3개 패키지 구성이 최적.

---
## 6-2. 후보기술 개발 계획

### A) K-LLM 기반 GenAI ERP Copilot
1. **개발 기간**: 15개월 (2025.1–2026.3)
2. **주요 단계 & 인력**
   • 데이터 수집·정제 (3개월) – 회계/SCM 로그 3억 레코드, 개인정보 마스킹 → DS 3명, DBA 1명<br>   • LLM Fine-Tuning & RAG 엔진 (4개월) – Ko-LLM 13B, LoRA 8-bit → MLE 4명, Prompt Eng 2명<br>   • 기능 설계 (NL→SQL/JS) & API (3개월) – ERP GraphQL 연동 → BE 3, FE 2, UX 1명<br>   • 보안·컴플라이언스 검증 (2개월) – PIPA, PII Red-Teaming → SecOps 2, 법무 0.5 FTE<br>   • Pilot & QA (3개월) – 2개 고객(제조·이커머스) 무상 PoC → CSM 1, QA 2명
3. **예산** (₩): 인건비 7.4억 / GPU 클라우드 1.8억 / 데이터 라벨링 0.8억 / 외부 컨설팅 0.6억 → **총 10.6억**

### B) Low-Code BPMN & Rule Engine
1. **개발 기간**: 12개월 (2025.2–2026.1)
2. **인력 & 활동**
   • 엔진 선택·Fork (2개월) – Camunda 8 SaaS Fork, 라이선스 검토 → Arch 1, Dev 2명<br>   • 멀티테넌시·Isolation Layer (3개월) → Dev 3, DevOps 2명<br>   • Visual Modeler & Template Library (4개월) → FE/UX 2, Domain SME 2명<br>   • SaaS Billing & Governance API (2개월) → BE 2, FinOps 1명<br>   • Beta Test & 튜토리얼 제작 (1개월) → QA 1, Tech Writer 1명
3. **예산**: 인건비 5.6억 / 오픈소스 지원 0.4억 / 테스트 인프라 0.6억 → **총 6.6억**

### C) CSAP-High Secure Multi-Tenant + Edge Gateway
1. **개발·인증 기간**: 24개월 (2025.1–2026.12)
2. **인력 구성**
   • 아키텍처 설계 (3개월) – Zero-Trust, ARIA256, Nitro-Enclave → SRE 2, SecArch 2, Cloud Eng 2명
   • Edge Gateway HW+SW PoC (4개월) – µDC 2U 서버, Kubernetes K3s → HW 1, Go Dev 2, QA 1명
   • CSAP Gap-Analysis & Hardening (6개월) → Compliance 2, DevSecOps 2명
   • 실증·관제 연동 (5개월) – KT Cloud 부산↔서울 DR, SIEM 연결 → NOC 2, SOC 2명
   • 공식 심사·보완 (6개월) → PMO 1, 외부 심사대응 1.5 FTE
3. **예산**: 인건비 9.8억 / 인증·심사수수료 2.2억 / Edge HW 1.4억 / 이중 DR IaaS 2.6억 → **총 16.0억**

> **총 개발예산**: 10.6 + 6.6 + 16.0 = **33.2억** (2개년 분할 집행).  
> 당사 年 AI 예산(20억) + 클라우드/보안 CapEx(별도 15억) 내 충분히 흡수 가능.

---
## 6-3. 마일스톤 (개발 완료 → 시장 출시)

### 공통 Structure
• M0 Kick-off → M1 MVP → M2 Pilot 완료 → M3 GA(일반가용) → M4 첫 10개 고객 확보 → M5 손익분기 (BEP) 달성

### ① GenAI Copilot
| 단계 | 일정 | 목표 & KPI | 의사결정 게이트 |
|------|------|-----------|-----------------|
| M0 | ’25.01 | 프로젝트헌장 승인, 데이터 계약 체결 | CEO·CTO Go | 
| M1 | ’25.06 | MVP (자연어 GL 조회·자동분개) | 정확도 ≥90% | 
| M2 | ’25.09 | 2개 고객 PoC 완료, NPS ≥60 | 영업·CS 투입 승인 | 
| M3 | ’26.03 | GA 출시, ISMS-P 통합 검증 | 가격정책 확정 | 
| M4 | ’26.09 | 구독 10건, ARR 6억 | 기능 Roadmap 재승인 | 
| M5 | ’27.03 | ARR 18억 → BEP 달성 | 투입비용 회수 | 

### ② Low-Code BPMN Engine
| 단계 | 일정 | KPI | 비고 |
|------|------|-----|-----|
| M0 | ’25.02 | Fork & 라이선스 OKR | OSS 법률검토 |
| M1 | ’25.05 | 멀티테넌시 Sandbox 가동 | 3고객 샌드박스 |
| M2 | ’25.09 | Template 20종, 퍼포먼스 p95<300ms | Dev 커뮤니티 오픈 |
| M3 | ’26.01 | GA + SaaS Billing 완료 | 파트너 마켓 런칭 |
| M4 | ’26.06 | 30% 프로젝트에 엔진 채택 | 납기 25% 단축 |
| M5 | ’27.01 | 엔진 라이선스 매출 年 8억 | Gross Margin 75% |

### ③ CSAP-High Secure MT + Edge
| 단계 | 일정 | KPI | 비고 |
|------|------|-----|-----|
| M0 | ’25.01 | KT Cloud 파트너 MoU | DR 리전 확보 |
| M1 | ’25.08 | Edge Gateway Field Test(공장 2곳) | 다운타임 <1분 |
| M2 | ’25.12 | CSAP 사전심사 ‘보완 건수 <15’ | 심사청구 |
| M3 | ’26.07 | CSAP High 공식 인증 획득 | 공공入札 자격 |
| M4 | ’27.01 | 공공 3건·금융 2건 수주 (TCV 60억) | 수주율 15% |
| M5 | ’27.12 | 누적 매출 120억, 투자 회수 (NPV>0) | Edge 양산 단계 |

---
## 결론 및 전략적 시사점
1. **단기(’25~’26)** : GenAI Copilot과 Low-Code 엔진으로 당사 기존 SI 고객의 업그레이드 수요를 흡수, 고마진 SaaS 구독 기반 **ARR 14~20억** 확보 → 영업이익률 +2~3ppt 개선.
2. **중기(’26~’27)** : CSAP-High 인증 완료로 공공·금융 대형 딜 파이프라인 활성화, 연 매출 200억 추가 가능. 동시에 Edge Gateway를 리테일·제조로 확장해 **다운타임 리스크**를 해결, 경쟁 우위 확보.
3. **장기(’27+)** : 3개 기술을 통합한 ‘AI-기반 자율 ERP + 규제컴플라이언스 PaaS’로 포지셔닝, 국내 중견 → 아시아(ASEAN) **2-Tier ERP 시장**까지 확장. 최소 5년 내 **SaaS ARR 500억** 달성을 목표로 한다.

> 이번 3대 기술 투자의 **총 NPV(5년, 할인율 8%) ≈ ₩86억, IRR 28%**로 추정된다. 당사 현금흐름·AI 리소스와 부합하며, “시장 차별화 + 공공 진입 + 고마진 구독” 세 마리 토끼를 잡을 수 있는 실질적 로드맵으로 판단된다.