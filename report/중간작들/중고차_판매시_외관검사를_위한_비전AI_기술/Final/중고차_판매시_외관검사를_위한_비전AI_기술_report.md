# 1. Executive Summary & Strategic Rationale

**미션 한 줄 요약**  
“우리는 비전 AI 기반 중고차 외관 검사 플랫폼을 36개월 내 국내 표준으로 자리매김하여, 거래 투명성과 운영 효율을 동시에 혁신한다.”

**Why Now? (적시성 근거)**  
1) 글로벌 중고차 시장은 연평균 14% 이상 성장하며 온라인·모바일 중심 거래가 급속히 확대되고 있다.  
2) AI 비전 검사 시스템 시장은 2024~2033년 15.8% CAGR로 성장, 하드웨어 원가 하락과 GPUaaS 확산으로 초기 진입장벽이 빠르게 낮아지고 있다.  
3) 2025년 1월 ‘AI 기본법’ 시행으로 **프라이버시 보호·책임성 요건**이 명문화돼, 개인정보 비식별화 특허(10-2024-0085473) 등 **규제 대응형 솔루션**을 선점한 기업이 경쟁우위를 확보한다.

**의사결정 3가지 포인트**  
① 12개월 내 PoC(파일럿)에서 **검출 정확도 ≥ 92 % & 처리 시간 ≤ 60 초**를 달성할 기술 로드맵 확정  
② Build–Buy–Partner 중 **저지연 Edge AI 엔진 자체 개발 + 클라우드 모델 튜닝은 파트너 협력**의 하이브리드 전략 채택 여부  
③ 초기 B2B(보험·렌터카) vs. B2C(플랫폼 직거래) 우선 공략군을 결정해 자금·인력 집중

---

# 2. Market & Competitive Insights

### 2.1 시장 규모 & 성장률
- **AI 차량 검사 시스템 세계시장**: 2024년 19억 달러 → 2033년 69억 달러(15.8 %CAGR).  
- **AI 비전 검사(산업 전반)**: 2024년 258억 달러 → 2034년 1,965억 달러(22.5 %CAGR).  
- **국내 중고차 거래량**: 연 386만 대(2024년, 국토부 등록 기준)·온라인 비중 41 %로 빠르게 상승.  
- 한국 내 비전 AI 도입 TAM(총유효시장) 추정: 연 1,200억 원(검사 건당 4,000 원 × 차량 3,000만 대 중 잠재 10 %).

### 2.2 수요 견인·저해 요인 & 고객 Pain Point
| 구분 | 주요 내용 | 전략적 시사점 |
|------|-----------|---------------|
|Pain 1|검사 결과의 **주관성·편차**|AI 기반 표준화 리포트 필요|
|Pain 2|평균 검사 소요 시간 20~30분|모바일 셀프-스캔 2분 내 목표 설정|
|Pain 3|보험·리스 리턴시 **과다 수리비 청구 분쟁**|손해율 개선·Fraud 체크 모듈 제공|
|Blocker|고가 장비·GPU 비용|Edge 경량화+GPUaaS로 CapEx ↓|
|Driver|ADAS·EV 확산으로 부품 복잡성 증가|고해상도 멀티센서·3D 모델링 수요 증가|

### 2.3 주요 경쟁사 3곳 심층 프로파일
| 항목 | UVeye | Inspektlabs | Ravin AI |
|------|--------|-------------|----------|
|비즈니스 모델|고정식 하드웨어+SaaS 라이선스(건당) | API 퍼 스트 검사 SaaS | 모바일·CCTV 변환 하이브리드|
|주요 고객|Volvo, GM, Toyota | Liberty Mutual, BMW | Hertz, Mercedes|
|기술 강점|0.1 mm 정밀도·3D 모델링 | 95~99 % 정확도·Fraud AI | RepairIQ™ 견적 알고리즘|
|약점|CapEx 高, 실내 라인 필요 | 하드웨어 제약 無 but UI 단순 | 가격 高, 리스·OEM 편중|
|White-space|모바일 Edge AI·Korean OCR | GDPR + 한국 개인정보 규제 준수 | 저가형 SME 플랜 부재|

**화이트스페이스**  
국내 법·제도(개인정보 비식별, 중대재해법) 친화 설계, **모바일 Edge 경량 엔진** 및 **국문 OCR·번호판 인식** 특화가 경쟁 공백으로 확인된다.

---

# 3. Technology Assessment & Fit-Gap

### 3.1 핵심 기술 트렌드 3가지
1. **Edge-Optimized Vision Transformer**: FP16→FP8 저정밀 연산, Jetson Orin 60 FPS 실시간 처리.  
2. **Privacy-Preserving Vision (PPV)**: 차량 표면 반사 얼굴·문서 검출 → 블러링·인페인팅 자동화.  
3. **Blockchain-backed Damage Passport**: 검사 이력 해시 저장, 위·변조 불가 Vehicle NFT 형태.

### 3.2 요구사항 vs. 현 보유역량 (Build/Buy/Partner)
| Capability | Importance | 현 수준 | Gap | 전략 |
|------------|-----------|---------|-----|------|
|Scratch/Dent 세분 검출 | ★★★★★ | 88 % mAP | ‑4 %p | 자체 CNN + 데이터 증강 Build |
|한국어 번호판 OCR | ★★★★☆ | 75 % 정확 | ‑15 %p | Naver CLOVA OCR 파트너 |
|실시간 Edge 추론 | ★★★★☆ | 45 FPS | +15 FPS | NVIDIA Jetson Buy |
|GDPR/개인정보 마스킹 | ★★★★☆ | 특허 보유 | — | Build(강점)|
|3D Undercarriage 스캔 | ★★★☆☆ | 부재 | 신규 | UVeye SDK 라이선스 협업|

### 3.3 통합·확장성 제약
- **Legacy DMS 연동**: 중견 딜러사의 구형 Oracle DB → REST/Webhook 변환 어댑터 필요.  
- **GPU 리소스 스파이크**: 월말 거래 집중 시 동시 추론 10 배 상승,  
  ‑> autoscaling + QAT(Quantization-Aware-Training)로 vGPU 30 % 절감.  
- **모바일 네트워크 지연**: 5 G 미지원 지역 18 % → Edge-first & 지연 tolerant 디코딩 알고리즘 적용.

---

# 4. Business Value & ROI Outlook

### 4.1 비용 절감·매출 상승 레버
1. **검사 인건비 절감**: 현행 1건 15,000 원 → AI 4,000 원, 건당 73 % 절감.  
2. **보험 손해율 개선**: Fraud AI로 허위·중복 청구 8 % 차단, 연간 30억 원 손실 방지.  
3. **차량 회전율 가속**: 검사 소요 30분→2분, 재고 일수 5일 단축→금융 이자비 12 % 절감.

### 4.2 재무 모델(단위: 억 원)
| 시나리오 | ’26 매출 | EBITDA | CAPEX(누적) | IRR | Payback |
|----------|---------|--------|------------|-----|---------|
|Base(시장점유 3 %)| 120 | 28 | 60 | 24 % | 32 개월 |
|Stretch(점유 7 %)| 270 | 88 | 80 | 46 % | 22 개월 |

### 4.3 헤드라인 KPI  
- **First-Pass Yield(정확 검출률)** ≥ 94 %  
- **Avg. Inspection Time** ≤ 90 초  
- **Churn Rate(딜러)** < 5 % (연간)

---

# 5. High-Level Roadmap (12–36 개월)

| Phase | 기간 | 핵심 목표 | 예산 | 인력 구상 |
|-------|------|----------|------|----------|
|0 PoC|M0–M6|정확도 92 %, 처리 60 초 달성 | 8 억 | Data Scientist 4, MLOps 2, 딜러 Pilot 3|
|1 MVP|M7–M18|모바일 App + API 상용화, B2B 2곳 계약| 22 억 | 총 15명(Dev 7·Sales 4·QA 2·PM 2)|
|2 Scale|M19–M36|전국 딜러 300곳, 월 20만 건 처리| 50 억 | 40명(Edge 팀 증설, CS, Compliance)|

**주요 마일스톤 세부**  
- M3 : 데이터셋 50만 장 수집 완료  
- M9 : 개인정보 비식별 인ference 모듈 특허 출원  
- M15 : 보험사 API 연계(손해사정)  
- M30 : Blockchain Vehicle Passport 베타 출시

---

# 6. Risks & Governance

### 6.1 Top 5 리스크 및 완화책
| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|-----------|
|R1|검출 오차로 소비자 분쟁| M | H | Human-in-the-loop 재검 + KPI(≤0.5 % 재심 요청)|
|R2|개인정보 노출 GDPR/개인정보보호법 위반| L | H | PPV 모듈, 데이터 암호화·접근통제 ISO 27001 준수|
|R3|GPU 공급난·비용 급등| M | M | 멀티-클라우드 + AMD MI350 옵션, QAT 활용|
|R4|레거시 시스템 연동 실패| M | M | API 게이트웨이·ETL 템플릿 사전 구축|
|R5|인력 확보 난항(ML·CV 전문가)| H | M | 산학(고려대 Vision Lab) 인턴 파이프라인·RSU 스톡옵션|

### 6.2 Ownership & 통제 구조(RACI)
| Function | Responsible | Accountable | Consulted | Informed |
|----------|-------------|------------|-----------|----------|
|Model Dev | AI Lead | CTO | Univ Lab | CEO, Audit |
|Edge HW | HW Mgr | CTO | NVIDIA Partner | CFO |
|Compliance| CISO | CEO | Legal Adviser | Board |
|Sales Ops | Sales Head | COO | Key Dealers | All Staff |

**모니터링 Cadence**  
- **월간**: KPI Dashboard 리뷰(정확도·MTTR·건수).  
- **분기**: 기술·보안 감사 + 로드맵 리밸런싱.  
- **연간**: 전략 리트리트, 규제 변화 영향평가.

---

> 본 보고서는 공개·사내 데이터, 산업 리포트(2025 Q2 기준) 및 특허·규제 정보를 종합해 작성되었으며, 모든 수치는 최신 환율과 시장 가정을 반영한 추정치입니다. 추가 정밀 타당성 조사는 PoC 단계에서 별도 수행해야 합니다.


## Sources

- https://www.spglobal.com/mobility/en/info/kr/forecast-analysis.html
- https://m.giikorea.co.kr/report/bzc1279882-global-automotive-predictive-technology-market.html
- https://www.spglobal.com/mobility/en/products/vehicle-market-analysis-ko.html
- https://www.giikorea.co.kr/report/sky1605271-used-cars-market-size-share-growth-analysis-by.html
- https://auto.danawa.com/auto/?Work=record
- https://www.fortunebusinessinsights.com/industry-reports/artificial-intelligence-market-100114
- https://www.giikorea.co.kr/report/sky1566150-automotive-aftermarket-market-size-share-growth.html
- https://www2.deloitte.com/content/dam/Deloitte/kr/Documents/consumer-business/2024/kr-2024-global-automotive-consumer-study.pdf
- https://straitsresearch.com/report/logistics-automation-market
- https://www.katech.re.kr/download/98036f81-b45c-43d0-a832-02ffc6ae5226;jsessionid=F402D68FDA43AC6591C3FA3830BE64BB
- https://market.us/report/ai-vehicle-inspection-system-market/
- https://www.gminsights.com/industry-analysis/ai-vehicle-inspection-system-market
- https://market.us/report/ai-visual-inspection-system-market/
- https://www.meticulousresearch.com/product/vision-inspection-systems-market-5973
- https://www.marketresearchfuture.com/reports/ai-vision-inspection-market-21381
- https://www.businesswire.com/news/home/20250515935308/en/$9.29-Bn-Vision-Inspection-Systems-Market-Forecast-to-2032-AI-Integration-Emerges-as-Major-Trend-Electronics-Semiconductors-Dominates---ResearchAndMarkets.com
- https://www.psmarketresearch.com/market-analysis/machine-vision-systems-and-components-market
- https://www.thebusinessresearchcompany.com/report/automatic-visual-inspection-systems-global-market-report
- https://market.us/report/north-america-ai-visual-inspection-system-market/
- https://www.grandviewresearch.com/industry-analysis/machine-vision-market
- https://www.ravin.ai/
- https://www.aboutamazon.com/news/transportation/amazon-automated-vehicle-inspection
- https://binariks.com/blog/ai-car-damage-detection/
- https://inspektlabs.com/
- https://monk.ai/
- https://mobisoftinfotech.com/resources/blog/role-of-ai-in-vehicle-inspection-process
- https://inspektlabs.com/blog/top-10-ai-powered-car-damage-inspection-solutions-2/
- https://focalx.ai/
- https://siliconcanals.com/focalx-vision-ai-cloud-vehicle-inspection-technology/
- https://www.assemblymag.com/articles/96075-ai-based-vision-technology-aids-vehicle-inspection
- https://www.ibm.com/products/maximo/asset-inspection
- https://cloud.google.com/vision
- https://www.flexiblevision.com/
- https://www.cjolivenetworks.co.kr/tech/ai_vision
- https://www.autoelectronics.co.kr/article/articleView.asp?idx=2114
- https://aiseoul2025.com/home/
- https://file.kdb.co.kr/fileView?groupId=E49EC0E6-F243-5B37-9586-D097FD724BD2&fileId=59D62619-83C0-01EC-F6FC-83BCAAC00856
- https://edu.google.com/intl/ALL_us/future-of-the-classroom/emerging-technologies/
- https://www.keysight.com/us/en/solutions/emerging-technologies.html
- https://koreadeep.com/blog/비전-ai
- https://www.pwc.com/kr/ko/insights/industry-focus/essential-eight-technologies.html
- https://www.samsungsds.com/kr/insights/ai-semiconductor.240306.html
- https://www.marketsandmarkets.com/Market-Reports/automated-optical-inspection-system-market-179056156.html
- https://www.grandviewresearch.com/industry-analysis/computer-vision-market
- https://www.marketsandmarkets.com/Market-Reports/ai-in-computer-vision-market-141658064.html
- https://epoch.ai/data/ai-benchmarking-dashboard
- https://www.nvidia.com/en-us/data-center/resources/mlperf-benchmarks/
- https://www.microsoft.com/en-us/research/blog/predicting-and-explaining-ai-model-performance-a-new-approach-to-evaluation/
- https://www.technologyreview.com/2025/03/11/1113000/these-new-ai-benchmarks-could-help-make-models-less-biased/
- https://arxiv.org/html/2502.06559v1
- https://www.amd.com/en/newsroom/press-releases/2025-6-12-amd-unveils-vision-for-an-open-ai-ecosystem-detai.html
- https://artificialanalysis.ai/models
- https://www.spiceworks.com/tech/artificial-intelligence/articles/are-ai-benchmarks-reliable/
- https://ourworldindata.org/artificial-intelligence
- https://aiindex.stanford.edu/report/
- https://www.iitp.kr/resources/file/201217/4.%EC%9D%B8%EA%B3%B5%EC%A7%80%EB%8A%A5_SW_%EC%9E%90%EC%9C%A8%EC%A3%BC%ED%96%89%EC%9E%90%EB%8F%99%EC%B0%A8%EB%B3%B4%EA%B3%A0%EC%84%9C.pdf
- https://m.riss.kr/search/detail/ssoSkipDetailView.do?p_mat_type=be54d9b8bc7cdb09&control_no=68d4ddb2e5fba3d4ffe0bdc3ef48d419
- https://dl.kotra.or.kr/pyxis-api/2/digital-files/6ae404aa-e10d-4d43-92f0-6b4ae1ec974d
- https://www.codil.or.kr/filebank/original/RK/OTKCRK200197/OTKCRK200197.pdf
- https://www.samsungsds.com/kr/insights/regtech_1.html
- https://1rs.io/2020/06/16/managing-risk-and-regulation-in-the-automotive-industry/
- https://www.law.go.kr/행정규칙/전기자동차보급대상평가에관한규정
- https://www.koit.co.kr/
- https://ktc.re.kr/web_united/board/view_season_02.asp?pagen=590&sno=3177&paging=1
- https://eng.kotsa.or.kr/eng/vehicle/advanced.do?menuCode=02050000
- https://mobilityforesights.com/product/ai-vehicle-inspection-system-market/
- https://chisw.com/blog/ai-in-car-inspections/
- https://autovista.ai/
- https://www.automotive-fleet.com/10242203/ai-redefining-vehicle-inspections
- https://en.wikipedia.org/wiki/Vehicle_registration_plates_of_South_Korea
- https://visionai.korea.ac.kr/
- https://www.navymwrbusan.com/transportation/personal-vehicle
- https://www.ptc.com/en/technologies/augmented-reality/inspection/visual-inspection
- https://partnershiponai.org/resource/risk-mitigation-strategies-for-the-open-foundation-model-value-chain/
- https://www.ibm.com/think/insights/ai-risk-management
- https://www.deloitte.com/us/en/insights/topics/digital-transformation/four-emerging-categories-of-gen-ai-risks.html
- https://www.weforum.org/stories/2024/09/10c45559-5e47-4aea-9905-b87217a9cfd7/
- https://www.ibm.com/think/insights/10-ai-dangers-and-risks-and-how-to-manage-them
- https://ai.wharton.upenn.edu/white-paper/artificial-intelligence-risk-governance/
- https://hbr.org/2024/05/4-types-of-gen-ai-risk-and-how-to-mitigate-them
- https://www.ultralytics.com/glossary/bias-in-ai
- https://spyro-soft.com/blog/geospatial/geoai-in-identifying-environmentalrisks-and-mitigation-strategies
- https://www.healthandsafetyinternational.com/article/1912336/dangers-data-ai-visions-role-forecasting-site-risks
- https://biz.chosun.com/site/data/html_dir/2020/12/10/2020121002273.html
- https://www.cio.com/article/3502291/자동차-분야-ai-연간-55-초고속-성장-전망-gmi.html
- https://m.blog.naver.com/PostView.naver?blogId=santalsm&logNo=110185111117
- https://www.autoelectronics.co.kr/article/articleView.asp?idx=3207
- https://cio.com/article/4003478/ai의-roi-과대포장보다-실질적인-효과가-중요한-이유.html
- https://blog.skby.net/bia-business-impact-analysis/
- https://www.itworld.co.kr/news/220434
- https://www.clarifai.com/blog/how-to-calculate-the-roi-of-automated-visual-inspection
- https://qualitastech.com/quality-control-insights/what-will-be-your-roi-of-a-machine-vision-system/
- https://cloud.google.com/solutions/visual-inspection-ai
- https://degould.com/auto-compact/
- https://www.salesforce.com/automotive/artificial-intelligence/guide/
- https://appinventiv.com/blog/ai-in-automotive-industry/
- https://www.itransition.com/ai/automotive
- https://roboflow.com/industries/automotive
- https://www.reuters.com/business/autos-transportation/honda-backed-helmai-unveils-vision-system-self-driving-cars-2025-06-19/
- https://blog.roboflow.com/computer-vision-automotive-manufacturing/
- https://builtin.com/artificial-intelligence/artificial-intelligence-automotive-industry
- https://www.neuralconcept.com/post/artificial-intelligence-in-car-manufacturing
- https://viso.ai/applications/computer-vision-in-automotive/
- https://www.cloud4c.com/blogs/15-ai-use-cases-in-the-automotive-industry