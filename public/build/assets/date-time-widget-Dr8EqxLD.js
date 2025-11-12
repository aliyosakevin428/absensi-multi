import{r as e,j as t}from"./app-Df3mbPUi.js";import{B as n}from"./button-9WYi6K-0.js";import{C as m,d as c}from"./card-Dc5LHktC.js";import{d as r}from"./utils-638cp2NO.js";import{c as i}from"./createLucideIcon-SMMqF0gJ.js";/* empty css            */import"./index-CA9Kvjwe.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]],l=i("Calendar",d),j=()=>{const[s,a]=e.useState(r().format("DD MMMM YYYY | HH:mm:ss"));return e.useEffect(()=>{const o=setInterval(()=>{a(r().format("DD MMMM YYYY | HH:mm:ss"))},1e3);return()=>clearInterval(o)},[]),t.jsx(m,{children:t.jsx(c,{className:"flex flex-1 items-center justify-center font-mono",children:t.jsxs(n,{variant:"ghost",className:"text-lg",disabled:!0,children:[t.jsx(l,{}),s]})})})};export{j as default};
