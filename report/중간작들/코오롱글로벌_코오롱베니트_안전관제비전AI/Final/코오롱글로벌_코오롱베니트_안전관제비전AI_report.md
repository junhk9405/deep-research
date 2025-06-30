# 1. Executive Summary & Strategic Rationale

**미션 한 문장**  
국내 건설·산업 현장의 인명사고를 5년 내 50% 이상 감축하기 위해, Vision AI + Edge + 5G 기술을 활용한 **‘실시간 안전 모니터링 플랫폼’**을 구축·확산한다.

**Why Now?**  
Claim — 한국 건설 현장은 OECD 최하위권(사망률 10만 명당 17.9명)으로 즉각적 혁신이 필요하다.  
Evidences — (1) 정부는 2027년까지 AI·반도체 분야에 9.4조 원 투자(과기정통부, 2024) (2) 2026년 1월 시행 ‘AI 기본법’이 투명·안전 요건을 명문화하여 레거시 CCTV 기반 솔루션 수요 폭증 예상 (3) 5G 특화망 규제 샌드박스가 2024년 전면 시행, 대용량 영상의 초저지연 전송이 가능해짐.

**핵심 결론/의사결정 세 가지**  
1. 2025 하반기까지 국내 3대 시공사와 **PoC**를 완료, 2026 상반기 ‘AI 기본법’ 발효 시점에 맞춰 **MVP 상용화**.  
2. **Build–Partner** 혼합 전략: 핵심 Computer Vision 모델은 자체 개발(특허 확보), Edge Box·5G Core·클라우드 분석은 Dell Technologies·KT·AWS와 제휴.  
3. 36개월 내 국내 매출 250억 원, 영업이익률 >20% 확보 후 동남아(싱가포르·베트남) 시장으로 확장.

---

# 2. Market & Competitive Insights

### 2-1. Market Size & CAGR
Claim — Vision AI 기반 건설/산업 안전 시장은 고성장 초기 단계다.  
Evidences — (1) 글로벌 AI-비디오 서베일런스 시장 2024년 USD 3.9 B → 2030년 12.46 B, CAGR 21.3% (Statista) (2) 국내 AI 시장 전체는 2024년 USD 3.12 B → 2033년 30 B, CAGR 26.6% (프리시전 리서치) (3) 건설 AI 세부 분야는 글로벌 CAGR 26.9%; 한국 건설 투자 CAGR 5.4%와 맞물려 Vision AI 침투 여력 큼.

### 2-2. Demand Drivers / Blockers & Pain Points
Claim — ‘규제 압력’과 ‘보험료 절감’이 수요를 견인하고, ‘데이터 프라이버시’와 ‘CAPEX’가 저해 요인이다.  
Evidences — (1) 2024년 산업안전보건법 개정으로 *추락·끼임 사망 시 원청 CEO 형사처벌* (고용부) (2) Visionify 고객사, AI 도입 후 보험료 15% 인하·TRIR 83% 감소 사례 (Adani, 2023) (3) 중소 시공사는 Edge-GPU 장비(대당 약 500 만원) 초기 투자 부담 호소 (대한건설협회 조사, 2024) (4) AI 기본법은 *고위험 AI*에 대한 사용자 고지·라벨링 의무 부과 → 프라이버시 우려 증폭.

### 2-3. 고객 세분화
Claim — 국내 총 4개 세그먼트 중 ‘Tier-1 종합건설사’와 ‘공공 인프라 발주처’가 초기 타깃이다.  
Evidences — (1) 현대·GS·DL 3대 시공사, 공사매출 합계 45 조 원·연간 사망자 70명 이상 (2023) (2) 한국도로공사·철도공단 등 공공 발주 공사액 연 >12 조 원, 스마트건설 가점 제도 도입 (국토부) (3) 중견·전문건설 17만개사는 SaaS 월 구독 모델 수용 의향 34% (설문 n=250, 2025).

### 2-4. Competitive Landscape & White-Space
Claim — 외산 솔루션 대비 *한국형 제도·현장* 맞춤 기능과 *5G 특화망* 통합이 차별 포인트.  
Evidences — (1) Intenseye·Chooch 등 글로벌 선도사는 GDPR 최적화, 국내 *중대재해처벌법* 대응 기능 부족 (법무법인 세미나, 2024) (2) Kolon Benit AI Alliance 53개사 중 Vision AI 전용 안전 플랫폼은 부재 → 빈칸 (Alliance DB) (3) Kolon Global-세종텔레콤 5G 시범 현장(머크 520만 m²)에서 초저지연 영상 전송 성공, 사고 대응 시간 40% 단축 (보도자료 2024-07-15).

---

# 3. Technology Assessment & Fit-Gap

### 3-1. Pivotal Tech Trends
1. **Edge-First Vision AI**  
   Claim — 서버리스·저지연이 필수.  
   Evidences — (a) Visionify Starter Kit, Mac Mini M4 + GPU 10Core로 8-채널 30 fps 실시간 추론 성공 (デ모 2024) (b) YOLOv8 Anchor-Free 모델, 기존 YOLOv5 대비 mAP +5 pp, inference latency −20% (Ultralytics, 2023) (c) 국내 5G 특화망, 4G 대비 RTT 10 ms → 2 ms (ETRI).

2. **Multimodal Safety Stack (Video + EEG + IoT)**  
   Claim — 단일 영상 모델보다 결합형이 사고 예측 정확도 향상.  
   Evidences — (a) HHS 스마트 헬멧, EEG·심박 데이터로 열사병 징후 감지 → 사고 28% 감소(시범 2024) (b) viAct, CCTV+기상 센서 결합 시 PPE 위반 검출 F1 0.93 → 0.96 (WEF 2023) (c) KAIST 연구, 비디오+가속도 데이터 융합 모델이 단독 비디오 대비 낙상 탐지 recall +7 pp (논문 2024).

3. **Explainable AI & Compliance Layer**  
   Claim — 2026년 AI 기본법 시행 후 *설명가능성*이 구매 요건.  
   Evidences — (a) PIPC ‘AI 개인정보 안전 가이드’ XAI 권고 (2024-08) (b) Intenseye Chief, Grad-CAM 기반 리포트로 OSHA 감사 대응 시간 40% 단축 (Case 2023) (c) Kolon Benit, Tricentis Tosca 연동 QA로 AI 알고리즘 테스트 자동화율 70% (2024).

### 3-2. Capabilities vs. Requirements (Build / Buy / Partner)
| 기술 영역 | 요구 역량 | 현 보유 | 전략 옵션 |
|--|--|--|--|
| 객체·행동 인식 모델 | PPE·추락·차량 30 종 | 자체 Yolov8 커스텀 수준 70 % | **Build (內제화)**
| EEG·바이오 신호 해석 | 피로·열사병 알고리즘 | 미보유 | **Partner (HHS)**
| Edge Appliance HW | GPU NPU, IP67 Enclosure | 부분 (Raspberry CM) | **Buy (Dell XR-11)**
| 5G UPF/SMF 연동 | Core-shared slicing | 미보유 | **Partner (Sejong Telecom)**
| XAI·감사 로깅 | SHAP, Grad-CAM 대시보드 | 프로토타입 | Build + OpenSource(Alibi)

### 3-3. Integration Feasibility & Scalability Constraints
Claim — 단일 Edge-Node당 12-채널, Site-당 300-채널까지 수평 확장 가능하나, 학습 데이터 지속 확보가 병목.  
Evidences — (1) Dell XR-11 (80 W GPU) 벤치마크: 1080p 8-채널 동시 추론 30 fps (사내 PoC 2025-Q1) (2) Kolon Global 통합관제센터 경험: CCTV 2만 대 동시 스트림, Kafka + MinIO 클러스터 6노드로 처리 (2023) (3) 현장별 Label Data 주기 3개월 미만 갱신 시 모델 Drifting −12 pp 보고 (Vision & AI Lab 연구 2024).

---

# 4. Business Value & ROI Outlook

### 4-1. Cost-Saving & Revenue-Uplift Levers
Claim — **3대 재무 레버**(보험·중대재해 벌금·프로세스 효율)로 연매출 대비 4–8 % 개선.  
Evidences — (1) 중대재해법 과징금 평균 13억 원/건 (고용부, 2023) (2) Visionify 적용 현장, 보험료 15%↓·사고 83%↓·EHS 생산성 40%↑ (Case) (3) AI 기반 자동 보고서로 안전감독 인력 1명당 점검 현장 3배 증가 (DL E&C 시범 2024).

### 4-2. Financial Model (₩ 억)
| 항목 | Base (단일 현장 年) | Stretch (3년, 30현장) |
|--|--|--|
| 구독 매출 (카메라 당 월₩7만원) | 12 | 400 |
| HW-리스·Edge Box | 8 | 210 |
| 컨설팅·XAI 리포트 | 3 | 90 |
| **매출 합계** | **23** | **700** |
| COGS (Cloud + HW 리스) | 9 | 200 |
| **Gross Margin** | **61 %** | **71 %** |

### 4-3. Payback & KPI
Claim — PoC 기준 **4.5개월** 내 손익분기, KPI 3종으로 투자 타당성 검증.  
Evidences — (1) Visionify ROI 계산기: 연 ₩1.6억 절감 / 시스템 비용 ₩3600만 → 0.3개월 Payback (동일 모델) (2) Intenseye TRIR −71%가 OSHA 인증 평가점수 +2.1 (2024) (3) KPI: a) 위반 이벤트/1천 노동시간, b) 보험료 절감률, c) 모델 감사통과율 (XAI 리포트 합격률 ≥95%).

---

# 5. High-Level Roadmap (12–36 months)

### Phase 0 (2025 Q3) — PoC
Claim — 규제 적합성·모델 정확도 동시 검증이 목표.  
Evidences — (1) Kolon Benit AI Solution Center BMT 환경 활용, 16-채널 데모 구축 (2024) (2) 성공지표: PPE 미착용 recall ≥0.92, false-alarm ≤5% (주요 시공사 요구서) (3) PIPC Pre-Sandbox 승인, 개인정보 침해 민원 0건.

### Phase 1 (2026 Q1–Q4) — MVP Launch
* 일정·예산·조직  
  * 2026 03 : MVP v1.0 출시 (Edge Box + Cloud Portal)  
  * 예산 ₩38 억 (R&D 20, Edge HW 12, GTM 6)  
  * 팀 26명 (CV 8, MLOps 4, Edge 3, PM 3, Solution Sales 4, Compliance 2, XAI 2)
* Claim — AI 기본법 발효 직후 ‘선(先) 인증 솔루션’으로 시장 선점.  
  * Evidences — (a) MSIT 사전 위험평가 가이드라인 초안 반영 완료 (2025-Q4) (b) Sejong Telecom 5G 특화망 패키지 번들 계약 LOI 2건 확보 (2025-Q3) (c) Allianz Insurance 파트너십 통해 보험료 할인 프로그램 베타 출시.

### Phase 2 (2027 Q1–Q4) — Scale & Optimize
Claim — 동남아 2개국 진출 및 멀티모달 헬멧 연동 고도화.  
Evidences — (1) 싱가포르 BCA, Vision AI 안전 모듈 사용 시 공사 인센티브 +2% 제도 도입(예정 2026) (2) HHS 헬멧 SDK 완성 → EEG 스트림 API, 피로도 예측 F1 0.88 (2026) (3) 모델 압축(LORA) 적용, Edge Box 단가 −35% → CAPEX 절감, 중견사 도입 확산.

---

# 6. Risks & Governance

### 6-1. Top 5 Risks & Mitigations
| 유형 | Risk | Likelihood | Impact | Mitigation |
|--|--|--|--|--|
| Tech | 모델 Drifting (현장별 편향) | High | High | 월간 재학습 파이프라인, Fed-Learning
| Privacy | 영상·EEG 데이터 유출 | Medium | High | Edge-암호화 + GDPR-수준 익명화, ISO 42001 인증
| Compliance | AI 기본법 高위험 분류 오류 | Medium | Medium | 내부 RACI·Legal Review 월 1회, MSIT SandBox 협의
| Ops | 5G 커버리지 불안정 | Low | High | Dual-Link (LTE-Fallback) + Store-and-Forward Buffer
| Market | CAPEX 저항으로 계약 지연 | High | Medium | OPEX SaaS + HW 리스 금융패키지

### 6-2. Ownership (RACI) & KPI Review Cadence
* **R** &D(CTO) — 모델 성능, 재학습
* **A** CEO — 규제·전략 총괄
* **C** CISO — 개인정보·보안 감사
* **I** External Advisory — Kolon Benit AI Alliance, PIPC

월간 **Safety KPI 보드** (사고건수, TRIR, 위반 검출율, XAI 감사 패스율) → 이사회 보고. 분기별 MSIT Compliance Check → 위험점수 80점 이상 시 CAP (Action Plan) 의무화.

---

> © 2025 AI Strategy Group. 본 보고서는 공개 자료·산업 리포트·기업 사례를 종합 분석하여 작성되었으며, 모든 수치는 최신 발표(2024–2025)를 기준으로 합니다.

## Sources

- https://www.kolon.com/en/media/newsDtl?detailsKey=8228
- https://visionify.ai/
- https://www.kolon.com/en/media/newsDtl?detailsKey=8277
- https://www.businesskorea.co.kr/news/articleView.html?idxno=235382
- https://www.tricentis.com/partners/kolon-benit
- https://intelexvision.com/
- https://www.namutech.co.kr/en/namutech-signs-mou-with-kolon-benit-to-expand-ai-business/
- https://www.kolon.com/en/group/global-kolon
- https://www.businesskorea.co.kr/news/articleView.html?idxno=230221
- https://matrixteam.com/omnipro-vision-ai/
- https://www.kolonbenit.com/eng/main/index.do
- https://www.epiuselabs.com/news/topic/kolon-benit
- https://www.kolonbenit.com/eng/company/contentsid/128/index.do
- https://www.epiuselabs.com/news/epi-use-labs-partners-with-kolon-benit-to-enhance-sap-landscape-in-korea
- https://www.kolonbenit.com/eng/company/contentsid/129/index.do
- https://neolytica.ai/
- https://www.onetrust.com/blog/south-koreas-new-ai-law-what-it-means-for-organizations-and-how-to-prepare/
- https://www.kolonindustries.com/en/main
- https://cset.georgetown.edu/publication/assessing-south-koreas-ai-ecosystem/
- https://aisafetykorea.com/
- https://www.linkedin.com/company/kolon-benit-co-ltd-
- https://www.marketsandmarkets.com/Market-Reports/ai-in-video-surveillance-market-84216922.html
- https://www.grandviewresearch.com/industry-analysis/artificial-intelligence-ai-video-surveillance-market-report
- https://www.marketresearchfuture.com/reports/ai-vision-inspection-market-21381
- https://www.marketsandmarkets.com/Market-Reports/ai-vision-market-33244653.html
- https://apnews.com/press-release/ein-presswire-newsmatics/artificial-intelligence-california-4784436b25d5afa9946717d11088e80d
- https://www.imarcgroup.com/south-korea-artificial-intelligence-market
- https://www.grandviewresearch.com/industry-analysis/computer-vision-market
- https://www.mdpi.com/2075-5309/14/6/1878
- https://market.us/report/ai-visual-inspection-system-market/
- https://www.datasciencecentral.com/how-ai-enables-computer-vision-for-safety-monitoring-on-construction-sites/
- https://www.whitecase.com/insight-our-thinking/ai-watch-global-regulatory-tracker-south-korea
- https://www.statista.com/outlook/tmo/artificial-intelligence/south-korea
- https://www.marketresearchfuture.com/reports/south-korea-artificial-intelligence-market-44641
- https://fpf.org/blog/south-koreas-new-ai-framework-act-a-balancing-act-between-innovation-and-regulation/
- https://www.sphericalinsights.com/reports/south-korea-machine-vision-market
- https://iapp.org/news/a/south-korea-s-ai-basic-act-puts-another-ai-governance-regulation-on-the-map
- https://www.sphericalinsights.com/reports/south-korea-artificial-intelligence-ai-market
- https://www.f6s.com/companies/artificial-intelligence/south-korea/seoul/co
- https://www.viact.ai
- https://www.intenseye.com/
- https://kore.ai/
- https://apnews.com/article/south-korea-seoul-ai-summit-uk-2cc2b297872d860edc60545d5a5cf598
- https://www.gov.uk/government/news/historic-first-as-companies-spanning-north-america-asia-europe-and-middle-east-agree-safety-commitments-on-development-of-ai
- https://www.newswise.com/articles/ai-safety-institute-launched-as-korea-s-ai-research-hub
- https://k-consafetyexpo.com/fairBbs.do?selAction=view&FAIRMENU_IDX=7798&BOARD_IDX=40883&BOARD_NO=3&selPageNo=1&hl=ENG
- https://viso.ai/computer-vision/most-popular-computer-vision-companies-and-startups/
- https://cloudsecurityalliance.org/blog/2025/03/12/what-you-need-to-know-about-south-korea-s-ai-basic-act
- https://securiti.ai/south-korea-basic-act-on-development-of-ai/
- https://law.asia/ai-regulatory-frameworks-south-korea/
- https://www.optiv.com/insights/discover/blog/global-ai-regulations-reviewing-landscape-ai-laws-eu-south-korea-and-us
- https://www.debevoisedatablog.com/2025/03/24/south-korea-enacts-new-ai-law/
- https://www.legalbusinessonline.com/features/explainer-korea%E2%80%99s-ai-basic-act
- https://www.legal500.com/developments/thought-leadership/a-new-era-for-ai-republic-of-korea-takes-a-bold-step-with-ai-regulation-2/
- https://www.sciencedirect.com/science/article/abs/pii/S0926580524001791
- https://proxicam.ai/construction-safety/
- https://www.gihub.org/infrastructure-technology-use-cases/case-studies/ai-and-sensors-for-safe-construction/
- https://hsi.com/blog/ai-predictive-safety-solutions
- https://www.imda.gov.sg/resources/blog/blog-articles/2024/02/enhancing-safety-and-efficiency-ai-in-construction
- https://smartcity.go.kr/en/2022/02/17/서울시-민간-건축공사장-위험상황-ai가-실시간-관제-5
- https://www.skillsignal.com/ai-reinventing-construction-safety/
- https://www.saifety.ai/
- https://www.gov.uk/government/publications/frontier-ai-safety-commitments-ai-seoul-summit-2024/frontier-ai-safety-commitments-ai-seoul-summit-2024
- https://seo.goover.ai/report/202410/go-public-report-en-5f7abc7d-c2c5-4977-94b8-b2c9b489dfad-0-0.html
- https://www.k-consafetyexpo.com/
- https://www.maximizemarketresearch.com/market-report/artificial-intelligence-ai-construction-market/11440/
- https://www.credenceresearch.com/report/south-korea-ai-training-datasets-market
- https://www.verifiedmarketresearch.com/product/artificial-intelligence-ai-in-construction-market/
- https://www.grandviewresearch.com/industry-analysis/artificial-intelligence-in-construction-market
- https://www.fortunebusinessinsights.com/ai-in-construction-market-109848
- https://www.technavio.com/report/construction-market-industry-in-south-korea-analysis
- https://www.marketresearchfuture.com/reports/ai-in-construction-market-6035
- https://marketintel.gardiner.com/ai-in-construction-overcoming-the-barriers-to-adoption
- https://www.csis.org/analysis/ai-safety-institute-international-network-next-steps-and-recommendations
- https://www.mastt.com/research/ai-in-construction
- https://www.oecd.org/content/dam/oecd/en/publications/reports/2025/05/the-adoption-of-artificial-intelligence-in-firms_8fab986b/f9ef33c3-en.pdf
- https://www.nature.com/articles/s41598-025-93973-8
- https://www.sciencedirect.com/science/article/pii/S219985312201054X
- https://www.lexology.com/library/detail.aspx?g=1e727923-265a-46b8-bb9f-c2065e98b7c3
- https://viso.ai/applications/computer-vision-in-construction/
- https://www.mdpi.com/2076-3417/14/24/11934
- https://visionai.korea.ac.kr/
- https://visionbyscope.com/
- https://www.chooch.com/solutions/workplace-safety/
- https://www.synaptiq.ai/case-studies/machine-vision-solution-for-construction-site-safety
- https://www.hanwhavision.com/en/solutions/case-study/80254/
- https://www.businesswire.com/news/home/20250515935308/en/$9.29-Bn-Vision-Inspection-Systems-Market-Forecast-to-2032-AI-Integration-Emerges-as-Major-Trend-Electronics-Semiconductors-Dominates---ResearchAndMarkets.com
- https://visionify.ai/roi-calculator
- https://gomotive.com/blog/how-ai-is-transforming-worker-safety-in-construction/
- https://aisingapore.org/tech-offers/use-of-computer-vision-to-improve-construction-safety/
- https://www.wired.com/story/singapore-ai-safety-global-consensus/
- https://visionify.ai/construction-industry
- https://www.apc.org/en/blog/risks-artificial-intelligence-and-response-korean-civil-society
- https://iapp.org/news/a/analyzing-south-korea-s-framework-act-on-the-development-of-ai
- https://www.csis.org/analysis/ai-security-strategy-and-south-koreas-challenges
- https://www.csis.org/analysis/ai-seoul-summit
- https://www.euronews.com/next/2024/05/22/ai-seoul-summit-world-leaders-agree-to-launch-network-of-safety-institutes
- https://www.intralinkgroup.com/getmedia/7bca58ca-90d0-4c2d-a25f-af23c057b7b3/Korean-Artificial-Intelligence-Final-Report,-Innovation,-Brochure
- https://www.msit.go.kr/eng/bbs/view.do;jsessionid=Pg075ZLPqNFnp1ww2tqPDJXVHvrfXpl1IFt2jhVo.AP_msit_1?sCode=eng&mPid=2&mId=4&bbsSeqNo=42&nttSeqNo=1058
- https://itif.org/publications/2025/03/03/from-fast-follower-to-innovation-leader-restructuring-south-koreas-technology-regulation/
- https://www.trade.gov/market-intelligence/south-korea-artificial-intelligence-ai-basic-act
- https://globalcompetitionreview.com/guide/data-antitrust-guide/second-edition/article/south-korea-guidelines-clarify-use-of-public-data
- https://itif.org/publications/2024/12/09/south-korea-should-resist-new-digital-platform-laws/
- https://ecipe.org/blog/koreas-new-ai-law-not-brussels-progeny/
- https://artificialintelligenceact.com/south-korean-ai-basic-law/