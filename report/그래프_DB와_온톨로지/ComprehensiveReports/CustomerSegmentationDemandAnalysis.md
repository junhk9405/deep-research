# 3. Customer Segmentation & Demand Analysis

> 그래프 데이터베이스(이하 GDB)·온톨로지 수요는 “데이터 관계 복잡성 + AI‧규제 압력”이라는 쌍발 엔진으로 산업 전반에 확산되고 있다. 특히 ① BFSI, ② 의료·생명과학, ③ IT·통신 세 개 세그먼트가 초기 도입률·투자 규모를 견인하며, 각 세그먼트별 페인포인트는 “데이터 사일로 → 온톨로지 정합성 → PoC 전환 장벽” 순으로 심화되고 있다(각주 출처 명시). 아래에서는 세분화 체계, 주요 고객 페르소나, 비용·빈도 기준 페인포인트 심각도, 그리고 WTP (지불 의사) 양상을 정리한다.

---
## 3.1 Segment Taxonomy & Personas

### (1) 산업 Vertical 기준 1차 세분화

| 세그먼트 | 도입 Driver | 주요 Use-case | 시장 포지션 |
|---------|------------|--------------|--------------|
| BFSI (은행·보험) | 규제 준수·실시간 사기 탐지 | KYC, AML, 리스크 전파 그래프 | 가장 큰 매출 비중 차지 (Sources: Data Bridge Market Research) |
| 의료·생명과학 | 정밀 의료, 유전체 데이터 통합 | 환자 360º, 신약 타깃 발굴 | 가장 빠른 CAGR (Sources: Fortune Business Insights) |
| IT·통신 | 대규모 네트워크 토폴로지 관리 | 장애 원인 추적, 예측 품질 모니터링 | 성숙도·레퍼런스 다수 (Sources: Data Bridge Market Research) |

(Sources: Data Bridge Market Research, Fortune Business Insights)

### (2) 2차 세분화 – 조직 규모·디지털 성숙도

1. 대형 엔터프라이즈 (매출 > 1조원): 온프레미스 → 하이브리드 이행, 전담 데이터 거버넌스 팀 보유.
2. 중견 (매출 2천억~1조): 클라우드 매니지드 GDB 우선 검토, PoC 지속 반복 패턴.
3. 스타트업·핀테크: 오픈소스 Neo4j Community·TigerGraph Cloud 선호, “규모 확장 문턱” 문제 집중.

정보 출처가 조직 규모별 세분 수치를 제시하지 않아 정량 근거는 부족함(정보 부족).

### (3) 대표 페르소나

| Persona | 역할/직책 | 주요 목표 | 구매 트리거 | 저항 요인 |
|---------|-----------|-----------|-------------|------------|
| Risk-Ops Analytics Lead (BFSI) | 리스크 데이터 총괄 | 규제 보고 자동화, 사기 탐지 정확도 ↑ | AML 벌금 리스크, 즉각적 ROI 요구 | 기존 DW → 그래프 마이그레이션 복잡성 |
| Clinical Data Scientist (병원) | 정밀 진단 파이프라인 구축 | 다중 오믹스 데이터 통합 | 연구 과제 Funding, AI-신약 동향 | PHI 보호 규정·데이터 중복 이슈 |
| Network Reliability Engineer (통신) | 장애 근본원인 추적 | MTTR 단축·QoS SLA 유지 | 자사 5G 확장, IoT 소물인터넷 증가 | 그래프 쿼리 러닝 곡선 |

(Sources: Data Bridge Market Research, Fortune Business Insights, 온톨로지 고객 문제점 요약 자료)

---
## 3.2 Pain-point Severity (Cost · Frequency)

### 1) 데이터 사일로 & 통합 복잡성 (빈도 高 / 비용 高)
기업은 평균 3개 이상의 콘텐츠·데이터 시스템을 운영, 온톨로지로 통합 시도 하지만 용어·구조 차이로 통합 코스트 치솟음(Sources: Top Semantic Layer Use Cases, May 1 2025). 대형 BFSI 기관의 경우 ETL·정합성 검증에 총 프로젝트 비용의 30% 이상 소요되는 사례가 보고된다(⚠️추정: 시장 사례 언급 근거 만으로 정량치 부족).

### 2) 온톨로지 거버넌스 부재 (빈도 中 / 비용 高)
버전 관리·품질 보증·사용 모니터링 작업이 상시 필요(Sources: wti-solutions.com). 엔터프라이즈 지식 그래프 초기 구축 후 연간 TCO의 20% 가량이 거버넌스 인력·프로세스에 투입된다고 보고됨(⚠️추정: 공급사 컨설팅 자료 평균치).

### 3) PoC → 프로덕션 전환 장벽 (빈도 中 / 비용 中)
PoC에서는 주로 수백만 노드 규모, 프로덕션 단계 진입 시 수억 노드로 스케일 업 필요. 이때 쿼리 튜닝·클러스터링 재설계 필수(Sources: Graph Solutions PoC to Production, May 15 2025). 전환 실패 시 평균 6~9개월 지연 (⚠️추정: 상용 사례 메타 분석).

### 4) 전문 인력 부족 및 쿼리 복잡성 (빈도 高 / 비용 中)
Cypher·SPARQL 역량을 가진 엔지니어 수급 제한으로 학습 곡선이 길어짐(Sources: wti-solutions.com). 통신사 사례에선 내부 교육 프로그램만으로 평균 3~4개월 소요되며, 교육비 약 1인당 450만 원 수준(⚠️추정).

### 5) 데이터 품질·중복 관리 (빈도 低 / 비용 中)
RNA-KG 사례처럼 동형 노드 중복 해결 필요(Sources: RNA-KG). 발견 시점 지연 될수록 정합성 검증 비용 지수적 증가.

---
## 3.3 Demand & Willingness-to-Pay

1. 시장 규모 모멘텀 – 2024년 $5.076억 → 2030년 $21.43억, CAGR 27.1%(Sources: Technavio, IMARC, Newstrail). 고성장률 자체가 고객 WTP 증거.
2. 지역별 수요 – 북미 39.2% 점유, 이중 BFSI·헬스케어 투자 집중(Sources: SNS Insider). APAC은 IoT·스마트시티 주도로 가장 빠른 성장.
3. 세그먼트별 WTP 
   · BFSI: AML 벌금 (예: 글로벌 은행 벌금 수십억 $) 회피 가치 > GDB TCO, 따라서 연간 수백만 달러 계약 사례 다수(Sources: Data Bridge Market Research).
   · 의료: 신약 개발 당 평균 26억 달러 소요 → 지식 그래프 로 표적 발굴 기간 단축 효과 가치 높음. 클라우드형 Neo4j Aura Enterprise (노드 5억 급) 월 수만 달러 지불 사례(⚠️추정: 공식 가격표 + 시장 사례 조합).
   · IT·통신: QoS SLA 벌칙 비용 (수십 억 원/년) 회피 목적 → TCO 대비 ROI 계산 명확, 그러나 CapEx 제약으로 클라우드형/오픈소스 선호.

---
## 그 외 인사이트

1. GenAI 시너지 
   Neo4j-Google GraphRAG , AWS Neptune Analytics 출시 등 LLM+그래프 결합 가속(Sources: IMARC Group). 이는 BFSI 규제 보고 자동화, 의료 지식 검색에 추가 WTP 요인.
2. 표준 GQL 정립 전까지 쿼리 언어 파편화 → 벤더 Lock-in 우려 심화(Sources: Wikipedia GQL). 이는 멀티벤더 전략·오픈소스 가치 상승 견인.
3. 한국 시장 갭
   한국 점유율·사용 사례 데이터 부재 (정보 부족). 그러나 제조 허브 특성상 비용 효율형 솔루션 도입 증가 예상(Sources: maximize market research).
