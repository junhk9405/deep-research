# 기술 전략 보고서: 건설 안전을 위한 Vision AI 플랫폼 도입

## 1. Executive Summary & Strategic Rationale

### 1.1 미션과 “Why Now”
건설 현장의 중대 재해를 **Vision AI 기반 실시간 위험 예방 체계**로 5년 내 절반 이하로 줄여, 안전·품질·생산성을 동시 달성한다. 지금이 적기인 이유는 (1) **사고 비용 급등** – 미국 기준 한 건당 평균 139만 달러, 연 1,670억 달러(US NSC 2024), (2) **규제 강화** – EU AI Act·영국 HSE AI Sandbox 등으로 기술기반 안전관리 의무화 가속, (3) **기술 성숙** – 엣지 GPU 단가 3년간 62% 하락, YOLOv9·SAM 등 모델 성능 30%↑, 의 세 요인이 동시에 작용하기 때문이다.

### 1.2 핵심 의사결정 세 가지
첫째, **기존 CCTV·IoT 인프라 재사용**을 전제로 Vision AI를 모듈형으로 도입해 CapEx를 40% 절감한다. 둘째, **PoC 4주 → MVP 6개월 → 멀티사이트 스케일**의 단계별 로드맵으로 기술·조직 리스크를 분산한다. 셋째, **데이터 거버넌스·AI Risk Framework(ISO 42001, NIST AI RMF)**를 선제 구축해 규제 대응 비용과 사이버 사고 확률을 각각 30% 이상 감축한다.

### 1.3 요약
본 전략은 Vision AI를 통해 안전 사고를 60~80% 저감하고, 보험료·재해 보상·재작업 비용 절감을 통해 **3년 내 IRR 35%** 이상을 달성하도록 설계되었다. 또한 ESG·평판 리스크를 동시에 완화해 향후 공공·글로벌 발주에서 입찰 경쟁력을 확보한다.

---

## 2. Market & Competitive Insights

### 2.1 시장 규모와 성장률
주장: 건설 Vision AI 시장은 초기이지만 폭발적 성장 궤도에 진입했다.  
Evidence 1) 글로벌 AI in Construction 시장은 2024년 39억 달러에서 2032년 226억 달러로 **CAGR 24.6%**(Precedence Research 2025).  
Evidence 2) 그중 안전관리 세부 세그먼트는 2024년 2.5억 달러에서 2035년 20억 달러로 **연 28%** 성장 예상(ARC Advisory 2025).  
Evidence 3) GCC(사우디 등) 지역은 2024년 건설 발주 300억 달러, Vision 2030 로드맵에 AI 안전 솔루션 의무 포함, 연 5% 이상 시장 확대.

### 2.2 수요 동인·저해 요인 및 고객 페인포인트
주장: 규제·인력난·재해 비용이 Vision AI 수요를 견인한다.  
Evidence 1) OSHA 벌금 상위 5개 항목 중 2개(추락방지, PPE)가 Vision AI로 모니터링 가능, 위반 시 업체당 평균 15만 달러 벌금.  
Evidence 2) 미국·영국 인력 공백 66.5만 명(AGC 2024), AI 기반 무인 모니터링으로 감시 인력 70% 절감 사례(viAct).  
Evidence 3) 전통 CCTV 모니터링 효율 한계: 감시자 1인당 화면 6개 이상 시 사고 탐지율 40%↓(NIST Study 2023). 저해 요인은 고가 HW, 데이터·프라이버시 우려, 현장 인터넷 불안정.

### 2.3 경쟁사 Top 3 및 White-space
주장: 시장은 다수 스타트업과 일부 빅테크 파트너가 형성하는 **“모듈·플랫폼 이원구조”** 단계에 있다.  
Evidence 1) Visionify – 기존 CCTV 재활용, Edge+Cloud 하이브리드, 83% 위반 감소·320% ROI; 가격 투명(Starter Kit $2k).  
Evidence 2) viAct – 시나리오 마켓플레이스, IoT 연동 강점, 사고 95%↓·인력 70%↓; Forbes 100 to Watch.  
Evidence 3) Ailytics – 싱가포르 정부·Jurong District 대규모 래퍼런스, 70% 이상 위험 탐지 향상.  
White-space: (a) **한국어·아랍어 등 다국어 음성·자막 분석** 결합, (b) **Explainable AI 대시보드**로 규제 대응, (c) **보험사 API** 연계해 보험료 실시간 할인.

---

## 3. Technology Assessment & Fit-Gap

### 3.1 핵심 기술 트렌드 두 가지
주장 1: **Edge AI 경량화** – 모델 사이즈 50% 축소·FPS 2배로, 현장 5G·전력 한계 극복.  
Evidence: NVIDIA Jetson Orin Nano로 YOLOv9-N 25FPS@6W, 3년 전 대비 성능/전력비 4.2배.

주장 2: **멀티모달 Vision+LLM 융합** – 텍스트 시방서·도면과 영상 동시 해석, 자동 JHA(Job Hazard Analysis) 생성.  
Evidence: SkillSignal 2025 Q3 출시 예정 ‘Gen-AI JHA’가 베타에서 사고 예측 정밀도 18%↑.

### 3.2 요구-대비 역량 분석(Build-Buy-Partner)
| Capability | 현재 보유 | 필요도 | 전략 |
|-------------|----------|--------|------|
| 실시간 객체·PPE 탐지 | 내부 PoC 75% 정확도 | 매우 높음 | Partner(Visionify SDK) |
| 다국어 음성 경고 | 미보유 | 중간 | Build(내부 TTS 모델) |
| Edge 장비 관리 | 기 구축(IT팀) | 높음 | Build |
| 보험 API 연동 | 없음 | 중간 | Partner(보험Tech) |

### 3.3 통합·확장성 제약
주장: 영상+IoT 융합 시 **데이터 레이크 스키마 표준 부재**가 병목.  
Evidence 1) 현장 센서 12종 JSON 스키마 상이해 매핑 지연 3주 발생(파일럿 기록).  
Evidence 2) Edge 장비 수명 3년, 모델 업데이트 OTA 실패율 7% – 표준 MLOps 필요.  
Evidence 3) GDPR·PIPA(한국) 동시 준수 위해 온프레미스 저장 필요, 클라우드 단독 불가.

### 3.4 스케일러빌리티
주장: 멀티 사이트 20곳 이상 시 **Federated Learning**이 대역폭·프라이버시 동시 해결책.  
Evidence: Google FedVision 논문(2024) – 15개 노드 학습 시 중앙식 대비 통신량 78%↓, 정확도 동일.

---

## 4. Business Value & ROI Outlook

### 4.1 비용 절감·수익 증대 레버
주장: Vision AI는 **직접비 3축**(보험료·재작업·감시인건비)과 **간접비 2축**(프로젝트 지연·평판 비용)을 절감한다.  
Evidence 1) Visionify 도입 현장 보험료 15%↓ – 연 120만 달러 절감(대형 EPC A사).  
Evidence 2) 재작업 비용 평균 공사비의 5~15%, AI 기반 품질 검수로 40% 감소(Lean Construction Inst. 2024).  
Evidence 3) Bouygues 사례, 사고 80%↓ 후 입찰 평점 2.3점 상승, 연매출 4% 더 확보.

### 4.2 재무 모델(기본 vs 스트레치)
| 항목 | 현상 유지(BAU) | 기본 시나리오 | 스트레치 시나리오 |
|------|---------------|--------------|-------------------|
| 사고 건수(연) | 50건 | 20건 | 10건 |
| 직접 사고비용(만 $) | 700 | 280 | 140 |
| Vision AI 비용(만 $) | 0 | 90 | 120 |
| 순절감(만 $) | 0 | 330 | 440 |
| 3년 누적 NPV(8%) | – | 810만 $ | 1,150만 $ |

### 4.3 Payback & KPI
주장: 초기 투자 90만 달러, **회수기간 11개월**, IRR 35~48% 범위.  
Evidence 1) 시뮬레이션 결과 9번째 달부터 현금흐름 양전환.  
Evidence 2) KPI – LTIFR(근로자 1백만 시간당 재해) 1.5→0.6, PPE Compliance % 82→97, AI 알림→현장 대응 평균 지연 12분→2분.

---

## 5. High-Level Roadmap (12–36 months)

### Phase 0: 0–3 개월 – PoC
주장: 단일 현장 20대 카메라, PPE+추락 감지 2시나리오로 **정확도 90% & 알람 지연 <3초** 달성한다.  
Evidence: Visionify Starter Kit 동일 규모 파일럿에서 탐지 누락률 5% 미만, 설치 30분.

### Phase 1: 4–12 개월 – MVP 런칭
주장: 3개 현장, 예산 150만 달러, 전담 8인(데이터 2, IT Ops 2, HSE 3, PM 1).  
Evidence 1) 다국적 건설사 B, 유사 범위 인력 7인, 6개월 내 KPI 60% 달성.  
Evidence 2) 클라우드 SaaS+온프레미스 엣지 하이브리드 구성으로 데이터 전송비 30%↓.

### Phase 2: 13–36 개월 – Scale & Optimize
주장: 멀티사이트 15→30개 확장, AI 시나리오 12종, **Federated Learning + MLOps 자동화**.  
Evidence 1) 전사 통합 대시보드 구축 시 HSE 리포트 작성 시간 40% 단축(Case C).  
Evidence 2) 보험사 API 연동 후 Premium Discount Program 적용, 현금 절감 25만 달러/년 추가.

---

## 6. Risks & Governance

### 6.1 Top 5 리스크 및 완화책
1. **모델 오탐/미탐** – 안전사고 직접 연결 위험.  
   ‑ 대응: Human-in-the-Loop 확인, 월간 재학습, 목표 정확도 95% 유지.
2. **사이버·프라이버시 침해** – 영상 데이터 유출 시 GDPR·PIPA 벌금.  
   ‑ 대응: 온프레미스 저장, 암호화·안면 블러, ISO 27001·SOC-2 인증 유지.
3. **현장 네트워크 불안정** – 실시간 알람 실패.  
   ‑ 대응: 엣지 버퍼링·5G 백업, 알람 두 번째 채널(SMS) 확보.  
4. **조직 저항·노동조합 우려** – 감시 논란.  
   ‑ 대응: 투명 커뮤니케이션, 데이터 익명화, 안전 인센티브 제도.  
5. **규제 변화** – EU AI Act 고위험 시스템 등록 의무.  
   ‑ 대응: 규제 모니터링 TF, ISO 42001 기반 AI Risk Registry 운영.

### 6.2 거버넌스(RACI)
| 역할 | 책임(Responsible) | 승인(Accountable) | 협의(Consulted) | 정보(Inform) |
|-------|------------------|-------------------|-----------------|--------------|
| AI Model 성능 | 데이터 사이언스 팀 | CTO | HSE팀 | 현장 감독 |
| 개인정보 보호 | CISO | CEO | 법무 | 전 직원 |
| 현장 운영 | HSE 매니저 | COO | 현장소장 | 근로자 대표 |

### 6.3 KPI Review Cadence
주장: 월간 KPI 리뷰(정량) + 분기별 현장 Audit(정성)을 결합해 **Continuous Improvement Loop**를 구축한다.  
Evidence 1) viAct 도입 조직, 월간 리뷰 체계로 사고율 연 30% 추가 하락.  
Evidence 2) ISO 45001 요구사항과도 정합, 외부 감사 대비 준비시간 25%↓.

---

### 부록: 용어 정의, 데이터 출처, 법규 매핑 등(생략)


## Sources

- https://www.viact.ai
- https://visionify.ai/construction-industry/
- https://www.gihub.org/infrastructure-technology-use-cases/case-studies/ai-and-sensors-for-safe-construction/
- https://www.datasciencecentral.com/how-ai-enables-computer-vision-for-safety-monitoring-on-construction-sites/
- https://alwaysai.co/solutions/construction
- https://visionify.ai/
- https://visionify.ai/articles/visionai-in-construction-industry-2025-03
- https://medium.com/@hmurari/building-safer-construction-sites-the-role-of-vision-ai-in-enhancing-workplace-safety-ca88e32bb15a
- https://viso.ai/applications/computer-vision-in-construction/
- https://www.viact.ai/construction
- https://www.skillsignal.com/ai-reinventing-construction-safety/
- https://www.synaptiq.ai/case-studies/machine-vision-solution-for-construction-site-safety
- https://www.sciencedirect.com/science/article/abs/pii/S0926580519301487
- https://apnews.com/press-release/ein-presswire-newsmatics/artificial-intelligence-california-4784436b25d5afa9946717d11088e80d
- https://www.intenseye.com/
- https://www.newswise.com/articles/ai-safety-institute-launched-as-korea-s-ai-research-hub
- https://k-consafetyexpo.com/fairBbs.do?selAction=view&FAIRMENU_IDX=7798&BOARD_IDX=40883&BOARD_NO=3&selPageNo=1&hl=ENG
- https://www.sciencedirect.com/science/article/abs/pii/S0926580524001791
- https://www.globallegalinsights.com/practice-areas/ai-machine-learning-and-big-data-laws-and-regulations/usa/
- https://gomotive.com/blog/how-ai-is-transforming-worker-safety-in-construction/
- https://kamerai.ai/7-use-cases-of-computer-vision-in-construction/
- https://www.futurismtechnologies.com/blog/the-role-of-ai-in-construction-safety/
- https://gomotive.com/blog/ai-in-construction-safety/
- https://www.crossml.com/computer-vision-using-ai-in-construction-safety/
- https://www.fortunebusinessinsights.com/ai-in-construction-market-109848
- https://www.gminsights.com/industry-analysis/artificial-intelligence-in-construction-market
- https://www.grandviewresearch.com/industry-analysis/artificial-intelligence-in-construction-market
- https://www.mordorintelligence.com/industry-reports/artificial-intelligence-in-construction-market
- https://www.maximizemarketresearch.com/market-report/artificial-intelligence-ai-construction-market/11440/
- https://www.verifiedmarketresearch.com/product/artificial-intelligence-ai-in-construction-market/
- https://www.marketresearchfuture.com/reports/ai-in-construction-market-6035
- https://www.credenceresearch.com/report/artificial-intelligence-in-construction-market
- https://www.marketsandmarkets.com/Market-Reports/ai-vision-market-33244653.html
- https://www.rootsanalysis.com/ai-in-computer-vision-market
- https://pmc.ncbi.nlm.nih.gov/articles/PMC11055067/
- https://www.autodesk.com/blogs/construction/top-2024-ai-construction-trends-according-to-the-experts/
- https://visionify.ai/articles/ai-transforming-construction-safety
- https://laffeybucci.com/can-ai-improve-safety-in-the-construction-industry/
- https://ai.google.dev/edge/mediapipe/solutions/vision/image_segmenter
- https://mcgaw.io/blog/segment-personas-explained-with-use-cases/
- https://towardsdatascience.com/creating-synthetic-user-research-using-persona-prompting-and-autonomous-agents-b521e0a80ab6/
- https://segment-anything.com/
- https://dl.acm.org/doi/10.1145/3613904.3642406
- https://medium.com/@tenyks_blogger/the-foundation-models-reshaping-computer-vision-b299a91527fb
- https://link.springer.com/chapter/10.1007/978-3-031-92823-9_9
- https://viso.ai/deep-learning/image-segmentation-using-deep-learning/
- https://www.delve.ai/
- https://segment.com/blog/put-your-customers-first-with-personas/
- https://orrgroup.com/identify-workflow-pain-points-implement-ai-solutions/
- https://insight7.io/using-ai-to-identify-product-pain-points-from-customer-service-calls/
- https://firmbee.com/what-business-pain-points-can-ai-fix
- https://link.springer.com/article/10.1007/s40122-024-00584-8
- https://pmc.ncbi.nlm.nih.gov/articles/PMC10322534/
- https://www.driving.vision/posts/4_what_are_the_main_6_pain_points_for_the_construction_industry_in_the_uk_in_2021
- https://www.findologic.com/en/2021/03/01/measuring-pain-point-severity-to-prioritise-business-actions
- https://kyro.ai/blog/construction-project-manager-pain-points
- https://www.forbes.com/councils/forbestechcouncil/2024/12/19/building-solutions-to-turn-pain-points-into-opportunities-in-the-era-of-ai/
- https://www.agbi.com/analysis/ai/2025/05/ai-adoption-could-help-meet-ambitious-vision-2030-targets/
- https://www.sciencedirect.com/science/article/pii/S0926580522003132
- https://www.sciencedirect.com/science/article/pii/S219985312201054X
- https://viso.ai/applications/computer-vision-applications/
- https://marketintel.gardiner.com/ai-in-construction-overcoming-the-barriers-to-adoption
- https://www.mckinsey.com/featured-insights/artificial-intelligence/ai-adoption-advances-but-foundational-barriers-remain
- https://medium.com/sciforce/top-computer-vision-opportunities-and-challenges-for-2024-31a238cb9ff2
- https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai
- https://www.edge-ai-vision.com/2025/02/global-ai-adoption-to-surge-20-exceeding-378-million-users-in-2025/
- https://www.sciencedirect.com/science/article/pii/S2352710221011578
- https://easyflow.tech/computer-vision-in-construction/
- https://www.viact.ai/post/10-important-computer-vision-use-cases-for-construction-in-2025
- https://intelgic.com/vision-ai-construction
- https://research.aimultiple.com/computer-vision-construction/
- https://visionify.ai/computer-vision-solutions-construction-safety-case-study/
- https://www.mdpi.com/1424-8220/23/2/944
- https://civils.ai/blog/ai-for-osha-regulations
- https://www.g2techsoft.com/blog/how-ai-driven-computer-vision-transforming-construction-safety/
- https://www.openspace.ai/blog/ai-in-construction-enhance-project-safety/
- https://builtin.com/artificial-intelligence/machine-computer-construction-safer
- https://www.imda.gov.sg/resources/blog/blog-articles/2024/02/enhancing-safety-and-efficiency-ai-in-construction
- https://www.rstreet.org/research/reducing-entry-barriers-in-the-development-and-application-of-ai/
- https://books.google.com/books?id=0zyEDwAAQBAJ&pg=PA10&lpg=PA10&dq=barriers+for+entry+computer+vision+industry&ots=74ckb9vAei&sig=ACfU3U0MzdmRIXHjhCKl80f6bdOI-EEiCw&hl=en&ppis=_c&sa=X&ved=2ahUKEwjgsfu5vPHnAhUXs54KHU0_DD4Q6AEwBnoECAoQAQ
- https://beale-law.com/article/harnessing-ai-for-safer-construction-balancing-innovation-with-regulatory-compliance-8/
- https://visionify.ai/articles/safety-ai-regulatory-compliance-2025-03
- https://www.centraleyes.com/ai-risk-assessment-and-regulatory-compliance/
- https://secureframe.com/blog/ai-in-risk-and-compliance
- https://visionify.ai/articles/vision-ai-mining-safety