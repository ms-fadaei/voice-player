const m=function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&t(o)}).observe(document,{childList:!0,subtree:!0});function l(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerpolicy&&(r.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?r.credentials="include":e.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function t(e){if(e.ep)return;e.ep=!0;const r=l(e);fetch(e.href,r)}};m();const p="modulepreload",d={},g="https://ms-fadaei.github.io/voice-player/",b=function(n,l){return!l||l.length===0?n():Promise.all(l.map(t=>{if(t=`${g}${t}`,t in d)return;d[t]=!0;const e=t.endsWith(".css"),r=e?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${t}"]${r}`))return;const o=document.createElement("link");if(o.rel=e?"stylesheet":p,e||(o.as="script",o.crossOrigin=""),o.href=t,document.head.appendChild(o),e)return new Promise((f,u)=>{o.addEventListener("load",f),o.addEventListener("error",()=>u(new Error(`Unable to preload CSS for ${t}`)))})})).then(()=>n())},y=()=>b(()=>import("./telegram-voice-player.e2faec02.js"),[]);y();const a=document.getElementsByClassName("player")[0],s=document.getElementById("bars");s==null||s.addEventListener("change",i=>{const n=i.target.valueAsNumber;a.setAttribute("bars",`${n}`)});const c=document.getElementById("mirrored-bars");c==null||c.addEventListener("change",i=>{i.target.checked?a.setAttribute("mirroredbars",""):a.removeAttribute("mirroredbars")});
