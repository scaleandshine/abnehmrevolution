/* Aufzeichnungs-Tracking: Video-Watch-Time (YouTube IFrame API) + Calendly-Klicks.
   Facade-Markup:  <div class="video-facade" data-yt="VIDEOID" data-tag="1">…</div>
   Klick auf den Calendly-Button: <a id="rec-calendly" …>                            */
(function () {
  var BEACON = "/abnehmrevolution/api/visit?p=aufzeichnung";
  function beacon(qs) { if (window.self !== window.top) return; try { var i = new Image(); i.src = BEACON + qs; } catch (e) {} }

  // ---- YouTube IFrame API laden + Warteschlange ----
  var apiReady = (window.YT && window.YT.Player), queue = [];
  if (!apiReady) {
    var prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function () {
      apiReady = true;
      if (typeof prev === "function") { try { prev(); } catch (e) {} }
      queue.forEach(function (fn) { fn(); }); queue = [];
    };
    if (!document.getElementById("yt-iframe-api")) {
      var s = document.createElement("script");
      s.id = "yt-iframe-api"; s.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(s);
    }
  }
  function whenReady(fn) { if (apiReady) fn(); else queue.push(fn); }

  function attachVideo(facade) {
    var vid = facade.getAttribute("data-yt");
    var tag = facade.getAttribute("data-tag") || "";
    if (!vid) return;
    facade.style.cursor = "pointer";
    facade.addEventListener("click", function onClick() {
      facade.removeEventListener("click", onClick);
      facade.classList.add("is-playing");
      var mount = document.createElement("div");
      mount.className = "rec-yt-mount";
      facade.innerHTML = "";
      facade.appendChild(mount);
      whenReady(function () {
        var acc = 0, last = null, sentPlay = false;
        function flush() {
          if (last !== null) { acc += (Date.now() - last) / 1000; last = Date.now(); }
          var s = Math.round(acc);
          if (s > 0) { beacon("&ev=watch&tag=" + tag + "&secs=" + s); acc = 0; }
        }
        new YT.Player(mount, {
          width: "100%", height: "100%", videoId: vid,
          playerVars: { autoplay: 1, rel: 0, modestbranding: 1 },
          events: {
            onStateChange: function (e) {
              if (e.data === YT.PlayerState.PLAYING) {
                last = Date.now();
                if (!sentPlay) { sentPlay = true; beacon("&ev=video_play&tag=" + tag); }
              } else {
                if (last !== null) { acc += (Date.now() - last) / 1000; last = null; }
                flush();
              }
            }
          }
        });
        setInterval(flush, 20000);
        window.addEventListener("pagehide", flush);
        document.addEventListener("visibilitychange", function () { if (document.hidden) flush(); });
      });
    });
  }

  function init() {
    document.querySelectorAll(".video-facade[data-yt]").forEach(attachVideo);
    var cal = document.getElementById("rec-calendly");
    if (cal) cal.addEventListener("click", function () { beacon("&ev=calendly_click"); });
  }
  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
