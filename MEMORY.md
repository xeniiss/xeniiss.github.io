# MEMORY

이 문서는 프로페셔널 웹사이트 개발 루프의 상태와 가드레일을 관리하기 위한 작업 메모리다.

## Goal

- GitHub Pages용 프로페셔널 웹사이트 완성
- 반응형 데스크톱 및 모바일 지원
- `Games` 탭 구현
- 클릭형 키패드와 모바일 터치로 조작 가능한 곱셈 게임 구현
- GitHub Pages 최초 배포
- `Step 1`의 `[게임 추가 기능:]` 반영

## Required Deliverables

- 프로젝트 루트의 `index.html`
- `styles.css`
- `script.js`
- 필요한 경우 별도 `game.js`
- 필요한 이미지 및 정적 assets
- `AORR.md`
- `MEMORY.md`

## Current Scope

- 정적 HTML, CSS, JavaScript
- 프로페셔널 웹사이트 콘텐츠
- 반응형 레이아웃
- `Games` 탭
- 곱셈 게임
- GitHub Pages 배포

## Out of Scope

- 백엔드 서버
- 데이터베이스
- 로그인 및 회원가입
- 결제
- 사용자 개인정보 수집
- 별도 승인 없는 외부 API
- 별도 승인 없는 프레임워크 전환

## Current State

- 현재 상태: `DEPLOYED`
- 완료한 루프: 기본 정적 사이트 골격 1회, 곱셈 게임 UI 및 기본 로직 1회, 세로셈/받아올림 입력 전환 1회, 탭-시작/세로셈 전개 전환 1회, 재시작 버튼 노출 조건 조정 1회, 곱셈 전개 입력 및 힌트 메뉴 정리 1회
- 다음 루프: 브라우저에서 전개식 입력 순서와 힌트 메뉴 동작 재확인 [사람 확인 필요]
- 현재 Retry 횟수: `0`
- 현재 오류 fingerprint: 없음
- Blocker: 없음
- 마지막 정상 상태: 루트 `index.html`, `styles.css`, `script.js` 곱셈 전개 UI, 화면 탭 시작, 자리별 전개 입력, 힌트 메뉴 반영 완료

## Guardrails

- 기존 개인 콘텐츠 임의 삭제 금지
- 확인되지 않은 경력이나 프로젝트 정보 생성 금지
- 테스트 삭제 또는 완화 금지
- 토큰 출력 금지
- 토큰을 HTML, CSS, JavaScript에 저장 금지
- 토큰을 Git에 커밋 금지
- `github_token.txt` 커밋 금지
- `env_settings.txt` 커밋 금지
- 백엔드 기능 추가 금지
- 대규모 리팩토링 금지
- 테스트를 통과시키기 위한 기능 제거 금지

## Acceptance Criteria

- 루트 `index.html` 존재
- 로컬 정적 서버에서 정상 로드
- CSS와 JavaScript 정상 로드
- 콘솔 오류 없음
- 모바일 및 데스크톱에서 레이아웃 정상
- `Games` 탭 정상 이동
- 곱셈 게임 정상 실행
- 키보드 조작 정상
- 모바일 터치 조작 정상
- 점수 및 재시작 정상
- GitHub Pages에서 HTTP 200 응답
- 배포된 사이트에서도 동일 기능 정상

## Retry Policy

- 하나의 오류당 최대 3회
- 동일 오류 fingerprint 2회 반복 시 중지
- 한 번의 Retry에서 하나의 원인만 수정
- Retry마다 동일 Verifier 재실행

## HITL Conditions

- 개인 프로필 내용 불명확
- 기존 콘텐츠 삭제 필요
- 요구사항 충돌
- GitHub 저장소 권한 부족
- GitHub Pages 설정 변경 필요
- 외부 서비스 추가 필요
- Retry 한계 도달

## Tool Policy

- Codex는 작업 제어, 파일 수정, 테스트 실행 담당
- 가능하면 Claude Code CLI를 독립 Verifier로 사용
- 실제 사용한 Claude 모델명 기록
- 토큰 값은 어떠한 실행 기록에도 남기지 않음

## Execution Log Template

- Loop ID
- 시작 시각
- 목표
- 시작 상태
- 가설
- Act
- 변경 파일
- Verifier
- 테스트 결과
- exit code
- 오류 fingerprint
- Retry 횟수
- 종료 상태
- 다음 작업
- 사람 확인 필요 항목

## Execution Log

- Loop ID: `loop-001`
- 시작 시각: `2026-07-14 14:22:35 KST`
- 목표: GitHub Pages에서 실행 가능한 정적 웹사이트의 가장 안전한 기본 구조 만들기
- 시작 상태: `READY`
- 가설: Home/About/Projects/Games의 최소 구조와 반응형 내비게이션만 먼저 만들면 이후 게임 루프의 기준선을 안정화할 수 있다
- Act: 루트 `index.html`, `styles.css`, `script.js` 생성 및 최소 반응형 내비게이션 구성
- 변경 파일: `index.html`, `styles.css`, `script.js`
- Verifier: `python3 -m http.server` + `curl`, `node --check script.js`
- 테스트 결과: `HTTP 200` 응답 확인, `index.html`/`styles.css`/`script.js` 로드 확인, `title`/`meta viewport`/섹션 앵커 확인, `script.js` 문법 통과
- exit code: `0`
- 오류 fingerprint: 없음
- Retry 횟수: `0`
- 종료 상태: `PASSED`
- 다음 작업: 프로페셔널 콘텐츠 영역 구체화 또는 `Games` 섹션 확장 [사람 확인 필요]
- 사람 확인 필요 항목: 실제 개인 소개/경력/프로젝트 문구, 게임 세부 콘텐츠

- Loop ID: `loop-002`
- 시작 시각: `2026-07-14 14:35:06 KST`
- 목표: 곱셈 게임의 기본 UI, 랜덤 문제, 난이도, 키패드 입력, 점수, 타이머를 붙이기
- 시작 상태: `ACTING`
- 가설: Games 섹션 안에 단일 정적 게임 보드와 버튼형 키패드를 먼저 묶으면 이후 회귀가 적다
- Act: `index.html`, `styles.css`, `script.js`에 곱셈 게임 UI와 상태 로직 추가
- 변경 파일: `index.html`, `styles.css`, `script.js`
- Verifier: `node --check script.js`, `python3 -m http.server` + `curl`
- 테스트 결과: `HTTP 200` 응답 확인, `index.html`/`styles.css`/`script.js` 응답 확인, 곱셈 게임 핵심 마크업 연결 확인, 스크립트 문법 통과
- exit code: `0`
- 오류 fingerprint: 없음
- Retry 횟수: `0`
- 종료 상태: `PASSED`
- 다음 작업: 키패드 포커스, 정답 검증 세부, 반응형 보강 또는 콘텐츠 정리 [사람 확인 필요]
- 사람 확인 필요 항목: 실제 개인 소개/경력/프로젝트 문구, 게임 규칙 세부

- Loop ID: `loop-003`
- 시작 시각: `2026-07-14 05:48:40 GMT`
- 목표: 세로셈 모드, 오른쪽부터 포커스, 자동 제출, 받아올림 입력 반영
- 시작 상태: `VERIFYING`
- 가설: 정답과 받아올림 입력을 분리해 오른쪽부터 채우면 어린아이용 세로셈 흐름이 더 명확해진다
- Act: `index.html`, `styles.css`, `script.js`를 세로셈 곱셈 모드로 변경
- 변경 파일: `index.html`, `styles.css`, `script.js`
- Verifier: `node --check script.js`, `python3 -m http.server` + `curl`
- 테스트 결과: `HTTP 200` 응답 확인, 세로셈 곱셈 마크업 연결 확인, `script.js` 문법 통과
- exit code: `0`
- 오류 fingerprint: 없음
- Retry 횟수: `0`
- 종료 상태: `VERIFYING`
- 다음 작업: 브라우저에서 실제 입력 순서와 자동 제출 확인 [사람 확인 필요]
- 사람 확인 필요 항목: 브라우저에서의 실제 칸 이동, 자동 제출 시점, 받아올림 입력 UX

- Loop ID: `loop-004`
- 시작 시각: `2026-07-14 14:59:20 KST`
- 목표: 시작 버튼 제거, 화면 탭 시작, 세로셈 전개 입력으로 전환하기
- 시작 상태: `ACTING`
- 가설: 게임 영역 탭으로 시작하고 각 자리수의 곱을 입력한 뒤 최종 정답을 채우면 어린아이용 세로셈 흐름이 더 직관적이다
- Act: `index.html`, `styles.css`, `script.js`를 탭-시작 및 길게 전개하는 세로셈 방식으로 수정
- 변경 파일: `index.html`, `styles.css`, `script.js`
- Verifier: `node --check script.js`, `python3 -m http.server` + `curl`
- 테스트 결과: `script.js` 문법 통과, 로컬 정적 서버 `HTTP 200` 응답 확인, `index.html`/`styles.css`/`script.js` 응답 확인, `partial-rows`와 탭 시작 문구 반영 확인
- exit code: `0`
- 오류 fingerprint: 없음
- Retry 횟수: `0`
- 종료 상태: `VERIFYING`
- 다음 작업: 브라우저에서 화면 탭 시작, 세로셈 전개 입력 순서, 자동 제출 확인 [사람 확인 필요]
- 사람 확인 필요 항목: 실제 탭 시작 동작, partial row 시각 정렬, 자동 제출 시점

- Loop ID: `loop-005`
- 시작 시각: `2026-07-14 15:24:00 KST`
- 목표: `다시 시작` 버튼을 게임 종료 후에만 보이게 하기
- 시작 상태: `VERIFYING`
- 가설: 종료 전에는 재시작 버튼을 숨기면 화면이 더 단순해지고 어린아이용 게임 흐름이 명확해진다
- Act: `index.html`, `script.js`, `AORR.md`를 수정해 재시작 버튼 노출 시점을 게임 종료 후로 제한
- 변경 파일: `index.html`, `script.js`, `AORR.md`
- Verifier: `node --check script.js`, `python3 -m http.server` + `curl`
- 테스트 결과: `script.js` 문법 통과, `index.html`/`styles.css`/`script.js` 로컬 정적 서버 `HTTP 200` 응답 확인
- exit code: `0`
- 오류 fingerprint: 없음
- Retry 횟수: `0`
- 종료 상태: `VERIFYING`
- 다음 작업: 브라우저에서 재시작 버튼 노출 시점 확인 [사람 확인 필요]
- 사람 확인 필요 항목: 브라우저에서 재시작 버튼 노출 시점

- Loop ID: `loop-006`
- 시작 시각: `2026-07-14 06:51:30 KST`
- 목표: 곱셈 전개 입력, 셀별 오류 하이라이트, 힌트 메뉴 토글을 정리하기
- 시작 상태: `VERIFYING`
- 가설: 입력 칸 수를 실제 계산값에 맞추고 힌트 메뉴를 분리하면 문제점 목록을 한 번에 해소할 수 있다
- Act: `index.html`, `styles.css`, `script.js`, `AORR.md`, `MEMORY.md`를 곱셈 전개형과 힌트 메뉴 구조로 정리
- 변경 파일: `index.html`, `styles.css`, `script.js`, `AORR.md`, `MEMORY.md`
- Verifier: `node --check script.js`, `python3 -m http.server` + `curl`
- 테스트 결과: `script.js` 문법 통과, 로컬 정적 서버 `HTTP 200` 응답 확인
- exit code: `0`
- 오류 fingerprint: 없음
- Retry 횟수: `0`
- 종료 상태: `VERIFYING`
- 다음 작업: 브라우저에서 전개식 정렬, 셀별 오류 하이라이트, 힌트 메뉴 토글 확인 [사람 확인 필요]
- 사람 확인 필요 항목: 브라우저에서의 입력칸 정렬, 오답 하이라이트, 힌트 메뉴 열림/닫힘

- Loop ID: `loop-007`
- 시작 시각: `2026-07-14 07:12:23 KST`
- 목표: 최신 곱셈 전개 변경사항을 GitHub Pages에 재배포하고 배포 상태를 확인하기
- 시작 상태: `DEPLOYING`
- 가설: 현재 브랜치를 `main`에 push 하면 GitHub Pages가 새 빌드를 서빙할 것이다
- Act: `main` 브랜치에 커밋 `ac730ed`를 push하고 라이브 페이지를 확인
- 변경 파일: `AORR.md`, `MEMORY.md`, `index.html`, `script.js`, `styles.css`
- Verifier: `curl -I https://xeniiss.github.io`
- 테스트 결과: `HTTP 200` 응답 확인
- exit code: `0`
- 오류 fingerprint: 없음
- Retry 횟수: `0`
- 종료 상태: `DEPLOYED`
- 다음 작업: 브라우저에서 전개식 입력과 힌트 메뉴 동작 재확인 [사람 확인 필요]
- 사람 확인 필요 항목: 브라우저에서의 전개식 입력과 힌트 메뉴 세부 상호작용
