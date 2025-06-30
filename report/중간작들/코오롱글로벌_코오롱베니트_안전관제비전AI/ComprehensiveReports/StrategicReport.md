# 6. 기술·전략 Dimension 보고서 (Kolon Benit – AI Safety/DX Platform)

본 장(6장)은 앞선 1~5장 자료를 토대로 Kolon Benit이 ‘AI Alliance 기반 산업안전·DX 통합 플랫폼’을 **3년 내 1,000억 원 매출**로 확장하기 위해 집중해야 할 핵심 기술과 실행 전략을 제시한다. 회사의 연간 투자여력(20억 원), 기존 SI 레거시, 시장·규제 타임라인을 종합 고려하여 **후보 기술 선정(≤3종) → 개발계획 → 상용화 마일스톤** 순으로 구성하였다.

---

## 6-1. 후보 기술 선정 (≤3종)

| 구분 | 기술명 | ROI/재무효과 | 시장성장성 | 기술역량 & 난이도 | 성숙도(TRl) | 선정 사유 요약 |
|------|--------|--------------|-------------|-------------------|--------------|-----------------|
| T1 | Edge Vision AI Orchestration (PPE·위험행동 실시간 감지 + 5G 전용망) | • 사고·보상비 65~95%↓
• 보험료 15~25%↓
• 10대 카메라 기준 Payback 0.3개월 | 국내 시장 1,150억(’24)→6,900억(’30), CAGR 34% | 사내 클라우드·네트워크·SI 경험 풍부, Vision 모델 Fine-Tune 난이도 중 | TRL 8–9 (상용 단계) | 높은 단기 ROI, 레거시 CCTV 재활용률 80%, 규제(中대재해법) 수요 직결 |
| T2 | Multimodal Wearable Safety (EEG 스마트헬멧 + ProxiCAM 근접경보) | • 건강·충돌 사고 42~83%↓
• 생산성 +8% ⇒ Payback 6~12개월 | 글로벌 CAGR 22%, 국내 TAM 700억(’30) 예상 | HW·FW 설계 난이도 높음, 파트너사 HHS·OmniPro 보유 | TRL 5–7 (확산 초기) | Vision AI 차별화·업셀링, 하자보증/보험 할증 절감으로 고객 WTP ↑ |
| T3 | XAI & AI Governance Suite (ISO 42001·AI 기본법 Impact Assessment 자동화) | • 공공/대기업 입찰 가산점 +5%p
• 컴플라이언스 비용 40%↓ | ’26년 고위험 AI 의무화로 전 현장 적용 전망, 서비스형(Reg-Tech) 시장 2,400억 | 사내 DevSecOps → GRC 통합 필요, 알고리즘 시각화 난이도 중 | TRL 4–6 (베타) | 규제 선제 대응, 차별화 포인트, 데이터 · 모델 신뢰 확보로 장기 LTV ↑ |

**선정 근거**
1. **재무 임팩트**: T1은 즉시 매출 견인, T2·T3는 단가·고객 락인(LTV)을 증대시켜 3년 CAGR 30% 이상 달성 가능.
2. **기술 적합성**: Kolon Benit의 5G·클라우드·SAP 역량과 파트너 에코시스템을 활용해 내부 개발 및 라이선스 믹스 전략이 현실적.
3. **투자규모 합리성**: 연 20억 원 내 T1·T2 MVP, T3 베타 서비스 병행 가능(총 3년 55억 원 계획). 

---

## 6-2. 후보 기술 개발 계획

### T1. Edge Vision AI Orchestration

1. 개발 목표  
   • 60+ Vision 시나리오 모델을 On-device FP32→INT8 경량화(mAP ≥92%).  
   • 5G 전용망 + Cocktail Cloud PaaS 기반 다현장(100site) 중앙관제.  
   • SAP EHS·Tableau 연동 REST API 공개.
2. 기간·예산·인력  
   • **Phase-0(착수)** 2024 Q3 – Q4: PoC 템플릿 고도화(5억, DS 3 + MLOps 2).  
   • **Phase-1(MVP)** 2025 Q1 – Q2: 멀티사이트 오케스트레이터 개발(7억, FE/BE 4, Net 2, QA 1).  
   • **Phase-2(Scale-up)** 2025 Q3 – 2026 Q2: Edge Auto-Scaler·Billing 모듈(6억, DS 2, DevOps 2, Biz 1).  
   • CapEx: Jetson Orin Dev Kit 30대(1.2억), GPU 클러스터 임대(연 1억). 
3. 핵심 Deliverable  
   • mAP 90%↑ PPE·추락·충돌 모델 20종 공개  
   • 클라우드-엣지 지연 <250 ms  
   • 현장당 설치시간 50%↓(8h→4h).

### T2. Multimodal Wearable Safety

1. 개발 목표  
   • EEG·ECG 센서가 장착된 헬멧 HW v1.0(EN397 인증)  
   • ProxiCAM 360° UWB-AI 모델 거리오차 <15 cm  
   • Vision AI Dashboard와 이벤트 통합.
2. 기간·예산·인력  
   • **Phase-0 R&D 제휴** 2024 Q4 – 2025 Q1: HHS·OmniPro 공동설계(2억, HW 2, FW 1).  
   • **Phase-1 Prototype** 2025 Q2 – Q4: 100ea 파일럿(5억, FW 2, DS 1, QA 1).  
   • **Phase-2 Pre-Mass** 2026 Q1 – Q3: 단가 45만 원 이하, 1,000ea 양산(8억, SCM 1, PM 1).  
   • 인증/시험: 1.5억(안전인증·KC·CE). 
3. KPI  
   • 충돌 Near-miss 감소 70%  
   • 건강 이상 탐지 Recall 85%  
   • 배터리 12 hr↑.

### T3. XAI & AI Governance Suite

1. 개발 목표  
   • ISO 42001, EU AI Act, 韓 AI 기본법 공통 메타모델 설계  
   • Explain API(SHAP, Grad-CAM) 시각화 위젯  
   • Risk Dashboard + Impact Assessment 자동 워크플로.
2. 기간·예산·인력  
   • **Sprint-0** 2024 Q4: 요구사항·레퍼런스 모델링(0.8억, Compliance 1, Architect 1).  
   • **Sprint-1 Beta** 2025 Q1 – Q3: GRC 플랫폼 연동(4억, FE/BE 3, SecOps 1).  
   • **Sprint-2 GA** 2025 Q4 – 2026 Q2: SaaS형 서비스, 다국어 지원(3억, Dev 2, PM 1).  
   • 연 Opex 1억(OneTrust API, 클라우드). 
3. KPI  
   • 위험평가 보고서 자동화율 80%  
   • 인증/심사 준비기간 6→3개월  
   • 고객 감사 대응시간 60%↓.

---

## 6-3. 상용화 마일스톤 & 일정표

| 단계 | 기간 | 주요 목표 | 검증 지표(KPI) | 책임 조직 |
|------|------|-----------|---------------|-----------|
| **M0 – Kick-off** | 2024 Q3 | T1·T2·T3 TF Kick-off, 파트너 NDA 체결 | 예산 승인(20억), TF 리소스 100% 배치 | CTO실, 사업전략팀 |
| **M1 – PoC 완료** | 2025 Q1 | T1 현장 3곳, T2 헬멧 30ea, T3 Risk PoC | mAP ≥88%, 충돌 경보 90% 정확, 리스크 리포트 자동화 50% | AI Alliance Lab |
| **M2 – MVP 런칭** | 2025 Q3 | SaaS 포털 v1.0, 5G 전용망 통합, XAI 베타 공개 | 첫 유료고객 5site, NPS +30, 월MRR 1억 | 플랫폼사업본부 |
| **M3 – Field Scale** | 2026 Q2 | 50site/1,000채널, 헬멧 1,000ea 양산, Governance GA | 누적 ARR 80억, 사고율 50%↓ KPI 제휴보험 리베이트 확보 | 영업·서비스본부 |
| **M4 – Reg-Ready Launch** | 2026 Q4 | AI 기본법 시행前 적합성 평가 통과, ISO 42001 인증 | 공공 입찰 3건 수주, 컴플라이언스 비용 40%↓ | 품질·Compliance팀 |
| **M5 – Global Expansion** | 2027 Q2 | 아세안/중동 수출 패키지, 현지 파트너 2곳 체결 | 해외 매출 100억, 로컬화 비용 ≤매출의 15% | Global Biz Div. |

---

### 투자·재무 로드맵 요약 (2024 H2 – 2027 H1)
- **총 투자** ≈ 55억 원 (CapEx 15억, 인건비 30억, 인증·컨설팅 10억)  
- **매출 목표** : 2025 10억 → 2026 150억 → 2027 300억  
- **EBIT** : 2026 18% → 2027 23%  
- **3년 NPV** (+9% 할인률) ≈ 120억 원, IRR 38%  

---

## 실행·리스크 관리 제언
1. **Alliance 레버리지** – 비전 모델·센서 HW 70%는 파트너 Re-branding, Kolon Benit은 Orchestration·거버넌스에 집중하여 R&D 리스크 최소화.  
2. **Data-Ops 체계** – 현장별 데이터 Drift 모니터링 → 월간 재학습 파이프라인을 자동화, mAP 90% 유지.  
3. **변화관리 & ESG** – 안전성과 동시에 **여성·현장 근로자 수용성** 확보 위해 UX 테스트, 개인정보 비식별·가상 캐릭터 UI 적용.  
4. **CapEx Flex** – GPU·NPU 부족 시 CSP Spot Instance·AMD MI300 옵션 확보, TCO 10% 헤지.  
5. **공공 표준 선도** – 국토부·KOSHA와 ‘AI 안전 KPI 워킹그룹’ 주도, 표준화 선점으로 입찰 우위 확보.

> **Bottom-line**: 3개 후보 기술은 단기 현금창출(T1)과 중·장기 차별화(T2·T3)를 균형 있게 결합한다. 로드맵대로 실행하면 Kolon Benit은 2027년까지 ‘AI Safety Aggregator’로서 국내 시장 점유율 ≥15%, 해외 매출 비중 >20%를 확보할 수 있다.  
