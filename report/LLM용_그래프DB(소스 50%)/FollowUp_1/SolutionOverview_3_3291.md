## 개요
'Awesome-Graph-LLM' 저장소는 그래프 구조와 대형 언어 모델(LLM)의 교차점에 초점을 맞춘 큐레이션된 컬렉션으로, 실제 응용에서 널리 사용되는 그래프 데이터와 LLM의 통합이 상대적으로 미개척된 분야임을 강조한다(Source: XiaoxinHe/Awesome-Graph-LLM). 이 분야에서는 NAACL'21, NeurIPS'23·'24, ICLR'24·'25, KDD'24·'25 등 다양한 학회에서 발표된 다수의 데이터셋, 벤치마크, 설문조사 연구가 활발히 진행되고 있다(Source: multiple papers listed under Datasets, Benchmarks & Surveys).

## LLM과 그래프 통합을 위한 기술 및 모델
그래프 관련 LLM 작업을 위한 프롬프트 기법으로는 StructGPT(EMNLP'23), Graph Chain-of-Thought(ACL'24), Graph of Thoughts(AAAI'24) 등이 있으며, 이들은 LLM이 구조화된 그래프 데이터를 기반으로 추론하는 능력을 향상시킨다(Source: Prompting section papers). 또한, LLM과 그래프 신경망(GNN)을 통합하는 일반 그래프 모델로 One for All(ICLR'24), LLaGA(ICML'24), HiGPT(KDD'24), GraphGPT(SIGIR'24) 등이 개발되어 도메인 전반에 걸친 그래프 분류 및 추론 작업을 통합하는 것을 목표로 한다(Source: General Graph Model section).

대형 멀티모달 모델(LMM)은 시각, 언어, 그래프 지식을 결합하여 GraphAdapter(NeurIPS'23), GITA(NeurIPS'24), GraphVis(NeurIPS'24)와 같은 모델을 통해 향상된 멀티모달 그래프 추론을 가능하게 한다(Source: Large Multimodal Models section).

## 응용 분야
그래프-LLM 통합의 응용 분야는 기본 그래프 추론, 노드 분류, 지식 그래프 구축 및 추론, 분자 그래프 분석, 그래프 검색 증강 생성(GraphRAG), 계획 수립, 다중 에이전트 시스템, 그래프 강인성 등으로 다양하다(Source: Applications section subsections).

기본 그래프 추론 모델로는 GraphWiz(KDD'24)와 GraphArena(ICLR'25)가 있으며, 이들은 LLM의 그래프 문제에 대한 명령 수행 및 평가 프레임워크를 제공하여 그래프 계산 능력을 향상시킨다(Source: Basic Graph Reasoning). 노드 분류 연구에서는 라벨 없는 방법(ICLR'24), 텍스트 속성 그래프를 위한 LLM 증류(CIKM'24), LLM을 참조하여 GNN 훈련을 지원하는 LOGIN(WSDM'25) 등이 있다(Source: Node Classification).

지식 그래프와 LLM의 통합은 동적 문서 기반 지식 그래프(AAAI'22), 스키마 인지 프롬프트(SIGIR'23), 자동 정렬(TKDE'23), Think-on-Graph(ICLR'24), KnowGPT(NeurIPS'24)와 같은 추론 프레임워크를 통해 LLM의 사실성 및 추론 능력을 향상시킨다(Source: Knowledge Graph). 분자 그래프 분야에서는 GIMLET(NeurIPS'23)과 LLaMo(NeurIPS'24)가 그래프와 텍스트 모델을 통합하여 분자 특성 예측 및 제로샷 학습을 수행한다(Source: Molecular Graph).

그래프 검색 증강 생성(GraphRAG)은 G-Retriever(NeurIPS'24), HippoRAG(NeurIPS'24), GNN-RAG(arXiv 2024.06) 등 모델을 통해 텍스트 및 지식 그래프에 대한 검색 증강 이해 및 질의응답에 집중하고 있다(Source: Graph Retrieval Augmented Generation). 계획 및 다중 에이전트 시스템 연구는 GNN4TaskPlan(NeurIPS'24), GPTSwarm(ICML'24)과 같은 그래프 학습을 활용하여 LLM 기반 에이전트의 계획 및 협업을 개선한다(Source: Planning and Multi-Agent Systems). 그래프 강인성 연구는 텍스트 수준 그래프 주입 공격 및 방어를 다루며(NeurIPS'24, KDD'25), LLM이 강화된 그래프 신경망의 공격 및 방어 문제를 탐구한다(Source: Graph Robustness).

## 리소스 및 커뮤니티
저장소는 GraphGPT를 통한 텍스트에서 지식 그래프 추출, GraphML 및 GML 형식의 그래프 데이터, LLM과 GNN 공동 학습을 위한 PyG 예제 등 다양한 연구 및 개발 도구를 포함한다(Source: Resources & Tools). 2025년 4월 8일 기준 2.2k 스타, 150 포크, 19명의 기여자가 참여하는 활발한 커뮤니티가 유지되고 있다(Source: repository metadata).

## LLM의 추론 능력과 그래프 기반 추론 프레임워크
LLM의 추론 능력은 논리 및 자연어 추론에 중점을 두며, 추론은 최소 두 개의 전제를 동시에 사용하는 지식 처리로 정의된다(Source: dbd9fa3fc1a0). 추론 유형은 연역, 가설 추론, 귀납으로 구분되며, 특히 가설 추론과 귀납은 덜 연구되었다(Source: dbd9fa3fc1a0). 자연어 추론은 모호성과 다대다 단어 참조를 처리해야 하며, 법률 등 도메인에서는 데이터 부족 문제가 있다(Source: dbd9fa3fc1a0).

LLM은 자연어 이해, 암묵적 상식 지식, 문맥 내 학습 능력에서 장점을 가지며, 대규모 모델에서 예기치 않은 추론 능력(예: Chain-of-Thought, Few-shot prompting)이 나타난다(Source: dbd9fa3fc1a0). Chain-of-Thought(CoT) 프롬프트와 스크래치패드는 중간 단계를 명시적으로 생성하여 다단계 추론을 가능하게 하며, 추론 정확도를 향상시킨다(Source: dbd9fa3fc1a0).

LLM의 신뢰도 보정은 프롬프트 설계에 민감하며, 'None of the Above' 옵션은 성능과 보정을 저해하는 반면, True/False 형식은 개선한다. RLHF는 과신을 유발할 수 있으나 온도 조절로 완화 가능하다(Source: dbd9fa3fc1a0).

Graph-of-Thought(GoT) 추론은 선형 CoT를 넘어 노드와 엣지로 구성된 그래프 형태로 추론을 표현하며, Extract-Clustering Coreference(ECC)를 통해 지식 삼중항과 공참조 링크를 생성하여 CoT보다 약간 우수한 성능을 보인다(Source: dbd9fa3fc1a0). "Boosting Logical Reasoning in Large Language Models through a New Framework: The Graph of Thought" 논문은 Tree of Thoughts 대비 약 20% 향상된 논리 과제 성능을 보이며, 그래프 구조를 통해 상호 연결된 추론 경로를 허용하고 트리 방식의 지수적 탐색 문제를 해결한다(Source: dbd9fa3fc1a0).

MindMap 방법은 지식 그래프 검색, 집계, LLM 추론을 통합하여 데이터베이스에서 증거 그래프를 채굴하고 이를 자연어 그래프로 단순화하여 구조화된 지침과 예시로 LLM을 프롬프트한다(Source: dbd9fa3fc1a0). 그러나 LLM은 관련 없는 문맥에 쉽게 산만해져 성능이 크게 저하되며, 문제 분해, 자기 일관성, 명시적 무시 지침으로 완화 가능하다(Source: dbd9fa3fc1a0).

CoT 설명은 종종 불성실하며, LLM은 답변을 정당화하기 위해 그럴듯하지만 잘못된 추론 경로를 후처리로 생성할 수 있다. 자기 수정 기능은 현재 효과적이지 않으며, LLM이 자신의 추론 정확도를 신뢰할 수 없어 성능이 저하된다(Source: dbd9fa3fc1a0).

기호 논리 해석기와 LLM 통합(LOGIC-LM)은 문제를 형식 논리로 변환해 외부에서 해결함으로써 논리 추론 성능을 18.4% 향상시키지만, 자연어와 기호 논리 매핑 및 비결정적 논리 처리에 과제가 남아있다(Source: dbd9fa3fc1a0). 자가 대결 강화학습은 Adversarial Taboo와 같은 언어 게임에서 LLM 추론 벤치마크를 개선할 수 있으나, 현재 실험은 컴퓨팅 자원 제한과 도구 사용과의 통합 문제를 가진다(Source: dbd9fa3fc1a0).

LLM은 위치 임베딩 한계로 인해 산술 및 카운팅에 어려움을 겪으며, Abacus 임베딩은 100자리 덧셈, 곱셈, 정렬 등 산술 작업을 개선한다(Source: dbd9fa3fc1a0). Contextual Position Encoding은 문장, 단락과 같은 추상적 구조 요소에 주의를 기울일 수 있도록 위치 임베딩에 게이트 메커니즘을 도입하여 토큰 순서 이해를 향상시키나, 처음부터 학습이 필요하다(Source: dbd9fa3fc1a0). 다중 토큰 예측 학습은 크로스 엔트로피 손실을 수정해 여러 미래 토큰을 병렬 예측하여 코딩 벤치마크 성능을 개선하며, 자연어 결과는 초기 단계이다(Source: dbd9fa3fc1a0).

전반적으로 LLM 추론 연구는 그래프 신경망, 강화학습, 외부 도구 통합이 부족하며, LoRA 미세조정, 자가 대결, GNN, 도구 사용 결합이 향후 방향으로 제안된다(Source: dbd9fa3fc1a0).

## Graph of Thoughts(GoT) 프레임워크
GoT 프레임워크는 복잡한 추론 및 의사결정을 위해 문제를 작은 연산으로 분해하고 이를 구조화된 그래프로 처리하는 LLM 활용 방법이다(Source: c5607a46aa9a). 여섯 가지 핵심 구성요소는 Controller, Prompter, Parser, Scoring and Validation Module, Graph of Operations(GoO), Graph Reasoning State(GRS)이다(Source: c5607a46aa9a).

Controller는 실행 흐름을 조정하고 LLM과의 상호작용을 관리하며 그래프 구조와의 정렬을 보장한다. Prompter는 현재 문제 상태와 연산 요구사항에 기반한 문맥 특화 프롬프트를 생성한다. Parser는 LLM 응답에서 관련 정보를 추출하여 추론 상태를 갱신하거나 후속 연산에 활용한다. Scoring and Validation Module은 생성된 생각의 품질과 유효성을 평가하여 추론 무결성과 제약 준수를 유지한다(Source: c5607a).

GoO는 연산의 순서와 의존성을 정적으로 정의하여 문제 분해를 구조화하며, GRS는 중간 결과, 유효성, 점수를 포함한 현재 추론 상태를 동적으로 추적하고 연산 진행에 따라 진화한다(Source: c5607a46aa9a).

GoT 워크플로우는 Controller가 연산을 실행하고 Prompter가 프롬프트를 생성하며 LLM이 응답하고 Parser가 통찰을 추출, Scoring and Validation Module이 결과를 평가하는 반복 사이클로 구성되어 그래프가 완전히 탐색될 때까지 진행된다(Source: c5607a46aa9a).

포트폴리오 최적화 사례 연구에서는 예산 제약 내에서 가치를 극대화하는 프로젝트 선택을 위해 포트폴리오 구성을 생성, 검증, 점수화하는 과정을 보여준다. 이 사례에서 PortfolioPrompter는 프롬프트 생성, PortfolioParser는 LLM 응답 해석을 담당하며, GeneratePortfolioOperation, ValidatePortfolioOperation, ScorePortfolioOperation이 각각 포트폴리오 생성, 예산 준수 검증, 총 가치 점수를 수행한다. GoO는 포트폴리오 생성 후 검증, 점수화 순서로 명확한 의존성과 실행 순서를 보장하며, GRS는 생성된 포트폴리오 상태, 검증 상태, 점수를 유지한다(Source: c5607a46aa9a).

GoT 프레임워크는 LLM 기반 연산을 조율하여 복잡한 작업에서 최적 의사결정을 위한 체계적 탐색과 평가를 가능하게 한다(Source: c5607a46aa9a).