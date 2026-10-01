# JONGSKY.github.io

이종호의 AI Product & Research 포트폴리오입니다. GitHub Pages에서 Jekyll로 빌드되며, 포트폴리오·경력·연구·자격 정보를 한 곳에서 관리합니다.

## 구조

- `_config.yml`: 사이트 제목, 설명, 프로필과 링크
- `index.md`: 원본과 같은 홈 순서의 About Me·Career·Skills·Projects 내용
- `_data/categories.yml`: 왼쪽 Contents와 프로젝트 분야
- `_data/skills.yml`: 기술 카테고리와 태그
- `_data/projects.yml`: 프로젝트 카드와 상세 페이지의 단일 데이터 원천
- `_data/experience.yml`: 경력
- `_data/research.yml`, `_data/awards.yml`: 연구와 수상
- `_data/education.yml`, `_data/credentials.yml`: 학력과 자격
- `projects/*.md`: 프로젝트 URL과 제목을 정의하는 얇은 페이지 파일
- `_layouts/page.html`, `_layouts/category.html`, `_layouts/project.html`: 원본과 같은 페이지 구조
- `_includes/site-header.html`, `_includes/contents-rail.html`, `_includes/footer.html`: 헤더·목차·푸터
- `assets/css/main.scss`, `_sass/custom/*.scss`: 원본 사이트에서 가져온 스타일 구조
- `assets/js/theme-toggle.js`, `assets/js/contents-rail.js`: 테마와 목차 동작
- `UPSTREAM.md`: 참고 저장소와 가져온 범위 기록

내용을 수정할 때는 먼저 `_config.yml`, `index.md`, `_data/*.yml`만 편집하면 됩니다. 프로젝트는 `_data/projects.yml`에 데이터를 넣고 `projects/<slug>.md` 파일을 하나 추가합니다. 고객명·내부 링크·비공개 수치는 공개 전 업종 중심 표현으로 바꿉니다.

## 로컬 확인

GitHub Pages가 제공하는 Jekyll 버전으로 빌드됩니다. Ruby와 Bundler를 설치한 뒤 다음 명령을 사용합니다.

```bash
bundle install
bundle exec jekyll serve
```

브라우저에서 `http://localhost:4000`을 열면 됩니다.
