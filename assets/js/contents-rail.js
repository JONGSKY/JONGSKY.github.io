(function () {
  var MIN_H2 = 2;

  function slugify(text) {
    return text.trim().toLowerCase()
      .replace(/[^\w가-힣\s-]/g, "")
      .replace(/\s+/g, "-");
  }

  function buildToc(scope, tocEl, navEl) {
    var h2s = scope.querySelectorAll("h2");
    if (h2s.length < MIN_H2) return null;

    var heads = scope.querySelectorAll("h2, h3");
    var list = document.createElement("ul");
    var counter = 0;
    var items = [];

    Array.prototype.forEach.call(heads, function (h) {
      if (h.classList.contains("toc-skip") || h.closest("[data-toc=\"skip\"]")) return;
      if (!h.id) h.id = slugify(h.textContent);
      var a = document.createElement("a");
      a.href = "#" + h.id;

      if (h.tagName === "H2") {
        counter += 1;
        var num = document.createElement("span");
        num.className = "n";
        num.textContent = counter < 10 ? "0" + counter : String(counter);
        a.appendChild(num);
      } else {
        a.className = "sub";
      }
      a.appendChild(document.createTextNode(h.textContent));

      var li = document.createElement("li");
      li.appendChild(a);
      list.appendChild(li);
      items.push({ heading: h, link: a });
    });

    tocEl.appendChild(list);
    tocEl.hidden = false;
    navEl.hidden = true;
    return items;
  }

  function trackScroll(items) {
    if (!("IntersectionObserver" in window)) return;
    var visible = new Set();
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) visible.add(e.target.id);
        else visible.delete(e.target.id);
      });
      var activeId = null;
      for (var i = 0; i < items.length; i++) {
        if (visible.has(items[i].heading.id)) { activeId = items[i].heading.id; break; }
      }
      items.forEach(function (it) {
        it.link.classList.toggle("act", it.heading.id === activeId);
      });
    }, { rootMargin: "-60px 0px -70% 0px" });

    items.forEach(function (it) { observer.observe(it.heading); });
  }

  function trackProgress(progressEl) {
    var fill = document.getElementById("rail-progress-fill");
    var value = document.getElementById("rail-progress-value");
    var article = document.querySelector(".post-body");
    if (!fill || !value || !article) return;

    function update() {
      var start = article.getBoundingClientRect().top + window.scrollY;
      var end = start + article.offsetHeight - window.innerHeight;
      var range = end - start;
      var percent = range > 0 ? Math.round(((window.scrollY - start) / range) * 100) : 100;
      percent = Math.max(0, Math.min(100, percent));
      fill.style.width = percent + "%";
      value.textContent = (percent < 10 ? "0" : "") + percent + "%";
      progressEl.setAttribute("aria-valuenow", String(percent));
    }

    progressEl.hidden = false;
    progressEl.setAttribute("role", "progressbar");
    progressEl.setAttribute("aria-valuemin", "0");
    progressEl.setAttribute("aria-valuemax", "100");
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    // 이미지 레퍼런스의 키보드 힌트와 실제 동작을 일치시킨다. 입력창이나
    // 편집 가능한 영역에서는 사용자의 커서 이동을 가로채지 않는다.
    window.addEventListener("keydown", function (event) {
      var target = event.target;
      var tag = target && target.tagName ? target.tagName.toLowerCase() : "";
      if (tag === "input" || tag === "textarea" || tag === "select" ||
          (target && target.isContentEditable)) return;
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      event.preventDefault();
      var distance = Math.max(window.innerHeight * 0.72, 360);
      window.scrollBy({
        top: event.key === "ArrowDown" ? distance : -distance,
        behavior: "smooth"
      });
    });
  }

  // 데스크톱 목차는 항상 표시하고, 모바일에서만 오프캔버스 드로어로 연다.
  var DESKTOP_QUERY = "(min-width: 1025px)";

  function wireRailToggle(rail) {
    var toggles = document.querySelectorAll(".mobile-rail-open");
    var mql = window.matchMedia(DESKTOP_QUERY);

    function updateButtons() {
      var expanded = rail.classList.contains("open");
      var label = expanded ? "목차 닫기" : "목차 열기";
      Array.prototype.forEach.call(toggles, function (btn) {
        btn.setAttribute("aria-expanded", expanded ? "true" : "false");
        btn.setAttribute("aria-label", label);
        // title도 같은 문구로 갱신해 마우스 오버 시 상태에 맞는 설명이 뜨게 한다.
        btn.setAttribute("title", label);
      });
    }

    function handleBreakpointChange() {
      if (mql.matches) {
        rail.classList.remove("open");
      }
      updateButtons();
    }

    Array.prototype.forEach.call(toggles, function (btn) {
      btn.addEventListener("click", function () {
        rail.classList.toggle("open");
        updateButtons();
      });
    });

    if (mql.addEventListener) {
      mql.addEventListener("change", handleBreakpointChange);
    } else if (mql.addListener) {
      mql.addListener(handleBreakpointChange);
    }

    updateButtons();
  }

  document.addEventListener("DOMContentLoaded", function () {
    var main = document.getElementById("main");
    var rail = document.getElementById("contents-rail");
    var tocEl = document.getElementById("rail-toc");
    var navEl = document.getElementById("rail-nav");
    var progressEl = document.getElementById("rail-progress");
    if (!main || !rail || !tocEl || !navEl) return;

    wireRailToggle(rail);

    // 헤딩 스캔 범위는 문서 본문(.post-body)으로 한정한다.
    // #main 전체를 스캔하면 홈 목록의 포스트 제목(h2)까지 TOC로 잡혀
    // 카테고리 내비 대신 가짜 목차가 뜬다 (post/page만 .post-body를 가짐).
    var body = document.querySelector(".post-body");
    var items = body ? buildToc(body, tocEl, navEl) : null;
    if (items) {
      trackScroll(items);
      if (progressEl) trackProgress(progressEl);
    }
  });
})();
