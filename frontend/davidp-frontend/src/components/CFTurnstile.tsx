// @ts-nocheck
import { useEffect, useId } from "react";

export default function CFTurnstile({callback, error_callback, expired_callback, timeout_callback}) {
  const componentId = useId();
  const sitekey = import.meta.env.DEV ? "1x00000000000000000000AA" : "0x4AAAAAACwAfT1Q_QwaUX-3";

  useEffect(()=>{
      const idQuery = `#${componentId}`;
      const widgetId = (window.turnstile.render(idQuery, {
          sitekey: sitekey,
          // appearance: 'interaction-only',
          theme: 'dark',
          callback: function(token) {callback(token);},
          "error-callback": function(errorCode){window.turnstile.reset(widgetId);error_callback(errorCode);},
          "expired-callback": function(errorCode){window.turnstile.reset(widgetId);expired_callback(errorCode);},
          "timeout-callback": function(errorCode){window.turnstile.reset(widgetId);timeout_callback(errorCode);},
      }));

      return () => {
          window.turnstile.remove(widgetId);
      }
  },[])

    return (<>
    <div id={componentId}></div>
    </>)
}