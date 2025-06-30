# 6. 기술·전략 Dimension 보고서  
프로젝트: **클라우드 기반 ERP 솔루션** (Mid-size IT/SI 기업, 연 투자 20 억 KRW)  
작성일: 2025-06-24  

---
## 6-1. 후보 기술 선정(≤ 3종)
| 번호 | 후보 기술 | 시장성·ROI | 기술 난이도·성숙도 | 우리 기업 적합성(역량·차별화) | 선정 사유 요약 |
|------|-----------|------------|--------------------|--------------------------------|------------------|
| T1 | **AI-Native Vertical Cloud ERP for 제조·SME**  
(GenAI Copilot+예측 분석 내장) | 韓 제조 SME ERP CAGR ≥ 18 % · AI포함 딜 30 % 가량 (’24 SAP)  
재고·설비 비용 평균 15 %↓ → 3년 내 ROI > 170 % | GenAI 모듈 (TRL* 7)·ML 수요 예측 (TRL 9)  
모듈화 ERP (TRL 8) | • 社 제조 SI 레퍼런스 100 건+  
• 파트너 GPU 팜 계약 (SK T Cloud AI) | *SME 핵심 Pain Point(비용·전문인력 부족) 해소 + AI 부가가치* |
| T2 | **Hybrid/Composable ERP Platform (K8s·MSA·iPaaS)**  
‘Clean Core’ + API 퍼스트 | 하이브리드 ERP 採用 의향 48 %(NIPA ’24)  
레거시 → 클라우드 전환 시장 2.3 조 KRW | K8s (TRL 9)·Event Mesh (TRL 7)  
MSA 패턴 준성숙 | • 컨테이너 SI 실적 (LGU+ 5G BSS)  
• iPaaS Boomi Elite 파트너십 | *규제(금융·공공) + 레거시 통합 수요 해결, 확장성·속도 우위* |
| T3 | **CSAP-High급 Secure Data-Residency Layer**  
(국산 암호화 ARIA/SEED + Confidential Computing) | 공공·의료 ERP 시장 1.3 조 KRW, High 인증 보유 벤더 < 5 곳  
진입 시 수주 승률 +30 % 전망 | Confidential VM (TRL 6)·암호모듈 (TRL 9)  
CSAP 프로세스 복잡도 高 | • 국내 DC 운영 경험·보안 컨설팅 조직 보유  
• Naver Cloud Medium → High 공동 인증 MOU | *공공·방산 수요 확보·레버리지, 경쟁자 대비 진입장벽 ↑* 

> *TRL: Technology Readiness Level*

### 선정 논리
1. **시장 성장성 & 수익성**: 세 기술 모두 CAGR 10 % 초과 세그먼트를 직접 겨냥.  
2. **자사 역량 시너지**: 제조 SI, 컨테이너·보안 프로젝트 경험 → 개발 난이도 관리 가능.  
3. **포트폴리오 균형**: T1(수익 중심) + T2(플랫폼 확장) + T3(진입장벽·보안)으로 리스크 헤지.  

---
## 6-2. 후보 기술 개발 계획
### (1) 공통 프레임: 3-Year Dual-Track Roadmap
| 연차 | 활동 축 A (T1 + T2: 기능·플랫폼) | 활동 축 B (T3: 보안·컴플라이언스) | 연 투자 배분(억 KRW) | 주요 인력(FTE*) |
|------|-------------------------------------|---------------------------------------|------------------|----------------|
| Y0.5 (사전) | ‑ 시장·요구사항 워크숍  
- PoC 대상 3개 고객 선정 | ‑ CSAP Gap 분석  
- 암호모듈 벤치마크 | 2 | PM 1, BA 2, Sec Analyst 1 |
| Y1 | ► **MVP v1**:  
– 재무·SCM 모듈 + GenAI Copilot  
– MSA 아키텍처 Skeleton  
– iPaaS 커넥터 10종 | ► **보안 Core**:  
– 데이터 암·복호 SDK  
– Confidential VM PoC  
– CSAP 신청서 작성 | 8 (T1 4, T2 2, T3 2) | FE·BE Dev 6, ML Eng 2, DevOps 2, Sec Eng 2, QA 2 |
| Y2 | ► **MVP v2**:  
– 제조 MES 연동  
– Copilot 범위 확대(수요예측)  
– Marketplace API 공개 | ► **CSAP-Medium 취득**  
– PenTest, DR Test  
– 국산 암호 HW 모듈 연동 | 7 (T1 3, T2 2, T3 2) | Dev 5, ML 3, iPaaS Eng 2, Sec Eng 3, Compliance Mgr 1 |
| Y3 | ► **GA**:  
– Subscription Billing  
– 멀티테넌시 최적화  
– 파트너 SDK | ► **CSAP-High 취득 & IRAP Mapping**  
– Confidential Computing GA  
– 공공·의료 PoC | 6 (T1 3, T2 1, T3 2) | Support 3, FinOps 1, Sales SE 2, Sec Ops 2 |
| 합계 | | | **23 억 KRW** (3년) | Peak FTE ≈ 20 |

*FTE: Full-Time Equivalent*

### 세부 일정(가로)
1. **PoC 승인 (D + 3 M)** → 2. **MVP v1 릴리스 (D + 12 M)** → 3. **Pilot 3사 고라이브 (D + 18 M)** → 4. **CSAP-Medium 완료 (D + 24 M)** → 5. **GA (D + 30 M)** → 6. **CSAP-High & 공공 RFP 수주 (D + 36 M)**

### 인력·조직 계획
- **Tribe 구조**:  
  • Platform Squad(T2)  • AI Squad(T1)  • Security Squad(T3)  
- **외부 파트너**:  
  ‑ Naver Cloud : CSAP 프로세스, 국산 KMS 제공  
  ‑ 제조 컨설턴트(3인) : Industry best-practice 내재화  
- **스킬 확보**:  
  ‑ GenAI Prompt Engineer 2명, SuiteScript/ABAP Cloud 개발자 4명  
  ‑ CSA (Certified Cloud Security) 자격 보유 2명 

### 예산 집행 구조(3년, 억 KRW)
- 인건비 11  
- 클라우드 인프라 (테스트 + GPU) 4  
- 외부 라이선스·iPaaS 2  
- 인증·감사·컨설팅 3  
- 예비 Risk Buffer 3  

> 연 20 억 투자 CAP 내에서 연평균 7.7 억 사용 → **재무 여력 충분**

---
## 6-3. 개발 완료 → 시장 출시 마일스톤
| 단계 | 일정 | 목표·출력물 | KPI / Go-Gate |
|-------|-------|-------------|---------------|
| M0 Kick-off | 2025-07 | ‑ PMO 구축  
- 고객 자문위원회(CAB) 발족 | 예산 승인 문서, R&R 정의 |
| M6 MVP v1 | 2026-01 | ‑ 재무·SCM 코어 + GenAI Copilot  
- K8s Cluster & CI/CD 파이프라인 | • 기능 커버리지 40 %  
• M/M* Downtime < 1h |
| M12 Pilot Go-Live | 2026-07 | ‑ 제조 SME 3사 실투입  
- iPaaS 10커넥터 완료 | • 재고 오차 < ±5 %  
• NPS ≥ +20 |
| M18 Security Freeze | 2027-01 | ‑ 코드 Freezing  
- CSAP-Medium 심사 패스 | • 취약점 High 0건  
• PenTest CVSS < 7 |
| M24 General Availability | 2027-07 | ‑ 상용 SaaS 포털 오픈  
- Subscription Billing 시스템 | • First Revenue ≥ 5 억  
• MRR** ≥ 4,000 만 KRW |
| M30 CSAP-High & 공공 RFP | 2028-01 | ‑ High 등급 인증서  
- 공공·의료 SI 제안서 | • RFP 수주율 ≥ 20 % |
| M36 Scale-Up | 2028-07 | ‑ Marketplace 30개 애드온  
- 해외 (일본) PoC 시작 | • 누적 ARR 30 억+  
• Churn < 4 % |

*M/M Downtime: 월간 평균 장애시간; **MRR: Monthly Recurring Revenue*

---
### 성공 가늠 지표
1. **Financial**: 3년 누적 ARR ≥ 30 억 KRW, Gross Margin > 55 %.  
2. **Operational**: 배포 주기 4주, 서비스 가용성 99.9 %.  
3. **Customer**: NPS +30, 레퍼런스 기업 10개 확보.  
4. **Compliance**: CSAP-High, ISO 27001, GDPR-KOR Mapping 완료.  

---
## 결론 및 전략 제언
1. **T1 (AI Vertical ERP)**로 단기 수익 창출 + **T2 (Composable Platform)**으로 장기 확장성을 확보.  
2. **T3 (보안·CSAP High)**는 공공 · 방산 RFP에서 블루오션을 창출, 가격 프리미엄 가능.  
3. 3년 내 23 억 투자로 MVP → GA → 인증 → 스케일업의 **풀사이클** 완주가 가능하며, 연 투자 CAP (20 억) 대비 재무 레버리지 여유 充분.  
4. 핵심 성공인자는 △제조 SME 레퍼런스 선점 △AI Copilot 상품화 속도 △CSAP High 조기 획득 △MSA Clean-Core 운영 조직화.  

> **“AI + Composable + Compliance” 3C 전략**으로 한국 ERP 차세대 파워 플레이어 포지션을 선점하자.