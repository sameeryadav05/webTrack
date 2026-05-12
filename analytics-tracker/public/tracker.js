(async function () {
  try {
    const script = document.currentScript;

    const siteId = script.getAttribute("data-site-id");

    const apiKey = script.getAttribute("data-api-key");

    /*
      VISITOR ID
    */

    let visitorId = localStorage.getItem("visitor_id");

    if (!visitorId) {
      visitorId = crypto.randomUUID();

      localStorage.setItem("visitor_id", visitorId);
    }

    /*
      SESSION ID
    */

    let sessionId = sessionStorage.getItem("session_id");

    if (!sessionId) {
      sessionId = crypto.randomUUID();

      sessionStorage.setItem("session_id", sessionId);
    }

    /*
      PAGE START TIME
    */

    const startTime = Date.now();

    /*
      PAGEVIEW EVENT
    */

    const payload = {
      eventType: "pageview",

      siteId,
      apiKey,

      visitorId,
      sessionId,

      url: window.location.href,

      referrer: document.referrer,

      userAgent: navigator.userAgent,

      screenWidth: window.innerWidth,

      screenHeight: window.innerHeight,

      timestamp: new Date(),
    };

    /*
      SEND PAGEVIEW
    */

    await fetch("https://webtrack-server.onrender.com/track", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(payload),
    });

    console.log("PAGEVIEW SENT");

    /*
      PREVENT MULTIPLE SENDS
    */

    let hasSentExitEvent = false;

    /*
      TRACK SESSION END
    */

  document.addEventListener("visibilitychange", () => {

    if (
      document.visibilityState === "hidden" &&
      !hasSentExitEvent
    ) {

      hasSentExitEvent = true;

      const duration = Date.now() - startTime;

        const exitPayload = {
          eventType: "page_exit",

          siteId,
          apiKey,

          visitorId,
          sessionId,

          url: window.location.href,

          userAgent: navigator.userAgent,

          duration,

          timestamp: new Date(),
        };

      console.log("SESSION END SENT");

      fetch("https://webtrack-server.onrender.com/track", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(exitPayload),

        keepalive: true,
      });
    }
  });

  } catch (error) {
    console.log(error);
  }
})();