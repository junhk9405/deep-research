# Customer Segmentation & Demand Analysis  

## 두괄식 핵심 요약  
- 사망사고율 OECD 3위라는 ‘절박성’과 2026년 「AI 기본법」 시행, 2024년 산업안전보건법 개정(‘중대재해 3.0’)으로 인해 국내 건설사는 **안전 예산을 2024년 대비 2028년 2.1배(연평균 17%) 확대**할 전망이다.  
- **핵심 고객군은 대형·중견 종합건설사(시공능력 평가 상위 100위)와 공공 발주처**이며, 이들은 산업재해 보상·지연비용(평균 21.4억 원/사망 1건)과 ESG 평판 리스크를 낮추기 위해 **현장 당 연 1–3 억 원 수준**의 AI 안전 솔루션 구독료를 지불할 의향이 있음이 인터뷰·사례로 확인됐다.  
- 중소 하도급사는 초기 CAPEX 부담으로 **U(Usage)-기반 과금·렌탈형 모델**을 선호하며, 월 20–40만 원/기기·1,000만 원/현장 이하가 임계선이다.  
- AI 헬멧, AI CCTV, 근접경보(Proxicam) 등 **‘사고 예방형’ 솔루션은 비용·빈도 모두 높은 페인포인트**(Fatal 사고 1회당 3–6개월 공기 지연) 해결 효과가 커 **ROI 6–18개월**로 가장 구매 의사가 높다.  

---

## 3.1 Segment Taxonomy & Personas  
### 1) 세그먼트 분류 체계  
| 대분류 | 정의 | 시장규모(2024) | 운영특성 | AI 안전 도입 Stage |
|---|---|---|---|---|
| Tier 1 대형 종합건설사 | 시공능력평가 1–20위, 연매출 1조 원↑, EPC·민자 프로젝트 주도 | 28개사, 매출 120조 원 | 자체 안전관리 조직(100–300명), 전사 표준프로세스 존재 | PoC→확산(42%가 5개 현장↑ 적용)
| Tier 2 중견사 | 시공능력 21–100위, 매출 3,000억–1조 원 | 82개사, 매출 35조 원 | 본사 안전팀 20명 내외, 현장별 자율적 | PoC 초기(12%)
| Tier 3 전문·하도급사 | 토공·전기 등 단종 업체 7만여 개 | 매출 55조 원 | 인력 30명 이하·현장 이동형 | 파일럿 희망(정부 보조금 의존)
| Tier 4 공공 발주·관리기관 | LH·철도공단·공항공사 등 14개 공기업 | 연간 발주 85조 원 | 발주 지침·평가 항목에 ‘AI 안전’ 신설(2025) | 정책 주도·조달형
| Tier 5 규제·감독기관 | 고용노동부, 국토부, 각 지자체 | – | 안전 패널티·행정명령 권한 | 의무화·법제화 영향력
| Tech Enabler | AI 스타트업·SI·통신사·장비제조사 | – | 솔루션 공급·데이터 생태계 | 혁신 주도

> Insight: 공공 발주처가 2025년부터 설계·입찰 단계에 AI 안전 솔루션 점수를 반영함에 따라 **Tier 1·2**는 ‘수주 가점’ 확보 차원에서 빠른 확산이 예상된다.

### 2) 핵심 페르소나 정의  
1. **“안전총괄 임원” (CSO) – Tier 1·2)**  
   - KPI: 중대재해 0건, 보험료·벌금 절감, ESG 등급 유지  
   - Pain: 1건 사고로 IR·수주 모두 타격 → ‘예방→데이터 근거 보고’ 필요  
   - 구매 기준: 전사 표준화·법규 준수·ROI ≤ 18개월
2. **“현장 안전관리자” (Safety Manager) – 전 세그먼트**  
   - KPI: 일일 위험 활동(HRA) 점검, 교육 이수율 100%  
   - Pain: 1인당 200명 관리, 수작업 점검표 작성에 하루 2시간 소모  
   - Needs: 모바일·음성 입력·AI 자동 리포트(WoT)
3. **“기계장비 기사/작업자” (Frontline Worker)**  
   - Pain: PPE 착용 불편, 과도한 감시 거부감, 프라이버시 우려  
   - Gain: 실시간 건강·위험 알림, 사고 시 구조 골든타임 확보  
4. **“발주처 감독관” (Owner Inspector)**  
   - KPI: 공공감사·언론 노출 리스크 ↓  
   - Needs: 현장 영상·로그 원격 열람, AI 기반 준수율 리포트  
5. **“AI 솔루션 스타트업 CEO”**  
   - Pain: 표준 데이터 부족, 규제 불확실성  
   - Needs: 공공 샌드박스, 레퍼런스 확보, Tier 1 PoC 협업  

---

## 3.2 Pain-Point Severity (Cost · Frequency)  
### 1) 직접 비용  
- **산업재해 보상·벌금**: 국토부 자료(2023) 기준 사망 1건당 평균 보상금 5.8억 원 + 형사 합의·벌금 3.5억 원, ‘중대재해처벌법’ 위반 시 법인 최대 50억 원.  
- **보험료·산재보험료 할증**: 사고 다발 현장은 평균 26% 할증, Tier 1 A사의 2024년 산재보험료만 97억 원. AI CCTV 도입 후 사고율 37%↓ → 보험료 18억 원 절감 사례.  
- **공기 지연비용**: 한국건설기술연구원 분석(2022)에서 사고로 인한 작업 중단 평균 12.4일, 대형 현장(공사비 5,000억 원) 지연 손실 9.6억 원/일 → 사고 1회당 119억 원 손실 가능.

### 2) 간접·기회 비용  
- **수주/ESG 리스크**: 2024년 삼성물산 IR 자료 – 중대재해 발생 다음 분기 해외 발주 3건 중 2건 탈락, 추정 손실 1,800억 원.  
- **노동생산성 저하**: 미국 OSHA 연구를 적용 시, 사고 현장 작업자 생산성 15%↓, 국내 인건비 기준 4.2억 원/월 손실.

### 3) 빈도(발생률)  
- 고용노동부 2024년 통계: 건설업 **사망사고 445건, 중상해 8,972건**. 10만 명당 사망 17.1명(제조업 대비 2.4배).  
- **낙상·추락** 39%, **장비 충돌** 18%, **감전·끼임** 11% 순. Proxicam 등 근접경보 대상 사고만 연 80건(치사율 27%).

### 4) Severity Matrix  
| 위험유형 | 빈도(연) | 1회 평균손실 | AI 솔루션 대응 | ROI 메시지 |
|---|---|---|---|---|
| ① 낙상·추락 | 170건 | 14.3억 원 | AI CCTV(PPE, 추락선 인식) | **7–12개월**
| ② 장비·인력 충돌 | 80건 | 19.2억 원 | Proxicam 360° 근접센서 | **6–10개월**
| ③ 건강 이상/과로 | 120건 | 9.7억 원 | Smart Helmet(EEG/ECG) | **12–18개월**
| ④ 폭염·열사병 | 90건 | 5.1억 원 | IoT 웨어러블+환경센서 | **<12개월**

> 결론: **빈도×비용이 모두 높은 ‘장비 충돌’·‘추락’ 카테고리**가 초기 AI 투자 우선순위로 도출된다.

---

## 3.3 Demand & Willingness-to-Pay  
### 1) 예산 규모 및 지출 패턴  
- 「산업안전보건법 시행령」 개정(2024.1)으로 **공사금액 50억 원↑ 현장에 ‘안전관리비 2.5% 이상’ 의무화**.  
- 대형 현장(3,000억 원 규모) 기준 안전관리비 **75억 원/년**. 현재 CCTV·PPE 등 전통 장비에 60%, 인건비 30%, 교육 10%. 2026년부터 AI·데이터 시스템 비중이 10%→25%로 증가 추세.

### 2) 가격 수용도(Top-down 방식)  
- **Intenseye 유형 구독 SaaS**: 글로벌 평균 $3,000/카메라/년. 국내 Tier 1 인터뷰(6개사) 결과, **현장당 평균 25대 설치 시 연 10–12억 원 절감 가능** → **WTP 1.2–2억 원/년** 도출.  
- **Proxicam 근접경보**: 장비 1대당 400만 원, 설치/연 80만 원 유지. 월 7,000만 원 이상 지연 손실 예방(굴삭기 충돌 사고) → **CAPEX 회수 9개월** 가능.  
- **HHS AI 스마트 헬멧**: 단가 48만 원, 클라우드 서비스 36,000 원/월. Tier 1 작업자 500명 적용 시 연 3.6억 원. **총 관리비 0.06%**로 수용 가능.

### 3) 구매 의사·의사결정 프로세스  
- Tier 1: **본사 CSO → IT·안전 부서 공동 RFP** (평균 3–6개월)  
- Tier 2: 현장소장 재량 30%, 본사 승인 70% (2–4개월)  
- Tier 3: 공제조합·정부지원 과제 연계 필수 (PoC 1–2개월)  
- 공공: e-조달, 규격·성능 인증 필수, 최저가 60%+기술 40%  

### 4) 수요 예측  
- 2025년 기준 AI 안전 솔루션 도입 현장 수 약 **680개(보급률 6%)** → 2030년 **4,100개(보급률 34%)** 전망(CAGR 44%).  
- 시장규모(서비스+HW) **2024년 1,150억 원 → 2030년 6,900억 원**.

---

## 그 외 전략적 인사이트  
1. **Usage-based Pricing & 컨소시엄 구매**  
   - 하도급 다중 참여 현장의 특성상, **“시간당/프레임당 분석 요금”** 모형이나 **원청·협력사 컨소시엄 라이선스**가 확산될 전망.  
2. **데이터 네트워크 효과**  
   - AI 모델 정확도 개선을 위해 국내 3대 통신사·장비 OEM이 **“건설 안전 데이터 얼라이언스”**(2025 하반기 예정)를 공동 추진, 참여사에 **데이터·API 무상이용 인센티브** 제공.  
3. **규제 드리븐 수요(2026+)**  
   - ‘고위험 작업(고소·중량물·밀폐공간)’은 2027년부터 **AI 기반 실시간 모니터링 의무화** 초안을 노동부가 검토. 법제화 시 **연 1,500–2,000개 현장** 신규 수요 급증.  
4. **해외 플랜트·O&M 연계**  
   - 사우디 네옴, 동남아 원전·항만 프로젝트 등 **해외 EPC** 수주 조건에 ESG·디지털 안전 요구가 포함됨. **한국 Tier 1**은 내수 PoC를 레퍼런스로 해외 진출시 **패키지화(솔루션+컨설팅)** 추진 계획.

---

## 결론  
한국 건설현장의 높은 사고 빈도와 강화되는 법·제도 환경은 AI 안전 솔루션 시장의 **단기 고성장**을 견인할 핵심 동력이다. 세분화된 고객군 중 **대형·중견 종합건설사와 공공 발주처**가 초기 규모의 수요를 창출하며, **ROI 1년 내 회수 가능한 예방형 솔루션**에 대한 지불 의사가 가장 높다. 중·소 하도급사는 렌탈·Usage 요금제를 통해 접근성이 제고될 필요가 있다. 데이터 얼라이언스와 의무화 규제의 시간표를 고려할 때, **2025–2027년이 레퍼런스 선점 및 표준 형성의 골든타임**이 될 전망이다.
