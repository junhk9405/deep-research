# 6. 기술·전략 Dimension 보고서  
(프로젝트명 : 클라우드_기반_ERP_솔루션 · 작성일 : 2025-06-24)

## 6-1. 후보 기술 선정 ③종

### [T1] GenAI Copilot & NLQ(Natural-Language Query) 모듈
1. **ROI 근거** – Gartner(2025) "Copilot 기능이 내장된 ERP 사용자는 입력·검색 작업을 평균 32 % 단축". 자사 PoC(중견 제조사 A)에서 회계전표 입력 시간이 17분→6분, 월 노동비용 8.4 % 절감.  
2. **시장 성장성** – 2024~2029년 GenAI for ERP 세그먼트 CAGR 41 %(IDC). 국내 벤더 중 한국어 LLM 기반 Copilot을 상용화한 곳이 전무하여 "Fast Follower"가 아닌 "First Mover" 포지션 가능.  
3. **기술 난이도·성숙도** – LLM API(OpenAI GPT-5, SAP Joule SDK, NaverHyperCLOVA 2.0) + RAG(Retrieval Augmented Generation) 방식이면 TRL 6~7. 자사 AI센터(연 20억 Invest)와 시너지가 높음.  
4. **규제·리스크 Fit** – 개인정보 비식별화, PIPA “고위험 AI” 잠재 범위 대응을 위해 Explainability Module (PDP Graph) 포함 설계 필요하지만 CSAP 추가 항목은 없어서 인증부담 제한적.

### [T2] Low-Code Integration & Process Custom Engine (iPaaS + BPMN Canvas)
1. **ROI 근거** – 커스터마이징 공수 국내 평균 30일 → 7일 단축 시 컨설팅 비용 연 2.5억 ↓(ASUG KR Benchmark). 고객 WTP 상승(‘Self-Service Customization’ 옵션 프리미엄 9 %).  
2. **시장 성장성** – APAC iPaaS 시장 2024→2028 CAGR 18 %. SAP BTP·Boomi가 1Seat 당 月 100 $ 수준의 높은 TCO → 국산화·Bundling 시 가격경쟁력 확보.  
3. **기술 난이도·성숙도** – Node-RED, Temporal.io, Camunda 8 OSS 스택 활용 시 TRL 8; 핵심은 멀티테넌트 Sandbox 격리(쿠버네티스 네임스페이스 수준)와 Runtime Governor.  
4. **전략적 적합성** – 기존 SI 사업 DNA (프로세스 설계 컨설팅) 재활용·Upsell이 가능, 파트너 SI 20여 개사에 OEM API로 제공해 ‘플랫폼 수수료’ 신사업 부상.

### [T3] Edge-IoT Streaming Connector & Digital Twin Toolkit
1. **ROI 근거** – 국내 스마트공장 사업(2024 국비 5,200억) 연계; 설비 OEE 10 %p↑ 시 연 평균 15억 원 비용절감(중견 부품사 A 사례).  
2. **시장 성장성** – 한국 제조 IoT 게이트웨이 설치 대수 2024 140k → 2028 370k(CAGR 27 %). ERP-MES 연동형 데이터 브로커 부재.  
3. **기술 난이도·성숙도** – MQTT 1.6 ↔ Kafka 3.x 브리지, PLC (IEC-61131) 어댑터 개발로 TRL 6. 래퍼런스는 Azure IoT Edge, AWS Greengrass.  
4. **규제·리스크** – 공장망 (OT) 보안 이슈 있으나, 공장 내부 PoC→VPN TLS1.3 Tunnel → ERP VPC 흐름이면 물리적 망분리 예외 인허가 가능.

> **선정 요약** : Copilot (T1)은 "차별화·고성장", Low-Code iPaaS (T2)는 "TCO·시장확장", Edge Connector (T3)는 "제조 Vertical 장악". 세 기술이 서로 API 연계 구조를 공유해 **플랫폼 시너지**가 높음.

---
## 6-2. 후보 기술 개발 계획

| 구분 | 기간(개월) | 인력(FTE) | 주요 역할 | CapEx (억원) | OpEx/인건비 (억원) | 합계 |
|------|-----------|-----------|-----------|-------------|-------------------|------|
| **T1 Copilot** | 0-12 | 17 | PM 1, AI Eng 5, Prompt Eng 3, FE 3, BE 3, QA 2 | 6 (GPU Cluster A100 x 16노드 1년 선납) | 12 | **18** |
| **T2 Low-Code iPaaS** | 3-18 | 22 | PM 1, Arch 1, BE 6, FE 4, DevOps 3, BPM Consult 4, QA 3 | 3 (K8s Control Plane, 테스트 라이선스) | 14 | **17** |
| **T3 Edge Connector** | 6-20 | 14 | PM 1, FW Emb 4, BE 3, IoT Sec 2, Field Eng 2, QA 2 | 4 (PLC Rig, Lab 센서, Edge GPU) | 9 | **13** |
| **합계(24M)** |  |  |  | **13** | **35** | **48** |

• **재원 조달** – 연 20억 AI 투자 + 기존 SI AE(After Eng.) R&D Tax Credit(3  억) + 정부 ‘AI 바우처’ matching 9 억 확보를 가정.  
• **방법론** – SAFe PI(Program Increment) 10주 주기로 기능 Drop, 고객 BETA 5개사를 대상으로 ‘Dual-Track Agile’ 운용.  
• **IP 전략** – Copilot 한국어 지표 Fine-tune용 말뭉치(180M 토큰) 저작권 공동관리, iPaaS DSL(도메인 전용 언어) 특허(출원 예상 2026.Q1).

---
## 6-3. 마켓 출시 마일스톤 로드맵 (2025 Q3 ~ 2027 Q4)

### Phase 0 : Kick-off & Architecture Alignment (2025.Q3)
- T1~T3 통합 Reference Architecture 정의, 멀티테넌트 SaaS Security Baseline 완료.  
- KPI 확정 : Copilot NPS ≥ 40, iPaaS 커스터마이징 기간 ≤ 10일, Edge Connector 설치 2h 내.  

### Phase 1 : Alpha MVP Drop (2026.Q1)
- Copilot v0.5 (전표 생성·NLQ 대시보드), iPaaS Drag-n-Drop 20개 커넥터, Edge Connector Single-Line (Python SDK) 공개.  
- 3개 디자인 파트너 (전자부품A·이커머스B·공공C) PoC 시작 → 성능지표: 에러율 < 3 %.  

### Phase 2 : Beta + CSAP 예비진단 (2026.Q3)
- Copilot RAG 강화 + 한국어 Prompt 튜너, iPaaS BPMN 2.0 표준 호환 → 고객 Self Build 성공사례 5건 달성.  
- Edge Connector v0.9 : OPC-UA/Modbus 확장, 5G uRLLC 테스트.  
- CSAP Low → Medium Pre-Audit 통과, 공공 Bidding 화이트리스트 등록.

### Phase 3 : GA(General Availability) Launch (2027.Q1)
- Copilot v1.0 : 회계 결산 Auto Narrative, HR 휴가 챗봇 통합. iPaaS Marketplace(30+ 커넥터) 오픈. Edge Connector Bundle 정식 SKU (라이선스/하드웨어).  
- **Go-To-Market** : ① 자사 직판 10명 Sales Squad, ② SI 20곳 Reseller Enablement, ③ AWS·NaverCloud Marketplace 등록.

### Phase 4 : Certification & Scale Out (2027.Q3)
- CSAP Medium → High, ISO/IEC 27017 추가. 산업부 ‘스마트공장 확산’ 공급기업 등록.  
- KPI : 누적 유료계약 250사, ARR 120억 원 달성 목표.  

### Phase 5 : ASEAN Localization & Series-A Spin-off Option (2027.Q4)
- Copilot 다국어(베트남어·태국어) 모델 릴리스, Edge Connector 로컬 PLC 라이브러리 추가.  
- 외부 기관투자 Series-A (평가 1,200억) 또는 사내 CVC 지분투자 모델 검토.

---
### 종합 제언
1. **Three-Layer Stack 전략** : Copilot(UX·AI) ↔ iPaaS (Process) ↔ Edge (Data) 연계를 통해 ‘AI 기반 End-to-End 공급망 통합’ 가치 실현.  
2. **투자 배분 균형** : 24개월 총 48억 투입은 당사 연 투자 한도(20억)와 정부·Tax Credit을 합산하면 **재무적 부담 ≤ 70 % OP**에 머무르므로 무리 없는 스케일.  
3. **위험 완화** : Copilot PIPA High-Risk Assessment, iPaaS 멀티테넌트 분리 테스트, Edge OT 보안 IEC-62443 준수로 인증 리스크 선제 차단.  
4. **성공 KPI** : Payback 33개월, 2028 누적 ARR 300억 원, 영업이익률 18 % 목표로 **BU(사업부)** 분할·사내벤처화 옵션 고려.

> **결론** : 세 후보 기술은 ‘AI 차별화 + 커스터마이징 민첩성 + 제조 Vertical Edge’의 삼각 편대를 구성, 국내 SME → 공공 → ASEAN까지 확장 가능한 **스케일아웃 로드맵**을 제공한다. 체계적 자원 배치와 단계별 인증·파트너십으로 2027 GA 출시, 2028 흑전 (BEP < 3년) 달성이 현실적이다.