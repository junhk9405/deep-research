# 6. 기술/전략 Dimension 보고서

## 6-1. 후보 기술 선정(3개 이하)

### A) 온톨로지 기반 네이티브 그래프 DB 플랫폼 (GraphDB·Neo4j Enterprise)
• 당사 솔루션 주축이 되는 핵심 기술로, 글로벌 그래프 DB 시장은 2024년 20억 달러에서 2033년 86억 달러까지 CAGR 17.57% 성장 전망(Source: IMARC Group). 높은 시장 확장성과 다수의 엔터프라이즈 레퍼런스를 통해 ROI 예측이 비교적 용이하다(Source: Cambridge Intelligence 2023).
• OWL 2·RDF 표준을 스키마로 활용해 이종 데이터 통합·자동 추론을 지원, 관계형 DB 대비 다단계 JOIN 성능을 대폭 개선(10억 관계 <0.5 초)(Source: index.dev). 이는 실시간 AML·추천·IoT 분석 등 당사 SI 사업부 다수 고객 요구에 직결된다.
• 기술 성숙도는 ‘코어’ 단계로 평가되며, Neo4j AuraDB·GraphDB 10.8 이상의 클러스터링 기능으로 수평 확장을 검증받았다(Sources: GraphDB 10.8 documentation, Neo4j documentation).
• 난이도는 중(設計)~고(거버넌스): 그래프 모델 변환, 권한·버전 관리가 과제지만, 당사는 연 20억 AI 예산과 SI 레퍼런스를 보유해 대기업 대비 인력·비용 리스크가 상대적으로 낮다(⚠️추정: 내부 역량 평가).

### B) RDF ↔ LPG 하이브리드 상호운용 계층(NeoSemantics·GraphBRAIN)
• GraphBRAIN paper 및 NeoSemantics 플러그인은 SPARQL과 Cypher를 병용해 데이터 과학팀·개발팀의 언어 장벽을 완화한다(Sources: GraphBRAIN paper, Neo4j documentation). 이는 그래프 인력 부족(주요 저해 요인) 해소에 직접 기여한다(Source: Technavio report).
• 시장 측면에서는 하이브리드 기능이 엔터프라이즈 채택 속도를 최대 20% 가속한다는 벤더 백서가 있으나 독립 검증 데이터가 부족해 수치화는 제한(정보 부족). 그럼에도 복수 벤더 락-인 리스크를 줄여 장기 유지보수 비용 절감 효과가 유력하다(⚠️추정 근거: 표준 수렴 추세).
• 기술 난이도는 ‘중’: RDF 트리플스토어와 LPG 간 스키마 매핑 로직이 필요하지만, NeoSemantics·GraphBRAIN이 오픈소스로 제공돼 초기 CAPEX가 낮다(Source: GraphBRAIN paper).

### C) 지식그래프-기반 LLM 연계 RAG(Relevance-Augmented Generation) 모듈
• 그래프 컨텍스트를 OpenAI GPT 등에 주입해 고차 추론·자연어 질의응답을 제공, 생성형 AI 열풍 속에서 차별적 고객 가치를 창출한다(Source: graph.build).
• 시장 수요는 ‘AI 챗봇·검색’ 투자 급증으로 빠르게 상승하지만, 장기적인 수익 모델·벤치마킹 사례가 제한돼 불확실성이 높다(정보 부족). 따라서 단독 사업보다는 그래프 DB 플랫폼 부가 모듈로 묶어 **업셀링** 전략이 적합하다.
• 기술 성숙도는 ‘이머징’: LangChain·LLM API는 안정화됐으나, 그래프 ↔ LLM 통합 패턴·보안 정책이 표준화되지 않았다(Source: Ontotext GraphDB page). 난이도는 중: 벡터 DB 또는 인메모리 캐시 설계가 필요(⚠️추정).

## 6-2. 후보 기술 개발 계획

### 1) 공통 전제
• 연 20억 원 투자 한도를 고려, **2년(24 개월) 내 MVP → 상용 버전** 완성을 목표로 삼는다.
• 총 투입 인력 22 명(⚠️추정): 그래프 엔지니어 6, 온톨로지 모델러 4, 백엔드 4, 프론트엔드 3, DevOps 2, 데이터 사이언티스트 2, PM 1.
• 예산 배분(⚠️추정): 인건비 24 억, 라이선스·클라우드 8 억, 교육·컨설팅 4 억, 예비비 4 억 → 총 40 억(2년) → 현재 AI 투자 규모(20 억/년) 범위 내.

### 2) 플랫폼(그래프 DB + 온톨로지) 개발 단계
1단계 PoC (0-3 개월) – 기존 고객 데이터셋 3종을 Neo4j·GraphDB에 적재, Cypher·SPARQL 벤치마크 수행(Sources: GraphDB documentation). 목표 : 쿼리 TTL 500 ms 내 달성.
2단계 MVP (4-9 개월) –
  • RDF ↔ LPG 변환 모듈(NeoSemantics) 적용, 하이브리드 API 게이트웨이 구축(Sources: Neo4j documentation).
  • 최소 온톨로지(TBox 100~150 클래스) 작성 및 추론 규칙 적용(⚠️추정: 도메인 합의 가능 범위).
3단계 Beta (10-15 개월) – HA 클러스터(3-노드) 구성, 접근제어 온톨로지·GraphBRAIN Schema 삽입(Source: GraphBRAIN paper). 외부 파트너 2곳을 통해 기능 테스트.
4단계 GA (16-24 개월) – 성능 튜닝·DevSecOps 자동화, 교육 패키지(쿼리 언어·거버넌스) 출시.

### 3) LLM RAG 모듈 개발 단계
• R&D 스프린트 병행(6-18 개월) – graph.build 패턴을 참조해 그래프 서브셋 → 텍스트 → LLM 컨텍스트 주입 파이프라인 구축(Source: graph.build).
• 인력 2명(데이터 사이언티스트 + 백엔드) + 클라우드 GPU 1노드 활용, 연 2 억 원 규모(⚠️추정).

## 6-3. 마일스톤 로드맵(개발 완료 이후 시장 출시)

| 단계 | 기간 | 핵심 목표 | 성공 지표(KPI) |
|------|------|-----------|-----------------|
| M0 Kick-off | 0 M | 프로젝트 헌장·인력 배치 완료 | 리소스 배정 100% |
| M1 PoC 완료 | 3 M | 3종 데이터 → 그래프 변환, TTL ≤ 500 ms | 쿼리 성능 지표, PoC 리포트 승인(Source: index.dev) |
| M2 MVP 출시 | 9 M | 하이브리드 API, 최소 온톨로지, 클러스터 2노드 | 일관성 테스트 통과율 > 95% (Source: GraphDB Ontologies documentation) |
| M3 Beta 고객검증 | 15 M | 파트너 2곳 파일럿, RBAC·ABAC 정책 테스트 | SLA 99.5%, 버그 < 0.4/Story Point |
| M4 GA & 교육패키지 | 24 M | 상용버전 배포, 내부·외부 교육 3회 | 초기 매출 10 억 원, NPS > 55 점(⚠️추정) |
| M5 AI RAG 패키지 | 30 M | 그래프+LLM 모듈 상용화 | 자연어 Q&A 정확도 +20 %(벤더 벤치 대비) |
| M6 해외 레퍼런스 확보 | 36 M | APAC 고객 ≥ 2건 | 해외 매출 비중 > 15 % (⚠️추정) |

각 단계는 ‘품질 게이트(QA)’와 ‘규제 컴플라이언스 체크리스트(GDPR·BCBS 239)’를 병행 적용해 리스크를 최소화한다(Source: Computer Standards & Interfaces 2024; Neo4j Compliance Use Cases).

### 마케팅·사업화 연동
• GA 동시, **매니지드 서비스(클라우드 SaaS)** 모델과 **SI 패키지**(컨설팅+운영) 2트랙으로 매출원을 분리한다. 이는 그래프 DB 운영 전문 인력 부족이라는 시장 Pain-point와 직접 연결된다(Source: IndustryARC, Data Bridge Market Research).
• 초기 공공·BFSI 고객 대상으로 ‘규제 준수형 지식그래프’ 메시지를 강조해 진입, 이후 제조·스마트팩토리로 확장(⚠️추정: 국내 공공 클라우드 전환 로드맵 근거).

---

### 결론
1. 단일 그래프 DB 엔진이 아닌 **온톨로지·하이브리드·AI 모듈** 3종 세트를 중심으로 2년 내 상용화를 추진하면, 연간 5%p 이상의 신규 매출 성장 여력을 확보할 수 있다(⚠️추정: 당사 5,000억 매출 대비).
2. 연 20억 내 투자를 2년간 2배로 확대(총 40억)해도, 그래프 DB 시장 CAGR 17% 이상과 SI·클라우드 부가가치(15~25% 마진)로 손익분기점(BEP) 2~3년 달성이 가능하다(Sources: IMARC Group, IndustryARC).
3. 기술 난이도·거버넌스 리스크는 GraphBRAIN·NeoSemantics·TITAN Framework 등 **오픈소스·표준 기반 툴링** 활용으로 완화하며, 인력 부족은 초기부터 교육 패키지를 상품화해 **수익·역량**을 동시 확보하는 ‘Flywheel’ 전략이 필요하다(Source: GraphBRAIN paper, metaphactory Blog).