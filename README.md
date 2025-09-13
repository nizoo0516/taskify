# 📅 Taskify

> **일정 관리 + 공유 기능을 제공하는 커뮤니티 기반 협업 웹 애플리케이션**

가족, 회사 등 다양한 커뮤니티를 생성하고 멤버를 초대하여 일정과 할 일 목록을 함께 관리할 수 있는 협업 플랫폼입니다.



https://github.com/user-attachments/assets/e8be9a8a-bc77-445c-82e2-696eaacc6cf5



## 🎯 프로젝트 개요

### 📋 주요 기능
- **커뮤니티 생성 및 멤버 초대**
- **일정 카드 공유 및 할 일 CRUD**
- **검색, 댓글, 목록 분류 기능**
- **실시간 협업 및 소통**

### 💡 프로젝트 목표
- 단순 일정 관리를 넘어선 커뮤니티 협업 서비스 구현
- 실제 사용 가능한 수준의 실용적 서비스 개발
- 스프린트 과정에서 직접 활용 가능한 도구 제작

## 🛠 기술 스택

### Frontend
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

### 개발 도구
![VS Code](https://img.shields.io/badge/VS_Code-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)

### 협업 & 배포
![Jira](https://img.shields.io/badge/Jira-0052CC?style=for-the-badge&logo=jira&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)

### 주요 라이브러리
- **dayjs** - 날짜 처리
- **clsx** - 클래스 조건부 적용
- **react-datepicker** - 날짜 선택기
- **react-infinite-scroll-component** - 무한 스크롤
- **next-themes** - 테마 관리

## 📁 프로젝트 구조

```
taskify/
├── src/
│   ├── app/
│   │   ├── dashboard/[id]/
│   │   ├── mydashboard/
│   │   └── mypage/
│   ├── components/
│   │   ├── common/
│   │   └── modal/
│   ├── features/
│   ├── styles/
│   └── types/
├── public/
├── config 파일들 (eslint, prettier, tailwind 등)
└── package.json
```

## 🚀 시작하기

### 설치 및 실행

```bash
# 레포지토리 클론
git clone https://github.com/Jiii-Eun/taskify.git

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm start
```

### 환경 설정
프로젝트 루트에 `.env.local` 파일을 생성하고 필요한 환경변수를 설정하세요.

## 📈 개발 프로세스

### 1️⃣ 사전 기획
- 프로젝트 주제 확정
- 선정 배경 분석
- 기획 의도 설정

### 2️⃣ 계획 수립
- 개발 환경/도구 선정
- 프로젝트 구조 설계
- WBS 및 스프린트 관리

### 3️⃣ 구현
- UI/UX 구현 (Tailwind + Motion)
- 핵심 기능 개발
- API 연동 및 상태 관리
- 품질 관리 (Lint, 타입 검사, 포맷팅)

### 4️⃣ 검증/통제
- 기능별 단위/통합 테스트
- GitHub PR을 통한 코드 리뷰
- 리팩토링 (코드 최적화, 구조 개선)

### 5️⃣ 완료/종료
- Vercel 배포
- 산출물 문서화
- 피드백 반영 및 유지보수 계획

## 👥 팀 구성 및 역할

| GitHub 아이디 | 담당 업무 |
|------|-----------|
| **Jiii-Eun** | navbar, sidebar 담당, API 구성, 인증 방식 개선 |
| **hanyousun** | 공통 모달 구현, 할 일 카드 상세 모달, 컬럼 추가/관리 모달 |
| **liz-land** | 공통 버튼 구현, 내 대시보드 구현, 초대 받은 대시보드 |
| **josubeen** | 인증 페이지 구현, 계정관리 페이지, 검증 및 에러 처리, 기본 아바타 생성 |
| **nizoo0516** | 공용 컴포넌트 제작, 대시보드 상세/수정 페이지, 태그 관련 기능 |

## 🔗 링크

- **배포 사이트**: [Taskify 바로가기](https://taskify-pi-coral.vercel.app/)
- **GitHub**: [Repository](https://github.com/Jiii-Eun/taskify.git)

## 📝 라이선스

This project is licensed under the MIT License.

---

<div align="center">
  <strong>🚀 더 나은 업무 공유를 위한 Taskify 🚀</strong>
</div>



