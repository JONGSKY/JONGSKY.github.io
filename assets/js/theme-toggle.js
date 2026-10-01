(function () {
  var root = document.documentElement;

  // 저장된 선택이 없으면(=data-theme 속성이 없으면) 항상 라이트로 취급한다.
  // OS 선호로 폴백하지 않는다 — 방문자가 테마 버튼으로 명시적으로 고르기
  // 전까지는 배경이 항상 흰색이어야 하고, 토글 버튼도 그 상태를 기준으로
  // 다음 클릭이 무엇을 할지 판단해야 한다(그렇지 않으면 OS가 다크인 환경에서
  // 화면은 라이트인데 버튼은 "다크에서 라이트로" 라고 착각해 반대로 토글된다).
  function isDark() {
    return root.getAttribute("data-theme") === "dark";
  }

  function apply(dark) {
    root.setAttribute("data-theme", dark ? "dark" : "light");
    try {
      localStorage.setItem("jongho-portfolio-theme", dark ? "dark" : "light");
    } catch (e) {}
    document.dispatchEvent(
      new CustomEvent("themechange", { detail: { isDark: dark } })
    );
  }

  window.blogTheme = { isDark: isDark, apply: apply };

  document.addEventListener("DOMContentLoaded", function () {
    var buttons = document.querySelectorAll(".theme-toggle");
    Array.prototype.forEach.call(buttons, function (btn) {
      btn.addEventListener("click", function () {
        apply(!isDark());
      });
    });
  });
})();
