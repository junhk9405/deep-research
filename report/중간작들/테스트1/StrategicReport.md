# 6. 기술·전략 Dimension 보고서

본 장(6장)은 앞선 1~5장의 시장·고객·기술·리스크 분석을 종합하여, 우리 기업(매출 5,000억 원, 연간 AI R&D 예산 200억 원)의 "클라우드 기반 ERP 솔루션" 사업화를 위해 즉시 착수해야 할 핵심 기술 포트폴리오와 개발 로드맵을 제안한다. 

---
## 6-1. 후보 기술 선정(3개 이하)

### 후보 ①  한국어 특화 GenAI Copilot & 예측 분석 엔진
1. ROI & 시장성  
   • Gartner(2025) 자료 기준, **GenAI 내장 ERP는 2027년까지 평균 라이선스 단가를 18% 상향**하고 갱신율을 8%p 상승시킨다. 2024년 SAP·MS 신규 계약 중 30% 이상이 Copilot 옵션을 포함한 점을 감안하면, **국내 시장에서도 연간 1,000억 원 이상의 추가 지불여력**이 존재한다.  
   • IDC Korea(2024) 조사에서 국내 CFO 59%가 “AI 내장 여부가 벤더 선택 시 핵심 결정 요소”라고 응답.  
2. 기술 난이도·성숙도  
   • TRL 7~8(시범서비스 상용화 직전 단계)로 비교적 높지만, **한국어·도메인 특화 파인튜닝**과 **내부 데이터 보안(LLM 전용 VPC 엔드포인트)** 가 필수라 해외 Copilot 단순 현지화로는 경쟁력이 부족.  
3. 당사 적합성  
   • 연 200억 원 AI 투자 범위 내에서 **Llama 3-Ko 70B 혹은 HyperCLOVA X 파운데이션 모델에 재무·SCM 데이터셋 5억 토큰 추가 파인튜닝**이 현실적.  
   • 기존 SI 레퍼런스(제조·유통 데이터 파이프라인 구축 경험)를 활용해 **GenAI+BI 융합 시나리오(수요·현금흐름·RMA 예측)**를 빠르게 확보 가능.

### 후보 ②  BPMN 2.0 기반 로우코드/노코드 확장 플랫폼(iPaaS & Extension SDK)
1. ROI & 시장성  
   • K-제조·유통 기업의 74%가 커스터마이징 의존(산업연·2022). **“Clean Core + 확장플랫폼” 모델을 도입하면 유지보수 비용 40% 절감**(SAP BTP 사례).  
   • 국내 SME 37%가 초기 컨설팅·개발비를 도입 장애로 지목하므로, "로우코드"는 **도입 전환율을 1.8배** 높일 수 있는 핵심 차별화 포인트.  
2. 기술 난이도·성숙도  
   • TRL 8(상용 다수 존재)로 성숙하나, **ERP 트랜잭션 무결성 + 다테넌트 환경에서의 런타임 샌드박싱**이 해결 과제.  
3. 당사 적합성  
   • SI 출신 인력 1,200여 명의 프로세스 모델링 역량과 AWS Seoul Region의 관리형 서비스(EKS, API Gateway, Step Functions)를 결합하면 **내재형 iPaaS**를 자체 구축할 수 있다.  
   • BPMN 2.0 + GraphQL federation 구조로 설계 시, 향후 마켓플레이스(파트너 앱) 확장도 용이.

### 후보 ③  CSAP Medium-급 Sovereign Cloud 아키텍처(데이터 토큰화 + PBAC)
1. ROI & 시장성  
   • 공공·규제 산업(금융·의료·바이오)의 클라우드 ERP 잠재 매출은 **2027년 5,800억 원**(시장 합산)으로 추정. CSAP Medium 인증 보유 시 입찰 성공률 +38%p(시장조달청 통계) 효과.  
2. 기술 난이도·성숙도  
   • TRL 6–7. 보안·규제 요구사항이 복잡하며 **국산 암호모듈 적용·망분리·정책기반 접근제어(PBAC)·토큰화**를 통합 설계해야 함.  
3. 당사 적합성  
   • 기존 공공 SI 노하우(행안부·과기정통부 프로젝트) + 네이버·KT Cloud 파트너십을 활용해 **“듀얼 CSP + 전용 국산 HSM”** 형태의 레퍼런스 아키텍처를 확보할 수 있다.  
   • 인증 준비 CapEx(약 30억 원)를 **정부 PoC 바우처(최대 40% 보조)**로 부분 상쇄 가능.

> [선정 결론]  위 세 기술은 (1) 단기 매출 증분 및 차별화 효과가 검증, (2) 당사 조직·재무 여력 범위 내 개발 가능, (3) 상호 보완적(GenAI → UI/의사결정, Low-code → 고객 확장, Sovereign Cloud → 규제 시장 진입)이라는 점에서 **3대 전략 기술**로 최종 선정한다.

---
## 6-2. 후보기술 개발계획 수립

### 1) 총괄 로드맵 개요
| 구분 | 착수 | MVP | GA(일반 공급) | 연간 투자 | 핵심 인력 |
|------|------|-----|--------------|-----------|-----------|
| GenAI Copilot | 2025 Q1 | 2025 Q3 | 2026 Q1 | 70억 KRW | ML Engineer 12, Data Scientist 6, Prompt Engineer 4, PM 2 |
| Low-code 플랫폼 | 2025 Q2 | 2025 Q4 | 2026 Q2 | 40억 KRW | Full-stack Dev 10, BPMN Modeler 3, DevRel 2, QA 3 |
| Sovereign Cloud | 2025 Q1 | 2026 Q1 | 2026 Q4 | 60억 KRW | Security Arch 5, Cloud Infra 8, Compliance Officer 3, PM 2 |
| **합계(’25~’26)** |  |  |  | **170억 KRW** | **70 FTE** |

(연 200억 원 AI R&D 예산 대비 85% 소요 → 추가 외부 펀딩·정부 지원금 *최대 40억* 확보 계획)

### 2) 상세 개발 단계 및 과업
1. GenAI Copilot  
   • **데이터 확보·정제(’25 Q1)**: 기존 20개 고객사 익명화 ERP 로그 1.2TB, 회계·SCM 도메인 용어사전 5만 개 구축.  
   • **모델 파인튜닝(’25 Q1–Q2)**: Llama 3-Ko 70B를 Bedrock Custom Model로 Fine-Tune(7,000 GPU-hour ≈ 7.5억 KRW).  
   • **Copilot SDK 개발(’25 Q2–Q3)**: 자연어 → BPMN workflow 변환, Key-Value RAG(retrieval-augmented generation) API 설계.  
   • **SecOps & 테스트(’25 Q3–’25 Q4)**: Red-team Prompt Injection 시뮬, PII mask recall 99% 목표.  

2. Low-code/No-code 플랫폼  
   • **BPMN Designer(Flutter Web) PoC(’25 Q2)**: 드래그&드롭 UI, GitOps 버전관리.  
   • **Runtime Engine(’25 Q3–Q4)**: K8s 기반 멀티테넌트 Sandbox, Tangram Policy로 리소스 QoS 격리.  
   • **Marketplace API(’25 Q4–’26 Q1)**: GraphQL federation, Revenue-share Billing(30:70).  

3. Sovereign Cloud 아키텍처  
   • **CSAP Gap Analysis & 설계(’25 Q1)**: 112개 통제항목 중 76개 이미 충족; 잔여 36개 변환 설계.  
   • **데이터 토큰화 플랫폼 구축(’25 Q2–Q3)**: Thales CipherTrust + Aurora PostgreSQL KMS 연동, 토큰 발급 TPS 5,000 이상.  
   • **PBAC 정책 엔진(’25 Q3–’26 Q1)**: OPA(Open Policy Agent) 기반, 직책·행위·지리정보 조건부 권한.  
   • **인증 심사(’26 Q2–Q3)**: KISA 심사 + 침투테스트, 목표 합격 ’26 Q3.

### 3) 인력·조달 전략
- **내부 전환 60% / 외부 확보 40%** 구조.  
- ML·보안 전문가 부족分은 **2025 상반기 석·박사 산학협력 인턴십 10명** 및 **글로벌 프리랜서 플랫폼(TopTal, Upwork) 계약 8명**으로 보강.  
- 하드웨어(GPU Cluster 40대, H100 기준)는 **AWS Seoul Region EC2 P5 리저브드 3년(약 14억 KRW)** 계약으로 CAPEX → OPEX 전환.

---
## 6-3. 마일스톤(개발 완료~시장 출시)

| 단계 | 기간 | 주요 목표 | 완료 지표(KPI) |
|------|------|----------|----------------|
| **M0 : Kick-off** | 2025 1월 | PMO 구성, 예산·스코프 확정 | 인력 90% 투입 완료, 예산 편성 승인 |
| **M1 : MVP Complete** | 2025 9월 | GenAI Copilot α, Low-code Designer β 배포 | • 3개 고객 PoC 착수  
• Copilot Top-5 업무 시나리오 정확도 85% |
| **M2 : Private Beta** | 2026 2월 | Sovereign Cloud PoC 통과, Marketplace α 오픈 | • CSAP 준비율 80% 
• PoC 고객 NPS ≥ 60 |
| **M3 : GA & CSAP Medium** | 2026 10월 | ① 모든 모듈 GA, ② CSAP Medium 인증 획득 | • 첫 유료 고객 20사  
• 월 MRR 5억 KRW 달성 |
| **M4 : Scale-up** | 2027 4월 | 파트너 마켓 50개 애드온, 해외 리전 1개 확장 | • 파트너 매출 비중 15%  
• 총 ARR 120억 KRW |

### 단계별 상세 설명
1. **M0 → M1**: “Fast Fail” 철학 적용—9개월 내 사용자 PoC 확보로 기능·UX 빠른 피드백.  
2. **M1 → M2**: 규제 PoC와 기능 고도화를 병행. PBAC·토큰화 모듈이 KPIs를 통과해야 M2 인정.  
3. **M2 → M3**: CSAP 심사·인증 취득이 크리티컬 패스(약 120일 소요). 인증 완료 즉시 금융·공공 대형 RFP 참여.  
4. **M3 → M4**: 파트너 생태계 확장을 통한 **비직접 매출(애드온, AI Credit) 15% 이상** 달성을 목표로, DevRel·Partner Success 팀 신설.

### 리스크 & 대응
- **기술 지연**: GenAI 모델 성능 미달 시 *Open-Source 모델 교차 Ensemble*로 정확도 보정.  
- **인증 실패**: KISA 예비 심사 단계에서 갭 10건 이상 발견되면, **컨설팅 파트너(삼정 KPMG) 긴급 투입**.  
- **예산 초과**: GPU 사용량이 월 15% 초과 시 *Inference Endpoint Auto-Scaler*로 코스트 최적화.

---
## 결론 및 기대효과
• **24개월 내 CSAP Medium + GenAI Copilot GA** 달성 시, 2027년 기준 **국내 클라우드 ERP 신규 계약의 8% 점유(ARR ≈ 120억 KRW)**가 현실적인 목표로 산정된다.  
• 3대 기술 모두 상호 시너지가 높아, **초기 고객 획득 → 파트너 확장 → 규제 시장 진입**이라는 3단 로켓을 완성할 수 있다.  
• 투자대비효과(ROI)는 보수적 가정 시 **36개월 NPV 102억 KRW, IRR 28%**로 추정되며, 이는 당사 내부 hurdle rate(15%) 대비 우수한 수준이다.  

따라서 본 6장에서 제안한 **"GenAI Copilot – 로우코드 플랫폼 – Sovereign Cloud"** 삼각 엔진은 우리 기업의 중장기 AI·클라우드 사업 전환을 견인할 **핵심 성장 동력**으로, 즉시 실행을 권고한다.