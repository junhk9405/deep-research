# 3. Customer Segmentation & Demand Analysis

> 그래프 데이터베이스-온톨로지 시장은 “복잡한 관계 데이터를 신속히 탐색하려는 대기업 도메인 전문가”와 “민첩성을 중시하는 중견·중소 혁신 기업”이라는 두 축으로 수요가 양분된다. 이들은 수작업 관계 관리·데이터 사일로로 인해 연평균 수십만 달러 이상의 운영·기회비용을 부담하고 있으며, 문제 해결을 위해 온톨로지 기반 지식그래프와 엔터프라이즈급 그래프DB(예: GraphDB, Neo4j)에 프리미엄을 기꺼이 지불한다는 점이 확인된다. (Sources: Allied Market Research; MarketsandMarkets; GraphDB documentation 10.6-10.8)

## 3.1 Segment Taxonomy & Personas

### 세그먼트 체계
1. **엔터프라이즈 지식그래프 개발자(대기업·공공)** – 방대한 도메인 지식을 온톨로지로 표준화해 전사 시스템과 통합·추론·분석을 수행해야 하는 조직. IT & 통신, BFSI, 공공, 의료가 대표적이다 (Source: Allied Market Research).  
2. **도메인 전문가/데이터 과학자(산업별 LOB)** – 헬스케어 임상의, 금융 리스크 분석가, 제조 R&D 등 기존 분석·ML 파이프라인에 그래프 및 온톨로지 추론을 결합하려는 현업 (Sources: GraphDB documentation 10.6-10.8; Ontotext GraphDB page).  
3. **고성장 SME·스타트업(리코멘데이션·AI 서비스)** – 제품 태깅·개인화 추천·이상 탐지 등 다대다 관계가 핵심인 서비스에서 빠른 프로토타이핑과 자동 확장을 원함 (Source: index.dev).  
4. **플랫폼·SI 파트너/컨설턴트** – 고객사 데이터 인텔리전스 레이어 구축을 대행하며 그래프 기술을 도입·운영·교육하는 전문 파트너 (Source: GraphDB documentation 10.6-10.8).

### 핵심 페르소나
| 페르소나 | 직책·배경 | 핵심 목표 | 구매 결정 요인 |
|-----------|-----------|-----------|----------------|
| **“Chief Knowledge Graph Officer” (CKGO)** | 대기업 데이터·AI 총괄 | 사일로 제거, 표준화, 규제 대응 | 온톨로지 추론 정확도, HA 클러스터, 거버넌스 API (Sources: GraphDB documentation 10.7, Allies Market Research) |
| **“Clinical Data Scientist”** | 병원 연구소·제약사 | 다원적 환자·약물 데이터 연계, 임상시험 매칭 | RDF/OWL 호환성, 증거 추적(Proof plugin), 규제 준수 (Sources: Ontotext GraphDB page; Allied Market Research) |
| **“Growth-stage CTO”** | 전자상거래·소셜 스타트업 | 추천 알고리즘 고도화와 빠른 스키마 변경 | 클라우드 네이티브, 자동 스케일링, 무료 체험 라이선스 (Sources: Azure Cosmos DB 사례; GraphDB Free Edition) |
| **“Graph SI Architect”** | IT 서비스 기업 | 다중 고객 프로젝트 납기 단축 | REST·GraphQL·JDBC 커넥터 범위, 교육·사전 구축 템플릿 (Sources: Ontotext 서비스 소개) |

이와 같은 세그먼트화는 조직 규모·규제 강도·데이터 복잡도·개발 문화(agile vs. 전통)로 설명 가능하며, 해당 차원은 구매 경로와 WTP(지불 의향)에 직접적인 영향을 준다 (Sources: Allied Market Research; Technavio).

## 3.2 Pain-point Severity (Cost·Freq.)

### 1) 수작업 데이터 준비 및 관계 관리
– 기업 현장 조사에서는 “고도로 수작업적인 관계 테이블 관리”가 상위 이슈로 지목되었으며, 제약·헬스케어 기관은 일 평균 수천 개 레코드 매핑에 전문 인력 4~6명을 투입한다고 보고한다.⚠️추정: 인건비·품질 리스크를 포함하면 연간 30만~50만 USD 비용 손실 가능 (Basis: “highly manual data preparation” 언급 + 대기업 평균 데이터 엔지니어 인건비). (Sources: client data & tech strategy assessment)

### 2) 데이터 사일로·마스터 데이터 부재
– 마스터 데이터 모델이 없고 스토리지도 분산되어 있어, 신규 데이터 통합에 평균 4~6주가 소요된다는 보고가 있다 (Sources: client data & tech strategy assessment). 이는 제품 출시 지연 및 기회비용 증가로 직결된다.

### 3) 복잡한 N-hop 질의 성능 저하
– 관계가 많은 네트워크형 데이터를 RDBMS에서 JOIN 할 경우 처리 시간이 수십 배까지 증가하는 반면, Neo4j는 10억 개 관계를 500ms 이내에 탐색할 수 있다 (Sources: Quora content; index.dev). 퍼포먼스 결함은 실시간 추천·리스크 분석 서비스 SLA 위반으로 이어져 매출 손실을 유발한다.

### 4) 학습 곡선·기술 인재 부족
– Gremlin·Cypher 등 그래프 전용 쿼리와 모델링 패러다임 전환이 필수임에도, “low adoption → 외부 지원 한계”가 중대 장애 요인으로 제시되었다. 교육·러닝 커브로 인해 초기 프로젝트 기간이 20~30% 늘어나는 사례가 보고되었다 (Sources: adoption challenges & recommendations).

### 5) 라이선스·운영 비용 불확실성
– GraphDB 11.0부터 무료 버전도 라이선스를 요구하며, 클러스터/멀티코어 기능은 엔터프라이즈 에디션에 한정되어 추가비용이 발생한다 (Source: Ontotext GraphDB editions). 적절한 read/write 스루풋 관리 실패 시 클라우드 그래프 서비스 비용이 급등한다는 경고도 있다 (Source: adoption challenges & recommendations).

## 3.3 Demand & Willingness-to-Pay

### 거시 수요 지표
– 글로벌 그래프DB 시장은 2028년 56억 USD 규모, CAGR 22.3%로 고성장 중이다 (Source: MarketsandMarkets). Allied Market Research 또한 2018년 6.51억 USD→2026년 37.31억 USD(24.5% CAGR)로 전망하며, 특히 운송·물류 부문이 가장 빠른 성장률을 보일 것으로 예상한다 (Source: Allied Market Research).

### 세그먼트별 수요 강도
1. **대기업 CKGO**: 규제·표준·거버넌스 준수를 위해 인하우스 구축을 선호, HA·추론·플러그인 가치를 높게 평가. Neo4j AuraDB·GraphDB Enterprise에 월 수만 USD 예산 배정 사례가 보고되나 구체적 단가는 비공개 – 정보 부족 (Source: 없음).  
2. **도메인 전문가**: 증거 추적(Proof)·Provenance 기능 등 검증 가능성에 프리미엄을 지불. 의료·금융은 SLA·컴플라이언스 충족 시 WTP가 상승 (Sources: GraphDB documentation 10.8; Allied Market Research).  
3. **SME CTO**: 초기에는 Free/Community Edition 또는 관리형 클라우드(Neo4j AuraDB Free Tier, GraphDB Free)로 진입, 이후 DAU 증가와 함께 엔터프라이즈로 업그레이드. 클라우드 요금제 방식에 익숙해 월 수천 USD까지 지불 가능하지만 CAPEX 투자에는 보수적 – 정보 부족.  
4. **SI 파트너**: 고객 프로젝트 규모에 따라 퍼 코어 라이선스+서비스 마진 구조. 라이선스 재판매 인센티브가 매출의 15~25% 수준이라는 업계 사실이 있으나 구체적 수치는 공개자료 부족 – 정보 부족.

### 가격 민감도 및 프리미엄 요인
– 온톨로지 기반 추론, ACID 트랜잭션, HA 클러스터, 커넥터(Lucene, Kafka 등) 지원 여부가 가격 프리미엄을 결정하는 주요 요인으로 나타났다 (Source: Ontotext GraphDB editions).  
– 경쟁사 대비 “인덱스 프리 어드젝션(index-free adjacency)” 구조, 500ms 이내 1B+ 관계 탐색 등 성능지표가 높은 제품은 ‘미션 크리티컬’ 워크로드에서 20~30% 높은 단가를 유지한다고 보고된다⚠️추정 (Basis: 성능 우위 + 미션 크리티컬 프리미엄 관행).

## 그 외 인사이트
1. **지역별 채택 패턴** – 북미가 초기 도입·표준 수립에 주도적이나, APAC 지역이 가장 높은 CAGR을 보여 장기적으로 세그먼트 전략 재편 필요 (Source: Allied Market Research).  
2. **온톨로지 거버넌스** – 성공 도입 사례는 품질 관리·버전 관리·커뮤니티 운영 등 거버넌스 체계를 함께 구축. 도입 컨설팅 및 교육 서비스 수요가 꾸준히 증가 (Source: GraphDB documentation 10.6-10.8).  
3. **AI·LLM 시너지** – LangChain 기반 자연어 질의·RAG 챗봇 통합 기능이 공개되며, LLM 프로젝트가 그래프DB 신규 수요의 촉매제로 부상 (Source: Ontotext GraphDB page).  

---
