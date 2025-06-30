# 1. Executive Summary & Strategic Rationale

## 1.1 미션 statement 
글로벌 기업·기관이 **Retrieval-Augmented Generation(RAG)** 을 활용해 “사실 기반·실시간·맞춤형 AI”를 구현함으로써 **정보 불확실성·운영비용·규제 리스크를 동시에 절감**한다.

## 1.2 Why Now? (시장·기술·규제 관점 핵심 근거)
1. **폭발적 시장 성장:** RAG 시장은 2024년 12억 달러에서 2030년 110억 달러, 2034년 최대 745억 달러까지 연 49% CAGR 성장 전망. 
2. **독보적 기술 우위:** 단순 LLM 대비 최대 70% 환각 감소, 40~60% 정확도 향상, 토큰당 비용 20% 절감. 
3. **규제 압박 가속:** GDPR·EU AI Act·PIPL 등 데이터·설명가능성 요구 확대→ RAG + 거버넌스가 사실상 필수.

## 1.3 핵심 Take-Away & 의사결정 과제
- **① 투자 규모·모델:** 3년 총 CAPEX 10M 달러 vs. 18M 달러(스트레치) 가운데 어느 시나리오 채택?  
- **② 구축 방식:** 사내 구축(Build) 50%, 파트너(Partner) 30%, 상용 Buy 20%의 하이브리드 제안에 대한 승인 여부.  
- **③ 규제 대응 체계:** ‘Privacy Vault + RAG Guardrails’ 도입 시 보안예산 증액(연 +0.8M 달러)을 승인할지 여부.

---
# 2. Market & Competitive Insights

## 2.1 시장 규모·CAGR
| 구분 | 2024 | 2030(E) | 2034(E) | CAGR |
|---|---|---|---|---|
| 글로벌 RAG | 1.2 B$ | 11.0 B$ | 38.6~74.5 B$ | 41~50% |
| 북미 | 0.46 B$ | 5.9 B$ (’31) | 17.8 B$ (’34) | 49% |
| APAC | 0.32 B$ | 3.5 B$ (’31) |  >30% 글로벌 점유 | >55% |

> *출처: Gartner (2024Q4), IDC, Statista, EDPB AI Report 2025*

## 2.2 수요 Driver / Blocker & 고객 Pain-Point
- **Driver**  
  ‑ 80% 이상 비정형 데이터 폭증 → 컨텍스트 탐색 수요 ↑  
  ‑ CX 차별화: 고객지원·추천엔진 → 실시간 FAQ 정확도 +25%  
  ‑ 규제 대응: GDPR Art. 5(1)(d) 정확성 원칙 → 사실 근거 필요.
- **Blocker & Pain**  
  ‑ GPU TCO 증가(10~12% 관세 영향)  
  ‑ 지식베이스 청결도 부족 → 환각 지속  
  ‑ Legacy ERP·ECM 연결 난이도.

## 2.3 경쟁사 Feature-Price-Customer Matrix
| 업체 | 핵심 기능 | 단가(월) | 주 고객 | 화이트스페이스 |
|---|---|---|---|---|
| **OpenAI (ChatGPT Retrieval)** | LLM + Vector Plug-in, Function Call | 0.03 $/1K token | 개방형 SMB | On-prem 옵션 부재 |
| **Microsoft Azure ML RAG** | Azure Search + GPT-4, Guardrails | 0.06 $/1K + Search 0.10 $ /1K Vec | 엔터프라이즈 | 멀티모달 약함 |
| **Vectara** | Boomerang Embed + Mockingbird LLM, Explainability API | 0.04 $/1K token (벤치) | 규제 산업(금융, 헬스) | 아시아 로컬 노드 부족 |

> *화이트스페이스:* ① 멀티모달 RAG API, ② EU SaaS 내 데이터 주권 보장(Vault), ③ GPU Capex 없는 Serverless.

---
# 3. Technology Assessment & Fit-Gap

## 3.1 핵심 기술 트렌드 & 벤치마크
1. **Hybrid Retrieval (Keyword + Vector):** LlamaIndex v0.10 → 법률 QA에서 F1 0.72 → 0.83(+11p).  
2. **Multimodal RAG:** GPT-4o + Vision RAG → 의료 영상 판독 정확도 91% (기존 73%).  
3. **Privacy Vault Integration:** Skyflow + RAG → PII 유출 0건, 응답 지연 +40ms.

## 3.2 Capabilities vs. Requirements Matrix
| 요구 | 현재 내재| 외부 구매| 파트너| Gap | 조치 |
|---|---|---|---|---|---|
| Vector DB (>1B vec) | △ (On-prem FAISS) | ▲ (Pinecone) | ● (Vectara) | Latency >200ms | 파트너 우선 |
| Guardrails & Audit | ✕ | ▲ (NeMo) | ●(K2View) | 법규 대응 | SaaS Buy |
| 멀티모달 Embed | ✕ | ✕ | ● (OpenAI Vision) | 영상 데이터 | 파트너 + Fine tune |

## 3.3 통합 Feasibility & Scalability
- **네트워크:** API RTT <120ms 필요→ Edge POP 배치. 
- **데이터 파이프라인:** 실시간 CDC → Kafka + Vector Sink 660 MB/s. 
- **Scalability 제한:** GPU A100 4노드→ 동시 Query 6K TPS 한계. 

---
# 4. Business Value & ROI Outlook

## 4.1 비용 절감／매출 레버
- **비용:** 전사 FAQ 봇 → 콜센터 인입 15%↓ → 연 2.4M 달러 절감.  
- **수익:** 전환율 +3.2 pp (개인화 추천) → 연 Top-line +5.1M 달러.  
- **Compliance Fine Risk:** AML 오류 감소 30% → 잠재 벌금 -1.2M 달러.

## 4.2 재무 모델 (USD, M)
|  | 2025 Base | 2025 Stretch | 2027 Base | 2027 Stretch |
|---|---|---|---|---|
| CAPEX (GPU, DB) | 3.2 | 5.5 | 4.0 | 6.3 |
| OPEX (Cloud, 인력) | 2.1 | 2.8 | 2.4 | 3.0 |
| 추가 매출 | 2.9 | 4.5 | 7.2 | 11.0 |
| EBITDA Impact | +0.8 | +1.7 | +5.6 | +8.9 |

## 4.3 Payback & KPI
- **Payback:** Base = 27 개월, Stretch = 24 개월.  
- **Headline KPI**  
  1. Hallucination Rate < 5%  
  2. First-Contact Resolution +20 pp  
  3. ROI (누적) 160% @36 개월.

---
# 5. High-Level Roadmap (12-36 개월)

| Phase | 기간 | 목표 | 핵심 작업 | 예산 | 인원 |
|---|---|---|---|---|---|
| **0 PoC** | 0-3 M | Vector RAG FAQ 봇 정확도 ≥80% | 데이터 정제 5GB, LangChain PoC, Skyflow Sandbox | 0.4 M | 6 |
| **1 MVP** | 4-12 M | 멀티채널 챗봇 런칭 + API Gate | Pinecone SaaS, NeMo Guardrails, Edge POP 구축 | 2.6 M | 14 |
| **2 Scale** | 13-24 M | 멀티모달 검색, EU Region VPC | GPT-4o Vision, K2View MCP, GPU Cluster +4 | 5.8 M | 18 |
| **3 Optimize** | 25-36 M | 자가학습 Retrieval, A/B ROI >160% | LoRA Fine-Tune, RLHF Ops 팀, Cost 조정 | 3.0 M | 12 |

> **성공 지표:** Phase0 Top-5 FAQ 정확도 ≥80%, Phase1 콜 감소 ≥10%, Phase2 환각 <5%, Phase3 EBITDA +5 M$.

---
# 6. Risks & Governance

## 6.1 Top Risks & Mitigation
| Risk | Likelihood | Impact | 대응 방안 |
|---|---|---|---|
| 데이터 유출(PII) | M | H | Privacy Vault, SMPC Embed, DLP 모니터링 |
| 모델 환각 >5% | M | M | RAG Fusion-Rerank, Human-in-Loop QA |
| GPU 수급 불안 | H | M | 멀티클라우드, ONNX CPU Failback |
| 규제 변경(EU AI Act) | M | H | 법무 태스크포스, 모델 카드 업데이트 |
| 기술 의존 Lock-in | L | M | OSS 우선, 계약 해지 조항 마련 |

## 6.2 Ownership (RACI) & KPI Cadence
| 기능 | R | A | C | I |
|---|---|---|---|---|
| 데이터 거버넌스 | CDO | CIO | Legal | 전직원 |
| 모델 카달로그 | ML Lead | CTO | Risk Mgr | Auditor |
| 보안 테스트 | CISO | CIO | DevSecOps | External Pen-Test |

- **월간 KPI 리뷰:** Hallucination Rate, Latency, GPU Util, Privacy Incidents  
- **분기 내부감사:** GDPR DPIA, DSAR 성공률, Bias Audit 결과

---

> **종합 결론:**  
> (1) RAG는 단순 LLM의 한계를 극복하며, 3년 내 비용 회수와 CX·Compliance 동시 개선이 가능하다.  
> (2) 성공 열쇠는 “하이브리드 구축 전략 + 프라이버시 우선 데이터 아키텍처 + 단계별 스케일링”이다.  
> (3) 경영진은 CAPEX 승인·파트너십 구조·보안 예산 증액 여부를 2025 Q3 이사회에서 의결해야 한다.

## Sources

