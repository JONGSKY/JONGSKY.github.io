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
    if (!fill || !value) return;

    function update() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var percent = max > 0 ? Math.round((window.scrollY / max) * 100) : 100;
      percent = Math.max(0, Math.min(100, percent));
      fill.style.width = percent + "%";
      value.textContent = percent + "%";
      progressEl.setAttribute("aria-valuenow", String(percent));
    }

    progressEl.hidden = false;
    progressEl.setAttribute("role", "progressbar");
    progressEl.setAttribute("aria-valuemin", "0");
    progressEl.setAttribute("aria-valuemax", "100");
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  // rail-open 버튼은 두 역할을 겸한다:
  //  - 1024px 초과(데스크톱): 레일 전체를 접고/펼치고, .content가 grid로 자연히 넓어진다
  //  - 1024px 이하(모바일): 오프캔버스 드로어를 열고/닫는다 (기존 동작 그대로)
  // 접힘 상태는 localStorage에 저장하고, 첫 페인트 전에는 head/custom.html의
  // 인라인 스크립트가 같은 값을 읽어 <html>에 미리 클래스를 찍어 깜빡임을 막는다.
  var DESKTOP_QUERY = "(min-width: 1025px)";

  function wireRailToggle(rail) {
    var toggles = document.querySelectorAll(".rail-open");
    var mql = window.matchMedia(DESKTOP_QUERY);

    function isDesktop() {
      return mql.matches;
    }

    function isCollapsed() {
      return document.documentElement.classList.contains("rail-collapsed");
    }

    function updateButtons() {
      var desktop = isDesktop();
      var expanded = desktop ? !isCollapsed() : rail.classList.contains("open");
      var label = desktop
        ? (expanded ? "레일 접기" : "레일 펼치기")
        : (expanded ? "목차 닫기" : "목차 열기");
      Array.prototype.forEach.call(toggles, function (btn) {
        btn.setAttribute("aria-expanded", expanded ? "true" : "false");
        btn.setAttribute("aria-label", label);
        // title도 같은 문구로 갱신해 마우스 오버 시 상태에 맞는 설명이 뜨게 한다.
        btn.setAttribute("title", label);
      });
    }

    function setCollapsed(collapsed) {
      // localStorage 기록을 가장 먼저 한다: 이후의 DOM 조작(classList, inert,
      // aria 갱신)에서 예외가 나더라도 사용자의 선택은 이미 저장되어 있어야
      // 다음 방문 시 head/custom.html의 프리페인트 스크립트가 같은 값을 읽는다.
      try {
        localStorage.setItem("jongho-rail-collapsed", collapsed ? "true" : "false");
      } catch (e) {}
      document.documentElement.classList.toggle("rail-collapsed", collapsed);
      // 접힌 동안에는 폭이 0이라도 키보드/스크린리더가 레일에 들어가지 않도록 한다.
      // TOC/카테고리 DOM 노드 자체는 그대로 두어 펼쳤을 때 다시 동작하게 한다.
      rail.toggleAttribute("inert", collapsed);
      updateButtons();
    }

    function handleBreakpointChange() {
      if (isDesktop()) {
        // 모바일 드로어의 open 상태는 데스크톱 그리드와 무관하므로 정리한다.
        rail.classList.remove("open");
        rail.toggleAttribute("inert", isCollapsed());
      } else {
        // 데스크톱에서 접힌 채로 좁아지면, 드로어가 다시 열릴 수 있어야 한다.
        rail.removeAttribute("inert");
      }
      updateButtons();
    }

    Array.prototype.forEach.call(toggles, function (btn) {
      btn.addEventListener("click", function () {
        if (isDesktop()) {
          setCollapsed(!isCollapsed());
        } else {
          rail.classList.toggle("open");
          updateButtons();
        }
      });
    });

    if (mql.addEventListener) {
      mql.addEventListener("change", handleBreakpointChange);
    } else if (mql.addListener) {
      mql.addListener(handleBreakpointChange);
    }

    // 첫 페인트 전 스크립트가 <html>에 이미 rail-collapsed를 찍어 두었을 수 있으므로
    // DOM 준비 시점에 inert·aria 상태를 실제 클래스와 맞춘다.
    if (isDesktop()) rail.toggleAttribute("inert", isCollapsed());
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
