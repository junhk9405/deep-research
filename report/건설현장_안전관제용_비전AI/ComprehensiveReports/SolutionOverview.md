# Solution Overview

**요약:** 국내 건설현장은 여전히 높은 재해율·저생산성 문제에 직면해 있으며, 인공지능 기반 비전(Vision AI) 솔루션은 24/7 실시간 위험 감지·규정 준수 모니터링을 통해 사고를 최대 95% 감소시키고, 인력·보험·공정관리 비용을 대폭 절감할 수 있음(Source: research_content). 본 파트에서는 대표 솔루션인 viAct.ai·Visionify·HHS를 중심으로 기술 범위, 국내 적용성, 미충족 수요 및 가치제안을 정리한다.

---
## 1.1 Solution Definition & Scope

### 1) 기술 정의
AI Vision 솔루션은 기존 CCTV·IoT센서·웨어러블에서 수집되는 영상을 엣지 컴퓨팅·클라우드 모델로 실시간 분석해 △PPE(개인보호장비) 착용 여부 △추락·충돌·화재·가스누출 등 위험 이벤트 △차량·중장비 충돌 △출입·밀집도 △환경 유해인자(먼지·소음·온열) 등을 자동 탐지·알림하는 소프트웨어/하드웨어 통합 플랫폼이다(Source: research_content). 특히 비정형·동적 환경이 특징인 건설현장에서 90% 이상 정확도로 24/7 모니터링이 가능하며, 엣지 서버를 통한 지연 최소화와 GDPR·SOC-2 수준 프라이버시 보호 기능이 결합된다(Source: research_content).

### 2) 주요 기능 범위
- **안전 모니터링:** 헬멧·조끼·안경 등 PPE 미착용 자동 탐지(3개월 내 82→97% 준수율 개선 사례)(Source: research_content) / 고소작업 안전고리 미체결·추락·끼임·차량 후진 경로 침입 실시간 알람(Source: research_content)
- **환경·설비 감시:** 분진·소음·온열·가스 농도 초과 시 즉시 경보 및 자동 스프링클러·환기 장치 연동(Source: research_content)
- **생산성/품질 관리:** 작업 진도·자재 반입·차량 동선·근로자 밀집도 데이터를 대시보드화하여 일정 지연 및 낭비 요소 식별(Source: research_content)
- **통합 대시보드·모바일 앱:** 현장·본사·발주처가 동일 화면에서 KPI, 사고 이력, 교정조치(CAPA) 진행 상황을 확인하고 증적 영상 저장(Source: research_content)

### 3) 구현 아키텍처
1) 기존 카메라 영상 → 2) 현장 엣지서버(Mac Mini·NVIDIA Jetson 등)에서 1차 추론 → 3) 클라우드 대시보드로 이벤트 메타데이터만 전송하여 대역폭·보안 부담 최소화(Source: research_content). 클라우드·온프레미스·하이브리드 구성 선택 가능하며, ‘플러그-앤-플레이’·‘노코드’ 방식을 지원해 30분 내 설치 완료(Starter Kit 기준) 사례 보고(Source: research_content).

---
## 1.2 KR Scope & Market Fit

### 1) 국내 산업·제도 환경 적합성
- **재해율·규제 압력:** 한국은 OECD 최악 수준(3위) 산업재해 국가로, 정부는 2023년 중대재해처벌법 시행으로 원청 책임을 강화(Source: research_content). 실시간 모니터링·증적 확보가 법적 방어 및 보험료 절감의 핵심이 됨(Source: research_content).
- **인프라 적합성:** 대다수 현장에 이미 CCTV가 설치돼 있어 ‘기존 인프라 활용’ 모델인 Visionify·viAct.ai가 초기 CAPEX를 크게 줄이며, 14일 무상 트라이얼·Starter Kit(약 2,000 USD) 제공으로 체험 장벽이 낮다(Source: research_content).
- **R&D 및 생태계:** 과학기술정보통신부 산하 AI Safety Institute(2024) 설립, Korea AI Safety Consortium(24개 기관) 운영 등으로 안전·검증 가이드라인 구축이 진행 중(Source: research_content). 이는 기술 신뢰성 확보 및 공공-민간 도입 촉진 요인이다.

### 2) 국내 경쟁·협력 구도
- **글로벌 솔루션의 로컬화:** viAct.ai·Visionify는 다국적 레퍼런스를 보유하면서 한국 고객사와 PoC 협업 중이며, 한국어 UI·국내 데이터셋 학습을 통해 정확도 개선 진행(Source: research_content).
- **토종 스타트업 부상:** HHS의 EEG 기반 스마트 헬멧은 생체신호 모니터링 특화로 차별화되어 공단·대기업 납품 계약을 확보했으며, CES 2020 전시로 해외 바이어 수요 파악(Source: research_content).
- **에코시스템:** KINTEX ‘국제건설·산업안전 엑스포’(2025)는 하루 1,600명 이상 방문·누적 73만 회 교류로 솔루션 데모·MOU 체결 창구 역할(Source: research_content).

### 3) 사업화·수익 모델 예상
- 라이선스형(SaaS 월정액/연정액), 엣지 디바이스 일회 판매, AI 모듈 마켓플레이스 업셀링(viAct.ai) 등 다층 수익 구조(Source: research_content).
- 국내 보험사·건설사와 연계한 ‘보험료 15% 할인’ 성공사례(Visionify Global 적용) 로컬 벤치마킹 시, 초기 투자 회수기간(ROI) 6–12개월 ⚠️추정: 보험료·사고 비용 절감 기준(Source: research_content).

---
## 1.3 Unmet Needs & Value Proposition

### 1) 미충족 수요
1. **실시간·지속 모니터링 한계:** 국내 CCTV의 80%가 여전히 수동 모니터링이며, 감독 인력은 6개 화면 이상 동시 관제 불가(Source: research_content).
2. **데이터 기반 안전경영 부재:** 사고·근태·PPE 준수 데이터를 수기 엑셀로 관리, 데이터 정합성·통찰 도출이 어려움(Source: research_content).
3. **고위험 작업 특화 모델 부족:** 안전고리 체결 상태·건설장비 사각지대 등 복잡 상황에서 기존 AI의 오탐·미탐 발생(Source: research_content).
4. **프라이버시·노동수용성:** 근로자 감시 우려, 개인정보보호법·GDPR 수준 암호화·익명화 요건 등이 도입 장벽(Source: research_content).

### 2) 가치제안 및 효과 지표
- **사고 감소:** viAct.ai 적용 시 사고 95%↓, Fatal accident 80%↓(Bouygues 사례) → 사망 1건당 139만 USD 비용 절감 효과(Source: research_content).
- **인력·운영비 절감:** Visionify 도입 현장 83% 위반 감소, EHS 생산성 40%↑, 보험료 15%↓, ROI 320% 기록(Source: research_content).
- **규제 컴플라이언스 증적:** 영상·이벤트 로그 자동 저장으로 중대재해 조사·보험 청구·발주처 감사 대응 시간을 단축(Source: research_content).
- **생산성·품질 향상:** 작업 진척·장비 가동률 실시간 파악으로 98% 지연·80% 초과비용 문제에 선제 대응(Source: research_content).

### 3) 가치 실현 로드맵
1단계: CCTV 연동 PPE·추락 검출 → 2단계: 차량·중장비·환경센서 통합 → 3단계: 예지보전·멀티모달(텍스트·음성) 위험 예측 → 4단계: 자율로봇·RPA 연계로 위험 작업 자동화 ⚠️추정: 연구 내용 기반 단계 설정(Source: research_content).

---
## 그 외 인사이트
1. **정부 조달·공공공사 확대 가능성:** 중대재해처벌법 불확실성을 완화하기 위한 발주처(공공기관) 기술 의무화 움직임 관찰 ⚠️추정(Source: research_content).
2. **데이터 주권·AI 안전성 평가:** AISI·국제 네트워크 참여로 한국형 ‘AI 안전성 인증’ 도입 시, 초기 인증 통과 업체가 시장 선점 우위(Source: research_content).
3. **융복합 패키지 모델:** Vision AI + 스마트 헬멧(EEG) + IoT 환경센서 결합 ‘Total Safety Suite’ 출시 시, 단일 벤더 대비 1.5–2배 ARPU 창출 가능 ⚠️추정(Source: research_content).
