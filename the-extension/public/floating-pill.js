import{c as h,r as s,j as e,T as C,P as E,a as B,b as P}from"./timer.js";/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T=[["path",{d:"M10 2v2",key:"7u0qdc"}],["path",{d:"M14 2v2",key:"6buw04"}],["path",{d:"M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1",key:"pwadti"}],["path",{d:"M6 2v2",key:"colzsn"}]],I=h("coffee",T);/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]],k=h("rotate-ccw",L);/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R=[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]],F=h("x",R);function N({timerState:t,onPause:d,onRestart:u,onClose:l}){const[m,f]=s.useState({x:24,y:24}),[r,p]=s.useState(!1),[o,b]=s.useState({x:0,y:0}),i=s.useRef(null),j=n=>{if(n==null||n<0||isNaN(n))return"00:00";const a=Math.ceil(n/1e3),x=Math.floor(a/60),g=a%60;return`${x.toString().padStart(2,"0")}:${g.toString().padStart(2,"0")}`};s.useEffect(()=>{if(t.isBreakMode&&t.completedSessions>0){const n=document.createElement("div");n.textContent="Time for a break!",n.style.cssText=`
        position: fixed; top: 80px; left: 50%; transform: translateX(-50%);
        background: #2563eb; color: #fff; padding: 10px 24px; border-radius: 999px;
        font-size: 1.1em; z-index: 999999; box-shadow: 0 2px 16px #0002;
        transition: opacity 0.3s; pointer-events: none;
      `,document.body.appendChild(n),setTimeout(()=>n.remove(),2500)}},[t.isBreakMode,t.completedSessions]);const z=n=>{if(!i.current)return;p(!0);const a=i.current.getBoundingClientRect();b({x:n.clientX-a.left,y:n.clientY-a.top})},y=n=>{if(!r||!i.current)return;const a=n.clientX-o.x,x=n.clientY-o.y,g=window.innerWidth-i.current.offsetWidth,w=window.innerHeight-i.current.offsetHeight;f({x:Math.max(0,Math.min(g,a)),y:Math.max(0,Math.min(w,x))})},M=()=>{p(!1)};return s.useEffect(()=>{if(r)return document.addEventListener("mousemove",y),document.addEventListener("mouseup",M),()=>{document.removeEventListener("mousemove",y),document.removeEventListener("mouseup",M)}},[r,o]),e.jsxs("div",{ref:i,style:{all:"unset",boxSizing:"border-box",WebkitBoxSizing:"border-box",MozBoxSizing:"border-box",position:"fixed",top:m.y,left:m.x,zIndex:2147483647,background:"#ffffff",borderRadius:999,boxShadow:"rgba(0, 0, 0, 0.2) 0px 4px 20px, rgba(0, 0, 0, 0.1) 0px 2px 10px",border:"2px solid #111111",color:"#111111",display:"flex",alignItems:"center",padding:"18px 32px",minWidth:320,minHeight:64,gap:18,fontFamily:"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",userSelect:"none",pointerEvents:"auto",isolation:"isolate",willChange:"transform",transition:r?"none":"all 0.2s ease"},children:[e.jsxs("div",{onMouseDown:z,style:{display:"flex",alignItems:"center",gap:10,cursor:r?"grabbing":"grab"},children:[e.jsx("span",{children:t.isBreakMode?e.jsx(I,{size:28,color:"#111"}):e.jsx(C,{size:28,color:"#111"})}),e.jsx("span",{style:{fontSize:"1.1em",fontWeight:600},children:t.isBreakMode?"Break":"Focus"})]}),e.jsx("span",{style:{fontVariantNumeric:"tabular-nums",fontWeight:"bold",fontSize:"2em",marginRight:10,letterSpacing:"0.04em"},children:j(t.timeLeft)}),e.jsx("span",{style:{fontSize:"1em",color:"#444",marginRight:10},children:t.completedSessions>0?`Session: ${t.completedSessions} started`:""}),e.jsx("span",{style:{display:"flex",alignItems:"center",gap:6},children:t.isBreakMode?e.jsx("button",{onClick:u,style:{background:"none",border:"none",cursor:"pointer",padding:4},children:e.jsx(k,{size:22,color:"#111"})}):e.jsxs(e.Fragment,{children:[e.jsx("button",{onClick:d,style:{background:"none",border:"none",cursor:"pointer",padding:4},children:t.isRunning?e.jsx(E,{size:22,color:"#111"}):e.jsx(B,{size:22,color:"#111"})}),e.jsx("button",{onClick:u,style:{background:"none",border:"none",cursor:"pointer",padding:4},children:e.jsx(k,{size:22,color:"#111"})})]})}),e.jsx("button",{onClick:l,style:{background:"none",border:"none",cursor:"pointer",marginLeft:8,padding:4},children:e.jsx(F,{size:22,color:"#111"})})]})}function W(){const[t,d]=s.useState(null),[u,l]=s.useState(!1);s.useEffect(()=>{const p=(o,b,i)=>{o.action==="showFloatingPill"&&(d(o.timerState),l(!0),i({success:!0})),o.action==="hideFloatingPill"&&(l(!1),i({success:!0})),o.action==="updateTimerState"&&(d(o.timerState),i({success:!0}))};return chrome.runtime.onMessage.addListener(p),chrome.runtime.sendMessage({action:"getTimerState"},o=>{o&&o.timerState&&(d(o.timerState),(o.timerState.isRunning||o.timerState.isBreakMode)&&l(!0))}),()=>{chrome.runtime.onMessage.removeListener(p)}},[]);const m=()=>{chrome.runtime.sendMessage({action:"togglePause"})},f=()=>{chrome.runtime.sendMessage({action:"restartTimer"},()=>{chrome.runtime.sendMessage({action:"startTimer"})})},r=()=>{l(!1)};return!u||!t?null:e.jsx(N,{timerState:t,onPause:m,onRestart:f,onClose:r})}const v="pomodoro-pill-styles";if(!document.getElementById(v)){const t=document.createElement("style");t.id=v,t.textContent=`
    #pomodoro-floating-pill-root {
      all: unset !important;
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      pointer-events: none !important;
      z-index: 2147483647 !important;
      isolation: isolate !important;
    }
    #pomodoro-floating-pill-root * {
      box-sizing: border-box !important;
    }
  `,document.head.appendChild(t)}const S="pomodoro-floating-pill-root";let c=document.getElementById(S);c||(c=document.createElement("div"),c.id=S,c.style.cssText=`
    all: unset !important;
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    pointer-events: none !important;
    z-index: 2147483647 !important;
    isolation: isolate !important;
  `,document.body.appendChild(c));const _=P.createRoot(c);_.render(e.jsx(W,{}));
