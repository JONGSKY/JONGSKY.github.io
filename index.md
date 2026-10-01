---
layout: page
title: Portfolio
tagline: "LLM 서비스와 문서 자동화를 개발하고, 멀티모달 연구를 제품과 운영 환경에 연결합니다. API 개발부터 모델 서빙, 배포와 모니터링까지 함께 다룹니다."
current_role: "Team Reboott AI Team · Founding member / Director · 2023.08 ~"
headline_skills:
  - LLM / RAG
  - Document AI
  - Python
  - Kubernetes
  - Multimodal AI
---

## About Me

안녕하세요, **이종호(Jongho Lee)**입니다.

- **Team Reboott AI Team · 창립 멤버 / Director (2023.08 ~ 현재)**
- 부경대학교 산업데이터공학 석사 · 가천대학교 산업경영공학 학사
- 멀티 LLM 서비스 개발·운영, 기업 문서·메일 자동화, 온프레미스 AI 시스템 구축
- SciCap 도표 캡션 생성과 VRD-IU 문서 정보 추출 연구

[연구·수상·학력 자세히 보기]({{ '/profile.html' | relative_url }})

---

## Career

<div class="career-timeline">
{% for item in site.data.experience %}
<div class="career-item">
  <div class="career-date">{{ item.period }}</div>
  <div class="career-content">
    <h4>{{ item.company }}</h4>
    <p class="career-role">{{ item.role }}</p>
    <p>{{ item.summary }}</p>
  </div>
</div>
{% endfor %}
</div>

---

## Skills

<div class="skills-grid">
{% for group in site.data.skills %}
<div class="skill-category">
  <h4>{{ group.name }}</h4>
  <div class="skill-tags">
    {% for skill in group.items %}<span class="skill-tag">{{ skill }}</span>{% endfor %}
  </div>
</div>
{% endfor %}
</div>

---

## Projects

<div class="project-category-list">
{% for category in site.data.categories %}
{% assign items = site.data.projects | where: "group", category.id %}
<div class="project-card">
  <h4><a href="{{ category.url | relative_url }}">{{ category.icon }} {{ category.title }}</a></h4>
  <p>{{ category.description }}</p>
  <p class="project-meta">{{ items.size }}개 프로젝트 · {{ category.period }}</p>
</div>
{% endfor %}
</div>
