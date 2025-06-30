# 6. Technology / Strategy Dimension Report – Cloud-Based ERP Solution

## 6-1. 후보 기술 선정

### ① GenAI Copilot & Predictive Analytics Engine
* **ROI·시장성** – Gartner(2025) "ERP 벤더 70 %가 2027년까지 Copilot 탑재", Copilot 기능이 포함된 계약은 평균 **15 % 이상 높은 ARR**를 창출. Deloitte 사례: AI Copilot 도입 후 재무 마감 30 % 단축, 재고 4 % 감축 → **3-year IRR 42 %**. 2024~2030 글로벌 GenAI-ERP TAM 287억 $ (CAGR 32 %).  
* **기술 난이도·성숙도** – OpenAI GPT-4o·NAVER HyperCLOVA X 등 상용 LLM API가 안정 단계(TRL8). 한국어·도메인 튜닝이 필요하지만 **파인튜닝 비용 7억 원/년 규모**로 통제 가능.  
* **사내 역량 적합도** – 당사는 연간 200 억 원 영업이익 중 20 억을 AI R&D로 배정, 이미 MLOps·데이터 레이크 구축 경험 보유(스마트팩토리 PoC 2건). 

### ② Edge-Container Hybrid Deployment Framework (E-ERP Edge)
* **ROI·시장성** – 한국 제조·바이오 공장 30 %가 OT 분리 요구로 ‘클라우드 only’ 사용 불가. AWS Outposts·Azure Stack 사례에서 **하이브리드 ERP 도입률 17 % → 33 %(’24→’27)** 예상. OT-다운타임 1 %p 감소가 EBIT 1.4 %p 개선(McKinsey).  
* **기술 난이도·성숙도** – K8s-based K3s, k0s 등 경량화 스택과 AWS Local Zone로 구현 가능(TRL7). 네트워크 동기화·오프라인 캐시 검증 필요하나, 컨테이너 CICD 경험을 가진 당사 SI 조직(120명)이 재사용 가능.  
* **전략적 차별화** – CSAP 규제 대응 + 초저지연(≤20 ms) 공장 데이터 처리로 **국내 국산 ERP 벤더 미충족 영역** 선점.

### ③ Low-Code iPaaS & API Marketplace (KR-Connect)
* **ROI·시장성** – IDC(2024): 통합·마이그레이션이 ERP TCO의 27 % 차지. Low-code 플로우 적용 시 **통합 개발 Effort 40 %↓, 유지비 30 %↓**. 2025~2030 KR iPaaS 시장 1,200억 → 3,100억 원(19 % CAGR).  
* **기술 난이도·성숙도** – Camunda 8 / Temporal OSS, Apache Camel-K 등 검증된 런타임(TRL8); UI 플로우 빌더 React-based 신규 개발 필요.  
* **생태계 파급 효과** – 은행·전자세금·네이버·카카오 API 커넥터를 **마켓플레이스화**해 타 SaaS 벤더 입점 수수료(15 ~ 20 %)로 추가 매출원 창출.

> 최종 선택: 상기 3개 후보 기술은 **(1) 매출 증폭력, (2) 규제 대응, (3) 사내 역량 레버리지** 관점에서 상호보완적이며, 연간 20 억 투자를 2년간 지속할 경우 **EBIT 6.2 %p 증대 효과**(시뮬레이션)를 기대할 수 있음.

---

## 6-2. 후보기술 개발 계획

| 구분 | 기간 | 주요 활동 | 인력(명) | 연간 예산(억원) |
|------|------|----------|----------|----------------|
| GenAI Copilot | 24 개월 | • 0-3M: 한국어 재무·SCM 코퍼스 수집(5 TB)  
• 4-9M: LLM 파인튜닝(12B 파라미터), RAG 기반 POC  
• 10-15M: Copilot UX(React)·MLOps 파이프라인  
• 16-21M: 고객 파일럿 3사, 정확도≥90 % 검증  
• 22-24M: CSAP·K-AI Act 대비 AI Governance 패키지 | DS 4, ML 3, FE 3, PM 1 (計 11) | 11.0 |
| Edge-ERP | 18 개월 | • 0-3M: OT 리얼-타임 요구사항 분석, eBPF latency 측정  
• 4-9M: K3s 클러스터 & Sync 프로토타입, 메시지 큐(EMQX)  
• 10-12M: 자가복구(HA)·TDE 통합, Factory 1 POC  
• 13-18M: 글로벌 Sync(Conflict-free CRDT)·DR Drill  | DevOps 4, Backend 3, Sec 1, PM 1 (計 9) | 5.5 |
| Low-Code iPaaS | 21 개월 | • 0-3M: OSS 선정·라이선스 검증, Korean Tax·Payroll API 정의  
• 4-12M: Drag-&-Drop Flow Designer, 15개 커넥터 개발  
• 13-18M: Marketplace 결제·수수료 모듈, SDK 공개  
• 19-21M: 파트너 ISV 10곳 온보딩·수수료 계약  | FE 2, BE 3, DevRel 1, QA 1, PM 1 (計 8) | 3.5 |
| 합계 |  |  | 28 FTE | 연 20.0 |

설비·클라우드 비용(2.4 억/년), 외부 감사·CSAP 컨설팅(1.2 억/년)은 별도 CAPEX로 반영. 총 인건비는 서울 중견 IT 인력 평균 연봉 1.1 억 원 기준 산정.

---

## 6-3. 개발-출시 마일스톤 로드맵 (공통 타임라인)

| 단계 | 일정 | 완료 기준(KPI) | 리스크 & 대응 |
|------|------|----------------|----------------|
| M0 Kick-off | ’25 Q3 | 사업타당성 승인, 예산 20 억 배정, 28FTE 확보 | 핵심 인력 미배치 → 임원 KPI 연동
| M3 Architecture Freeze | ’25 Q4 | • Tech Spec v1 승인  
• CSAP·PIPA Gap List 완성 | 요구 변경 → Change Board 주1회 운영
| M6 MVP Ready | ’26 Q1 | • GenAI Copilot Top-5 시나리오 F1 ≥ 0.85  
• Edge Latency ≤ 25 ms  
• Flow Designer 첫 커넥터 5종 | 레거시 데이터 품질↓ → 데이터 정제 툴킷 투입
| M9 Alpha for Design Partners | ’26 Q2 | 고객 3사 계약 체결, NPS≥40, 결제/로깅 전 파이프라인 통합 | 보안 취약점 → 사전 Pen-test·SAST
| M12 Public Beta + CSAP 심사 | ’26 Q3 | • 99.9 % 가용성 SLA 달성  
• CSAP 중등급 심사 통과율 80 % | 인증 지연 → 임직원 합동 TF, 주관사 KT Cloud 활용
| M15 Release Candidate | ’26 Q4 | • Copilot 12개 업무 커버리지  
• iPaaS 커넥터 30종, 파트너 5곳  
• Edge-ERP 실가동 2공장 | 운영인력 스케일링 → MSP 파트너 MSA 체결
| M18 General Availability (GA) | ’27 Q1 | • 1차 상용고객 10사, ARR 15억 원  
• CSAP 최종 인증, ISMS-P 동시 획득 | 초기 매출 부진 → 리스펙트 기반 채널 인센티브
| M24 Break-even & Scale | ’27 Q3 | • 누적 ARR 40억 원, CAC 회수기간 ≤ 18 개월  
• ISV 30곳, 커넥터 60종 | 글로벌 진출 확장 준비 (JPN, SG)

> KPI 보증 장치: **Stage-Gate** 방식으로 투자 집행을 분할(각 게이트 통과 시 20 %, 40 %, 40 %)하여 실패 리스크를 최소화.

### 예상 재무 임팩트 (’27년 GA 기준)
* 신규 SaaS ARR 40억 원, Gross Margin 68 % → EBIT 9.2억 원 추가.  
* On-prem SI 감소분(-3억) 반영해도 Net +6.2억 원(영업이익률 +1.2 %p).  
* 3년 누적 NPV(Disc. 8 %) 약 42 억 원, IRR 36 %.

---

## 결론 및 전략 권고
1. **GenAI Copilot**은 매출 증폭과 차별화 효과가 즉각적이므로 R&D 비중 **55 %** 배정, 국내 최초 ‘한국어 특화 ERP Copilot’ 포지션을 확보.  
2. **Edge-ERP**는 규제·지연 문제로 기존 SaaS가 접근하기 어려운 제조·바이오 시장을 선점, Early-Mover Advantage 확보.  
3. **Low-Code iPaaS**는 초기 캐시카우 역할 + 파트너 생태계 락인을 강화, 장기적으로는 ‘플랫폼 수수료’ 기반 비즈니스 모델 다각화를 촉진.  
4. 단계별 Stage-Gate·CSAP 선취득·Gov.보조금 매칭으로 **투자 리스크 최소화 + 24개월 내 BEP**를 달성한다.
