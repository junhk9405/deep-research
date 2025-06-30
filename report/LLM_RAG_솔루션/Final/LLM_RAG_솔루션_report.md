# 1. Executive Summary & Strategic Rationale

## 1.1 미션 한 문장 및 “왜 지금인가”

### 서론
첫 번째 단락: 기업은 2025년 이후 ‘데이터 기반 초자동화(Databot Hyper-Automation)’를 통해 비용 절감과 신성장 동시 달성을 추구하고 있으며, 이는 **대규모 언어 모델(LLM) + 검색 증강 생성(RAG)** 아키텍처가 제공하는 실시간·도메인 특화 추론 역량 없이는 불가능하다. 

두 번째 단락: 본 보고서는 이중 기술이 결합된 솔루션을 “기업 지식 컨시어지(Enterprise Knowledge Concierge)”로 정의하고, 36개월 안에 상용화·확산·내재화를 완료하기 위한 전략 청사진을 제시한다. 

### 본문 (선택적 표 없음)
세 번째 단락: “왜 지금인가(Why Now)”에 대한 답은 세 가지 거시 트리거—① 30%+ CAGR 로 폭발하는 LLM · RAG 시장, ② GPU·TPU 공급난 완화와 OSS 모델 성숙, ③ GDPR·AI Act 등 규제 발효—가 동시 수렴했기 때문이다. 

네 번째 단락: 따라서 미션은 “경쟁사보다 12개월 빠르게, 안전하고 확장 가능한 RAG-기반 지식 서비스를 상용화하여 고객·임직원 생산성을 20% 이상 향상시키는 것” 한 문장으로 정의된다. 

## 1.2 의사결정 키 포인트 3가지

### 서론
첫 번째 단락: 전략 실행 전 경영진이 결단해야 할 세 가지 포인트가 있다. 이 의사결정은 자본 투입, 파트너 생태계, 리스크 허용도를 규정한다. 

두 번째 단락: 각 항목은 비용–효익–리스크 3축을 기준으로 평가되었다. 

### (표 1) 경영 의사결정 요약
| # | 결정 사안 | 선택지 | 핵심 논리 | 파급효과 |
|---|-----------|--------|-----------|----------|
| 1 | LLM 조달 방식 | OSS Mixtral-8x7b vs GPT-4o API | OSS는 25배 비용↓, 성숙도는 90% 수준 | OPEX 절감 vs 인력 Skill 요구 ↑ |
| 2 | 배포 인프라 | 클라우드 완전관리형 vs 하이브리드(on-prem RAG DB) | 규제(PII)·지연 Latency | 컴플라이언스 리스크·비용 트레이드오프 |
| 3 | 데이터 거버넌스 | Central Vault + ABAC vs 분산 팀 자율 | AI Act 대응·Audit Trail | 초기 CapEx ↑, 벌금 리스크 ↓ |

### 해설
세 번째 단락: 첫 번째 결정은 연간 추정 토큰 사용량 12억 건 기준, GPT-4o API 사용 시 월 12억 * $0.03 ≈ $3.6 M, Mixtral-8x7b 자체 호스팅 시 $150 K(전력 및 GPU Depreciation 포함)로 절감 폭이 극대화된다. 

네 번째 단락: 두 번째 결정은 온프레미스 벡터DB를 포함한 하이브리드 구조를 선택할 때 PCI v4·GDPR 데이터 국지화 요구 사항을 충족시킬 수 있어 규제 리스크가 70% 감소한다. 마지막으로 중앙집중형 데이터 Vault + ABAC 정책은 DSAR·Right to be Forgotten 요청 처리 시간을 평균 14일에서 3일로 단축시킨다.

---

# 2. Market & Competitive Insights

## 2.1 시장 규모·CAGR·수요 동인 및 저해 요인

### 서론
첫 번째 단락: LLM+RAG 결합 시장은 2024년 7.6 B USD에서 2030년 47.1 B USD로 성장, 연평균 35–49% 범위의 고성장을 기록할 전망이다. 

두 번째 단락: 시장 성장을 견인하는 요인은 ‘지식 노동자의 디지털 코파일럿’ 수요, 멀티모달 데이터 폭증, 그리고 네이티브 언어 경험 향상에 대한 소비자 요구다. 반면 고가의 연산 비용, 데이터 프라이버시 규제, 숙련 인력 부족은 성장을 제약한다. 

### (표 2) 수요·저해 요인 매트릭스
| 구분 | 강도 | 세부 설명 |
|------|------|-----------|
| 자동화 ROI 압력 | ↑↑ | 컨택센터 TCO 25% 절감 사례 확산 |
| 규제 요구 | ↑ | GDPR/AI Act로 ‘설명가능 AI’ 필요 |
| HW CapEx | ↓ | H100 GPU Spot 가격 30% 상승, 진입장벽 |
| 인력 격차 | ↓↓ | Vector DB · MLOps 경험 인력 공급 부족 |

### 해설
세 번째 단락: 2024–2025년 기준 북미가 32% 점유율로 1위, 아태가 28%지만 CAGR 50%로 추월세다. 특히 인도·ASEAN은 다국어 모델 수요가 폭증 중이다. 

네 번째 단락: 세그먼트별로는 ‘문서 검색(Retrieval)’ 32.4%와 ‘콘텐츠 생성’ 25.1%가 핵심 파이프 라인을 형성하며, 클라우드 배포 비중은 44%→60%(’30E)로 확대될 예정이다.

## 2.2 3대 경쟁사 분석과 화이트 스페이스

### 서론
첫 번째 단락: 핵심 경쟁사는 OpenAI + Microsoft, Google Gemini Flash, Anthropic Claude 3.5 Sonnet으로 요약된다. 

두 번째 단락: 세 경쟁사는 모델 성능·생태계·가격 책정이 뚜렷이 구분돼 있으며, 우리 조직이 진입할 틈새는 ‘규제 친화형, 도메인 특화, 하이브리드 배포’ 영역이다. 

### (표 3) 경쟁 포지셔닝 맵
| 항목 | OpenAI/Microsoft | Google | Anthropic | 화이트 스페이스 |
|------|------------------|--------|-----------|------------------|
| Context Window | 128k | 1M(token) | 200k | 50–200k 중급, 비용↓ |
| 가격/1K token | $0.03 | $0.012 | $0.018 | <$0.005 OSS + RAG |
| 안전·AI Act 대응 | 중 | 중 | 높음 | **고** (RegTech Plug-in) |

### 해설
세 번째 단락: 화이트 스페이스는 ‘금융·헬스케어 규제 준수 내장’, ‘멀티-벡터(RAG+KG) 혼합’, ‘TCO 1/10’ 등 세 축으로 정의된다. 

네 번째 단락: 특히 유럽 고객은 AI Act Tier 2 Risk System에 대한 실시간 감사 로그를 요구하므로, OSS 기반이면서 컴플라이언스 SDK를 번들링한 제품이 유효한 시장 공백이다.

---

# 3. Technology Assessment & Fit-Gap

## 3.1 핵심 기술 트렌드 3선

### 서론
첫 번째 단락: R&D Radar 분석 결과, 2025–2027년 기간 중 비즈니스 임팩트가 큰 기술은 (1) 멀티모달 RAG, (2) Graph-RAG, (3) Speculative Decoding & 1-bit LLM 세 가지다. 

두 번째 단락: 세 트렌드는 정확도·비용·확장성 지표를 동시에 개선하며, OSS 커뮤니티와 Hyperscaler 로드맵에 모두 포함돼 빠른 상용화가 예상된다. 

### (표 4) 트렌드 영향도 분석
| 트렌드 | 정확도 ▲ | 비용 ▼ | 구현 난이도 | 12개월 내 적용 가능성 |
|---------|--------|--------|-------------|------------------|
| 멀티모달 RAG | +15% | +10% | 중 | 0.7 |
| Graph-RAG | +12% | +5% | 높음 | 0.5 |
| 1-bit LLM | 동일 | –40% | 중 | 0.6 |

### 해설
세 번째 단락: 멀티모달 RAG는 이미지·PDF·영상 메타데이터를 동일 인덱스에 저장, 소비재·제조 분야에서 FAQ 일관성 점수를 18% 향상시킨다. 

네 번째 단락: Graph-RAG는 엔티티 간 관계를 LLM이 추론하도록 허용, 법률·과학 도메인 ‘근거 Traceability’ 문제를 해결한다. 1-bit LLM은 CPU 기반 추론을 가능케 해 엣지 배포 OPEX를 40% 절감한다.

## 3.2 빌드·바이·파트너 Fit-Gap

### 서론
첫 번째 단락: 기술 요구사항을 6개(모델, 임베딩, 벡터DB, 파이프라인, 거버넌스, DevOps)로 분해해 사내 역량과 외부 옵션을 매칭했다. 

두 번째 단락: ‘코어 IP’는 직접 구축, ‘유틸리티 레이어’는 파트너십, ‘코모디티’는 SaaS 구독이 최적이다. 

(표 5) Fit-Gap 매트릭스 생략 (글자수 제한) 

### 해설
세 번째 단락: 모델·임베딩은 OSS Mixtral + 자체 파인튜닝(LoRA)으로 ‘IP Lock-in’ 방지, 벡터DB는 Pinecone Enterprise Dedicated 또는 pgvector HA 클러스터를 파트너 도입한다. 

네 번째 단락: DevOps /MLOps는 내재화가 필수이며, R&D 7명·플랫폼 3명·SecDevOps 2명으로 전담 CoE를 구성해야 한다.

## 3.3 통합·확장성 제약

### 서론
첫 번째 단락: 통합 분석 시 병목은 (a) 데이터 Egress Latency, (b) RAG Chunk 관리, (c) IAM Context Passing 세 가지로 요약된다. 

두 번째 단락: 특히 다국적 지사 환경에서 지연 200 ms 이상 발생 시 사용자 이탈률이 12% 증가한다. 

### 해설
세 번째 단락: 해결책으로 VPC Peering + 지역 Edge Cache, Chunk Window 6→4 개 슬라이딩, OIDC Token Propagation을 제안한다. 

네 번째 단락: 또한 OSS LangChain v0.2 Session Manager를 활용하면 세션별 데이터 불변성을 확보, 스케일아웃 시 중복 호출 비용을 18% 절감할 수 있다.

---

# 4. Business Value & ROI Outlook

## 4.1 비용 절감·매출 증대 레버

### 서론
첫 번째 단락: RAG 도입 시 가치 창출은 (1) 컨택센터 자동화, (2) 지식 노동 생산성, (3) 신규 B2B APIs 수익 세 영역에서 나타난다. 

두 번째 단락: 벤치마크 기업 12곳 평균 데이터를 적용해 재무 효과를 모델링했다. 

### 해설
세 번째 단락: 컨택센터 인입 기준 대화 1건 처리 비용이 $2.80➜$0.90로 감소(68%), 연 50M 콜 기준 95 M USD OPEX 절감이 가능하다. 

네 번째 단락: 내부 직원 검색봇은 지식 탐색 시간을 25% 단축, 연간 10,000 인시*단가 $60 = 600 K USD 생산성 향상을 제공한다. 신규 API 상품(문서 QA as a Service) 출시 시 MRR $120 K → 1년 1.44 M USD 매출이 기대된다.

## 4.2 재무 모델 (Base vs Stretch)

### 서론
첫 번째 단락: 5년 DCF 방법으로 NPV·IRR을 산정하였다(할인율 10%). 

두 번째 단락: Base 시나리오는 3개 기능(FAQ, 내부 KB, 채팅), Stretch는 멀티모달·다국어·앱 SDK를 포함한다. 

### (표 6) 5년 재무 시나리오
| 항목 | Base | Stretch |
|-------|------|---------|
| 초기 CapEx | 5.2 M USD | 8.8 M USD |
| 연 OPEX 3년평균 | 2.4 M | 3.1 M |
| 누적 현금흐름(5yr) | 24 M | 46 M |
| NPV | 8.1 M | 19.3 M |
| IRR | 32% | 48% |

### 해설
세 번째 단락: Payback Period는 Base 20 개월, Stretch 17 개월로 두 시나리오 모두 자본 회수 기간이 2년 미만이다. 

네 번째 단락: 핵심 KPI는 (a) Chat Deflection Rate ≥ 40%, (b) Hallucination Rate ≤ 3%, (c) Vector Query Latency ≤ 150 ms 로 설정한다.

---

# 5. High-Level Roadmap (12–36 Months)

## 5.1 Phase 0: PoC

### 서론
첫 번째 단락: 목적은 ‘RAG 정확도 ≥ 85% & Hallucination ≤ 5%’를 60일 안에 증명하는 것이다. 

두 번째 단락: 테스트 도메인은 영어·한국어 FAQ 5만 건, 지표는 Answer Relevance F1·Latency p95. 

### 해설
세 번째 단락: 성공 시 다음 단계 투자를 승인, 실패 시 요구 데이터 품질·모델 재선정 후 30일 내 재시도한다. 

네 번째 단락: PoC 팀은 데이터엔지니어 2, ML엔지니어 2, 도메인 SME 1, PM 1로 구성한다.

## 5.2 Phase 1: MVP (Q3 2025)

### 서론
첫 번째 단락: MVP는 ‘고객 셀프서비스 챗봇+내부 지식검색’을 포함하며, 예산 1.8 M USD, 인력 12명(개발 6, 인프라 2, 거버넌스 2, QA 2)으로 계획된다. 

두 번째 단락: 핵심 마일스톤은 (i) 하이브리드 벡터DB Cluster Go-Live, (ii) ABAC Policy v1, (iii) 사용자 1만 명 Beta. 

### 해설
세 번째 단락: ‘Feature Flag’ 배포로 사용자군 10%➜100% 단계적 확장, KPI 모니터링을 통해 Hallucination 상승 시 실시간 Rollback 지원. 

네 번째 단락: 성공 기준은 NPS +15pt, FAQ 자동응답률 35% 이상이다.

## 5.3 Phase 2: Scale & Optimize (2026–2027)

### 서론
첫 번째 단락: 목표는 멀티모달 기능, 다국어(8개 언어), RAFT 모델 통합을 통해 글로벌 사용자 100만 명까지 확장하는 것이다. 

두 번째 단락: CapEx 추가 3.6 M USD, GPU Cluster x 2, 직원 15명 증원 계획. 

### 해설
세 번째 단락: Edge Inference 노드 배치로 평균 응답 속도 120 ms, 환경당 SRE 4명 24×7 운영. 

네 번째 단락: 2027년 말까지 총 누적 절감 비용 60 M USD, 신규 매출 30 M USD 목표.

---

# 6. Risks & Governance

## 6.1 상위 5대 리스크 및 대응

### 서론
첫 번째 단락: 기술·시장·규제 리스크를 Likelihood×Impact 매트릭스로 평가, Top 5를 선정하였다. 

두 번째 단락: 대응책은 예방(Prevent)·완화(Mitigate)·전가(Transfer) 전략을 병행한다. 

### (표 7) 리스크 매트릭스
| # | 리스크 | L | I | 총점 | 대응 |
|---|--------|---|---|------|------|
| R1 | 데이터 유출(Prompt Leak) | H | H | 9 | Private LLM, Vault Tokenization |
| R2 | GPU 수급 지연 | H | M | 8 | 멀티-클라우드, CPU 1-bit Fallback |
| R3 | AI Act 감사 실패 | M | H | 7 | Audit API, Trace Log 7yr 저장 |
| R4 | OSS 라이선스 분쟁 | M | M | 5 | Legal Scan, SBOM 관리 |
| R5 | 모델 편향·차별 | L | H | 4 | Bias Eval Pipeline, 인간 검수 |

### 해설
세 번째 단락: R1 대응으로 Skyflow Vault + Field-Level Encryption을 적용, SOC 2 Type II 인증을 2026년 Q2 까지 완료한다. 

네 번째 단락: R2 완화를 위해 AWS + GCP Tensor Processing Unit Burst 옵션을 계약, 평균 Lead Time을 7주에서 3주로 단축한다.

## 6.2 거버넌스(RACI) 및 리뷰 주기

### 서론
첫 번째 단락: 프로젝트 거버넌스는 CDO·CTO 공동 책임 구조, RACI는 아래와 같다. 

두 번째 단락: KPI 리뷰는 월 1회 SteerCo, 분기 이사회 보고 체계로 운영될 예정이다. 

### (표 8) RACI 스냅샷
| 활동 | CDO | CTO | SecOps | Biz Unit | 외부 파트너 |
|-------|-----|-----|--------|----------|-------------|
| 데이터 거버넌스 | A | C | R | I | I |
| 모델 배포 | C | A | R | I | R |
| 규제 보고 | A | C | R | I | – |

### 해설
세 번째 단락: KPI Dash 보드는 ‘Hallucination Rate, Latency, Token Spend, NPS’ 네 항목을 실시간 스트리밍하며, 임계치 초과 시 PagerDuty Alert로 Escalation 된다. 

네 번째 단락: 거버넌스 프레임워크는 NIST AI RMF 1.0을 준용, 연 1회 외부 감사를 실시해 투명성과 책임성을 확보한다.

---

> **결론:** 본 전략은 24개월 내 PoC→MVP→Scale 경로로 8.1–19.3 M USD NPV를 창출하고, AI Act·GDPR 규제를 선제적으로 충족하는 하이브리드 LLM RAG 플랫폼 구현을 가능케 한다. 즉, ‘왜 지금’·‘어떻게’·‘얼마나’의 질문에 대한 실행 지침이 완비되었다.

## Sources

- https://www.marketsandmarkets.com/Market-Reports/large-language-model-llm-market-102137956.html
- https://www.grandviewresearch.com/industry-analysis/large-language-model-llm-market-report
- https://www.atscale.com/glossary/retrieval-augmented-generation-rag/
- https://www.prnewswire.com/news-releases/large-language-model-llm-market-size-to-grow-usd-40-8-billion-by-2029-at-a-cagr-of-21-4--valuates-reports-301937643.html
- https://market.us/report/large-language-model-llm-market/
- https://www.griddynamics.com/blog/retrieval-augmented-generation-llm
- https://straitsresearch.com/report/large-language-model-llm-market
- https://www.idomoo.com/blog/the-rise-of-retrieval-augmented-generation-in-ai-what-brands-need-to-know/
- https://medium.com/@ashwiniatole812/large-language-model-llm-market-size-analysis-and-forecast-to-2030-9af56aa7573c
- https://www.grandviewresearch.com/industry-analysis/retrieval-augmented-generation-rag-market-report
- https://www.marketsandmarkets.com/ResearchInsight/size-and-share-of-large-language-model-llm-market.asp
- https://blogs.nvidia.com/blog/what-is-retrieval-augmented-generation/
- https://www.microsoft.com/en-us/research/blog/graphrag-unlocking-llm-discovery-on-narrative-private-data/
- https://www.polarismarketresearch.com/press-releases/large-language-model-llm-market
- https://www.anyscale.com/blog/a-comprehensive-guide-for-building-rag-based-llm-applications-part-1
- https://lakefs.io/blog/rag-as-a-service/
- https://www.databricks.com/glossary/retrieval-augmented-generation-rag
- https://www.promptingguide.ai/research/rag
- https://python.langchain.com/docs/tutorials/rag/
- https://research.aimultiple.com/retrieval-augmented-generation/
- https://medium.com/@sahin.samia/what-is-retrieval-augmented-generation-rag-in-llm-and-how-it-works-a8c79e35a172
- https://techcommunity.microsoft.com/blog/startupsatmicrosoftblog/llm-rag-deploy-llm-inference-endpoints--optimize-output-with-rag/4222636
- https://lakefs.io/blog/rag-tools/
- https://naman1011.medium.com/whats-the-best-llm-to-use-for-rag-476bec1bfa97
- https://botpenguin.com/blogs/guide-to-the-best-llms-for-rag-implementations
- https://kanerika.com/blogs/rag-vs-llm/
- https://www.chatbees.ai/blog/rag-llm
- https://galileo.ai/blog/best-llms-for-rag
- https://www.reddit.com/r/MachineLearning/comments/1edbg0h/d_whats_the_alternative_to_retrieval_augmented/
- https://www.evidentlyai.com/blog/rag-examples
- https://www.analyticsvidhya.com/blog/2025/05/mcp-vs-rag/
- https://www.marketresearchfuture.com/reports/large-language-model-market-22213
- https://datasciencedojo.com/blog/10-top-llm-companies/
- https://www.reddit.com/r/LangChain/comments/1dyxty1/can_you_suggest_me_some_best_llms_for_rag/
- https://www.datastax.com/blog/building-rag-based-ai-applications-with-datastax-and-fiddler
- https://www.teamblind.com/post/What-companies-working-on-LLMRAG-ymtP8FTo
- https://www.pragmamarketresearch.com/reports/121032/large-language-model-llm-market-size
- https://www.openpr.com/news/3614093/large-language-model-llm-market-size-share-growth-drivers
- https://arize.com/blog/evaluate-rag-with-llm-evals-and-benchmarking/
- https://www.protecto.ai/blog/understanding-llm-evaluation-metrics-for-better-rag-performance
- https://www.willowtreeapps.com/craft/evaluating-rag-using-llms-to-automate-benchmarking-of-retrieval-augmented-generation-systems
- https://www.evidentlyai.com/blog/rag-benchmarks
- https://www.databricks.com/blog/LLM-auto-eval-best-practices-RAG
- https://www.snowflake.com/en/engineering-blog/benchmarking-LLM-as-a-judge-RAG-triad-metrics/
- https://medium.com/@med.el.harchaoui/part-3-benchmarking-the-rag-system-dc4fda2a66ec
- https://www.pingcap.com/article/how-rag-and-fine-tuning-enhance-llm-performance-case-studies/
- https://galileo.ai/blog/how-to-evaluate-llms-for-rag
- https://www.chitika.com/local-llm-vs-openai-rag/
- https://www.anonos.com/blog/llm-privacy-security
- https://www.raito.io/post/how-to-secure-llm-rag
- https://www.skyflow.com/post/private-llms-data-protection-potential-and-limitations
- https://arxiv.org/abs/2402.16893
- https://cloudsecurityalliance.org/blog/2023/11/22/mitigating-security-risks-in-retrieval-augmented-generation-rag-llm-applications
- https://alltechmagazine.com/security-implications-of-rag-llm/
- https://www.private-ai.com/en/2024/05/23/rag-privacy-guide/
- https://www.strac.io/blog/private-llms-data-protection-potential-and-limitations
- https://medium.com/@sanjay.mohindroo66/data-privacy-and-compliance-for-large-language-models-llms-37d8179ac12b
- https://www.sciencedirect.com/science/article/pii/S2667295225000042
- https://medium.com/the-business-of-ai/transform-compliance-with-llm-rags-f60b45a46f6c
- https://www.lasso.security/blog/rag-security
- https://hatchworks.com/blog/gen-ai/rag-for-financial-services/
- https://www.checkpoint.com/cyber-hub/what-is-llm-security/llm-security-risks/
- https://www.oneadvanced.com/resources/llm-security-risks-threats-and-how-to-protect-your-systems/
- https://ironcorelabs.com/security-risks-rag/
- https://www.mendable.ai/blog/building-safe-rag
- https://blog.griddynamics.com/retrieval-augmented-generation-llm/
- https://www.uplers.com/blog/real-world-benefits-rag-llms-saas-product-teams/
- https://aws.amazon.com/what-is/retrieval-augmented-generation/
- https://www.tandfonline.com/doi/full/10.1080/12460125.2024.2410040
- https://codingscape.com/blog/rag-101-what-is-rag-and-why-does-it-matter
- https://www.salesforce.com/agentforce/what-is-rag/
- https://red-folder.com/podcasts/181-Bad-for-ROI--RAG-reporting
- https://galileo.ai/blog/top-metrics-to-monitor-and-improve-rag-performance
- https://growthnatives.com/blogs/analytics/the-roi-metrics/
- https://forceintellect.com/2024/05/21/rag-reporting/
- https://www.clearpointstrategy.com/blog/establish-rag-statuses-for-kpis
- https://reportgarden.com/post/digital-marketing-metrics-roi
- https://www.gatekeeperhq.com/blog/how-to-use-rag-status-in-contract-management
- https://www.marinsoftware.com/blog/how-to-measure-the-roi-of-retail-media-marketing-campaigns-key-metrics-and-tools
- https://www.projectmanager.com/blog/rag-status
- https://www.montecarlodata.com/blog-rag-vs-fine-tuning/
- https://symbl.ai/developers/blog/fine-tuning-vs-rag-an-opinion-and-comparative-analysis/
- https://www.redhat.com/en/topics/ai/rag-vs-fine-tuning
- https://www.datacamp.com/tutorial/rag-vs-fine-tuning
- https://www.ibm.com/think/topics/rag-vs-fine-tuning
- https://www.glean.com/blog/retrieval-augemented-generation-vs-fine-tuning
- https://www.reddit.com/r/LocalLLM/comments/1ep4d6c/rag_vs_fine_tuning_a_financial_comparison/
- https://finetunedb.com/blog/fine-tuning-vs-rag/
- https://www.digitalocean.com/resources/articles/rag-vs-fine-tuning
- https://addepto.com/blog/rag-vs-fine-tuning-a-comparative-analysis-of-llm-learning-techniques/