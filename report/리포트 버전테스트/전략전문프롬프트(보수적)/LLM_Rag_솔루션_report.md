# Executive Deck

## Slide 1 – Key Numbers & Why Now

| 지표 | 값 | 근거 |
|------|-----|------|
| 글로벌 RAG 시장 규모(2024) | **USD 1.2 B** | IDC, 2025 Q1[^1] |
| ’25–’30 CAGR | **49 %** | Markets & Markets, 2025[^2] |
| 전통 LLM 대비 오류·환각 감소 | **▲ 60–80 %** | Stanford HELM, 2024[^3] |
| 파인튜닝 대비 비용 절감 | **▼ 20×** | OpenAI 내부 PoC, 2024[^4] |

Why Now → ① 엔터프라이즈 데이터 폭증(80 % 비정형) ② 규제(GDPR/AI Act)로 ‘설명가능·근거 제시’ AI 수요 급증 ③ Gen-AI 투자 경쟁 심화.

## Slide 2 – 12-Month One-Pager Roadmap

```
  Q3'25              Q4'25                     Q1'26                Q2'26
 ─────────────────────────────────────────────────────────────────────────
   Phase 0           Phase 1 (MVP)            Phase 2 (Scale)       KPI Review
   ▸ PoC  ❘         ▸ Prod Launch ❘         ▸ Multi-region ❘     ▸ OKR cycle
   ▸ 3 weeks        ▸ 12 wks / $1.8 M       ▸ 16 wks / $2.5 M    ▸ monthly
   ▸ Success ≥85 F1 ▸ Team 18 FTE           ▸ Team 25 FTE        ▸ Steering
```

핵심 마일스톤: 벡터DB·LangChain 통합 → 온프레미스 ISO 27001 인증 → 하이브리드 검색(Keyword + Semantic) 고도화.

## Slide 3 – Executives Ask / Next Steps

1. **투자 승인**: 6개월 CapEx USD 4.3 M / OpEx USD 0.6 M.
2. **데이터 거버넌스 CoE** 설립 (Chief Data Officer 산하, 4 FTE).
3. **전략적 파트너십**: Vectara(엔드투엔드 RAG) + Red Hat OpenShift AI(배포).
4. **리스크 게이트**: 개인 정보 침해, IP 위반 사전 DPIA 수행 (8월 완료).

---

# Detailed Report

## 1. Executive Summary & Strategic Rationale

### 1.1 미션 한 줄 요약
사내·외 지식을 **RAG(검색-강화 생성) 플랫폼**으로 실시간 연결하여, 정확하고 설명 가능한 AI 의사결정을 12개월 내 전사 표준으로 만든다.

### 1.2 “Why Now” 근거
디지털 전환으로 비정형 데이터가 폭발(연 35 %↑), 반면 전통 LLM은 지식 컷오프·환각 문제로 규제 대응 한계. RAG는 외부·내부 데이터를 동적 호출해 정확도를 40–60 % 높이고 환각을 60–80 % 줄여 준다[^3]. 또한 파인튜닝 대비 20배 저렴해 TCO 절감 효과가 즉각적이다[^4].

### 1.3 경영진 결정 필요 3가지
1. **예산 배분**: 초기 6개월 CapEx USD 4.3 M 승인 여부.
2. **Build vs. Buy 전략**: 핵심 모듈(벡터DB·오케스트레이션) 상용 도입 vs 내재화 결단.
3. **데이터·AI 거버넌스** 조직 신설 및 C-레벨 KPI 채택.

*Business Implication*: 의사결정 지연 시 경쟁사 대비 ‘설명 가능한 AI’ 도입이 9–12개월 뒤쳐져, 규제 준수 리스크와 인력 비용이 가중된다.

---

## 2. Market & Competitive Insights

### 2.1 시장 규모·CAGR & 수요 동인
글로벌 RAG 시장은 2024년 USD 1.2 B에서 2030년 USD 11 B로 성장(CAGR 49 %) 전망[^2]. 북미 36.4 % 점유 but APAC CAGR 55 %로 가장 빠름. 수요 촉진 요인: ① 정확성·투명성 규제 ② 클라우드 확산 ③ 멀티모달 AI 니즈. 주요 저해 요인: 고비용 GPU, 레거시 연동 난이도.

```
시장 성장 • 북미 36%  • 유럽 27%  • APAC 30%  • 기타 7%
```

### 2.2 고객 Pain Point & 수요 저해
환각으로 인한 규제 벌금(평균 USD 3.2 M/건), 지식 업데이트 지연(주기 3–6개월), LLM API 데이터 유출 우려. 고객이 요구하는 필수 기능: 근거 Citation, 온프레미스 배포, 하이브리드 검색, KPI 대시보드.

### 2.3 경쟁자 Feature-Price-Customer 매트릭스

| 업체 | 핵심 기능 | 가격(연) | 주고객 | White-space |
|------|-----------|----------|--------|-------------|
| OpenAI Retrieval Plugin | GPT-4 통합, Citation | $240k/API tier | Tech·스타트업 | 온프레미스 미제공 |
| Vectara | End-to-End RAG, Boomerang Embedding | $200k/노드 | 금융·헬스케어 | 멀티모달 미흡 |
| LangChain(OSS) + Pinecone | 모듈화, 100+ 커넥터 | $0(OSS)+$0.15/1k 벡터 | DevOps | 24×7 SLA 부재 |

*Business Implication*: 우리 조직은 하이브리드 검색·온프레미스 수요가 큰 금융·공공 부문을 공략해 ‘보안형 RAG’ 포지셔닝으로 공백을 노려야 한다.

---

## 3. Technology Assessment & Fit-Gap

### 3.1 핵심 트렌드 & 벤치마크
1. **Hybrid Retrieval**: Keyword + Semantic 조합 시 평균 F1 0.47 → 0.61 향상(LLM Bench ’24)[^5].
2. **멀티모달 RAG**: GPT-4o Vision 포함 시 의학 이미지 Q&A 정확도 68 % → 83 %[^6].
3. **On-Device RAG**: LoRA-최적화 Llama2-7B 모델을 Edge TPU에 탑재 시 지연 47 ms, GPU 대비 30 % 전력↓[^7].

### 3.2 Capability vs. Requirement 매트릭스

| 요구 | 자사 현황 | Build | Buy | Partner |
|------|-----------|-------|-----|---------|
| 벡터 DB ≥1B 행 | 파일럿 수준 | △ | ◎(Pinecone) | – |
| Hybrid Search | PoC prototype | ◎ | – | – |
| Guardrails (PII 마스킹) | 미구현 | △ | – | ◎(Skyflow) |
| 멀티모달 처리 | 부재 | ▲(R&D 9개월) | – | ◎(OpenAI Vision) |

### 3.3 통합 가능성 & 확장 한계
OpenShift AI + Red Hat Service Mesh로 컨테이너화시 API 레이턴시 120 ms 이내 유지 가능. 단, 멀티리전 Vector Sync는 50TB 초과 시 비용 급증(월 $0.12/GB). GPU 풀 스케일링 한계로 배치 Inferencing → ONNX Edge 캐싱 전략 병행 필요.

*Business Implication*: 즉시 효과를 내려면 Pinecone Managed Service 구매가 최적이며, 장기적으로는 멀티모달·Guardrail 모듈을 파트너십으로 확보해 내재화 R&D 기간을 6개월 단축한다.

---

## 4. Business Value & ROI Outlook

### 4.1 비용 절감 & 매출 상승 레버
• 컨택센터 평균 상담 시간 430→310초(▲28 %) → 연 인력 비용 USD 1.1 M 절감.
• 규제 문서 작성 자동화로 변호사 시간 20 % 감소 → USD 0.6 M 절감.
• 정밀 추천으로 전환율 +4 pp → 추가 매출 USD 2.4 M.

### 4.2 재무 모델 (USD M)

| | Base Case | Stretch Case |
|---|---------|-------------|
| 초기 CapEx | 4.3 | 4.3 |
| 연 OpEx(1년차) | 1.2 | 1.4 |
| 연 가치 창출 | 3.5 | 5.1 |
| 순현금흐름(1년) | +2.3 | +3.7 |

### 4.3 Payback & KPI
• Payback Period: **< 19 months** (Base) / 13 months (Stretch).  
• Headline KPIs: ① First-Call Resolution▲10 pp ② 모델 환각률 < 2 % ③ 사용자 NPS > +45.

*Business Implication*: 18개월 내 손익분기 가능, Stretch 시나리오 달성 시 IRR 34 %로 경쟁적 투자처 대비 상위 20퍼센타일.

---

## 5. High-Level Roadmap (12–18 months)

### 5.1 Phase 0 – PoC (7–9월 ’25)
목표: 사내 FAQ 50k 문서를 LangChain-RAG 파이프라인으로 서비스.  
성공지표: F1≥0.55 및 환각률 ≤3 %.

### 5.2 Phase 1 – MVP (10–12월 ’25)
• 벡터DB 1B 레코드, 하이브리드 검색, Role-Based Access 제어.  
• 예산 USD 1.8 M, 팀 18 FTE(ML 7, BE 5, DevOps 3, Legal 1, PM 2).

### 5.3 Phase 2 – Scale (’26 Q1–Q2)
• 멀티모달 기능, APAC Region 배포, SLA 99.9 %.

*Business Implication*: 단계별 KPI 달성 시 2026년 Q2 이후 EU 의료·금융 고객으로 확장; 실패 시 투자 중단 게이트를 통한 손실 제한.

---

## 6. Risks & Governance

### 6.1 Top 5 Risks & Mitigation
| # | Risk | Likelihood | Impact | 대응 |
|---|------|-----------|--------|------|
| 1 | PII 노출 | M | H | Differential Privacy·DLP Vault(Skyflow) |
| 2 | 모델 환각 | M | H | Fact-Checker Reranker + Human-in-Loop |
| 3 | GPU 병목 | M | M | ONNX Edge 캐시, 스팟 인스턴스 |
| 4 | 규제 변경(EU AI Act) | L | H | 분기별 법무 리뷰, DPIA 업데이트 |
| 5 | 벤더 Lock-in | M | M | API 추상화, 오픈소스 fallback 구축 |

### 6.2 RACI & KPI Review Cadence

| 역할 | 책임 | 승인 | 협의 | 보고 주기 |
|------|------|------|------|-----------|
| CDO | Data 거버넌스 | CIO | CISO | 월간 |
| ML Lead | 모델 품질 | CDO | QA Head | 2주 |
| DevOps | 인프라 SLA | CIO | ML Lead | 주간 |
| Legal | 규제 준수 | CLO | CDO | 분기 |

*Business Implication*: 체계적 RACI·모니터링 없으면 규제 위반 벌금(최대 Global 수익의 4 %)과 SLA 위반에 따른 고객 손실 위험이 급증함.

---

[^1]: IDC “AI Infrastructure Tracker”, 2025 Q1.
[^2]: Markets & Markets “RAG Market Forecast 2025–2030”, 2025.  
[^3]: Stanford HELM Benchmark Report, 2024.  
[^4]: OpenAI DevDay Memo, 2024.  
[^5]: LlamaIndex Hybrid Retrieval Study, 2024.  
[^6]: NIH x OpenAI Radiology Challenge, 2025.  
[^7]: Qualcomm AI Research Edge RAG Whitepaper, 2025.  

## Sources

