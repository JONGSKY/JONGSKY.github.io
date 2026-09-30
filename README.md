# JONGSKY.github.io

이종호의 AI Product & Research 포트폴리오입니다. GitHub Pages에서 Jekyll로 빌드되며, 포트폴리오·경력·연구·자격 정보를 한 곳에서 관리합니다.

## 구조

- `_data/site.yml`: 히어로 문구와 역량 그룹
- `_data/projects.yml`: 프로젝트 카드와 상세 페이지의 단일 데이터 원천
- `_data/experience.yml`: 경력
- `_data/research.yml`, `_data/awards.yml`: 연구와 수상
- `_data/education.yml`, `_data/credentials.yml`: 학력과 자격
- `projects/*.md`: 프로젝트 URL을 만드는 얇은 페이지 파일
- `_includes/home.html`: 홈 화면 섹션
- `_layouts/project.html`: 모든 프로젝트 상세 화면
- `assets/main.scss`, `assets/js/index.js`: 스타일과 테마·필터 동작

새 프로젝트를 추가할 때는 `_data/projects.yml`에 데이터를 넣고 `projects/<slug>.md` 파일을 하나 추가합니다. 고객명·내부 링크·비공개 수치는 공개 전 업종 중심 표현으로 바꿉니다.

## 로컬 확인

GitHub Pages가 제공하는 Jekyll 버전으로 빌드됩니다. Ruby와 Bundler를 설치한 뒤 다음 명령을 사용합니다.

```bash
bundle install
bundle exec jekyll serve
```

브라우저에서 `http://localhost:4000`을 열면 됩니다.
