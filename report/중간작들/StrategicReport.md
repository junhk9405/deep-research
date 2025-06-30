# 6. 기술·전략 Dimension 보고서  
(프로젝트명: 모바일·AI 기반 클라우드 ERP)

## 6-1. 후보 기술 선정 (≤3개)
| 순번 | 후보 기술 | 기술 성숙도(TRL) | 예상 ROI(5년, %)* | 시장 성장률(CAGR) | 기술 난이도 | 우리 회사 적합성 | 선정 사유 요약 |
|------|-----------|-----------------|-------------------|--------------------|--------------|------------------|-----------------|
| ① | 생성형 AI Copilot / Auto-Document (GPT-4o 계열 파운데이션 + 사내 파인튜닝) | 7–8 | 27–32 | 42% (’24-’30, IDC GenAI in ERP) | 중 | ◎ | 국내 ERP AI 채택률 12% → 갭 크고, 현 투자(연 20억)로 PoC→MVP 가능. 재무 마감·보고서 자동화로 고객 비용 15%↓, 우리 회사 서비스 매출 ×1.8 기대 |
| ② | Low-Code Workflow Builder 2.0 (BPMN + RPA + iPaaS 통합) | 8–9 | 21–25 | 18% (AlliedMR Low-Code) | 중 | ◎ | 당사 SI 노하우 활용해 산업별 프로세스 템플릿 확보 용이. 커스터마이징 기간 3주→3일 사례로 중견·SME 강력 니즈. 유지보수 매출 확보 |
| ③ | CSAP-Ready Sovereign Cloud Stack (멀티·하이브리드 배포 자동화, K-암호화 내장) | 6–7 | 15–20 | 12% (KR Gov Cloud) | 상 | ○ | 공공 및 금융 파이프라인 확보(매출 총량의 23% 목표). 경쟁 벤더 대비 규제 대응 차별화, 장기 진입장벽 확보 |

*ROI = (비용 절감 + 신규 매출 상승) / 누적 투자비; 할인율 8% 가정.

### 후보 기술 세부 근거
1. 생성형 AI Copilot  
   • 사용자 월평균 입력·리포트 작성 시간 35% 절감(Accenture 2024 PoC).  
   • 국내 ERP 사용자 59% “AI 기능 부족” 응답 → 초기 고객 확보 용이.  
   • GPT-4o 128k context를 이용해 전표·계약서 첨부까지 단일 프롬프트 처리 가능(코드 예: Function-calling 기반).  
2. Low-Code Workflow Builder 2.0  
   • Ventana 자료: 커스터마이징 비용이 ERP TCO의 27% 차지.  
   • Camunda 8, Temporal 등 OSS 활용해 라이선스 비용 절감 → 높은 EBITDA 유지.  
   • 당사 SI 조직(550명) 활용해 “산업별 프로세스 스튜디오” 출시 시 총주소창_time-to-value 70% 단축.  
3. CSAP-Ready Sovereign Cloud Stack  
   • 2027년 공공·금융 클라우드 시장 1.1조 원, CSAP Sang 등급 필수.  
   • Naver Cloud/KT Cloud Outpost API 통합 + SEED/ARIA 암호모듈 컨테이너화 → 다국적 벤더 대비 18개월 경쟁 우위.  

## 6-2. 후보 기술 개발 계획
| 단계 | 활동 | 기간 | 핵심 인력(FTE) | 주요 도구·플랫폼 | 예산(억원, VAT포함) |
|------|-------|------|---------------|-------------------|----------------------|
| **Phase 0: 사전 기획** | 시장·기술 타당성, KPI 정의, 예산확정 | ’25 1Q (1개월) | PMO 2, Biz 전략 1 | Jira, MIRO | 0.5 |
| **Phase 1: PoC & 데이터 수집** | • Copilot: 내부 SAP FI, 회계 문서 3TB 라벨링  
• Low-Code 2.0: BPM 시나리오 12종 설계  
• Sovereign Stack: Naver Cloud ‘KC-Region’ sandbox | ’25 1Q–2Q (3개월) | AI Eng 3, FE 2, DevOps 2, SecOps 1 | SageMaker, Camunda, Terraform | 3.0 |
| **Phase 2: MVP 개발** | • Copilot 미니멀 기능(전표 생성·리포트)  
• Low-Code Designer(React), Runtime(K8s)  
• Sovereign Stack: IaC, SEED 키관리 | ’25 3Q–4Q (6개월) | AI Eng 4, FE 4, BE 5, UX 2, QA 2, Sec 2 | LangChain, Pinecone, Keycloak, Argo CD | 8.5 |
| **Phase 3: Pilot 고객 적용** | 중견 제조·공공 시범 3사(무상/할인) | ’26 1Q–2Q (4개월) | CSM 2, 솔루션컨설 4, Dev 3 | Snowplow, Datadog | 2.0 |
| **Phase 4: GA & 스케일업** | 기능 고도화, CSAP 심사 대응, 가격패키지 확정 | ’26 3Q–4Q (6개월) | Dev 6, QA 3, Sec 2, Sales Eng 3 | SonarCloud, OneTrust | 5.0 |
| **Phase 5: 운영 & 지속 개선** | MLOps, DevRel, 마켓플레이스 입점 | ’27+ (연속) | Ops 4, MLOps 2, TechWriter 1 | Kubeflow, AWS/Naver Marketplace | 연 4.0 |
| **총 투입** |  | 22개월 | 피크 23 FTE, 평균 15 FTE |  | **연 20억 ×2년 = 40억**

### 인력 구조 상세
- AI/ML 엔지니어 4명: LLM 파인튜닝, 벡터 DB, RAG 파이프라인.  
- BE/DevOps 7명: Spring/Kotlin, K8s, IaC(Terraform), GitOps.  
- FE/UX 4명: Flutter, React, Figma.  
- SecOps 2명: ISO27001/CSAP 문서, SAST/DAST.  
- 컨설턴트·CSM 6명: 제조·공공 도메인.  

## 6-3. 마일스톤 및 일정표
| 구분 | 목표 | 완료 기준(KPI) | 시점 |
|------|------|---------------|------|
| **M0** | 프로젝트 킥오프 | 승인된 BRD, 예산 40억 확정 | ’25.01 |
| **M1** | PoC 성공 | • Copilot 정확도 ≥85%  
• Low-Code 프로세스 1건 배포 ≤5분  
• Sovereign Stack RTO≤30분 | ’25.04 |
| **M2** | MVP Release 0.9 | 기능 커버리지 60%, 사용자 NPS ≥40 | ’25.10 |
| **M3** | Pilot Go-Live 3사 | 장애(CRITICAL) 0건, 일일 실제 사용자 ≥80 | ’26.02 |
| **M4** | GA(General Availability) & CSAP 제출 | • CSAP Jung 심사 접수  
• ARR 10억 확보(계약 5건) | ’26.08 |
| **M5** | CSAP Jung 인증 획득 | 감사 지적 0건, 침해사고 DR Drill 통과 | ’26.12 |
| **M6** | Public Launch & Marketplace 입점 | • AWS/Naver Marketplace Live  
• 누적 ARR 30억, 파이프라인 100억 | ’27.03 |
| **M7** | CSAP Sang 추진 결정 | Pilot 공공기관 계약(≥1건), 비용-수익 분석 완료 | ’27.06 |

### 리스크 & 가드레일
1. LLM 할루시네이션 → RAG + 벡터 인덱스, 임계 정확도(90%) 미달 시 Human-in-loop.  
2. CSAP 심사 지연 → 사전 모의해킹·컨설트사(안랩) SLA, 버퍼 3개월.  
3. 인력 확보 실패 → 대학 산학 인턴 6명, 외부 프리랜서 마켓(Upwork Korea) 예비 Pool.

## 종합 제언
1. **단기(0-12개월)**: 생성형 AI Copilot로 ‘소음이 크고 ROI 빠른’ 영역(전표·리포트) 정조준 → 레퍼런스 확보.  
2. **중기(12-24개월)**: Low-Code 2.0과 Sovereign Stack을 결합, “CSAP-준수 맞춤형 Workflow-as-a-Service”로 포지셔닝.  
3. **장기(24개월+)**: 산업별 AI Model Hub(재고예측, 품질검사)와 마켓플레이스 경제 구축 → SI 매출과 SaaS ARR 동시 확장.

> 위 계획은 당사 연간 20억 투자 한도를 유지하면서, 3년 내 신규 ARR 80~100억, EBITDA 25% 수준의 고마진 SaaS 비즈니스를 구축할 수 있는 최적 균형안을 제시한다.