# 보고서 생성기 (Report Generator)

기존 연구 데이터를 활용해서 최종 보고서만 생성하는 도구입니다. 연구 과정 중 타임아웃이나 오류로 인해 최종 보고서가 생성되지 않았을 때 유용합니다.

## 🎯 목적

- 이미 수집된 연구 데이터(Middle, FollowUp_1, FollowUp_2 폴더의 MD 파일들)를 활용
- `writeFinalReport` 함수만 실행하여 최종 보고서 생성
- 전체 연구 과정을 다시 실행할 필요 없이 시간 절약

## 📁 필요한 폴더 구조

```
report/
└── [프로젝트명]/
    ├── Middle/
    │   ├── MarketAnalysisDemandDrivers.md
    │   ├── CompetitiveLandscapeStrategicDifferentiators.md
    │   ├── BusinessImpactROIPotential.md
    │   ├── TechnologyFitArchitecturalFeasibility.md
    │   └── Go-to-MarketStrategy.md
    ├── FollowUp_1/
    │   ├── MarketAnalysisDemandDrivers_1_xxxx.md
    │   ├── CompetitiveLandscapeStrategicDifferentiators_1_xxxx.md
    │   └── ... (기타 MD 파일들)
    ├── FollowUp_2/
    │   ├── MarketAnalysisDemandDrivers_2_xxxx.md
    │   ├── CompetitiveLandscapeStrategicDifferentiators_2_xxxx.md
    │   └── ... (기타 MD 파일들)
    └── Final/ (생성될 폴더)
        └── [프로젝트명]_report.md (생성될 파일)
```

## 🚀 사용법

### 방법 1: npm 스크립트 사용 (권장)

```bash
cd deep-research
npm run generate-report "프로젝트명"
```

**예시:**
```bash
npm run generate-report "LLM용_Graph_Rag_솔루션"
```

### 방법 2: 직접 실행

```bash
cd deep-research
npx tsx --env-file=.env.local src/report-generator.ts "프로젝트명" "프롬프트"
```

## 📋 매개변수

1. **프로젝트명**: `report/` 폴더 안의 프로젝트 폴더명
2. **프롬프트**: 최종 보고서 생성에 사용할 주제/설명

## ✅ 실행 과정

1. **데이터 수집**: Middle, FollowUp_1, FollowUp_2 폴더에서 모든 MD 파일 읽기
2. **검증**: 수집된 학습 데이터가 있는지 확인
3. **보고서 생성**: `writeFinalReport` 함수 호출하여 최종 보고서 생성
4. **저장**: `Final/[프로젝트명]_report.md` 파일로 저장

## 📊 출력 예시

```
🚀 "LLM용_Graph_Rag_솔루션" 프로젝트의 최종 보고서 생성 시작...
📚 기존 연구 데이터 수집 중...
📁 Middle 폴더에서 5개 파일 발견
✅ MarketAnalysisDemandDrivers.md 읽기 완료 (15234 chars)
✅ CompetitiveLandscapeStrategicDifferentiators.md 읽기 완료 (12456 chars)
...
📁 FollowUp_1 폴더에서 15개 파일 발견
...
📁 FollowUp_2 폴더에서 12개 파일 발견
...
📊 총 32개의 학습 데이터 수집 완료
📝 최종 보고서 생성 중...
✅ 최종 보고서 생성 완료: report/LLM용_Graph_Rag_솔루션/Final/LLM용_Graph_Rag_솔루션_report.md
📄 보고서 길이: 45678 characters

🎉 보고서 생성이 완료되었습니다!
📁 위치: report/LLM용_Graph_Rag_솔루션/Final/LLM용_Graph_Rag_솔루션_report.md
```

## ⚠️ 주의사항

1. **환경변수**: `.env.local` 파일에 OpenAI API 키가 설정되어 있어야 합니다
2. **폴더 존재**: 지정한 프로젝트 폴더가 `report/` 디렉토리에 존재해야 합니다
3. **MD 파일**: Middle, FollowUp_1, FollowUp_2 폴더에 최소 1개 이상의 MD 파일이 있어야 합니다
4. **모델 설정**: 최종 보고서는 `REPORT_MODEL` 환경변수에 설정된 모델을 사용합니다 (기본값: o3-2025-04-16)

## 🔧 문제 해결

### "프로젝트 폴더를 찾을 수 없습니다" 오류
- `report/` 폴더에 해당 프로젝트 폴더가 있는지 확인
- 프로젝트명의 특수문자나 공백 확인

### "수집된 학습 데이터가 없습니다" 오류
- Middle, FollowUp_1, FollowUp_2 폴더에 MD 파일이 있는지 확인
- 파일이 비어있지 않은지 확인

### API 오류
- `.env.local` 파일의 OpenAI API 키 확인
- 네트워크 연결 상태 확인
- API 사용량 한도 확인

## 🎨 커스터마이징

`src/report-generator.ts` 파일을 수정하여 다음을 변경할 수 있습니다:

- 수집할 폴더명 변경 (`folders` 배열)
- 파일 필터링 조건 변경
- 보고서 파일명 형식 변경
- 로그 메시지 커스터마이징
