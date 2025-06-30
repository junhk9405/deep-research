## 6. 기술/전략 Dimension

### 6-1. 후보 기술 선정

**후보① 그래프 데이터베이스 Core Platform(Neo4j Aura or AWS Neptune)**  
• 글로벌 그래프 DB 시장은 2024 년 5.07 억 달러→2030 년 21.43 억 달러, CAGR 27 % 이상으로 모든 리서치 기관이 고성장에 합의한다(Source: Data Bridge Market Research).  
• 관계형 대비 최대 1,135 배 쿼리 성능(친구-의-친구 실험)으로 즉각적인 인프라 TCO 절감 효과가 입증됐다(Source: information-age.com).  
• Fortune 100 기업 76 %가 이미 평가·도입을 완료해 성숙도가 높고, Aura·Neptune과 같은 완전관리형 DBaaS가 초기 CAPEX 장벽을 낮춘다(Source: TDWI, Neo4j docs).  
⚠️추정: 당사 SI 레거시·SQL 자산 재사용이 가능(Neo4j APOC & JDBC), 단기 ROI 확보 가능성이 가장 크므로 1순위로 선정.

**후보② 온톨로지 기반 지식 그래프(GraphDB Enterprise)**  
• RDF/OWL 추론을 통해 숨은 관계·데이터 불일치를 실시간 탐지, 금융 AML·정밀의료 등 규제‧고난도 도메인에서 가치가 크다(Source: GraphDB 10.8 documentation).  
• LLM + 지식 그래프 (RAG) 조합 시 답변 정확도가 15–20 % 향상된다는 보고가 있어 생성형 AI 사업 확대와 시너지가 높다(⚠️추정: Neo4j LLM 백서 요약).  
• 다만 추론 엔진 메모리 요구와 OWL 전문 인력 부족이 도입 장벽으로 작용해 ‘단계적 확대’ 전략이 필요하다(Source: graph.build resources/ontology).  
⚠️추정: 공공·의료 규제 대응 SI 레퍼런스 확보를 위해 전략적 투자 가치가 높아 2순위로 선정.

**후보③ 그래프+벡터 융합 모듈(AWS Neptune Analytics 또는 Neo4j Vector)**  
• 2023 년 AWS Neptune Analytics, 2024 년 Neo4j GraphRAG 출시 등 ‘그래프+벡터’ 제품이 잇따라 상용화되며 생성형 AI·실시간 추천 시장 공략의 핵심 백엔드로 부상하고 있다(Source: IMARC Group, Grand View Research).  
• 벡터 검색은 유사도 탐색, 그래프는 관계 추론을 담당해 RAG 성능을 구조적으로 상향시킨다(Source: Grand View Research).  
⚠️추정: 당사가 추진 중인 20 억 AI 예산과 결합 시, 고부가가치 RAG 패키지 SI 사업(금융 챗봇·제조 지식 Q&A)으로 확장이 용이하므로 3순위로 채택.

---

### 6-2. 후보 기술 개발 계획

(모든 일정·비용·인력은 회사 AI 투자 20 억/년, 기존 SI 인력 900 명(⚠️추정) 내 가용 범위를 고려한 전략적 추정치임.)

| 구분 | 단계 | 기간 | 필요 인력(정규/외주) | 연 CapEx·Opex | 주요 과업 |
|------|------|------|----------------------|---------------|-----------|
| 그래프 DB Core | PoC → MVP | 0-6 개월 | 데이터아키텍트 2, DevOps 2, PM 1 | 2 억 | 스키마 설계, Neo4j Aura Deploy, 성능 벤치마크 |
|  | Prod Cluster | 7-12 개월 | 위 + Site Reliability 2 | 3 억 | 다중 AZ 클러스터, HA 테스트, 레거시 DW ETL |
| 온톨로지 KG | Ontology Design | 0-4 개월 | Ontologist 2(외주), Domain SME 1 | 1.5 억 | OWL 모델링, Protege 워크숍 |
|  | KG Build | 5-12 개월 | Graph Engineer 2, SPARQL Dev 2 | 2.5 억 | GraphDB 엔터프라이즈 구축, 추론 규칙 테스트 |
| Graph+Vector | RAG Prototype | 0-3 개월 | ML Engineer 2, Graph Engineer 1 | 1 억 | OpenAI/AWS Bedrock 연동, Neptune Analytics PoC |
|  | SaaS API Wrap | 4-9 개월 | Full-stack 2 | 1.5 억 | REST/GraphQL API, 멀티테넌시 보안 |
| 공통 거버넌스 | 지속 | 연중 | Ontology Steward 1, SecOps 1 | 0.8 억 | 버전관리·모니터링, ISO 27001 문서화 |

⚠️추정: 총 연간 투입 예산 ≈ 12.3 억 원 (< 20 억 투자 한도) → 재무 여력 내 무리 없는 범위.

---

### 6-3. 개발 완료 후 시장 출시 마일스톤

1. **M0 (0-3 개월) – PoC 완료**  
• 그래프 DB 샘플 워크로드(사기탐지), RAG 챗봇 프로토타입 동시 시연.  
• 성공 지표: 쿼리 지연 50 ms 이내, 초기 정확도 70 % 달성(Source: information-age.com 성능 벤치마크).  
• 의사결정 Gate: 사업화 Go/No-Go.

2. **M1 (4-6 개월) – MVP & 첫 레퍼런스 계약**  
• 금융 고객(⚠️추정: 시중은행 KYC 부서) 대상 그래프 DB MVP 배포.  
• KPI: AML 룰 탐지 F-score ≥0.85, 시스템 가동률 99.9 %.  
• 계약 규모 ≥ 3 억 원(초기 라이선스 + 서비스).

3. **M2 (7-12 개월) – 프로덕션 런치 & 클라우드 SaaS 전환**  
• Neo4j Aura Enterprise 또는 Neptune Serverless로 전환, 국내 AWS 리전 거버넌스 검증(Source: TDWI – Aura 사례).  
• 첫 해 운영 TCO < 5 억 원 달성, 고객 NPS ≥70.

4. **M3 (13-18 개월) – 온톨로지 거버넌스 CoE 구축**  
• GraphDB 엔터프라이즈 + SHACL 검증 파이프라인 가동(Source: GraphDB 11.0 documentation).  
• 내부 Ontology Stewardship 팀 설립, 버전·품질 관리 자동화 커버리지 ≥80 %.

5. **M4 (19-24 개월) – RAG SaaS 상용 서비스 출시**  
• 그래프+벡터 융합 API 상품化, 금융·제조 2차 고객 확보.  
• 목표 ARR (반복 라이선스+MSP) ≥ 20 억 원, 투자 회수 기간 ≤ 24 개월 ⚠️추정.

6. **M5 (25-36 개월) – 해외 시장 Joint Go-To-Market**  
• Neo4j 또는 AWS 파트너십을 통한 동남아 스마트시티 프로젝트 참여(Source: Grand View Research – APAC CAGR 최고 언급).  
• KPI: 해외 매출 비중 15 % 달성, 지식 그래프 기반 SI 매출 YoY 40 % 성장.

---

### 결론 및 권고
1) 그래프 DB Core를 **1단계 도입**해 6-12 개월 내 즉각적 ROI를 확보하고, 2) 온톨로지 KG를 **2단계로 점진 확대**하여 공공·금융 규제 시장을 선점, 3) 12 개월차부터 그래프+벡터 RAG 모듈을 **SaaS 형태**로 상품화하면 회사 AI 투자 20 억 한도 내에서 2년 내 ARR 20 억 원 달성과 해외 진출 교두보를 마련할 수 있다(종합 Sources: Data Bridge Market Research; information-age.com; GraphDB documentation; IMARC Group; TDWI).