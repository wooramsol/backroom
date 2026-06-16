(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const us="177",Zr=0,Fs=1,$r=2,q9=1,Jr=2,at=3,Tt=0,Le=1,Je=2,ct=0,un=1,S1=2,Os=3,Bs=4,jr=5,Ft=100,Qr=101,ea=102,ta=103,na=104,ia=200,sa=201,ra=202,aa=203,E1=204,T1=205,oa=206,la=207,ca=208,ua=209,ha=210,fa=211,da=212,pa=213,ma=214,y1=0,A1=1,b1=2,pn=3,w1=4,R1=5,C1=6,P1=7,Y9=0,_a=1,ga=2,Et=0,xa=1,va=2,Ma=3,K9=4,Sa=5,Ea=6,Ta=7,on=300,mn=301,_n=302,L1=303,D1=304,Bi=306,zt=1e3,ye=1001,U1=1002,me=1003,ya=1004,ei=1005,ve=1006,Vi=1007,Bt=1008,ft=1009,Z9=1010,$9=1011,Hn=1012,hs=1013,Ht=1014,Ye=1015,Ke=1016,fs=1017,ds=1018,kn=1020,J9=35902,j9=1021,Q9=1022,be=1023,Vn=1026,Gn=1027,er=1028,ps=1029,tr=1030,ms=1031,_s=1033,Ai=33776,bi=33777,wi=33778,Ri=33779,I1=35840,N1=35841,F1=35842,O1=35843,B1=36196,z1=37492,H1=37496,k1=37808,V1=37809,G1=37810,W1=37811,X1=37812,q1=37813,Y1=37814,K1=37815,Z1=37816,$1=37817,J1=37818,j1=37819,Q1=37820,es=37821,Ci=36492,ts=36494,ns=36495,nr=36283,is=36284,ss=36285,rs=36286,Aa=3200,ba=3201,ir=0,wa=1,vt="",Ae="srgb",gn="srgb-linear",Ui="linear",J0="srgb",Wt=7680,zs=519,Ra=512,Ca=513,Pa=514,sr=515,La=516,Da=517,Ua=518,Ia=519,Hs=35044,ks="300 es",lt=2e3,Ii=2001;class En{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const s=n[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const ge=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Vs=1234567;const On=Math.PI/180,Wn=180/Math.PI;function Tn(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(ge[i&255]+ge[i>>8&255]+ge[i>>16&255]+ge[i>>24&255]+"-"+ge[e&255]+ge[e>>8&255]+"-"+ge[e>>16&15|64]+ge[e>>24&255]+"-"+ge[t&63|128]+ge[t>>8&255]+"-"+ge[t>>16&255]+ge[t>>24&255]+ge[n&255]+ge[n>>8&255]+ge[n>>16&255]+ge[n>>24&255]).toLowerCase()}function H0(i,e,t){return Math.max(e,Math.min(t,i))}function gs(i,e){return(i%e+e)%e}function Na(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Fa(i,e,t){return i!==e?(t-i)/(e-i):0}function Bn(i,e,t){return(1-t)*i+t*e}function Oa(i,e,t,n){return Bn(i,e,1-Math.exp(-t*n))}function Ba(i,e=1){return e-Math.abs(gs(i,e*2)-e)}function za(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Ha(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function ka(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Va(i,e){return i+Math.random()*(e-i)}function Ga(i){return i*(.5-Math.random())}function Wa(i){i!==void 0&&(Vs=i);let e=Vs+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Xa(i){return i*On}function qa(i){return i*Wn}function Ya(i){return(i&i-1)===0&&i!==0}function Ka(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Za(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function $a(i,e,t,n,s){const r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+n)/2),u=a((e+n)/2),h=r((e-n)/2),f=a((e-n)/2),m=r((n-e)/2),g=a((n-e)/2);switch(s){case"XYX":i.set(o*u,l*h,l*f,o*c);break;case"YZY":i.set(l*f,o*u,l*h,o*c);break;case"ZXZ":i.set(l*h,l*f,o*u,o*c);break;case"XZX":i.set(o*u,l*g,l*m,o*c);break;case"YXY":i.set(l*m,o*u,l*g,o*c);break;case"ZYZ":i.set(l*g,l*m,o*u,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function an(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Ee(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const bn={DEG2RAD:On,RAD2DEG:Wn,generateUUID:Tn,clamp:H0,euclideanModulo:gs,mapLinear:Na,inverseLerp:Fa,lerp:Bn,damp:Oa,pingpong:Ba,smoothstep:za,smootherstep:Ha,randInt:ka,randFloat:Va,randFloatSpread:Ga,seededRandom:Wa,degToRad:Xa,radToDeg:qa,isPowerOfTwo:Ya,ceilPowerOfTwo:Ka,floorPowerOfTwo:Za,setQuaternionFromProperEuler:$a,normalize:Ee,denormalize:an};class B0{constructor(e=0,t=0){B0.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=H0(this.x,e.x,t.x),this.y=H0(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=H0(this.x,e,t),this.y=H0(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(H0(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(H0(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Yn{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let l=n[s+0],c=n[s+1],u=n[s+2],h=n[s+3];const f=r[a+0],m=r[a+1],g=r[a+2],M=r[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h;return}if(o===1){e[t+0]=f,e[t+1]=m,e[t+2]=g,e[t+3]=M;return}if(h!==M||l!==f||c!==m||u!==g){let p=1-o;const d=l*f+c*m+u*g+h*M,b=d>=0?1:-1,y=1-d*d;if(y>Number.EPSILON){const I=Math.sqrt(y),L=Math.atan2(I,d*b);p=Math.sin(p*L)/I,o=Math.sin(o*L)/I}const S=o*b;if(l=l*p+f*S,c=c*p+m*S,u=u*p+g*S,h=h*p+M*S,p===1-o){const I=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=I,c*=I,u*=I,h*=I}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,n,s,r,a){const o=n[s],l=n[s+1],c=n[s+2],u=n[s+3],h=r[a],f=r[a+1],m=r[a+2],g=r[a+3];return e[t]=o*g+u*h+l*m-c*f,e[t+1]=l*g+u*f+c*h-o*m,e[t+2]=c*g+u*m+o*f-l*h,e[t+3]=u*g-o*h-l*f-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),u=o(s/2),h=o(r/2),f=l(n/2),m=l(s/2),g=l(r/2);switch(a){case"XYZ":this._x=f*u*h+c*m*g,this._y=c*m*h-f*u*g,this._z=c*u*g+f*m*h,this._w=c*u*h-f*m*g;break;case"YXZ":this._x=f*u*h+c*m*g,this._y=c*m*h-f*u*g,this._z=c*u*g-f*m*h,this._w=c*u*h+f*m*g;break;case"ZXY":this._x=f*u*h-c*m*g,this._y=c*m*h+f*u*g,this._z=c*u*g+f*m*h,this._w=c*u*h-f*m*g;break;case"ZYX":this._x=f*u*h-c*m*g,this._y=c*m*h+f*u*g,this._z=c*u*g-f*m*h,this._w=c*u*h+f*m*g;break;case"YZX":this._x=f*u*h+c*m*g,this._y=c*m*h+f*u*g,this._z=c*u*g-f*m*h,this._w=c*u*h-f*m*g;break;case"XZY":this._x=f*u*h-c*m*g,this._y=c*m*h-f*u*g,this._z=c*u*g+f*m*h,this._w=c*u*h+f*m*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],u=t[6],h=t[10],f=n+o+h;if(f>0){const m=.5/Math.sqrt(f+1);this._w=.25/m,this._x=(u-l)*m,this._y=(r-c)*m,this._z=(a-s)*m}else if(n>o&&n>h){const m=2*Math.sqrt(1+n-o-h);this._w=(u-l)/m,this._x=.25*m,this._y=(s+a)/m,this._z=(r+c)/m}else if(o>h){const m=2*Math.sqrt(1+o-n-h);this._w=(r-c)/m,this._x=(s+a)/m,this._y=.25*m,this._z=(l+u)/m}else{const m=2*Math.sqrt(1+h-n-o);this._w=(a-s)/m,this._x=(r+c)/m,this._y=(l+u)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(H0(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+a*o+s*c-r*l,this._y=s*u+a*l+r*o-n*c,this._z=r*u+a*c+n*l-s*o,this._w=a*u-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,s=this._y,r=this._z,a=this._w;let o=a*e._w+n*e._x+s*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const m=1-t;return this._w=m*a+t*this._w,this._x=m*n+t*this._x,this._y=m*s+t*this._y,this._z=m*r+t*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,o),h=Math.sin((1-t)*u)/c,f=Math.sin(t*u)/c;return this._w=a*h+this._w*f,this._x=n*h+this._x*f,this._y=s*h+this._y*f,this._z=r*h+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class O{constructor(e=0,t=0,n=0){O.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Gs.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Gs.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*n),u=2*(o*t-r*s),h=2*(r*n-a*t);return this.x=t+l*c+a*h-o*u,this.y=n+l*u+o*c-r*h,this.z=s+l*h+r*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=H0(this.x,e.x,t.x),this.y=H0(this.y,e.y,t.y),this.z=H0(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=H0(this.x,e,t),this.y=H0(this.y,e,t),this.z=H0(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(H0(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Gi.copy(this).projectOnVector(e),this.sub(Gi)}reflect(e){return this.sub(Gi.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(H0(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Gi=new O,Gs=new Yn;class I0{constructor(e,t,n,s,r,a,o,l,c){I0.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c)}set(e,t,n,s,r,a,o,l,c){const u=this.elements;return u[0]=e,u[1]=s,u[2]=o,u[3]=t,u[4]=r,u[5]=l,u[6]=n,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],u=n[4],h=n[7],f=n[2],m=n[5],g=n[8],M=s[0],p=s[3],d=s[6],b=s[1],y=s[4],S=s[7],I=s[2],L=s[5],R=s[8];return r[0]=a*M+o*b+l*I,r[3]=a*p+o*y+l*L,r[6]=a*d+o*S+l*R,r[1]=c*M+u*b+h*I,r[4]=c*p+u*y+h*L,r[7]=c*d+u*S+h*R,r[2]=f*M+m*b+g*I,r[5]=f*p+m*y+g*L,r[8]=f*d+m*S+g*R,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return t*a*u-t*o*c-n*r*u+n*o*l+s*r*c-s*a*l}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],h=u*a-o*c,f=o*l-u*r,m=c*r-a*l,g=t*h+n*f+s*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const M=1/g;return e[0]=h*M,e[1]=(s*c-u*n)*M,e[2]=(o*n-s*a)*M,e[3]=f*M,e[4]=(u*t-s*l)*M,e[5]=(s*r-o*t)*M,e[6]=m*M,e[7]=(n*l-c*t)*M,e[8]=(a*t-n*r)*M,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Wi.makeScale(e,t)),this}rotate(e){return this.premultiply(Wi.makeRotation(-e)),this}translate(e,t){return this.premultiply(Wi.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Wi=new I0;function rr(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Xn(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Ja(){const i=Xn("canvas");return i.style.display="block",i}const Ws={};function hn(i){i in Ws||(Ws[i]=!0,console.warn(i))}function ja(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}function Qa(i){const e=i.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function e2(i){const e=i.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const Xs=new I0().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),qs=new I0().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function t2(){const i={enabled:!0,workingColorSpace:gn,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===J0&&(s.r=ut(s.r),s.g=ut(s.g),s.b=ut(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===J0&&(s.r=fn(s.r),s.g=fn(s.g),s.b=fn(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===vt?Ui:this.spaces[s].transfer},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return hn("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return hn("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[gn]:{primaries:e,whitePoint:n,transfer:Ui,toXYZ:Xs,fromXYZ:qs,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Ae},outputColorSpaceConfig:{drawingBufferColorSpace:Ae}},[Ae]:{primaries:e,whitePoint:n,transfer:J0,toXYZ:Xs,fromXYZ:qs,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Ae}}}),i}const W0=t2();function ut(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function fn(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Xt;class n2{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Xt===void 0&&(Xt=Xn("canvas")),Xt.width=e.width,Xt.height=e.height;const s=Xt.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=Xt}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Xn("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=ut(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(ut(t[n]/255)*255):t[n]=ut(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let i2=0;class xs{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:i2++}),this.uuid=Tn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Xi(s[a].image)):r.push(Xi(s[a]))}else r=Xi(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function Xi(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?n2.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let s2=0;const qi=new O;class _e extends En{constructor(e=_e.DEFAULT_IMAGE,t=_e.DEFAULT_MAPPING,n=ye,s=ye,r=ve,a=Bt,o=be,l=ft,c=_e.DEFAULT_ANISOTROPY,u=vt){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:s2++}),this.uuid=Tn(),this.name="",this.source=new xs(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new B0(0,0),this.repeat=new B0(1,1),this.center=new B0(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new I0,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(qi).x}get height(){return this.source.getSize(qi).y}get depth(){return this.source.getSize(qi).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==on)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case zt:e.x=e.x-Math.floor(e.x);break;case ye:e.x=e.x<0?0:1;break;case U1:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case zt:e.y=e.y-Math.floor(e.y);break;case ye:e.y=e.y<0?0:1;break;case U1:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}_e.DEFAULT_IMAGE=null;_e.DEFAULT_MAPPING=on;_e.DEFAULT_ANISOTROPY=1;class oe{constructor(e=0,t=0,n=0,s=1){oe.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const l=e.elements,c=l[0],u=l[4],h=l[8],f=l[1],m=l[5],g=l[9],M=l[2],p=l[6],d=l[10];if(Math.abs(u-f)<.01&&Math.abs(h-M)<.01&&Math.abs(g-p)<.01){if(Math.abs(u+f)<.1&&Math.abs(h+M)<.1&&Math.abs(g+p)<.1&&Math.abs(c+m+d-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const y=(c+1)/2,S=(m+1)/2,I=(d+1)/2,L=(u+f)/4,R=(h+M)/4,N=(g+p)/4;return y>S&&y>I?y<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(y),s=L/n,r=R/n):S>I?S<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(S),n=L/s,r=N/s):I<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(I),n=R/r,s=N/r),this.set(n,s,r,t),this}let b=Math.sqrt((p-g)*(p-g)+(h-M)*(h-M)+(f-u)*(f-u));return Math.abs(b)<.001&&(b=1),this.x=(p-g)/b,this.y=(h-M)/b,this.z=(f-u)/b,this.w=Math.acos((c+m+d-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=H0(this.x,e.x,t.x),this.y=H0(this.y,e.y,t.y),this.z=H0(this.z,e.z,t.z),this.w=H0(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=H0(this.x,e,t),this.y=H0(this.y,e,t),this.z=H0(this.z,e,t),this.w=H0(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(H0(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class r2 extends En{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ve,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new oe(0,0,e,t),this.scissorTest=!1,this.viewport=new oe(0,0,e,t);const s={width:e,height:t,depth:n.depth},r=new _e(s);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){const t={minFilter:ve,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new xs(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ze extends r2{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class ar extends _e{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=me,this.minFilter=me,this.wrapR=ye,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class a2 extends _e{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=me,this.minFilter=me,this.wrapR=ye,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Kn{constructor(e=new O(1/0,1/0,1/0),t=new O(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Ge.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Ge.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Ge.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Ge):Ge.fromBufferAttribute(r,a),Ge.applyMatrix4(e.matrixWorld),this.expandByPoint(Ge);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ti.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ti.copy(n.boundingBox)),ti.applyMatrix4(e.matrixWorld),this.union(ti)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Ge),Ge.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(wn),ni.subVectors(this.max,wn),qt.subVectors(e.a,wn),Yt.subVectors(e.b,wn),Kt.subVectors(e.c,wn),dt.subVectors(Yt,qt),pt.subVectors(Kt,Yt),wt.subVectors(qt,Kt);let t=[0,-dt.z,dt.y,0,-pt.z,pt.y,0,-wt.z,wt.y,dt.z,0,-dt.x,pt.z,0,-pt.x,wt.z,0,-wt.x,-dt.y,dt.x,0,-pt.y,pt.x,0,-wt.y,wt.x,0];return!Yi(t,qt,Yt,Kt,ni)||(t=[1,0,0,0,1,0,0,0,1],!Yi(t,qt,Yt,Kt,ni))?!1:(ii.crossVectors(dt,pt),t=[ii.x,ii.y,ii.z],Yi(t,qt,Yt,Kt,ni))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Ge).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Ge).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(et[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),et[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),et[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),et[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),et[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),et[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),et[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),et[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(et),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const et=[new O,new O,new O,new O,new O,new O,new O,new O],Ge=new O,ti=new Kn,qt=new O,Yt=new O,Kt=new O,dt=new O,pt=new O,wt=new O,wn=new O,ni=new O,ii=new O,Rt=new O;function Yi(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Rt.fromArray(i,r);const o=s.x*Math.abs(Rt.x)+s.y*Math.abs(Rt.y)+s.z*Math.abs(Rt.z),l=e.dot(Rt),c=t.dot(Rt),u=n.dot(Rt);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const o2=new Kn,Rn=new O,Ki=new O;class vs{constructor(e=new O,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):o2.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Rn.subVectors(e,this.center);const t=Rn.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Rn,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ki.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Rn.copy(e.center).add(Ki)),this.expandByPoint(Rn.copy(e.center).sub(Ki))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const tt=new O,Zi=new O,si=new O,mt=new O,$i=new O,ri=new O,Ji=new O;class l2{constructor(e=new O,t=new O(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,tt)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=tt.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(tt.copy(this.origin).addScaledVector(this.direction,t),tt.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Zi.copy(e).add(t).multiplyScalar(.5),si.copy(t).sub(e).normalize(),mt.copy(this.origin).sub(Zi);const r=e.distanceTo(t)*.5,a=-this.direction.dot(si),o=mt.dot(this.direction),l=-mt.dot(si),c=mt.lengthSq(),u=Math.abs(1-a*a);let h,f,m,g;if(u>0)if(h=a*l-o,f=a*o-l,g=r*u,h>=0)if(f>=-g)if(f<=g){const M=1/u;h*=M,f*=M,m=h*(h+a*f+2*o)+f*(a*h+f+2*l)+c}else f=r,h=Math.max(0,-(a*f+o)),m=-h*h+f*(f+2*l)+c;else f=-r,h=Math.max(0,-(a*f+o)),m=-h*h+f*(f+2*l)+c;else f<=-g?(h=Math.max(0,-(-a*r+o)),f=h>0?-r:Math.min(Math.max(-r,-l),r),m=-h*h+f*(f+2*l)+c):f<=g?(h=0,f=Math.min(Math.max(-r,-l),r),m=f*(f+2*l)+c):(h=Math.max(0,-(a*r+o)),f=h>0?r:Math.min(Math.max(-r,-l),r),m=-h*h+f*(f+2*l)+c);else f=a>0?-r:r,h=Math.max(0,-(a*f+o)),m=-h*h+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(Zi).addScaledVector(si,f),m}intersectSphere(e,t){tt.subVectors(e.center,this.origin);const n=tt.dot(this.direction),s=tt.dot(tt)-n*n,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,f=this.origin;return c>=0?(n=(e.min.x-f.x)*c,s=(e.max.x-f.x)*c):(n=(e.max.x-f.x)*c,s=(e.min.x-f.x)*c),u>=0?(r=(e.min.y-f.y)*u,a=(e.max.y-f.y)*u):(r=(e.max.y-f.y)*u,a=(e.min.y-f.y)*u),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),h>=0?(o=(e.min.z-f.z)*h,l=(e.max.z-f.z)*h):(o=(e.max.z-f.z)*h,l=(e.min.z-f.z)*h),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,tt)!==null}intersectTriangle(e,t,n,s,r){$i.subVectors(t,e),ri.subVectors(n,e),Ji.crossVectors($i,ri);let a=this.direction.dot(Ji),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;mt.subVectors(this.origin,e);const l=o*this.direction.dot(ri.crossVectors(mt,ri));if(l<0)return null;const c=o*this.direction.dot($i.cross(mt));if(c<0||l+c>a)return null;const u=-o*mt.dot(Ji);return u<0?null:this.at(u/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ce{constructor(e,t,n,s,r,a,o,l,c,u,h,f,m,g,M,p){ce.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c,u,h,f,m,g,M,p)}set(e,t,n,s,r,a,o,l,c,u,h,f,m,g,M,p){const d=this.elements;return d[0]=e,d[4]=t,d[8]=n,d[12]=s,d[1]=r,d[5]=a,d[9]=o,d[13]=l,d[2]=c,d[6]=u,d[10]=h,d[14]=f,d[3]=m,d[7]=g,d[11]=M,d[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ce().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,s=1/Zt.setFromMatrixColumn(e,0).length(),r=1/Zt.setFromMatrixColumn(e,1).length(),a=1/Zt.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),h=Math.sin(r);if(e.order==="XYZ"){const f=a*u,m=a*h,g=o*u,M=o*h;t[0]=l*u,t[4]=-l*h,t[8]=c,t[1]=m+g*c,t[5]=f-M*c,t[9]=-o*l,t[2]=M-f*c,t[6]=g+m*c,t[10]=a*l}else if(e.order==="YXZ"){const f=l*u,m=l*h,g=c*u,M=c*h;t[0]=f+M*o,t[4]=g*o-m,t[8]=a*c,t[1]=a*h,t[5]=a*u,t[9]=-o,t[2]=m*o-g,t[6]=M+f*o,t[10]=a*l}else if(e.order==="ZXY"){const f=l*u,m=l*h,g=c*u,M=c*h;t[0]=f-M*o,t[4]=-a*h,t[8]=g+m*o,t[1]=m+g*o,t[5]=a*u,t[9]=M-f*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const f=a*u,m=a*h,g=o*u,M=o*h;t[0]=l*u,t[4]=g*c-m,t[8]=f*c+M,t[1]=l*h,t[5]=M*c+f,t[9]=m*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const f=a*l,m=a*c,g=o*l,M=o*c;t[0]=l*u,t[4]=M-f*h,t[8]=g*h+m,t[1]=h,t[5]=a*u,t[9]=-o*u,t[2]=-c*u,t[6]=m*h+g,t[10]=f-M*h}else if(e.order==="XZY"){const f=a*l,m=a*c,g=o*l,M=o*c;t[0]=l*u,t[4]=-h,t[8]=c*u,t[1]=f*h+M,t[5]=a*u,t[9]=m*h-g,t[2]=g*h-m,t[6]=o*u,t[10]=M*h+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(c2,e,u2)}lookAt(e,t,n){const s=this.elements;return Ue.subVectors(e,t),Ue.lengthSq()===0&&(Ue.z=1),Ue.normalize(),_t.crossVectors(n,Ue),_t.lengthSq()===0&&(Math.abs(n.z)===1?Ue.x+=1e-4:Ue.z+=1e-4,Ue.normalize(),_t.crossVectors(n,Ue)),_t.normalize(),ai.crossVectors(Ue,_t),s[0]=_t.x,s[4]=ai.x,s[8]=Ue.x,s[1]=_t.y,s[5]=ai.y,s[9]=Ue.y,s[2]=_t.z,s[6]=ai.z,s[10]=Ue.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],u=n[1],h=n[5],f=n[9],m=n[13],g=n[2],M=n[6],p=n[10],d=n[14],b=n[3],y=n[7],S=n[11],I=n[15],L=s[0],R=s[4],N=s[8],E=s[12],v=s[1],P=s[5],W=s[9],H=s[13],Z=s[2],$=s[6],q=s[10],j=s[14],k=s[3],l0=s[7],f0=s[11],T0=s[15];return r[0]=a*L+o*v+l*Z+c*k,r[4]=a*R+o*P+l*$+c*l0,r[8]=a*N+o*W+l*q+c*f0,r[12]=a*E+o*H+l*j+c*T0,r[1]=u*L+h*v+f*Z+m*k,r[5]=u*R+h*P+f*$+m*l0,r[9]=u*N+h*W+f*q+m*f0,r[13]=u*E+h*H+f*j+m*T0,r[2]=g*L+M*v+p*Z+d*k,r[6]=g*R+M*P+p*$+d*l0,r[10]=g*N+M*W+p*q+d*f0,r[14]=g*E+M*H+p*j+d*T0,r[3]=b*L+y*v+S*Z+I*k,r[7]=b*R+y*P+S*$+I*l0,r[11]=b*N+y*W+S*q+I*f0,r[15]=b*E+y*H+S*j+I*T0,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],h=e[6],f=e[10],m=e[14],g=e[3],M=e[7],p=e[11],d=e[15];return g*(+r*l*h-s*c*h-r*o*f+n*c*f+s*o*m-n*l*m)+M*(+t*l*m-t*c*f+r*a*f-s*a*m+s*c*u-r*l*u)+p*(+t*c*h-t*o*m-r*a*h+n*a*m+r*o*u-n*c*u)+d*(-s*o*u-t*l*h+t*o*f+s*a*h-n*a*f+n*l*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],h=e[9],f=e[10],m=e[11],g=e[12],M=e[13],p=e[14],d=e[15],b=h*p*c-M*f*c+M*l*m-o*p*m-h*l*d+o*f*d,y=g*f*c-u*p*c-g*l*m+a*p*m+u*l*d-a*f*d,S=u*M*c-g*h*c+g*o*m-a*M*m-u*o*d+a*h*d,I=g*h*l-u*M*l-g*o*f+a*M*f+u*o*p-a*h*p,L=t*b+n*y+s*S+r*I;if(L===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const R=1/L;return e[0]=b*R,e[1]=(M*f*r-h*p*r-M*s*m+n*p*m+h*s*d-n*f*d)*R,e[2]=(o*p*r-M*l*r+M*s*c-n*p*c-o*s*d+n*l*d)*R,e[3]=(h*l*r-o*f*r-h*s*c+n*f*c+o*s*m-n*l*m)*R,e[4]=y*R,e[5]=(u*p*r-g*f*r+g*s*m-t*p*m-u*s*d+t*f*d)*R,e[6]=(g*l*r-a*p*r-g*s*c+t*p*c+a*s*d-t*l*d)*R,e[7]=(a*f*r-u*l*r+u*s*c-t*f*c-a*s*m+t*l*m)*R,e[8]=S*R,e[9]=(g*h*r-u*M*r-g*n*m+t*M*m+u*n*d-t*h*d)*R,e[10]=(a*M*r-g*o*r+g*n*c-t*M*c-a*n*d+t*o*d)*R,e[11]=(u*o*r-a*h*r-u*n*c+t*h*c+a*n*m-t*o*m)*R,e[12]=I*R,e[13]=(u*M*s-g*h*s+g*n*f-t*M*f-u*n*p+t*h*p)*R,e[14]=(g*o*s-a*M*s-g*n*l+t*M*l+a*n*p-t*o*p)*R,e[15]=(a*h*s-u*o*s+u*n*l-t*h*l-a*n*f+t*o*f)*R,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,u=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,u*o+n,u*l-s*a,0,c*l-s*o,u*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,u=a+a,h=o+o,f=r*c,m=r*u,g=r*h,M=a*u,p=a*h,d=o*h,b=l*c,y=l*u,S=l*h,I=n.x,L=n.y,R=n.z;return s[0]=(1-(M+d))*I,s[1]=(m+S)*I,s[2]=(g-y)*I,s[3]=0,s[4]=(m-S)*L,s[5]=(1-(f+d))*L,s[6]=(p+b)*L,s[7]=0,s[8]=(g+y)*R,s[9]=(p-b)*R,s[10]=(1-(f+M))*R,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;let r=Zt.set(s[0],s[1],s[2]).length();const a=Zt.set(s[4],s[5],s[6]).length(),o=Zt.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],We.copy(this);const c=1/r,u=1/a,h=1/o;return We.elements[0]*=c,We.elements[1]*=c,We.elements[2]*=c,We.elements[4]*=u,We.elements[5]*=u,We.elements[6]*=u,We.elements[8]*=h,We.elements[9]*=h,We.elements[10]*=h,t.setFromRotationMatrix(We),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,s,r,a,o=lt){const l=this.elements,c=2*r/(t-e),u=2*r/(n-s),h=(t+e)/(t-e),f=(n+s)/(n-s);let m,g;if(o===lt)m=-(a+r)/(a-r),g=-2*a*r/(a-r);else if(o===Ii)m=-a/(a-r),g=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=u,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=lt){const l=this.elements,c=1/(t-e),u=1/(n-s),h=1/(a-r),f=(t+e)*c,m=(n+s)*u;let g,M;if(o===lt)g=(a+r)*h,M=-2*h;else if(o===Ii)g=r*h,M=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-m,l[2]=0,l[6]=0,l[10]=M,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Zt=new O,We=new ce,c2=new O(0,0,0),u2=new O(1,1,1),_t=new O,ai=new O,Ue=new O,Ys=new ce,Ks=new Yn;class He{constructor(e=0,t=0,n=0,s=He.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],u=s[9],h=s[2],f=s[6],m=s[10];switch(t){case"XYZ":this._y=Math.asin(H0(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,m),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-H0(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(H0(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-h,m),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-H0(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(f,m),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(H0(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-H0(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Ys.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Ys,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Ks.setFromEuler(this),this.setFromQuaternion(Ks,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}He.DEFAULT_ORDER="XYZ";class or{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let h2=0;const Zs=new O,$t=new Yn,nt=new ce,oi=new O,Cn=new O,f2=new O,d2=new Yn,$s=new O(1,0,0),Js=new O(0,1,0),js=new O(0,0,1),Qs={type:"added"},p2={type:"removed"},Jt={type:"childadded",child:null},ji={type:"childremoved",child:null};class Re extends En{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:h2++}),this.uuid=Tn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Re.DEFAULT_UP.clone();const e=new O,t=new He,n=new Yn,s=new O(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ce},normalMatrix:{value:new I0}}),this.matrix=new ce,this.matrixWorld=new ce,this.matrixAutoUpdate=Re.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Re.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new or,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return $t.setFromAxisAngle(e,t),this.quaternion.multiply($t),this}rotateOnWorldAxis(e,t){return $t.setFromAxisAngle(e,t),this.quaternion.premultiply($t),this}rotateX(e){return this.rotateOnAxis($s,e)}rotateY(e){return this.rotateOnAxis(Js,e)}rotateZ(e){return this.rotateOnAxis(js,e)}translateOnAxis(e,t){return Zs.copy(e).applyQuaternion(this.quaternion),this.position.add(Zs.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis($s,e)}translateY(e){return this.translateOnAxis(Js,e)}translateZ(e){return this.translateOnAxis(js,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(nt.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?oi.copy(e):oi.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Cn.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?nt.lookAt(Cn,oi,this.up):nt.lookAt(oi,Cn,this.up),this.quaternion.setFromRotationMatrix(nt),s&&(nt.extractRotation(s.matrixWorld),$t.setFromRotationMatrix(nt),this.quaternion.premultiply($t.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Qs),Jt.child=e,this.dispatchEvent(Jt),Jt.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(p2),ji.child=e,this.dispatchEvent(ji),ji.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),nt.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),nt.multiply(e.parent.matrixWorld)),e.applyMatrix4(nt),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Qs),Jt.child=e,this.dispatchEvent(Jt),Jt.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Cn,e,f2),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Cn,d2,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];r(e.shapes,h)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),h=a(e.shapes),f=a(e.skeletons),m=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),f.length>0&&(n.skeletons=f),m.length>0&&(n.animations=m),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}Re.DEFAULT_UP=new O(0,1,0);Re.DEFAULT_MATRIX_AUTO_UPDATE=!0;Re.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Xe=new O,it=new O,Qi=new O,st=new O,jt=new O,Qt=new O,e9=new O,e1=new O,t1=new O,n1=new O,i1=new oe,s1=new oe,r1=new oe;class qe{constructor(e=new O,t=new O,n=new O){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Xe.subVectors(e,t),s.cross(Xe);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){Xe.subVectors(s,t),it.subVectors(n,t),Qi.subVectors(e,t);const a=Xe.dot(Xe),o=Xe.dot(it),l=Xe.dot(Qi),c=it.dot(it),u=it.dot(Qi),h=a*c-o*o;if(h===0)return r.set(0,0,0),null;const f=1/h,m=(c*l-o*u)*f,g=(a*u-o*l)*f;return r.set(1-m-g,g,m)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,st)===null?!1:st.x>=0&&st.y>=0&&st.x+st.y<=1}static getInterpolation(e,t,n,s,r,a,o,l){return this.getBarycoord(e,t,n,s,st)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,st.x),l.addScaledVector(a,st.y),l.addScaledVector(o,st.z),l)}static getInterpolatedAttribute(e,t,n,s,r,a){return i1.setScalar(0),s1.setScalar(0),r1.setScalar(0),i1.fromBufferAttribute(e,t),s1.fromBufferAttribute(e,n),r1.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(i1,r.x),a.addScaledVector(s1,r.y),a.addScaledVector(r1,r.z),a}static isFrontFacing(e,t,n,s){return Xe.subVectors(n,t),it.subVectors(e,t),Xe.cross(it).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Xe.subVectors(this.c,this.b),it.subVectors(this.a,this.b),Xe.cross(it).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return qe.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return qe.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return qe.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return qe.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return qe.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let a,o;jt.subVectors(s,n),Qt.subVectors(r,n),e1.subVectors(e,n);const l=jt.dot(e1),c=Qt.dot(e1);if(l<=0&&c<=0)return t.copy(n);t1.subVectors(e,s);const u=jt.dot(t1),h=Qt.dot(t1);if(u>=0&&h<=u)return t.copy(s);const f=l*h-u*c;if(f<=0&&l>=0&&u<=0)return a=l/(l-u),t.copy(n).addScaledVector(jt,a);n1.subVectors(e,r);const m=jt.dot(n1),g=Qt.dot(n1);if(g>=0&&m<=g)return t.copy(r);const M=m*c-l*g;if(M<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(Qt,o);const p=u*g-m*h;if(p<=0&&h-u>=0&&m-g>=0)return e9.subVectors(r,s),o=(h-u)/(h-u+(m-g)),t.copy(s).addScaledVector(e9,o);const d=1/(p+M+f);return a=M*d,o=f*d,t.copy(n).addScaledVector(jt,a).addScaledVector(Qt,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const lr={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},gt={h:0,s:0,l:0},li={h:0,s:0,l:0};function a1(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class O0{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ae){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,W0.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=W0.workingColorSpace){return this.r=e,this.g=t,this.b=n,W0.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=W0.workingColorSpace){if(e=gs(e,1),t=H0(t,0,1),n=H0(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=a1(a,r,e+1/3),this.g=a1(a,r,e),this.b=a1(a,r,e-1/3)}return W0.colorSpaceToWorking(this,s),this}setStyle(e,t=Ae){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ae){const n=lr[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ut(e.r),this.g=ut(e.g),this.b=ut(e.b),this}copyLinearToSRGB(e){return this.r=fn(e.r),this.g=fn(e.g),this.b=fn(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ae){return W0.workingToColorSpace(xe.copy(this),e),Math.round(H0(xe.r*255,0,255))*65536+Math.round(H0(xe.g*255,0,255))*256+Math.round(H0(xe.b*255,0,255))}getHexString(e=Ae){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=W0.workingColorSpace){W0.workingToColorSpace(xe.copy(this),t);const n=xe.r,s=xe.g,r=xe.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let l,c;const u=(o+a)/2;if(o===a)l=0,c=0;else{const h=a-o;switch(c=u<=.5?h/(a+o):h/(2-a-o),a){case n:l=(s-r)/h+(s<r?6:0);break;case s:l=(r-n)/h+2;break;case r:l=(n-s)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=W0.workingColorSpace){return W0.workingToColorSpace(xe.copy(this),t),e.r=xe.r,e.g=xe.g,e.b=xe.b,e}getStyle(e=Ae){W0.workingToColorSpace(xe.copy(this),e);const t=xe.r,n=xe.g,s=xe.b;return e!==Ae?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(gt),this.setHSL(gt.h+e,gt.s+t,gt.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(gt),e.getHSL(li);const n=Bn(gt.h,li.h,t),s=Bn(gt.s,li.s,t),r=Bn(gt.l,li.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const xe=new O0;O0.NAMES=lr;let m2=0;class Zn extends En{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:m2++}),this.uuid=Tn(),this.name="",this.type="Material",this.blending=un,this.side=Tt,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=E1,this.blendDst=T1,this.blendEquation=Ft,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new O0(0,0,0),this.blendAlpha=0,this.depthFunc=pn,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=zs,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Wt,this.stencilZFail=Wt,this.stencilZPass=Wt,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==un&&(n.blending=this.blending),this.side!==Tt&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==E1&&(n.blendSrc=this.blendSrc),this.blendDst!==T1&&(n.blendDst=this.blendDst),this.blendEquation!==Ft&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==pn&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==zs&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Wt&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Wt&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Wt&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class dn extends Zn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new O0(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new He,this.combine=Y9,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const ot=_2();function _2(){const i=new ArrayBuffer(4),e=new Float32Array(i),t=new Uint32Array(i),n=new Uint32Array(512),s=new Uint32Array(512);for(let l=0;l<256;++l){const c=l-127;c<-27?(n[l]=0,n[l|256]=32768,s[l]=24,s[l|256]=24):c<-14?(n[l]=1024>>-c-14,n[l|256]=1024>>-c-14|32768,s[l]=-c-1,s[l|256]=-c-1):c<=15?(n[l]=c+15<<10,n[l|256]=c+15<<10|32768,s[l]=13,s[l|256]=13):c<128?(n[l]=31744,n[l|256]=64512,s[l]=24,s[l|256]=24):(n[l]=31744,n[l|256]=64512,s[l]=13,s[l|256]=13)}const r=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,u=0;for(;(c&8388608)===0;)c<<=1,u-=8388608;c&=-8388609,u+=947912704,r[l]=c|u}for(let l=1024;l<2048;++l)r[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)a[l]=l<<23;a[31]=1199570944,a[32]=2147483648;for(let l=33;l<63;++l)a[l]=2147483648+(l-32<<23);a[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(o[l]=1024);return{floatView:e,uint32View:t,baseTable:n,shiftTable:s,mantissaTable:r,exponentTable:a,offsetTable:o}}function g2(i){Math.abs(i)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),i=H0(i,-65504,65504),ot.floatView[0]=i;const e=ot.uint32View[0],t=e>>23&511;return ot.baseTable[t]+((e&8388607)>>ot.shiftTable[t])}function x2(i){const e=i>>10;return ot.uint32View[0]=ot.mantissaTable[ot.offsetTable[e]+(i&1023)]+ot.exponentTable[e],ot.floatView[0]}class t9{static toHalfFloat(e){return g2(e)}static fromHalfFloat(e){return x2(e)}}const le=new O,ci=new B0;let v2=0;class je{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:v2++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Hs,this.updateRanges=[],this.gpuType=Ye,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)ci.fromBufferAttribute(this,t),ci.applyMatrix3(e),this.setXY(t,ci.x,ci.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)le.fromBufferAttribute(this,t),le.applyMatrix3(e),this.setXYZ(t,le.x,le.y,le.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)le.fromBufferAttribute(this,t),le.applyMatrix4(e),this.setXYZ(t,le.x,le.y,le.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)le.fromBufferAttribute(this,t),le.applyNormalMatrix(e),this.setXYZ(t,le.x,le.y,le.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)le.fromBufferAttribute(this,t),le.transformDirection(e),this.setXYZ(t,le.x,le.y,le.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=an(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Ee(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=an(t,this.array)),t}setX(e,t){return this.normalized&&(t=Ee(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=an(t,this.array)),t}setY(e,t){return this.normalized&&(t=Ee(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=an(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Ee(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=an(t,this.array)),t}setW(e,t){return this.normalized&&(t=Ee(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Ee(t,this.array),n=Ee(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=Ee(t,this.array),n=Ee(n,this.array),s=Ee(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=Ee(t,this.array),n=Ee(n,this.array),s=Ee(s,this.array),r=Ee(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Hs&&(e.usage=this.usage),e}}class cr extends je{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class ur extends je{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class ht extends je{constructor(e,t,n){super(new Float32Array(e),t,n)}}let M2=0;const Oe=new ce,o1=new Re,en=new O,Ie=new Kn,Pn=new Kn,de=new O;class yt extends En{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:M2++}),this.uuid=Tn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(rr(e)?ur:cr)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new I0().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Oe.makeRotationFromQuaternion(e),this.applyMatrix4(Oe),this}rotateX(e){return Oe.makeRotationX(e),this.applyMatrix4(Oe),this}rotateY(e){return Oe.makeRotationY(e),this.applyMatrix4(Oe),this}rotateZ(e){return Oe.makeRotationZ(e),this.applyMatrix4(Oe),this}translate(e,t,n){return Oe.makeTranslation(e,t,n),this.applyMatrix4(Oe),this}scale(e,t,n){return Oe.makeScale(e,t,n),this.applyMatrix4(Oe),this}lookAt(e){return o1.lookAt(e),o1.updateMatrix(),this.applyMatrix4(o1.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(en).negate(),this.translate(en.x,en.y,en.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ht(n,3))}else{const n=Math.min(e.length,t.count);for(let s=0;s<n;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Kn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new O(-1/0,-1/0,-1/0),new O(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];Ie.setFromBufferAttribute(r),this.morphTargetsRelative?(de.addVectors(this.boundingBox.min,Ie.min),this.boundingBox.expandByPoint(de),de.addVectors(this.boundingBox.max,Ie.max),this.boundingBox.expandByPoint(de)):(this.boundingBox.expandByPoint(Ie.min),this.boundingBox.expandByPoint(Ie.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new vs);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new O,1/0);return}if(e){const n=this.boundingSphere.center;if(Ie.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];Pn.setFromBufferAttribute(o),this.morphTargetsRelative?(de.addVectors(Ie.min,Pn.min),Ie.expandByPoint(de),de.addVectors(Ie.max,Pn.max),Ie.expandByPoint(de)):(Ie.expandByPoint(Pn.min),Ie.expandByPoint(Pn.max))}Ie.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)de.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(de));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)de.fromBufferAttribute(o,c),l&&(en.fromBufferAttribute(e,c),de.add(en)),s=Math.max(s,n.distanceToSquared(de))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new je(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let N=0;N<n.count;N++)o[N]=new O,l[N]=new O;const c=new O,u=new O,h=new O,f=new B0,m=new B0,g=new B0,M=new O,p=new O;function d(N,E,v){c.fromBufferAttribute(n,N),u.fromBufferAttribute(n,E),h.fromBufferAttribute(n,v),f.fromBufferAttribute(r,N),m.fromBufferAttribute(r,E),g.fromBufferAttribute(r,v),u.sub(c),h.sub(c),m.sub(f),g.sub(f);const P=1/(m.x*g.y-g.x*m.y);isFinite(P)&&(M.copy(u).multiplyScalar(g.y).addScaledVector(h,-m.y).multiplyScalar(P),p.copy(h).multiplyScalar(m.x).addScaledVector(u,-g.x).multiplyScalar(P),o[N].add(M),o[E].add(M),o[v].add(M),l[N].add(p),l[E].add(p),l[v].add(p))}let b=this.groups;b.length===0&&(b=[{start:0,count:e.count}]);for(let N=0,E=b.length;N<E;++N){const v=b[N],P=v.start,W=v.count;for(let H=P,Z=P+W;H<Z;H+=3)d(e.getX(H+0),e.getX(H+1),e.getX(H+2))}const y=new O,S=new O,I=new O,L=new O;function R(N){I.fromBufferAttribute(s,N),L.copy(I);const E=o[N];y.copy(E),y.sub(I.multiplyScalar(I.dot(E))).normalize(),S.crossVectors(L,E);const P=S.dot(l[N])<0?-1:1;a.setXYZW(N,y.x,y.y,y.z,P)}for(let N=0,E=b.length;N<E;++N){const v=b[N],P=v.start,W=v.count;for(let H=P,Z=P+W;H<Z;H+=3)R(e.getX(H+0)),R(e.getX(H+1)),R(e.getX(H+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new je(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,m=n.count;f<m;f++)n.setXYZ(f,0,0,0);const s=new O,r=new O,a=new O,o=new O,l=new O,c=new O,u=new O,h=new O;if(e)for(let f=0,m=e.count;f<m;f+=3){const g=e.getX(f+0),M=e.getX(f+1),p=e.getX(f+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,M),a.fromBufferAttribute(t,p),u.subVectors(a,r),h.subVectors(s,r),u.cross(h),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,M),c.fromBufferAttribute(n,p),o.add(u),l.add(u),c.add(u),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(M,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let f=0,m=t.count;f<m;f+=3)s.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),u.subVectors(a,r),h.subVectors(s,r),u.cross(h),n.setXYZ(f+0,u.x,u.y,u.z),n.setXYZ(f+1,u.x,u.y,u.z),n.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)de.fromBufferAttribute(e,t),de.normalize(),e.setXYZ(t,de.x,de.y,de.z)}toNonIndexed(){function e(o,l){const c=o.array,u=o.itemSize,h=o.normalized,f=new c.constructor(l.length*u);let m=0,g=0;for(let M=0,p=l.length;M<p;M++){o.isInterleavedBufferAttribute?m=l[M]*o.data.stride+o.offset:m=l[M]*u;for(let d=0;d<u;d++)f[g++]=c[m++]}return new je(f,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new yt,n=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,n);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let u=0,h=c.length;u<h;u++){const f=c[u],m=e(f,n);l.push(m)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,f=c.length;h<f;h++){const m=c[h];u.push(m.toJSON(e.data))}u.length>0&&(s[l]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const s=e.attributes;for(const c in s){const u=s[c];this.setAttribute(c,u.clone(t))}const r=e.morphAttributes;for(const c in r){const u=[],h=r[c];for(let f=0,m=h.length;f<m;f++)u.push(h[f].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,u=a.length;c<u;c++){const h=a[c];this.addGroup(h.start,h.count,h.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const n9=new ce,Ct=new l2,ui=new vs,i9=new O,hi=new O,fi=new O,di=new O,l1=new O,pi=new O,s9=new O,mi=new O;class we extends Re{constructor(e=new yt,t=new dn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){pi.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const u=o[l],h=r[l];u!==0&&(l1.fromBufferAttribute(h,e),a?pi.addScaledVector(l1,u):pi.addScaledVector(l1.sub(t),u))}t.add(pi)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ui.copy(n.boundingSphere),ui.applyMatrix4(r),Ct.copy(e.ray).recast(e.near),!(ui.containsPoint(Ct.origin)===!1&&(Ct.intersectSphere(ui,i9)===null||Ct.origin.distanceToSquared(i9)>(e.far-e.near)**2))&&(n9.copy(r).invert(),Ct.copy(e.ray).applyMatrix4(n9),!(n.boundingBox!==null&&Ct.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Ct)))}_computeIntersections(e,t,n){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,f=r.groups,m=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,M=f.length;g<M;g++){const p=f[g],d=a[p.materialIndex],b=Math.max(p.start,m.start),y=Math.min(o.count,Math.min(p.start+p.count,m.start+m.count));for(let S=b,I=y;S<I;S+=3){const L=o.getX(S),R=o.getX(S+1),N=o.getX(S+2);s=_i(this,d,e,n,c,u,h,L,R,N),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const g=Math.max(0,m.start),M=Math.min(o.count,m.start+m.count);for(let p=g,d=M;p<d;p+=3){const b=o.getX(p),y=o.getX(p+1),S=o.getX(p+2);s=_i(this,a,e,n,c,u,h,b,y,S),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,M=f.length;g<M;g++){const p=f[g],d=a[p.materialIndex],b=Math.max(p.start,m.start),y=Math.min(l.count,Math.min(p.start+p.count,m.start+m.count));for(let S=b,I=y;S<I;S+=3){const L=S,R=S+1,N=S+2;s=_i(this,d,e,n,c,u,h,L,R,N),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const g=Math.max(0,m.start),M=Math.min(l.count,m.start+m.count);for(let p=g,d=M;p<d;p+=3){const b=p,y=p+1,S=p+2;s=_i(this,a,e,n,c,u,h,b,y,S),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}}}function S2(i,e,t,n,s,r,a,o){let l;if(e.side===Le?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,e.side===Tt,o),l===null)return null;mi.copy(o),mi.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(mi);return c<t.near||c>t.far?null:{distance:c,point:mi.clone(),object:i}}function _i(i,e,t,n,s,r,a,o,l,c){i.getVertexPosition(o,hi),i.getVertexPosition(l,fi),i.getVertexPosition(c,di);const u=S2(i,e,t,n,hi,fi,di,s9);if(u){const h=new O;qe.getBarycoord(s9,hi,fi,di,h),s&&(u.uv=qe.getInterpolatedAttribute(s,o,l,c,h,new B0)),r&&(u.uv1=qe.getInterpolatedAttribute(r,o,l,c,h,new B0)),a&&(u.normal=qe.getInterpolatedAttribute(a,o,l,c,h,new O),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const f={a:o,b:l,c,normal:new O,materialIndex:0};qe.getNormal(hi,fi,di,f.normal),u.face=f,u.barycoord=h}return u}class kt extends yt{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],u=[],h=[];let f=0,m=0;g("z","y","x",-1,-1,n,t,e,a,r,0),g("z","y","x",1,-1,n,t,-e,a,r,1),g("x","z","y",1,1,e,n,t,s,a,2),g("x","z","y",1,-1,e,n,-t,s,a,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new ht(c,3)),this.setAttribute("normal",new ht(u,3)),this.setAttribute("uv",new ht(h,2));function g(M,p,d,b,y,S,I,L,R,N,E){const v=S/R,P=I/N,W=S/2,H=I/2,Z=L/2,$=R+1,q=N+1;let j=0,k=0;const l0=new O;for(let f0=0;f0<q;f0++){const T0=f0*P-H;for(let z0=0;z0<$;z0++){const j0=z0*v-W;l0[M]=j0*b,l0[p]=T0*y,l0[d]=Z,c.push(l0.x,l0.y,l0.z),l0[M]=0,l0[p]=0,l0[d]=L>0?1:-1,u.push(l0.x,l0.y,l0.z),h.push(z0/R),h.push(1-f0/N),j+=1}}for(let f0=0;f0<N;f0++)for(let T0=0;T0<R;T0++){const z0=f+T0+$*f0,j0=f+T0+$*(f0+1),X=f+(T0+1)+$*(f0+1),n0=f+(T0+1)+$*f0;l.push(z0,j0,n0),l.push(j0,X,n0),k+=6}o.addGroup(m,k,E),m+=k,f+=j}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new kt(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function xn(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function Te(i){const e={};for(let t=0;t<i.length;t++){const n=xn(i[t]);for(const s in n)e[s]=n[s]}return e}function E2(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function hr(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:W0.workingColorSpace}const Ni={clone:xn,merge:Te};var T2=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,y2=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Pe extends Zn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=T2,this.fragmentShader=y2,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=xn(e.uniforms),this.uniformsGroups=E2(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class fr extends Re{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ce,this.projectionMatrix=new ce,this.projectionMatrixInverse=new ce,this.coordinateSystem=lt}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const xt=new O,r9=new B0,a9=new B0;class Be extends fr{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Wn*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(On*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Wn*2*Math.atan(Math.tan(On*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){xt.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(xt.x,xt.y).multiplyScalar(-e/xt.z),xt.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(xt.x,xt.y).multiplyScalar(-e/xt.z)}getViewSize(e,t){return this.getViewBounds(e,r9,a9),t.subVectors(a9,r9)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(On*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const tn=-90,nn=1;class A2 extends Re{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Be(tn,nn,e,t);s.layers=this.layers,this.add(s);const r=new Be(tn,nn,e,t);r.layers=this.layers,this.add(r);const a=new Be(tn,nn,e,t);a.layers=this.layers,this.add(a);const o=new Be(tn,nn,e,t);o.layers=this.layers,this.add(o);const l=new Be(tn,nn,e,t);l.layers=this.layers,this.add(l);const c=new Be(tn,nn,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===lt)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Ii)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,u]=this.children,h=e.getRenderTarget(),f=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const M=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,a),e.setRenderTarget(n,2,s),e.render(t,o),e.setRenderTarget(n,3,s),e.render(t,l),e.setRenderTarget(n,4,s),e.render(t,c),n.texture.generateMipmaps=M,e.setRenderTarget(n,5,s),e.render(t,u),e.setRenderTarget(h,f,m),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class dr extends _e{constructor(e=[],t=mn,n,s,r,a,o,l,c,u){super(e,t,n,s,r,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class b2 extends Ze{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new dr(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new kt(5,5,5),r=new Pe({name:"CubemapFromEquirect",uniforms:xn(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Le,blending:ct});r.uniforms.tEquirect.value=t;const a=new we(s,r),o=t.minFilter;return t.minFilter===Bt&&(t.minFilter=ve),new A2(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}}class Un extends Re{constructor(){super(),this.isGroup=!0,this.type="Group"}}const w2={type:"move"};class c1{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Un,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Un,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new O,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new O),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Un,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new O,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new O),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const M of e.hand.values()){const p=t.getJointPose(M,n),d=this._getHandJoint(c,M);p!==null&&(d.matrix.fromArray(p.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=p.radius),d.visible=p!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],f=u.position.distanceTo(h.position),m=.02,g=.005;c.inputState.pinching&&f>m+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=m-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(w2)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Un;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class Ms{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new O0(e),this.near=t,this.far=n}clone(){return new Ms(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class R2 extends Re{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new He,this.environmentIntensity=1,this.environmentRotation=new He,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class gi extends _e{constructor(e=null,t=1,n=1,s,r,a,o,l,c=me,u=me,h,f){super(null,a,o,l,c,u,s,r,h,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const u1=new O,C2=new O,P2=new I0;class It{constructor(e=new O(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=u1.subVectors(n,t).cross(C2.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(u1),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||P2.getNormalMatrix(e),s=this.coplanarPoint(u1).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Pt=new vs,xi=new O;class pr{constructor(e=new It,t=new It,n=new It,s=new It,r=new It,a=new It){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=lt){const n=this.planes,s=e.elements,r=s[0],a=s[1],o=s[2],l=s[3],c=s[4],u=s[5],h=s[6],f=s[7],m=s[8],g=s[9],M=s[10],p=s[11],d=s[12],b=s[13],y=s[14],S=s[15];if(n[0].setComponents(l-r,f-c,p-m,S-d).normalize(),n[1].setComponents(l+r,f+c,p+m,S+d).normalize(),n[2].setComponents(l+a,f+u,p+g,S+b).normalize(),n[3].setComponents(l-a,f-u,p-g,S-b).normalize(),n[4].setComponents(l-o,f-h,p-M,S-y).normalize(),t===lt)n[5].setComponents(l+o,f+h,p+M,S+y).normalize();else if(t===Ii)n[5].setComponents(o,h,M,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Pt.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Pt.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Pt)}intersectsSprite(e){return Pt.center.set(0,0,0),Pt.radius=.7071067811865476,Pt.applyMatrix4(e.matrixWorld),this.intersectsSphere(Pt)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(xi.x=s.normal.x>0?e.max.x:e.min.x,xi.y=s.normal.y>0?e.max.y:e.min.y,xi.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(xi)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class L2 extends _e{constructor(e,t,n,s,r,a,o,l,c){super(e,t,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class mr extends _e{constructor(e,t,n=Ht,s,r,a,o=me,l=me,c,u=Vn,h=1){if(u!==Vn&&u!==Gn)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:e,height:t,depth:h};super(f,s,r,a,o,l,u,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new xs(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Vt extends yt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(s),c=o+1,u=l+1,h=e/o,f=t/l,m=[],g=[],M=[],p=[];for(let d=0;d<u;d++){const b=d*f-a;for(let y=0;y<c;y++){const S=y*h-r;g.push(S,-b,0),M.push(0,0,1),p.push(y/o),p.push(1-d/l)}}for(let d=0;d<l;d++)for(let b=0;b<o;b++){const y=b+c*d,S=b+c*(d+1),I=b+1+c*(d+1),L=b+1+c*d;m.push(y,S,L),m.push(S,I,L)}this.setIndex(m),this.setAttribute("position",new ht(g,3)),this.setAttribute("normal",new ht(M,3)),this.setAttribute("uv",new ht(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Vt(e.width,e.height,e.widthSegments,e.heightSegments)}}class _r extends Zn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new O0(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new O0(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ir,this.normalScale=new B0(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new He,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class D2 extends Zn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Aa,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class U2 extends Zn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const o9={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(this.files[i]=e)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};class I2{constructor(e,t,n){const s=this;let r=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(u){o++,r===!1&&s.onStart!==void 0&&s.onStart(u,a,o),r=!0},this.itemEnd=function(u){a++,s.onProgress!==void 0&&s.onProgress(u,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,h){return c.push(u,h),this},this.removeHandler=function(u){const h=c.indexOf(u);return h!==-1&&c.splice(h,2),this},this.getHandler=function(u){for(let h=0,f=c.length;h<f;h+=2){const m=c[h],g=c[h+1];if(m.global&&(m.lastIndex=0),m.test(u))return g}return null}}}const N2=new I2;class Ss{constructor(e){this.manager=e!==void 0?e:N2,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}Ss.DEFAULT_MATERIAL_NAME="__DEFAULT";class F2 extends Ss{constructor(e){super(e)}load(e,t,n,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=o9.get(e);if(a!==void 0)return r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0),a;const o=Xn("img");function l(){u(),o9.add(e,this),t&&t(this),r.manager.itemEnd(e)}function c(h){u(),s&&s(h),r.manager.itemError(e),r.manager.itemEnd(e)}function u(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),r.manager.itemStart(e),o.src=e,o}}class O2 extends Ss{constructor(e){super(e)}load(e,t,n,s){const r=new _e,a=new F2(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},n,s),r}}class Es extends Re{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new O0(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class B2 extends Es{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Re.DEFAULT_UP),this.updateMatrix(),this.groundColor=new O0(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}class gr extends fr{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class z2 extends Es{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class H2 extends Es{constructor(e,t,n=10,s=10){super(e,t),this.isRectAreaLight=!0,this.type="RectAreaLight",this.width=n,this.height=s}get power(){return this.intensity*this.width*this.height*Math.PI}set power(e){this.intensity=e/(this.width*this.height*Math.PI)}copy(e){return super.copy(e),this.width=e.width,this.height=e.height,this}toJSON(e){const t=super.toJSON(e);return t.object.width=this.width,t.object.height=this.height,t}}class k2 extends Be{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class xr{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=l9(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=l9();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function l9(){return performance.now()}function c9(i,e,t,n){const s=V2(n);switch(t){case j9:return i*e;case er:return i*e/s.components*s.byteLength;case ps:return i*e/s.components*s.byteLength;case tr:return i*e*2/s.components*s.byteLength;case ms:return i*e*2/s.components*s.byteLength;case Q9:return i*e*3/s.components*s.byteLength;case be:return i*e*4/s.components*s.byteLength;case _s:return i*e*4/s.components*s.byteLength;case Ai:case bi:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case wi:case Ri:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case N1:case O1:return Math.max(i,16)*Math.max(e,8)/4;case I1:case F1:return Math.max(i,8)*Math.max(e,8)/2;case B1:case z1:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case H1:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case k1:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case V1:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case G1:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case W1:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case X1:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case q1:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Y1:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case K1:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Z1:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case $1:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case J1:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case j1:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Q1:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case es:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Ci:case ts:case ns:return Math.ceil(i/4)*Math.ceil(e/4)*16;case nr:case is:return Math.ceil(i/4)*Math.ceil(e/4)*8;case ss:case rs:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function V2(i){switch(i){case ft:case Z9:return{byteLength:1,components:1};case Hn:case $9:case Ke:return{byteLength:2,components:1};case fs:case ds:return{byteLength:2,components:4};case Ht:case hs:case Ye:return{byteLength:4,components:1};case J9:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:us}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=us);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function vr(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function G2(i){const e=new WeakMap;function t(o,l){const c=o.array,u=o.usage,h=c.byteLength,f=i.createBuffer();i.bindBuffer(l,f),i.bufferData(l,c,u),o.onUploadCallback();let m;if(c instanceof Float32Array)m=i.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?m=i.HALF_FLOAT:m=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)m=i.SHORT;else if(c instanceof Uint32Array)m=i.UNSIGNED_INT;else if(c instanceof Int32Array)m=i.INT;else if(c instanceof Int8Array)m=i.BYTE;else if(c instanceof Uint8Array)m=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)m=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:m,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:h}}function n(o,l,c){const u=l.array,h=l.updateRanges;if(i.bindBuffer(c,o),h.length===0)i.bufferSubData(c,0,u);else{h.sort((m,g)=>m.start-g.start);let f=0;for(let m=1;m<h.length;m++){const g=h[f],M=h[m];M.start<=g.start+g.count+1?g.count=Math.max(g.count,M.start+M.count-g.start):(++f,h[f]=M)}h.length=f+1;for(let m=0,g=h.length;m<g;m++){const M=h[m];i.bufferSubData(c,M.start*u.BYTES_PER_ELEMENT,u,M.start,M.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var W2=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,X2=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,q2=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Y2=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,K2=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Z2=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,$2=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,J2=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,j2=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Q2=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,eo=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,to=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,no=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,io=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,so=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,ro=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,ao=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,oo=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,lo=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,co=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,uo=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,ho=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,fo=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,po=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,mo=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,_o=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,go=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,xo=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,vo=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Mo=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,So="gl_FragColor = linearToOutputTexel( gl_FragColor );",Eo=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,To=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,yo=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Ao=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,bo=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,wo=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Ro=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Co=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Po=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Lo=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Do=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Uo=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Io=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,No=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Fo=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Oo=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Bo=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,zo=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Ho=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,ko=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Vo=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Go=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Wo=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Xo=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,qo=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Yo=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Ko=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Zo=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,$o=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Jo=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,jo=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Qo=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,e3=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,t3=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,n3=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,i3=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,s3=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,r3=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,a3=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,o3=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,l3=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,c3=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,u3=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,h3=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,f3=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,d3=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,p3=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,m3=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,_3=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,g3=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,x3=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,v3=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,M3=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,S3=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,E3=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,T3=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,y3=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,A3=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,b3=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,w3=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,R3=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,C3=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,P3=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,L3=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,D3=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,U3=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,I3=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,N3=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,F3=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,O3=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,B3=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,z3=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,H3=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,k3=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,V3=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,G3=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const W3=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,X3=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,q3=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Y3=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,K3=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Z3=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$3=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,J3=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,j3=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Q3=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,e4=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,t4=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,n4=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,i4=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,s4=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,r4=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,a4=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,o4=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,l4=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,c4=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,u4=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,h4=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,f4=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,d4=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,p4=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,m4=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,_4=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,g4=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,x4=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,v4=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,M4=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,S4=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,E4=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,T4=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,F0={alphahash_fragment:W2,alphahash_pars_fragment:X2,alphamap_fragment:q2,alphamap_pars_fragment:Y2,alphatest_fragment:K2,alphatest_pars_fragment:Z2,aomap_fragment:$2,aomap_pars_fragment:J2,batching_pars_vertex:j2,batching_vertex:Q2,begin_vertex:eo,beginnormal_vertex:to,bsdfs:no,iridescence_fragment:io,bumpmap_pars_fragment:so,clipping_planes_fragment:ro,clipping_planes_pars_fragment:ao,clipping_planes_pars_vertex:oo,clipping_planes_vertex:lo,color_fragment:co,color_pars_fragment:uo,color_pars_vertex:ho,color_vertex:fo,common:po,cube_uv_reflection_fragment:mo,defaultnormal_vertex:_o,displacementmap_pars_vertex:go,displacementmap_vertex:xo,emissivemap_fragment:vo,emissivemap_pars_fragment:Mo,colorspace_fragment:So,colorspace_pars_fragment:Eo,envmap_fragment:To,envmap_common_pars_fragment:yo,envmap_pars_fragment:Ao,envmap_pars_vertex:bo,envmap_physical_pars_fragment:Oo,envmap_vertex:wo,fog_vertex:Ro,fog_pars_vertex:Co,fog_fragment:Po,fog_pars_fragment:Lo,gradientmap_pars_fragment:Do,lightmap_pars_fragment:Uo,lights_lambert_fragment:Io,lights_lambert_pars_fragment:No,lights_pars_begin:Fo,lights_toon_fragment:Bo,lights_toon_pars_fragment:zo,lights_phong_fragment:Ho,lights_phong_pars_fragment:ko,lights_physical_fragment:Vo,lights_physical_pars_fragment:Go,lights_fragment_begin:Wo,lights_fragment_maps:Xo,lights_fragment_end:qo,logdepthbuf_fragment:Yo,logdepthbuf_pars_fragment:Ko,logdepthbuf_pars_vertex:Zo,logdepthbuf_vertex:$o,map_fragment:Jo,map_pars_fragment:jo,map_particle_fragment:Qo,map_particle_pars_fragment:e3,metalnessmap_fragment:t3,metalnessmap_pars_fragment:n3,morphinstance_vertex:i3,morphcolor_vertex:s3,morphnormal_vertex:r3,morphtarget_pars_vertex:a3,morphtarget_vertex:o3,normal_fragment_begin:l3,normal_fragment_maps:c3,normal_pars_fragment:u3,normal_pars_vertex:h3,normal_vertex:f3,normalmap_pars_fragment:d3,clearcoat_normal_fragment_begin:p3,clearcoat_normal_fragment_maps:m3,clearcoat_pars_fragment:_3,iridescence_pars_fragment:g3,opaque_fragment:x3,packing:v3,premultiplied_alpha_fragment:M3,project_vertex:S3,dithering_fragment:E3,dithering_pars_fragment:T3,roughnessmap_fragment:y3,roughnessmap_pars_fragment:A3,shadowmap_pars_fragment:b3,shadowmap_pars_vertex:w3,shadowmap_vertex:R3,shadowmask_pars_fragment:C3,skinbase_vertex:P3,skinning_pars_vertex:L3,skinning_vertex:D3,skinnormal_vertex:U3,specularmap_fragment:I3,specularmap_pars_fragment:N3,tonemapping_fragment:F3,tonemapping_pars_fragment:O3,transmission_fragment:B3,transmission_pars_fragment:z3,uv_pars_fragment:H3,uv_pars_vertex:k3,uv_vertex:V3,worldpos_vertex:G3,background_vert:W3,background_frag:X3,backgroundCube_vert:q3,backgroundCube_frag:Y3,cube_vert:K3,cube_frag:Z3,depth_vert:$3,depth_frag:J3,distanceRGBA_vert:j3,distanceRGBA_frag:Q3,equirect_vert:e4,equirect_frag:t4,linedashed_vert:n4,linedashed_frag:i4,meshbasic_vert:s4,meshbasic_frag:r4,meshlambert_vert:a4,meshlambert_frag:o4,meshmatcap_vert:l4,meshmatcap_frag:c4,meshnormal_vert:u4,meshnormal_frag:h4,meshphong_vert:f4,meshphong_frag:d4,meshphysical_vert:p4,meshphysical_frag:m4,meshtoon_vert:_4,meshtoon_frag:g4,points_vert:x4,points_frag:v4,shadow_vert:M4,shadow_frag:S4,sprite_vert:E4,sprite_frag:T4},i0={common:{diffuse:{value:new O0(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new I0},alphaMap:{value:null},alphaMapTransform:{value:new I0},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new I0}},envmap:{envMap:{value:null},envMapRotation:{value:new I0},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new I0}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new I0}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new I0},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new I0},normalScale:{value:new B0(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new I0},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new I0}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new I0}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new I0}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new O0(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new O0(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new I0},alphaTest:{value:0},uvTransform:{value:new I0}},sprite:{diffuse:{value:new O0(16777215)},opacity:{value:1},center:{value:new B0(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new I0},alphaMap:{value:null},alphaMapTransform:{value:new I0},alphaTest:{value:0}}},$e={basic:{uniforms:Te([i0.common,i0.specularmap,i0.envmap,i0.aomap,i0.lightmap,i0.fog]),vertexShader:F0.meshbasic_vert,fragmentShader:F0.meshbasic_frag},lambert:{uniforms:Te([i0.common,i0.specularmap,i0.envmap,i0.aomap,i0.lightmap,i0.emissivemap,i0.bumpmap,i0.normalmap,i0.displacementmap,i0.fog,i0.lights,{emissive:{value:new O0(0)}}]),vertexShader:F0.meshlambert_vert,fragmentShader:F0.meshlambert_frag},phong:{uniforms:Te([i0.common,i0.specularmap,i0.envmap,i0.aomap,i0.lightmap,i0.emissivemap,i0.bumpmap,i0.normalmap,i0.displacementmap,i0.fog,i0.lights,{emissive:{value:new O0(0)},specular:{value:new O0(1118481)},shininess:{value:30}}]),vertexShader:F0.meshphong_vert,fragmentShader:F0.meshphong_frag},standard:{uniforms:Te([i0.common,i0.envmap,i0.aomap,i0.lightmap,i0.emissivemap,i0.bumpmap,i0.normalmap,i0.displacementmap,i0.roughnessmap,i0.metalnessmap,i0.fog,i0.lights,{emissive:{value:new O0(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:F0.meshphysical_vert,fragmentShader:F0.meshphysical_frag},toon:{uniforms:Te([i0.common,i0.aomap,i0.lightmap,i0.emissivemap,i0.bumpmap,i0.normalmap,i0.displacementmap,i0.gradientmap,i0.fog,i0.lights,{emissive:{value:new O0(0)}}]),vertexShader:F0.meshtoon_vert,fragmentShader:F0.meshtoon_frag},matcap:{uniforms:Te([i0.common,i0.bumpmap,i0.normalmap,i0.displacementmap,i0.fog,{matcap:{value:null}}]),vertexShader:F0.meshmatcap_vert,fragmentShader:F0.meshmatcap_frag},points:{uniforms:Te([i0.points,i0.fog]),vertexShader:F0.points_vert,fragmentShader:F0.points_frag},dashed:{uniforms:Te([i0.common,i0.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:F0.linedashed_vert,fragmentShader:F0.linedashed_frag},depth:{uniforms:Te([i0.common,i0.displacementmap]),vertexShader:F0.depth_vert,fragmentShader:F0.depth_frag},normal:{uniforms:Te([i0.common,i0.bumpmap,i0.normalmap,i0.displacementmap,{opacity:{value:1}}]),vertexShader:F0.meshnormal_vert,fragmentShader:F0.meshnormal_frag},sprite:{uniforms:Te([i0.sprite,i0.fog]),vertexShader:F0.sprite_vert,fragmentShader:F0.sprite_frag},background:{uniforms:{uvTransform:{value:new I0},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:F0.background_vert,fragmentShader:F0.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new I0}},vertexShader:F0.backgroundCube_vert,fragmentShader:F0.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:F0.cube_vert,fragmentShader:F0.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:F0.equirect_vert,fragmentShader:F0.equirect_frag},distanceRGBA:{uniforms:Te([i0.common,i0.displacementmap,{referencePosition:{value:new O},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:F0.distanceRGBA_vert,fragmentShader:F0.distanceRGBA_frag},shadow:{uniforms:Te([i0.lights,i0.fog,{color:{value:new O0(0)},opacity:{value:1}}]),vertexShader:F0.shadow_vert,fragmentShader:F0.shadow_frag}};$e.physical={uniforms:Te([$e.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new I0},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new I0},clearcoatNormalScale:{value:new B0(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new I0},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new I0},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new I0},sheen:{value:0},sheenColor:{value:new O0(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new I0},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new I0},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new I0},transmissionSamplerSize:{value:new B0},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new I0},attenuationDistance:{value:0},attenuationColor:{value:new O0(0)},specularColor:{value:new O0(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new I0},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new I0},anisotropyVector:{value:new B0},anisotropyMap:{value:null},anisotropyMapTransform:{value:new I0}}]),vertexShader:F0.meshphysical_vert,fragmentShader:F0.meshphysical_frag};const vi={r:0,b:0,g:0},Lt=new He,y4=new ce;function A4(i,e,t,n,s,r,a){const o=new O0(0);let l=r===!0?0:1,c,u,h=null,f=0,m=null;function g(y){let S=y.isScene===!0?y.background:null;return S&&S.isTexture&&(S=(y.backgroundBlurriness>0?t:e).get(S)),S}function M(y){let S=!1;const I=g(y);I===null?d(o,l):I&&I.isColor&&(d(I,1),S=!0);const L=i.xr.getEnvironmentBlendMode();L==="additive"?n.buffers.color.setClear(0,0,0,1,a):L==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||S)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function p(y,S){const I=g(S);I&&(I.isCubeTexture||I.mapping===Bi)?(u===void 0&&(u=new we(new kt(1,1,1),new Pe({name:"BackgroundCubeMaterial",uniforms:xn($e.backgroundCube.uniforms),vertexShader:$e.backgroundCube.vertexShader,fragmentShader:$e.backgroundCube.fragmentShader,side:Le,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(L,R,N){this.matrixWorld.copyPosition(N.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),Lt.copy(S.backgroundRotation),Lt.x*=-1,Lt.y*=-1,Lt.z*=-1,I.isCubeTexture&&I.isRenderTargetTexture===!1&&(Lt.y*=-1,Lt.z*=-1),u.material.uniforms.envMap.value=I,u.material.uniforms.flipEnvMap.value=I.isCubeTexture&&I.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(y4.makeRotationFromEuler(Lt)),u.material.toneMapped=W0.getTransfer(I.colorSpace)!==J0,(h!==I||f!==I.version||m!==i.toneMapping)&&(u.material.needsUpdate=!0,h=I,f=I.version,m=i.toneMapping),u.layers.enableAll(),y.unshift(u,u.geometry,u.material,0,0,null)):I&&I.isTexture&&(c===void 0&&(c=new we(new Vt(2,2),new Pe({name:"BackgroundMaterial",uniforms:xn($e.background.uniforms),vertexShader:$e.background.vertexShader,fragmentShader:$e.background.fragmentShader,side:Tt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=I,c.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,c.material.toneMapped=W0.getTransfer(I.colorSpace)!==J0,I.matrixAutoUpdate===!0&&I.updateMatrix(),c.material.uniforms.uvTransform.value.copy(I.matrix),(h!==I||f!==I.version||m!==i.toneMapping)&&(c.material.needsUpdate=!0,h=I,f=I.version,m=i.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null))}function d(y,S){y.getRGB(vi,hr(i)),n.buffers.color.setClear(vi.r,vi.g,vi.b,S,a)}function b(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(y,S=1){o.set(y),l=S,d(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(y){l=y,d(o,l)},render:M,addToRenderList:p,dispose:b}}function b4(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null);let r=s,a=!1;function o(v,P,W,H,Z){let $=!1;const q=h(H,W,P);r!==q&&(r=q,c(r.object)),$=m(v,H,W,Z),$&&g(v,H,W,Z),Z!==null&&e.update(Z,i.ELEMENT_ARRAY_BUFFER),($||a)&&(a=!1,S(v,P,W,H),Z!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(Z).buffer))}function l(){return i.createVertexArray()}function c(v){return i.bindVertexArray(v)}function u(v){return i.deleteVertexArray(v)}function h(v,P,W){const H=W.wireframe===!0;let Z=n[v.id];Z===void 0&&(Z={},n[v.id]=Z);let $=Z[P.id];$===void 0&&($={},Z[P.id]=$);let q=$[H];return q===void 0&&(q=f(l()),$[H]=q),q}function f(v){const P=[],W=[],H=[];for(let Z=0;Z<t;Z++)P[Z]=0,W[Z]=0,H[Z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:W,attributeDivisors:H,object:v,attributes:{},index:null}}function m(v,P,W,H){const Z=r.attributes,$=P.attributes;let q=0;const j=W.getAttributes();for(const k in j)if(j[k].location>=0){const f0=Z[k];let T0=$[k];if(T0===void 0&&(k==="instanceMatrix"&&v.instanceMatrix&&(T0=v.instanceMatrix),k==="instanceColor"&&v.instanceColor&&(T0=v.instanceColor)),f0===void 0||f0.attribute!==T0||T0&&f0.data!==T0.data)return!0;q++}return r.attributesNum!==q||r.index!==H}function g(v,P,W,H){const Z={},$=P.attributes;let q=0;const j=W.getAttributes();for(const k in j)if(j[k].location>=0){let f0=$[k];f0===void 0&&(k==="instanceMatrix"&&v.instanceMatrix&&(f0=v.instanceMatrix),k==="instanceColor"&&v.instanceColor&&(f0=v.instanceColor));const T0={};T0.attribute=f0,f0&&f0.data&&(T0.data=f0.data),Z[k]=T0,q++}r.attributes=Z,r.attributesNum=q,r.index=H}function M(){const v=r.newAttributes;for(let P=0,W=v.length;P<W;P++)v[P]=0}function p(v){d(v,0)}function d(v,P){const W=r.newAttributes,H=r.enabledAttributes,Z=r.attributeDivisors;W[v]=1,H[v]===0&&(i.enableVertexAttribArray(v),H[v]=1),Z[v]!==P&&(i.vertexAttribDivisor(v,P),Z[v]=P)}function b(){const v=r.newAttributes,P=r.enabledAttributes;for(let W=0,H=P.length;W<H;W++)P[W]!==v[W]&&(i.disableVertexAttribArray(W),P[W]=0)}function y(v,P,W,H,Z,$,q){q===!0?i.vertexAttribIPointer(v,P,W,Z,$):i.vertexAttribPointer(v,P,W,H,Z,$)}function S(v,P,W,H){M();const Z=H.attributes,$=W.getAttributes(),q=P.defaultAttributeValues;for(const j in $){const k=$[j];if(k.location>=0){let l0=Z[j];if(l0===void 0&&(j==="instanceMatrix"&&v.instanceMatrix&&(l0=v.instanceMatrix),j==="instanceColor"&&v.instanceColor&&(l0=v.instanceColor)),l0!==void 0){const f0=l0.normalized,T0=l0.itemSize,z0=e.get(l0);if(z0===void 0)continue;const j0=z0.buffer,X=z0.type,n0=z0.bytesPerElement,M0=X===i.INT||X===i.UNSIGNED_INT||l0.gpuType===hs;if(l0.isInterleavedBufferAttribute){const c0=l0.data,S0=c0.stride,X0=l0.offset;if(c0.isInstancedInterleavedBuffer){for(let R0=0;R0<k.locationSize;R0++)d(k.location+R0,c0.meshPerAttribute);v.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=c0.meshPerAttribute*c0.count)}else for(let R0=0;R0<k.locationSize;R0++)p(k.location+R0);i.bindBuffer(i.ARRAY_BUFFER,j0);for(let R0=0;R0<k.locationSize;R0++)y(k.location+R0,T0/k.locationSize,X,f0,S0*n0,(X0+T0/k.locationSize*R0)*n0,M0)}else{if(l0.isInstancedBufferAttribute){for(let c0=0;c0<k.locationSize;c0++)d(k.location+c0,l0.meshPerAttribute);v.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=l0.meshPerAttribute*l0.count)}else for(let c0=0;c0<k.locationSize;c0++)p(k.location+c0);i.bindBuffer(i.ARRAY_BUFFER,j0);for(let c0=0;c0<k.locationSize;c0++)y(k.location+c0,T0/k.locationSize,X,f0,T0*n0,T0/k.locationSize*c0*n0,M0)}}else if(q!==void 0){const f0=q[j];if(f0!==void 0)switch(f0.length){case 2:i.vertexAttrib2fv(k.location,f0);break;case 3:i.vertexAttrib3fv(k.location,f0);break;case 4:i.vertexAttrib4fv(k.location,f0);break;default:i.vertexAttrib1fv(k.location,f0)}}}}b()}function I(){N();for(const v in n){const P=n[v];for(const W in P){const H=P[W];for(const Z in H)u(H[Z].object),delete H[Z];delete P[W]}delete n[v]}}function L(v){if(n[v.id]===void 0)return;const P=n[v.id];for(const W in P){const H=P[W];for(const Z in H)u(H[Z].object),delete H[Z];delete P[W]}delete n[v.id]}function R(v){for(const P in n){const W=n[P];if(W[v.id]===void 0)continue;const H=W[v.id];for(const Z in H)u(H[Z].object),delete H[Z];delete W[v.id]}}function N(){E(),a=!0,r!==s&&(r=s,c(r.object))}function E(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:N,resetDefaultState:E,dispose:I,releaseStatesOfGeometry:L,releaseStatesOfProgram:R,initAttributes:M,enableAttribute:p,disableUnusedAttributes:b}}function w4(i,e,t){let n;function s(c){n=c}function r(c,u){i.drawArrays(n,c,u),t.update(u,n,1)}function a(c,u,h){h!==0&&(i.drawArraysInstanced(n,c,u,h),t.update(u,n,h))}function o(c,u,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,u,0,h);let m=0;for(let g=0;g<h;g++)m+=u[g];t.update(m,n,1)}function l(c,u,h,f){if(h===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<c.length;g++)a(c[g],u[g],f[g]);else{m.multiDrawArraysInstancedWEBGL(n,c,0,u,0,f,0,h);let g=0;for(let M=0;M<h;M++)g+=u[M]*f[M];t.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function R4(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(R){return!(R!==be&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){const N=R===Ke&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==ft&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==Ye&&!N)}function l(R){if(R==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const h=t.logarithmicDepthBuffer===!0,f=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),m=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),M=i.getParameter(i.MAX_TEXTURE_SIZE),p=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),d=i.getParameter(i.MAX_VERTEX_ATTRIBS),b=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),y=i.getParameter(i.MAX_VARYING_VECTORS),S=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),I=g>0,L=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:h,reverseDepthBuffer:f,maxTextures:m,maxVertexTextures:g,maxTextureSize:M,maxCubemapSize:p,maxAttributes:d,maxVertexUniforms:b,maxVaryings:y,maxFragmentUniforms:S,vertexTextures:I,maxSamples:L}}function C4(i){const e=this;let t=null,n=0,s=!1,r=!1;const a=new It,o=new I0,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,f){const m=h.length!==0||f||n!==0||s;return s=f,n=h.length,m},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,f){t=u(h,f,0)},this.setState=function(h,f,m){const g=h.clippingPlanes,M=h.clipIntersection,p=h.clipShadows,d=i.get(h);if(!s||g===null||g.length===0||r&&!p)r?u(null):c();else{const b=r?0:n,y=b*4;let S=d.clippingState||null;l.value=S,S=u(g,f,y,m);for(let I=0;I!==y;++I)S[I]=t[I];d.clippingState=S,this.numIntersection=M?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(h,f,m,g){const M=h!==null?h.length:0;let p=null;if(M!==0){if(p=l.value,g!==!0||p===null){const d=m+M*4,b=f.matrixWorldInverse;o.getNormalMatrix(b),(p===null||p.length<d)&&(p=new Float32Array(d));for(let y=0,S=m;y!==M;++y,S+=4)a.copy(h[y]).applyMatrix4(b,o),a.normal.toArray(p,S),p[S+3]=a.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=M,e.numIntersection=0,p}}function P4(i){let e=new WeakMap;function t(a,o){return o===L1?a.mapping=mn:o===D1&&(a.mapping=_n),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===L1||o===D1)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new b2(l.height);return c.fromEquirectangularTexture(i,a),e.set(a,c),a.addEventListener("dispose",s),t(c.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}const ln=4,u9=[.125,.215,.35,.446,.526,.582],Ot=20,h1=new gr,h9=new O0;let f1=null,d1=0,p1=0,m1=!1;const Nt=(1+Math.sqrt(5))/2,sn=1/Nt,f9=[new O(-Nt,sn,0),new O(Nt,sn,0),new O(-sn,0,Nt),new O(sn,0,Nt),new O(0,Nt,-sn),new O(0,Nt,sn),new O(-1,1,-1),new O(1,1,-1),new O(-1,1,1),new O(1,1,1)],L4=new O;class d9{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100,r={}){const{size:a=256,position:o=L4}=r;f1=this._renderer.getRenderTarget(),d1=this._renderer.getActiveCubeFace(),p1=this._renderer.getActiveMipmapLevel(),m1=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=_9(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=m9(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(f1,d1,p1),this._renderer.xr.enabled=m1,e.scissorTest=!1,Mi(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===mn||e.mapping===_n?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),f1=this._renderer.getRenderTarget(),d1=this._renderer.getActiveCubeFace(),p1=this._renderer.getActiveMipmapLevel(),m1=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:ve,minFilter:ve,generateMipmaps:!1,type:Ke,format:be,colorSpace:gn,depthBuffer:!1},s=p9(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=p9(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=D4(r)),this._blurMaterial=U4(r,e,t)}return s}_compileMaterial(e){const t=new we(this._lodPlanes[0],e);this._renderer.compile(t,h1)}_sceneToCubeUV(e,t,n,s,r){const l=new Be(90,1,t,n),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,m=h.toneMapping;h.getClearColor(h9),h.toneMapping=Et,h.autoClear=!1;const g=new dn({name:"PMREM.Background",side:Le,depthWrite:!1,depthTest:!1}),M=new we(new kt,g);let p=!1;const d=e.background;d?d.isColor&&(g.color.copy(d),e.background=null,p=!0):(g.color.copy(h9),p=!0);for(let b=0;b<6;b++){const y=b%3;y===0?(l.up.set(0,c[b],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+u[b],r.y,r.z)):y===1?(l.up.set(0,0,c[b]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+u[b],r.z)):(l.up.set(0,c[b],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+u[b]));const S=this._cubeSize;Mi(s,y*S,b>2?S:0,S,S),h.setRenderTarget(s),p&&h.render(M,l),h.render(e,l)}M.geometry.dispose(),M.material.dispose(),h.toneMapping=m,h.autoClear=f,e.background=d}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===mn||e.mapping===_n;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=_9()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=m9());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new we(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;Mi(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,h1)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=f9[(s-r-1)%f9.length];this._blur(e,r-1,r,a,o)}t.autoClear=n}_blur(e,t,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new we(this._lodPlanes[s],c),f=c.uniforms,m=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*Ot-1),M=r/g,p=isFinite(r)?1+Math.floor(u*M):Ot;p>Ot&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Ot}`);const d=[];let b=0;for(let R=0;R<Ot;++R){const N=R/M,E=Math.exp(-N*N/2);d.push(E),R===0?b+=E:R<p&&(b+=2*E)}for(let R=0;R<d.length;R++)d[R]=d[R]/b;f.envMap.value=e.texture,f.samples.value=p,f.weights.value=d,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:y}=this;f.dTheta.value=g,f.mipInt.value=y-n;const S=this._sizeLods[s],I=3*S*(s>y-ln?s-y+ln:0),L=4*(this._cubeSize-S);Mi(t,I,L,3*S,2*S),l.setRenderTarget(t),l.render(h,h1)}}function D4(i){const e=[],t=[],n=[];let s=i;const r=i-ln+1+u9.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);t.push(o);let l=1/o;a>i-ln?l=u9[a-i+ln-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),u=-c,h=1+c,f=[u,u,h,u,h,h,u,u,h,h,u,h],m=6,g=6,M=3,p=2,d=1,b=new Float32Array(M*g*m),y=new Float32Array(p*g*m),S=new Float32Array(d*g*m);for(let L=0;L<m;L++){const R=L%3*2/3-1,N=L>2?0:-1,E=[R,N,0,R+2/3,N,0,R+2/3,N+1,0,R,N,0,R+2/3,N+1,0,R,N+1,0];b.set(E,M*g*L),y.set(f,p*g*L);const v=[L,L,L,L,L,L];S.set(v,d*g*L)}const I=new yt;I.setAttribute("position",new je(b,M)),I.setAttribute("uv",new je(y,p)),I.setAttribute("faceIndex",new je(S,d)),e.push(I),s>ln&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function p9(i,e,t){const n=new Ze(i,e,t);return n.texture.mapping=Bi,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Mi(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function U4(i,e,t){const n=new Float32Array(Ot),s=new O(0,1,0);return new Pe({name:"SphericalGaussianBlur",defines:{n:Ot,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Ts(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:ct,depthTest:!1,depthWrite:!1})}function m9(){return new Pe({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ts(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ct,depthTest:!1,depthWrite:!1})}function _9(){return new Pe({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ts(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ct,depthTest:!1,depthWrite:!1})}function Ts(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function I4(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===L1||l===D1,u=l===mn||l===_n;if(c||u){let h=e.get(o);const f=h!==void 0?h.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return t===null&&(t=new d9(i)),h=c?t.fromEquirectangular(o,h):t.fromCubemap(o,h),h.texture.pmremVersion=o.pmremVersion,e.set(o,h),h.texture;if(h!==void 0)return h.texture;{const m=o.image;return c&&m&&m.height>0||u&&m&&s(m)?(t===null&&(t=new d9(i)),h=c?t.fromEquirectangular(o):t.fromCubemap(o),h.texture.pmremVersion=o.pmremVersion,e.set(o,h),o.addEventListener("dispose",r),h.texture):null}}}return o}function s(o){let l=0;const c=6;for(let u=0;u<c;u++)o[u]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function N4(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&hn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function F4(i,e,t,n){const s={},r=new WeakMap;function a(h){const f=h.target;f.index!==null&&e.remove(f.index);for(const g in f.attributes)e.remove(f.attributes[g]);f.removeEventListener("dispose",a),delete s[f.id];const m=r.get(f);m&&(e.remove(m),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function o(h,f){return s[f.id]===!0||(f.addEventListener("dispose",a),s[f.id]=!0,t.memory.geometries++),f}function l(h){const f=h.attributes;for(const m in f)e.update(f[m],i.ARRAY_BUFFER)}function c(h){const f=[],m=h.index,g=h.attributes.position;let M=0;if(m!==null){const b=m.array;M=m.version;for(let y=0,S=b.length;y<S;y+=3){const I=b[y+0],L=b[y+1],R=b[y+2];f.push(I,L,L,R,R,I)}}else if(g!==void 0){const b=g.array;M=g.version;for(let y=0,S=b.length/3-1;y<S;y+=3){const I=y+0,L=y+1,R=y+2;f.push(I,L,L,R,R,I)}}else return;const p=new(rr(f)?ur:cr)(f,1);p.version=M;const d=r.get(h);d&&e.remove(d),r.set(h,p)}function u(h){const f=r.get(h);if(f){const m=h.index;m!==null&&f.version<m.version&&c(h)}else c(h);return r.get(h)}return{get:o,update:l,getWireframeAttribute:u}}function O4(i,e,t){let n;function s(f){n=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function l(f,m){i.drawElements(n,m,r,f*a),t.update(m,n,1)}function c(f,m,g){g!==0&&(i.drawElementsInstanced(n,m,r,f*a,g),t.update(m,n,g))}function u(f,m,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,m,0,r,f,0,g);let p=0;for(let d=0;d<g;d++)p+=m[d];t.update(p,n,1)}function h(f,m,g,M){if(g===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let d=0;d<f.length;d++)c(f[d]/a,m[d],M[d]);else{p.multiDrawElementsInstancedWEBGL(n,m,0,r,f,0,M,0,g);let d=0;for(let b=0;b<g;b++)d+=m[b]*M[b];t.update(d,n,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function B4(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function z4(i,e,t){const n=new WeakMap,s=new oe;function r(a,o,l){const c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=u!==void 0?u.length:0;let f=n.get(o);if(f===void 0||f.count!==h){let v=function(){N.dispose(),n.delete(o),o.removeEventListener("dispose",v)};var m=v;f!==void 0&&f.texture.dispose();const g=o.morphAttributes.position!==void 0,M=o.morphAttributes.normal!==void 0,p=o.morphAttributes.color!==void 0,d=o.morphAttributes.position||[],b=o.morphAttributes.normal||[],y=o.morphAttributes.color||[];let S=0;g===!0&&(S=1),M===!0&&(S=2),p===!0&&(S=3);let I=o.attributes.position.count*S,L=1;I>e.maxTextureSize&&(L=Math.ceil(I/e.maxTextureSize),I=e.maxTextureSize);const R=new Float32Array(I*L*4*h),N=new ar(R,I,L,h);N.type=Ye,N.needsUpdate=!0;const E=S*4;for(let P=0;P<h;P++){const W=d[P],H=b[P],Z=y[P],$=I*L*4*P;for(let q=0;q<W.count;q++){const j=q*E;g===!0&&(s.fromBufferAttribute(W,q),R[$+j+0]=s.x,R[$+j+1]=s.y,R[$+j+2]=s.z,R[$+j+3]=0),M===!0&&(s.fromBufferAttribute(H,q),R[$+j+4]=s.x,R[$+j+5]=s.y,R[$+j+6]=s.z,R[$+j+7]=0),p===!0&&(s.fromBufferAttribute(Z,q),R[$+j+8]=s.x,R[$+j+9]=s.y,R[$+j+10]=s.z,R[$+j+11]=Z.itemSize===4?s.w:1)}}f={count:h,texture:N,size:new B0(I,L)},n.set(o,f),o.addEventListener("dispose",v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let g=0;for(let p=0;p<c.length;p++)g+=c[p];const M=o.morphTargetsRelative?1:1-g;l.getUniforms().setValue(i,"morphTargetBaseInfluence",M),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:r}}function H4(i,e,t,n){let s=new WeakMap;function r(l){const c=n.render.frame,u=l.geometry,h=e.get(l,u);if(s.get(h)!==c&&(e.update(h),s.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;s.get(f)!==c&&(f.update(),s.set(f,c))}return h}function a(){s=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:a}}const Mr=new _e,g9=new mr(1,1),Sr=new ar,Er=new a2,Tr=new dr,x9=[],v9=[],M9=new Float32Array(16),S9=new Float32Array(9),E9=new Float32Array(4);function yn(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=x9[s];if(r===void 0&&(r=new Float32Array(s),x9[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function he(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function fe(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function zi(i,e){let t=v9[e];t===void 0&&(t=new Int32Array(e),v9[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function k4(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function V4(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(he(t,e))return;i.uniform2fv(this.addr,e),fe(t,e)}}function G4(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(he(t,e))return;i.uniform3fv(this.addr,e),fe(t,e)}}function W4(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(he(t,e))return;i.uniform4fv(this.addr,e),fe(t,e)}}function X4(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(he(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),fe(t,e)}else{if(he(t,n))return;E9.set(n),i.uniformMatrix2fv(this.addr,!1,E9),fe(t,n)}}function q4(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(he(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),fe(t,e)}else{if(he(t,n))return;S9.set(n),i.uniformMatrix3fv(this.addr,!1,S9),fe(t,n)}}function Y4(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(he(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),fe(t,e)}else{if(he(t,n))return;M9.set(n),i.uniformMatrix4fv(this.addr,!1,M9),fe(t,n)}}function K4(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Z4(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(he(t,e))return;i.uniform2iv(this.addr,e),fe(t,e)}}function $4(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(he(t,e))return;i.uniform3iv(this.addr,e),fe(t,e)}}function J4(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(he(t,e))return;i.uniform4iv(this.addr,e),fe(t,e)}}function j4(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Q4(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(he(t,e))return;i.uniform2uiv(this.addr,e),fe(t,e)}}function e5(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(he(t,e))return;i.uniform3uiv(this.addr,e),fe(t,e)}}function t5(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(he(t,e))return;i.uniform4uiv(this.addr,e),fe(t,e)}}function n5(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(g9.compareFunction=sr,r=g9):r=Mr,t.setTexture2D(e||r,s)}function i5(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Er,s)}function s5(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||Tr,s)}function r5(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||Sr,s)}function a5(i){switch(i){case 5126:return k4;case 35664:return V4;case 35665:return G4;case 35666:return W4;case 35674:return X4;case 35675:return q4;case 35676:return Y4;case 5124:case 35670:return K4;case 35667:case 35671:return Z4;case 35668:case 35672:return $4;case 35669:case 35673:return J4;case 5125:return j4;case 36294:return Q4;case 36295:return e5;case 36296:return t5;case 35678:case 36198:case 36298:case 36306:case 35682:return n5;case 35679:case 36299:case 36307:return i5;case 35680:case 36300:case 36308:case 36293:return s5;case 36289:case 36303:case 36311:case 36292:return r5}}function o5(i,e){i.uniform1fv(this.addr,e)}function l5(i,e){const t=yn(e,this.size,2);i.uniform2fv(this.addr,t)}function c5(i,e){const t=yn(e,this.size,3);i.uniform3fv(this.addr,t)}function u5(i,e){const t=yn(e,this.size,4);i.uniform4fv(this.addr,t)}function h5(i,e){const t=yn(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function f5(i,e){const t=yn(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function d5(i,e){const t=yn(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function p5(i,e){i.uniform1iv(this.addr,e)}function m5(i,e){i.uniform2iv(this.addr,e)}function _5(i,e){i.uniform3iv(this.addr,e)}function g5(i,e){i.uniform4iv(this.addr,e)}function x5(i,e){i.uniform1uiv(this.addr,e)}function v5(i,e){i.uniform2uiv(this.addr,e)}function M5(i,e){i.uniform3uiv(this.addr,e)}function S5(i,e){i.uniform4uiv(this.addr,e)}function E5(i,e,t){const n=this.cache,s=e.length,r=zi(t,s);he(n,r)||(i.uniform1iv(this.addr,r),fe(n,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||Mr,r[a])}function T5(i,e,t){const n=this.cache,s=e.length,r=zi(t,s);he(n,r)||(i.uniform1iv(this.addr,r),fe(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Er,r[a])}function y5(i,e,t){const n=this.cache,s=e.length,r=zi(t,s);he(n,r)||(i.uniform1iv(this.addr,r),fe(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||Tr,r[a])}function A5(i,e,t){const n=this.cache,s=e.length,r=zi(t,s);he(n,r)||(i.uniform1iv(this.addr,r),fe(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Sr,r[a])}function b5(i){switch(i){case 5126:return o5;case 35664:return l5;case 35665:return c5;case 35666:return u5;case 35674:return h5;case 35675:return f5;case 35676:return d5;case 5124:case 35670:return p5;case 35667:case 35671:return m5;case 35668:case 35672:return _5;case 35669:case 35673:return g5;case 5125:return x5;case 36294:return v5;case 36295:return M5;case 36296:return S5;case 35678:case 36198:case 36298:case 36306:case 35682:return E5;case 35679:case 36299:case 36307:return T5;case 35680:case 36300:case 36308:case 36293:return y5;case 36289:case 36303:case 36311:case 36292:return A5}}class w5{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=a5(t.type)}}class R5{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=b5(t.type)}}class C5{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],n)}}}const _1=/(\w+)(\])?(\[|\.)?/g;function T9(i,e){i.seq.push(e),i.map[e.id]=e}function P5(i,e,t){const n=i.name,s=n.length;for(_1.lastIndex=0;;){const r=_1.exec(n),a=_1.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){T9(t,c===void 0?new w5(o,i,e):new R5(o,i,e));break}else{let h=t.map[o];h===void 0&&(h=new C5(o),T9(t,h)),t=h}}}class Pi{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);P5(r,a,this)}}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&n.push(a)}return n}}function y9(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const L5=37297;let D5=0;function U5(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const A9=new I0;function I5(i){W0._getMatrix(A9,W0.workingColorSpace,i);const e=`mat3( ${A9.elements.map(t=>t.toFixed(4))} )`;switch(W0.getTransfer(i)){case Ui:return[e,"LinearTransferOETF"];case J0:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function b9(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),s=i.getShaderInfoLog(e).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const a=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+U5(i.getShaderSource(e),a)}else return s}function N5(i,e){const t=I5(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function F5(i,e){let t;switch(e){case xa:t="Linear";break;case va:t="Reinhard";break;case Ma:t="Cineon";break;case K9:t="ACESFilmic";break;case Ea:t="AgX";break;case Ta:t="Neutral";break;case Sa:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Si=new O;function O5(){W0.getLuminanceCoefficients(Si);const i=Si.x.toFixed(4),e=Si.y.toFixed(4),t=Si.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function B5(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(In).join(`
`)}function z5(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function H5(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function In(i){return i!==""}function w9(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function R9(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const k5=/^[ \t]*#include +<([\w\d./]+)>/gm;function as(i){return i.replace(k5,G5)}const V5=new Map;function G5(i,e){let t=F0[e];if(t===void 0){const n=V5.get(e);if(n!==void 0)t=F0[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return as(t)}const W5=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function C9(i){return i.replace(W5,X5)}function X5(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function P9(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function q5(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===q9?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===Jr?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===at&&(e="SHADOWMAP_TYPE_VSM"),e}function Y5(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case mn:case _n:e="ENVMAP_TYPE_CUBE";break;case Bi:e="ENVMAP_TYPE_CUBE_UV";break}return e}function K5(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case _n:e="ENVMAP_MODE_REFRACTION";break}return e}function Z5(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Y9:e="ENVMAP_BLENDING_MULTIPLY";break;case _a:e="ENVMAP_BLENDING_MIX";break;case ga:e="ENVMAP_BLENDING_ADD";break}return e}function $5(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function J5(i,e,t,n){const s=i.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=q5(t),c=Y5(t),u=K5(t),h=Z5(t),f=$5(t),m=B5(t),g=z5(r),M=s.createProgram();let p,d,b=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(In).join(`
`),p.length>0&&(p+=`
`),d=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(In).join(`
`),d.length>0&&(d+=`
`)):(p=[P9(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(In).join(`
`),d=[P9(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Et?"#define TONE_MAPPING":"",t.toneMapping!==Et?F0.tonemapping_pars_fragment:"",t.toneMapping!==Et?F5("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",F0.colorspace_pars_fragment,N5("linearToOutputTexel",t.outputColorSpace),O5(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(In).join(`
`)),a=as(a),a=w9(a,t),a=R9(a,t),o=as(o),o=w9(o,t),o=R9(o,t),a=C9(a),o=C9(o),t.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,p=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,d=["#define varying in",t.glslVersion===ks?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===ks?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);const y=b+p+a,S=b+d+o,I=y9(s,s.VERTEX_SHADER,y),L=y9(s,s.FRAGMENT_SHADER,S);s.attachShader(M,I),s.attachShader(M,L),t.index0AttributeName!==void 0?s.bindAttribLocation(M,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(M,0,"position"),s.linkProgram(M);function R(P){if(i.debug.checkShaderErrors){const W=s.getProgramInfoLog(M).trim(),H=s.getShaderInfoLog(I).trim(),Z=s.getShaderInfoLog(L).trim();let $=!0,q=!0;if(s.getProgramParameter(M,s.LINK_STATUS)===!1)if($=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,M,I,L);else{const j=b9(s,I,"vertex"),k=b9(s,L,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(M,s.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+W+`
`+j+`
`+k)}else W!==""?console.warn("THREE.WebGLProgram: Program Info Log:",W):(H===""||Z==="")&&(q=!1);q&&(P.diagnostics={runnable:$,programLog:W,vertexShader:{log:H,prefix:p},fragmentShader:{log:Z,prefix:d}})}s.deleteShader(I),s.deleteShader(L),N=new Pi(s,M),E=H5(s,M)}let N;this.getUniforms=function(){return N===void 0&&R(this),N};let E;this.getAttributes=function(){return E===void 0&&R(this),E};let v=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return v===!1&&(v=s.getProgramParameter(M,L5)),v},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(M),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=D5++,this.cacheKey=e,this.usedTimes=1,this.program=M,this.vertexShader=I,this.fragmentShader=L,this}let j5=0;class Q5{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new e8(e),t.set(e,n)),n}}class e8{constructor(e){this.id=j5++,this.code=e,this.usedTimes=0}}function t8(i,e,t,n,s,r,a){const o=new or,l=new Q5,c=new Set,u=[],h=s.logarithmicDepthBuffer,f=s.vertexTextures;let m=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function M(E){return c.add(E),E===0?"uv":`uv${E}`}function p(E,v,P,W,H){const Z=W.fog,$=H.geometry,q=E.isMeshStandardMaterial?W.environment:null,j=(E.isMeshStandardMaterial?t:e).get(E.envMap||q),k=j&&j.mapping===Bi?j.image.height:null,l0=g[E.type];E.precision!==null&&(m=s.getMaxPrecision(E.precision),m!==E.precision&&console.warn("THREE.WebGLProgram.getParameters:",E.precision,"not supported, using",m,"instead."));const f0=$.morphAttributes.position||$.morphAttributes.normal||$.morphAttributes.color,T0=f0!==void 0?f0.length:0;let z0=0;$.morphAttributes.position!==void 0&&(z0=1),$.morphAttributes.normal!==void 0&&(z0=2),$.morphAttributes.color!==void 0&&(z0=3);let j0,X,n0,M0;if(l0){const Z0=$e[l0];j0=Z0.vertexShader,X=Z0.fragmentShader}else j0=E.vertexShader,X=E.fragmentShader,l.update(E),n0=l.getVertexShaderID(E),M0=l.getFragmentShaderID(E);const c0=i.getRenderTarget(),S0=i.state.buffers.depth.getReversed(),X0=H.isInstancedMesh===!0,R0=H.isBatchedMesh===!0,ie=!!E.map,se=!!E.matcap,q0=!!j,w=!!E.aoMap,Me=!!E.lightMap,Y0=!!E.bumpMap,Q0=!!E.normalMap,g0=!!E.displacementMap,V0=!!E.emissiveMap,y0=!!E.metalnessMap,N0=!!E.roughnessMap,ue=E.anisotropy>0,T=E.clearcoat>0,_=E.dispersion>0,F=E.iridescence>0,G=E.sheen>0,K=E.transmission>0,V=ue&&!!E.anisotropyMap,x0=T&&!!E.clearcoatMap,r0=T&&!!E.clearcoatNormalMap,_0=T&&!!E.clearcoatRoughnessMap,v0=F&&!!E.iridescenceMap,J=F&&!!E.iridescenceThicknessMap,u0=G&&!!E.sheenColorMap,w0=G&&!!E.sheenRoughnessMap,b0=!!E.specularMap,s0=!!E.specularColorMap,L0=!!E.specularIntensityMap,C=K&&!!E.transmissionMap,a0=K&&!!E.thicknessMap,Q=!!E.gradientMap,d0=!!E.alphaMap,e0=E.alphaTest>0,Y=!!E.alphaHash,p0=!!E.extensions;let D0=Et;E.toneMapped&&(c0===null||c0.isXRRenderTarget===!0)&&(D0=i.toneMapping);const ee={shaderID:l0,shaderType:E.type,shaderName:E.name,vertexShader:j0,fragmentShader:X,defines:E.defines,customVertexShaderID:n0,customFragmentShaderID:M0,isRawShaderMaterial:E.isRawShaderMaterial===!0,glslVersion:E.glslVersion,precision:m,batching:R0,batchingColor:R0&&H._colorsTexture!==null,instancing:X0,instancingColor:X0&&H.instanceColor!==null,instancingMorph:X0&&H.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:c0===null?i.outputColorSpace:c0.isXRRenderTarget===!0?c0.texture.colorSpace:gn,alphaToCoverage:!!E.alphaToCoverage,map:ie,matcap:se,envMap:q0,envMapMode:q0&&j.mapping,envMapCubeUVHeight:k,aoMap:w,lightMap:Me,bumpMap:Y0,normalMap:Q0,displacementMap:f&&g0,emissiveMap:V0,normalMapObjectSpace:Q0&&E.normalMapType===wa,normalMapTangentSpace:Q0&&E.normalMapType===ir,metalnessMap:y0,roughnessMap:N0,anisotropy:ue,anisotropyMap:V,clearcoat:T,clearcoatMap:x0,clearcoatNormalMap:r0,clearcoatRoughnessMap:_0,dispersion:_,iridescence:F,iridescenceMap:v0,iridescenceThicknessMap:J,sheen:G,sheenColorMap:u0,sheenRoughnessMap:w0,specularMap:b0,specularColorMap:s0,specularIntensityMap:L0,transmission:K,transmissionMap:C,thicknessMap:a0,gradientMap:Q,opaque:E.transparent===!1&&E.blending===un&&E.alphaToCoverage===!1,alphaMap:d0,alphaTest:e0,alphaHash:Y,combine:E.combine,mapUv:ie&&M(E.map.channel),aoMapUv:w&&M(E.aoMap.channel),lightMapUv:Me&&M(E.lightMap.channel),bumpMapUv:Y0&&M(E.bumpMap.channel),normalMapUv:Q0&&M(E.normalMap.channel),displacementMapUv:g0&&M(E.displacementMap.channel),emissiveMapUv:V0&&M(E.emissiveMap.channel),metalnessMapUv:y0&&M(E.metalnessMap.channel),roughnessMapUv:N0&&M(E.roughnessMap.channel),anisotropyMapUv:V&&M(E.anisotropyMap.channel),clearcoatMapUv:x0&&M(E.clearcoatMap.channel),clearcoatNormalMapUv:r0&&M(E.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:_0&&M(E.clearcoatRoughnessMap.channel),iridescenceMapUv:v0&&M(E.iridescenceMap.channel),iridescenceThicknessMapUv:J&&M(E.iridescenceThicknessMap.channel),sheenColorMapUv:u0&&M(E.sheenColorMap.channel),sheenRoughnessMapUv:w0&&M(E.sheenRoughnessMap.channel),specularMapUv:b0&&M(E.specularMap.channel),specularColorMapUv:s0&&M(E.specularColorMap.channel),specularIntensityMapUv:L0&&M(E.specularIntensityMap.channel),transmissionMapUv:C&&M(E.transmissionMap.channel),thicknessMapUv:a0&&M(E.thicknessMap.channel),alphaMapUv:d0&&M(E.alphaMap.channel),vertexTangents:!!$.attributes.tangent&&(Q0||ue),vertexColors:E.vertexColors,vertexAlphas:E.vertexColors===!0&&!!$.attributes.color&&$.attributes.color.itemSize===4,pointsUvs:H.isPoints===!0&&!!$.attributes.uv&&(ie||d0),fog:!!Z,useFog:E.fog===!0,fogExp2:!!Z&&Z.isFogExp2,flatShading:E.flatShading===!0,sizeAttenuation:E.sizeAttenuation===!0,logarithmicDepthBuffer:h,reverseDepthBuffer:S0,skinning:H.isSkinnedMesh===!0,morphTargets:$.morphAttributes.position!==void 0,morphNormals:$.morphAttributes.normal!==void 0,morphColors:$.morphAttributes.color!==void 0,morphTargetsCount:T0,morphTextureStride:z0,numDirLights:v.directional.length,numPointLights:v.point.length,numSpotLights:v.spot.length,numSpotLightMaps:v.spotLightMap.length,numRectAreaLights:v.rectArea.length,numHemiLights:v.hemi.length,numDirLightShadows:v.directionalShadowMap.length,numPointLightShadows:v.pointShadowMap.length,numSpotLightShadows:v.spotShadowMap.length,numSpotLightShadowsWithMaps:v.numSpotLightShadowsWithMaps,numLightProbes:v.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:E.dithering,shadowMapEnabled:i.shadowMap.enabled&&P.length>0,shadowMapType:i.shadowMap.type,toneMapping:D0,decodeVideoTexture:ie&&E.map.isVideoTexture===!0&&W0.getTransfer(E.map.colorSpace)===J0,decodeVideoTextureEmissive:V0&&E.emissiveMap.isVideoTexture===!0&&W0.getTransfer(E.emissiveMap.colorSpace)===J0,premultipliedAlpha:E.premultipliedAlpha,doubleSided:E.side===Je,flipSided:E.side===Le,useDepthPacking:E.depthPacking>=0,depthPacking:E.depthPacking||0,index0AttributeName:E.index0AttributeName,extensionClipCullDistance:p0&&E.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(p0&&E.extensions.multiDraw===!0||R0)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:E.customProgramCacheKey()};return ee.vertexUv1s=c.has(1),ee.vertexUv2s=c.has(2),ee.vertexUv3s=c.has(3),c.clear(),ee}function d(E){const v=[];if(E.shaderID?v.push(E.shaderID):(v.push(E.customVertexShaderID),v.push(E.customFragmentShaderID)),E.defines!==void 0)for(const P in E.defines)v.push(P),v.push(E.defines[P]);return E.isRawShaderMaterial===!1&&(b(v,E),y(v,E),v.push(i.outputColorSpace)),v.push(E.customProgramCacheKey),v.join()}function b(E,v){E.push(v.precision),E.push(v.outputColorSpace),E.push(v.envMapMode),E.push(v.envMapCubeUVHeight),E.push(v.mapUv),E.push(v.alphaMapUv),E.push(v.lightMapUv),E.push(v.aoMapUv),E.push(v.bumpMapUv),E.push(v.normalMapUv),E.push(v.displacementMapUv),E.push(v.emissiveMapUv),E.push(v.metalnessMapUv),E.push(v.roughnessMapUv),E.push(v.anisotropyMapUv),E.push(v.clearcoatMapUv),E.push(v.clearcoatNormalMapUv),E.push(v.clearcoatRoughnessMapUv),E.push(v.iridescenceMapUv),E.push(v.iridescenceThicknessMapUv),E.push(v.sheenColorMapUv),E.push(v.sheenRoughnessMapUv),E.push(v.specularMapUv),E.push(v.specularColorMapUv),E.push(v.specularIntensityMapUv),E.push(v.transmissionMapUv),E.push(v.thicknessMapUv),E.push(v.combine),E.push(v.fogExp2),E.push(v.sizeAttenuation),E.push(v.morphTargetsCount),E.push(v.morphAttributeCount),E.push(v.numDirLights),E.push(v.numPointLights),E.push(v.numSpotLights),E.push(v.numSpotLightMaps),E.push(v.numHemiLights),E.push(v.numRectAreaLights),E.push(v.numDirLightShadows),E.push(v.numPointLightShadows),E.push(v.numSpotLightShadows),E.push(v.numSpotLightShadowsWithMaps),E.push(v.numLightProbes),E.push(v.shadowMapType),E.push(v.toneMapping),E.push(v.numClippingPlanes),E.push(v.numClipIntersection),E.push(v.depthPacking)}function y(E,v){o.disableAll(),v.supportsVertexTextures&&o.enable(0),v.instancing&&o.enable(1),v.instancingColor&&o.enable(2),v.instancingMorph&&o.enable(3),v.matcap&&o.enable(4),v.envMap&&o.enable(5),v.normalMapObjectSpace&&o.enable(6),v.normalMapTangentSpace&&o.enable(7),v.clearcoat&&o.enable(8),v.iridescence&&o.enable(9),v.alphaTest&&o.enable(10),v.vertexColors&&o.enable(11),v.vertexAlphas&&o.enable(12),v.vertexUv1s&&o.enable(13),v.vertexUv2s&&o.enable(14),v.vertexUv3s&&o.enable(15),v.vertexTangents&&o.enable(16),v.anisotropy&&o.enable(17),v.alphaHash&&o.enable(18),v.batching&&o.enable(19),v.dispersion&&o.enable(20),v.batchingColor&&o.enable(21),E.push(o.mask),o.disableAll(),v.fog&&o.enable(0),v.useFog&&o.enable(1),v.flatShading&&o.enable(2),v.logarithmicDepthBuffer&&o.enable(3),v.reverseDepthBuffer&&o.enable(4),v.skinning&&o.enable(5),v.morphTargets&&o.enable(6),v.morphNormals&&o.enable(7),v.morphColors&&o.enable(8),v.premultipliedAlpha&&o.enable(9),v.shadowMapEnabled&&o.enable(10),v.doubleSided&&o.enable(11),v.flipSided&&o.enable(12),v.useDepthPacking&&o.enable(13),v.dithering&&o.enable(14),v.transmission&&o.enable(15),v.sheen&&o.enable(16),v.opaque&&o.enable(17),v.pointsUvs&&o.enable(18),v.decodeVideoTexture&&o.enable(19),v.decodeVideoTextureEmissive&&o.enable(20),v.alphaToCoverage&&o.enable(21),E.push(o.mask)}function S(E){const v=g[E.type];let P;if(v){const W=$e[v];P=Ni.clone(W.uniforms)}else P=E.uniforms;return P}function I(E,v){let P;for(let W=0,H=u.length;W<H;W++){const Z=u[W];if(Z.cacheKey===v){P=Z,++P.usedTimes;break}}return P===void 0&&(P=new J5(i,v,E,r),u.push(P)),P}function L(E){if(--E.usedTimes===0){const v=u.indexOf(E);u[v]=u[u.length-1],u.pop(),E.destroy()}}function R(E){l.remove(E)}function N(){l.dispose()}return{getParameters:p,getProgramCacheKey:d,getUniforms:S,acquireProgram:I,releaseProgram:L,releaseShaderCache:R,programs:u,dispose:N}}function n8(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function i8(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function L9(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function D9(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(h,f,m,g,M,p){let d=i[e];return d===void 0?(d={id:h.id,object:h,geometry:f,material:m,groupOrder:g,renderOrder:h.renderOrder,z:M,group:p},i[e]=d):(d.id=h.id,d.object=h,d.geometry=f,d.material=m,d.groupOrder=g,d.renderOrder=h.renderOrder,d.z=M,d.group=p),e++,d}function o(h,f,m,g,M,p){const d=a(h,f,m,g,M,p);m.transmission>0?n.push(d):m.transparent===!0?s.push(d):t.push(d)}function l(h,f,m,g,M,p){const d=a(h,f,m,g,M,p);m.transmission>0?n.unshift(d):m.transparent===!0?s.unshift(d):t.unshift(d)}function c(h,f){t.length>1&&t.sort(h||i8),n.length>1&&n.sort(f||L9),s.length>1&&s.sort(f||L9)}function u(){for(let h=e,f=i.length;h<f;h++){const m=i[h];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:o,unshift:l,finish:u,sort:c}}function s8(){let i=new WeakMap;function e(n,s){const r=i.get(n);let a;return r===void 0?(a=new D9,i.set(n,[a])):s>=r.length?(a=new D9,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function r8(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new O,color:new O0};break;case"SpotLight":t={position:new O,direction:new O,color:new O0,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new O,color:new O0,distance:0,decay:0};break;case"HemisphereLight":t={direction:new O,skyColor:new O0,groundColor:new O0};break;case"RectAreaLight":t={color:new O0,position:new O,halfWidth:new O,halfHeight:new O};break}return i[e.id]=t,t}}}function a8(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new B0};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new B0};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new B0,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let o8=0;function l8(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function c8(i){const e=new r8,t=a8(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new O);const s=new O,r=new ce,a=new ce;function o(c){let u=0,h=0,f=0;for(let E=0;E<9;E++)n.probe[E].set(0,0,0);let m=0,g=0,M=0,p=0,d=0,b=0,y=0,S=0,I=0,L=0,R=0;c.sort(l8);for(let E=0,v=c.length;E<v;E++){const P=c[E],W=P.color,H=P.intensity,Z=P.distance,$=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)u+=W.r*H,h+=W.g*H,f+=W.b*H;else if(P.isLightProbe){for(let q=0;q<9;q++)n.probe[q].addScaledVector(P.sh.coefficients[q],H);R++}else if(P.isDirectionalLight){const q=e.get(P);if(q.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const j=P.shadow,k=t.get(P);k.shadowIntensity=j.intensity,k.shadowBias=j.bias,k.shadowNormalBias=j.normalBias,k.shadowRadius=j.radius,k.shadowMapSize=j.mapSize,n.directionalShadow[m]=k,n.directionalShadowMap[m]=$,n.directionalShadowMatrix[m]=P.shadow.matrix,b++}n.directional[m]=q,m++}else if(P.isSpotLight){const q=e.get(P);q.position.setFromMatrixPosition(P.matrixWorld),q.color.copy(W).multiplyScalar(H),q.distance=Z,q.coneCos=Math.cos(P.angle),q.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),q.decay=P.decay,n.spot[M]=q;const j=P.shadow;if(P.map&&(n.spotLightMap[I]=P.map,I++,j.updateMatrices(P),P.castShadow&&L++),n.spotLightMatrix[M]=j.matrix,P.castShadow){const k=t.get(P);k.shadowIntensity=j.intensity,k.shadowBias=j.bias,k.shadowNormalBias=j.normalBias,k.shadowRadius=j.radius,k.shadowMapSize=j.mapSize,n.spotShadow[M]=k,n.spotShadowMap[M]=$,S++}M++}else if(P.isRectAreaLight){const q=e.get(P);q.color.copy(W).multiplyScalar(H),q.halfWidth.set(P.width*.5,0,0),q.halfHeight.set(0,P.height*.5,0),n.rectArea[p]=q,p++}else if(P.isPointLight){const q=e.get(P);if(q.color.copy(P.color).multiplyScalar(P.intensity),q.distance=P.distance,q.decay=P.decay,P.castShadow){const j=P.shadow,k=t.get(P);k.shadowIntensity=j.intensity,k.shadowBias=j.bias,k.shadowNormalBias=j.normalBias,k.shadowRadius=j.radius,k.shadowMapSize=j.mapSize,k.shadowCameraNear=j.camera.near,k.shadowCameraFar=j.camera.far,n.pointShadow[g]=k,n.pointShadowMap[g]=$,n.pointShadowMatrix[g]=P.shadow.matrix,y++}n.point[g]=q,g++}else if(P.isHemisphereLight){const q=e.get(P);q.skyColor.copy(P.color).multiplyScalar(H),q.groundColor.copy(P.groundColor).multiplyScalar(H),n.hemi[d]=q,d++}}p>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=i0.LTC_FLOAT_1,n.rectAreaLTC2=i0.LTC_FLOAT_2):(n.rectAreaLTC1=i0.LTC_HALF_1,n.rectAreaLTC2=i0.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=h,n.ambient[2]=f;const N=n.hash;(N.directionalLength!==m||N.pointLength!==g||N.spotLength!==M||N.rectAreaLength!==p||N.hemiLength!==d||N.numDirectionalShadows!==b||N.numPointShadows!==y||N.numSpotShadows!==S||N.numSpotMaps!==I||N.numLightProbes!==R)&&(n.directional.length=m,n.spot.length=M,n.rectArea.length=p,n.point.length=g,n.hemi.length=d,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.pointShadow.length=y,n.pointShadowMap.length=y,n.spotShadow.length=S,n.spotShadowMap.length=S,n.directionalShadowMatrix.length=b,n.pointShadowMatrix.length=y,n.spotLightMatrix.length=S+I-L,n.spotLightMap.length=I,n.numSpotLightShadowsWithMaps=L,n.numLightProbes=R,N.directionalLength=m,N.pointLength=g,N.spotLength=M,N.rectAreaLength=p,N.hemiLength=d,N.numDirectionalShadows=b,N.numPointShadows=y,N.numSpotShadows=S,N.numSpotMaps=I,N.numLightProbes=R,n.version=o8++)}function l(c,u){let h=0,f=0,m=0,g=0,M=0;const p=u.matrixWorldInverse;for(let d=0,b=c.length;d<b;d++){const y=c[d];if(y.isDirectionalLight){const S=n.directional[h];S.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(p),h++}else if(y.isSpotLight){const S=n.spot[m];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(p),S.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(p),m++}else if(y.isRectAreaLight){const S=n.rectArea[g];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(p),a.identity(),r.copy(y.matrixWorld),r.premultiply(p),a.extractRotation(r),S.halfWidth.set(y.width*.5,0,0),S.halfHeight.set(0,y.height*.5,0),S.halfWidth.applyMatrix4(a),S.halfHeight.applyMatrix4(a),g++}else if(y.isPointLight){const S=n.point[f];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(p),f++}else if(y.isHemisphereLight){const S=n.hemi[M];S.direction.setFromMatrixPosition(y.matrixWorld),S.direction.transformDirection(p),M++}}}return{setup:o,setupView:l,state:n}}function U9(i){const e=new c8(i),t=[],n=[];function s(u){c.camera=u,t.length=0,n.length=0}function r(u){t.push(u)}function a(u){n.push(u)}function o(){e.setup(t)}function l(u){e.setupView(t,u)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function u8(i){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new U9(i),e.set(s,[o])):r>=a.length?(o=new U9(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const h8=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,f8=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function d8(i,e,t){let n=new pr;const s=new B0,r=new B0,a=new oe,o=new D2({depthPacking:ba}),l=new U2,c={},u=t.maxTextureSize,h={[Tt]:Le,[Le]:Tt,[Je]:Je},f=new Pe({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new B0},radius:{value:4}},vertexShader:h8,fragmentShader:f8}),m=f.clone();m.defines.HORIZONTAL_PASS=1;const g=new yt;g.setAttribute("position",new je(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const M=new we(g,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=q9;let d=this.type;this.render=function(L,R,N){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||L.length===0)return;const E=i.getRenderTarget(),v=i.getActiveCubeFace(),P=i.getActiveMipmapLevel(),W=i.state;W.setBlending(ct),W.buffers.color.setClear(1,1,1,1),W.buffers.depth.setTest(!0),W.setScissorTest(!1);const H=d!==at&&this.type===at,Z=d===at&&this.type!==at;for(let $=0,q=L.length;$<q;$++){const j=L[$],k=j.shadow;if(k===void 0){console.warn("THREE.WebGLShadowMap:",j,"has no shadow.");continue}if(k.autoUpdate===!1&&k.needsUpdate===!1)continue;s.copy(k.mapSize);const l0=k.getFrameExtents();if(s.multiply(l0),r.copy(k.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/l0.x),s.x=r.x*l0.x,k.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/l0.y),s.y=r.y*l0.y,k.mapSize.y=r.y)),k.map===null||H===!0||Z===!0){const T0=this.type!==at?{minFilter:me,magFilter:me}:{};k.map!==null&&k.map.dispose(),k.map=new Ze(s.x,s.y,T0),k.map.texture.name=j.name+".shadowMap",k.camera.updateProjectionMatrix()}i.setRenderTarget(k.map),i.clear();const f0=k.getViewportCount();for(let T0=0;T0<f0;T0++){const z0=k.getViewport(T0);a.set(r.x*z0.x,r.y*z0.y,r.x*z0.z,r.y*z0.w),W.viewport(a),k.updateMatrices(j,T0),n=k.getFrustum(),S(R,N,k.camera,j,this.type)}k.isPointLightShadow!==!0&&this.type===at&&b(k,N),k.needsUpdate=!1}d=this.type,p.needsUpdate=!1,i.setRenderTarget(E,v,P)};function b(L,R){const N=e.update(M);f.defines.VSM_SAMPLES!==L.blurSamples&&(f.defines.VSM_SAMPLES=L.blurSamples,m.defines.VSM_SAMPLES=L.blurSamples,f.needsUpdate=!0,m.needsUpdate=!0),L.mapPass===null&&(L.mapPass=new Ze(s.x,s.y)),f.uniforms.shadow_pass.value=L.map.texture,f.uniforms.resolution.value=L.mapSize,f.uniforms.radius.value=L.radius,i.setRenderTarget(L.mapPass),i.clear(),i.renderBufferDirect(R,null,N,f,M,null),m.uniforms.shadow_pass.value=L.mapPass.texture,m.uniforms.resolution.value=L.mapSize,m.uniforms.radius.value=L.radius,i.setRenderTarget(L.map),i.clear(),i.renderBufferDirect(R,null,N,m,M,null)}function y(L,R,N,E){let v=null;const P=N.isPointLight===!0?L.customDistanceMaterial:L.customDepthMaterial;if(P!==void 0)v=P;else if(v=N.isPointLight===!0?l:o,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){const W=v.uuid,H=R.uuid;let Z=c[W];Z===void 0&&(Z={},c[W]=Z);let $=Z[H];$===void 0&&($=v.clone(),Z[H]=$,R.addEventListener("dispose",I)),v=$}if(v.visible=R.visible,v.wireframe=R.wireframe,E===at?v.side=R.shadowSide!==null?R.shadowSide:R.side:v.side=R.shadowSide!==null?R.shadowSide:h[R.side],v.alphaMap=R.alphaMap,v.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,v.map=R.map,v.clipShadows=R.clipShadows,v.clippingPlanes=R.clippingPlanes,v.clipIntersection=R.clipIntersection,v.displacementMap=R.displacementMap,v.displacementScale=R.displacementScale,v.displacementBias=R.displacementBias,v.wireframeLinewidth=R.wireframeLinewidth,v.linewidth=R.linewidth,N.isPointLight===!0&&v.isMeshDistanceMaterial===!0){const W=i.properties.get(v);W.light=N}return v}function S(L,R,N,E,v){if(L.visible===!1)return;if(L.layers.test(R.layers)&&(L.isMesh||L.isLine||L.isPoints)&&(L.castShadow||L.receiveShadow&&v===at)&&(!L.frustumCulled||n.intersectsObject(L))){L.modelViewMatrix.multiplyMatrices(N.matrixWorldInverse,L.matrixWorld);const H=e.update(L),Z=L.material;if(Array.isArray(Z)){const $=H.groups;for(let q=0,j=$.length;q<j;q++){const k=$[q],l0=Z[k.materialIndex];if(l0&&l0.visible){const f0=y(L,l0,E,v);L.onBeforeShadow(i,L,R,N,H,f0,k),i.renderBufferDirect(N,null,H,f0,L,k),L.onAfterShadow(i,L,R,N,H,f0,k)}}}else if(Z.visible){const $=y(L,Z,E,v);L.onBeforeShadow(i,L,R,N,H,$,null),i.renderBufferDirect(N,null,H,$,L,null),L.onAfterShadow(i,L,R,N,H,$,null)}}const W=L.children;for(let H=0,Z=W.length;H<Z;H++)S(W[H],R,N,E,v)}function I(L){L.target.removeEventListener("dispose",I);for(const N in c){const E=c[N],v=L.target.uuid;v in E&&(E[v].dispose(),delete E[v])}}}const p8={[y1]:A1,[b1]:C1,[w1]:P1,[pn]:R1,[A1]:y1,[C1]:b1,[P1]:w1,[R1]:pn};function m8(i,e){function t(){let C=!1;const a0=new oe;let Q=null;const d0=new oe(0,0,0,0);return{setMask:function(e0){Q!==e0&&!C&&(i.colorMask(e0,e0,e0,e0),Q=e0)},setLocked:function(e0){C=e0},setClear:function(e0,Y,p0,D0,ee){ee===!0&&(e0*=D0,Y*=D0,p0*=D0),a0.set(e0,Y,p0,D0),d0.equals(a0)===!1&&(i.clearColor(e0,Y,p0,D0),d0.copy(a0))},reset:function(){C=!1,Q=null,d0.set(-1,0,0,0)}}}function n(){let C=!1,a0=!1,Q=null,d0=null,e0=null;return{setReversed:function(Y){if(a0!==Y){const p0=e.get("EXT_clip_control");Y?p0.clipControlEXT(p0.LOWER_LEFT_EXT,p0.ZERO_TO_ONE_EXT):p0.clipControlEXT(p0.LOWER_LEFT_EXT,p0.NEGATIVE_ONE_TO_ONE_EXT),a0=Y;const D0=e0;e0=null,this.setClear(D0)}},getReversed:function(){return a0},setTest:function(Y){Y?c0(i.DEPTH_TEST):S0(i.DEPTH_TEST)},setMask:function(Y){Q!==Y&&!C&&(i.depthMask(Y),Q=Y)},setFunc:function(Y){if(a0&&(Y=p8[Y]),d0!==Y){switch(Y){case y1:i.depthFunc(i.NEVER);break;case A1:i.depthFunc(i.ALWAYS);break;case b1:i.depthFunc(i.LESS);break;case pn:i.depthFunc(i.LEQUAL);break;case w1:i.depthFunc(i.EQUAL);break;case R1:i.depthFunc(i.GEQUAL);break;case C1:i.depthFunc(i.GREATER);break;case P1:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}d0=Y}},setLocked:function(Y){C=Y},setClear:function(Y){e0!==Y&&(a0&&(Y=1-Y),i.clearDepth(Y),e0=Y)},reset:function(){C=!1,Q=null,d0=null,e0=null,a0=!1}}}function s(){let C=!1,a0=null,Q=null,d0=null,e0=null,Y=null,p0=null,D0=null,ee=null;return{setTest:function(Z0){C||(Z0?c0(i.STENCIL_TEST):S0(i.STENCIL_TEST))},setMask:function(Z0){a0!==Z0&&!C&&(i.stencilMask(Z0),a0=Z0)},setFunc:function(Z0,ke,Qe){(Q!==Z0||d0!==ke||e0!==Qe)&&(i.stencilFunc(Z0,ke,Qe),Q=Z0,d0=ke,e0=Qe)},setOp:function(Z0,ke,Qe){(Y!==Z0||p0!==ke||D0!==Qe)&&(i.stencilOp(Z0,ke,Qe),Y=Z0,p0=ke,D0=Qe)},setLocked:function(Z0){C=Z0},setClear:function(Z0){ee!==Z0&&(i.clearStencil(Z0),ee=Z0)},reset:function(){C=!1,a0=null,Q=null,d0=null,e0=null,Y=null,p0=null,D0=null,ee=null}}}const r=new t,a=new n,o=new s,l=new WeakMap,c=new WeakMap;let u={},h={},f=new WeakMap,m=[],g=null,M=!1,p=null,d=null,b=null,y=null,S=null,I=null,L=null,R=new O0(0,0,0),N=0,E=!1,v=null,P=null,W=null,H=null,Z=null;const $=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let q=!1,j=0;const k=i.getParameter(i.VERSION);k.indexOf("WebGL")!==-1?(j=parseFloat(/^WebGL (\d)/.exec(k)[1]),q=j>=1):k.indexOf("OpenGL ES")!==-1&&(j=parseFloat(/^OpenGL ES (\d)/.exec(k)[1]),q=j>=2);let l0=null,f0={};const T0=i.getParameter(i.SCISSOR_BOX),z0=i.getParameter(i.VIEWPORT),j0=new oe().fromArray(T0),X=new oe().fromArray(z0);function n0(C,a0,Q,d0){const e0=new Uint8Array(4),Y=i.createTexture();i.bindTexture(C,Y),i.texParameteri(C,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(C,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let p0=0;p0<Q;p0++)C===i.TEXTURE_3D||C===i.TEXTURE_2D_ARRAY?i.texImage3D(a0,0,i.RGBA,1,1,d0,0,i.RGBA,i.UNSIGNED_BYTE,e0):i.texImage2D(a0+p0,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,e0);return Y}const M0={};M0[i.TEXTURE_2D]=n0(i.TEXTURE_2D,i.TEXTURE_2D,1),M0[i.TEXTURE_CUBE_MAP]=n0(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),M0[i.TEXTURE_2D_ARRAY]=n0(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),M0[i.TEXTURE_3D]=n0(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),c0(i.DEPTH_TEST),a.setFunc(pn),Y0(!1),Q0(Fs),c0(i.CULL_FACE),w(ct);function c0(C){u[C]!==!0&&(i.enable(C),u[C]=!0)}function S0(C){u[C]!==!1&&(i.disable(C),u[C]=!1)}function X0(C,a0){return h[C]!==a0?(i.bindFramebuffer(C,a0),h[C]=a0,C===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=a0),C===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=a0),!0):!1}function R0(C,a0){let Q=m,d0=!1;if(C){Q=f.get(a0),Q===void 0&&(Q=[],f.set(a0,Q));const e0=C.textures;if(Q.length!==e0.length||Q[0]!==i.COLOR_ATTACHMENT0){for(let Y=0,p0=e0.length;Y<p0;Y++)Q[Y]=i.COLOR_ATTACHMENT0+Y;Q.length=e0.length,d0=!0}}else Q[0]!==i.BACK&&(Q[0]=i.BACK,d0=!0);d0&&i.drawBuffers(Q)}function ie(C){return g!==C?(i.useProgram(C),g=C,!0):!1}const se={[Ft]:i.FUNC_ADD,[Qr]:i.FUNC_SUBTRACT,[ea]:i.FUNC_REVERSE_SUBTRACT};se[ta]=i.MIN,se[na]=i.MAX;const q0={[ia]:i.ZERO,[sa]:i.ONE,[ra]:i.SRC_COLOR,[E1]:i.SRC_ALPHA,[ha]:i.SRC_ALPHA_SATURATE,[ca]:i.DST_COLOR,[oa]:i.DST_ALPHA,[aa]:i.ONE_MINUS_SRC_COLOR,[T1]:i.ONE_MINUS_SRC_ALPHA,[ua]:i.ONE_MINUS_DST_COLOR,[la]:i.ONE_MINUS_DST_ALPHA,[fa]:i.CONSTANT_COLOR,[da]:i.ONE_MINUS_CONSTANT_COLOR,[pa]:i.CONSTANT_ALPHA,[ma]:i.ONE_MINUS_CONSTANT_ALPHA};function w(C,a0,Q,d0,e0,Y,p0,D0,ee,Z0){if(C===ct){M===!0&&(S0(i.BLEND),M=!1);return}if(M===!1&&(c0(i.BLEND),M=!0),C!==jr){if(C!==p||Z0!==E){if((d!==Ft||S!==Ft)&&(i.blendEquation(i.FUNC_ADD),d=Ft,S=Ft),Z0)switch(C){case un:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case S1:i.blendFunc(i.ONE,i.ONE);break;case Os:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Bs:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",C);break}else switch(C){case un:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case S1:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Os:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Bs:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",C);break}b=null,y=null,I=null,L=null,R.set(0,0,0),N=0,p=C,E=Z0}return}e0=e0||a0,Y=Y||Q,p0=p0||d0,(a0!==d||e0!==S)&&(i.blendEquationSeparate(se[a0],se[e0]),d=a0,S=e0),(Q!==b||d0!==y||Y!==I||p0!==L)&&(i.blendFuncSeparate(q0[Q],q0[d0],q0[Y],q0[p0]),b=Q,y=d0,I=Y,L=p0),(D0.equals(R)===!1||ee!==N)&&(i.blendColor(D0.r,D0.g,D0.b,ee),R.copy(D0),N=ee),p=C,E=!1}function Me(C,a0){C.side===Je?S0(i.CULL_FACE):c0(i.CULL_FACE);let Q=C.side===Le;a0&&(Q=!Q),Y0(Q),C.blending===un&&C.transparent===!1?w(ct):w(C.blending,C.blendEquation,C.blendSrc,C.blendDst,C.blendEquationAlpha,C.blendSrcAlpha,C.blendDstAlpha,C.blendColor,C.blendAlpha,C.premultipliedAlpha),a.setFunc(C.depthFunc),a.setTest(C.depthTest),a.setMask(C.depthWrite),r.setMask(C.colorWrite);const d0=C.stencilWrite;o.setTest(d0),d0&&(o.setMask(C.stencilWriteMask),o.setFunc(C.stencilFunc,C.stencilRef,C.stencilFuncMask),o.setOp(C.stencilFail,C.stencilZFail,C.stencilZPass)),V0(C.polygonOffset,C.polygonOffsetFactor,C.polygonOffsetUnits),C.alphaToCoverage===!0?c0(i.SAMPLE_ALPHA_TO_COVERAGE):S0(i.SAMPLE_ALPHA_TO_COVERAGE)}function Y0(C){v!==C&&(C?i.frontFace(i.CW):i.frontFace(i.CCW),v=C)}function Q0(C){C!==Zr?(c0(i.CULL_FACE),C!==P&&(C===Fs?i.cullFace(i.BACK):C===$r?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):S0(i.CULL_FACE),P=C}function g0(C){C!==W&&(q&&i.lineWidth(C),W=C)}function V0(C,a0,Q){C?(c0(i.POLYGON_OFFSET_FILL),(H!==a0||Z!==Q)&&(i.polygonOffset(a0,Q),H=a0,Z=Q)):S0(i.POLYGON_OFFSET_FILL)}function y0(C){C?c0(i.SCISSOR_TEST):S0(i.SCISSOR_TEST)}function N0(C){C===void 0&&(C=i.TEXTURE0+$-1),l0!==C&&(i.activeTexture(C),l0=C)}function ue(C,a0,Q){Q===void 0&&(l0===null?Q=i.TEXTURE0+$-1:Q=l0);let d0=f0[Q];d0===void 0&&(d0={type:void 0,texture:void 0},f0[Q]=d0),(d0.type!==C||d0.texture!==a0)&&(l0!==Q&&(i.activeTexture(Q),l0=Q),i.bindTexture(C,a0||M0[C]),d0.type=C,d0.texture=a0)}function T(){const C=f0[l0];C!==void 0&&C.type!==void 0&&(i.bindTexture(C.type,null),C.type=void 0,C.texture=void 0)}function _(){try{i.compressedTexImage2D(...arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function F(){try{i.compressedTexImage3D(...arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function G(){try{i.texSubImage2D(...arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function K(){try{i.texSubImage3D(...arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function V(){try{i.compressedTexSubImage2D(...arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function x0(){try{i.compressedTexSubImage3D(...arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function r0(){try{i.texStorage2D(...arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function _0(){try{i.texStorage3D(...arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function v0(){try{i.texImage2D(...arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function J(){try{i.texImage3D(...arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function u0(C){j0.equals(C)===!1&&(i.scissor(C.x,C.y,C.z,C.w),j0.copy(C))}function w0(C){X.equals(C)===!1&&(i.viewport(C.x,C.y,C.z,C.w),X.copy(C))}function b0(C,a0){let Q=c.get(a0);Q===void 0&&(Q=new WeakMap,c.set(a0,Q));let d0=Q.get(C);d0===void 0&&(d0=i.getUniformBlockIndex(a0,C.name),Q.set(C,d0))}function s0(C,a0){const d0=c.get(a0).get(C);l.get(a0)!==d0&&(i.uniformBlockBinding(a0,d0,C.__bindingPointIndex),l.set(a0,d0))}function L0(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},l0=null,f0={},h={},f=new WeakMap,m=[],g=null,M=!1,p=null,d=null,b=null,y=null,S=null,I=null,L=null,R=new O0(0,0,0),N=0,E=!1,v=null,P=null,W=null,H=null,Z=null,j0.set(0,0,i.canvas.width,i.canvas.height),X.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:c0,disable:S0,bindFramebuffer:X0,drawBuffers:R0,useProgram:ie,setBlending:w,setMaterial:Me,setFlipSided:Y0,setCullFace:Q0,setLineWidth:g0,setPolygonOffset:V0,setScissorTest:y0,activeTexture:N0,bindTexture:ue,unbindTexture:T,compressedTexImage2D:_,compressedTexImage3D:F,texImage2D:v0,texImage3D:J,updateUBOMapping:b0,uniformBlockBinding:s0,texStorage2D:r0,texStorage3D:_0,texSubImage2D:G,texSubImage3D:K,compressedTexSubImage2D:V,compressedTexSubImage3D:x0,scissor:u0,viewport:w0,reset:L0}}function _8(i,e,t,n,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new B0,u=new WeakMap;let h;const f=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(T,_){return m?new OffscreenCanvas(T,_):Xn("canvas")}function M(T,_,F){let G=1;const K=ue(T);if((K.width>F||K.height>F)&&(G=F/Math.max(K.width,K.height)),G<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){const V=Math.floor(G*K.width),x0=Math.floor(G*K.height);h===void 0&&(h=g(V,x0));const r0=_?g(V,x0):h;return r0.width=V,r0.height=x0,r0.getContext("2d").drawImage(T,0,0,V,x0),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+K.width+"x"+K.height+") to ("+V+"x"+x0+")."),r0}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+K.width+"x"+K.height+")."),T;return T}function p(T){return T.generateMipmaps}function d(T){i.generateMipmap(T)}function b(T){return T.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?i.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function y(T,_,F,G,K=!1){if(T!==null){if(i[T]!==void 0)return i[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let V=_;if(_===i.RED&&(F===i.FLOAT&&(V=i.R32F),F===i.HALF_FLOAT&&(V=i.R16F),F===i.UNSIGNED_BYTE&&(V=i.R8)),_===i.RED_INTEGER&&(F===i.UNSIGNED_BYTE&&(V=i.R8UI),F===i.UNSIGNED_SHORT&&(V=i.R16UI),F===i.UNSIGNED_INT&&(V=i.R32UI),F===i.BYTE&&(V=i.R8I),F===i.SHORT&&(V=i.R16I),F===i.INT&&(V=i.R32I)),_===i.RG&&(F===i.FLOAT&&(V=i.RG32F),F===i.HALF_FLOAT&&(V=i.RG16F),F===i.UNSIGNED_BYTE&&(V=i.RG8)),_===i.RG_INTEGER&&(F===i.UNSIGNED_BYTE&&(V=i.RG8UI),F===i.UNSIGNED_SHORT&&(V=i.RG16UI),F===i.UNSIGNED_INT&&(V=i.RG32UI),F===i.BYTE&&(V=i.RG8I),F===i.SHORT&&(V=i.RG16I),F===i.INT&&(V=i.RG32I)),_===i.RGB_INTEGER&&(F===i.UNSIGNED_BYTE&&(V=i.RGB8UI),F===i.UNSIGNED_SHORT&&(V=i.RGB16UI),F===i.UNSIGNED_INT&&(V=i.RGB32UI),F===i.BYTE&&(V=i.RGB8I),F===i.SHORT&&(V=i.RGB16I),F===i.INT&&(V=i.RGB32I)),_===i.RGBA_INTEGER&&(F===i.UNSIGNED_BYTE&&(V=i.RGBA8UI),F===i.UNSIGNED_SHORT&&(V=i.RGBA16UI),F===i.UNSIGNED_INT&&(V=i.RGBA32UI),F===i.BYTE&&(V=i.RGBA8I),F===i.SHORT&&(V=i.RGBA16I),F===i.INT&&(V=i.RGBA32I)),_===i.RGB&&F===i.UNSIGNED_INT_5_9_9_9_REV&&(V=i.RGB9_E5),_===i.RGBA){const x0=K?Ui:W0.getTransfer(G);F===i.FLOAT&&(V=i.RGBA32F),F===i.HALF_FLOAT&&(V=i.RGBA16F),F===i.UNSIGNED_BYTE&&(V=x0===J0?i.SRGB8_ALPHA8:i.RGBA8),F===i.UNSIGNED_SHORT_4_4_4_4&&(V=i.RGBA4),F===i.UNSIGNED_SHORT_5_5_5_1&&(V=i.RGB5_A1)}return(V===i.R16F||V===i.R32F||V===i.RG16F||V===i.RG32F||V===i.RGBA16F||V===i.RGBA32F)&&e.get("EXT_color_buffer_float"),V}function S(T,_){let F;return T?_===null||_===Ht||_===kn?F=i.DEPTH24_STENCIL8:_===Ye?F=i.DEPTH32F_STENCIL8:_===Hn&&(F=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===Ht||_===kn?F=i.DEPTH_COMPONENT24:_===Ye?F=i.DEPTH_COMPONENT32F:_===Hn&&(F=i.DEPTH_COMPONENT16),F}function I(T,_){return p(T)===!0||T.isFramebufferTexture&&T.minFilter!==me&&T.minFilter!==ve?Math.log2(Math.max(_.width,_.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?_.mipmaps.length:1}function L(T){const _=T.target;_.removeEventListener("dispose",L),N(_),_.isVideoTexture&&u.delete(_)}function R(T){const _=T.target;_.removeEventListener("dispose",R),v(_)}function N(T){const _=n.get(T);if(_.__webglInit===void 0)return;const F=T.source,G=f.get(F);if(G){const K=G[_.__cacheKey];K.usedTimes--,K.usedTimes===0&&E(T),Object.keys(G).length===0&&f.delete(F)}n.remove(T)}function E(T){const _=n.get(T);i.deleteTexture(_.__webglTexture);const F=T.source,G=f.get(F);delete G[_.__cacheKey],a.memory.textures--}function v(T){const _=n.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),n.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let G=0;G<6;G++){if(Array.isArray(_.__webglFramebuffer[G]))for(let K=0;K<_.__webglFramebuffer[G].length;K++)i.deleteFramebuffer(_.__webglFramebuffer[G][K]);else i.deleteFramebuffer(_.__webglFramebuffer[G]);_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer[G])}else{if(Array.isArray(_.__webglFramebuffer))for(let G=0;G<_.__webglFramebuffer.length;G++)i.deleteFramebuffer(_.__webglFramebuffer[G]);else i.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&i.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let G=0;G<_.__webglColorRenderbuffer.length;G++)_.__webglColorRenderbuffer[G]&&i.deleteRenderbuffer(_.__webglColorRenderbuffer[G]);_.__webglDepthRenderbuffer&&i.deleteRenderbuffer(_.__webglDepthRenderbuffer)}const F=T.textures;for(let G=0,K=F.length;G<K;G++){const V=n.get(F[G]);V.__webglTexture&&(i.deleteTexture(V.__webglTexture),a.memory.textures--),n.remove(F[G])}n.remove(T)}let P=0;function W(){P=0}function H(){const T=P;return T>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+s.maxTextures),P+=1,T}function Z(T){const _=[];return _.push(T.wrapS),_.push(T.wrapT),_.push(T.wrapR||0),_.push(T.magFilter),_.push(T.minFilter),_.push(T.anisotropy),_.push(T.internalFormat),_.push(T.format),_.push(T.type),_.push(T.generateMipmaps),_.push(T.premultiplyAlpha),_.push(T.flipY),_.push(T.unpackAlignment),_.push(T.colorSpace),_.join()}function $(T,_){const F=n.get(T);if(T.isVideoTexture&&y0(T),T.isRenderTargetTexture===!1&&T.version>0&&F.__version!==T.version){const G=T.image;if(G===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(G.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{M0(F,T,_);return}}t.bindTexture(i.TEXTURE_2D,F.__webglTexture,i.TEXTURE0+_)}function q(T,_){const F=n.get(T);if(T.version>0&&F.__version!==T.version){M0(F,T,_);return}t.bindTexture(i.TEXTURE_2D_ARRAY,F.__webglTexture,i.TEXTURE0+_)}function j(T,_){const F=n.get(T);if(T.version>0&&F.__version!==T.version){M0(F,T,_);return}t.bindTexture(i.TEXTURE_3D,F.__webglTexture,i.TEXTURE0+_)}function k(T,_){const F=n.get(T);if(T.version>0&&F.__version!==T.version){c0(F,T,_);return}t.bindTexture(i.TEXTURE_CUBE_MAP,F.__webglTexture,i.TEXTURE0+_)}const l0={[zt]:i.REPEAT,[ye]:i.CLAMP_TO_EDGE,[U1]:i.MIRRORED_REPEAT},f0={[me]:i.NEAREST,[ya]:i.NEAREST_MIPMAP_NEAREST,[ei]:i.NEAREST_MIPMAP_LINEAR,[ve]:i.LINEAR,[Vi]:i.LINEAR_MIPMAP_NEAREST,[Bt]:i.LINEAR_MIPMAP_LINEAR},T0={[Ra]:i.NEVER,[Ia]:i.ALWAYS,[Ca]:i.LESS,[sr]:i.LEQUAL,[Pa]:i.EQUAL,[Ua]:i.GEQUAL,[La]:i.GREATER,[Da]:i.NOTEQUAL};function z0(T,_){if(_.type===Ye&&e.has("OES_texture_float_linear")===!1&&(_.magFilter===ve||_.magFilter===Vi||_.magFilter===ei||_.magFilter===Bt||_.minFilter===ve||_.minFilter===Vi||_.minFilter===ei||_.minFilter===Bt)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(T,i.TEXTURE_WRAP_S,l0[_.wrapS]),i.texParameteri(T,i.TEXTURE_WRAP_T,l0[_.wrapT]),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,l0[_.wrapR]),i.texParameteri(T,i.TEXTURE_MAG_FILTER,f0[_.magFilter]),i.texParameteri(T,i.TEXTURE_MIN_FILTER,f0[_.minFilter]),_.compareFunction&&(i.texParameteri(T,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(T,i.TEXTURE_COMPARE_FUNC,T0[_.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===me||_.minFilter!==ei&&_.minFilter!==Bt||_.type===Ye&&e.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){const F=e.get("EXT_texture_filter_anisotropic");i.texParameterf(T,F.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function j0(T,_){let F=!1;T.__webglInit===void 0&&(T.__webglInit=!0,_.addEventListener("dispose",L));const G=_.source;let K=f.get(G);K===void 0&&(K={},f.set(G,K));const V=Z(_);if(V!==T.__cacheKey){K[V]===void 0&&(K[V]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,F=!0),K[V].usedTimes++;const x0=K[T.__cacheKey];x0!==void 0&&(K[T.__cacheKey].usedTimes--,x0.usedTimes===0&&E(_)),T.__cacheKey=V,T.__webglTexture=K[V].texture}return F}function X(T,_,F){return Math.floor(Math.floor(T/F)/_)}function n0(T,_,F,G){const V=T.updateRanges;if(V.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,_.width,_.height,F,G,_.data);else{V.sort((J,u0)=>J.start-u0.start);let x0=0;for(let J=1;J<V.length;J++){const u0=V[x0],w0=V[J],b0=u0.start+u0.count,s0=X(w0.start,_.width,4),L0=X(u0.start,_.width,4);w0.start<=b0+1&&s0===L0&&X(w0.start+w0.count-1,_.width,4)===s0?u0.count=Math.max(u0.count,w0.start+w0.count-u0.start):(++x0,V[x0]=w0)}V.length=x0+1;const r0=i.getParameter(i.UNPACK_ROW_LENGTH),_0=i.getParameter(i.UNPACK_SKIP_PIXELS),v0=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,_.width);for(let J=0,u0=V.length;J<u0;J++){const w0=V[J],b0=Math.floor(w0.start/4),s0=Math.ceil(w0.count/4),L0=b0%_.width,C=Math.floor(b0/_.width),a0=s0,Q=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,L0),i.pixelStorei(i.UNPACK_SKIP_ROWS,C),t.texSubImage2D(i.TEXTURE_2D,0,L0,C,a0,Q,F,G,_.data)}T.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,r0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,_0),i.pixelStorei(i.UNPACK_SKIP_ROWS,v0)}}function M0(T,_,F){let G=i.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(G=i.TEXTURE_2D_ARRAY),_.isData3DTexture&&(G=i.TEXTURE_3D);const K=j0(T,_),V=_.source;t.bindTexture(G,T.__webglTexture,i.TEXTURE0+F);const x0=n.get(V);if(V.version!==x0.__version||K===!0){t.activeTexture(i.TEXTURE0+F);const r0=W0.getPrimaries(W0.workingColorSpace),_0=_.colorSpace===vt?null:W0.getPrimaries(_.colorSpace),v0=_.colorSpace===vt||r0===_0?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,v0);let J=M(_.image,!1,s.maxTextureSize);J=N0(_,J);const u0=r.convert(_.format,_.colorSpace),w0=r.convert(_.type);let b0=y(_.internalFormat,u0,w0,_.colorSpace,_.isVideoTexture);z0(G,_);let s0;const L0=_.mipmaps,C=_.isVideoTexture!==!0,a0=x0.__version===void 0||K===!0,Q=V.dataReady,d0=I(_,J);if(_.isDepthTexture)b0=S(_.format===Gn,_.type),a0&&(C?t.texStorage2D(i.TEXTURE_2D,1,b0,J.width,J.height):t.texImage2D(i.TEXTURE_2D,0,b0,J.width,J.height,0,u0,w0,null));else if(_.isDataTexture)if(L0.length>0){C&&a0&&t.texStorage2D(i.TEXTURE_2D,d0,b0,L0[0].width,L0[0].height);for(let e0=0,Y=L0.length;e0<Y;e0++)s0=L0[e0],C?Q&&t.texSubImage2D(i.TEXTURE_2D,e0,0,0,s0.width,s0.height,u0,w0,s0.data):t.texImage2D(i.TEXTURE_2D,e0,b0,s0.width,s0.height,0,u0,w0,s0.data);_.generateMipmaps=!1}else C?(a0&&t.texStorage2D(i.TEXTURE_2D,d0,b0,J.width,J.height),Q&&n0(_,J,u0,w0)):t.texImage2D(i.TEXTURE_2D,0,b0,J.width,J.height,0,u0,w0,J.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){C&&a0&&t.texStorage3D(i.TEXTURE_2D_ARRAY,d0,b0,L0[0].width,L0[0].height,J.depth);for(let e0=0,Y=L0.length;e0<Y;e0++)if(s0=L0[e0],_.format!==be)if(u0!==null)if(C){if(Q)if(_.layerUpdates.size>0){const p0=c9(s0.width,s0.height,_.format,_.type);for(const D0 of _.layerUpdates){const ee=s0.data.subarray(D0*p0/s0.data.BYTES_PER_ELEMENT,(D0+1)*p0/s0.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,e0,0,0,D0,s0.width,s0.height,1,u0,ee)}_.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,e0,0,0,0,s0.width,s0.height,J.depth,u0,s0.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,e0,b0,s0.width,s0.height,J.depth,0,s0.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else C?Q&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,e0,0,0,0,s0.width,s0.height,J.depth,u0,w0,s0.data):t.texImage3D(i.TEXTURE_2D_ARRAY,e0,b0,s0.width,s0.height,J.depth,0,u0,w0,s0.data)}else{C&&a0&&t.texStorage2D(i.TEXTURE_2D,d0,b0,L0[0].width,L0[0].height);for(let e0=0,Y=L0.length;e0<Y;e0++)s0=L0[e0],_.format!==be?u0!==null?C?Q&&t.compressedTexSubImage2D(i.TEXTURE_2D,e0,0,0,s0.width,s0.height,u0,s0.data):t.compressedTexImage2D(i.TEXTURE_2D,e0,b0,s0.width,s0.height,0,s0.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):C?Q&&t.texSubImage2D(i.TEXTURE_2D,e0,0,0,s0.width,s0.height,u0,w0,s0.data):t.texImage2D(i.TEXTURE_2D,e0,b0,s0.width,s0.height,0,u0,w0,s0.data)}else if(_.isDataArrayTexture)if(C){if(a0&&t.texStorage3D(i.TEXTURE_2D_ARRAY,d0,b0,J.width,J.height,J.depth),Q)if(_.layerUpdates.size>0){const e0=c9(J.width,J.height,_.format,_.type);for(const Y of _.layerUpdates){const p0=J.data.subarray(Y*e0/J.data.BYTES_PER_ELEMENT,(Y+1)*e0/J.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Y,J.width,J.height,1,u0,w0,p0)}_.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,J.width,J.height,J.depth,u0,w0,J.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,b0,J.width,J.height,J.depth,0,u0,w0,J.data);else if(_.isData3DTexture)C?(a0&&t.texStorage3D(i.TEXTURE_3D,d0,b0,J.width,J.height,J.depth),Q&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,J.width,J.height,J.depth,u0,w0,J.data)):t.texImage3D(i.TEXTURE_3D,0,b0,J.width,J.height,J.depth,0,u0,w0,J.data);else if(_.isFramebufferTexture){if(a0)if(C)t.texStorage2D(i.TEXTURE_2D,d0,b0,J.width,J.height);else{let e0=J.width,Y=J.height;for(let p0=0;p0<d0;p0++)t.texImage2D(i.TEXTURE_2D,p0,b0,e0,Y,0,u0,w0,null),e0>>=1,Y>>=1}}else if(L0.length>0){if(C&&a0){const e0=ue(L0[0]);t.texStorage2D(i.TEXTURE_2D,d0,b0,e0.width,e0.height)}for(let e0=0,Y=L0.length;e0<Y;e0++)s0=L0[e0],C?Q&&t.texSubImage2D(i.TEXTURE_2D,e0,0,0,u0,w0,s0):t.texImage2D(i.TEXTURE_2D,e0,b0,u0,w0,s0);_.generateMipmaps=!1}else if(C){if(a0){const e0=ue(J);t.texStorage2D(i.TEXTURE_2D,d0,b0,e0.width,e0.height)}Q&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,u0,w0,J)}else t.texImage2D(i.TEXTURE_2D,0,b0,u0,w0,J);p(_)&&d(G),x0.__version=V.version,_.onUpdate&&_.onUpdate(_)}T.__version=_.version}function c0(T,_,F){if(_.image.length!==6)return;const G=j0(T,_),K=_.source;t.bindTexture(i.TEXTURE_CUBE_MAP,T.__webglTexture,i.TEXTURE0+F);const V=n.get(K);if(K.version!==V.__version||G===!0){t.activeTexture(i.TEXTURE0+F);const x0=W0.getPrimaries(W0.workingColorSpace),r0=_.colorSpace===vt?null:W0.getPrimaries(_.colorSpace),_0=_.colorSpace===vt||x0===r0?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,_0);const v0=_.isCompressedTexture||_.image[0].isCompressedTexture,J=_.image[0]&&_.image[0].isDataTexture,u0=[];for(let Y=0;Y<6;Y++)!v0&&!J?u0[Y]=M(_.image[Y],!0,s.maxCubemapSize):u0[Y]=J?_.image[Y].image:_.image[Y],u0[Y]=N0(_,u0[Y]);const w0=u0[0],b0=r.convert(_.format,_.colorSpace),s0=r.convert(_.type),L0=y(_.internalFormat,b0,s0,_.colorSpace),C=_.isVideoTexture!==!0,a0=V.__version===void 0||G===!0,Q=K.dataReady;let d0=I(_,w0);z0(i.TEXTURE_CUBE_MAP,_);let e0;if(v0){C&&a0&&t.texStorage2D(i.TEXTURE_CUBE_MAP,d0,L0,w0.width,w0.height);for(let Y=0;Y<6;Y++){e0=u0[Y].mipmaps;for(let p0=0;p0<e0.length;p0++){const D0=e0[p0];_.format!==be?b0!==null?C?Q&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,p0,0,0,D0.width,D0.height,b0,D0.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,p0,L0,D0.width,D0.height,0,D0.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):C?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,p0,0,0,D0.width,D0.height,b0,s0,D0.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,p0,L0,D0.width,D0.height,0,b0,s0,D0.data)}}}else{if(e0=_.mipmaps,C&&a0){e0.length>0&&d0++;const Y=ue(u0[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,d0,L0,Y.width,Y.height)}for(let Y=0;Y<6;Y++)if(J){C?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,0,0,u0[Y].width,u0[Y].height,b0,s0,u0[Y].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,L0,u0[Y].width,u0[Y].height,0,b0,s0,u0[Y].data);for(let p0=0;p0<e0.length;p0++){const ee=e0[p0].image[Y].image;C?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,p0+1,0,0,ee.width,ee.height,b0,s0,ee.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,p0+1,L0,ee.width,ee.height,0,b0,s0,ee.data)}}else{C?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,0,0,b0,s0,u0[Y]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,L0,b0,s0,u0[Y]);for(let p0=0;p0<e0.length;p0++){const D0=e0[p0];C?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,p0+1,0,0,b0,s0,D0.image[Y]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,p0+1,L0,b0,s0,D0.image[Y])}}}p(_)&&d(i.TEXTURE_CUBE_MAP),V.__version=K.version,_.onUpdate&&_.onUpdate(_)}T.__version=_.version}function S0(T,_,F,G,K,V){const x0=r.convert(F.format,F.colorSpace),r0=r.convert(F.type),_0=y(F.internalFormat,x0,r0,F.colorSpace),v0=n.get(_),J=n.get(F);if(J.__renderTarget=_,!v0.__hasExternalTextures){const u0=Math.max(1,_.width>>V),w0=Math.max(1,_.height>>V);K===i.TEXTURE_3D||K===i.TEXTURE_2D_ARRAY?t.texImage3D(K,V,_0,u0,w0,_.depth,0,x0,r0,null):t.texImage2D(K,V,_0,u0,w0,0,x0,r0,null)}t.bindFramebuffer(i.FRAMEBUFFER,T),V0(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,G,K,J.__webglTexture,0,g0(_)):(K===i.TEXTURE_2D||K>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&K<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,G,K,J.__webglTexture,V),t.bindFramebuffer(i.FRAMEBUFFER,null)}function X0(T,_,F){if(i.bindRenderbuffer(i.RENDERBUFFER,T),_.depthBuffer){const G=_.depthTexture,K=G&&G.isDepthTexture?G.type:null,V=S(_.stencilBuffer,K),x0=_.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,r0=g0(_);V0(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,r0,V,_.width,_.height):F?i.renderbufferStorageMultisample(i.RENDERBUFFER,r0,V,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,V,_.width,_.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,x0,i.RENDERBUFFER,T)}else{const G=_.textures;for(let K=0;K<G.length;K++){const V=G[K],x0=r.convert(V.format,V.colorSpace),r0=r.convert(V.type),_0=y(V.internalFormat,x0,r0,V.colorSpace),v0=g0(_);F&&V0(_)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,v0,_0,_.width,_.height):V0(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,v0,_0,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,_0,_.width,_.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function R0(T,_){if(_&&_.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,T),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const G=n.get(_.depthTexture);G.__renderTarget=_,(!G.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),$(_.depthTexture,0);const K=G.__webglTexture,V=g0(_);if(_.depthTexture.format===Vn)V0(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,K,0,V):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,K,0);else if(_.depthTexture.format===Gn)V0(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,K,0,V):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,K,0);else throw new Error("Unknown depthTexture format")}function ie(T){const _=n.get(T),F=T.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==T.depthTexture){const G=T.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),G){const K=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,G.removeEventListener("dispose",K)};G.addEventListener("dispose",K),_.__depthDisposeCallback=K}_.__boundDepthTexture=G}if(T.depthTexture&&!_.__autoAllocateDepthBuffer){if(F)throw new Error("target.depthTexture not supported in Cube render targets");const G=T.texture.mipmaps;G&&G.length>0?R0(_.__webglFramebuffer[0],T):R0(_.__webglFramebuffer,T)}else if(F){_.__webglDepthbuffer=[];for(let G=0;G<6;G++)if(t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[G]),_.__webglDepthbuffer[G]===void 0)_.__webglDepthbuffer[G]=i.createRenderbuffer(),X0(_.__webglDepthbuffer[G],T,!1);else{const K=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,V=_.__webglDepthbuffer[G];i.bindRenderbuffer(i.RENDERBUFFER,V),i.framebufferRenderbuffer(i.FRAMEBUFFER,K,i.RENDERBUFFER,V)}}else{const G=T.texture.mipmaps;if(G&&G.length>0?t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=i.createRenderbuffer(),X0(_.__webglDepthbuffer,T,!1);else{const K=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,V=_.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,V),i.framebufferRenderbuffer(i.FRAMEBUFFER,K,i.RENDERBUFFER,V)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function se(T,_,F){const G=n.get(T);_!==void 0&&S0(G.__webglFramebuffer,T,T.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),F!==void 0&&ie(T)}function q0(T){const _=T.texture,F=n.get(T),G=n.get(_);T.addEventListener("dispose",R);const K=T.textures,V=T.isWebGLCubeRenderTarget===!0,x0=K.length>1;if(x0||(G.__webglTexture===void 0&&(G.__webglTexture=i.createTexture()),G.__version=_.version,a.memory.textures++),V){F.__webglFramebuffer=[];for(let r0=0;r0<6;r0++)if(_.mipmaps&&_.mipmaps.length>0){F.__webglFramebuffer[r0]=[];for(let _0=0;_0<_.mipmaps.length;_0++)F.__webglFramebuffer[r0][_0]=i.createFramebuffer()}else F.__webglFramebuffer[r0]=i.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){F.__webglFramebuffer=[];for(let r0=0;r0<_.mipmaps.length;r0++)F.__webglFramebuffer[r0]=i.createFramebuffer()}else F.__webglFramebuffer=i.createFramebuffer();if(x0)for(let r0=0,_0=K.length;r0<_0;r0++){const v0=n.get(K[r0]);v0.__webglTexture===void 0&&(v0.__webglTexture=i.createTexture(),a.memory.textures++)}if(T.samples>0&&V0(T)===!1){F.__webglMultisampledFramebuffer=i.createFramebuffer(),F.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,F.__webglMultisampledFramebuffer);for(let r0=0;r0<K.length;r0++){const _0=K[r0];F.__webglColorRenderbuffer[r0]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,F.__webglColorRenderbuffer[r0]);const v0=r.convert(_0.format,_0.colorSpace),J=r.convert(_0.type),u0=y(_0.internalFormat,v0,J,_0.colorSpace,T.isXRRenderTarget===!0),w0=g0(T);i.renderbufferStorageMultisample(i.RENDERBUFFER,w0,u0,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+r0,i.RENDERBUFFER,F.__webglColorRenderbuffer[r0])}i.bindRenderbuffer(i.RENDERBUFFER,null),T.depthBuffer&&(F.__webglDepthRenderbuffer=i.createRenderbuffer(),X0(F.__webglDepthRenderbuffer,T,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(V){t.bindTexture(i.TEXTURE_CUBE_MAP,G.__webglTexture),z0(i.TEXTURE_CUBE_MAP,_);for(let r0=0;r0<6;r0++)if(_.mipmaps&&_.mipmaps.length>0)for(let _0=0;_0<_.mipmaps.length;_0++)S0(F.__webglFramebuffer[r0][_0],T,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+r0,_0);else S0(F.__webglFramebuffer[r0],T,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+r0,0);p(_)&&d(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(x0){for(let r0=0,_0=K.length;r0<_0;r0++){const v0=K[r0],J=n.get(v0);t.bindTexture(i.TEXTURE_2D,J.__webglTexture),z0(i.TEXTURE_2D,v0),S0(F.__webglFramebuffer,T,v0,i.COLOR_ATTACHMENT0+r0,i.TEXTURE_2D,0),p(v0)&&d(i.TEXTURE_2D)}t.unbindTexture()}else{let r0=i.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(r0=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(r0,G.__webglTexture),z0(r0,_),_.mipmaps&&_.mipmaps.length>0)for(let _0=0;_0<_.mipmaps.length;_0++)S0(F.__webglFramebuffer[_0],T,_,i.COLOR_ATTACHMENT0,r0,_0);else S0(F.__webglFramebuffer,T,_,i.COLOR_ATTACHMENT0,r0,0);p(_)&&d(r0),t.unbindTexture()}T.depthBuffer&&ie(T)}function w(T){const _=T.textures;for(let F=0,G=_.length;F<G;F++){const K=_[F];if(p(K)){const V=b(T),x0=n.get(K).__webglTexture;t.bindTexture(V,x0),d(V),t.unbindTexture()}}}const Me=[],Y0=[];function Q0(T){if(T.samples>0){if(V0(T)===!1){const _=T.textures,F=T.width,G=T.height;let K=i.COLOR_BUFFER_BIT;const V=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,x0=n.get(T),r0=_.length>1;if(r0)for(let v0=0;v0<_.length;v0++)t.bindFramebuffer(i.FRAMEBUFFER,x0.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+v0,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,x0.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+v0,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,x0.__webglMultisampledFramebuffer);const _0=T.texture.mipmaps;_0&&_0.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,x0.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,x0.__webglFramebuffer);for(let v0=0;v0<_.length;v0++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(K|=i.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(K|=i.STENCIL_BUFFER_BIT)),r0){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,x0.__webglColorRenderbuffer[v0]);const J=n.get(_[v0]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,J,0)}i.blitFramebuffer(0,0,F,G,0,0,F,G,K,i.NEAREST),l===!0&&(Me.length=0,Y0.length=0,Me.push(i.COLOR_ATTACHMENT0+v0),T.depthBuffer&&T.resolveDepthBuffer===!1&&(Me.push(V),Y0.push(V),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Y0)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Me))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),r0)for(let v0=0;v0<_.length;v0++){t.bindFramebuffer(i.FRAMEBUFFER,x0.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+v0,i.RENDERBUFFER,x0.__webglColorRenderbuffer[v0]);const J=n.get(_[v0]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,x0.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+v0,i.TEXTURE_2D,J,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,x0.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&l){const _=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[_])}}}function g0(T){return Math.min(s.maxSamples,T.samples)}function V0(T){const _=n.get(T);return T.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function y0(T){const _=a.render.frame;u.get(T)!==_&&(u.set(T,_),T.update())}function N0(T,_){const F=T.colorSpace,G=T.format,K=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||F!==gn&&F!==vt&&(W0.getTransfer(F)===J0?(G!==be||K!==ft)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",F)),_}function ue(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(c.width=T.naturalWidth||T.width,c.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(c.width=T.displayWidth,c.height=T.displayHeight):(c.width=T.width,c.height=T.height),c}this.allocateTextureUnit=H,this.resetTextureUnits=W,this.setTexture2D=$,this.setTexture2DArray=q,this.setTexture3D=j,this.setTextureCube=k,this.rebindTextures=se,this.setupRenderTarget=q0,this.updateRenderTargetMipmap=w,this.updateMultisampleRenderTarget=Q0,this.setupDepthRenderbuffer=ie,this.setupFrameBufferTexture=S0,this.useMultisampledRTT=V0}function g8(i,e){function t(n,s=vt){let r;const a=W0.getTransfer(s);if(n===ft)return i.UNSIGNED_BYTE;if(n===fs)return i.UNSIGNED_SHORT_4_4_4_4;if(n===ds)return i.UNSIGNED_SHORT_5_5_5_1;if(n===J9)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Z9)return i.BYTE;if(n===$9)return i.SHORT;if(n===Hn)return i.UNSIGNED_SHORT;if(n===hs)return i.INT;if(n===Ht)return i.UNSIGNED_INT;if(n===Ye)return i.FLOAT;if(n===Ke)return i.HALF_FLOAT;if(n===j9)return i.ALPHA;if(n===Q9)return i.RGB;if(n===be)return i.RGBA;if(n===Vn)return i.DEPTH_COMPONENT;if(n===Gn)return i.DEPTH_STENCIL;if(n===er)return i.RED;if(n===ps)return i.RED_INTEGER;if(n===tr)return i.RG;if(n===ms)return i.RG_INTEGER;if(n===_s)return i.RGBA_INTEGER;if(n===Ai||n===bi||n===wi||n===Ri)if(a===J0)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Ai)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===bi)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===wi)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Ri)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Ai)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===bi)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===wi)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Ri)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===I1||n===N1||n===F1||n===O1)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===I1)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===N1)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===F1)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===O1)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===B1||n===z1||n===H1)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===B1||n===z1)return a===J0?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===H1)return a===J0?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===k1||n===V1||n===G1||n===W1||n===X1||n===q1||n===Y1||n===K1||n===Z1||n===$1||n===J1||n===j1||n===Q1||n===es)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===k1)return a===J0?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===V1)return a===J0?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===G1)return a===J0?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===W1)return a===J0?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===X1)return a===J0?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===q1)return a===J0?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Y1)return a===J0?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===K1)return a===J0?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Z1)return a===J0?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===$1)return a===J0?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===J1)return a===J0?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===j1)return a===J0?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Q1)return a===J0?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===es)return a===J0?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Ci||n===ts||n===ns)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Ci)return a===J0?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===ts)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===ns)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===nr||n===is||n===ss||n===rs)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Ci)return r.COMPRESSED_RED_RGTC1_EXT;if(n===is)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===ss)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===rs)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===kn?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const x8=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,v8=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class M8{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const s=new _e,r=e.properties.get(s);r.__webglTexture=t.texture,(t.depthNear!==n.depthNear||t.depthFar!==n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Pe({vertexShader:x8,fragmentShader:v8,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new we(new Vt(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class S8 extends En{constructor(e,t){super();const n=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,u=null,h=null,f=null,m=null,g=null;const M=new M8,p=t.getContextAttributes();let d=null,b=null;const y=[],S=[],I=new B0;let L=null;const R=new Be;R.viewport=new oe;const N=new Be;N.viewport=new oe;const E=[R,N],v=new k2;let P=null,W=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let n0=y[X];return n0===void 0&&(n0=new c1,y[X]=n0),n0.getTargetRaySpace()},this.getControllerGrip=function(X){let n0=y[X];return n0===void 0&&(n0=new c1,y[X]=n0),n0.getGripSpace()},this.getHand=function(X){let n0=y[X];return n0===void 0&&(n0=new c1,y[X]=n0),n0.getHandSpace()};function H(X){const n0=S.indexOf(X.inputSource);if(n0===-1)return;const M0=y[n0];M0!==void 0&&(M0.update(X.inputSource,X.frame,c||a),M0.dispatchEvent({type:X.type,data:X.inputSource}))}function Z(){s.removeEventListener("select",H),s.removeEventListener("selectstart",H),s.removeEventListener("selectend",H),s.removeEventListener("squeeze",H),s.removeEventListener("squeezestart",H),s.removeEventListener("squeezeend",H),s.removeEventListener("end",Z),s.removeEventListener("inputsourceschange",$);for(let X=0;X<y.length;X++){const n0=S[X];n0!==null&&(S[X]=null,y[X].disconnect(n0))}P=null,W=null,M.reset(),e.setRenderTarget(d),m=null,f=null,h=null,s=null,b=null,j0.stop(),n.isPresenting=!1,e.setPixelRatio(L),e.setSize(I.width,I.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){r=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){o=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(X){c=X},this.getBaseLayer=function(){return f!==null?f:m},this.getBinding=function(){return h},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(X){if(s=X,s!==null){if(d=e.getRenderTarget(),s.addEventListener("select",H),s.addEventListener("selectstart",H),s.addEventListener("selectend",H),s.addEventListener("squeeze",H),s.addEventListener("squeezestart",H),s.addEventListener("squeezeend",H),s.addEventListener("end",Z),s.addEventListener("inputsourceschange",$),p.xrCompatible!==!0&&await t.makeXRCompatible(),L=e.getPixelRatio(),e.getSize(I),typeof XRWebGLBinding<"u"&&"createProjectionLayer"in XRWebGLBinding.prototype){let M0=null,c0=null,S0=null;p.depth&&(S0=p.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,M0=p.stencil?Gn:Vn,c0=p.stencil?kn:Ht);const X0={colorFormat:t.RGBA8,depthFormat:S0,scaleFactor:r};h=new XRWebGLBinding(s,t),f=h.createProjectionLayer(X0),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),b=new Ze(f.textureWidth,f.textureHeight,{format:be,type:ft,depthTexture:new mr(f.textureWidth,f.textureHeight,c0,void 0,void 0,void 0,void 0,void 0,void 0,M0),stencilBuffer:p.stencil,colorSpace:e.outputColorSpace,samples:p.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const M0={antialias:p.antialias,alpha:!0,depth:p.depth,stencil:p.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,t,M0),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),b=new Ze(m.framebufferWidth,m.framebufferHeight,{format:be,type:ft,colorSpace:e.outputColorSpace,stencilBuffer:p.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),j0.setContext(s),j0.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return M.getDepthTexture()};function $(X){for(let n0=0;n0<X.removed.length;n0++){const M0=X.removed[n0],c0=S.indexOf(M0);c0>=0&&(S[c0]=null,y[c0].disconnect(M0))}for(let n0=0;n0<X.added.length;n0++){const M0=X.added[n0];let c0=S.indexOf(M0);if(c0===-1){for(let X0=0;X0<y.length;X0++)if(X0>=S.length){S.push(M0),c0=X0;break}else if(S[X0]===null){S[X0]=M0,c0=X0;break}if(c0===-1)break}const S0=y[c0];S0&&S0.connect(M0)}}const q=new O,j=new O;function k(X,n0,M0){q.setFromMatrixPosition(n0.matrixWorld),j.setFromMatrixPosition(M0.matrixWorld);const c0=q.distanceTo(j),S0=n0.projectionMatrix.elements,X0=M0.projectionMatrix.elements,R0=S0[14]/(S0[10]-1),ie=S0[14]/(S0[10]+1),se=(S0[9]+1)/S0[5],q0=(S0[9]-1)/S0[5],w=(S0[8]-1)/S0[0],Me=(X0[8]+1)/X0[0],Y0=R0*w,Q0=R0*Me,g0=c0/(-w+Me),V0=g0*-w;if(n0.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(V0),X.translateZ(g0),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert(),S0[10]===-1)X.projectionMatrix.copy(n0.projectionMatrix),X.projectionMatrixInverse.copy(n0.projectionMatrixInverse);else{const y0=R0+g0,N0=ie+g0,ue=Y0-V0,T=Q0+(c0-V0),_=se*ie/N0*y0,F=q0*ie/N0*y0;X.projectionMatrix.makePerspective(ue,T,_,F,y0,N0),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}}function l0(X,n0){n0===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(n0.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(s===null)return;let n0=X.near,M0=X.far;M.texture!==null&&(M.depthNear>0&&(n0=M.depthNear),M.depthFar>0&&(M0=M.depthFar)),v.near=N.near=R.near=n0,v.far=N.far=R.far=M0,(P!==v.near||W!==v.far)&&(s.updateRenderState({depthNear:v.near,depthFar:v.far}),P=v.near,W=v.far),R.layers.mask=X.layers.mask|2,N.layers.mask=X.layers.mask|4,v.layers.mask=R.layers.mask|N.layers.mask;const c0=X.parent,S0=v.cameras;l0(v,c0);for(let X0=0;X0<S0.length;X0++)l0(S0[X0],c0);S0.length===2?k(v,R,N):v.projectionMatrix.copy(R.projectionMatrix),f0(X,v,c0)};function f0(X,n0,M0){M0===null?X.matrix.copy(n0.matrixWorld):(X.matrix.copy(M0.matrixWorld),X.matrix.invert(),X.matrix.multiply(n0.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(n0.projectionMatrix),X.projectionMatrixInverse.copy(n0.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=Wn*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return v},this.getFoveation=function(){if(!(f===null&&m===null))return l},this.setFoveation=function(X){l=X,f!==null&&(f.fixedFoveation=X),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=X)},this.hasDepthSensing=function(){return M.texture!==null},this.getDepthSensingMesh=function(){return M.getMesh(v)};let T0=null;function z0(X,n0){if(u=n0.getViewerPose(c||a),g=n0,u!==null){const M0=u.views;m!==null&&(e.setRenderTargetFramebuffer(b,m.framebuffer),e.setRenderTarget(b));let c0=!1;M0.length!==v.cameras.length&&(v.cameras.length=0,c0=!0);for(let R0=0;R0<M0.length;R0++){const ie=M0[R0];let se=null;if(m!==null)se=m.getViewport(ie);else{const w=h.getViewSubImage(f,ie);se=w.viewport,R0===0&&(e.setRenderTargetTextures(b,w.colorTexture,w.depthStencilTexture),e.setRenderTarget(b))}let q0=E[R0];q0===void 0&&(q0=new Be,q0.layers.enable(R0),q0.viewport=new oe,E[R0]=q0),q0.matrix.fromArray(ie.transform.matrix),q0.matrix.decompose(q0.position,q0.quaternion,q0.scale),q0.projectionMatrix.fromArray(ie.projectionMatrix),q0.projectionMatrixInverse.copy(q0.projectionMatrix).invert(),q0.viewport.set(se.x,se.y,se.width,se.height),R0===0&&(v.matrix.copy(q0.matrix),v.matrix.decompose(v.position,v.quaternion,v.scale)),c0===!0&&v.cameras.push(q0)}const S0=s.enabledFeatures;if(S0&&S0.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&h){const R0=h.getDepthInformation(M0[0]);R0&&R0.isValid&&R0.texture&&M.init(e,R0,s.renderState)}}for(let M0=0;M0<y.length;M0++){const c0=S[M0],S0=y[M0];c0!==null&&S0!==void 0&&S0.update(c0,n0,c||a)}T0&&T0(X,n0),n0.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:n0}),g=null}const j0=new vr;j0.setAnimationLoop(z0),this.setAnimationLoop=function(X){T0=X},this.dispose=function(){}}}const Dt=new He,E8=new ce;function T8(i,e){function t(p,d){p.matrixAutoUpdate===!0&&p.updateMatrix(),d.value.copy(p.matrix)}function n(p,d){d.color.getRGB(p.fogColor.value,hr(i)),d.isFog?(p.fogNear.value=d.near,p.fogFar.value=d.far):d.isFogExp2&&(p.fogDensity.value=d.density)}function s(p,d,b,y,S){d.isMeshBasicMaterial||d.isMeshLambertMaterial?r(p,d):d.isMeshToonMaterial?(r(p,d),h(p,d)):d.isMeshPhongMaterial?(r(p,d),u(p,d)):d.isMeshStandardMaterial?(r(p,d),f(p,d),d.isMeshPhysicalMaterial&&m(p,d,S)):d.isMeshMatcapMaterial?(r(p,d),g(p,d)):d.isMeshDepthMaterial?r(p,d):d.isMeshDistanceMaterial?(r(p,d),M(p,d)):d.isMeshNormalMaterial?r(p,d):d.isLineBasicMaterial?(a(p,d),d.isLineDashedMaterial&&o(p,d)):d.isPointsMaterial?l(p,d,b,y):d.isSpriteMaterial?c(p,d):d.isShadowMaterial?(p.color.value.copy(d.color),p.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(p,d){p.opacity.value=d.opacity,d.color&&p.diffuse.value.copy(d.color),d.emissive&&p.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(p.map.value=d.map,t(d.map,p.mapTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,t(d.alphaMap,p.alphaMapTransform)),d.bumpMap&&(p.bumpMap.value=d.bumpMap,t(d.bumpMap,p.bumpMapTransform),p.bumpScale.value=d.bumpScale,d.side===Le&&(p.bumpScale.value*=-1)),d.normalMap&&(p.normalMap.value=d.normalMap,t(d.normalMap,p.normalMapTransform),p.normalScale.value.copy(d.normalScale),d.side===Le&&p.normalScale.value.negate()),d.displacementMap&&(p.displacementMap.value=d.displacementMap,t(d.displacementMap,p.displacementMapTransform),p.displacementScale.value=d.displacementScale,p.displacementBias.value=d.displacementBias),d.emissiveMap&&(p.emissiveMap.value=d.emissiveMap,t(d.emissiveMap,p.emissiveMapTransform)),d.specularMap&&(p.specularMap.value=d.specularMap,t(d.specularMap,p.specularMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest);const b=e.get(d),y=b.envMap,S=b.envMapRotation;y&&(p.envMap.value=y,Dt.copy(S),Dt.x*=-1,Dt.y*=-1,Dt.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(Dt.y*=-1,Dt.z*=-1),p.envMapRotation.value.setFromMatrix4(E8.makeRotationFromEuler(Dt)),p.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=d.reflectivity,p.ior.value=d.ior,p.refractionRatio.value=d.refractionRatio),d.lightMap&&(p.lightMap.value=d.lightMap,p.lightMapIntensity.value=d.lightMapIntensity,t(d.lightMap,p.lightMapTransform)),d.aoMap&&(p.aoMap.value=d.aoMap,p.aoMapIntensity.value=d.aoMapIntensity,t(d.aoMap,p.aoMapTransform))}function a(p,d){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,d.map&&(p.map.value=d.map,t(d.map,p.mapTransform))}function o(p,d){p.dashSize.value=d.dashSize,p.totalSize.value=d.dashSize+d.gapSize,p.scale.value=d.scale}function l(p,d,b,y){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,p.size.value=d.size*b,p.scale.value=y*.5,d.map&&(p.map.value=d.map,t(d.map,p.uvTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,t(d.alphaMap,p.alphaMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest)}function c(p,d){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,p.rotation.value=d.rotation,d.map&&(p.map.value=d.map,t(d.map,p.mapTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,t(d.alphaMap,p.alphaMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest)}function u(p,d){p.specular.value.copy(d.specular),p.shininess.value=Math.max(d.shininess,1e-4)}function h(p,d){d.gradientMap&&(p.gradientMap.value=d.gradientMap)}function f(p,d){p.metalness.value=d.metalness,d.metalnessMap&&(p.metalnessMap.value=d.metalnessMap,t(d.metalnessMap,p.metalnessMapTransform)),p.roughness.value=d.roughness,d.roughnessMap&&(p.roughnessMap.value=d.roughnessMap,t(d.roughnessMap,p.roughnessMapTransform)),d.envMap&&(p.envMapIntensity.value=d.envMapIntensity)}function m(p,d,b){p.ior.value=d.ior,d.sheen>0&&(p.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),p.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(p.sheenColorMap.value=d.sheenColorMap,t(d.sheenColorMap,p.sheenColorMapTransform)),d.sheenRoughnessMap&&(p.sheenRoughnessMap.value=d.sheenRoughnessMap,t(d.sheenRoughnessMap,p.sheenRoughnessMapTransform))),d.clearcoat>0&&(p.clearcoat.value=d.clearcoat,p.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(p.clearcoatMap.value=d.clearcoatMap,t(d.clearcoatMap,p.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,t(d.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(p.clearcoatNormalMap.value=d.clearcoatNormalMap,t(d.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===Le&&p.clearcoatNormalScale.value.negate())),d.dispersion>0&&(p.dispersion.value=d.dispersion),d.iridescence>0&&(p.iridescence.value=d.iridescence,p.iridescenceIOR.value=d.iridescenceIOR,p.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(p.iridescenceMap.value=d.iridescenceMap,t(d.iridescenceMap,p.iridescenceMapTransform)),d.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=d.iridescenceThicknessMap,t(d.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),d.transmission>0&&(p.transmission.value=d.transmission,p.transmissionSamplerMap.value=b.texture,p.transmissionSamplerSize.value.set(b.width,b.height),d.transmissionMap&&(p.transmissionMap.value=d.transmissionMap,t(d.transmissionMap,p.transmissionMapTransform)),p.thickness.value=d.thickness,d.thicknessMap&&(p.thicknessMap.value=d.thicknessMap,t(d.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=d.attenuationDistance,p.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(p.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(p.anisotropyMap.value=d.anisotropyMap,t(d.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=d.specularIntensity,p.specularColor.value.copy(d.specularColor),d.specularColorMap&&(p.specularColorMap.value=d.specularColorMap,t(d.specularColorMap,p.specularColorMapTransform)),d.specularIntensityMap&&(p.specularIntensityMap.value=d.specularIntensityMap,t(d.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,d){d.matcap&&(p.matcap.value=d.matcap)}function M(p,d){const b=e.get(d).light;p.referencePosition.value.setFromMatrixPosition(b.matrixWorld),p.nearDistance.value=b.shadow.camera.near,p.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function y8(i,e,t,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(b,y){const S=y.program;n.uniformBlockBinding(b,S)}function c(b,y){let S=s[b.id];S===void 0&&(g(b),S=u(b),s[b.id]=S,b.addEventListener("dispose",p));const I=y.program;n.updateUBOMapping(b,I);const L=e.render.frame;r[b.id]!==L&&(f(b),r[b.id]=L)}function u(b){const y=h();b.__bindingPointIndex=y;const S=i.createBuffer(),I=b.__size,L=b.usage;return i.bindBuffer(i.UNIFORM_BUFFER,S),i.bufferData(i.UNIFORM_BUFFER,I,L),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,y,S),S}function h(){for(let b=0;b<o;b++)if(a.indexOf(b)===-1)return a.push(b),b;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(b){const y=s[b.id],S=b.uniforms,I=b.__cache;i.bindBuffer(i.UNIFORM_BUFFER,y);for(let L=0,R=S.length;L<R;L++){const N=Array.isArray(S[L])?S[L]:[S[L]];for(let E=0,v=N.length;E<v;E++){const P=N[E];if(m(P,L,E,I)===!0){const W=P.__offset,H=Array.isArray(P.value)?P.value:[P.value];let Z=0;for(let $=0;$<H.length;$++){const q=H[$],j=M(q);typeof q=="number"||typeof q=="boolean"?(P.__data[0]=q,i.bufferSubData(i.UNIFORM_BUFFER,W+Z,P.__data)):q.isMatrix3?(P.__data[0]=q.elements[0],P.__data[1]=q.elements[1],P.__data[2]=q.elements[2],P.__data[3]=0,P.__data[4]=q.elements[3],P.__data[5]=q.elements[4],P.__data[6]=q.elements[5],P.__data[7]=0,P.__data[8]=q.elements[6],P.__data[9]=q.elements[7],P.__data[10]=q.elements[8],P.__data[11]=0):(q.toArray(P.__data,Z),Z+=j.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,W,P.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(b,y,S,I){const L=b.value,R=y+"_"+S;if(I[R]===void 0)return typeof L=="number"||typeof L=="boolean"?I[R]=L:I[R]=L.clone(),!0;{const N=I[R];if(typeof L=="number"||typeof L=="boolean"){if(N!==L)return I[R]=L,!0}else if(N.equals(L)===!1)return N.copy(L),!0}return!1}function g(b){const y=b.uniforms;let S=0;const I=16;for(let R=0,N=y.length;R<N;R++){const E=Array.isArray(y[R])?y[R]:[y[R]];for(let v=0,P=E.length;v<P;v++){const W=E[v],H=Array.isArray(W.value)?W.value:[W.value];for(let Z=0,$=H.length;Z<$;Z++){const q=H[Z],j=M(q),k=S%I,l0=k%j.boundary,f0=k+l0;S+=l0,f0!==0&&I-f0<j.storage&&(S+=I-f0),W.__data=new Float32Array(j.storage/Float32Array.BYTES_PER_ELEMENT),W.__offset=S,S+=j.storage}}}const L=S%I;return L>0&&(S+=I-L),b.__size=S,b.__cache={},this}function M(b){const y={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(y.boundary=4,y.storage=4):b.isVector2?(y.boundary=8,y.storage=8):b.isVector3||b.isColor?(y.boundary=16,y.storage=12):b.isVector4?(y.boundary=16,y.storage=16):b.isMatrix3?(y.boundary=48,y.storage=48):b.isMatrix4?(y.boundary=64,y.storage=64):b.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",b),y}function p(b){const y=b.target;y.removeEventListener("dispose",p);const S=a.indexOf(y.__bindingPointIndex);a.splice(S,1),i.deleteBuffer(s[y.id]),delete s[y.id],delete r[y.id]}function d(){for(const b in s)i.deleteBuffer(s[b]);a=[],s={},r={}}return{bind:l,update:c,dispose:d}}class A8{constructor(e={}){const{canvas:t=Ja(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reverseDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=a;const g=new Uint32Array(4),M=new Int32Array(4);let p=null,d=null;const b=[],y=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Et,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const S=this;let I=!1;this._outputColorSpace=Ae;let L=0,R=0,N=null,E=-1,v=null;const P=new oe,W=new oe;let H=null;const Z=new O0(0);let $=0,q=t.width,j=t.height,k=1,l0=null,f0=null;const T0=new oe(0,0,q,j),z0=new oe(0,0,q,j);let j0=!1;const X=new pr;let n0=!1,M0=!1;const c0=new ce,S0=new ce,X0=new O,R0=new oe,ie={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let se=!1;function q0(){return N===null?k:1}let w=n;function Me(x,D){return t.getContext(x,D)}try{const x={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${us}`),t.addEventListener("webglcontextlost",d0,!1),t.addEventListener("webglcontextrestored",e0,!1),t.addEventListener("webglcontextcreationerror",Y,!1),w===null){const D="webgl2";if(w=Me(D,x),w===null)throw Me(D)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(x){throw console.error("THREE.WebGLRenderer: "+x.message),x}let Y0,Q0,g0,V0,y0,N0,ue,T,_,F,G,K,V,x0,r0,_0,v0,J,u0,w0,b0,s0,L0,C;function a0(){Y0=new N4(w),Y0.init(),s0=new g8(w,Y0),Q0=new R4(w,Y0,e,s0),g0=new m8(w,Y0),Q0.reverseDepthBuffer&&f&&g0.buffers.depth.setReversed(!0),V0=new B4(w),y0=new n8,N0=new _8(w,Y0,g0,y0,Q0,s0,V0),ue=new P4(S),T=new I4(S),_=new G2(w),L0=new b4(w,_),F=new F4(w,_,V0,L0),G=new H4(w,F,_,V0),u0=new z4(w,Q0,N0),_0=new C4(y0),K=new t8(S,ue,T,Y0,Q0,L0,_0),V=new T8(S,y0),x0=new s8,r0=new u8(Y0),J=new A4(S,ue,T,g0,G,m,l),v0=new d8(S,G,Q0),C=new y8(w,V0,Q0,g0),w0=new w4(w,Y0,V0),b0=new O4(w,Y0,V0),V0.programs=K.programs,S.capabilities=Q0,S.extensions=Y0,S.properties=y0,S.renderLists=x0,S.shadowMap=v0,S.state=g0,S.info=V0}a0();const Q=new S8(S,w);this.xr=Q,this.getContext=function(){return w},this.getContextAttributes=function(){return w.getContextAttributes()},this.forceContextLoss=function(){const x=Y0.get("WEBGL_lose_context");x&&x.loseContext()},this.forceContextRestore=function(){const x=Y0.get("WEBGL_lose_context");x&&x.restoreContext()},this.getPixelRatio=function(){return k},this.setPixelRatio=function(x){x!==void 0&&(k=x,this.setSize(q,j,!1))},this.getSize=function(x){return x.set(q,j)},this.setSize=function(x,D,B=!0){if(Q.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}q=x,j=D,t.width=Math.floor(x*k),t.height=Math.floor(D*k),B===!0&&(t.style.width=x+"px",t.style.height=D+"px"),this.setViewport(0,0,x,D)},this.getDrawingBufferSize=function(x){return x.set(q*k,j*k).floor()},this.setDrawingBufferSize=function(x,D,B){q=x,j=D,k=B,t.width=Math.floor(x*B),t.height=Math.floor(D*B),this.setViewport(0,0,x,D)},this.getCurrentViewport=function(x){return x.copy(P)},this.getViewport=function(x){return x.copy(T0)},this.setViewport=function(x,D,B,z){x.isVector4?T0.set(x.x,x.y,x.z,x.w):T0.set(x,D,B,z),g0.viewport(P.copy(T0).multiplyScalar(k).round())},this.getScissor=function(x){return x.copy(z0)},this.setScissor=function(x,D,B,z){x.isVector4?z0.set(x.x,x.y,x.z,x.w):z0.set(x,D,B,z),g0.scissor(W.copy(z0).multiplyScalar(k).round())},this.getScissorTest=function(){return j0},this.setScissorTest=function(x){g0.setScissorTest(j0=x)},this.setOpaqueSort=function(x){l0=x},this.setTransparentSort=function(x){f0=x},this.getClearColor=function(x){return x.copy(J.getClearColor())},this.setClearColor=function(){J.setClearColor(...arguments)},this.getClearAlpha=function(){return J.getClearAlpha()},this.setClearAlpha=function(){J.setClearAlpha(...arguments)},this.clear=function(x=!0,D=!0,B=!0){let z=0;if(x){let U=!1;if(N!==null){const t0=N.texture.format;U=t0===_s||t0===ms||t0===ps}if(U){const t0=N.texture.type,o0=t0===ft||t0===Ht||t0===Hn||t0===kn||t0===fs||t0===ds,m0=J.getClearColor(),h0=J.getClearAlpha(),C0=m0.r,P0=m0.g,E0=m0.b;o0?(g[0]=C0,g[1]=P0,g[2]=E0,g[3]=h0,w.clearBufferuiv(w.COLOR,0,g)):(M[0]=C0,M[1]=P0,M[2]=E0,M[3]=h0,w.clearBufferiv(w.COLOR,0,M))}else z|=w.COLOR_BUFFER_BIT}D&&(z|=w.DEPTH_BUFFER_BIT),B&&(z|=w.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),w.clear(z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",d0,!1),t.removeEventListener("webglcontextrestored",e0,!1),t.removeEventListener("webglcontextcreationerror",Y,!1),J.dispose(),x0.dispose(),r0.dispose(),y0.dispose(),ue.dispose(),T.dispose(),G.dispose(),L0.dispose(),C.dispose(),K.dispose(),Q.dispose(),Q.removeEventListener("sessionstart",Cs),Q.removeEventListener("sessionend",Ps),At.stop()};function d0(x){x.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),I=!0}function e0(){console.log("THREE.WebGLRenderer: Context Restored."),I=!1;const x=V0.autoReset,D=v0.enabled,B=v0.autoUpdate,z=v0.needsUpdate,U=v0.type;a0(),V0.autoReset=x,v0.enabled=D,v0.autoUpdate=B,v0.needsUpdate=z,v0.type=U}function Y(x){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",x.statusMessage)}function p0(x){const D=x.target;D.removeEventListener("dispose",p0),D0(D)}function D0(x){ee(x),y0.remove(x)}function ee(x){const D=y0.get(x).programs;D!==void 0&&(D.forEach(function(B){K.releaseProgram(B)}),x.isShaderMaterial&&K.releaseShaderCache(x))}this.renderBufferDirect=function(x,D,B,z,U,t0){D===null&&(D=ie);const o0=U.isMesh&&U.matrixWorld.determinant()<0,m0=Gr(x,D,B,z,U);g0.setMaterial(z,o0);let h0=B.index,C0=1;if(z.wireframe===!0){if(h0=F.getWireframeAttribute(B),h0===void 0)return;C0=2}const P0=B.drawRange,E0=B.attributes.position;let k0=P0.start*C0,$0=(P0.start+P0.count)*C0;t0!==null&&(k0=Math.max(k0,t0.start*C0),$0=Math.min($0,(t0.start+t0.count)*C0)),h0!==null?(k0=Math.max(k0,0),$0=Math.min($0,h0.count)):E0!=null&&(k0=Math.max(k0,0),$0=Math.min($0,E0.count));const re=$0-k0;if(re<0||re===1/0)return;L0.setup(U,z,m0,B,h0);let ae,G0=w0;if(h0!==null&&(ae=_.get(h0),G0=b0,G0.setIndex(ae)),U.isMesh)z.wireframe===!0?(g0.setLineWidth(z.wireframeLinewidth*q0()),G0.setMode(w.LINES)):G0.setMode(w.TRIANGLES);else if(U.isLine){let A0=z.linewidth;A0===void 0&&(A0=1),g0.setLineWidth(A0*q0()),U.isLineSegments?G0.setMode(w.LINES):U.isLineLoop?G0.setMode(w.LINE_LOOP):G0.setMode(w.LINE_STRIP)}else U.isPoints?G0.setMode(w.POINTS):U.isSprite&&G0.setMode(w.TRIANGLES);if(U.isBatchedMesh)if(U._multiDrawInstances!==null)hn("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),G0.renderMultiDrawInstances(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount,U._multiDrawInstances);else if(Y0.get("WEBGL_multi_draw"))G0.renderMultiDraw(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount);else{const A0=U._multiDrawStarts,pe=U._multiDrawCounts,K0=U._multiDrawCount,Ve=h0?_.get(h0).bytesPerElement:1,Gt=y0.get(z).currentProgram.getUniforms();for(let De=0;De<K0;De++)Gt.setValue(w,"_gl_DrawID",De),G0.render(A0[De]/Ve,pe[De])}else if(U.isInstancedMesh)G0.renderInstances(k0,re,U.count);else if(B.isInstancedBufferGeometry){const A0=B._maxInstanceCount!==void 0?B._maxInstanceCount:1/0,pe=Math.min(B.instanceCount,A0);G0.renderInstances(k0,re,pe)}else G0.render(k0,re)};function Z0(x,D,B){x.transparent===!0&&x.side===Je&&x.forceSinglePass===!1?(x.side=Le,x.needsUpdate=!0,Qn(x,D,B),x.side=Tt,x.needsUpdate=!0,Qn(x,D,B),x.side=Je):Qn(x,D,B)}this.compile=function(x,D,B=null){B===null&&(B=x),d=r0.get(B),d.init(D),y.push(d),B.traverseVisible(function(U){U.isLight&&U.layers.test(D.layers)&&(d.pushLight(U),U.castShadow&&d.pushShadow(U))}),x!==B&&x.traverseVisible(function(U){U.isLight&&U.layers.test(D.layers)&&(d.pushLight(U),U.castShadow&&d.pushShadow(U))}),d.setupLights();const z=new Set;return x.traverse(function(U){if(!(U.isMesh||U.isPoints||U.isLine||U.isSprite))return;const t0=U.material;if(t0)if(Array.isArray(t0))for(let o0=0;o0<t0.length;o0++){const m0=t0[o0];Z0(m0,B,U),z.add(m0)}else Z0(t0,B,U),z.add(t0)}),d=y.pop(),z},this.compileAsync=function(x,D,B=null){const z=this.compile(x,D,B);return new Promise(U=>{function t0(){if(z.forEach(function(o0){y0.get(o0).currentProgram.isReady()&&z.delete(o0)}),z.size===0){U(x);return}setTimeout(t0,10)}Y0.get("KHR_parallel_shader_compile")!==null?t0():setTimeout(t0,10)})};let ke=null;function Qe(x){ke&&ke(x)}function Cs(){At.stop()}function Ps(){At.start()}const At=new vr;At.setAnimationLoop(Qe),typeof self<"u"&&At.setContext(self),this.setAnimationLoop=function(x){ke=x,Q.setAnimationLoop(x),x===null?At.stop():At.start()},Q.addEventListener("sessionstart",Cs),Q.addEventListener("sessionend",Ps),this.render=function(x,D){if(D!==void 0&&D.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;if(x.matrixWorldAutoUpdate===!0&&x.updateMatrixWorld(),D.parent===null&&D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),Q.enabled===!0&&Q.isPresenting===!0&&(Q.cameraAutoUpdate===!0&&Q.updateCamera(D),D=Q.getCamera()),x.isScene===!0&&x.onBeforeRender(S,x,D,N),d=r0.get(x,y.length),d.init(D),y.push(d),S0.multiplyMatrices(D.projectionMatrix,D.matrixWorldInverse),X.setFromProjectionMatrix(S0),M0=this.localClippingEnabled,n0=_0.init(this.clippingPlanes,M0),p=x0.get(x,b.length),p.init(),b.push(p),Q.enabled===!0&&Q.isPresenting===!0){const t0=S.xr.getDepthSensingMesh();t0!==null&&Hi(t0,D,-1/0,S.sortObjects)}Hi(x,D,0,S.sortObjects),p.finish(),S.sortObjects===!0&&p.sort(l0,f0),se=Q.enabled===!1||Q.isPresenting===!1||Q.hasDepthSensing()===!1,se&&J.addToRenderList(p,x),this.info.render.frame++,n0===!0&&_0.beginShadows();const B=d.state.shadowsArray;v0.render(B,x,D),n0===!0&&_0.endShadows(),this.info.autoReset===!0&&this.info.reset();const z=p.opaque,U=p.transmissive;if(d.setupLights(),D.isArrayCamera){const t0=D.cameras;if(U.length>0)for(let o0=0,m0=t0.length;o0<m0;o0++){const h0=t0[o0];Ds(z,U,x,h0)}se&&J.render(x);for(let o0=0,m0=t0.length;o0<m0;o0++){const h0=t0[o0];Ls(p,x,h0,h0.viewport)}}else U.length>0&&Ds(z,U,x,D),se&&J.render(x),Ls(p,x,D);N!==null&&R===0&&(N0.updateMultisampleRenderTarget(N),N0.updateRenderTargetMipmap(N)),x.isScene===!0&&x.onAfterRender(S,x,D),L0.resetDefaultState(),E=-1,v=null,y.pop(),y.length>0?(d=y[y.length-1],n0===!0&&_0.setGlobalState(S.clippingPlanes,d.state.camera)):d=null,b.pop(),b.length>0?p=b[b.length-1]:p=null};function Hi(x,D,B,z){if(x.visible===!1)return;if(x.layers.test(D.layers)){if(x.isGroup)B=x.renderOrder;else if(x.isLOD)x.autoUpdate===!0&&x.update(D);else if(x.isLight)d.pushLight(x),x.castShadow&&d.pushShadow(x);else if(x.isSprite){if(!x.frustumCulled||X.intersectsSprite(x)){z&&R0.setFromMatrixPosition(x.matrixWorld).applyMatrix4(S0);const o0=G.update(x),m0=x.material;m0.visible&&p.push(x,o0,m0,B,R0.z,null)}}else if((x.isMesh||x.isLine||x.isPoints)&&(!x.frustumCulled||X.intersectsObject(x))){const o0=G.update(x),m0=x.material;if(z&&(x.boundingSphere!==void 0?(x.boundingSphere===null&&x.computeBoundingSphere(),R0.copy(x.boundingSphere.center)):(o0.boundingSphere===null&&o0.computeBoundingSphere(),R0.copy(o0.boundingSphere.center)),R0.applyMatrix4(x.matrixWorld).applyMatrix4(S0)),Array.isArray(m0)){const h0=o0.groups;for(let C0=0,P0=h0.length;C0<P0;C0++){const E0=h0[C0],k0=m0[E0.materialIndex];k0&&k0.visible&&p.push(x,o0,k0,B,R0.z,E0)}}else m0.visible&&p.push(x,o0,m0,B,R0.z,null)}}const t0=x.children;for(let o0=0,m0=t0.length;o0<m0;o0++)Hi(t0[o0],D,B,z)}function Ls(x,D,B,z){const U=x.opaque,t0=x.transmissive,o0=x.transparent;d.setupLightsView(B),n0===!0&&_0.setGlobalState(S.clippingPlanes,B),z&&g0.viewport(P.copy(z)),U.length>0&&jn(U,D,B),t0.length>0&&jn(t0,D,B),o0.length>0&&jn(o0,D,B),g0.buffers.depth.setTest(!0),g0.buffers.depth.setMask(!0),g0.buffers.color.setMask(!0),g0.setPolygonOffset(!1)}function Ds(x,D,B,z){if((B.isScene===!0?B.overrideMaterial:null)!==null)return;d.state.transmissionRenderTarget[z.id]===void 0&&(d.state.transmissionRenderTarget[z.id]=new Ze(1,1,{generateMipmaps:!0,type:Y0.has("EXT_color_buffer_half_float")||Y0.has("EXT_color_buffer_float")?Ke:ft,minFilter:Bt,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:W0.workingColorSpace}));const t0=d.state.transmissionRenderTarget[z.id],o0=z.viewport||P;t0.setSize(o0.z*S.transmissionResolutionScale,o0.w*S.transmissionResolutionScale);const m0=S.getRenderTarget();S.setRenderTarget(t0),S.getClearColor(Z),$=S.getClearAlpha(),$<1&&S.setClearColor(16777215,.5),S.clear(),se&&J.render(B);const h0=S.toneMapping;S.toneMapping=Et;const C0=z.viewport;if(z.viewport!==void 0&&(z.viewport=void 0),d.setupLightsView(z),n0===!0&&_0.setGlobalState(S.clippingPlanes,z),jn(x,B,z),N0.updateMultisampleRenderTarget(t0),N0.updateRenderTargetMipmap(t0),Y0.has("WEBGL_multisampled_render_to_texture")===!1){let P0=!1;for(let E0=0,k0=D.length;E0<k0;E0++){const $0=D[E0],re=$0.object,ae=$0.geometry,G0=$0.material,A0=$0.group;if(G0.side===Je&&re.layers.test(z.layers)){const pe=G0.side;G0.side=Le,G0.needsUpdate=!0,Us(re,B,z,ae,G0,A0),G0.side=pe,G0.needsUpdate=!0,P0=!0}}P0===!0&&(N0.updateMultisampleRenderTarget(t0),N0.updateRenderTargetMipmap(t0))}S.setRenderTarget(m0),S.setClearColor(Z,$),C0!==void 0&&(z.viewport=C0),S.toneMapping=h0}function jn(x,D,B){const z=D.isScene===!0?D.overrideMaterial:null;for(let U=0,t0=x.length;U<t0;U++){const o0=x[U],m0=o0.object,h0=o0.geometry,C0=o0.group;let P0=o0.material;P0.allowOverride===!0&&z!==null&&(P0=z),m0.layers.test(B.layers)&&Us(m0,D,B,h0,P0,C0)}}function Us(x,D,B,z,U,t0){x.onBeforeRender(S,D,B,z,U,t0),x.modelViewMatrix.multiplyMatrices(B.matrixWorldInverse,x.matrixWorld),x.normalMatrix.getNormalMatrix(x.modelViewMatrix),U.onBeforeRender(S,D,B,z,x,t0),U.transparent===!0&&U.side===Je&&U.forceSinglePass===!1?(U.side=Le,U.needsUpdate=!0,S.renderBufferDirect(B,D,z,U,x,t0),U.side=Tt,U.needsUpdate=!0,S.renderBufferDirect(B,D,z,U,x,t0),U.side=Je):S.renderBufferDirect(B,D,z,U,x,t0),x.onAfterRender(S,D,B,z,U,t0)}function Qn(x,D,B){D.isScene!==!0&&(D=ie);const z=y0.get(x),U=d.state.lights,t0=d.state.shadowsArray,o0=U.state.version,m0=K.getParameters(x,U.state,t0,D,B),h0=K.getProgramCacheKey(m0);let C0=z.programs;z.environment=x.isMeshStandardMaterial?D.environment:null,z.fog=D.fog,z.envMap=(x.isMeshStandardMaterial?T:ue).get(x.envMap||z.environment),z.envMapRotation=z.environment!==null&&x.envMap===null?D.environmentRotation:x.envMapRotation,C0===void 0&&(x.addEventListener("dispose",p0),C0=new Map,z.programs=C0);let P0=C0.get(h0);if(P0!==void 0){if(z.currentProgram===P0&&z.lightsStateVersion===o0)return Ns(x,m0),P0}else m0.uniforms=K.getUniforms(x),x.onBeforeCompile(m0,S),P0=K.acquireProgram(m0,h0),C0.set(h0,P0),z.uniforms=m0.uniforms;const E0=z.uniforms;return(!x.isShaderMaterial&&!x.isRawShaderMaterial||x.clipping===!0)&&(E0.clippingPlanes=_0.uniform),Ns(x,m0),z.needsLights=Xr(x),z.lightsStateVersion=o0,z.needsLights&&(E0.ambientLightColor.value=U.state.ambient,E0.lightProbe.value=U.state.probe,E0.directionalLights.value=U.state.directional,E0.directionalLightShadows.value=U.state.directionalShadow,E0.spotLights.value=U.state.spot,E0.spotLightShadows.value=U.state.spotShadow,E0.rectAreaLights.value=U.state.rectArea,E0.ltc_1.value=U.state.rectAreaLTC1,E0.ltc_2.value=U.state.rectAreaLTC2,E0.pointLights.value=U.state.point,E0.pointLightShadows.value=U.state.pointShadow,E0.hemisphereLights.value=U.state.hemi,E0.directionalShadowMap.value=U.state.directionalShadowMap,E0.directionalShadowMatrix.value=U.state.directionalShadowMatrix,E0.spotShadowMap.value=U.state.spotShadowMap,E0.spotLightMatrix.value=U.state.spotLightMatrix,E0.spotLightMap.value=U.state.spotLightMap,E0.pointShadowMap.value=U.state.pointShadowMap,E0.pointShadowMatrix.value=U.state.pointShadowMatrix),z.currentProgram=P0,z.uniformsList=null,P0}function Is(x){if(x.uniformsList===null){const D=x.currentProgram.getUniforms();x.uniformsList=Pi.seqWithValue(D.seq,x.uniforms)}return x.uniformsList}function Ns(x,D){const B=y0.get(x);B.outputColorSpace=D.outputColorSpace,B.batching=D.batching,B.batchingColor=D.batchingColor,B.instancing=D.instancing,B.instancingColor=D.instancingColor,B.instancingMorph=D.instancingMorph,B.skinning=D.skinning,B.morphTargets=D.morphTargets,B.morphNormals=D.morphNormals,B.morphColors=D.morphColors,B.morphTargetsCount=D.morphTargetsCount,B.numClippingPlanes=D.numClippingPlanes,B.numIntersection=D.numClipIntersection,B.vertexAlphas=D.vertexAlphas,B.vertexTangents=D.vertexTangents,B.toneMapping=D.toneMapping}function Gr(x,D,B,z,U){D.isScene!==!0&&(D=ie),N0.resetTextureUnits();const t0=D.fog,o0=z.isMeshStandardMaterial?D.environment:null,m0=N===null?S.outputColorSpace:N.isXRRenderTarget===!0?N.texture.colorSpace:gn,h0=(z.isMeshStandardMaterial?T:ue).get(z.envMap||o0),C0=z.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,P0=!!B.attributes.tangent&&(!!z.normalMap||z.anisotropy>0),E0=!!B.morphAttributes.position,k0=!!B.morphAttributes.normal,$0=!!B.morphAttributes.color;let re=Et;z.toneMapped&&(N===null||N.isXRRenderTarget===!0)&&(re=S.toneMapping);const ae=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,G0=ae!==void 0?ae.length:0,A0=y0.get(z),pe=d.state.lights;if(n0===!0&&(M0===!0||x!==v)){const Se=x===v&&z.id===E;_0.setState(z,x,Se)}let K0=!1;z.version===A0.__version?(A0.needsLights&&A0.lightsStateVersion!==pe.state.version||A0.outputColorSpace!==m0||U.isBatchedMesh&&A0.batching===!1||!U.isBatchedMesh&&A0.batching===!0||U.isBatchedMesh&&A0.batchingColor===!0&&U.colorTexture===null||U.isBatchedMesh&&A0.batchingColor===!1&&U.colorTexture!==null||U.isInstancedMesh&&A0.instancing===!1||!U.isInstancedMesh&&A0.instancing===!0||U.isSkinnedMesh&&A0.skinning===!1||!U.isSkinnedMesh&&A0.skinning===!0||U.isInstancedMesh&&A0.instancingColor===!0&&U.instanceColor===null||U.isInstancedMesh&&A0.instancingColor===!1&&U.instanceColor!==null||U.isInstancedMesh&&A0.instancingMorph===!0&&U.morphTexture===null||U.isInstancedMesh&&A0.instancingMorph===!1&&U.morphTexture!==null||A0.envMap!==h0||z.fog===!0&&A0.fog!==t0||A0.numClippingPlanes!==void 0&&(A0.numClippingPlanes!==_0.numPlanes||A0.numIntersection!==_0.numIntersection)||A0.vertexAlphas!==C0||A0.vertexTangents!==P0||A0.morphTargets!==E0||A0.morphNormals!==k0||A0.morphColors!==$0||A0.toneMapping!==re||A0.morphTargetsCount!==G0)&&(K0=!0):(K0=!0,A0.__version=z.version);let Ve=A0.currentProgram;K0===!0&&(Ve=Qn(z,D,U));let Gt=!1,De=!1,An=!1;const te=Ve.getUniforms(),Ne=A0.uniforms;if(g0.useProgram(Ve.program)&&(Gt=!0,De=!0,An=!0),z.id!==E&&(E=z.id,De=!0),Gt||v!==x){g0.buffers.depth.getReversed()?(c0.copy(x.projectionMatrix),Qa(c0),e2(c0),te.setValue(w,"projectionMatrix",c0)):te.setValue(w,"projectionMatrix",x.projectionMatrix),te.setValue(w,"viewMatrix",x.matrixWorldInverse);const Ce=te.map.cameraPosition;Ce!==void 0&&Ce.setValue(w,X0.setFromMatrixPosition(x.matrixWorld)),Q0.logarithmicDepthBuffer&&te.setValue(w,"logDepthBufFC",2/(Math.log(x.far+1)/Math.LN2)),(z.isMeshPhongMaterial||z.isMeshToonMaterial||z.isMeshLambertMaterial||z.isMeshBasicMaterial||z.isMeshStandardMaterial||z.isShaderMaterial)&&te.setValue(w,"isOrthographic",x.isOrthographicCamera===!0),v!==x&&(v=x,De=!0,An=!0)}if(U.isSkinnedMesh){te.setOptional(w,U,"bindMatrix"),te.setOptional(w,U,"bindMatrixInverse");const Se=U.skeleton;Se&&(Se.boneTexture===null&&Se.computeBoneTexture(),te.setValue(w,"boneTexture",Se.boneTexture,N0))}U.isBatchedMesh&&(te.setOptional(w,U,"batchingTexture"),te.setValue(w,"batchingTexture",U._matricesTexture,N0),te.setOptional(w,U,"batchingIdTexture"),te.setValue(w,"batchingIdTexture",U._indirectTexture,N0),te.setOptional(w,U,"batchingColorTexture"),U._colorsTexture!==null&&te.setValue(w,"batchingColorTexture",U._colorsTexture,N0));const Fe=B.morphAttributes;if((Fe.position!==void 0||Fe.normal!==void 0||Fe.color!==void 0)&&u0.update(U,B,Ve),(De||A0.receiveShadow!==U.receiveShadow)&&(A0.receiveShadow=U.receiveShadow,te.setValue(w,"receiveShadow",U.receiveShadow)),z.isMeshGouraudMaterial&&z.envMap!==null&&(Ne.envMap.value=h0,Ne.flipEnvMap.value=h0.isCubeTexture&&h0.isRenderTargetTexture===!1?-1:1),z.isMeshStandardMaterial&&z.envMap===null&&D.environment!==null&&(Ne.envMapIntensity.value=D.environmentIntensity),De&&(te.setValue(w,"toneMappingExposure",S.toneMappingExposure),A0.needsLights&&Wr(Ne,An),t0&&z.fog===!0&&V.refreshFogUniforms(Ne,t0),V.refreshMaterialUniforms(Ne,z,k,j,d.state.transmissionRenderTarget[x.id]),Pi.upload(w,Is(A0),Ne,N0)),z.isShaderMaterial&&z.uniformsNeedUpdate===!0&&(Pi.upload(w,Is(A0),Ne,N0),z.uniformsNeedUpdate=!1),z.isSpriteMaterial&&te.setValue(w,"center",U.center),te.setValue(w,"modelViewMatrix",U.modelViewMatrix),te.setValue(w,"normalMatrix",U.normalMatrix),te.setValue(w,"modelMatrix",U.matrixWorld),z.isShaderMaterial||z.isRawShaderMaterial){const Se=z.uniformsGroups;for(let Ce=0,ki=Se.length;Ce<ki;Ce++){const bt=Se[Ce];C.update(bt,Ve),C.bind(bt,Ve)}}return Ve}function Wr(x,D){x.ambientLightColor.needsUpdate=D,x.lightProbe.needsUpdate=D,x.directionalLights.needsUpdate=D,x.directionalLightShadows.needsUpdate=D,x.pointLights.needsUpdate=D,x.pointLightShadows.needsUpdate=D,x.spotLights.needsUpdate=D,x.spotLightShadows.needsUpdate=D,x.rectAreaLights.needsUpdate=D,x.hemisphereLights.needsUpdate=D}function Xr(x){return x.isMeshLambertMaterial||x.isMeshToonMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isShadowMaterial||x.isShaderMaterial&&x.lights===!0}this.getActiveCubeFace=function(){return L},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return N},this.setRenderTargetTextures=function(x,D,B){const z=y0.get(x);z.__autoAllocateDepthBuffer=x.resolveDepthBuffer===!1,z.__autoAllocateDepthBuffer===!1&&(z.__useRenderToTexture=!1),y0.get(x.texture).__webglTexture=D,y0.get(x.depthTexture).__webglTexture=z.__autoAllocateDepthBuffer?void 0:B,z.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(x,D){const B=y0.get(x);B.__webglFramebuffer=D,B.__useDefaultFramebuffer=D===void 0};const qr=w.createFramebuffer();this.setRenderTarget=function(x,D=0,B=0){N=x,L=D,R=B;let z=!0,U=null,t0=!1,o0=!1;if(x){const h0=y0.get(x);if(h0.__useDefaultFramebuffer!==void 0)g0.bindFramebuffer(w.FRAMEBUFFER,null),z=!1;else if(h0.__webglFramebuffer===void 0)N0.setupRenderTarget(x);else if(h0.__hasExternalTextures)N0.rebindTextures(x,y0.get(x.texture).__webglTexture,y0.get(x.depthTexture).__webglTexture);else if(x.depthBuffer){const E0=x.depthTexture;if(h0.__boundDepthTexture!==E0){if(E0!==null&&y0.has(E0)&&(x.width!==E0.image.width||x.height!==E0.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");N0.setupDepthRenderbuffer(x)}}const C0=x.texture;(C0.isData3DTexture||C0.isDataArrayTexture||C0.isCompressedArrayTexture)&&(o0=!0);const P0=y0.get(x).__webglFramebuffer;x.isWebGLCubeRenderTarget?(Array.isArray(P0[D])?U=P0[D][B]:U=P0[D],t0=!0):x.samples>0&&N0.useMultisampledRTT(x)===!1?U=y0.get(x).__webglMultisampledFramebuffer:Array.isArray(P0)?U=P0[B]:U=P0,P.copy(x.viewport),W.copy(x.scissor),H=x.scissorTest}else P.copy(T0).multiplyScalar(k).floor(),W.copy(z0).multiplyScalar(k).floor(),H=j0;if(B!==0&&(U=qr),g0.bindFramebuffer(w.FRAMEBUFFER,U)&&z&&g0.drawBuffers(x,U),g0.viewport(P),g0.scissor(W),g0.setScissorTest(H),t0){const h0=y0.get(x.texture);w.framebufferTexture2D(w.FRAMEBUFFER,w.COLOR_ATTACHMENT0,w.TEXTURE_CUBE_MAP_POSITIVE_X+D,h0.__webglTexture,B)}else if(o0){const h0=y0.get(x.texture),C0=D;w.framebufferTextureLayer(w.FRAMEBUFFER,w.COLOR_ATTACHMENT0,h0.__webglTexture,B,C0)}else if(x!==null&&B!==0){const h0=y0.get(x.texture);w.framebufferTexture2D(w.FRAMEBUFFER,w.COLOR_ATTACHMENT0,w.TEXTURE_2D,h0.__webglTexture,B)}E=-1},this.readRenderTargetPixels=function(x,D,B,z,U,t0,o0,m0=0){if(!(x&&x.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let h0=y0.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&o0!==void 0&&(h0=h0[o0]),h0){g0.bindFramebuffer(w.FRAMEBUFFER,h0);try{const C0=x.textures[m0],P0=C0.format,E0=C0.type;if(!Q0.textureFormatReadable(P0)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Q0.textureTypeReadable(E0)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}D>=0&&D<=x.width-z&&B>=0&&B<=x.height-U&&(x.textures.length>1&&w.readBuffer(w.COLOR_ATTACHMENT0+m0),w.readPixels(D,B,z,U,s0.convert(P0),s0.convert(E0),t0))}finally{const C0=N!==null?y0.get(N).__webglFramebuffer:null;g0.bindFramebuffer(w.FRAMEBUFFER,C0)}}},this.readRenderTargetPixelsAsync=async function(x,D,B,z,U,t0,o0,m0=0){if(!(x&&x.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let h0=y0.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&o0!==void 0&&(h0=h0[o0]),h0)if(D>=0&&D<=x.width-z&&B>=0&&B<=x.height-U){g0.bindFramebuffer(w.FRAMEBUFFER,h0);const C0=x.textures[m0],P0=C0.format,E0=C0.type;if(!Q0.textureFormatReadable(P0))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Q0.textureTypeReadable(E0))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const k0=w.createBuffer();w.bindBuffer(w.PIXEL_PACK_BUFFER,k0),w.bufferData(w.PIXEL_PACK_BUFFER,t0.byteLength,w.STREAM_READ),x.textures.length>1&&w.readBuffer(w.COLOR_ATTACHMENT0+m0),w.readPixels(D,B,z,U,s0.convert(P0),s0.convert(E0),0);const $0=N!==null?y0.get(N).__webglFramebuffer:null;g0.bindFramebuffer(w.FRAMEBUFFER,$0);const re=w.fenceSync(w.SYNC_GPU_COMMANDS_COMPLETE,0);return w.flush(),await ja(w,re,4),w.bindBuffer(w.PIXEL_PACK_BUFFER,k0),w.getBufferSubData(w.PIXEL_PACK_BUFFER,0,t0),w.deleteBuffer(k0),w.deleteSync(re),t0}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(x,D=null,B=0){const z=Math.pow(2,-B),U=Math.floor(x.image.width*z),t0=Math.floor(x.image.height*z),o0=D!==null?D.x:0,m0=D!==null?D.y:0;N0.setTexture2D(x,0),w.copyTexSubImage2D(w.TEXTURE_2D,B,0,0,o0,m0,U,t0),g0.unbindTexture()};const Yr=w.createFramebuffer(),Kr=w.createFramebuffer();this.copyTextureToTexture=function(x,D,B=null,z=null,U=0,t0=null){t0===null&&(U!==0?(hn("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),t0=U,U=0):t0=0);let o0,m0,h0,C0,P0,E0,k0,$0,re;const ae=x.isCompressedTexture?x.mipmaps[t0]:x.image;if(B!==null)o0=B.max.x-B.min.x,m0=B.max.y-B.min.y,h0=B.isBox3?B.max.z-B.min.z:1,C0=B.min.x,P0=B.min.y,E0=B.isBox3?B.min.z:0;else{const Fe=Math.pow(2,-U);o0=Math.floor(ae.width*Fe),m0=Math.floor(ae.height*Fe),x.isDataArrayTexture?h0=ae.depth:x.isData3DTexture?h0=Math.floor(ae.depth*Fe):h0=1,C0=0,P0=0,E0=0}z!==null?(k0=z.x,$0=z.y,re=z.z):(k0=0,$0=0,re=0);const G0=s0.convert(D.format),A0=s0.convert(D.type);let pe;D.isData3DTexture?(N0.setTexture3D(D,0),pe=w.TEXTURE_3D):D.isDataArrayTexture||D.isCompressedArrayTexture?(N0.setTexture2DArray(D,0),pe=w.TEXTURE_2D_ARRAY):(N0.setTexture2D(D,0),pe=w.TEXTURE_2D),w.pixelStorei(w.UNPACK_FLIP_Y_WEBGL,D.flipY),w.pixelStorei(w.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),w.pixelStorei(w.UNPACK_ALIGNMENT,D.unpackAlignment);const K0=w.getParameter(w.UNPACK_ROW_LENGTH),Ve=w.getParameter(w.UNPACK_IMAGE_HEIGHT),Gt=w.getParameter(w.UNPACK_SKIP_PIXELS),De=w.getParameter(w.UNPACK_SKIP_ROWS),An=w.getParameter(w.UNPACK_SKIP_IMAGES);w.pixelStorei(w.UNPACK_ROW_LENGTH,ae.width),w.pixelStorei(w.UNPACK_IMAGE_HEIGHT,ae.height),w.pixelStorei(w.UNPACK_SKIP_PIXELS,C0),w.pixelStorei(w.UNPACK_SKIP_ROWS,P0),w.pixelStorei(w.UNPACK_SKIP_IMAGES,E0);const te=x.isDataArrayTexture||x.isData3DTexture,Ne=D.isDataArrayTexture||D.isData3DTexture;if(x.isDepthTexture){const Fe=y0.get(x),Se=y0.get(D),Ce=y0.get(Fe.__renderTarget),ki=y0.get(Se.__renderTarget);g0.bindFramebuffer(w.READ_FRAMEBUFFER,Ce.__webglFramebuffer),g0.bindFramebuffer(w.DRAW_FRAMEBUFFER,ki.__webglFramebuffer);for(let bt=0;bt<h0;bt++)te&&(w.framebufferTextureLayer(w.READ_FRAMEBUFFER,w.COLOR_ATTACHMENT0,y0.get(x).__webglTexture,U,E0+bt),w.framebufferTextureLayer(w.DRAW_FRAMEBUFFER,w.COLOR_ATTACHMENT0,y0.get(D).__webglTexture,t0,re+bt)),w.blitFramebuffer(C0,P0,o0,m0,k0,$0,o0,m0,w.DEPTH_BUFFER_BIT,w.NEAREST);g0.bindFramebuffer(w.READ_FRAMEBUFFER,null),g0.bindFramebuffer(w.DRAW_FRAMEBUFFER,null)}else if(U!==0||x.isRenderTargetTexture||y0.has(x)){const Fe=y0.get(x),Se=y0.get(D);g0.bindFramebuffer(w.READ_FRAMEBUFFER,Yr),g0.bindFramebuffer(w.DRAW_FRAMEBUFFER,Kr);for(let Ce=0;Ce<h0;Ce++)te?w.framebufferTextureLayer(w.READ_FRAMEBUFFER,w.COLOR_ATTACHMENT0,Fe.__webglTexture,U,E0+Ce):w.framebufferTexture2D(w.READ_FRAMEBUFFER,w.COLOR_ATTACHMENT0,w.TEXTURE_2D,Fe.__webglTexture,U),Ne?w.framebufferTextureLayer(w.DRAW_FRAMEBUFFER,w.COLOR_ATTACHMENT0,Se.__webglTexture,t0,re+Ce):w.framebufferTexture2D(w.DRAW_FRAMEBUFFER,w.COLOR_ATTACHMENT0,w.TEXTURE_2D,Se.__webglTexture,t0),U!==0?w.blitFramebuffer(C0,P0,o0,m0,k0,$0,o0,m0,w.COLOR_BUFFER_BIT,w.NEAREST):Ne?w.copyTexSubImage3D(pe,t0,k0,$0,re+Ce,C0,P0,o0,m0):w.copyTexSubImage2D(pe,t0,k0,$0,C0,P0,o0,m0);g0.bindFramebuffer(w.READ_FRAMEBUFFER,null),g0.bindFramebuffer(w.DRAW_FRAMEBUFFER,null)}else Ne?x.isDataTexture||x.isData3DTexture?w.texSubImage3D(pe,t0,k0,$0,re,o0,m0,h0,G0,A0,ae.data):D.isCompressedArrayTexture?w.compressedTexSubImage3D(pe,t0,k0,$0,re,o0,m0,h0,G0,ae.data):w.texSubImage3D(pe,t0,k0,$0,re,o0,m0,h0,G0,A0,ae):x.isDataTexture?w.texSubImage2D(w.TEXTURE_2D,t0,k0,$0,o0,m0,G0,A0,ae.data):x.isCompressedTexture?w.compressedTexSubImage2D(w.TEXTURE_2D,t0,k0,$0,ae.width,ae.height,G0,ae.data):w.texSubImage2D(w.TEXTURE_2D,t0,k0,$0,o0,m0,G0,A0,ae);w.pixelStorei(w.UNPACK_ROW_LENGTH,K0),w.pixelStorei(w.UNPACK_IMAGE_HEIGHT,Ve),w.pixelStorei(w.UNPACK_SKIP_PIXELS,Gt),w.pixelStorei(w.UNPACK_SKIP_ROWS,De),w.pixelStorei(w.UNPACK_SKIP_IMAGES,An),t0===0&&D.generateMipmaps&&w.generateMipmap(pe),g0.unbindTexture()},this.copyTextureToTexture3D=function(x,D,B=null,z=null,U=0){return hn('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(x,D,B,z,U)},this.initRenderTarget=function(x){y0.get(x).__webglFramebuffer===void 0&&N0.setupRenderTarget(x)},this.initTexture=function(x){x.isCubeTexture?N0.setTextureCube(x,0):x.isData3DTexture?N0.setTexture3D(x,0):x.isDataArrayTexture||x.isCompressedArrayTexture?N0.setTexture2DArray(x,0):N0.setTexture2D(x,0),g0.unbindTexture()},this.resetState=function(){L=0,R=0,N=null,g0.reset(),L0.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return lt}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=W0._getDrawingBufferColorSpace(e),t.unpackColorSpace=W0._getUnpackColorSpace()}}class vn{static init(){const e=[1,0,0,2e-5,1,0,0,503905e-9,1,0,0,.00201562,1,0,0,.00453516,1,0,0,.00806253,1,0,0,.0125978,1,0,0,.018141,1,0,0,.0246924,1,0,0,.0322525,1,0,0,.0408213,1,0,0,.0503999,1,0,0,.0609894,1,0,0,.0725906,1,0,0,.0852058,1,0,0,.0988363,1,0,0,.113484,1,0,0,.129153,1,0,0,.145839,1,0,0,.163548,1,0,0,.182266,1,0,0,.201942,1,0,0,.222314,1,0,0,.241906,1,0,0,.262314,1,0,0,.285754,1,0,0,.310159,1,0,0,.335426,1,0,0,.361341,1,0,0,.387445,1,0,0,.412784,1,0,0,.438197,1,0,0,.466966,1,0,0,.49559,1,0,0,.523448,1,0,0,.549938,1,0,0,.57979,1,0,0,.608746,1,0,0,.636185,1,0,0,.664748,1,0,0,.69313,1,0,0,.71966,1,0,0,.747662,1,0,0,.774023,1,0,0,.799775,1,0,0,.825274,1,0,0,.849156,1,0,0,.873248,1,0,0,.89532,1,0,0,.917565,1,0,0,.937863,1,0,0,.958139,1,0,0,.976563,1,0,0,.994658,1,0,0,1.0112,1,0,0,1.02712,1,0,0,1.04189,1,0,0,1.05568,1,0,0,1.06877,1,0,0,1.08058,1,0,0,1.09194,1,0,0,1.10191,1,0,0,1.11161,1,0,0,1.1199,1,0,0,1.12813,.999547,-448815e-12,.0224417,199902e-10,.999495,-113079e-10,.0224406,503651e-9,.999496,-452317e-10,.0224406,.00201461,.999496,-101772e-9,.0224406,.00453287,.999495,-180928e-9,.0224406,.00805845,.999497,-282702e-9,.0224406,.0125914,.999496,-407096e-9,.0224406,.0181319,.999498,-554114e-9,.0224406,.02468,.999499,-723768e-9,.0224406,.0322363,.999495,-916058e-9,.0224405,.0408009,.999499,-.00113101,.0224408,.050375,.999494,-.00136863,.0224405,.0609586,.999489,-.00162896,.0224401,.0725537,.999489,-.00191201,.0224414,.0851619,.999498,-.00221787,.0224413,.0987867,.999492,-.00254642,.0224409,.113426,.999507,-.00289779,.0224417,.129088,.999494,-.0032716,.0224386,.145767,.999546,-.0036673,.0224424,.163472,.999543,-.00408166,.0224387,.182182,.999499,-.00450056,.0224338,.201843,.999503,-.00483661,.0224203,.222198,.999546,-.00452928,.022315,.241714,.999508,-.00587403,.0224329,.262184,.999509,-.00638806,.0224271,.285609,.999501,-.00691028,.0224166,.309998,.999539,-.00741979,.0223989,.335262,.999454,-.00786282,.0223675,.361154,.999529,-.00811928,.0222828,.387224,.999503,-.00799941,.0221063,.41252,.999561,-.00952753,.0223057,.438006,.999557,-.0099134,.0222065,.466735,.999541,-.0100935,.0220402,.495332,.999562,-.00996821,.0218067,.523197,.999556,-.0105031,.0217096,.550223,.999561,-.0114191,.0217215,.579498,.999588,-.0111818,.0213357,.608416,.999633,-.0107725,.0208689,.635965,.999527,-.0121671,.0210149,.664476,.999508,-.0116005,.020431,.692786,.999568,-.0115604,.0199791,.719709,.999671,-.0121117,.0197415,.74737,.999688,-.0110769,.0188846,.773692,.99962,-.0122368,.0188452,.799534,.999823,-.0110325,.0178001,.825046,.999599,-.0114923,.0174221,.849075,.999619,-.0105923,.0164345,.872999,.999613,-.0105988,.0158227,.895371,.99964,-.00979861,.0148131,.917364,.99977,-.00967238,.0140721,.938002,.999726,-.00869175,.0129543,.957917,.99973,-.00866872,.0122329,.976557,.999773,-.00731956,.0108958,.994459,.999811,-.00756027,.0102715,1.01118,.999862,-.00583732,.00878781,1.02701,.999835,-.00631438,.00827529,1.04186,.999871,-.00450785,.00674583,1.05569,.999867,-.00486079,.00621041,1.06861,.999939,-.00322072,.00478301,1.08064,.999918,-.00318199,.00406395,1.09181,1.00003,-.00193348,.00280682,1.10207,.999928,-.00153729,.00198741,1.11152,.999933,-623666e-9,917714e-9,1.12009,1,-102387e-11,907581e-12,1.12813,.997866,-896716e-12,.0448334,199584e-10,.997987,-225945e-10,.0448389,502891e-9,.997987,-903781e-10,.0448388,.00201156,.997985,-203351e-9,.0448388,.00452602,.997986,-361514e-9,.0448388,.00804629,.997987,-56487e-8,.0448389,.0125724,.997988,-813423e-9,.0448389,.0181045,.997984,-.00110718,.0448387,.0246427,.997985,-.00144616,.0448388,.0321875,.997987,-.00183038,.044839,.0407392,.997983,-.00225987,.0448387,.0502986,.997991,-.00273467,.0448389,.0608667,.997984,-.00325481,.0448384,.0724444,.998002,-.00382043,.044839,.0850348,.997997,-.00443145,.0448396,.0986372,.998007,-.00508796,.0448397,.113255,.998008,-.00578985,.04484,.128891,.998003,-.00653683,.0448384,.145548,.997983,-.00732713,.0448358,.163221,.997985,-.00815454,.0448358,.181899,.998005,-.00898985,.0448286,.201533,.998026,-.00964404,.0447934,.221821,.998055,-.00922677,.044611,.241282,.99804,-.0117361,.0448245,.261791,.998048,-.0127628,.0448159,.285181,.998088,-.0138055,.0447996,.30954,.998058,-.0148206,.0447669,.334751,.998099,-.0156998,.044697,.36061,.998116,-.0161976,.0445122,.386603,.998195,-.015945,.0441711,.411844,.998168,-.0183947,.0444255,.43773,.998184,-.0197913,.0443809,.466009,.998251,-.0201426,.0440689,.494574,.998305,-.0198847,.0435632,.522405,.998273,-.0210577,.043414,.549967,.998254,-.0227901,.0433943,.578655,.998349,-.0223108,.0426529,.60758,.99843,-.0223088,.042,.635524,.998373,-.0241141,.0418987,.663621,.998425,-.0231446,.0408118,.691906,.998504,-.0233684,.0400565,.719339,.998443,-.0241652,.0394634,.74643,.99848,-.0228715,.0380002,.773086,.998569,-.023519,.0372322,.798988,.998619,-.0223108,.0356468,.824249,.998594,-.0223105,.034523,.848808,.998622,-.0213426,.0328887,.87227,.998669,-.0207912,.0314374,.895157,.998705,-.0198416,.0296925,.916769,.998786,-.0189168,.0279634,.937773,.998888,-.0178811,.0261597,.957431,.99906,-.0166845,.0242159,.976495,.999038,-.0155464,.0222638,.994169,.999237,-.0141349,.0201967,1.01112,.999378,-.0129324,.0181744,1.02692,.999433,-.0113192,.0159898,1.04174,.999439,-.0101244,.0140385,1.05559,.999614,-.00837456,.0117826,1.06852,.999722,-.00721769,.00983745,1.08069,.999817,-.00554067,.00769002,1.09176,.99983,-.00426961,.005782,1.10211,.999964,-.00273904,.00374503,1.11152,1.00001,-.00136739,.00187176,1.12031,.999946,393227e-10,-28919e-9,1.12804,.995847,-13435e-10,.0671785,19916e-9,.995464,-338387e-10,.0671527,501622e-9,.99547,-135355e-9,.0671531,.00200649,.995471,-30455e-8,.0671532,.00451461,.99547,-541423e-9,.0671531,.008026,.995471,-84598e-8,.0671531,.0125407,.99547,-.00121823,.0671531,.0180589,.99547,-.00165817,.0671531,.0245806,.995463,-.00216583,.0671526,.0321062,.995468,-.00274127,.0671527,.0406366,.995474,-.00338447,.0671534,.0501717,.995473,-.00409554,.0671533,.0607131,.995478,-.00487451,.0671531,.0722618,.995476,-.00572148,.0671532,.0848191,.995477,-.00663658,.0671539,.0983882,.995498,-.00761986,.0671541,.112972,.995509,-.00867094,.0671542,.128568,.995509,-.00978951,.0671531,.145183,.995503,-.0109725,.0671491,.162808,.995501,-.012211,.0671465,.181441,.99553,-.0134565,.0671371,.201015,.99555,-.014391,.0670831,.221206,.99558,-.014351,.0668883,.240813,.995577,-.0173997,.0671055,.261257,.995602,-.0191111,.0671178,.284467,.995623,-.0206705,.0670946,.308765,.995658,-.022184,.0670472,.333905,.995705,-.0234832,.0669417,.359677,.995719,-.0241933,.0666714,.385554,.995786,-.0243539,.066266,.410951,.995887,-.0271866,.0664367,.437163,.995944,-.0296012,.0664931,.464842,.996004,-.0301045,.0660105,.49332,.996128,-.0298311,.0652694,.521131,.996253,-.0316426,.0650739,.549167,.996244,-.0339043,.0649433,.57737,.996309,-.033329,.0638926,.606073,.996417,-.0338935,.0630849,.634527,.996372,-.0353104,.0625083,.66256,.996542,-.0348942,.0611986,.690516,.996568,-.0351614,.060069,.718317,.996711,-.0354317,.0588522,.74528,.996671,-.0349513,.0571902,.772061,.996865,-.0345622,.0555321,.798089,.996802,-.0342566,.0537816,.823178,.996992,-.0330862,.0516095,.847949,.996944,-.0324666,.0495537,.871431,.997146,-.0309544,.0470302,.894357,.997189,-.0299372,.0446043,.916142,.997471,-.0281389,.0418812,.937193,.997515,-.0268702,.0391823,.957,.997812,-.0247166,.0361338,.975936,.998027,-.0233525,.0333945,.99391,.998233,-.0209839,.0301917,1.01075,.998481,-.0194309,.027271,1.02669,.998859,-.0169728,.0240162,1.04173,.99894,-.0152322,.0210517,1.05551,.999132,-.0127497,.0178632,1.06856,.999369,-.0108282,.014787,1.08054,.999549,-.00845886,.0116185,1.09185,.999805,-.0063937,.00867209,1.10207,.99985,-.00414582,.00566823,1.1117,.999912,-.00207443,.00277562,1.12022,1.00001,870226e-10,-53766e-9,1.12832,.991943,-178672e-11,.0893382,198384e-10,.991952,-450183e-10,.089339,499849e-9,.991956,-180074e-9,.0893394,.0019994,.991955,-405167e-9,.0893393,.00449867,.991953,-720298e-9,.0893391,.00799764,.991955,-.00112548,.0893393,.0124964,.991957,-.0016207,.0893395,.0179951,.991958,-.00220601,.0893396,.0244939,.991947,-.00288137,.0893385,.0319929,.991962,-.00364693,.0893399,.0404933,.991965,-.00450264,.0893399,.049995,.99198,-.00544862,.0893411,.0604995,.99197,-.00648491,.0893397,.0720074,.991976,-.00761164,.089341,.0845207,.99198,-.00882891,.0893405,.0980413,.991982,-.0101367,.0893396,.112571,.992008,-.011535,.0893415,.128115,.992026,-.0130228,.0893414,.144672,.992064,-.0145966,.0893418,.162241,.992041,-.0162421,.0893359,.180801,.992086,-.0178888,.0893214,.200302,.992157,-.0190368,.0892401,.220332,.992181,-.0195584,.0890525,.240144,.992175,-.0227257,.0892153,.260728,.99221,-.0254195,.089304,.283473,.99222,-.0274883,.0892703,.307673,.992317,-.0294905,.0892027,.332729,.992374,-.0311861,.0890577,.358387,.992505,-.0320656,.0886994,.384102,.992568,-.0329715,.0883198,.409767,.992675,-.036006,.0883602,.436145,.992746,-.0392897,.0884591,.463217,.992873,-.0399337,.0878287,.491557,.992934,-.040231,.0870108,.519516,.993091,-.0422013,.0865857,.547741,.993259,-.0443503,.0861937,.575792,.993455,-.0446368,.0851187,.604233,.993497,-.0454299,.0840576,.632925,.993694,-.0463296,.0829671,.660985,.993718,-.0470619,.0817185,.688714,.993973,-.0468838,.0800294,.716743,.994207,-.046705,.0781286,.74377,.994168,-.0469698,.0763337,.77042,.9945,-.0456816,.0738184,.796659,.994356,-.0455518,.0715545,.821868,.994747,-.0439488,.0686085,.846572,.994937,-.0430056,.065869,.870435,.995142,-.0413414,.0626446,.893272,.995451,-.0396521,.05929,.915376,.995445,-.0378453,.0558503,.936196,.995967,-.0355219,.0520949,.956376,.996094,-.0335146,.048377,.975327,.996622,-.030682,.0442575,.993471,.996938,-.0285504,.0404693,1.01052,.997383,-.0253399,.0360903,1.02637,.997714,-.0231651,.0322176,1.04139,.998249,-.0198138,.0278433,1.05542,.998596,-.0174337,.0238759,1.06846,.998946,-.0141349,.0195944,1.08056,.99928,-.0115603,.0156279,1.09181,.999507,-.00839065,.0114607,1.10213,.999697,-.005666,.00763325,1.11169,.999869,-.00269902,.00364946,1.12042,1.00001,623836e-10,-319288e-10,1.12832,.987221,-222675e-11,.111332,197456e-10,.98739,-561116e-10,.111351,497563e-9,.987448,-224453e-9,.111357,.00199031,.987441,-505019e-9,.111357,.0044782,.987442,-897816e-9,.111357,.00796129,.987442,-.00140284,.111357,.0124396,.987444,-.00202012,.111357,.0179132,.987442,-.00274964,.111357,.0243824,.987446,-.00359147,.111357,.0318474,.987435,-.00454562,.111356,.0403086,.987461,-.00561225,.111358,.0497678,.987458,-.00679125,.111358,.0602239,.987443,-.0080828,.111356,.0716792,.987476,-.0094872,.111358,.0841364,.98749,-.0110044,.111361,.097597,.987508,-.0126344,.111362,.112062,.987494,-.0143767,.111357,.127533,.987526,-.0162307,.111359,.144015,.987558,-.0181912,.111361,.161502,.987602,-.0202393,.111355,.179979,.987692,-.022273,.111346,.199386,.987702,-.0235306,.111215,.219183,.987789,-.0247628,.111061,.239202,.987776,-.0280668,.111171,.259957,.987856,-.0316751,.111327,.282198,.987912,-.0342468,.111282,.306294,.988,-.0367205,.111198,.331219,.988055,-.0387766,.110994,.356708,.988241,-.0397722,.110547,.382234,.988399,-.0416076,.110198,.408227,.988539,-.0448192,.110137,.434662,.988661,-.0483793,.110143,.461442,.988967,-.0495895,.109453,.489318,.989073,-.0506797,.108628,.517516,.989274,-.0526953,.108003,.545844,.989528,-.054578,.107255,.573823,.989709,-.0561503,.106294,.601944,.989991,-.056866,.104896,.630855,.990392,-.0572914,.103336,.658925,.990374,-.0586224,.10189,.686661,.990747,-.0584764,.099783,.714548,.991041,-.0582662,.0974309,.74186,.991236,-.0584118,.0951678,.768422,.991585,-.0573055,.0921581,.794817,.991984,-.0564241,.0891167,.820336,.9921,-.0553608,.085805,.84493,.992749,-.0533816,.0820354,.868961,.99288,-.0518661,.0782181,.891931,.993511,-.0492492,.0738935,.914186,.993617,-.0471956,.0696402,.93532,.99411,-.044216,.0649659,.95543,.994595,-.0416654,.0603177,.974685,.994976,-.0384314,.0553493,.992807,.995579,-.0353491,.0503942,1.00996,.996069,-.0319787,.0452123,1.02606,.996718,-.028472,.0400112,1.04114,.997173,-.0250789,.0349456,1.05517,.997818,-.0213326,.029653,1.0683,.998318,-.0178509,.024549,1.0805,.998853,-.0141118,.0194197,1.09177,.999218,-.0105914,.0143869,1.1022,.999594,-.00693474,.00943517,1.11175,.99975,-.00340478,.00464051,1.12056,1.00001,109172e-9,-112821e-9,1.12853,.983383,-266524e-11,.133358,196534e-10,.981942,-671009e-10,.133162,494804e-9,.981946,-268405e-9,.133163,.00197923,.981944,-603912e-9,.133163,.00445326,.981941,-.00107362,.133162,.00791693,.981946,-.00167755,.133163,.0123703,.981944,-.00241569,.133162,.0178135,.981945,-.00328807,.133163,.0242466,.981945,-.00429472,.133162,.03167,.981955,-.00543573,.133164,.0400846,.981951,-.00671105,.133163,.0494901,.981968,-.00812092,.133165,.0598886,.981979,-.00966541,.133166,.0712811,.981996,-.0113446,.133168,.083669,.982014,-.0131585,.133169,.0970533,.982011,-.0151073,.133167,.111438,.982062,-.0171906,.133172,.126826,.9821,-.0194067,.133175,.143215,.982149,-.0217502,.133176,.160609,.982163,-.0241945,.133173,.178981,.982247,-.0265907,.133148,.198249,.982291,-.027916,.132974,.217795,.982396,-.0299663,.132868,.238042,.982456,-.0334544,.132934,.258901,.982499,-.0378636,.133137,.280639,.982617,-.0409274,.133085,.304604,.98274,-.0438523,.132985,.329376,.982944,-.0462288,.132728,.354697,.98308,-.0475995,.132228,.380102,.983391,-.0501901,.131924,.406256,.983514,-.0535899,.131737,.432735,.98373,-.0571858,.131567,.459359,.984056,-.0592353,.130932,.486637,.984234,-.0610488,.130092,.51509,.984748,-.0630758,.12923,.543461,.985073,-.0647398,.128174,.571376,.985195,-.0671941,.127133,.599414,.985734,-.0681345,.125576,.628134,.986241,-.0686089,.123639,.656399,.986356,-.0698511,.121834,.684258,.986894,-.0700931,.119454,.711818,.987382,-.0698321,.116718,.739511,.988109,-.0693975,.113699,.766267,.988363,-.0689584,.110454,.792456,.989112,-.0672353,.106602,.81813,.989241,-.0662034,.10267,.842889,.990333,-.0638938,.0981381,.867204,.990591,-.0618534,.0935388,.89038,.991106,-.0593117,.088553,.912576,.991919,-.0562676,.0832187,.934118,.992111,-.0534085,.0778302,.954254,.992997,-.0495459,.0720453,.973722,.993317,-.0463707,.0663458,.991949,.994133,-.0421245,.0601883,1.00936,.994705,-.0384977,.0542501,1.02559,.995495,-.0340956,.0479862,1.04083,.996206,-.030105,.041887,1.05497,.996971,-.0256095,.0355355,1.06824,.997796,-.0213932,.0293655,1.08056,.998272,-.0169612,.0232926,1.09182,.998857,-.0126756,.0172786,1.10219,.99939,-.00832486,.0113156,1.11192,.999752,-.00410826,.00557892,1.12075,1,150957e-9,-119101e-9,1.12885,.975169,-309397e-11,.154669,195073e-10,.975439,-779608e-10,.154712,491534e-9,.975464,-311847e-9,.154716,.00196617,.975464,-701656e-9,.154716,.00442387,.975462,-.0012474,.154715,.0078647,.975461,-.00194906,.154715,.0122886,.975464,-.00280667,.154715,.0176959,.975468,-.00382025,.154716,.0240867,.975471,-.00498985,.154716,.0314612,.975472,-.00631541,.154717,.0398199,.975486,-.00779719,.154718,.0491639,.975489,-.00943505,.154718,.0594932,.975509,-.0112295,.154721,.0708113,.97554,-.0131802,.154724,.0831176,.975557,-.0152876,.154726,.096415,.975585,-.0175512,.154728,.110705,.975605,-.0199713,.154729,.125992,.975645,-.0225447,.154729,.142272,.975711,-.0252649,.154735,.159549,.975788,-.0280986,.154736,.177805,.975872,-.0308232,.154704,.196911,.975968,-.0324841,.154525,.216324,.976063,-.0351281,.154432,.236628,.976157,-.0388618,.15446,.257539,.976204,-.0437704,.154665,.278975,.976358,-.047514,.154652,.302606,.976571,-.0508638,.154535,.327204,.976725,-.0534995,.154221,.352276,.977013,-.0555547,.153737,.377696,.977294,-.0586728,.153403,.403855,.977602,-.0622715,.15312,.430333,.977932,-.0658166,.152755,.456855,.978241,-.0689877,.152233,.483668,.978602,-.0712805,.15132,.512097,.979234,-.0732775,.150235,.540455,.97977,-.075163,.148978,.568486,.979995,-.0778026,.147755,.596524,.98078,-.0791854,.146019,.624825,.981628,-.0799666,.143906,.653403,.982067,-.0808532,.141561,.681445,.98271,-.0816024,.139025,.708918,.983734,-.0812511,.135764,.736594,.98431,-.0806201,.132152,.763576,.985071,-.0801605,.12846,.789797,.98618,-.0784208,.124084,.815804,.986886,-.0766643,.1193,.840869,.987485,-.0747744,.114236,.864952,.988431,-.0716701,.108654,.888431,.988886,-.0691609,.102994,.910963,.990024,-.0654048,.0967278,.932629,.990401,-.0619765,.090384,.95313,.991093,-.0579296,.0837885,.972587,.992018,-.0536576,.0770171,.991184,.992536,-.0493719,.0701486,1.00863,.993421,-.0444813,.062953,1.02494,.993928,-.040008,.0560455,1.04017,.994994,-.0347982,.04856,1.05463,.995866,-.0301017,.0416152,1.06807,.996916,-.0248225,.0342597,1.08039,.997766,-.0199229,.0271668,1.09177,.998479,-.0147422,.0201387,1.10235,.99921,-.00980173,.0131944,1.11206,.999652,-.0047426,.00640712,1.12104,.999998,891673e-10,-10379e-8,1.12906,.967868,-351885e-11,.175947,193569e-10,.968001,-886733e-10,.175972,487782e-9,.96801,-354697e-9,.175973,.00195115,.968012,-798063e-9,.175974,.00439006,.968011,-.00141879,.175973,.00780461,.968011,-.00221686,.175973,.0121948,.968016,-.00319231,.175974,.0175607,.968019,-.00434515,.175974,.0239027,.968018,-.00567538,.175974,.0312208,.968033,-.00718308,.175977,.0395158,.968049,-.00886836,.175979,.0487885,.968047,-.0107312,.175978,.0590394,.968072,-.0127719,.175981,.0702705,.968108,-.0149905,.175986,.0824836,.968112,-.0173866,.175985,.0956783,.968173,-.0199611,.175993,.109862,.96827,-.0227128,.176008,.125033,.968292,-.025639,.17601,.141193,.968339,-.0287299,.176007,.158336,.968389,-.0319399,.176001,.176441,.968501,-.034941,.175962,.195359,.968646,-.0370812,.175793,.214686,.968789,-.0402329,.175708,.234973,.96886,-.0442601,.1757,.255871,.969013,-.049398,.175876,.277238,.969242,-.0539932,.17594,.300326,.969419,-.0577299,.175781,.324702,.969763,-.0605643,.175432,.349527,.970093,-.0634488,.174992,.374976,.970361,-.0670589,.174611,.401097,.970825,-.0708246,.174226,.427496,.971214,-.0742871,.173684,.453858,.971622,-.0782608,.173186,.480637,.972175,-.0813151,.172288,.508655,.972944,-.0832678,.170979,.536973,.973595,-.0855964,.169573,.565138,.974345,-.0882163,.168152,.593222,.975233,-.0901671,.166314,.621201,.976239,-.0912111,.163931,.649919,.977289,-.0916959,.161106,.678011,.978076,-.0927061,.158272,.705717,.979533,-.0925562,.15475,.733228,.980335,-.0918159,.150638,.760454,.981808,-.0908508,.146201,.786918,.983061,-.0896172,.141386,.812953,.984148,-.0871588,.135837,.838281,.985047,-.0850624,.130135,.862594,.986219,-.0818541,.123882,.88633,.987043,-.0784523,.117126,.908952,.988107,-.0749601,.110341,.930744,.988955,-.0703548,.102885,.951728,.989426,-.0662798,.0954167,.971166,.990421,-.0610834,.0876331,.989984,.991032,-.0562936,.0797785,1.00765,.992041,-.0508154,.0718166,1.02434,.992794,-.0454045,.0637125,1.03976,.993691,-.0398194,.0555338,1.05418,.994778,-.0341482,.0473388,1.06772,.995915,-.028428,.0391016,1.08028,.997109,-.022642,.0309953,1.09185,.998095,-.0168738,.0230288,1.10247,.998985,-.0111274,.0150722,1.11229,.999581,-.00543881,.00740605,1.12131,1.00003,162239e-9,-105549e-9,1.12946,.959505,-393734e-11,.196876,191893e-10,.959599,-992157e-10,.196895,483544e-9,.959641,-396868e-9,.196903,.0019342,.959599,-892948e-9,.196895,.00435193,.959603,-.00158747,.196896,.0077368,.959604,-.00248042,.196896,.0120888,.959605,-.00357184,.196896,.0174082,.959605,-.00486169,.196896,.0236949,.959613,-.00635008,.196897,.0309497,.959619,-.00803696,.196898,.0391725,.959636,-.00992255,.196901,.0483649,.959634,-.0120067,.1969,.0585266,.959675,-.0142898,.196906,.0696609,.959712,-.0167717,.196911,.0817678,.959752,-.0194524,.196918,.0948494,.959807,-.0223321,.196925,.10891,.959828,-.0254091,.196924,.123947,.959906,-.0286815,.196934,.139968,.960005,-.0321371,.196944,.156968,.960071,-.0357114,.196936,.17491,.960237,-.0389064,.196882,.193597,.960367,-.041623,.196731,.21285,.960562,-.0452655,.196654,.233075,.960735,-.0496207,.196643,.253941,.960913,-.0549379,.196774,.275278,.961121,-.0603414,.196893,.297733,.96139,-.0644244,.196717,.321877,.961818,-.067556,.196314,.346476,.962175,-.0712709,.195917,.371907,.96255,-.0752848,.1955,.397916,.963164,-.0792073,.195026,.424229,.963782,-.0828225,.194424,.450637,.964306,-.0873119,.193831,.477288,.964923,-.0911051,.192973,.504716,.966048,-.093251,.19151,.533053,.967024,-.0958983,.190013,.561366,.968038,-.09835,.188253,.589464,.969152,-.100754,.186257,.617433,.970557,-.102239,.183775,.645801,.972104,-.102767,.180645,.674278,.973203,-.103492,.177242,.702004,.975123,-.103793,.17345,.729529,.97641,-.102839,.168886,.756712,.978313,-.101687,.163892,.783801,.980036,-.100314,.158439,.809671,.981339,-.097836,.152211,.835402,.982794,-.0950006,.145679,.860081,.984123,-.0920994,.138949,.883757,.984918,-.0878641,.131283,.90685,.985999,-.083939,.123464,.928786,.987151,-.0791234,.115324,.94983,.987827,-.0739332,.106854,.96962,.988806,-.0688088,.0982691,.98861,.989588,-.0628962,.0893456,1.00667,.990438,-.0573146,.0805392,1.02344,.991506,-.0509433,.0713725,1.03933,.992492,-.0448724,.0623732,1.05378,.993663,-.0383497,.0530838,1.06747,.994956,-.0319593,.0439512,1.08007,.99634,-.025401,.0347803,1.09182,.99761,-.0189687,.0257954,1.1025,.99863,-.0124441,.0169893,1.11247,.99947,-.00614003,.00829498,1.12151,1.00008,216624e-9,-146107e-9,1.12993,.950129,-434955e-11,.217413,190081e-10,.950264,-10957e-8,.217444,47884e-8,.9503,-438299e-9,.217451,.00191543,.950246,-986124e-9,.21744,.00430951,.950246,-.00175311,.21744,.00766137,.950245,-.00273923,.21744,.011971,.950253,-.00394453,.217441,.0172385,.950258,-.00536897,.217442,.0234641,.950267,-.00701262,.217444,.030648,.950277,-.00887551,.217446,.038791,.950284,-.0109576,.217446,.0478931,.950312,-.0132591,.217451,.0579568,.950334,-.01578,.217454,.0689821,.950378,-.0185204,.217462,.0809714,.950417,-.0214803,.217467,.0939265,.950488,-.0246594,.217479,.10785,.950534,-.0280565,.217483,.122743,.950633,-.0316685,.217498,.138611,.950698,-.0354787,.217499,.155442,.950844,-.0394003,.217507,.173208,.950999,-.0426812,.217419,.191605,.951221,-.0461302,.217317,.21084,.951412,-.0502131,.217238,.230945,.951623,-.0549183,.21722,.251745,.951867,-.0604493,.217306,.273001,.952069,-.0665189,.217466,.294874,.952459,-.0709179,.217266,.318732,.952996,-.0746112,.216891,.34318,.953425,-.0789252,.216503,.36849,.953885,-.0833293,.216042,.394373,.954617,-.087371,.215469,.420505,.955429,-.0914054,.214802,.446907,.956068,-.0961671,.214146,.473522,.957094,-.10048,.213286,.50052,.958372,-.103248,.211796,.528715,.959654,-.106033,.21016,.557065,.961305,-.108384,.208149,.585286,.962785,-.111122,.206024,.613334,.964848,-.112981,.203442,.641334,.966498,-.113717,.19996,.669955,.968678,-.114121,.196105,.698094,.970489,-.114524,.191906,.725643,.972903,-.113792,.186963,.752856,.974701,-.112406,.181343,.780013,.976718,-.110685,.175185,.806268,.978905,-.108468,.168535,.832073,.980267,-.105061,.161106,.857149,.981967,-.101675,.153387,.881145,.983063,-.0974492,.145199,.904255,.984432,-.0925815,.136527,.926686,.985734,-.0877983,.127584,.947901,.986228,-.081884,.118125,.968111,.98719,-.0761208,.108594,.98719,.988228,-.0698196,.0989996,1.00559,.989046,-.0632739,.0890074,1.02246,.990242,-.056522,.0790832,1.03841,.991252,-.0495272,.0689182,1.05347,.992542,-.0425373,.0588592,1.06724,.994096,-.0353198,.0486833,1.08009,.995593,-.028235,.0385977,1.09177,.99711,-.0209511,.0286457,1.10274,.998263,-.0139289,.0188497,1.11262,.999254,-.0067359,.009208,1.12191,.999967,141846e-9,-657764e-10,1.13024,.935608,-474692e-11,.236466,187817e-10,.93996,-11971e-8,.237568,473646e-9,.939959,-478845e-9,.237567,.0018946,.939954,-.0010774,.237566,.00426284,.939956,-.00191538,.237566,.00757842,.939954,-.00299277,.237566,.0118413,.93996,-.00430961,.237567,.0170518,.939969,-.00586589,.237569,.02321,.939982,-.00766166,.237572,.0303164,.939987,-.00969686,.237572,.0383711,.939997,-.0119715,.237574,.0473751,.940031,-.0144858,.237581,.0573298,.940073,-.0172399,.237589,.0682366,.94012,-.0202335,.237598,.080097,.940162,-.0234663,.237604,.0929116,.940237,-.0269387,.237615,.106686,.940328,-.0306489,.237632,.121421,.940419,-.0345917,.237645,.137115,.940522,-.0387481,.237654,.153766,.940702,-.0429906,.237661,.17133,.940871,-.0465089,.237561,.189502,.941103,-.050531,.23748,.208616,.941369,-.0550657,.237423,.228595,.941641,-.0601337,.237399,.249287,.941903,-.0658804,.237443,.270467,.942224,-.0722674,.237597,.292024,.942633,-.0771788,.237419,.315272,.943172,-.0815623,.237068,.339579,.943691,-.0863973,.236682,.364717,.944382,-.0911536,.236213,.390435,.945392,-.0952967,.235562,.416425,.946185,-.0998948,.234832,.442772,.947212,-.104796,.234114,.469347,.948778,-.10928,.233222,.496162,.950149,-.113081,.231845,.523978,.951989,-.115893,.230005,.552295,.953921,-.11846,.227862,.580569,.955624,-.12115,.225439,.608698,.958234,-.123373,.222635,.636696,.960593,-.124519,.219093,.665208,.963201,-.124736,.214749,.693557,.965642,-.125012,.210059,.721334,.968765,-.124661,.204935,.748613,.971753,-.122996,.198661,.776224,.973751,-.120998,.191823,.802461,.976709,-.118583,.184359,.828399,.977956,-.115102,.176437,.853693,.979672,-.111077,.167681,.877962,.981816,-.10688,.158872,.901564,.98238,-.101469,.149398,.924057,.983964,-.0960013,.139436,.945751,.984933,-.0899626,.12943,.966272,.985694,-.0832973,.11894,.985741,.986822,-.0767082,.108349,1.00407,.987725,-.0693614,.0976026,1.02154,.98877,-.06211,.086652,1.03757,.990129,-.0544143,.0756182,1.05296,.991337,-.046744,.0645753,1.06683,.992978,-.0387931,.0534683,1.0798,.994676,-.030973,.0424137,1.09181,.99645,-.0230311,.0314035,1.10286,.997967,-.0152065,.0206869,1.11291,.99922,-.00744837,.010155,1.12237,1.00002,240209e-9,-752767e-10,1.13089,.922948,-515351e-11,.255626,186069e-10,.928785,-129623e-9,.257244,468009e-9,.928761,-51849e-8,.257237,.00187202,.928751,-.0011666,.257235,.00421204,.928751,-.00207395,.257234,.0074881,.928754,-.00324055,.257235,.0117002,.92876,-.00466639,.257236,.0168486,.928763,-.00635149,.257237,.0229334,.928774,-.00829584,.257239,.029955,.928791,-.0104995,.257243,.0379139,.928804,-.0129623,.257245,.0468108,.928847,-.0156846,.257255,.0566473,.92889,-.0186661,.257263,.0674246,.928924,-.0219067,.257268,.0791433,.928989,-.0254066,.257282,.0918076,.92909,-.0291651,.257301,.105419,.92918,-.0331801,.257316,.119978,.92929,-.0374469,.257332,.135491,.929453,-.041939,.257357,.151948,.929586,-.0464612,.257347,.169275,.929858,-.0503426,.257269,.187257,.930125,-.0548409,.257199,.206204,.930403,-.0598063,.257149,.22601,.930726,-.0652437,.257122,.246561,.931098,-.0712376,.257153,.267618,.931396,-.0777506,.257237,.288993,.931947,-.0832374,.257124,.311527,.932579,-.0883955,.25683,.335697,.933194,-.0937037,.256444,.360634,.934013,-.0987292,.255939,.386126,.935307,-.103215,.255282,.412018,.936374,-.108234,.254538,.438292,.93776,-.113234,.253728,.464805,.939599,-.118013,.25275,.491464,.941036,-.122661,.251404,.518751,.94337,-.125477,.249435,.547133,.945318,-.128374,.247113,.575456,.947995,-.130996,.244441,.60372,.950818,-.133438,.241352,.63174,.954378,-.135004,.237849,.659971,.957151,-.135313,.233188,.688478,.960743,-.13521,.228001,.716767,.964352,-.135007,.222249,.744349,.967273,-.133523,.21542,.771786,.969767,-.131155,.208039,.798639,.973195,-.128492,.200076,.824774,.975557,-.125094,.191451,.850222,.977692,-.120578,.18184,.874761,.98026,-.115882,.172102,.898497,.981394,-.110372,.161859,.921636,.982386,-.10415,.15108,.943467,.983783,-.0978128,.140407,.964045,.98422,-.0906171,.129058,.98398,.985447,-.0832921,.117614,1.00276,.986682,-.0754412,.10585,1.02047,.987326,-.0673885,.0940943,1.03678,.988707,-.0592565,.0822093,1.05218,.990185,-.050717,.070192,1.06652,.991866,-.0423486,.0582081,1.07965,.993897,-.0336118,.0460985,1.09188,.995841,-.0252178,.0342737,1.10307,.997605,-.0164893,.0224829,1.11324,.999037,-.00817112,.0110647,1.12262,1.00003,291686e-9,-168673e-9,1.13139,.915304,-552675e-11,.275999,183285e-10,.91668,-139285e-9,.276414,461914e-9,.916664,-55713e-8,.276409,.00184763,.916653,-.00125354,.276406,.00415715,.916651,-.00222851,.276405,.00739053,.916655,-.00348205,.276406,.0115478,.916653,-.00501414,.276405,.0166291,.916667,-.00682478,.276409,.0226346,.91668,-.00891398,.276412,.0295648,.91669,-.0112817,.276413,.0374199,.916727,-.013928,.276422,.0462016,.916759,-.0168528,.276429,.0559101,.916793,-.0200558,.276436,.0665466,.916849,-.0235373,.276448,.0781139,.916964,-.0272973,.276474,.0906156,.917047,-.0313344,.276491,.104051,.917152,-.0356465,.276511,.118424,.917286,-.0402271,.276533,.133736,.917469,-.0450408,.276564,.149978,.917686,-.0497872,.276563,.167057,.917953,-.0540937,.276493,.184846,.918228,-.0590709,.276437,.203614,.918572,-.0644277,.276398,.223212,.918918,-.0702326,.276362,.243584,.919356,-.076484,.276383,.264465,.919842,-.0830808,.276434,.285701,.920451,-.0892972,.276407,.307559,.921113,-.095016,.276128,.331501,.921881,-.100771,.275754,.356207,.923027,-.106029,.275254,.381477,.924364,-.111029,.274595,.40722,.925818,-.116345,.273841,.433385,.92746,-.121424,.272913,.459848,.929167,-.12657,.271837,.486493,.931426,-.131581,.270575,.513432,.934001,-.135038,.268512,.541502,.936296,-.138039,.266135,.569658,.939985,-.140687,.263271,.598375,.943516,-.143247,.260058,.626563,.94782,-.145135,.256138,.654711,.951023,-.145733,.251154,.683285,.955338,-.145554,.245562,.711831,.959629,-.145008,.239265,.739573,.963123,-.144003,.232064,.767027,.966742,-.141289,.224036,.794359,.969991,-.138247,.215305,.820361,.973403,-.134786,.206051,.846548,.975317,-.129966,.195914,.871541,.977647,-.12471,.185184,.895313,.980137,-.119086,.174161,.918398,.981031,-.112297,.162792,.940679,.982037,-.105372,.150952,.961991,.983164,-.097821,.138921,.981913,.983757,-.0897245,.126611,1.00109,.985036,-.0815974,.114228,1.01902,.986289,-.0727725,.101389,1.03604,.987329,-.0639323,.0886476,1.05149,.989193,-.0548109,.0756837,1.06619,.990716,-.045687,.0627581,1.07948,.992769,-.0364315,.0498337,1.09172,.99524,-.0271761,.0370305,1.1033,.997154,-.0179609,.0243959,1.11353,.998845,-.00878063,.0119567,1.12319,1.00002,259038e-9,-108146e-9,1.13177,.903945,-591681e-11,.295126,181226e-10,.903668,-148672e-9,.295037,455367e-9,.903677,-594683e-9,.29504,.00182145,.903673,-.00133805,.295039,.00409831,.903666,-.00237872,.295036,.00728584,.903668,-.00371676,.295037,.0113842,.903679,-.00535212,.29504,.0163936,.903684,-.00728479,.295041,.0223141,.903698,-.00951473,.295044,.0291462,.903718,-.0120419,.295049,.0368904,.903754,-.0148664,.295058,.0455477,.903801,-.017988,.29507,.0551194,.903851,-.0214064,.295082,.0656058,.903921,-.0251219,.295097,.0770109,.904002,-.0291337,.295116,.0893354,.904111,-.033441,.29514,.102583,.904246,-.0380415,.295169,.116755,.904408,-.0429258,.295202,.131853,.904637,-.0480468,.295245,.147869,.904821,-.0529208,.295214,.164658,.905163,-.0577748,.295185,.182274,.905469,-.0631763,.295143,.200828,.905851,-.068917,.295112,.2202,.906322,-.0750861,.295104,.240372,.906761,-.0815855,.295086,.261082,.90735,-.0882138,.295095,.282123,.908087,-.095082,.295139,.303563,.908826,-.101488,.29492,.327028,.909832,-.107577,.294577,.351464,.911393,-.113033,.294115,.376497,.912804,-.118629,.293446,.402115,.914081,-.124232,.292581,.428111,.91637,-.129399,.29166,.454442,.91814,-.134892,.290422,.481024,.921179,-.140069,.289194,.507924,.924544,-.144431,.287421,.535557,.927995,-.147498,.284867,.563984,.931556,-.150197,.281722,.5923,.935777,-.152711,.278207,.620832,.940869,-.154836,.274148,.649069,.945994,-.155912,.269057,.677746,.949634,-.155641,.262799,.706293,.955032,-.154809,.256097,.734278,.95917,-.153678,.248618,.761751,.962931,-.151253,.239794,.789032,.966045,-.147625,.230281,.815422,.96971,-.143964,.220382,.841787,.972747,-.139464,.209846,.867446,.975545,-.133459,.198189,.892004,.978381,-.127424,.186362,.915458,.979935,-.120506,.173964,.937948,.980948,-.11282,.161429,.959732,.982234,-.104941,.148557,.980118,.982767,-.0962905,.135508,.999463,.983544,-.0873625,.122338,1.01756,.984965,-.0783447,.108669,1.03492,.986233,-.0684798,.0949911,1.05087,.987796,-.0590867,.0811386,1.0656,.989885,-.0489145,.0673099,1.0794,.991821,-.0391,.0535665,1.09174,.99448,-.029087,.0397529,1.10341,.996769,-.019114,.0261463,1.11383,.998641,-.00947007,.0128731,1.1237,.999978,446316e-9,-169093e-9,1.13253,.888362,-627064e-11,.312578,178215e-10,.889988,-157791e-9,.313148,448451e-9,.889825,-631076e-9,.313092,.00179356,.88984,-.00141994,.313097,.00403554,.889828,-.0025243,.313092,.00717429,.889831,-.00394421,.313093,.0112099,.889831,-.00567962,.313093,.0161425,.889844,-.00773051,.313096,.0219724,.889858,-.0100968,.3131,.0286999,.889882,-.0127786,.313106,.0363256,.889918,-.0157757,.313116,.0448509,.889967,-.0190878,.313129,.0542758,.89003,-.022715,.313145,.0646032,.890108,-.0266566,.313165,.0758339,.890218,-.0309131,.313193,.0879729,.890351,-.0354819,.313226,.101019,.89051,-.0403613,.313263,.114979,.890672,-.0455385,.313294,.129848,.890882,-.0509444,.313333,.145616,.891189,-.0559657,.313324,.162122,.891457,-.0613123,.313281,.179524,.891856,-.0671488,.313281,.197855,.892312,-.0732732,.313268,.216991,.892819,-.0797865,.313263,.236924,.893369,-.0865269,.313247,.257433,.894045,-.0931592,.313205,.278215,.894884,-.100532,.313276,.299467,.895832,-.107716,.313205,.322276,.897043,-.114099,.312873,.34642,.898515,-.119941,.312331,.371187,.900191,-.126044,.311731,.396656,.90188,-.131808,.310859,.422488,.904359,-.137289,.309857,.448744,.906923,-.142991,.308714,.475239,.910634,-.148253,.307465,.501983,.914502,-.153332,.305774,.529254,.919046,-.156646,.303156,.557709,.923194,-.159612,.299928,.586267,.928858,-.162027,.296245,.614925,.934464,-.164203,.291832,.643187,.939824,-.165602,.286565,.671601,.944582,-.165383,.280073,.700213,.949257,-.164439,.272891,.728432,.954389,-.162953,.264771,.756082,.958595,-.161007,.255927,.78369,.962138,-.157243,.245769,.810769,.966979,-.152872,.235127,.836999,.969566,-.148209,.22347,.862684,.972372,-.142211,.211147,.887847,.975916,-.135458,.198606,.911843,.978026,-.128398,.185498,.934795,.979686,-.120313,.17171,.956787,.980748,-.11166,.158159,.978046,.981622,-.103035,.144399,.997693,.982356,-.0930328,.13001,1.01642,.983308,-.0834627,.115778,1.03366,.985037,-.0732249,.101327,1.05014,.986493,-.0628145,.086554,1.06507,.988484,-.0526556,.0720413,1.07907,.991051,-.0415744,.0571151,1.09189,.993523,-.0314275,.0426643,1.10369,.99628,-.0203603,.0279325,1.11423,.998344,-.0102446,.0138182,1.12421,.999997,42612e-8,-193628e-9,1.1333,.871555,-660007e-11,.329176,174749e-10,.875255,-166579e-9,.330571,441051e-9,.875644,-666394e-9,.330718,.00176441,.875159,-.00149903,.330536,.00396899,.87516,-.00266493,.330536,.007056,.875158,-.00416393,.330535,.0110251,.87516,-.00599598,.330535,.0158764,.875163,-.00816108,.330536,.0216101,.875174,-.0106591,.330538,.0282266,.875199,-.0134899,.330545,.0357266,.875257,-.0166538,.330563,.0441117,.875304,-.0201501,.330575,.0533821,.875373,-.0239785,.330595,.0635395,.875464,-.0281389,.330619,.0745872,.875565,-.0326301,.330645,.0865255,.875691,-.0374516,.330676,.0993599,.875897,-.0425993,.330733,.113093,.876091,-.0480576,.330776,.127722,.876353,-.0537216,.330826,.143227,.876649,-.0589807,.330809,.159462,.877034,-.0647865,.330819,.176642,.877443,-.0709789,.330817,.194702,.877956,-.0774782,.330832,.213577,.878499,-.0843175,.330822,.233246,.879144,-.0912714,.330804,.253512,.879982,-.0980824,.330766,.274137,.88097,-.105823,.330864,.295209,.882051,-.113671,.330896,.317226,.883397,-.120303,.330545,.341068,.884987,-.12667,.330068,.365613,.886789,-.133118,.329418,.390807,.889311,-.139024,.328683,.416494,.891995,-.144971,.327729,.442618,.895106,-.150747,.326521,.469131,.899527,-.156283,.325229,.495921,.90504,-.161707,.32378,.523162,.909875,-.165661,.32122,.55092,.91561,-.168755,.317942,.579928,.921225,-.171193,.313983,.608539,.927308,-.17319,.309636,.636854,.933077,-.174819,.304262,.66523,.938766,-.175002,.297563,.693609,.943667,-.173946,.289613,.722157,.949033,-.172221,.281227,.750021,.953765,-.169869,.271545,.777466,.95804,-.166578,.261034,.804853,.962302,-.161761,.249434,.831569,.966544,-.156636,.237484,.857779,.969372,-.150784,.224395,.883051,.972486,-.143672,.210786,.907864,.975853,-.135772,.196556,.931223,.977975,-.127942,.182307,.954061,.979122,-.118347,.167607,.97531,.980719,-.109112,.152739,.995666,.981223,-.0991789,.137932,1.01475,.98216,-.0883553,.122692,1.03253,.983379,-.0780825,.107493,1.04917,.985434,-.0665646,.0917791,1.06464,.987332,-.0557714,.0764949,1.07896,.990004,-.0442805,.060721,1.09199,.992975,-.0331676,.0452284,1.10393,.995811,-.0219547,.0297934,1.11476,.9982,-.0107613,.0146415,1.12484,1.00002,248678e-9,-14555e-8,1.13413,.859519,-693595e-11,.347264,171673e-10,.859843,-17503e-8,.347394,433219e-9,.859656,-700076e-9,.347319,.00173277,.859671,-.00157517,.347325,.00389875,.859669,-.00280028,.347324,.00693112,.85967,-.0043754,.347324,.01083,.859665,-.00630049,.347321,.0155954,.859685,-.0085755,.347328,.0212278,.859694,-.0112003,.347329,.0277273,.859718,-.0141747,.347336,.0350946,.85976,-.0174988,.347348,.0433314,.85982,-.0211722,.347366,.0524384,.859892,-.0251941,.347387,.0624168,.860006,-.0295649,.347422,.0732708,.860122,-.0342825,.347453,.0849999,.860282,-.0393462,.347499,.0976102,.860482,-.0447513,.347554,.111104,.860719,-.0504775,.347614,.125479,.860998,-.0563577,.347666,.140703,.861322,-.0619473,.347662,.156681,.861724,-.0681277,.347684,.173597,.862198,-.0746567,.347709,.191371,.862733,-.0815234,.347727,.209976,.863371,-.0886643,.347744,.229351,.86414,-.0957908,.347734,.24934,.865138,-.102912,.34772,.269797,.866182,-.110924,.3478,.290654,.867436,-.119223,.347911,.312074,.869087,-.126197,.347649,.335438,.870859,-.133145,.347222,.359732,.872997,-.139869,.346645,.38467,.875939,-.146089,.345935,.41019,.879012,-.152334,.345012,.436218,.883353,-.15821,.343924,.462641,.888362,-.164097,.342636,.489449,.895026,-.169528,.341351,.516629,.900753,-.174408,.339115,.544109,.906814,-.17751,.335809,.572857,.912855,-.180101,.331597,.601554,.919438,-.182116,.32698,.630198,.925962,-.183494,.321449,.658404,.931734,-.184159,.314595,.686625,.93762,-.18304,.306462,.71531,.943858,-.181323,.297514,.744272,.948662,-.178683,.287447,.771462,.953299,-.175379,.276166,.798593,.957346,-.170395,.263758,.8256,.962565,-.165042,.251019,.852575,.966075,-.158655,.237011,.878316,.969048,-.151707,.222518,.90329,.972423,-.143271,.207848,.927745,.975833,-.134824,.192463,.950859,.977629,-.125444,.1768,.972947,.978995,-.114949,.161033,.993263,.980533,-.104936,.145523,1.01337,.980745,-.0935577,.129799,1.03128,.981814,-.0822956,.113486,1.04825,.983943,-.0710082,.0972925,1.06405,.986141,-.0587931,.0808138,1.0785,.988878,-.0472755,.0644915,1.09204,.992132,-.0349128,.0478128,1.10413,.9953,-.0232407,.031621,1.11527,.998117,-.0112713,.0154935,1.12551,1.00003,339743e-9,-195763e-9,1.13504,.845441,-729126e-11,.364305,169208e-10,.843588,-183164e-9,.363506,425067e-9,.843412,-73253e-8,.36343,.00169999,.843401,-.00164818,.363426,.00382495,.843399,-.00293008,.363425,.00679993,.843401,-.00457822,.363425,.010625,.843394,-.00659249,.363421,.0153002,.843398,-.00897282,.363421,.0208258,.843415,-.0117191,.363426,.0272024,.843438,-.0148312,.363432,.0344305,.843483,-.018309,.363447,.0425116,.84356,-.0221521,.363472,.0514471,.843646,-.0263597,.363499,.061238,.843743,-.0309315,.363527,.0718873,.84388,-.0358658,.363569,.0833969,.844079,-.0411624,.363631,.0957742,.844279,-.0468128,.363688,.109015,.844549,-.0527923,.363761,.123124,.844858,-.0588204,.363817,.138044,.84522,-.0647573,.36383,.153755,.845669,-.0713181,.363879,.170394,.846155,-.0781697,.363908,.187861,.846789,-.0853913,.363969,.206176,.847502,-.0928086,.363999,.225244,.8484,-.10005,.363997,.244926,.849461,-.107615,.364008,.265188,.850562,-.115814,.364055,.28587,.851962,-.124334,.364179,.306926,.854326,-.131995,.364233,.329605,.856295,-.139338,.363856,.35359,.858857,-.146346,.363347,.37831,.862428,-.152994,.362807,.403722,.866203,-.159463,.361963,.429537,.871629,-.165623,.36112,.456,.877365,-.171649,.359917,.482773,.883744,-.177151,.35848,.509705,.890693,-.182381,.356523,.537215,.897278,-.186076,.3533,.565493,.903958,-.188602,.349095,.594293,.910908,-.190755,.344215,.623165,.918117,-.192063,.338606,.651573,.924644,-.192758,.331544,.679869,.931054,-.192238,.323163,.708668,.937303,-.190035,.313529,.737201,.943387,-.187162,.303152,.764977,.948494,-.183876,.29146,.792683,.952546,-.178901,.277917,.819228,.958077,-.173173,.264753,.846559,.962462,-.16645,.25002,.872962,.966569,-.159452,.234873,.898729,.969108,-.15074,.218752,.923126,.973072,-.141523,.202673,.947278,.975452,-.132075,.186326,.969938,.977784,-.121257,.169396,.991325,.97899,-.110182,.153044,1.01123,.979777,-.0989634,.136485,1.0299,.980865,-.0865894,.119343,1.04727,.982432,-.0746115,.102452,1.06341,.984935,-.0621822,.0852423,1.07834,.987776,-.0495694,.0678546,1.092,.99103,-.0372386,.0506917,1.1043,.99474,-.0244353,.0333316,1.11576,.997768,-.0121448,.0164348,1.12617,1.00003,31774e-8,-169504e-9,1.13598,.825551,-756799e-11,.378425,165099e-10,.82664,-190922e-9,.378923,416504e-9,.826323,-763495e-9,.378779,.0016656,.826359,-.00171789,.378795,.00374768,.82636,-.00305402,.378795,.00666259,.826368,-.00477185,.378798,.0104104,.826364,-.00687131,.378795,.0149912,.826368,-.00935232,.378795,.0204054,.826376,-.0122146,.378797,.0266532,.826399,-.0154581,.378803,.0337355,.82646,-.0190825,.378824,.0416537,.826525,-.0230873,.378846,.0504091,.826614,-.0274719,.378876,.0600032,.82674,-.0322355,.378917,.0704393,.826888,-.0373766,.378964,.0817195,.827078,-.0428936,.379024,.0938492,.827318,-.0487778,.379099,.106828,.82764,-.0549935,.379199,.120659,.827926,-.0611058,.379227,.13526,.828325,-.0675054,.379275,.150713,.828801,-.0743455,.379332,.167034,.8294,-.0815523,.379415,.184209,.830094,-.0890779,.379495,.202203,.8309,-.096736,.379555,.220945,.831943,-.104135,.379577,.240306,.833037,-.112106,.379604,.260317,.834278,-.120554,.379668,.2808,.836192,-.129128,.3799,.301654,.838671,-.137541,.380109,.323502,.840939,-.14523,.379809,.347176,.844575,-.15248,.379593,.371706,.848379,-.159607,.37909,.39688,.853616,-.166267,.378617,.422702,.858921,-.172698,.377746,.448919,.865324,-.178823,.376749,.475661,.872207,-.184542,.375363,.502599,.880018,-.189836,.373657,.529914,.88694,-.194294,.370673,.557683,.894779,-.197022,.36662,.586848,.902242,-.199108,.36138,.615831,.909914,-.200398,.355434,.644478,.917088,-.20094,.348173,.672905,.923888,-.200671,.339482,.701327,.930495,-.198773,.32956,.730101,.937247,-.195394,.318363,.758383,.943108,-.191956,.306323,.786539,.948296,-.187227,.292576,.813637,.953472,-.181165,.278234,.840793,.958485,-.174119,.263054,.867712,.962714,-.166564,.246756,.893635,.966185,-.158181,.229945,.919028,.970146,-.148275,.212633,.943413,.973491,-.138157,.195229,.966627,.975741,-.127574,.178048,.988817,.977238,-.11554,.160312,1.00924,.978411,-.10364,.142857,1.02845,.979811,-.0913122,.125317,1.04648,.98116,-.0782558,.107627,1.06284,.983543,-.0655957,.0895862,1.07798,.986789,-.0520411,.0713756,1.092,.990292,-.0389727,.053228,1.10484,.994187,-.025808,.0351945,1.11642,.997499,-.0126071,.0173198,1.12703,.999999,275604e-9,-148602e-9,1.13674,.81075,-78735e-10,.394456,161829e-10,.808692,-198293e-9,.393453,407564e-9,.80846,-792877e-9,.39334,.00162965,.808595,-.00178416,.393407,.00366711,.808597,-.00317182,.393408,.00651934,.808598,-.00495589,.393408,.0101866,.808591,-.00713627,.393403,.0146689,.808592,-.00971285,.393402,.0199667,.80861,-.0126855,.393407,.0260803,.808633,-.0160538,.393413,.0330107,.80868,-.0198175,.393429,.0407589,.808748,-.0239758,.393453,.0493264,.808854,-.0285286,.39349,.0587161,.808992,-.0334748,.39354,.0689304,.809141,-.0388116,.393588,.0799707,.809352,-.0445375,.39366,.0918432,.809608,-.0506427,.393742,.104549,.809915,-.0570708,.393834,.118085,.810253,-.0633526,.393885,.132377,.810687,-.0700966,.393953,.147537,.811233,-.0772274,.394047,.163543,.811865,-.0847629,.394148,.180394,.812648,-.0925663,.394265,.198051,.813583,-.100416,.394363,.216443,.814683,-.108119,.394402,.235502,.815948,-.11644,.394489,.255242,.817278,-.125036,.394542,.275441,.819605,-.133655,.39486,.296094,.822256,-.142682,.395248,.317309,.825349,-.150756,.395241,.340516,.829605,-.158392,.395285,.364819,.83391,-.165801,.394922,.389736,.839808,-.172677,.394691,.415409,.845708,-.179448,.394006,.441546,.853025,-.185746,.393279,.46832,.859666,-.191684,.391655,.495302,.86789,-.197146,.390068,.52262,.875845,-.201904,.38727,.550336,.882634,-.205023,.382688,.578825,.891076,-.207098,.377543,.608103,.900589,-.208474,.371752,.63723,.90791,-.209068,.364016,.665769,.915971,-.208655,.355593,.694428,.923455,-.20729,.345439,.723224,.931514,-.203821,.334099,.751925,.937885,-.19986,.321069,.780249,.943136,-.194993,.306571,.8077,.948818,-.189132,.291556,.83497,.954433,-.181617,.275745,.86188,.959078,-.173595,.258695,.888562,.962705,-.164855,.240825,.914008,.966753,-.155129,.22268,.939145,.970704,-.144241,.204542,.963393,.973367,-.133188,.185927,.985983,.975984,-.121146,.167743,1.00704,.976994,-.108366,.149218,1.02715,.978485,-.0956746,.13131,1.0455,.980074,-.0820733,.112513,1.06221,.98225,-.0684061,.0938323,1.07782,.98553,-.0549503,.0749508,1.09199,.989529,-.0407857,.055848,1.10508,.993536,-.0271978,.0368581,1.11684,.997247,-.0132716,.0181845,1.12789,1,431817e-9,-198809e-9,1.13792,.785886,-812608e-11,.405036,157669e-10,.790388,-205278e-9,.407355,398297e-9,.790145,-820824e-9,.407231,.00159263,.790135,-.00184681,.407226,.00358336,.790119,-.00328316,.407218,.00637039,.790126,-.00512988,.40722,.0099539,.79013,-.00738684,.407221,.0143339,.790135,-.0100538,.407221,.0195107,.790134,-.0131306,.407217,.0254848,.79016,-.0166169,.407224,.0322572,.790197,-.020512,.407236,.0398284,.790273,-.0248157,.407263,.0482014,.790381,-.029527,.407304,.0573777,.790521,-.0346446,.407355,.0673602,.790704,-.0401665,.40742,.0781522,.790925,-.0460896,.407499,.0897582,.791195,-.0524017,.407589,.10218,.791522,-.0590121,.407691,.11541,.791878,-.0654876,.407748,.12939,.792361,-.0725207,.407849,.144237,.792942,-.0799844,.407963,.159924,.79362,-.0877896,.408087,.176425,.794529,-.0958451,.408259,.193733,.795521,-.103827,.408362,.211756,.796778,-.111937,.408482,.230524,.798027,-.120521,.408547,.249967,.799813,-.129242,.408721,.269926,.802387,-.138048,.409148,.290338,.805279,-.147301,.409641,.311193,.809251,-.155895,.410154,.333611,.813733,-.163942,.410297,.357615,.819081,-.171666,.410373,.382339,.825427,-.178905,.410348,.407828,.83172,-.185812,.409486,.434034,.83877,-.192318,.408776,.460493,.845817,-.198249,.407176,.487346,.854664,-.204034,.405719,.514832,.863495,-.208908,.403282,.542401,.871883,-.212765,.399293,.570683,.88065,-.214911,.393803,.599947,.89004,-.216214,.387536,.62932,.898476,-.216745,.379846,.658319,.906738,-.216387,.370625,.687138,.914844,-.215053,.360139,.71601,.923877,-.212007,.348849,.745124,.931925,-.207481,.335639,.773366,.938054,-.202418,.320798,.801636,.943895,-.196507,.304772,.829055,.949468,-.189009,.288033,.856097,.955152,-.180539,.270532,.88301,.959403,-.171437,.251639,.909296,.963309,-.161661,.232563,.934868,.967399,-.150425,.213231,.959662,.972009,-.138659,.194247,.98302,.97433,-.126595,.174718,1.00517,.975823,-.113205,.155518,1.02566,.976371,-.0996096,.136709,1.04418,.978705,-.0860754,.117571,1.06146,.981477,-.0714438,.0980046,1.07777,.984263,-.0572304,.0782181,1.09214,.988423,-.0428875,.0584052,1.10553,.993,-.0282442,.038522,1.11758,.99704,-.0140183,.0190148,1.12864,.999913,369494e-9,-145203e-9,1.13901,.777662,-84153e-10,.423844,154403e-10,.770458,-211714e-9,.419915,38845e-8,.770716,-846888e-9,.420055,.00155386,.770982,-.00190567,.420202,.00349653,.770981,-.00338782,.420201,.00621606,.77098,-.00529338,.4202,.00971274,.770983,-.00762223,.4202,.0139867,.770985,-.0103741,.420198,.0190381,.770996,-.0135489,.4202,.0248677,.771029,-.0171461,.420212,.0314764,.771052,-.0211647,.420215,.0388648,.771131,-.0256048,.420245,.047036,.771235,-.0304647,.420284,.0559911,.771383,-.0357436,.420341,.0657346,.771591,-.0414392,.420423,.0762694,.771819,-.0475462,.420506,.0875984,.772123,-.0540506,.420617,.099727,.772464,-.060797,.42072,.112637,.772855,-.0675393,.420799,.126313,.773317,-.0748323,.420893,.140824,.773981,-.0825681,.421058,.15617,.774746,-.0906307,.421226,.172322,.77566,-.0988982,.421397,.189253,.776837,-.106994,.421569,.206912,.778097,-.115528,.421704,.225359,.779588,-.124317,.421849,.24447,.781574,-.133139,.422097,.264156,.784451,-.142179,.422615,.284318,.787682,-.15165,.423269,.304902,.792433,-.160771,.424396,.3265,.797359,-.169166,.424772,.35014,.803986,-.177149,.425475,.374768,.809504,-.184745,.424996,.399928,.815885,-.19173,.424247,.425796,.823513,-.198525,.423515,.452287,.832549,-.204709,.422787,.479321,.841653,-.210447,.421187,.506718,.850401,-.215501,.418519,.53432,.859854,-.219752,.414715,.56242,.869364,-.222305,.409462,.591558,.878837,-.223744,.402926,.621074,.888636,-.224065,.395043,.650538,.898132,-.223742,.38564,.679538,.907181,-.222308,.375378,.708674,.915621,-.219837,.363212,.737714,.9239,-.215233,.349313,.767014,.931644,-.209592,.334162,.795133,.938887,-.203644,.317943,.823228,.945282,-.196349,.300581,.850822,.950758,-.18742,.282195,.877594,.956146,-.177879,.262481,.904564,.960355,-.167643,.242487,.930741,.965256,-.156671,.222668,.955868,.968029,-.144123,.201907,.979869,.97251,-.131305,.18202,1.00291,.974925,-.118335,.161909,1.02392,.975402,-.103714,.142129,1.0433,.976987,-.089415,.122447,1.06089,.979677,-.0748858,.102248,1.07713,.983184,-.0596086,.0814851,1.09218,.987466,-.0447671,.0609484,1.10585,.992348,-.0295217,.0401835,1.11829,.996674,-.0143917,.0198163,1.12966,1.00003,321364e-9,-149983e-9,1.1402,.757901,-869074e-11,.436176,151011e-10,.751195,-217848e-9,.432317,378533e-9,.751178,-871373e-9,.432307,.0015141,.751195,-.00196061,.432317,.0034068,.751198,-.00348552,.432318,.00605659,.751195,-.00544599,.432315,.00946353,.751207,-.00784203,.43232,.013628,.751213,-.0106732,.43232,.0185499,.751221,-.0139393,.432319,.0242302,.751244,-.0176398,.432325,.0306694,.7513,-.0217743,.432348,.0378698,.751358,-.0263412,.432367,.0458321,.751458,-.0313396,.432404,.0545587,.751608,-.0367682,.432464,.0640543,.7518,-.0426246,.43254,.0743222,.752065,-.0489031,.432645,.0853668,.752376,-.0555828,.432762,.0971911,.752715,-.0623861,.432859,.109768,.753137,-.069415,.432958,.123126,.753676,-.0770039,.433099,.137308,.754345,-.084971,.433272,.15229,.755235,-.0932681,.433504,.168075,.756186,-.10171,.433693,.184625,.757363,-.110019,.433857,.201897,.75884,-.11887,.434102,.220014,.760467,-.127881,.434306,.238778,.762969,-.136766,.434751,.258172,.765823,-.14612,.43529,.278062,.769676,-.15566,.436236,.298437,.774909,-.165177,.437754,.319532,.77994,-.17402,.438343,.342505,.785757,-.182201,.438609,.366693,.792487,-.190104,.438762,.391668,.80038,-.197438,.438795,.417494,.808494,-.204365,.438226,.443933,.817695,-.210714,.437283,.470929,.828111,-.216651,.436087,.498569,.837901,-.221804,.433717,.526165,.847813,-.226318,.430133,.554155,.858314,-.229297,.425213,.582822,.868891,-.230999,.418576,.612847,.878941,-.231155,.410405,.642445,.888809,-.230935,.400544,.672024,.898089,-.229343,.389613,.701366,.908081,-.226886,.377197,.730763,.916819,-.222676,.363397,.759642,.924968,-.216835,.347437,.788775,.932906,-.210245,.32995,.817135,.940025,-.202992,.312262,.844912,.946101,-.19436,.293313,.872164,.952835,-.184125,.273638,.899443,.957347,-.173657,.252385,.926389,.961434,-.162204,.231038,.951947,.965522,-.14979,.209834,.976751,.969412,-.136307,.188821,1.00022,.973902,-.122527,.168013,1.02229,.974045,-.108213,.147634,1.04199,.975775,-.0927397,.12705,1.06019,.978383,-.0778212,.106309,1.07711,.98211,-.0621216,.0849279,1.09245,.986517,-.0463847,.0633519,1.10651,.991696,-.0309353,.0419698,1.11903,.996349,-.0150914,.0206272,1.13073,1.00003,442449e-9,-231396e-9,1.14146,.727498,-885074e-11,.441528,145832e-10,.730897,-223525e-9,.443589,368298e-9,.730796,-893996e-9,.443528,.00147303,.730805,-.00201149,.443533,.00331433,.730814,-.00357596,.443538,.00589222,.730815,-.00558734,.443538,.00920678,.730822,-.00804544,.44354,.0132582,.730836,-.0109501,.443545,.0180468,.730848,-.0143008,.443546,.0235732,.730871,-.0180969,.443552,.0298382,.730915,-.022338,.443567,.0368438,.730982,-.0270225,.443591,.044591,.731076,-.0321491,.443627,.0530831,.731245,-.0377166,.443699,.0623243,.73144,-.0437216,.443777,.0723181,.7317,-.0501576,.443881,.0830691,.732034,-.0569942,.444014,.0945809,.732388,-.0638756,.444113,.106825,.732853,-.071203,.444247,.119859,.733473,-.0790076,.444442,.13369,.734195,-.0871937,.444645,.148304,.735069,-.095696,.444877,.163702,.736169,-.10426,.445133,.179861,.73747,-.112853,.44537,.196778,.738991,-.12199,.445651,.214496,.740865,-.131153,.445958,.232913,.743637,-.140245,.446548,.251977,.746797,-.149722,.447246,.271551,.751517,-.159341,.448656,.291774,.756156,-.169106,.449866,.312455,.761519,-.178436,.450919,.334552,.768295,-.186904,.451776,.358491,.776613,-.195117,.452832,.383446,.783966,-.202695,.45249,.408945,.793542,-.20985,.452587,.435364,.803192,-.216403,.451852,.462336,.813892,-.22251,.450708,.48987,.824968,-.227676,.4486,.517697,.835859,-.232443,.445156,.545975,.846825,-.235775,.440351,.574483,.858085,-.237897,.433641,.604246,.868825,-.238074,.425354,.634101,.879638,-.237661,.415383,.664201,.889966,-.236186,.404136,.693918,.899479,-.233599,.390917,.723481,.908769,-.229737,.376352,.75258,.917966,-.223836,.360372,.781764,.926304,-.217067,.342551,.811139,.934626,-.209309,.324238,.839585,.941841,-.20071,.304484,.867044,.94789,-.190602,.283607,.894579,.954196,-.179253,.262205,.921743,.958383,-.167646,.239847,.948026,.963119,-.155073,.218078,.973296,.966941,-.141426,.195899,.998135,.970836,-.126849,.174121,1.02021,.973301,-.112296,.153052,1.04085,.97448,-.0964965,.131733,1.05946,.977045,-.080489,.10997,1.07693,.980751,-.064844,.0881657,1.09254,.985475,-.0481938,.0657987,1.10697,.991089,-.0319185,.0435215,1.12004,.996122,-.0158088,.0214779,1.13173,1.00001,372455e-9,-200295e-9,1.14291,.708622,-907597e-11,.45304,141962e-10,.711162,-228911e-9,.454662,358052e-9,.709812,-914446e-9,.453797,.00143034,.709865,-.00205819,.453834,.00321935,.709864,-.00365894,.453833,.00572331,.709855,-.00571692,.453826,.00894278,.709862,-.00823201,.453828,.012878,.709875,-.011204,.453832,.0175295,.709896,-.0146323,.453839,.0228978,.709925,-.0185163,.453847,.0289839,.709974,-.0228551,.453866,.0357894,.710045,-.0276473,.453892,.0433161,.710133,-.032891,.453924,.0515665,.710292,-.0385851,.453992,.0605458,.710485,-.0447254,.45407,.0702574,.710769,-.0513051,.454192,.0807077,.711106,-.0582733,.454329,.091896,.711516,-.0652866,.45446,.103814,.712071,-.0728426,.454653,.116508,.712676,-.0808307,.45484,.129968,.713476,-.0892216,.455096,.144206,.714377,-.0979047,.455346,.159212,.715579,-.106531,.455647,.174973,.716977,-.115492,.455961,.191504,.71862,-.124821,.456315,.208835,.72084,-.134079,.4568,.226869,.723786,-.143427,.457521,.245582,.727464,-.153061,.458475,.264957,.732771,-.162768,.460239,.284948,.736515,-.172627,.460899,.30522,.743519,-.182487,.463225,.326717,.750041,-.191295,.464027,.350113,.758589,-.199746,.465227,.374782,.767703,-.207584,.465877,.400226,.777484,-.214973,.465996,.426442,.788792,-.221796,.466019,.453688,.800194,-.228038,.465083,.481246,.811234,-.233346,.462506,.509086,.822859,-.238073,.459257,.537338,.835082,-.241764,.454863,.566108,.846332,-.244241,.448163,.595126,.858355,-.244736,.439709,.625574,.87034,-.244278,.429837,.65617,.881027,-.24255,.418002,.686029,.891007,-.239912,.404325,.716039,.900874,-.236133,.389222,.745518,.911072,-.230672,.373269,.775026,.920359,-.22356,.355083,.804521,.928604,-.215591,.335533,.834045,.937175,-.206503,.315278,.861612,.942825,-.196684,.293653,.889131,.949805,-.185116,.271503,.916853,.955535,-.172703,.248821,.943541,.959843,-.159978,.225591,.970132,.964393,-.146375,.202719,.994709,.968008,-.131269,.179928,1.0186,.971013,-.11569,.158007,1.03928,.973334,-.1003,.13624,1.05887,.975775,-.0833352,.1138,1.07652,.979579,-.0668981,.0913141,1.09297,.984323,-.0500902,.0683051,1.10734,.990351,-.0332377,.0451771,1.12084,.995823,-.0161491,.0221705,1.13296,1.0001,234083e-9,-108712e-9,1.14441,.683895,-924677e-11,.46015,137429e-10,.68833,-233383e-9,.463134,346865e-9,.688368,-933547e-9,.463159,.00138748,.688367,-.00210049,.463159,.00312187,.688369,-.00373415,.463159,.00555004,.688377,-.00583449,.463163,.00867216,.688386,-.00840128,.463166,.0124884,.688398,-.0114343,.463169,.0169993,.688418,-.0149329,.463175,.0222054,.688453,-.0188964,.463188,.028108,.688515,-.0233239,.463214,.0347085,.68857,-.0282136,.463231,.0420091,.688679,-.033564,.463276,.0500132,.688854,-.0393733,.463356,.0587255,.689038,-.0456354,.46343,.0681476,.689321,-.0523433,.463553,.0782897,.689662,-.059412,.463693,.0891501,.690188,-.0665736,.4639,.100735,.690755,-.0743106,.464107,.113074,.691405,-.0824722,.464329,.126161,.692198,-.0910484,.464585,.140007,.693196,-.0998778,.464893,.154612,.69454,-.108651,.465285,.169984,.695921,-.117855,.465596,.186106,.697749,-.12734,.466056,.203034,.700375,-.136714,.466771,.220703,.703395,-.146386,.467579,.239062,.707904,-.156096,.469067,.258188,.711673,-.165904,.469851,.277759,.717489,-.175812,.471815,.297935,.724051,-.185931,.47389,.318916,.731965,-.195238,.47587,.341591,.741151,-.204021,.477523,.366062,.751416,-.212113,.478881,.391396,.761848,-.21979,.479226,.417599,.771886,-.2267,.478495,.444401,.783998,-.232991,.477622,.472084,.796523,-.238645,.475833,.500193,.808851,-.243396,.472568,.52865,.821191,-.247226,.467857,.557362,.834261,-.250102,.461871,.586768,.846762,-.251056,.453543,.617085,.859867,-.250604,.443494,.647659,.871948,-.248783,.431711,.678119,.882967,-.245855,.417911,.708399,.892826,-.242168,.401993,.738256,.90332,-.237062,.385371,.767999,.913633,-.22997,.366837,.798191,.922774,-.221687,.346372,.827756,.931371,-.212345,.325682,.856425,.938929,-.20206,.303665,.884299,.944821,-.190981,.280786,.912023,.951792,-.178065,.2573,.939669,.957712,-.164634,.233448,.96655,.961912,-.150863,.209504,.992366,.966382,-.13577,.18597,1.01633,.969588,-.119593,.162905,1.03843,.971777,-.103203,.14053,1.05841,.97433,-.0865888,.117909,1.07632,.978686,-.0690829,.0944101,1.09326,.983281,-.0516568,.0705671,1.10796,.989562,-.034558,.0468592,1.12182,.995465,-.0167808,.0229846,1.1342,.999991,373016e-9,-235606e-9,1.1459,.662251,-939016e-11,.468575,132714e-10,.666634,-237624e-9,.471675,335842e-9,.666411,-950385e-9,.471516,.00134321,.666399,-.00213833,.471509,.00302221,.666386,-.0038014,.471499,.00537283,.666405,-.00593958,.471511,.00839533,.666406,-.00855253,.471508,.0120898,.666428,-.0116401,.471519,.0164569,.666444,-.0152015,.471522,.0214971,.66649,-.0192362,.471543,.027212,.666537,-.0237428,.471558,.033603,.666617,-.0287198,.471591,.0406728,.666718,-.0341647,.471631,.0484238,.666889,-.0400759,.47171,.0568621,.667104,-.0464479,.471805,.0659915,.667374,-.0532677,.471923,.0758178,.667772,-.0603805,.472098,.0863425,.668371,-.0677392,.472363,.0975917,.668971,-.0756028,.472596,.109567,.669696,-.0839293,.472869,.122272,.670481,-.0926683,.473126,.135718,.6715,-.1016,.473442,.149914,.672911,-.110566,.47389,.164882,.674512,-.119984,.474354,.180602,.67651,-.129574,.474922,.19711,.679292,-.139106,.475764,.214371,.682798,-.148993,.476886,.232405,.686955,-.158737,.478179,.251153,.691406,-.168754,.479432,.270436,.697438,-.178703,.481481,.290374,.704761,-.188955,.484143,.311044,.713599,-.198814,.487007,.333003,.723194,-.207869,.488962,.357144,.732601,-.216189,.489815,.382169,.744193,-.22398,.490888,.408227,.754907,-.231156,.490355,.434928,.767403,-.23747,.489548,.462599,.78107,-.243503,.488274,.490908,.793893,-.248114,.484843,.519421,.807296,-.25222,.4803,.548561,.820529,-.255265,.474097,.577772,.833716,-.256741,.466041,.607782,.848403,-.25637,.456547,.638807,.860755,-.254804,.443946,.670058,.874012,-.251834,.430852,.700749,.885619,-.247867,.414903,.731446,.896069,-.242634,.397276,.761191,.906266,-.236093,.378535,.791053,.916759,-.227543,.358038,.821298,.92523,-.21783,.335705,.850747,.93436,-.207534,.313797,.879258,.941631,-.195983,.289671,.907734,.947564,-.183567,.265319,.935206,.953681,-.169345,.240815,.962739,.960008,-.154909,.216119,.989227,.964145,-.140161,.192096,1.01465,.968171,-.123411,.167855,1.03737,.969859,-.106525,.144817,1.05767,.972666,-.0891023,.12149,1.0761,.977055,-.0718094,.0975306,1.09336,.982527,-.0534213,.0730217,1.10878,.989001,-.0355579,.0483366,1.12285,.99512,-.0176383,.023938,1.13548,1.00007,368831e-9,-211581e-9,1.14744,.651047,-960845e-11,.484101,12922e-9,.644145,-241347e-9,.478968,324578e-9,.64396,-965142e-9,.478831,.00129798,.64396,-.00217154,.47883,.00292046,.643968,-.00386049,.478835,.00519202,.643974,-.00603186,.478838,.0081128,.643977,-.0086854,.478836,.011683,.643982,-.0118207,.478834,.0159031,.644024,-.0154374,.478856,.0207743,.644059,-.0195343,.478868,.0262975,.644122,-.0241103,.478896,.0324747,.644207,-.0291638,.478933,.039309,.64432,-.0346919,.478981,.0468029,.644481,-.0406919,.479053,.0549614,.644722,-.047159,.479169,.0637909,.645013,-.0540748,.479302,.0732974,.645503,-.0612001,.479541,.0834898,.646117,-.0687303,.479829,.0943873,.646707,-.0767846,.480061,.105991,.647431,-.0852465,.480343,.11831,.64831,-.0940719,.48066,.131348,.649486,-.103056,.481083,.14514,.650864,-.112261,.481528,.159676,.652604,-.121852,.482102,.174979,.654825,-.131505,.482813,.191079,.657876,-.141189,.483876,.207927,.661339,-.151239,.48499,.225586,.665463,-.161091,.486279,.243947,.670542,-.171235,.487968,.262957,.677361,-.181347,.49053,.282781,.685672,-.191679,.493862,.303311,.694551,-.201781,.49699,.324607,.703753,-.211164,.498884,.347916,.713703,-.219675,.500086,.372628,.725911,-.227836,.501554,.398694,.73862,-.23533,.502193,.425529,.752118,-.241786,.501811,.453209,.76579,-.247865,.500185,.481381,.779568,-.252696,.497159,.51011,.793991,-.256802,.492765,.539322,.808182,-.259942,.486827,.569078,.821698,-.261703,.478386,.598818,.836009,-.262006,.468772,.629762,.849824,-.260333,.456352,.661366,.863888,-.257398,.442533,.69295,.876585,-.253264,.426573,.723608,.888665,-.248026,.408964,.754378,.899537,-.241487,.389677,.784761,.9094,-.233463,.368516,.814688,.920166,-.223397,.346624,.845009,.928899,-.21255,.322717,.874431,.937156,-.200869,.298698,.902922,.943861,-.188387,.273491,.931356,.949557,-.174341,.247866,.958854,.955862,-.158994,.222496,.986098,.961721,-.143664,.197522,1.01229,.965976,-.127412,.17302,1.03571,.968652,-.109798,.148954,1.05699,.971084,-.0916787,.125044,1.07587,.975584,-.0739634,.100577,1.09372,.98122,-.055322,.0753666,1.10948,.988253,-.0366825,.0498899,1.12394,.99482,-.0180389,.024611,1.13694,1.00001,229839e-9,-188283e-9,1.14919,.613867,-964198e-11,.479449,123452e-10,.621485,-244534e-9,.485399,313091e-9,.621429,-978202e-9,.485353,.00125245,.62112,-.00220004,.485114,.00281687,.621119,-.0039111,.485112,.00500783,.621122,-.00611091,.485112,.00782498,.621133,-.00879922,.485117,.0112687,.621152,-.0119756,.485125,.0153394,.621183,-.0156396,.485139,.0200382,.621227,-.0197898,.485158,.0253663,.621298,-.0244253,.485192,.0313261,.621388,-.0295441,.485233,.0379204,.621507,-.0351432,.485286,.0451523,.621693,-.0412198,.485378,.0530277,.621933,-.0477673,.485495,.0615522,.622232,-.0547574,.485635,.0707316,.622809,-.0619417,.485943,.0805883,.623407,-.069625,.486232,.0911267,.62406,-.077796,.486516,.102354,.624835,-.0863731,.486838,.114279,.625758,-.095251,.487188,.126902,.627043,-.104299,.487695,.140285,.628438,-.113724,.488163,.154397,.630325,-.123417,.488858,.169267,.632801,-.133137,.489754,.184941,.635784,-.143052,.490815,.20136,.639406,-.153132,.492048,.218643,.643872,-.163143,.49363,.236615,.6499,-.17333,.496009,.255449,.657201,-.183622,.498994,.275006,.666221,-.194019,.502888,.295354,.674419,-.204192,.505459,.316244,.683729,-.21406,.507771,.33849,.695584,-.222854,.510245,.363166,.708583,-.231315,.512293,.389071,.721233,-.238911,.512747,.415737,.735134,-.245657,.512482,.443331,.750179,-.251879,.511526,.471891,.765073,-.256911,.508935,.500892,.779794,-.261144,.504341,.530294,.794801,-.264316,.498515,.560144,.810339,-.266276,.491015,.590213,.824818,-.266981,.481126,.620865,.839375,-.265778,.468685,.652687,.853043,-.262748,.453925,.684759,.867335,-.258474,.437912,.716209,.88037,-.253187,.419648,.747508,.891711,-.246476,.39982,.77797,.902896,-.238735,.37879,.808586,.913601,-.22885,.355891,.838843,.923019,-.217656,.331773,.869014,.933432,-.205539,.307356,.898512,.939691,-.192595,.281321,.9269,.946938,-.178945,.255441,.955297,.952372,-.163587,.229013,.983231,.95909,-.147214,.203179,1.00971,.963675,-.13064,.17792,1.03438,.968247,-.113121,.152898,1.05625,.97001,-.0945824,.128712,1.07598,.974458,-.0755648,.103349,1.094,.980168,-.0571998,.0776731,1.1104,.987295,-.0377994,.0514445,1.12491,.994432,-.0186417,.025429,1.13851,.999975,542714e-9,-282356e-9,1.15108,.592656,-980249e-11,.486018,119532e-10,.598467,-247275e-9,.490781,301531e-9,.597934,-988317e-9,.490343,.00120517,.597903,-.00222366,.490319,.0027116,.597913,-.00395315,.490327,.00482077,.597919,-.00617653,.490329,.00753264,.597936,-.00889375,.490339,.0108478,.597956,-.0121043,.490347,.0147668,.597992,-.0158073,.490365,.0192905,.598032,-.0200017,.490382,.0244204,.598109,-.0246865,.49042,.0301593,.598215,-.0298594,.490474,.03651,.59833,-.0355167,.490524,.0434757,.598525,-.0416559,.490624,.0510629,.598778,-.0482692,.490753,.0592781,.599135,-.0553114,.49094,.0681304,.599802,-.062542,.491328,.0776467,.600361,-.0703638,.491598,.0878184,.60101,-.0786256,.491882,.0986573,.601811,-.0872962,.492232,.11018,.602861,-.0962284,.492684,.1224,.604167,-.10538,.493213,.135354,.605693,-.114896,.493799,.149034,.607682,-.124654,.494576,.163469,.610672,-.13456,.4959,.178747,.613313,-.144581,.496713,.194723,.617603,-.154703,.498499,.211617,.622174,-.16489,.500188,.229183,.628855,-.175164,.503072,.247786,.636963,-.185565,.506798,.267116,.644866,-.195911,.509719,.28702,.653741,-.206104,.512776,.307763,.664942,-.216447,.516812,.329631,.67633,-.22552,.519181,.353515,.690012,-.234316,.521681,.379226,.704243,-.242032,.523129,.405901,.719396,-.249172,.523768,.433585,.734471,-.255543,.522541,.462085,.750539,-.260697,.520217,.491233,.766365,-.26501,.516293,.521094,.781677,-.268409,.509708,.551014,.797132,-.270399,.501944,.581463,.812655,-.271247,.492025,.612402,.828592,-.270708,.480424,.643798,.844044,-.268085,.465955,.67682,.857305,-.263459,.448425,.708496,.87114,-.258151,.430243,.74046,.884936,-.251171,.410578,.771583,.895772,-.243305,.38862,.802234,.906961,-.234037,.365214,.833179,.917775,-.222714,.34116,.86353,.927883,-.210175,.31572,.893557,.936617,-.196925,.289159,.922976,.943384,-.182788,.261996,.951606,.949713,-.167965,.235324,.979958,.955818,-.151109,.208408,1.00765,.961344,-.133834,.182591,1.03329,.965469,-.115987,.156958,1.0557,.968693,-.09746,.132239,1.07583,.973165,-.0778514,.106195,1.09451,.979387,-.0585067,.0797669,1.11137,.98671,-.0390409,.0530263,1.12643,.994093,-.019408,.0263163,1.14016,1.00002,540029e-9,-194487e-9,1.15299,.574483,-989066e-11,.494533,114896e-10,.574478,-249127e-9,.494528,289403e-9,.574607,-996811e-9,.494637,.00115797,.574396,-.00224241,.494458,.00260498,.574377,-.00398632,.49444,.00463102,.574386,-.00622836,.494445,.00723623,.574401,-.0089683,.494453,.010421,.574419,-.0122056,.49446,.0141859,.574459,-.0159396,.494481,.0185322,.574525,-.0201692,.49452,.0234617,.574587,-.0248924,.494547,.0289762,.574697,-.0301074,.494604,.0350797,.574853,-.0358114,.494688,.0417767,.575027,-.041999,.494772,.0490718,.575294,-.0486618,.494915,.0569728,.575733,-.0557148,.495173,.0654955,.576356,-.0630489,.495537,.0746612,.576944,-.0709285,.495836,.0844615,.57765,-.0792723,.496177,.0949142,.578491,-.0880167,.496563,.10603,.579639,-.0969462,.497096,.117841,.580989,-.10622,.497684,.130367,.582587,-.115861,.498337,.143609,.584951,-.125605,.499414,.157625,.587602,-.135608,.500518,.172413,.59076,-.145742,.501767,.187999,.594992,-.155934,.503542,.20445,.600656,-.166303,.506135,.221764,.607816,-.176681,.509542,.24002,.61522,-.187071,.51263,.258992,.623702,-.197465,.516021,.278773,.634192,-.207816,.520422,.299377,.644936,-.218183,.524073,.320802,.657888,-.2278,.528049,.34384,.670666,-.236747,.52986,.36916,.685626,-.24484,.531892,.395867,.701304,-.252071,.532727,.423488,.717727,-.258714,.532146,.452201,.733914,-.264211,.529883,.481579,.750529,-.26859,.5259,.511558,.76747,-.272046,.51999,.542042,.785189,-.274225,.513083,.572799,.800954,-.275189,.502936,.603816,.816962,-.274946,.490921,.635461,.83336,-.272695,.47684,.6676,.848143,-.268223,.459405,.70051,.861818,-.262768,.440319,.732902,.876828,-.255872,.420123,.765084,.889312,-.247703,.398379,.796391,.900412,-.238381,.374496,.827333,.912251,-.227783,.349874,.858385,.921792,-.214832,.323181,.888652,.931273,-.200949,.296624,.917763,.940295,-.186537,.269211,.947878,.946812,-.171538,.241447,.977016,.953588,-.155254,.213829,1.00501,.958841,-.137156,.186807,1.03179,.963746,-.118699,.160706,1.05502,.966468,-.0998358,.135504,1.07568,.971178,-.0805186,.109131,1.09479,.97831,-.0599348,.0818293,1.1123,.985886,-.0399661,.0545872,1.12771,.994021,-.0198682,.0269405,1.14186,1.00009,271022e-9,-12989e-8,1.15514,.538716,-990918e-11,.486732,109675e-10,.550656,-250642e-9,.497518,277412e-9,.55057,-.00100265,.497441,.00110974,.550903,-.00225672,.497733,.00249779,.550568,-.00401046,.497438,.00443906,.550574,-.00626613,.49744,.00693637,.550591,-.0090226,.497449,.00998921,.550623,-.0122795,.497469,.0135984,.550667,-.0160361,.497495,.0177654,.550724,-.0202908,.497526,.0224915,.550792,-.0250421,.497557,.0277795,.550918,-.0302878,.49763,.0336334,.551058,-.0360241,.497701,.0400573,.551276,-.0422473,.497824,.0470585,.551551,-.0489441,.497977,.0546433,.552074,-.0559596,.498312,.0628367,.552681,-.0633978,.498679,.071646,.553324,-.0713176,.499031,.0810746,.554011,-.0797268,.499365,.091129,.55488,-.0885238,.499779,.101837,.556171,-.0974417,.500444,.113239,.557498,-.106841,.501025,.125316,.559299,-.116533,.501864,.138128,.561647,-.126298,.502967,.151695,.564347,-.136388,.504129,.16604,.567863,-.146576,.505713,.181207,.572569,-.156832,.507953,.197259,.578919,-.167323,.511186,.214258,.585387,-.177712,.514042,.232038,.593134,-.188184,.517484,.250733,.603295,-.198717,.522345,.270454,.613854,-.209177,.526751,.290807,.626092,-.219644,.531595,.312202,.637868,-.229494,.534721,.334435,.652458,-.238718,.538304,.359184,.666985,-.247061,.539875,.385637,.683301,-.254652,.541042,.41328,.69998,-.261376,.540735,.441903,.717824,-.267085,.539139,.471609,.734617,-.271465,.534958,.501446,.753663,-.27528,.53032,.532571,.770512,-.277617,.522134,.563641,.787356,-.278525,.51206,.595067,.806252,-.278512,.50119,.627226,.822061,-.277023,.486791,.659402,.838959,-.273175,.470467,.692874,.85379,-.267238,.450688,.725702,.868268,-.260327,.429741,.75832,.881994,-.251946,.407223,.790189,.893885,-.242432,.383214,.821625,.905118,-.231904,.357297,.853011,.916045,-.219545,.330733,.883773,.927614,-.205378,.303916,.914435,.936005,-.190388,.275941,.944502,.944533,-.1749,.247493,.974439,.950758,-.158588,.218996,1.00286,.957078,-.141027,.191559,1.0304,.962448,-.121507,.164457,1.05466,.964993,-.102068,.138636,1.0761,.970017,-.0822598,.111861,1.09541,.97661,-.062033,.0843438,1.11317,.985073,-.0409832,.0558496,1.12911,.993515,-.020146,.0275331,1.1438,1.00006,27329e-8,-107883e-9,1.15736,.525324,-999341e-11,.498153,105385e-10,.526513,-251605e-9,.499277,265329e-9,.526517,-.00100641,.499282,.0010613,.526588,-.00226466,.499337,.00238823,.526539,-.0040255,.499302,.00424535,.526547,-.00628954,.499306,.00663364,.526561,-.00905628,.499313,.00955337,.526593,-.0123253,.499334,.0130054,.526642,-.0160957,.499365,.0169911,.5267,-.0203661,.499396,.0215122,.526792,-.0251347,.499451,.0265718,.526904,-.0303985,.499511,.0321732,.527079,-.0361554,.499617,.0383231,.527285,-.0423982,.499731,.045026,.527602,-.0491121,.499924,.0522936,.528166,-.0561127,.500306,.0601528,.52879,-.0635988,.5007,.0686059,.529421,-.071581,.501048,.0776518,.530144,-.0799854,.501421,.0873148,.531062,-.0888032,.501884,.0976084,.532374,-.0977643,.50259,.108588,.533828,-.107197,.50329,.120234,.53581,-.116887,.504312,.132602,.538063,-.126755,.505365,.145721,.5409,-.136819,.506668,.159617,.544882,-.147117,.508731,.174369,.550238,-.157446,.511601,.190028,.556038,-.167988,.514431,.206587,.563031,-.178364,.517808,.224046,.571543,-.189007,.521937,.242503,.582255,-.199546,.527415,.261977,.59272,-.210084,.531682,.282162,.605648,-.220448,.537123,.303426,.61785,-.230593,.540664,.325323,.632223,-.240238,.544467,.348993,.648819,-.24887,.547594,.375462,.665825,-.256657,.54912,.403024,.683389,-.263711,.549294,.431773,.701495,-.269666,.547649,.461494,.719197,-.274169,.543786,.491623,.737906,-.278124,.538644,.522994,.756652,-.280632,.531057,.554775,.775279,-.281741,.521972,.586441,.792688,-.281652,.509613,.618596,.811894,-.280345,.496497,.651462,.827938,-.277128,.47968,.684023,.844837,-.271646,.460688,.718024,.859239,-.264397,.438872,.751207,.874088,-.256144,.41577,.784232,.887693,-.246311,.391369,.816191,.899402,-.235497,.365872,.847828,.910973,-.223631,.338618,.87934,.92204,-.209874,.310803,.910325,.930987,-.194265,.281802,.940695,.94,-.178125,.252836,.970958,.948018,-.161479,.224239,1.00078,.955141,-.144038,.195857,1.0288,.960513,-.124915,.168487,1.05371,.963964,-.104284,.141495,1.07596,.968713,-.0838732,.114437,1.09628,.975524,-.0635579,.0863105,1.11448,.98431,-.042291,.0574774,1.13069,.992916,-.0209131,.0284343,1.14568,.999926,743097e-9,-379265e-9,1.15955,.501042,-998428e-11,.498726,100306e-10,.502992,-252112e-9,.500665,253283e-9,.502417,-.00100791,.500092,.00101259,.502965,-.00226919,.500621,.00227978,.502318,-.00403109,.499994,.00405011,.502333,-.00629832,.500005,.00632868,.502362,-.00906907,.500027,.00911446,.502369,-.0123423,.500023,.0124078,.50243,-.0161178,.500066,.016211,.502493,-.0203937,.500103,.0205256,.502592,-.0251684,.500166,.0253548,.502707,-.0304389,.50023,.0307029,.502881,-.0362015,.500335,.0365753,.503124,-.0424507,.500488,.0429798,.503443,-.0491582,.500686,.0499268,.504083,-.0561476,.501155,.0574541,.504668,-.0636846,.501524,.0655408,.505319,-.0716834,.501904,.0742072,.50609,-.0800925,.502321,.0834699,.507122,-.0888425,.502896,.0933603,.508414,-.097855,.503603,.10391,.509955,-.107304,.504416,.115113,.512061,-.116921,.505565,.127054,.514419,-.12689,.506732,.139709,.517529,-.136934,.508338,.153173,.522085,-.147327,.510987,.167528,.526986,-.157612,.513527,.182708,.533122,-.168213,.516717,.198881,.540807,-.178688,.520832,.215986,.550687,-.189511,.52632,.234335,.560567,-.199998,.531009,.253375,.571698,-.210652,.535839,.273499,.584364,-.220917,.541091,.294355,.599066,-.23137,.546875,.316525,.614148,-.241206,.551306,.339671,.631157,-.250379,.555187,.36531,.647919,-.258397,.556595,.392767,.666112,-.265528,.556949,.421397,.686158,-.271827,.556617,.451433,.704838,-.27674,.552975,.482131,.723957,-.280733,.547814,.513458,.74262,-.283359,.53997,.545446,.762009,-.284541,.530422,.57775,.781314,-.284507,.518546,.610434,.799116,-.283309,.504178,.643178,.817604,-.280378,.48843,.676248,.83459,-.275619,.469457,.709698,.850974,-.26856,.447698,.744245,.866747,-.260094,.424791,.777695,.881412,-.249929,.399913,.810392,.8936,-.239137,.37308,.842872,.905943,-.226818,.345705,.874677,.916408,-.213699,.31706,.906257,.927215,-.198428,.288444,.936881,.935625,-.181643,.258329,.96795,.944076,-.164386,.228488,.998216,.951229,-.146339,.199763,1.02689,.958793,-.127709,.172153,1.0535,.963219,-.107244,.144989,1.07646,.967562,-.0857764,.11685,1.09675,.974866,-.0645377,.0880571,1.11576,.983353,-.0431732,.0587352,1.13227,.992503,-.0218356,.0294181,1.1478,1.00003,605203e-9,-231013e-9,1.16207,.482935,-101177e-10,.504695,968142e-11,.477554,-251521e-9,.499071,240676e-9,.477904,-.00100683,.499436,96342e-8,.478368,-.00226636,.499899,.0021687,.477977,-.00402719,.499513,.00385384,.477993,-.00629226,.499525,.0060221,.478011,-.00906011,.499536,.00867289,.478051,-.0123305,.499566,.0118074,.478089,-.016102,.499587,.0154269,.478171,-.0203736,.499645,.0195341,.478254,-.025143,.499692,.0241318,.47839,-.0304071,.499779,.0292247,.478588,-.0361631,.499911,.0348196,.478812,-.0424023,.500046,.0409231,.479208,-.0490724,.500326,.047552,.479841,-.0560722,.500805,.0547377,.480392,-.0636125,.501152,.0624607,.481068,-.0716134,.501561,.0707473,.481898,-.0800062,.502054,.0796118,.483022,-.0886568,.502728,.0890974,.484332,-.0977553,.503479,.0992099,.486126,-.107173,.504546,.10999,.488066,-.11677,.50557,.121476,.490521,-.126725,.506849,.133672,.494232,-.136793,.50911,.146731,.498302,-.147116,.511345,.160577,.503565,-.157446,.514344,.175335,.510902,-.168121,.518824,.191207,.519263,-.178799,.523666,.208058,.528204,-.189407,.528296,.225875,.538854,-.200145,.533724,.244782,.551278,-.210701,.539833,.264753,.565222,-.221303,.546131,.285745,.579403,-.231688,.551496,.307592,.595469,-.241718,.556809,.330582,.610929,-.250992,.559641,.354995,.629433,-.259602,.562379,.382471,.648504,-.267038,.563676,.411126,.66756,-.273388,.562092,.440924,.689143,-.278788,.560807,.472118,.709056,-.282783,.555701,.503774,.729855,-.285836,.548698,.536364,.748954,-.287078,.538544,.56895,.768373,-.287133,.526711,.601991,.78827,-.285839,.512511,.635403,.807465,-.283238,.496323,.668797,.825194,-.27906,.477638,.702584,.842203,-.272286,.456253,.736393,.857749,-.263854,.432412,.77096,.874799,-.253943,.407806,.80489,.887497,-.24237,.38033,.83771,.89966,-.230278,.352446,.870376,.911753,-.21646,.323268,.902256,.923011,-.202071,.294314,.933306,.932375,-.185519,.264104,.965177,.940537,-.167604,.234035,.996303,.948904,-.149068,.20412,1.0261,.955263,-.129539,.175431,1.05304,.960303,-.109932,.148116,1.07617,.965512,-.0880572,.119693,1.09742,.973466,-.0660548,.0901619,1.11721,.98284,-.0439228,.0599875,1.13436,.992216,-.0219588,.0298975,1.15006,.999946,119402e-9,-208547e-10,1.16471,.447827,-100414e-10,.491543,914833e-11,.454778,-251257e-9,.499172,22891e-8,.453519,-.00100342,.497787,914184e-9,.45357,-.00225776,.497847,.00205701,.453578,-.00401371,.497855,.00365705,.45357,-.00627107,.497841,.00571453,.453598,-.00902968,.497864,.00823019,.453627,-.0122888,.497882,.0112049,.453684,-.0160475,.497923,.0146405,.453764,-.0203044,.49798,.0185394,.453866,-.0250576,.498049,.0229054,.453996,-.0303028,.49813,.0277424,.454196,-.0360379,.498267,.0330587,.454457,-.0422521,.498445,.0388613,.454926,-.0488393,.498812,.0451767,.455525,-.0558653,.499272,.0520153,.456074,-.0633772,.499625,.0593754,.456752,-.0713606,.500049,.0672751,.457648,-.07971,.500615,.0757447,.458849,-.0883032,.501399,.0848231,.46029,-.0974095,.502293,.0945135,.462,-.106729,.503301,.104848,.464121,-.116354,.504533,.115884,.466889,-.126214,.506172,.127652,.470744,-.136324,.508667,.14024,.47488,-.146595,.510995,.153673,.480845,-.157027,.514832,.168053,.488262,-.167658,.519506,.183508,.496547,-.178343,.524347,.199948,.506254,-.188916,.52983,.217503,.517961,-.199975,.536357,.236272,.531484,-.210624,.543641,.256096,.545496,-.221227,.550048,.277085,.559497,-.231568,.555076,.298615,.575752,-.241698,.560541,.321547,.591999,-.251172,.564156,.345602,.610654,-.260178,.567607,.371851,.630484,-.268094,.56923,.40076,.651807,-.274661,.569779,.430801,.67239,-.280331,.566791,.461939,.693024,-.284501,.562007,.493854,.715473,-.287852,.555791,.526992,.736323,-.28929,.546345,.560102,.755771,-.289405,.534,.593543,.775424,-.2881,.519114,.627256,.795447,-.285562,.502543,.661464,.815319,-.281416,.484773,.695206,.831769,-.275523,.463445,.729044,.849464,-.267516,.440269,.764069,.866775,-.257584,.415049,.799089,.881252,-.245817,.388049,.831948,.894209,-.233127,.35889,.865526,.906922,-.219579,.329915,.89818,.919686,-.204491,.300441,.930013,.929044,-.188962,.269445,.962061,.938393,-.171079,.238402,.994214,.94661,-.15199,.208204,1.02533,.953095,-.131953,.178653,1.0529,.958644,-.111233,.150684,1.0771,.963925,-.0903098,.122359,1.09855,.971995,-.0680505,.0923342,1.11874,.981658,-.0448512,.0614195,1.13635,.991649,-.0221931,.0303582,1.15238,.999985,393403e-9,-111086e-9,1.16772,.396806,-971563e-11,.457671,842355e-11,.429186,-249421e-9,.495017,21625e-8,.429324,-998052e-9,.495173,865322e-9,.429175,-.00224487,.494999,.00194637,.429129,-.00399041,.494952,.00346004,.429153,-.00623476,.494974,.00540684,.429168,-.0089773,.494983,.00778714,.429207,-.0122175,.495012,.0106022,.429257,-.0159542,.495047,.0138535,.429338,-.0201864,.495106,.0175443,.429431,-.0249104,.495165,.0216774,.429587,-.0301252,.495279,.0262594,.429796,-.0358249,.495432,.0312968,.430065,-.0419972,.495621,.0367985,.430588,-.0485144,.496061,.042798,.43113,-.0555028,.496472,.0492914,.431743,-.0629852,.496904,.0562907,.432448,-.0709256,.497369,.0638056,.433414,-.0791942,.498032,.071885,.434638,-.0877346,.498854,.0805517,.43611,-.0968056,.499812,.0898047,.437859,-.106002,.500891,.0997142,.440017,-.115648,.502198,.110289,.443236,-.125427,.504389,.121644,.44697,-.135492,.506809,.133769,.451689,-.145746,.509858,.146787,.45811,-.156219,.514247,.160793,.465305,-.166834,.518816,.175791,.474085,-.177546,.524331,.191906,.484808,-.188262,.53104,.209199,.49732,-.199346,.538511,.227825,.509693,-.209951,.544554,.247269,.524367,-.220533,.551616,.267978,.539228,-.231082,.557368,.289672,.55644,-.241342,.563782,.31268,.574204,-.250964,.568851,.33651,.593388,-.260306,.57312,.362219,.613358,-.268667,.574916,.390322,.634512,-.275591,.575053,.420478,.65563,-.281328,.572404,.451614,.678265,-.285948,.568893,.484112,.70011,-.289408,.561878,.517348,.723005,-.291328,.55359,.551355,.743744,-.291418,.541099,.585109,.763949,-.290252,.526489,.619487,.784186,-.287648,.509496,.65404,.804304,-.283782,.491484,.688649,.823629,-.278067,.470517,.723133,.84094,-.270588,.44705,.757163,.857852,-.261188,.421252,.792816,.874934,-.249313,.394191,.827248,.888709,-.236492,.365359,.861074,.902589,-.222185,.336016,.894417,.914201,-.207314,.30527,.926825,.925978,-.191146,.274532,.9595,.93512,-.174135,.243393,.991583,.943656,-.155231,.212414,1.02356,.951719,-.134403,.182005,1.05239,.957164,-.113023,.153043,1.07754,.962656,-.0914493,.124186,1.09984,.970695,-.0694179,.0941654,1.12,.980749,-.0466199,.0629671,1.13849,.991205,-.0227032,.0311146,1.15494,.999884,632388e-9,-254483e-9,1.1706,.379821,-957289e-11,.460637,789337e-11,.405188,-247483e-9,.491396,204064e-9,.404796,-989434e-9,.490914,815853e-9,.40483,-.00222607,.490949,.00183559,.40473,-.00395723,.49084,.00326332,.404731,-.00618287,.490836,.00509945,.404768,-.00890258,.490871,.00734463,.404791,-.0121156,.490883,.00999992,.404857,-.0158214,.490938,.0130676,.404943,-.0200178,.491004,.0165503,.405059,-.0247027,.491093,.0204521,.405213,-.0298729,.491205,.0247788,.405399,-.0355226,.491333,.0295373,.405731,-.0416352,.491604,.034741,.406303,-.0480807,.492116,.0404255,.406814,-.0550458,.492506,.0465732,.407404,-.0624652,.492926,.0532058,.408149,-.0702958,.493442,.0603442,.409128,-.0784623,.494136,.0680297,.410408,-.087007,.495054,.0762786,.411813,-.0959639,.495962,.0851046,.413735,-.105075,.497257,.0945878,.416137,-.114646,.498882,.104725,.41934,-.124394,.501132,.11563,.423326,-.134328,.503883,.127325,.428419,-.14458,.50747,.139911,.43484,-.154979,.511964,.153481,.442641,-.165628,.517328,.168114,.452511,-.176365,.524258,.183995,.463473,-.187298,.531248,.200953,.475564,-.198244,.538367,.219176,.488664,-.208938,.545175,.238514,.504073,-.219599,.553227,.259129,.520832,-.230378,.560653,.280997,.538455,-.240703,.567523,.303821,.55709,-.250548,.573287,.327948,.576646,-.259964,.577795,.353362,.596705,-.268721,.580077,.380336,.618053,-.276054,.58018,.4101,.640303,-.282176,.578747,.44161,.662365,-.286931,.574294,.474106,.684542,-.290521,.567035,.507549,.707984,-.292672,.558687,.541853,.730913,-.293189,.547606,.576581,.752948,-.292199,.533471,.61172,.773452,-.289508,.516395,.646339,.794715,-.285716,.497873,.682131,.814251,-.280051,.476845,.716396,.833057,-.272873,.453449,.751503,.84959,-.263982,.427857,.786085,.867022,-.252745,.400335,.821355,.882277,-.239655,.371304,.85646,.895375,-.225386,.340397,.890828,.909347,-.209587,.310005,.923532,.921885,-.193433,.2796,.956419,.932127,-.176135,.247276,.989445,.941869,-.157872,.216186,1.02221,.949735,-.137577,.185602,1.05195,.956617,-.115285,.155767,1.07822,.961974,-.0928418,.126103,1.10149,.96972,-.0700592,.0956758,1.12207,.98012,-.0474671,.0643269,1.1408,.990825,-.0238113,.0320863,1.1577,.999876,381574e-9,-812203e-10,1.17403,.367636,-961342e-11,.469176,753287e-11,.380377,-244772e-9,.485434,191797e-9,.380416,-978857e-9,.485475,767015e-9,.380376,-.00220165,.485435,.00172522,.380419,-.00391408,.485487,.00306734,.380438,-.00611549,.485505,.00479332,.380462,-.00880558,.485525,.00690391,.380496,-.0119837,.485551,.00940039,.38056,-.0156487,.485605,.0122848,.38064,-.0197988,.485666,.0155601,.380767,-.0244324,.48577,.0192313,.380909,-.0295444,.485871,.0233032,.381142,-.0351321,.48606,.0277861,.381472,-.0411535,.486336,.0326939,.382015,-.0475408,.486833,.0380565,.382523,-.0544395,.487231,.0438615,.383129,-.061784,.487683,.0501332,.383952,-.0695085,.488313,.0568996,.38498,-.0775819,.489077,.0641952,.386331,-.0860443,.490113,.0720324,.387788,-.0948406,.491099,.0804379,.389808,-.103899,.492566,.0894899,.39252,-.113313,.494601,.0992098,.395493,-.123007,.496619,.109641,.399826,-.132859,.499912,.120919,.405341,-.143077,.504061,.133107,.411932,-.153465,.508905,.146263,.420591,-.164108,.515482,.160544,.43101,-.174893,.523191,.176123,.441881,-.185839,.53026,.192757,.453919,-.196633,.537295,.210535,.468715,-.207611,.546156,.229886,.485182,-.218517,.555173,.250543,.501926,-.229249,.562728,.27221,.51785,-.239481,.567494,.294892,.536947,-.249395,.573889,.318987,.557115,-.259,.578831,.344348,.577966,-.268075,.582055,.371223,.599489,-.276115,.583307,.399834,.62479,-.282523,.583902,.431415,.647504,-.287663,.57953,.464301,.670601,-.291538,.573103,.498123,.693539,-.293842,.563731,.532662,.717385,-.294681,.553169,.567925,.741533,-.293717,.539908,.603502,.762142,-.291156,.521902,.639074,.783014,-.28719,.502815,.674439,.805158,-.281773,.482598,.710497,.823646,-.274682,.458949,.7456,.841879,-.266184,.433129,.781085,.859515,-.255682,.406064,.816,.875335,-.242849,.376509,.851074,.890147,-.228329,.345502,.886473,.903144,-.212491,.31428,.920751,.916618,-.195695,.282994,.954606,.927953,-.178267,.251091,.988402,.937414,-.159549,.219107,1.02141,.946823,-.140022,.18896,1.05167,.954651,-.118154,.158667,1.07819,.959955,-.0946636,.128808,1.1025,.96858,-.0711792,.0973787,1.12391,.97938,-.0475046,.0650965,1.14322,.990498,-.024059,.0326267,1.16077,.999844,-512408e-10,112444e-9,1.17727,.316912,-934977e-11,.425996,695559e-11,.356423,-241372e-9,.479108,179562e-9,.356272,-965292e-9,.478897,71811e-8,.356262,-.00217182,.478894,.00161574,.356265,-.00386092,.478895,.00287261,.356278,-.0060324,.478905,.00448907,.356293,-.00868565,.478914,.00646572,.356346,-.0118207,.478965,.00880438,.356395,-.0154355,.479001,.0115066,.356484,-.019529,.479075,.0145762,.356609,-.0240991,.47918,.018018,.356766,-.0291413,.479305,.0218379,.357009,-.0346498,.479512,.0260454,.357424,-.0405462,.479909,.0306657,.357899,-.0468825,.480337,.0357054,.358424,-.0536887,.480771,.0411728,.359041,-.0609416,.481242,.0470841,.359903,-.0685239,.481943,.0534831,.360932,-.0764883,.482741,.0603795,.362196,-.0848364,.483688,.0678028,.363847,-.0935002,.484947,.0758086,.365972,-.102471,.486588,.0844173,.368741,-.111751,.488787,.0937199,.372146,-.121334,.491405,.103732,.377114,-.131147,.495604,.114608,.38226,-.141213,.499436,.126345,.389609,-.151632,.505334,.139116,.397925,-.162073,.51168,.152995,.407824,-.172819,.518876,.168071,.420014,-.183929,.527639,.184495,.434266,-.195032,.537588,.20232,.447352,-.205792,.544379,.221189,.463726,-.216704,.553422,.241616,.481406,-.227531,.562074,.263298,.498707,-.238017,.568227,.286116,.518039,-.247936,.574473,.3101,.538277,-.257437,.579191,.335401,.561166,-.266829,.584807,.362246,.583189,-.275329,.586476,.390609,.606024,-.28234,.585578,.420998,.632419,-.287924,.584496,.454357,.656128,-.291972,.577766,.488233,.679953,-.29456,.56875,.523248,.704654,-.295816,.558388,.559168,.729016,-.295157,.544826,.595326,.752062,-.292779,.528273,.631864,.773138,-.288681,.508482,.667793,.794869,-.283358,.487341,.704035,.815101,-.27608,.46354,.739925,.834212,-.26767,.438672,.775539,.852368,-.257397,.411239,.810895,.870207,-.245689,.3829,.846472,.884063,-.231452,.351496,.881788,.898284,-.215561,.31895,.917438,.912964,-.198208,.287367,.952422,.924666,-.180426,.254487,.987551,.934429,-.161525,.222226,1.02142,.943485,-.141197,.191143,1.05218,.9521,-.120085,.161112,1.07937,.957876,-.0975881,.130982,1.10403,.966943,-.0726842,.0990553,1.12616,.978313,-.0483705,.0662818,1.14619,.990048,-.0239072,.0329243,1.16413,.999984,461885e-9,-772859e-10,1.18099,.321287,-935049e-11,.455413,659662e-11,.332595,-237513e-9,.471437,167562e-9,.332729,-949964e-9,.471618,670192e-9,.332305,-.00213618,.471028,.00150712,.332326,-.00379765,.471055,.00267959,.332344,-.00593353,.471072,.00418751,.332356,-.00854349,.471077,.00603172,.332403,-.0116268,.471121,.00821362,.332461,-.0151824,.47117,.0107357,.332552,-.0192088,.471251,.0136014,.332657,-.0237024,.47133,.0168152,.332835,-.0286615,.471487,.0203853,.333083,-.0340765,.471708,.0243212,.333547,-.0398563,.47219,.0286518,.333989,-.0460916,.472587,.0333763,.334532,-.0527897,.473054,.0385084,.335167,-.0599284,.473568,.0440638,.33608,-.0673514,.474362,.0500962,.337146,-.0752237,.475231,.0566022,.338462,-.083418,.476282,.0636272,.34014,-.0919382,.477615,.0712153,.342341,-.100741,.479404,.079417,.345088,-.109905,.481618,.0882631,.349049,-.119369,.485081,.0978851,.353939,-.129033,.489317,.108336,.359893,-.139038,.494309,.119698,.366945,-.149411,.499983,.132024,.375814,-.159843,.507185,.145558,.387112,-.170664,.516392,.160433,.40023,-.181897,.526519,.176648,.412555,-.192785,.53423,.193922,.427023,-.203663,.542741,.212662,.443685,-.214695,.552066,.232944,.461499,-.225561,.560762,.254495,.480975,-.236257,.569421,.277531,.501,-.24639,.576101,.301724,.521691,-.256101,.581493,.327112,.543478,-.265289,.585221,.353917,.566094,-.273938,.587614,.381941,.589578,-.281679,.587991,.41172,.614583,-.287655,.585928,.444148,.641813,-.292228,.582092,.478617,.666189,-.295172,.57398,.51397,.690475,-.29648,.561676,.550118,.715543,-.296203,.548758,.586933,.740405,-.293999,.532792,.62384,.762183,-.28998,.512735,.660723,.786069,-.28478,.492402,.69807,.806812,-.277568,.469058,.734422,.826987,-.268951,.443017,.770946,.844588,-.259049,.415501,.80699,.863725,-.2471,.387328,.842107,.879137,-.234157,.356108,.878078,.894634,-.218719,.324315,.914058,.909162,-.201293,.291813,.949922,.92072,-.18267,.258474,.985337,.93158,-.163212,.225593,1.0205,.941238,-.142771,.193986,1.05273,.949293,-.120956,.163392,1.08075,.956226,-.0985743,.132934,1.10559,.96546,-.075118,.101255,1.12823,.977403,-.0497921,.0675441,1.149,.989648,-.0241574,.0334681,1.16765,1.00001,5762e-7,-184807e-9,1.18519,.303474,-916603e-11,.4542,61243e-10,.308894,-232869e-9,.462306,155592e-9,.309426,-931661e-9,.463093,622499e-9,.308643,-.0020949,.461933,.00139979,.308651,-.0037242,.461941,.00248874,.308662,-.00581873,.46195,.00388933,.308687,-.00837818,.461974,.00560247,.308728,-.0114016,.462011,.00762948,.308789,-.0148884,.462067,.00997326,.308882,-.0188369,.462151,.0126375,.309007,-.0232436,.462263,.0156271,.30918,-.0281054,.462417,.0189498,.309442,-.0334065,.462667,.0226167,.309901,-.0390589,.463162,.0266614,.310331,-.0452042,.463555,.0310715,.310858,-.0517735,.464019,.0358698,.311576,-.0587359,.464669,.0410848,.312436,-.0660383,.465406,.0467453,.313526,-.0737266,.466339,.0528718,.314903,-.0817574,.467504,.0595039,.316814,-.090167,.469226,.0666888,.318965,-.0987555,.470981,.0744658,.322077,-.107792,.473814,.082912,.325947,-.117098,.477241,.0920846,.331008,-.126602,.48184,.102137,.337893,-.136619,.488334,.113135,.345106,-.146838,.494415,.12511,.355111,-.157357,.503275,.138356,.365095,-.167955,.510966,.152686,.378344,-.179157,.521508,.16856,.391599,-.190143,.530455,.18561,.407786,-.20123,.541275,.204308,.425294,-.212456,.551784,.224623,.444021,-.223568,.561493,.246172,.463418,-.234154,.569886,.268979,.484077,-.244546,.577116,.293411,.505513,-.254301,.582914,.318936,.527672,-.263564,.587208,.345856,.550565,-.272332,.589277,.374054,.573656,-.280011,.588426,.403276,.59827,-.286924,.587504,.43474,.624731,-.291994,.583401,.468767,.652396,-.295159,.576997,.504411,.67732,-.296954,.565863,.54114,.703147,-.296877,.552316,.57816,.728715,-.295147,.536773,.616124,.752448,-.291275,.51771,.653885,.775169,-.285905,.496087,.691537,.799307,-.279064,.474232,.729251,.819482,-.270294,.447676,.766267,.837659,-.260032,.419656,.802616,.856903,-.248497,.391328,.838583,.873325,-.235252,.360285,.874711,.889788,-.221126,.329215,.91077,.904486,-.204304,.296392,.94653,.917711,-.185562,.262159,.983828,.928969,-.165635,.229142,1.01955,.939707,-.14442,.19673,1.05317,.948167,-.122147,.165095,1.0823,.955222,-.099098,.13451,1.10791,.964401,-.0755332,.102476,1.1312,.976605,-.0513817,.0689667,1.15218,.989085,-.0258499,.034506,1.17129,.999908,617773e-9,-271268e-9,1.18961,.285803,-905752e-11,.452348,572272e-11,.284689,-22732e-8,.450581,143626e-9,.285263,-910214e-9,.451482,575099e-9,.285302,-.00204784,.451553,.00129395,.285318,-.00364057,.451574,.0023006,.28533,-.00568813,.451585,.00359547,.285361,-.00819001,.451618,.00517934,.285397,-.0111458,.45165,.007054,.285447,-.0145536,.451688,.00922167,.285527,-.0184127,.451758,.0116869,.285688,-.0227207,.451929,.0144555,.28584,-.0274712,.452055,.0175341,.286136,-.0326278,.452369,.0209406,.286574,-.0381792,.452853,.0246965,.287012,-.0441879,.453272,.0287996,.287542,-.0506096,.453752,.033268,.288299,-.0573634,.454488,.0381504,.289186,-.0645458,.455294,.0434447,.290302,-.0720405,.456301,.0491973,.291776,-.0799046,.457648,.0554453,.29372,-.088117,.459483,.0622311,.296052,-.0965328,.461571,.0695992,.299563,-.105409,.465085,.077658,.30335,-.114553,.468506,.0864176,.309167,-.123917,.474423,.0961078,.31529,-.13381,.47995,.106643,.324163,-.144021,.488592,.118322,.333272,-.154382,.496461,.131133,.344224,-.165015,.50562,.145208,.357733,-.176168,.516719,.16073,.373046,-.187468,.528513,.177807,.38788,-.198488,.537713,.196072,.405133,-.209545,.547999,.21605,.423845,-.220724,.55759,.237484,.443777,-.231518,.566246,.26039,.464824,-.242035,.574326,.284835,.486635,-.251898,.58037,.310518,.51012,-.261304,.58568,.337678,.535301,-.270384,.590197,.366242,.559193,-.27841,.590569,.395873,.583544,-.285325,.588161,.426857,.608834,-.291113,.584249,.459477,.635753,-.294882,.57763,.494734,.664367,-.297088,.569479,.532023,.689688,-.297364,.555064,.569629,.715732,-.295949,.539522,.608124,.741307,-.292259,.521613,.646231,.764949,-.287063,.49969,.684938,.788599,-.28012,.476747,.723548,.81048,-.27153,.45116,.761135,.831372,-.261289,.424101,.798916,.850092,-.249559,.39443,.835952,.867777,-.236348,.363849,.871606,.884632,-.221569,.332477,.907843,.90047,-.20618,.300667,.944187,.914524,-.188771,.266552,.981371,.926892,-.168362,.232349,1.01841,.937951,-.146761,.199359,1.05308,.947236,-.123813,.1675,1.0839,.954367,-.099984,.136166,1.11047,.963907,-.0759278,.103808,1.13414,.976218,-.0511367,.0697061,1.15575,.988772,-.0267415,.0352529,1.17531,.999888,-520778e-9,289926e-9,1.19389,.263546,-883274e-11,.441896,526783e-11,.262352,-221849e-9,.439889,132311e-9,.262325,-886683e-9,.439848,528824e-9,.26228,-.00199476,.439765,.00118975,.262372,-.00354671,.439922,.00211568,.26239,-.00554141,.439941,.00330652,.262412,-.00797888,.439961,.00476346,.262453,-.0108584,.440002,.00648818,.262528,-.0141788,.440085,.0084835,.262615,-.017938,.440166,.0107533,.262744,-.0221346,.440291,.0133044,.262939,-.026762,.440493,.0161445,.263277,-.0317573,.440889,.0192974,.26368,-.0371832,.441338,.0227699,.264106,-.0430371,.441753,.0265698,.264624,-.0493035,.442227,.0307178,.265378,-.0558669,.442985,.0352616,.266253,-.0628718,.443795,.0401968,.267478,-.0701569,.445008,.04559,.269062,-.077845,.446599,.0514539,.270926,-.0857941,.448349,.0578382,.273693,-.0940773,.451221,.0648363,.276746,-.102704,.454097,.0724389,.281693,-.111735,.459517,.0808744,.287335,-.121004,.46531,.0901551,.29448,-.130734,.472605,.100371,.30257,-.140777,.480251,.111644,.312465,-.15111,.489444,.124111,.324856,-.16189,.500919,.137979,.33774,-.172946,.511317,.153163,.35255,-.184152,.522684,.169817,.367786,-.19522,.53248,.187886,.385474,-.20632,.543326,.207634,.404976,-.217744,.554109,.229165,.425203,-.228691,.563395,.252068,.446704,-.239299,.571565,.276471,.468951,-.249348,.577935,.302323,.493487,-.258933,.584309,.329882,.517861,-.268009,.58773,.358525,.543309,-.276238,.589612,.388585,.569704,-.28356,.589294,.419787,.594871,-.289497,.585137,.452114,.622555,-.294452,.580356,.486466,.651167,-.296918,.57185,.523079,.677332,-.297647,.558428,.5611,.703718,-.296321,.542232,.599592,.730262,-.293339,.524541,.639138,.754304,-.288036,.502691,.677978,.778051,-.281018,.479212,.716537,.801557,-.272414,.454071,.75586,.822559,-.262419,.425952,.794477,.843051,-.250702,.397313,.832664,.86232,-.237264,.366534,.869876,.879044,-.222716,.334816,.906973,.896362,-.206827,.303143,.943558,.910342,-.189659,.269699,.979759,.924119,-.171108,.236411,1.01718,.935374,-.149579,.202224,1.05289,.944295,-.126295,.16989,1.08496,.952227,-.101511,.138089,1.11256,.962041,-.0766392,.105053,1.1375,.97528,-.0511967,.070329,1.15983,.988476,-.025463,.0351268,1.17987,.999962,286808e-10,145564e-10,1.19901,.227089,-841413e-11,.404216,472707e-11,.239725,-215083e-9,.426708,120833e-9,.239904,-860718e-9,.427028,483555e-9,.239911,-.00193661,.427039,.00108806,.239914,-.00344276,.42704,.00193457,.239933,-.00537907,.427064,.00302363,.239944,-.00774482,.427065,.00435604,.239993,-.01054,.427122,.00593398,.240052,-.0137626,.427179,.00775987,.240148,-.0174115,.427279,.00983854,.240278,-.021484,.42741,.0121763,.240472,-.0259729,.427618,.0147827,.240839,-.0308131,.428086,.0176837,.241201,-.0360893,.428482,.0208775,.241626,-.0417723,.428907,.0243821,.242207,-.0478337,.42952,.0282228,.24298,-.0542199,.430332,.0324333,.243881,-.0610015,.431222,.0370252,.245123,-.0680874,.432512,.0420535,.24667,-.0755482,.434088,.0475414,.248779,-.0832873,.436323,.0535542,.251665,-.0913546,.439509,.0601716,.255305,-.0998489,.443478,.0674282,.260049,-.108576,.448713,.0754673,.266192,-.117754,.455524,.084339,.273158,-.127294,.4627,.0941683,.282131,-.137311,.472068,.10515,.293332,-.147736,.483565,.117402,.304667,-.158357,.493702,.130824,.317785,-.169274,.504708,.145724,.333245,-.180595,.517107,.16215,.349843,-.191892,.528849,.180149,.367944,-.203168,.540301,.199746,.387579,-.214443,.551514,.221047,.408247,-.225624,.560906,.243981,.43014,-.236422,.56959,.268513,.452669,-.24654,.576098,.294409,.476196,-.256157,.580925,.322002,.501157,-.265289,.584839,.351052,.527632,-.273671,.587614,.3812,.555754,-.281254,.589119,.412994,.581682,-.287448,.585204,.445498,.608196,-.292614,.579006,.479505,.635661,-.296068,.571297,.514643,.664999,-.297395,.560855,.552213,.691039,-.296645,.544525,.591365,.7179,-.293785,.526535,.630883,.744059,-.289089,.50545,.670932,.76863,-.282239,.482514,.710904,.793273,-.273688,.457246,.750259,.814731,-.26328,.428872,.78948,.835603,-.251526,.399384,.828597,.85489,-.238339,.368811,.866892,.872828,-.223607,.336617,.90563,.889462,-.207538,.303997,.943538,.904929,-.190297,.270812,.980591,.919101,-.172034,.237453,1.01935,.930536,-.152058,.204431,1.05498,.941223,-.129515,.172495,1.08717,.94982,-.104263,.140175,1.11551,.960592,-.0781944,.106465,1.14098,.974629,-.051688,.0711592,1.16418,.98811,-.0253929,.0354432,1.18465,1.00004,804378e-9,-330876e-9,1.20462,.214668,-821282e-11,.406619,433582e-11,.218053,-208144e-9,.413025,109887e-9,.217987,-832212e-9,.412901,439362e-9,.217971,-.00187246,.412876,988623e-9,.217968,-.00332855,.41286,.00175772,.217985,-.00520055,.412882,.00274729,.218014,-.00748814,.412916,.00395842,.218054,-.0101901,.412957,.00539274,.218106,-.0133057,.413005,.00705348,.218217,-.0168342,.413139,.00894581,.218338,-.0207707,.413258,.0110754,.21855,-.0251001,.413509,.0134551,.218913,-.0297861,.413992,.0161081,.219265,-.0348956,.414383,.0190307,.219696,-.0403909,.414839,.0222458,.220329,-.0462003,.415567,.025792,.220989,-.0524208,.41621,.0296637,.222027,-.058948,.417385,.0339323,.223301,-.0658208,.418779,.0386055,.224988,-.0730347,.420665,.0437355,.227211,-.0805274,.423198,.0493844,.230131,-.088395,.426566,.0556135,.233908,-.0966208,.43091,.0624829,.239092,-.105223,.437148,.0701636,.245315,-.11424,.444302,.0786949,.253166,-.12368,.453262,.0882382,.262374,-.133569,.463211,.0988682,.273145,-.143836,.474271,.110727,.285512,-.154577,.4863,.123945,.299512,-.165501,.498817,.138581,.314287,-.176698,.510341,.154676,.331083,-.188066,.522583,.172459,.349615,-.199597,.534879,.191979,.369318,-.210843,.546083,.21309,.390377,-.222068,.5562,.235998,.412411,-.233059,.564704,.260518,.435715,-.24357,.572314,.286795,.461196,-.253356,.579395,.314559,.485587,-.262362,.581985,.343581,.511908,-.270895,.584347,.374367,.539798,-.278452,.58505,.406015,.567974,-.284877,.583344,.439168,.594303,-.290124,.577348,.473005,.622951,-.294183,.570751,.508534,.652404,-.296389,.561541,.544764,.679291,-.296605,.546426,.582927,.706437,-.294095,.528599,.622681,.734485,-.28978,.508676,.663567,.758841,-.283363,.484768,.704092,.78537,-.275015,.460434,.745101,.807315,-.264689,.432166,.784712,.8271,-.252597,.401807,.824241,.849191,-.239154,.371458,.863803,.867046,-.224451,.338873,.903063,.8852,-.208342,.306175,.942763,.901771,-.190684,.272759,.981559,.915958,-.172105,.239306,1.02048,.928046,-.152214,.206071,1.05765,.939961,-.130247,.17367,1.08999,.948711,-.10672,.142201,1.11829,.959305,-.0808688,.108454,1.14467,.973009,-.0539145,.0728109,1.16839,.987631,-.0262947,.0360625,1.19004,.999978,.00132758,-559424e-9,1.21058,.193925,-793421e-11,.391974,392537e-11,.196746,-200315e-9,.397675,991033e-10,.19667,-801099e-9,.397521,396342e-9,.196633,-.00180246,.397445,891829e-9,.196654,-.00320443,.397482,.00158582,.196659,-.00500647,.39748,.00247867,.196683,-.0072086,.397506,.00357167,.196728,-.00981001,.397562,.00486675,.196792,-.0128096,.397633,.00636707,.19689,-.0162055,.397746,.00807752,.197017,-.0199943,.397884,.0100052,.19729,-.024139,.39827,.0121691,.197583,-.0286671,.398639,.0145755,.197927,-.0335858,.399034,.0172355,.198383,-.0388806,.399554,.0201718,.199002,-.0444736,.400289,.0234194,.199739,-.0504583,.401111,.026984,.200784,-.056729,.402349,.0309217,.202075,-.0633643,.403841,.0352496,.203898,-.0703247,.406076,.0400313,.206199,-.0775565,.408841,.0453282,.209252,-.085184,.41259,.0511794,.213638,-.0931994,.418288,.0577459,.21881,-.101617,.424681,.0650508,.225642,-.11052,.433429,.0732759,.233717,-.119772,.442897,.0824683,.242823,-.129505,.452888,.0927484,.254772,-.139906,.466407,.104417,.266603,-.150402,.477413,.117211,.28073,-.161395,.490519,.131598,.295399,-.172465,.50201,.147407,.312705,-.183982,.515311,.165031,.331335,-.195532,.52786,.184336,.351037,-.206971,.5392,.205361,.372175,-.218117,.54941,.228043,.394548,-.229327,.558642,.25267,.419598,-.240052,.567861,.279071,.443922,-.249937,.573332,.306882,.471495,-.259407,.58013,.33661,.496769,-.267749,.580564,.367328,.524951,-.275524,.581696,.399753,.55318,-.282148,.579885,.433134,.581577,-.287533,.575471,.467534,.609231,-.291612,.567445,.502943,.637478,-.293911,.557657,.53871,.667795,-.295096,.546535,.576568,.694272,-.294073,.529561,.614929,.722937,-.290386,.510561,.655909,.749682,-.284481,.487846,.697663,.774754,-.276188,.462487,.738515,.799301,-.266215,.43481,.779802,.820762,-.254116,.404879,.820045,.843231,-.240393,.374559,.860294,.861857,-.225503,.341582,.900965,.880815,-.209382,.308778,.941727,.89766,-.19155,.275232,.980916,.912926,-.172346,.240938,1.02162,.926391,-.151799,.207223,1.0597,.938429,-.129968,.17484,1.09291,.947834,-.10651,.142984,1.12248,.958432,-.0824098,.109902,1.149,.972402,-.0565242,.0744454,1.1733,.987191,-.028427,.0373794,1.19538,.999975,385685e-10,-4203e-8,1.21676,.178114,-766075e-11,.385418,354027e-11,.176074,-191966e-9,.381002,887135e-10,.17601,-767549e-9,.380861,354715e-9,.17598,-.00172696,.380798,798168e-9,.175994,-.00307012,.380824,.00141928,.176017,-.00479684,.380858,.00221859,.176019,-.00690648,.380839,.00319714,.176072,-.00939888,.380913,.0043572,.176131,-.0122726,.380979,.005702,.176239,-.0155264,.38112,.00723689,.176371,-.0191551,.381272,.00896907,.176638,-.023117,.381669,.0109194,.176912,-.0274633,.382015,.0130903,.177279,-.032173,.382476,.0154949,.17774,-.0372219,.383041,.0181669,.178344,-.0426132,.38378,.0211209,.179153,-.0483309,.384773,.0243899,.180197,-.0543447,.386076,.0280062,.181581,-.0607122,.387809,.032004,.18344,-.0673855,.390205,.036453,.186139,-.0743989,.393944,.0414162,.189432,-.0817731,.39832,.0469394,.193795,-.0895464,.404188,.0531442,.199641,-.0978264,.4121,.0601374,.206679,-.106499,.421425,.0680078,.214865,-.115654,.431504,.076919,.224406,-.125268,.442526,.0868835,.235876,-.135475,.455465,.0981875,.248335,-.146023,.4681,.110759,.262868,-.157016,.482069,.124885,.278962,-.168245,.496182,.140645,.295082,-.17958,.507401,.157838,.313738,-.191227,.520252,.17695,.333573,-.202718,.531708,.197817,.356433,-.214424,.544509,.220785,.378853,-.225492,.55373,.245306,.402717,-.236236,.561348,.271593,.428375,-.246568,.568538,.299776,.454724,-.255941,.573462,.329433,.482291,-.264511,.576356,.360598,.509706,-.272129,.576446,.393204,.538805,-.278979,.575298,.427227,.568919,-.284528,.572154,.462157,.596804,-.288801,.564691,.497997,.625987,-.291334,.555134,.534467,.656414,-.292722,.545051,.571736,.683916,-.292185,.528813,.610158,.711809,-.290043,.51106,.649061,.739547,-.285246,.490103,.690081,.766914,-.277647,.465523,.732554,.791375,-.267603,.437718,.773982,.814772,-.256109,.40882,.81609,.836691,-.242281,.377823,.856849,.856984,-.227155,.34496,.898363,.876332,-.210395,.311335,.939471,.894988,-.192612,.277703,.980799,.911113,-.173236,.243019,1.02215,.924092,-.152258,.209037,1.06139,.936828,-.129575,.175909,1.09635,.946869,-.10594,.143852,1.12707,.958284,-.081318,.110289,1.15419,.972325,-.0556133,.0747232,1.17909,.986878,-.0297899,.0383149,1.20163,.999936,-.00197169,912402e-9,1.22338,.151174,-720365e-11,.351531,309789e-11,.155594,-18279e-8,.361806,78608e-9,.156099,-731569e-9,.362982,314615e-9,.156053,-.00164578,.362869,707845e-9,.156093,-.0029261,.362961,.00125884,.156099,-.00457155,.362959,.00196783,.15612,-.00658224,.362982,.00283622,.156168,-.00895774,.363048,.00386625,.156221,-.0116962,.363101,.00506109,.156324,-.0147973,.363241,.00642675,.156476,-.0182503,.363448,.00797175,.156731,-.0220266,.36384,.00971484,.156994,-.026176,.364179,.0116575,.157341,-.0306701,.36462,.0138207,.157867,-.0354591,.365364,.0162356,.15846,-.0406141,.366111,.0189092,.159308,-.0460519,.367248,.021885,.160426,-.0518096,.368767,.0252004,.161877,-.0578906,.370745,.0288825,.163995,-.0642812,.373831,.0330139,.16655,-.0710067,.377366,.0376283,.170237,-.0781522,.382799,.0428493,.175096,-.0857172,.389915,.0487324,.181069,-.0938025,.398487,.0554214,.188487,-.102363,.408799,.0630189,.197029,-.111343,.419991,.071634,.206684,-.120812,.431455,.0812797,.218698,-.131033,.445746,.0923651,.230726,-.141373,.457471,.104545,.245516,-.152387,.472388,.118449,.261551,-.163628,.486671,.133923,.277437,-.174814,.49762,.150849,.296662,-.186713,.51162,.169924,.31795,-.198513,.525435,.190848,.339422,-.210119,.536267,.213504,.362143,-.221354,.545982,.237947,.387198,-.23224,.555364,.264427,.412349,-.24257,.561489,.292519,.439274,-.252284,.566903,.322561,.466779,-.261023,.569614,.353952,.496011,-.26899,.571589,.387278,.524964,-.275498,.570325,.421356,.556518,-.281449,.568792,.457314,.584363,-.285526,.560268,.493199,.614214,-.28844,.55205,.530276,.645684,-.289777,.541906,.56855,.673446,-.289722,.526464,.606927,.701924,-.287792,.509872,.645945,.73037,-.284315,.490649,.685564,.757405,-.278804,.467964,.726511,.784025,-.269543,.441468,.768601,.808255,-.258117,.41216,.811321,.830739,-.244728,.380606,.853496,.851914,-.229428,.348111,.895374,.872586,-.212508,.314732,.937674,.891581,-.194025,.280338,.979869,.907641,-.174711,.245203,1.02253,.922233,-.153509,.21077,1.06371,.935878,-.130418,.177399,1.09972,.946338,-.105558,.144507,1.13124,.957265,-.080059,.110508,1.15973,.971668,-.0539766,.0742311,1.18515,.9866,-.0277101,.0375224,1.20858,1.00021,-515531e-9,135226e-9,1.23135,.137468,-686011e-11,.345041,273315e-11,.13703,-173378e-9,.343936,690761e-10,.136986,-693048e-9,.34383,276126e-9,.136964,-.00155931,.343761,621337e-9,.137003,-.00277211,.343863,.00110494,.137012,-.00433103,.343868,.00172744,.137043,-.00623606,.343916,.00249022,.13709,-.0084868,.343986,.00339559,.137145,-.0110814,.344045,.00444687,.137242,-.0140187,.344177,.00565007,.137431,-.0172713,.344491,.00701868,.137644,-.0208605,.344805,.00856042,.13791,-.024792,.345172,.0102863,.138295,-.0290461,.345734,.0122185,.138764,-.0335957,.346371,.0143771,.139415,-.038467,.347298,.0167894,.140272,-.0436176,.348527,.0194895,.141457,-.0491016,.350276,.0225043,.14303,-.0548764,.352646,.0258962,.145289,-.0610096,.356206,.0297168,.148502,-.0674777,.361488,.0340562,.152188,-.074345,.367103,.0389534,.157359,-.0817442,.375247,.0445541,.16379,-.0896334,.385064,.0509535,.171376,-.098005,.396082,.0582611,.179901,-.106817,.407418,.06654,.189892,-.116239,.420031,.075994,.201838,-.12627,.434321,.0867239,.214311,-.136701,.447631,.0987517,.228902,-.147616,.462046,.112353,.245107,-.158871,.476942,.127605,.262292,-.170261,.490285,.144469,.281215,-.182017,.503783,.163282,.301058,-.193729,.515505,.183873,.322752,-.205512,.52682,.206466,.347547,-.217214,.539473,.231194,.370969,-.227966,.546625,.257288,.397533,-.238555,.55472,.285789,.42398,-.248278,.559468,.315746,.452928,-.257422,.564095,.347724,.482121,-.265306,.565426,.380922,.510438,-.272043,.563205,.415639,.541188,-.277614,.561087,.451702,.571667,-.281927,.554922,.48845,.602432,-.285015,.546838,.526442,.634126,-.286512,.537415,.564896,.662816,-.286388,.522906,.604037,.692411,-.284734,.507003,.643795,.720946,-.281297,.488398,.68298,.748293,-.276262,.466353,.723466,.776931,-.269978,.443573,.764565,.801065,-.260305,.415279,.805838,.825843,-.247426,.384773,.849985,.84807,-.232437,.352555,.893174,.869122,-.215806,.318642,.936564,.888963,-.197307,.28381,.980253,.905547,-.177203,.247888,1.02463,.918554,-.155542,.212904,1.06714,.931395,-.131948,.1787,1.10451,.941749,-.106723,.145902,1.13694,.954551,-.0804939,.111193,1.1666,.970279,-.0534239,.0744697,1.19249,.986117,-.0257452,.0368788,1.21665,.999938,.00190634,-.0010291,1.23981,.118493,-647439e-11,.32272,23772e-10,.118765,-163023e-9,.323456,598573e-10,.118772,-65212e-8,.323477,239447e-9,.118843,-.00146741,.323657,538881e-9,.118804,-.00260846,.323553,95826e-8,.118826,-.00407576,.323595,.00149845,.118846,-.00586826,.323617,.00216047,.118886,-.00798578,.32367,.00294679,.118947,-.0104273,.323753,.00386124,.119055,-.0131909,.323922,.00490999,.119241,-.0162444,.324251,.00610804,.11944,-.0196339,.324544,.00745805,.119739,-.0233378,.325026,.00897805,.12011,-.0273179,.325586,.0106895,.120571,-.0316143,.326231,.0126073,.12124,-.0361939,.327264,.0147654,.122162,-.0410511,.328733,.0172001,.123378,-.0462233,.330659,.0199375,.125183,-.0517109,.333754,.0230498,.127832,-.0575652,.338507,.026597,.130909,-.0637441,.343666,.0306345,.135221,-.0704302,.351063,.035273,.14082,-.0776364,.360604,.0406137,.146781,-.0852293,.369638,.0466788,.155121,-.0935351,.3827,.0537628,.16398,-.102234,.39522,.0617985,.173926,-.111465,.40793,.07097,.185137,-.121296,.42105,.0813426,.19826,-.13169,.435735,.0931596,.212938,-.142614,.450932,.106547,.229046,-.153884,.465726,.121575,.246246,-.165382,.479461,.138286,.264637,-.176806,.492106,.15666,.284959,-.188793,.504774,.17728,.308157,-.200763,.518805,.19988,.330951,-.21239,.528231,.224293,.3549,-.223521,.536376,.250541,.381502,-.234169,.544846,.278902,.409529,-.244077,.551717,.309227,.437523,-.253363,.55517,.341426,.467624,-.261659,.557772,.37518,.497268,-.268498,.556442,.41007,.528294,-.274018,.553915,.446445,.559053,-.278169,.549153,.483779,.589329,-.281229,.539878,.522249,.622503,-.282902,.53162,.561754,.652382,-.282815,.518119,.601544,.681847,-.281247,.502187,.641574,.712285,-.277986,.484824,.682633,.740094,-.273017,.463483,.723426,.768478,-.266692,.441299,.763747,.794556,-.258358,.415238,.805565,.819408,-.248807,.386912,.847254,.843411,-.236214,.356165,.891091,.862397,-.219794,.320562,.936174,.883113,-.201768,.285322,.982562,.90023,-.181672,.249713,1.02862,.915192,-.159279,.214546,1.07163,.928458,-.134725,.180285,1.10995,.94069,-.10913,.147119,1.14354,.953409,-.0821315,.112492,1.17372,.969537,-.0542677,.0752014,1.20043,.985612,-.0259096,.0370361,1.22528,.999835,.00298198,-.00151801,1.24959,.10097,-602574e-11,.300277,202619e-11,.101577,-152164e-9,.302077,511662e-10,.101572,-608889e-9,.302066,204751e-9,.101566,-.00136997,.302047,460753e-9,.101592,-.00243557,.302114,819497e-9,.101608,-.0038053,.30214,.00128154,.101627,-.00547906,.30216,.0018483,.101669,-.00745647,.302224,.00252223,.101732,-.00973615,.302318,.00330716,.101844,-.0123097,.302513,.00421061,.102025,-.0151681,.30285,.00524481,.102224,-.0183334,.303166,.0064154,.102515,-.0217819,.303654,.00774063,.102886,-.0255067,.304243,.0092398,.103395,-.029514,.305089,.0109339,.104109,-.0337912,.306301,.0128561,.105074,-.0383565,.30798,.0150338,.10654,-.0432132,.310726,.0175228,.108478,-.0484244,.314351,.0203648,.111015,-.0539339,.319032,.0236325,.114682,-.0598885,.32605,.0274188,.11911,-.0663375,.334109,.0317905,.124736,-.0733011,.344013,.0368502,.131479,-.0807744,.355358,.0427104,.139283,-.0888204,.367614,.0494788,.148054,-.0973394,.380072,.0572367,.159037,-.10665,.395678,.0662704,.169794,-.116221,.40795,.0763192,.18314,-.126632,.423546,.087956,.197515,-.137383,.438213,.101042,.213514,-.148641,.453248,.115827,.23065,-.160117,.46688,.132283,.249148,-.171807,.479962,.150644,.270219,-.183695,.494618,.171073,.292338,-.195574,.506937,.193378,.314999,-.207205,.516463,.217585,.340991,-.218955,.528123,.24428,.367982,-.229917,.537025,.272784,.39432,-.239737,.541627,.302742,.423364,-.249048,.546466,.335112,.453751,-.257329,.549466,.369032,.48416,-.264623,.549503,.404577,.515262,-.270411,.547008,.441337,.547036,-.274581,.542249,.479162,.576614,-.277266,.533015,.517904,.611143,-.279144,.525512,.558508,.640989,-.279001,.51154,.598995,.671182,-.277324,.495641,.639935,.700848,-.273908,.477526,.681017,.729862,-.269063,.457955,.722764,.758273,-.262282,.434846,.764349,.784121,-.254281,.409203,.806206,.809798,-.24505,.382694,.848617,.834953,-.233861,.354034,.892445,.856817,-.221308,.321764,.936263,.877609,-.205996,.288118,.982401,.897489,-.186702,.253277,1.02975,.913792,-.164618,.217963,1.07488,.92785,-.140023,.183221,1.11487,.940378,-.11328,.149385,1.14947,.95273,-.0853958,.114152,1.1807,.969059,-.0568698,.0769845,1.20912,.985574,-.0276502,.0381186,1.23498,.999943,.00239052,-.00126861,1.25987,.0852715,-560067e-11,.279021,171162e-11,.0854143,-140871e-9,.279483,430516e-10,.0854191,-563385e-9,.2795,172184e-9,.0854188,-.00126753,.279493,387464e-9,.0854229,-.00225337,.279501,68918e-8,.0854443,-.00352086,.279549,.00107803,.0854697,-.00506962,.279591,.00155536,.0855093,-.00689873,.279652,.00212354,.0855724,-.00900821,.279752,.00278703,.0856991,-.0113799,.280011,.0035551,.085855,-.0140314,.280297,.00443449,.0860682,-.016963,.280682,.00543636,.086344,-.0201438,.281159,.0065788,.0867426,-.0235999,.281886,.00787977,.087239,-.0273069,.282745,.0093606,.0879815,-.031269,.284139,.011056,.0891258,-.035531,.28647,.0130065,.0906909,-.0400947,.289708,.0152495,.0927624,-.0449638,.293904,.0178454,.0958376,-.0502427,.300471,.0208915,.0995827,-.0559514,.30806,.0244247,.104526,-.0622152,.317874,.0285721,.110532,-.0690046,.329332,.0334227,.117385,-.0763068,.341217,.0390466,.12522,-.084184,.353968,.0455786,.134037,-.0925248,.366797,.0530773,.144014,-.101487,.380209,.0617424,.156013,-.111273,.395956,.071777,.168872,-.121431,.41053,.0830905,.183089,-.132105,.425073,.0959341,.198763,-.143286,.439833,.110448,.216159,-.154841,.454507,.126769,.234859,-.166588,.468368,.14495,.255879,-.178626,.482846,.165233,.27677,-.190218,.493489,.187217,.301184,-.202227,.506549,.211659,.325852,-.213764,.5158,.237922,.352824,-.22487,.525442,.26632,.380882,-.235246,.532487,.296691,.410137,-.244847,.537703,.329179,.439787,-.253122,.540361,.363135,.472291,-.260517,.542734,.399222,.501856,-.266519,.538826,.436352,.534816,-.270905,.535152,.474505,.565069,-.273826,.525979,.513988,.597154,-.275333,.516394,.554852,.630473,-.275314,.506206,.596592,.660574,-.273323,.489769,.638117,.692015,-.270008,.472578,.680457,.720647,-.265001,.452134,.723008,.750528,-.258311,.430344,.765954,.777568,-.250046,.405624,.809012,.80387,-.240114,.378339,.852425,.828439,-.228737,.349877,.895346,.851472,-.216632,.318968,.940695,.873906,-.202782,.287489,.987235,.89467,-.187059,.254394,1.03348,.912281,-.168818,.221294,1.07812,.927358,-.146494,.18675,1.11928,.940385,-.120009,.152322,1.15609,.952672,-.0917183,.117514,1.18875,.968496,-.0620321,.0797405,1.21821,.985236,-.0314945,.0402383,1.24523,.99998,-575153e-9,110644e-9,1.27133,.0702429,-512222e-11,.255273,140947e-11,.0702981,-128826e-9,.255469,354488e-10,.0703691,-515562e-9,.255727,141874e-9,.0703805,-.00116,.255754,31929e-8,.0703961,-.00206224,.255813,567999e-9,.0704102,-.00322223,.255839,88871e-8,.0704298,-.00463928,.255863,.00128272,.0704759,-.00631375,.255953,.00175283,.0705434,-.00824317,.256079,.00230342,.0706693,-.010412,.25636,.0029443,.0708189,-.0128439,.256647,.00368031,.0710364,-.0155177,.257084,.00452614,.0713223,-.0184374,.257637,.00549706,.0717182,-.0216002,.258416,.00661246,.072321,-.0249966,.259699,.00790147,.0731446,-.0286566,.261475,.0093884,.0743352,-.0325888,.264132,.0111186,.0760676,-.036843,.26815,.013145,.078454,-.0414292,.273636,.0155251,.0818618,-.0464634,.281653,.0183525,.0857382,-.0519478,.289992,.0216642,.0908131,-.0579836,.30066,.0255956,.0967512,-.0645124,.312204,.0301954,.103717,-.0716505,.325001,.0356017,.111596,-.0793232,.338129,.041896,.120933,-.087645,.352853,.0492447,.130787,-.096492,.366192,.0576749,.142311,-.105973,.380864,.0673969,.155344,-.116182,.396575,.0785899,.169535,-.126815,.411443,.0912377,.185173,-.138015,.426256,.105607,.201755,-.149325,.439607,.121551,.221334,-.161207,.455467,.139608,.241461,-.173162,.469096,.159591,.26294,-.18504,.481014,.18156,.286776,-.196881,.493291,.205781,.311596,-.208311,.503556,.231819,.338667,-.219671,.513268,.260274,.366021,-.230451,.519414,.290862,.395875,-.240131,.526766,.323196,.425564,-.248566,.52905,.357071,.457094,-.256195,.530796,.393262,.488286,-.262331,.528703,.430797,.522291,-.267141,.52727,.470231,.554172,-.270411,.519848,.510477,.586427,-.271986,.510307,.551594,.619638,-.27192,.499158,.593849,.650656,-.269817,.483852,.636314,.68284,-.266267,.467515,.679679,.714356,-.26113,.44931,.723884,.742717,-.254067,.425789,.767245,.770894,-.245652,.401144,.811819,.797358,-.235554,.374224,.856315,.823377,-.223896,.346167,.901077,.847456,-.210865,.316056,.946502,.870697,-.196574,.284503,.993711,.891068,-.180814,.251628,1.04134,.909267,-.163314,.219065,1.08609,.925653,-.143304,.186446,1.12702,.940017,-.121322,.153416,1.16371,.952398,-.0973872,.120334,1.19712,.967568,-.0698785,.08352,1.22791,.984772,-.0390031,.0439209,1.25672,1.00026,-.0070087,.00315668,1.28428,.0556653,-459654e-11,.227325,112556e-11,.0565238,-116382e-9,.230826,284985e-10,.0565717,-465666e-9,.231026,114036e-9,.0565859,-.00104773,.231079,256656e-9,.0565761,-.00186255,.231025,45663e-8,.0565913,-.00291002,.231058,714664e-9,.0566108,-.00418998,.231085,.00103224,.0566532,-.00570206,.231169,.00141202,.0567473,-.00743666,.231417,.00186018,.0568567,-.00940298,.231661,.00238264,.0569859,-.0115991,.231895,.00298699,.0572221,-.0140096,.232456,.00368957,.057519,-.0166508,.233096,.00450303,.0579534,-.01951,.234094,.00544945,.0585922,-.0225991,.235629,.00655564,.0595647,-.0259416,.238106,.00785724,.0609109,-.0295661,.241557,.00939127,.0628751,-.0335126,.246652,.0112198,.0656908,-.0378604,.254091,.0134168,.0691347,-.0426543,.262666,.0160374,.0732165,-.0478967,.272029,.0191514,.0782863,-.0536716,.283007,.0228597,.0843973,-.0600683,.295732,.0272829,.0913598,-.0670095,.308779,.032484,.0994407,-.0745516,.322886,.0385886,.108189,-.082712,.336408,.0457133,.118574,-.0914927,.351692,.0539832,.129989,-.100854,.366502,.0635162,.142722,-.110837,.381675,.0744386,.156654,-.121353,.3963,.0868483,.172151,-.132414,.411477,.100963,.188712,-.143809,.42508,.116795,.208093,-.155765,.441328,.134715,.227936,-.167608,.454328,.154396,.249495,-.179579,.467235,.176179,.27362,-.191488,.480248,.200193,.296371,-.202618,.487886,.225775,.324234,-.214133,.499632,.25441,.353049,-.225212,.509532,.285077,.381785,-.234875,.514265,.317047,.414038,-.244205,.521282,.351874,.445251,-.252145,.522931,.388279,.476819,-.258433,.520947,.425825,.509209,-.263411,.517669,.465104,.542759,-.266732,.512841,.505741,.574822,-.268263,.503317,.547611,.609324,-.268489,.493035,.590953,.641772,-.266941,.478816,.63488,.674049,-.263297,.462863,.679072,.705071,-.257618,.442931,.723487,.734709,-.250625,.421299,.768708,.763704,-.24179,.397085,.814375,.791818,-.231115,.370577,.859907,.817439,-.21922,.34232,.906715,.843202,-.205658,.312627,.953943,.866639,-.190563,.280933,1.00185,.888129,-.173978,.248393,1.05105,.907239,-.155485,.216007,1.09704,.923893,-.134782,.183233,1.13857,.938882,-.11249,.150376,1.17539,.952464,-.0890706,.117177,1.20924,.968529,-.0646523,.0813095,1.24055,.984763,-.038606,.0439378,1.27018,1.00053,-.01238,.00598668,1.29873,.0437928,-409594e-11,.204012,879224e-12,.0440166,-103395e-9,.205049,221946e-10,.0440529,-413633e-9,.205225,887981e-10,.0440493,-930594e-9,.2052,199858e-9,.0439884,-.00165352,.204901,355495e-9,.0440716,-.0025849,.205255,556983e-9,.0440968,-.00372222,.205311,805326e-9,.0441359,-.00506478,.205391,.00110333,.0442231,-.00660384,.205638,.00145768,.0443254,-.00835246,.205877,.00187275,.0444832,-.0102992,.20627,.00235938,.0447001,-.0124449,.206796,.0029299,.0450168,-.0147935,.207593,.0036005,.0454816,-.017336,.208819,.00439246,.0462446,-.0201156,.211036,.00533864,.0473694,-.0231568,.214388,.00646984,.0490191,-.0264941,.219357,.00783856,.0512776,-.030184,.226061,.00950182,.0541279,-.0342661,.234094,.0115156,.0578989,-.0388539,.244297,.0139687,.0620835,-.0438735,.254457,.0169015,.0673497,-.04951,.266706,.0204554,.0731759,-.0556263,.278753,.0246606,.0803937,-.0624585,.29309,.0297126,.0879287,-.0697556,.305856,.0355868,.0970669,-.0778795,.321059,.0425768,.106508,-.0863541,.333873,.05056,.11776,-.0955935,.349008,.0598972,.130081,-.105438,.363776,.0706314,.144454,-.115899,.380112,.0828822,.1596,-.126827,.394843,.0967611,.176097,-.138161,.409033,.112381,.194726,-.149904,.424257,.129952,.213944,-.161675,.436945,.149333,.235516,-.173659,.450176,.170892,.260564,-.185963,.466305,.194984,.285183,-.197582,.477328,.220805,.311095,-.208697,.486566,.248694,.338924,-.219519,.494811,.279015,.369757,-.229766,.504065,.311725,.3996,-.238879,.507909,.345844,.430484,-.246802,.509805,.381749,.46413,-.253924,.511436,.420251,.497077,-.259319,.508787,.459957,.530434,-.263297,.50394,.501356,.565725,-.265619,.49804,.544252,.599254,-.265842,.487346,.587856,.631251,-.263978,.472975,.631969,.663972,-.26043,.457135,.677471,.697724,-.255358,.439844,.723744,.727725,-.248308,.417872,.770653,.756417,-.239181,.39273,.817357,.785419,-.22814,.367839,.864221,.81266,-.215681,.339449,.912701,.839391,-.201623,.309279,.962419,.86366,-.185624,.278029,1.0122,.885028,-.16797,.245294,1.06186,.904639,-.148336,.212689,1.10934,.922048,-.12637,.179616,1.15063,.936952,-.102928,.146749,1.18885,.951895,-.0785268,.112733,1.22352,.967198,-.0530153,.0760056,1.25681,.984405,-.02649,.0383183,1.28762,1.00021,70019e-8,-20039e-8,1.31656,.0325964,-355447e-11,.176706,655682e-12,.0329333,-899174e-10,.178527,165869e-10,.0329181,-359637e-9,.178453,663498e-10,.0329085,-808991e-9,.178383,149332e-9,.0329181,-.00143826,.178394,265873e-9,.0329425,-.00224678,.178517,416597e-9,.0329511,-.00323575,.17849,603299e-9,.033011,-.00439875,.178695,829422e-9,.0330733,-.00574059,.178843,.00109908,.0331857,-.00725896,.179176,.00141933,.0333445,-.00895289,.179618,.0017999,.0335674,-.0108219,.180238,.00225316,.033939,-.0128687,.181417,.00279765,.0345239,-.015114,.183395,.0034564,.0354458,-.017596,.186616,.00425864,.0368313,-.0203524,.191547,.00524936,.0386115,-.0234105,.197508,.00647033,.0410303,-.0268509,.205395,.00798121,.0442245,-.0307481,.215365,.0098557,.0478659,-.0350863,.225595,.0121417,.0522416,-.0399506,.236946,.0149385,.0574513,-.045357,.249442,.0183189,.0631208,-.0512863,.261222,.0223644,.0701124,-.0579273,.275418,.0272418,.0777331,-.0650652,.288989,.0329458,.0862709,-.0728813,.302546,.0396819,.096103,-.081363,.317164,.04757,.106976,-.0904463,.331733,.0567012,.119175,-.100105,.34661,.067202,.132919,-.110375,.362249,.0792588,.147727,-.121115,.376978,.0928672,.163618,-.132299,.390681,.108228,.182234,-.143887,.406571,.125502,.201809,-.155827,.42042,.144836,.225041,-.168357,.438411,.166706,.247621,-.18004,.450368,.189909,.27097,-.191536,.460083,.215251,.296658,-.203024,.469765,.243164,.325892,-.214056,.481837,.273388,.35406,-.224104,.487474,.305344,.384372,-.233489,.492773,.339741,.41749,-.241874,.498451,.376287,.45013,-.248834,.499632,.414195,.481285,-.254658,.495233,.454077,.519183,-.259367,.496401,.496352,.551544,-.261818,.487686,.538798,.587349,-.262964,.479453,.583626,.621679,-.262128,.467709,.629451,.654991,-.258998,.452123,.67566,.686873,-.254119,.433495,.723248,.719801,-.246946,.413657,.771156,.750355,-.237709,.390366,.81989,.780033,-.226549,.364947,.868601,.809254,-.214186,.337256,.920034,.836576,-.199639,.307395,.971706,.861774,-.183169,.275431,1.02479,.885707,-.165111,.243431,1.07837,.904742,-.144363,.210921,1.12783,.915604,-.121305,.17647,1.17254,.930959,-.0962119,.143106,1.21012,.948404,-.069969,.108112,1.24474,.967012,-.0427586,.0708478,1.27718,.984183,-.0147043,.032335,1.3083,.999577,.0142165,-.00726867,1.3382,.0229227,-299799e-11,.148623,462391e-12,.0232194,-758796e-10,.15054,117033e-10,.0232315,-303636e-9,.15063,468397e-10,.0232354,-683189e-9,.150624,105472e-9,.0232092,-.0012136,.150445,187744e-9,.0232523,-.00189765,.150679,294847e-9,.0232828,-.00273247,.150789,428013e-9,.0233371,-.00371287,.150995,591134e-9,.0234015,-.00484794,.15118,787642e-9,.023514,-.00612877,.151562,.00102547,.023679,-.00756125,.152116,.00131351,.0239559,-.00914651,.153162,.00166594,.0244334,-.010904,.155133,.00210182,.025139,-.0128615,.158035,.00264406,.0262598,-.0150628,.162751,.00332923,.0277875,-.0175532,.168944,.00419773,.0298472,-.0203981,.176835,.00530034,.0325444,-.023655,.186686,.00669777,.0355581,-.0272982,.196248,.00842661,.0392841,-.0314457,.207352,.0105854,.0436815,-.0361157,.219279,.0132458,.0485272,-.0412932,.230728,.0164736,.0541574,-.0470337,.242994,.0203715,.0609479,-.0535002,.257042,.0250953,.0685228,-.0605409,.27102,.0306856,.0768042,-.0680553,.28406,.037193,.0864844,-.0765011,.299186,.0449795,.0969415,-.0852674,.3132,.0538316,.108478,-.0947333,.327138,.0641149,.121705,-.10481,.342345,.0759185,.136743,-.115474,.358472,.0894116,.152986,-.126536,.374067,.104562,.170397,-.138061,.388267,.121632,.191392,-.150203,.406467,.140996,.211566,-.161751,.418641,.161696,.233567,-.173407,.430418,.184557,.257769,-.185397,.44277,.210092,.28531,-.197048,.457191,.237827,.311726,-.20784,.464712,.267253,.340537,-.218345,.472539,.299332,.372921,-.228306,.482331,.333988,.402924,-.236665,.484378,.369722,.434475,-.244097,.484717,.407836,.469736,-.250547,.487093,.448465,.505045,-.25511,.485575,.490263,.540262,-.258444,.481225,.534495,.576347,-.259903,.473481,.579451,.608656,-.259572,.4603,.625604,.646679,-.257908,.450341,.674511,.679902,-.253663,.431561,.723269,.714159,-.247419,.412684,.773263,.745345,-.239122,.389388,.824182,.778248,-.228837,.365361,.876634,.807208,-.216197,.337667,.92945,.835019,-.201772,.307197,.985261,.860261,-.185291,.274205,1.04299,.877601,-.165809,.240178,1.09816,.898211,-.143897,.207571,1.14694,.915789,-.119513,.174904,1.19008,.931831,-.0932919,.141423,1.2297,.949244,-.0656528,.105603,1.26553,.967527,-.0370262,.0679551,1.29986,.984139,-.00730117,.0283133,1.33252,.999713,.0234648,-.0121785,1.36397,.0152135,-245447e-11,.122795,304092e-12,.0151652,-615778e-10,.122399,76292e-10,.0151181,-245948e-9,.122023,304802e-10,.0151203,-553394e-9,.12203,686634e-10,.015125,-983841e-9,.122037,122463e-9,.0151427,-.00153774,.12214,192706e-9,.0151708,-.0022103,.122237,281219e-9,.0152115,-.00300741,.12238,390804e-9,.0152877,-.00392494,.1227,526317e-9,.015412,-.00496597,.123244,69443e-8,.0156201,-.00613314,.124228,90547e-8,.0159658,-.00744113,.125945,.0011732,.0165674,-.00892546,.129098,.00151888,.017487,-.010627,.133865,.00197007,.018839,-.0126043,.140682,.0025637,.020554,-.0148814,.148534,.00333637,.0226727,-.0175123,.157381,.00433738,.0251879,-.0205266,.166685,.00561664,.0283635,-.0240319,.177796,.00725563,.0318694,-.0279432,.188251,.00928811,.0361044,-.0324313,.200038,.011835,.0406656,-.0373527,.210685,.0149146,.0463846,-.0430132,.224182,.0187254,.0525696,-.0491013,.23634,.0232283,.0598083,-.0559175,.250013,.0286521,.0679437,-.0633657,.263981,.0350634,.0771181,-.0714602,.278072,.0425882,.0881273,-.0803502,.29511,.0514487,.0996628,-.0896903,.309976,.0615766,.112702,-.099644,.325611,.0732139,.126488,-.109829,.339321,.0862324,.142625,-.120859,.35574,.101275,.15953,-.131956,.369845,.117892,.176991,-.143145,.38146,.136205,.199715,-.155292,.40052,.157252,.220787,-.167066,.412055,.179966,.243697,-.178396,.423133,.204418,.272106,-.190433,.439524,.232141,.297637,-.201265,.447041,.261109,.325273,-.211834,.454488,.292627,.357219,-.221889,.465004,.326669,.387362,-.230729,.468527,.362426,.423131,-.23924,.475836,.401533,.45543,-.246067,.475017,.441902,.493393,-.251557,.478017,.484239,.526253,-.255571,.4709,.528586,.560554,-.257752,.463167,.574346,.599306,-.258076,.456452,.621655,.634541,-.256471,.443725,.670492,.668907,-.253283,.428719,.721943,.705619,-.247562,.411348,.772477,.739034,-.240626,.388939,.8264,.771408,-.231493,.36425,.881702,.803312,-.220125,.337321,.9385,.828457,-.206645,.305364,.997437,.854819,-.190664,.273715,1.05693,.878666,-.171429,.242218,1.11251,.898404,-.149235,.209556,1.16398,.917416,-.12435,.176863,1.21014,.933133,-.0972703,.142775,1.25178,.95066,-.0683607,.106735,1.29028,.968589,-.0378724,.0681609,1.32703,.984776,-.00605712,.0273966,1.36158,.99994,.0263276,-.0138124,1.3943,.00867437,-186005e-11,.0928979,173682e-12,.00864003,-466389e-10,.0925237,435505e-11,.00864593,-186594e-9,.0925806,174322e-10,.00864095,-419639e-9,.0924903,392862e-10,.00863851,-746272e-9,.0924589,702598e-10,.00868531,-.00116456,.0929,111188e-9,.00869667,-.00167711,.0928529,163867e-9,.00874332,-.00228051,.0930914,23104e-8,.00882709,-.00297864,.0935679,31741e-8,.00898874,-.00377557,.0946165,430186e-9,.00929346,-.00469247,.0967406,580383e-9,.00978271,-.00575491,.100084,783529e-9,.0105746,-.00701514,.105447,.00106304,.0116949,-.00851797,.112494,.00144685,.0130419,-.0102757,.119876,.00196439,.0148375,-.012381,.129034,.00266433,.0168725,-.01482,.137812,.00358364,.0193689,-.0176563,.147696,.00478132,.0222691,-.0209211,.157795,.00631721,.0256891,-.0246655,.168431,.00826346,.0294686,-.0288597,.178587,.0106714,.0340412,-.0336441,.190251,.0136629,.0393918,-.039033,.202999,.0173272,.0453947,-.0450087,.215655,.0217448,.0521936,-.0515461,.228686,.0269941,.0600279,-.058817,.242838,.033272,.0692398,-.0667228,.258145,.0406457,.0793832,-.0752401,.273565,.0492239,.0902297,-.0841851,.287735,.0590105,.102014,-.0936479,.301161,.0702021,.116054,-.103967,.317438,.0832001,.13191,-.114622,.334166,.0977951,.148239,-.125452,.348192,.113985,.165809,-.136453,.361094,.131928,.184616,-.147648,.373534,.151811,.207491,-.159607,.39101,.174476,.230106,-.171119,.402504,.198798,.257036,-.182906,.418032,.225796,.281172,-.193605,.425468,.254027,.312034,-.204771,.440379,.285713,.340402,-.214988,.445406,.319196,.370231,-.224711,.44968,.35537,.407105,-.233516,.460747,.393838,.439037,-.240801,.460624,.433747,.47781,-.24762,.465957,.477234,.510655,-.251823,.460054,.52044,.550584,-.255552,.459172,.567853,.585872,-.257036,.450311,.615943,.620466,-.257535,.437763,.667693,.660496,-.255248,.426639,.718988,.695578,-.251141,.409185,.772503,.732176,-.244718,.39015,.827023,.760782,-.236782,.362594,.885651,.79422,-.225923,.33711,.943756,.824521,-.213855,.308272,1.00874,.854964,-.197723,.278529,1.06764,.878065,-.179209,.246208,1.12836,.899834,-.157569,.21329,1.18318,.918815,-.133206,.181038,1.23161,.934934,-.106545,.146993,1.27644,.952115,-.0780574,.111175,1.31842,.96906,-.0478279,.0728553,1.35839,.985178,-.0160014,.032579,1.39697,1.00039,.0173126,-.0095256,1.43312,.00384146,-124311e-11,.0613583,778271e-13,.00390023,-314043e-10,.0622919,196626e-11,.00389971,-125622e-9,.0622632,787379e-11,.00389491,-282352e-9,.0620659,1778e-8,.00391618,-502512e-9,.0624687,320918e-10,.00392662,-784458e-9,.0625113,515573e-10,.00396053,-.00112907,.0628175,778668e-10,.00401911,-.00153821,.0633286,113811e-9,.00414994,-.0020208,.0646443,16445e-8,.00441223,-.00260007,.0673886,237734e-9,.00484427,-.0033097,.0716528,345929e-9,.00549109,-.00418966,.0774998,505987e-9,.00636293,-.00527331,.0844758,739208e-9,.00746566,-.00660428,.0921325,.00107347,.00876625,-.00818826,.0997067,.00153691,.0103125,-.0100811,.107433,.00217153,.0123309,-.0123643,.117088,.00303427,.0146274,-.0150007,.126438,.00416018,.0172295,-.0180531,.135672,.00561513,.0204248,-.0215962,.146244,.007478,.0241597,-.0256234,.157481,.00981046,.0284693,-.0302209,.169125,.0127148,.033445,-.0353333,.181659,.0162453,.0391251,-.0410845,.1944,.0205417,.0454721,-.0473451,.207082,.0256333,.0530983,-.0542858,.221656,.0317036,.0615356,-.0618384,.236036,.0388319,.0703363,-.0697631,.248398,.046974,.0810391,-.0784757,.263611,.0565246,.0920144,-.0873488,.275857,.0671724,.105584,-.0973652,.292555,.0798105,.119506,-.107271,.306333,.0935945,.134434,-.117608,.318888,.109106,.153399,-.128938,.337552,.127074,.171258,-.139944,.349955,.14643,.191059,-.151288,.361545,.168,.215069,-.163018,.378421,.192082,.237838,-.174226,.38879,.217838,.266965,-.186063,.405857,.246931,.292827,-.196909,.414146,.277505,.324352,-.207473,.426955,.310711,.354427,-.217713,.433429,.346794,.389854,-.227183,.443966,.385237,.420749,-.235131,.44471,.424955,.459597,-.242786,.451729,.468446,.495316,-.248767,.45072,.513422,.534903,-.253351,.450924,.560618,.572369,-.256277,.445266,.609677,.612383,-.2576,.438798,.660995,.644037,-.256931,.421693,.713807,.686749,-.254036,.4109,.767616,.719814,-.249785,.390151,.82533,.754719,-.244283,.367847,.888311,.792022,-.235076,.345013,.948177,.822404,-.225061,.316193,1.01661,.853084,-.211113,.287013,1.08075,.879871,-.19449,.255424,1.14501,.901655,-.174023,.222879,1.20203,.919957,-.1509,.18989,1.25698,.938412,-.124923,.15606,1.30588,.953471,-.0968139,.120512,1.3529,.970451,-.066734,.0828515,1.3986,.985522,-.034734,.0424458,1.44148,1.00099,-.00102222,678929e-9,1.48398,965494e-9,-627338e-12,.0306409,197672e-13,99168e-8,-158573e-10,.0314638,499803e-12,991068e-9,-634012e-10,.031363,200682e-11,974567e-9,-14144e-8,.03036,457312e-11,998079e-9,-252812e-9,.031496,860131e-11,.00102243,-396506e-9,.0319955,148288e-10,.00107877,-577593e-9,.0331376,249141e-10,.00121622,-816816e-9,.0359396,423011e-10,.0014455,-.00113761,.0399652,724613e-10,.00178791,-.00156959,.0450556,123929e-9,.00225668,-.00214064,.0508025,208531e-9,.00285627,-.00287655,.0568443,341969e-9,.0035991,-.00380271,.0630892,544158e-9,.00455524,-.00496264,.0702204,842423e-9,.00569143,-.0063793,.0773426,.00126704,.00716928,-.00813531,.0860839,.00186642,.00885307,-.0101946,.0944079,.00267014,.0109316,-.0126386,.103951,.00374033,.0133704,-.0154876,.113786,.0051304,.0161525,-.0187317,.123477,.00688858,.0194267,-.0224652,.133986,.00910557,.0230967,-.0265976,.143979,.0118074,.0273627,-.0312848,.154645,.0151266,.0323898,-.0365949,.166765,.0191791,.0379225,-.0422914,.177932,.0239236,.0447501,-.0487469,.19167,.0296568,.0519391,-.0556398,.203224,.0362924,.0599464,-.0631646,.215652,.0440585,.0702427,-.0714308,.232089,.0531619,.0806902,-.0800605,.245258,.0634564,.0923194,-.0892815,.258609,.0752481,.106938,-.09931,.276654,.0888914,.121238,-.109575,.289847,.104055,.138817,-.120461,.307566,.121266,.15595,-.131209,.320117,.139944,.178418,-.143049,.339677,.161591,.197875,-.154074,.349886,.184303,.224368,-.166307,.369352,.210669,.252213,-.178051,.386242,.238895,.277321,-.189335,.395294,.269182,.310332,-.200683,.412148,.302508,.338809,-.210856,.418266,.337264,.372678,-.220655,.428723,.374881,.405632,-.230053,.433887,.415656,.442293,-.237993,.439911,.457982,.477256,-.244897,.440175,.502831,.515592,-.250657,.441079,.550277,.550969,-.255459,.435219,.601102,.592883,-.257696,.432882,.651785,.629092,-.259894,.421054,.708961,.672033,-.258592,.41177,.763806,.709147,-.256525,.395267,.824249,.745367,-.254677,.375013,.8951,.784715,-.247892,.353906,.959317,.818107,-.240162,.327801,1.03153,.847895,-.229741,.298821,1.10601,.879603,-.213084,.269115,1.164,.902605,-.195242,.236606,1.22854,.922788,-.174505,.203442,1.29017,.944831,-.150169,.169594,1.34157,.959656,-.124099,.135909,1.3956,.972399,-.0960626,.0990563,1.45128,.986549,-.0657097,.0602348,1.50312,1.00013,-.0333558,.0186694,1.55364,619747e-11,-1e-7,.00778326,796756e-16,237499e-13,-999999e-13,282592e-10,114596e-15,100292e-11,-166369e-11,250354e-9,677492e-14,350752e-11,-637769e-11,357289e-9,631655e-13,826445e-11,-174689e-10,516179e-9,31851e-11,242481e-10,-450868e-10,.0010223,130577e-11,455631e-10,-89044e-9,.00144302,374587e-11,971222e-10,-178311e-9,.00241912,102584e-10,171403e-9,-313976e-9,.00354938,236481e-10,292747e-9,-520026e-9,.00513765,496014e-10,789827e-9,-.00118187,.0238621,139056e-9,.00114093,-.00171827,.0286691,244093e-9,.00176119,-.00249667,.0368565,420623e-9,.0022233,-.00333742,.0400469,65673e-8,.00343382,-.00481976,.0535751,.00109323,.00427602,-.00600755,.057099,.00155268,.00461435,-.00737637,.0551084,.00215031,.00695698,-.00971401,.0715767,.00316529,.00867619,-.0120943,.0793314,.00436995,.0106694,-.0148202,.0869391,.0058959,.0140351,-.0183501,.101572,.00798757,.0168939,-.022006,.11018,.0104233,.020197,-.0261568,.119041,.0134167,.0254702,-.0312778,.135404,.0173009,.0298384,-.0362469,.1437,.0215428,.035159,-.042237,.15512,.0268882,.0427685,-.0488711,.17128,.033235,.0494848,-.0557997,.181813,.0404443,.0592394,-.0635578,.198745,.0490043,.0681463,-.071838,.210497,.0588239,.0804753,-.0809297,.228864,.0702835,.0942205,-.0906488,.247008,.0834012,.106777,-.100216,.258812,.0975952,.124471,-.110827,.278617,.114162,.138389,-.121193,.287049,.131983,.159543,-.13253,.307151,.152541,.176432,-.143611,.31564,.174673,.201723,-.15548,.33538,.199842,.229721,-.167166,.355256,.227097,.250206,-.178238,.360047,.256014,.282118,-.189905,.378761,.28855,.312821,-.201033,.39181,.323348,.341482,-.211584,.397716,.360564,.377368,-.221314,.410141,.400004,.418229,-.230474,.423485,.442371,.444881,-.239443,.418874,.488796,.488899,-.245987,.427545,.535012,.520317,-.253948,.422147,.589678,.568566,-.256616,.42719,.637683,.599607,-.26376,.415114,.703363,.64222,-.268687,.408715,.771363,.685698,-.2694,.399722,.83574,.732327,-.266642,.388651,.897764,.769873,-.267712,.369198,.983312,.806733,-.263479,.346802,1.06222,.843466,-.254575,.321368,1.13477,.873008,-.242749,.29211,1.20712,.908438,-.22725,.262143,1.27465,.936321,-.207621,.228876,1.33203,.950353,-.187932,.19484,1.40439,.96442,-.165154,.163178,1.4732,.979856,-.139302,.127531,1.53574,.982561,-.11134,.0903457,1.59982,.996389,-.0808124,.0489007,1.6577],t=[1,0,0,0,1,791421e-36,0,0,1,104392e-29,0,0,1,349405e-26,0,0,1,109923e-23,0,0,1,947414e-22,0,0,1,359627e-20,0,0,1,772053e-19,0,0,1,108799e-17,0,0,1,110655e-16,0,0,1,865818e-16,0,0,.999998,545037e-15,0,0,.999994,285095e-14,0,0,.999989,126931e-13,0,0,.999973,489938e-13,0,0,.999947,166347e-12,0,0,.999894,502694e-12,0,0,.999798,136532e-11,0,0,.999617,335898e-11,0,0,.999234,752126e-11,0,0,.998258,152586e-10,0,0,.99504,266207e-10,0,0,.980816,236802e-10,0,0,.967553,207684e-11,0,0,.966877,403733e-11,0,0,.965752,741174e-11,0,0,.96382,127746e-10,0,0,.960306,202792e-10,0,0,.953619,280232e-10,0,0,.941103,278816e-10,0,0,.926619,160221e-10,0,0,.920983,235164e-10,0,0,.912293,311924e-10,0,.0158731,.899277,348118e-10,0,.0476191,.880884,26041e-9,0,.0793651,.870399,338726e-10,0,.111111,.856138,392906e-10,0,.142857,.837436,372874e-10,0,.174603,.820973,392558e-10,0,.206349,.803583,434658e-10,0,.238095,.782168,40256e-9,0,.269841,.764107,448159e-10,0,.301587,.743092,457627e-10,0,.333333,.721626,455314e-10,0,.365079,.700375,477335e-10,0,.396825,.677334,461072e-10,0,.428571,.655702,484393e-10,0,.460317,.632059,464583e-10,0,.492064,.610125,483923e-10,0,.52381,.58653,464342e-10,0,.555556,.564508,477033e-10,0,.587302,.541405,459263e-10,0,.619048,.519556,46412e-9,0,.650794,.497292,448913e-10,0,.68254,.475898,445789e-10,0,.714286,.454722,433496e-10,0,.746032,.434042,423054e-10,0,.777778,.414126,413737e-10,0,.809524,.394387,397265e-10,0,.84127,.375841,390709e-10,0,.873016,.357219,369938e-10,0,.904762,.340084,365618e-10,0,.936508,.322714,342533e-10,0,.968254,.306974,339596e-10,0,1,1,101524e-23,0,0,1,10292e-22,0,0,1,130908e-23,0,0,1,473331e-23,0,0,1,625319e-22,0,0,1,107932e-20,0,0,1,163779e-19,0,0,1,203198e-18,0,0,1,204717e-17,0,0,.999999,168995e-16,0,0,.999998,115855e-15,0,0,.999996,66947e-14,0,0,.999991,330863e-14,0,0,.999983,141737e-13,0,0,.999968,532626e-13,0,0,.99994,177431e-12,0,0,.999891,528835e-12,0,0,.999797,142169e-11,0,0,.999617,347057e-11,0,0,.999227,77231e-10,0,0,.998239,155753e-10,0,0,.994937,268495e-10,0,0,.980225,213742e-10,0,0,.967549,21631e-10,0,0,.966865,417989e-11,0,0,.965739,763341e-11,0,0,.963794,130892e-10,0,0,.960244,206456e-10,0,0,.953495,282016e-10,0,148105e-9,.940876,271581e-10,0,.002454,.926569,164159e-10,0,.00867491,.920905,239521e-10,0,.01956,.912169,315127e-10,0,.035433,.899095,346626e-10,0,.056294,.882209,290223e-10,0,.0818191,.870272,342992e-10,0,.111259,.855977,394164e-10,0,.142857,.837431,372343e-10,0,.174603,.820826,396691e-10,0,.206349,.803408,435395e-10,0,.238095,.782838,419579e-10,0,.269841,.763941,450953e-10,0,.301587,.742904,455847e-10,0,.333333,.721463,458833e-10,0,.365079,.700197,477159e-10,0,.396825,.677501,470641e-10,0,.428571,.655527,484732e-10,0,.460317,.6324,476834e-10,0,.492064,.609964,484213e-10,0,.52381,.586839,475541e-10,0,.555556,.564353,476951e-10,0,.587302,.541589,467611e-10,0,.619048,.519413,463493e-10,0,.650794,.497337,453994e-10,0,.68254,.475797,445308e-10,0,.714286,.454659,435787e-10,0,.746032,.434065,424839e-10,0,.777778,.414018,41436e-9,0,.809524,.39455,401902e-10,0,.84127,.375742,390813e-10,0,.873016,.357501,377116e-10,0,.904762,.339996,36535e-9,0,.936508,.323069,351265e-10,0,.968254,.306897,339112e-10,0,1,1,10396e-19,0,0,1,104326e-20,0,0,1,110153e-20,0,0,1,144668e-20,0,0,1,34528e-19,0,0,1,175958e-19,0,0,1,12627e-17,0,0,1,936074e-18,0,0,1,645742e-17,0,0,.999998,401228e-16,0,0,.999997,222338e-15,0,0,.999995,10967e-13,0,0,.999991,482132e-14,0,0,.999981,189434e-13,0,0,.999967,667716e-13,0,0,.999938,212066e-12,0,0,.999886,60977e-11,0,0,.999792,159504e-11,0,0,.999608,381191e-11,0,0,.999209,833727e-11,0,0,.998179,165288e-10,0,0,.994605,274387e-10,0,0,.979468,167316e-10,0,0,.967529,242877e-11,0,0,.966836,461696e-11,0,0,.96569,830977e-11,0,0,.963706,140427e-10,0,244659e-11,.960063,217353e-10,0,760774e-9,.953113,286606e-10,0,.00367261,.940192,247691e-10,0,.00940263,.927731,195814e-10,0,.018333,.920669,252531e-10,0,.0306825,.911799,324277e-10,0,.0465556,.89857,340982e-10,0,.0659521,.883283,319622e-10,0,.0887677,.86989,35548e-9,0,.114784,.855483,397143e-10,0,.143618,.837987,391665e-10,0,.174606,.820546,411306e-10,0,.206349,.802878,436753e-10,0,.238095,.783402,444e-7,0,.269841,.763439,458726e-10,0,.301587,.742925,467097e-10,0,.333333,.721633,478887e-10,0,.365079,.69985,481251e-10,0,.396825,.67783,491811e-10,0,.428571,.655126,488199e-10,0,.460318,.632697,496025e-10,0,.492064,.609613,48829e-9,0,.52381,.587098,492754e-10,0,.555556,.564119,482625e-10,0,.587302,.541813,482807e-10,0,.619048,.519342,471552e-10,0,.650794,.497514,466765e-10,0,.68254,.475879,455582e-10,0,.714286,.454789,446007e-10,0,.746032,.434217,435382e-10,0,.777778,.414086,421753e-10,0,.809524,.394744,412093e-10,0,.84127,.375782,396634e-10,0,.873016,.357707,386419e-10,0,.904762,.340038,370345e-10,0,.936508,.323284,359725e-10,0,.968254,.306954,3436e-8,0,1,1,599567e-19,0,0,1,600497e-19,0,0,1,614839e-19,0,0,1,686641e-19,0,0,1,972658e-19,0,0,1,221271e-18,0,0,1,833195e-18,0,0,1,403601e-17,0,0,.999999,206001e-16,0,0,.999998,101739e-15,0,0,.999997,470132e-15,0,0,.999993,200436e-14,0,0,.999988,783682e-14,0,0,.999979,280338e-13,0,0,.999962,917033e-13,0,0,.999933,274514e-12,0,0,.999881,753201e-12,0,0,.999783,189826e-11,0,0,.999594,440279e-11,0,0,.999178,93898e-10,0,0,.998073,181265e-10,0,0,.993993,280487e-10,0,0,.979982,149422e-10,0,0,.968145,378481e-11,0,0,.966786,53771e-10,0,0,.965611,947508e-11,0,388934e-10,.963557,156616e-10,0,9693e-7,.959752,235144e-10,0,.00370329,.952461,291568e-10,0,.00868428,.940193,240102e-10,0,.0161889,.929042,231235e-10,0,.0263948,.920266,273968e-10,0,.0394088,.911178,337915e-10,0,.0552818,.897873,333629e-10,0,.0740138,.884053,351405e-10,0,.0955539,.869455,378034e-10,0,.119795,.854655,399378e-10,0,.14656,.838347,419108e-10,0,.175573,.820693,440831e-10,0,.206388,.802277,445599e-10,0,.238095,.783634,472691e-10,0,.269841,.763159,476984e-10,0,.301587,.742914,491487e-10,0,.333333,.721662,502312e-10,0,.365079,.699668,502817e-10,0,.396825,.677839,51406e-9,0,.428571,.655091,511095e-10,0,.460317,.632665,516067e-10,0,.492064,.609734,512255e-10,0,.52381,.587043,510263e-10,0,.555556,.564298,50565e-9,0,.587302,.541769,497951e-10,0,.619048,.519529,492698e-10,0,.650794,.497574,482066e-10,0,.68254,.476028,473689e-10,0,.714286,.454961,461941e-10,0,.746032,.434341,450618e-10,0,.777778,.414364,438355e-10,0,.809524,.394832,424196e-10,0,.84127,.376109,412563e-10,0,.873016,.35779,396226e-10,0,.904762,.340379,384886e-10,0,.936508,.323385,368214e-10,0,.968254,.307295,356636e-10,0,1,1,106465e-17,0,0,1,106555e-17,0,0,1,107966e-17,0,0,1,114601e-17,0,0,1,137123e-17,0,0,1,21243e-16,0,0,.999999,489653e-17,0,0,.999999,160283e-16,0,0,.999998,62269e-15,0,0,.999997,251859e-15,0,0,.999996,996192e-15,0,0,.999992,374531e-14,0,0,.999986,132022e-13,0,0,.999975,433315e-13,0,0,.999959,131956e-12,0,0,.999927,372249e-12,0,0,.999871,972461e-12,0,0,.999771,235343e-11,0,0,.999572,52768e-10,0,0,.999133,109237e-10,0,0,.997912,203675e-10,0,0,.993008,279396e-10,0,0,.980645,139604e-10,0,0,.970057,646596e-11,0,0,.966717,65089e-10,0,474145e-10,.965497,111863e-10,0,89544e-8,.96334,179857e-10,0,.0032647,.959294,259045e-10,0,.0075144,.951519,292327e-10,0,.0138734,.940517,249769e-10,0,.0224952,.93014,26803e-9,0,.0334828,.91972,303656e-10,0,.0468973,.910294,353323e-10,0,.0627703,.897701,351002e-10,0,.0811019,.884522,388104e-10,0,.10186,.869489,412932e-10,0,.124985,.853983,415781e-10,0,.150372,.838425,454066e-10,0,.177868,.820656,471624e-10,0,.207245,.801875,475243e-10,0,.238143,.783521,505621e-10,0,.269841,.763131,50721e-9,0,.301587,.74261,523293e-10,0,.333333,.72148,528699e-10,0,.365079,.699696,538677e-10,0,.396825,.677592,539255e-10,0,.428571,.65525,546367e-10,0,.460317,.632452,541348e-10,0,.492064,.609903,544976e-10,0,.52381,.586928,536201e-10,0,.555556,.564464,535185e-10,0,.587302,.541801,524949e-10,0,.619048,.519681,51812e-9,0,.650794,.497685,507687e-10,0,.68254,.47622,496243e-10,0,.714286,.455135,485714e-10,0,.746032,.4346,471847e-10,0,.777778,.414564,459294e-10,0,.809524,.395165,444705e-10,0,.84127,.376333,430772e-10,0,.873016,.358197,416229e-10,0,.904762,.34064,401019e-10,0,.936508,.323816,386623e-10,0,.968254,.307581,370933e-10,0,1,1,991541e-17,0,0,1,992077e-17,0,0,1,100041e-16,0,0,1,10385e-15,0,0,1,115777e-16,0,0,1,150215e-16,0,0,.999999,254738e-16,0,0,.999999,598822e-16,0,0,.999998,179597e-15,0,0,.999997,602367e-15,0,0,.999994,206835e-14,0,0,.99999,694952e-14,0,0,.999984,223363e-13,0,0,.999972,678578e-13,0,0,.999952,193571e-12,0,0,.999919,516594e-12,0,0,.99986,128739e-11,0,0,.999753,299298e-11,0,0,.999546,648258e-11,0,0,.999074,129985e-10,0,0,.997671,232176e-10,0,0,.991504,256701e-10,0,0,.981148,131141e-10,0,0,.971965,869048e-11,0,280182e-10,.966624,808301e-11,0,695475e-9,.965344,135235e-10,0,.00265522,.963048,210592e-10,0,.00622975,.958673,287473e-10,0,.0116234,.950262,281379e-10,0,.018976,.940836,271089e-10,0,.0283844,.930996,30926e-9,0,.0399151,.919848,348359e-10,0,.0536063,.909136,366092e-10,0,.0694793,.897554,384162e-10,0,.0875342,.884691,430971e-10,0,.107749,.869414,447803e-10,0,.130087,.853462,452858e-10,0,.154481,.838187,495769e-10,0,.180833,.820381,502709e-10,0,.209005,.801844,522713e-10,0,.238791,.783061,541505e-10,0,.269869,.763205,553712e-10,0,.301587,.742362,564909e-10,0,.333333,.721393,572646e-10,0,.365079,.699676,581012e-10,0,.396825,.677395,58096e-9,0,.428571,.655208,585766e-10,0,.460317,.632451,583602e-10,0,.492064,.609839,580234e-10,0,.52381,.587093,577161e-10,0,.555556,.564467,568447e-10,0,.587302,.542043,563166e-10,0,.619048,.519826,55156e-9,0,.650794,.497952,541682e-10,0,.68254,.476477,528971e-10,0,.714286,.455412,514952e-10,0,.746032,.434926,502222e-10,0,.777778,.4149,485779e-10,0,.809524,.395552,472242e-10,0,.84127,.376712,454891e-10,0,.873016,.358622,440924e-10,0,.904762,.341048,422984e-10,0,.936508,.324262,408582e-10,0,.968254,.308013,390839e-10,0,1,1,613913e-16,0,0,1,614145e-16,0,0,1,617708e-16,0,0,1,633717e-16,0,0,1,681648e-16,0,0,1,808291e-16,0,0,1,114608e-15,0,0,.999998,210507e-15,0,0,.999997,499595e-15,0,0,.999995,139897e-14,0,0,.999994,419818e-14,0,0,.999988,127042e-13,0,0,.999979,375153e-13,0,0,.999965,106206e-12,0,0,.999945,285381e-12,0,0,.999908,723611e-12,0,0,.999846,17255e-10,0,0,.999733,386104e-11,0,0,.999511,808493e-11,0,0,.998993,156884e-10,0,0,.997326,265538e-10,0,0,.989706,206466e-10,0,0,.981713,130756e-10,0,70005e-10,.973636,106473e-10,0,464797e-9,.966509,10194e-9,0,.00201743,.965149,165881e-10,0,.00497549,.962669,249147e-10,0,.00953262,.95786,317449e-10,0,.0158211,.949334,281045e-10,0,.0239343,.941041,303263e-10,0,.0339372,.931575,356754e-10,0,.0458738,.920102,397075e-10,0,.059772,.908002,384886e-10,0,.075645,.897269,43027e-9,0,.0934929,.884559,479925e-10,0,.113302,.869161,48246e-9,0,.135045,.853342,509505e-10,0,.158678,.837633,542846e-10,0,.184136,.820252,554139e-10,0,.211325,.801872,581412e-10,0,.240113,.782418,585535e-10,0,.270306,.7631,610923e-10,0,.301594,.742183,613678e-10,0,.333333,.721098,627275e-10,0,.365079,.699512,629413e-10,0,.396825,.677372,636351e-10,0,.428571,.655059,633555e-10,0,.460317,.632567,636513e-10,0,.492064,.609784,628965e-10,0,.52381,.587237,625546e-10,0,.555556,.564525,615825e-10,0,.587302,.542181,605048e-10,0,.619048,.520017,596329e-10,0,.650794,.498204,581516e-10,0,.68254,.476742,569186e-10,0,.714286,.455803,553833e-10,0,.746032,.435251,537807e-10,0,.777778,.415374,522025e-10,0,.809524,.395921,503421e-10,0,.84127,.377253,488211e-10,0,.873016,.359021,468234e-10,0,.904762,.341637,453269e-10,0,.936508,.3247,433014e-10,0,.968254,.308625,418007e-10,0,1,1,286798e-15,0,0,1,286877e-15,0,0,1,288094e-15,0,0,1,293506e-15,0,0,1,309262e-15,0,0,.999999,348593e-15,0,0,.999999,444582e-15,0,0,.999998,688591e-15,0,0,.999996,134391e-14,0,0,.999993,317438e-14,0,0,.999989,835609e-14,0,0,.999983,228677e-13,0,0,.999974,623361e-13,0,0,.999959,165225e-12,0,0,.999936,419983e-12,0,0,.999896,101546e-11,0,0,.99983,232376e-11,0,0,.999709,50156e-10,0,0,.999469,10167e-9,0,0,.998886,190775e-10,0,0,.996819,300511e-10,0,0,.988837,185092e-10,0,168222e-12,.982178,134622e-10,0,259622e-9,.975017,125961e-10,0,.00142595,.967101,13507e-9,0,.00382273,.964905,205003e-10,0,.00764164,.96218,29546e-9,0,.0130121,.956821,343738e-10,0,.0200253,.948829,305063e-10,0,.0287452,.941092,346487e-10,0,.039218,.931883,412061e-10,0,.0514748,.920211,444651e-10,0,.0655351,.907307,431252e-10,0,.0814082,.89684,490382e-10,0,.0990939,.884119,53334e-9,0,.118583,.869148,54114e-9,0,.139856,.853377,578536e-10,0,.162882,.836753,592285e-10,0,.187615,.820063,622787e-10,0,.213991,.801694,645492e-10,0,.241918,.782116,65353e-9,0,.271267,.762673,674344e-10,0,.301847,.742133,682788e-10,0,.333333,.720779,691959e-10,0,.365079,.699386,696817e-10,0,.396826,.67732,699583e-10,0,.428572,.654888,698447e-10,0,.460318,.632499,694063e-10,0,.492064,.609825,691612e-10,0,.52381,.587287,681576e-10,0,.555556,.564743,674138e-10,0,.587302,.542409,661617e-10,0,.619048,.520282,647785e-10,0,.650794,.498506,633836e-10,0,.68254,.477102,615905e-10,0,.714286,.456167,601013e-10,0,.746032,.435728,581457e-10,0,.777778,.415809,564215e-10,0,.809524,.396517,544997e-10,0,.84127,.377737,525061e-10,0,.873016,.359698,506831e-10,0,.904762,.342164,48568e-9,0,.936508,.325417,467826e-10,0,.968254,.309186,446736e-10,0,1,1,109018e-14,0,0,1,10904e-13,0,0,1,109393e-14,0,0,1,11095e-13,0,0,1,1154e-12,0,0,1,126089e-14,0,0,.999999,15059e-13,0,0,.999997,207899e-14,0,0,.999994,348164e-14,0,0,.999993,705728e-14,0,0,.999987,163692e-13,0,0,.999981,406033e-13,0,0,.999969,10245e-11,0,0,.999953,255023e-12,0,0,.999925,61511e-11,0,0,.999881,142218e-11,0,0,.99981,313086e-11,0,0,.99968,653119e-11,0,0,.999418,12832e-9,0,0,.998748,232497e-10,0,0,.996066,329522e-10,0,0,.988379,179613e-10,0,108799e-9,.982567,143715e-10,0,921302e-9,.976097,148096e-10,0,.00280738,.968475,178905e-10,0,.00596622,.964606,253921e-10,0,.0105284,.961564,348623e-10,0,.0165848,.955517,357612e-10,0,.0242,.948381,343493e-10,0,.03342,.941095,405849e-10,0,.0442777,.931923,475394e-10,0,.0567958,.91996,484328e-10,0,.0709879,.907419,502146e-10,0,.086861,.89618,561654e-10,0,.104415,.88337,587612e-10,0,.123643,.869046,618057e-10,0,.144531,.853278,657392e-10,0,.167057,.836091,66303e-9,0,.191188,.819644,704445e-10,0,.216878,.801246,714071e-10,0,.244062,.782031,740093e-10,0,.272649,.762066,74685e-9,0,.302509,.741964,766647e-10,0,.333442,.720554,766328e-10,0,.365079,.699098,777857e-10,0,.396826,.677189,774633e-10,0,.428572,.65484,776235e-10,0,.460318,.632496,770316e-10,0,.492064,.609908,762669e-10,0,.52381,.587312,753972e-10,0,.555556,.564938,739994e-10,0,.587302,.542577,728382e-10,0,.619048,.52062,71112e-9,0,.650794,.498819,694004e-10,0,.68254,.477555,675575e-10,0,.714286,.456568,653449e-10,0,.746032,.436278,636068e-10,0,.777778,.41637,613466e-10,0,.809524,.397144,594177e-10,0,.84127,.378412,570987e-10,0,.873016,.360376,550419e-10,0,.904762,.342906,527422e-10,0,.936508,.326136,506544e-10,0,.968254,.30997,484307e-10,0,1,1,354014e-14,0,0,1,354073e-14,0,0,1,354972e-14,0,0,1,358929e-14,0,0,1,370093e-14,0,0,.999999,396194e-14,0,0,.999998,453352e-14,0,0,.999997,578828e-14,0,0,.999994,863812e-14,0,0,.999991,153622e-13,0,0,.999985,316356e-13,0,0,.999977,712781e-13,0,0,.999964,166725e-12,0,0,.999945,390501e-12,0,0,.999912,895622e-12,0,0,.999866,198428e-11,0,0,.999786,421038e-11,0,0,.999647,850239e-11,0,0,.999356,162059e-10,0,0,.998563,282652e-10,0,0,.994928,336309e-10,0,244244e-10,.987999,178458e-10,0,523891e-9,.982893,159162e-10,0,.00194729,.977044,178056e-10,0,.00451099,.969972,230624e-10,0,.00835132,.964237,313922e-10,0,.013561,.960791,406145e-10,0,.0202056,.954292,372796e-10,0,.0283321,.948052,403199e-10,0,.0379739,.940938,479537e-10,0,.0491551,.931689,545292e-10,0,.0618918,.91987,54038e-9,0,.0761941,.907665,589909e-10,0,.0920672,.895281,642651e-10,0,.109511,.882621,659707e-10,0,.12852,.86873,709973e-10,0,.149085,.853008,742221e-10,0,.171189,.835944,761754e-10,0,.194809,.818949,797052e-10,0,.21991,.800951,812434e-10,0,.246447,.781847,838075e-10,0,.274352,.761649,84501e-9,0,.303535,.74152,860258e-10,0,.333857,.720495,866233e-10,0,.365104,.698742,868326e-10,0,.396826,.677096,87133e-9,0,.428572,.654782,863497e-10,0,.460318,.632335,860206e-10,0,.492064,.610031,849337e-10,0,.52381,.587457,838279e-10,0,.555556,.56513,82309e-9,0,.587302,.542877,803542e-10,0,.619048,.5209,786928e-10,0,.650794,.499291,765171e-10,0,.68254,.477971,744753e-10,0,.714286,.457221,72209e-9,0,.746032,.436803,697448e-10,0,.777778,.417083,675333e-10,0,.809524,.397749,648058e-10,0,.84127,.379177,625759e-10,0,.873016,.361061,598584e-10,0,.904762,.343713,575797e-10,0,.936508,.326894,549999e-10,0,.968254,.310816,527482e-10,0,1,1,10153e-12,0,0,1,101544e-13,0,0,1,101751e-13,0,0,1,102662e-13,0,0,1,10521e-12,0,0,.999999,111049e-13,0,0,.999999,123408e-13,0,0,.999996,14924e-12,0,0,.999992,204471e-13,0,0,.999989,326539e-13,0,0,.99998,603559e-13,0,0,.999971,123936e-12,0,0,.999955,269058e-12,0,0,.999933,593604e-12,0,0,.999901,129633e-11,0,0,.999847,275621e-11,0,0,.999761,564494e-11,0,0,.999607,110485e-10,0,0,.999282,204388e-10,0,0,.99831,341084e-10,0,22038e-11,.993288,294949e-10,0,242388e-9,.987855,192736e-10,0,.0012503,.983167,182383e-10,0,.0032745,.977908,218633e-10,0,.00646321,.971194,290662e-10,0,.0109133,.963867,386401e-10,0,.0166927,.95982,462827e-10,0,.0238494,.953497,420705e-10,0,.0324178,.947621,477743e-10,0,.0424225,.940611,568258e-10,0,.0538808,.931174,618061e-10,0,.0668047,.919919,627098e-10,0,.0812014,.907856,694714e-10,0,.0970745,.894509,735008e-10,0,.114424,.881954,763369e-10,0,.133246,.868309,821896e-10,0,.153534,.852511,83769e-9,0,.175275,.835821,881615e-10,0,.198453,.817981,896368e-10,0,.223042,.800504,930906e-10,0,.249009,.78141,945056e-10,0,.276304,.761427,963605e-10,0,.304862,.74094,968088e-10,0,.334584,.720233,981481e-10,0,.365322,.698592,979122e-10,0,.396826,.676763,981057e-10,0,.428571,.654808,973956e-10,0,.460318,.632326,962619e-10,0,.492064,.610049,952996e-10,0,.52381,.58763,933334e-10,0,.555556,.565261,917573e-10,0,.587302,.543244,896636e-10,0,.619048,.521273,873304e-10,0,.650794,.499818,852648e-10,0,.68254,.478536,823961e-10,0,.714286,.457826,79939e-9,0,.746032,.437549,77126e-9,0,.777778,.41776,743043e-10,0,.809524,.39863,716426e-10,0,.84127,.379954,686456e-10,0,.873016,.362025,660514e-10,0,.904762,.344581,630755e-10,0,.936508,.327909,605439e-10,0,.968254,.311736,576345e-10,0,1,1,263344e-13,0,0,1,263373e-13,0,0,1,263815e-13,0,0,1,265753e-13,0,0,1,271132e-13,0,0,.999999,283279e-13,0,0,.999997,30833e-12,0,0,.999995,358711e-13,0,0,.999992,461266e-13,0,0,.999985,67574e-12,0,0,.999977,11358e-11,0,0,.999966,213657e-12,0,0,.999948,431151e-12,0,0,.999923,896656e-12,0,0,.999884,186603e-11,0,0,.999826,381115e-11,0,0,.999732,754184e-11,0,0,.999561,143192e-10,0,0,.999191,257061e-10,0,0,.997955,405724e-10,0,744132e-10,.992228,276537e-10,0,716477e-9,.987638,208885e-10,0,.0022524,.983395,215226e-10,0,.00484816,.978614,270795e-10,0,.00860962,.972389,365282e-10,0,.0136083,.964392,474747e-10,0,.0198941,.95861,509141e-10,0,.0275023,.952806,48963e-9,0,.0364584,.94712,571119e-10,0,.04678,.940104,671704e-10,0,.0584799,.930398,687586e-10,0,.0715665,.919866,738161e-10,0,.086045,.907853,813235e-10,0,.101918,.894078,834582e-10,0,.119186,.881177,892093e-10,0,.137845,.867575,944548e-10,0,.157891,.852107,969607e-10,0,.179316,.835502,101456e-9,0,.202106,.81756,103256e-9,0,.226243,.79984,106954e-9,0,.251704,.780998,108066e-9,0,.278451,.761132,110111e-9,0,.306436,.740429,110459e-9,0,.335586,.719836,111219e-9,0,.365796,.698467,11145e-8,0,.3969,.676446,110393e-9,0,.428571,.654635,110035e-9,0,.460318,.632411,108548e-9,0,.492064,.609986,106963e-9,0,.52381,.587872,105238e-9,0,.555556,.565528,102665e-9,0,.587302,.543563,100543e-9,0,.619048,.52176,976182e-10,0,.650794,.500188,947099e-10,0,.68254,.479204,919929e-10,0,.714286,.458413,886139e-10,0,.746032,.438314,857839e-10,0,.777778,.418573,82411e-9,0,.809524,.39947,792211e-10,0,.84127,.380892,759546e-10,0,.873016,.362953,727571e-10,0,.904762,.345601,695738e-10,0,.936508,.328895,664907e-10,0,.968254,.312808,634277e-10,0,1,1,628647e-13,0,0,1,628705e-13,0,0,1,629587e-13,0,0,1,633441e-13,0,0,.999999,644087e-13,0,0,.999998,667856e-13,0,0,.999997,715889e-13,0,0,.999995,809577e-13,0,0,.999989,992764e-13,0,0,.999983,135834e-12,0,0,.999974,210482e-12,0,0,.999959,365215e-12,0,0,.999939,686693e-12,0,0,.999911,13472e-10,0,0,.999868,26731e-10,0,0,.999804,524756e-11,0,0,.9997,100403e-10,0,0,.99951,185019e-10,0,0,.999078,322036e-10,0,620676e-11,.997428,470002e-10,0,341552e-9,.99162,287123e-10,0,.00143727,.987479,234706e-10,0,.00349201,.983582,260083e-10,0,.0066242,.979186,337927e-10,0,.0109113,.97325,454689e-10,0,.0164064,.965221,573759e-10,0,.0231463,.957262,544114e-10,0,.0311571,.952211,587006e-10,0,.0404572,.946631,692256e-10,0,.0510592,.939391,787819e-10,0,.0629723,.929795,792368e-10,0,.0762025,.91965,875075e-10,0,.090753,.907737,950903e-10,0,.106626,.893899,972963e-10,0,.123822,.880239,10459e-8,0,.142337,.866562,107689e-9,0,.16217,.85164,113081e-9,0,.183314,.835021,116636e-9,0,.20576,.817311,120074e-9,0,.229496,.798845,121921e-9,0,.254502,.780479,12475e-8,0,.280753,.760694,125255e-9,0,.308212,.740142,126719e-9,0,.336825,.719248,12636e-8,0,.366517,.698209,126712e-9,0,.397167,.676398,125769e-9,0,.428578,.654378,124432e-9,0,.460318,.632484,123272e-9,0,.492064,.610113,12085e-8,0,.52381,.587931,118411e-9,0,.555556,.565872,11569e-8,0,.587302,.543814,112521e-9,0,.619048,.522265,109737e-9,0,.650794,.500835,106228e-9,0,.68254,.479818,102591e-9,0,.714286,.459258,991288e-10,0,.746032,.439061,952325e-10,0,.777778,.419552,91895e-9,0,.809524,.400399,879051e-10,0,.84127,.381976,844775e-10,0,.873016,.364009,806316e-10,0,.904762,.346761,771848e-10,0,.936508,.330049,735429e-10,0,.968254,.314018,702103e-10,0,1,1,139968e-12,0,0,1,139979e-12,0,0,1,140145e-12,0,0,1,14087e-11,0,0,.999999,142865e-12,0,0,.999998,147279e-12,0,0,.999997,156057e-12,0,0,.999992,17276e-11,0,0,.999989,204352e-12,0,0,.99998,26494e-11,0,0,.999969,383435e-12,0,0,.999953,618641e-12,0,0,.999929,108755e-11,0,0,.999898,201497e-11,0,0,.999849,381346e-11,0,0,.999778,719815e-11,0,0,.999661,133215e-10,0,0,.999451,238313e-10,0,0,.998936,401343e-10,0,113724e-9,.99662,517346e-10,0,820171e-9,.991094,304323e-10,0,.00238143,.987487,281757e-10,0,.00493527,.983731,320048e-10,0,.00856859,.979647,423905e-10,0,.0133393,.973837,562935e-10,0,.0192863,.96584,677442e-10,0,.0264369,.956309,623073e-10,0,.03481,.951523,704131e-10,0,.0444184,.946003,836594e-10,0,.0552713,.938454,911736e-10,0,.0673749,.929279,938264e-10,0,.0807329,.919239,103754e-9,0,.0953479,.907293,109928e-9,0,.111221,.893936,115257e-9,0,.128352,.879674,122265e-9,0,.14674,.865668,125733e-9,0,.166382,.850998,132305e-9,0,.187276,.834498,134844e-9,0,.209413,.816903,139276e-9,0,.232786,.798235,140984e-9,0,.257382,.779724,14378e-8,0,.283181,.760251,144623e-9,0,.310156,.739808,145228e-9,0,.338269,.718762,14539e-8,0,.367461,.697815,144432e-9,0,.397646,.67631,143893e-9,0,.428685,.654278,141846e-9,0,.460318,.632347,13935e-8,0,.492064,.610296,137138e-9,0,.52381,.588039,133806e-9,0,.555556,.566218,130755e-9,0,.587302,.544346,127128e-9,0,.619048,.522701,123002e-9,0,.650794,.501542,119443e-9,0,.68254,.480508,115055e-9,0,.714286,.460092,111032e-9,0,.746032,.440021,106635e-9,0,.777778,.420446,102162e-9,0,.809524,.401512,98184e-9,0,.84127,.38299,936497e-10,0,.873016,.365232,89813e-9,0,.904762,.347865,853073e-10,0,.936508,.331342,817068e-10,0,.968254,.315202,773818e-10,0,1,1,29368e-11,0,0,1,2937e-10,0,0,1,293998e-12,0,0,1,295298e-12,0,0,.999999,298865e-12,0,0,.999998,3067e-10,0,0,.999995,322082e-12,0,0,.999992,350767e-12,0,0,.999986,403538e-12,0,0,.999976,501372e-12,0,0,.999964,68562e-11,0,0,.999945,10374e-10,0,0,.999919,171269e-11,0,0,.999882,300175e-11,0,0,.999829,542144e-11,0,0,.999749,984182e-11,0,0,.99962,176213e-10,0,0,.999382,305995e-10,0,138418e-10,.998751,496686e-10,0,389844e-9,.995344,510733e-10,0,.00150343,.990768,345829e-10,0,.00352451,.987464,342841e-10,0,.00655379,.983846,399072e-10,0,.0106554,.980007,533219e-10,0,.0158723,.974494,696992e-10,0,.0222333,.96622,776754e-10,0,.029758,.956273,747718e-10,0,.0384596,.950952,864611e-10,0,.0483473,.945215,100464e-9,0,.0594266,.937287,103729e-9,0,.0717019,.928649,111665e-9,0,.0851752,.918791,12353e-8,0,.0998479,.906685,127115e-9,0,.115721,.893706,13628e-8,0,.132794,.879248,142427e-9,0,.151067,.864685,148091e-9,0,.170538,.850032,153517e-9,0,.191204,.833853,157322e-9,0,.213063,.816353,161086e-9,0,.236107,.797834,164111e-9,0,.260329,.778831,165446e-9,0,.285714,.759756,167492e-9,0,.312243,.739419,166928e-9,0,.339887,.718491,167e-6,0,.368604,.697392,165674e-9,0,.398329,.676102,163815e-9,0,.428961,.654243,162003e-9,0,.460331,.632176,158831e-9,0,.492064,.610407,155463e-9,0,.52381,.588394,152062e-9,0,.555556,.56645,147665e-9,0,.587302,.5449,14375e-8,0,.619048,.523276,138905e-9,0,.650794,.502179,134189e-9,0,.68254,.481359,129392e-9,0,.714286,.46092,124556e-9,0,.746032,.441084,11957e-8,0,.777778,.421517,114652e-9,0,.809524,.402721,109688e-9,0,.84127,.384222,104667e-9,0,.873016,.366534,999633e-10,0,.904762,.349205,950177e-10,0,.936508,.332702,907301e-10,0,.968254,.316599,859769e-10,0,1,1,585473e-12,0,0,1,585507e-12,0,0,1,58602e-11,0,0,.999999,588259e-12,0,0,.999999,594381e-12,0,0,.999998,607754e-12,0,0,.999995,633729e-12,0,0,.99999,68137e-11,0,0,.999984,767003e-12,0,0,.999973,921212e-12,0,0,.999959,120218e-11,0,0,.999936,172024e-11,0,0,.999907,268088e-11,0,0,.999866,445512e-11,0,0,.999806,768481e-11,0,0,.999716,1342e-8,0,0,.999576,232473e-10,0,0,.9993,391694e-10,0,129917e-9,.998498,608429e-10,0,845035e-9,.994132,489743e-10,0,.00237616,.99031,384644e-10,0,.00484456,.987409,421768e-10,0,.00832472,.983981,504854e-10,0,.0128643,.980268,671028e-10,0,.0184947,.974875,852749e-10,0,.025237,.966063,85531e-9,0,.0331046,.956779,900588e-10,0,.0421067,.950259,10577e-8,0,.0522487,.944239,119458e-9,0,.0635343,.936341,122164e-9,0,.0759654,.928047,134929e-9,0,.0895434,.918065,145544e-9,0,.104269,.906267,150531e-9,0,.120142,.893419,161652e-9,0,.137163,.878758,16593e-8,0,.15533,.863699,174014e-9,0,.174645,.848876,177877e-9,0,.195106,.833032,184049e-9,0,.21671,.815557,186088e-9,0,.239454,.797323,19054e-8,0,.263332,.778124,191765e-9,0,.288336,.758929,192535e-9,0,.314451,.738979,192688e-9,0,.341658,.718213,191522e-9,0,.369924,.696947,190491e-9,0,.399202,.675807,187913e-9,0,.429416,.654147,184451e-9,0,.460447,.63229,181442e-9,0,.492064,.610499,177139e-9,0,.523809,.588747,172596e-9,0,.555555,.566783,167457e-9,0,.587301,.545359,162518e-9,0,.619048,.523984,156818e-9,0,.650794,.502917,151884e-9,0,.68254,.482294,145514e-9,0,.714286,.461945,140199e-9,0,.746032,.442133,134101e-9,0,.777778,.422705,128374e-9,0,.809524,.403916,122996e-9,0,.84127,.38554,116808e-9,0,.873016,.367909,111973e-9,0,.904762,.350651,105938e-9,0,.936508,.334208,101355e-9,0,.968254,.318123,957629e-10,0,1,1,111633e-11,0,0,1,111639e-11,0,0,1,111725e-11,0,0,1,112096e-11,0,0,.999999,11311e-10,0,0,.999997,115315e-11,0,0,.999995,11956e-10,0,0,.999989,127239e-11,0,0,.999981,140772e-11,0,0,.999969,164541e-11,0,0,.999952,206607e-11,0,0,.999928,281783e-11,0,0,.999895,416835e-11,0,0,.999848,658728e-11,0,0,.999781,108648e-10,0,0,.999682,182579e-10,0,0,.999523,306003e-10,0,159122e-10,.999205,499862e-10,0,391184e-9,.998131,73306e-9,0,.00147534,.993334,513229e-10,0,.0034227,.99016,467783e-10,0,.00632232,.987321,523413e-10,0,.0102295,.984099,64267e-9,0,.0151794,.980432,843042e-10,0,.0211947,.974976,102819e-9,0,.0282899,.966429,996234e-10,0,.0364739,.957633,111074e-9,0,.0457522,.949422,128644e-9,0,.0561278,.943045,140076e-9,0,.0676023,.935448,146349e-9,0,.0801762,.927225,161854e-9,0,.0938499,.917033,169135e-9,0,.108623,.905762,179987e-9,0,.124496,.892879,189832e-9,0,.141469,.878435,195881e-9,0,.159541,.863114,20466e-8,0,.178713,.84776,209473e-9,0,.198985,.832084,214861e-9,0,.220355,.814915,217695e-9,0,.242823,.796711,220313e-9,0,.266385,.777603,22313e-8,0,.291036,.757991,222471e-9,0,.316767,.738371,222869e-9,0,.343563,.717872,221243e-9,0,.371402,.696619,218089e-9,0,.400248,.675379,21562e-8,0,.430047,.65411,21169e-8,0,.460709,.63241,206947e-9,0,.492079,.61046,201709e-9,0,.52381,.58903,196753e-9,0,.555556,.567267,189637e-9,0,.587302,.545886,184735e-9,0,.619048,.524714,177257e-9,0,.650794,.503789,171424e-9,0,.68254,.483204,164688e-9,0,.714286,.462976,157172e-9,0,.746032,.443294,151341e-9,0,.777778,.423988,143737e-9,0,.809524,.405325,138098e-9,0,.84127,.386981,130698e-9,0,.873016,.369436,125276e-9,0,.904762,.35219,118349e-9,0,.936508,.335804,11312e-8,0,.968254,.319749,106687e-9,0,1,1,204685e-11,0,0,1,204694e-11,0,0,1,204831e-11,0,0,.999999,205428e-11,0,0,.999999,207056e-11,0,0,.999997,210581e-11,0,0,.999993,21732e-10,0,0,.999987,229365e-11,0,0,.999979,250243e-11,0,0,.999965,286127e-11,0,0,.999947,348028e-11,0,0,.999918,455588e-11,0,0,.999881,643303e-11,0,0,.999828,970064e-11,0,0,.999753,153233e-10,0,0,.999642,24793e-9,0,0,.999464,402032e-10,0,122947e-9,.999089,635852e-10,0,807414e-9,.997567,857026e-10,0,.00227206,.992903,594912e-10,0,.00462812,.990011,578515e-10,0,.00794162,.987192,65399e-9,0,.0122534,.98418,819675e-10,0,.0175888,.980491,105514e-9,0,.0239635,.974779,121532e-9,0,.031387,.96675,119144e-9,0,.0398644,.958248,136125e-9,0,.0493982,.948884,155408e-9,0,.0599896,.941673,162281e-9,0,.0716382,.934521,176754e-9,0,.0843437,.926205,192873e-9,0,.0981056,.916089,200038e-9,0,.112923,.904963,213624e-9,0,.128796,.892089,221834e-9,0,.145725,.878028,232619e-9,0,.163709,.86249,238632e-9,0,.182749,.846587,247002e-9,0,.202847,.830988,250702e-9,0,.224001,.814165,255562e-9,0,.246214,.796135,257505e-9,0,.269482,.777052,258625e-9,0,.293805,.757201,258398e-9,0,.319176,.737655,256714e-9,0,.345587,.717477,255187e-9,0,.373021,.696433,251792e-9,0,.401454,.675084,247223e-9,0,.430844,.653907,242213e-9,0,.461125,.632561,237397e-9,0,.492187,.610658,229313e-9,0,.52381,.589322,224402e-9,0,.555556,.567857,216116e-9,0,.587302,.54652,209124e-9,0,.619048,.525433,201601e-9,0,.650794,.504679,192957e-9,0,.68254,.484203,186052e-9,0,.714286,.464203,177672e-9,0,.746032,.444549,170005e-9,0,.777778,.425346,162401e-9,0,.809524,.406706,1544e-7,0,.84127,.388576,147437e-9,0,.873016,.37094,139493e-9,0,.904762,.353996,133219e-9,0,.936508,.337391,125573e-9,0,.968254,.321648,119867e-9,0,1,1,362511e-11,0,0,1,362525e-11,0,0,1,362739e-11,0,0,.999999,363673e-11,0,0,.999998,366214e-11,0,0,.999996,371698e-11,0,0,.999992,382116e-11,0,0,.999986,400554e-11,0,0,.999976,432058e-11,0,0,.999961,485194e-11,0,0,.999938,574808e-11,0,0,.999908,726643e-11,0,0,.999865,984707e-11,0,0,.999807,142217e-10,0,0,.999723,215581e-10,0,0,.999602,336114e-10,0,119113e-10,.999398,527353e-10,0,355813e-9,.998946,805809e-10,0,.00137768,.996647,942908e-10,0,.00322469,.992298,668733e-10,0,.00597897,.989802,716564e-10,0,.00968903,.987019,821355e-10,0,.0143845,.984219,104555e-9,0,.0200831,.980425,131245e-9,0,.0267948,.974241,139613e-9,0,.034525,.967006,145931e-9,0,.0432757,.95893,167153e-9,0,.0530471,.949157,188146e-9,0,.0638386,.94062,194625e-9,0,.0756487,.933509,213721e-9,0,.0884762,.925088,229616e-9,0,.10232,.915178,239638e-9,0,.117178,.904093,254814e-9,0,.133051,.891337,263685e-9,0,.149939,.877326,274789e-9,0,.167841,.861794,280534e-9,0,.18676,.845758,289534e-9,0,.206696,.829792,294446e-9,0,.22765,.813037,296877e-9,0,.249625,.795285,300217e-9,0,.27262,.776323,299826e-9,0,.296636,.756673,299787e-9,0,.321671,.736856,297867e-9,0,.347718,.716883,294052e-9,0,.374768,.696089,289462e-9,0,.402804,.67505,285212e-9,0,.431796,.653509,27653e-8,0,.461695,.63258,271759e-9,0,.49242,.61104,262811e-9,0,.523822,.589567,255151e-9,0,.555556,.568322,246434e-9,0,.587302,.547235,237061e-9,0,.619048,.52616,228343e-9,0,.650794,.505716,219236e-9,0,.68254,.485274,209595e-9,0,.714286,.465411,201011e-9,0,.746032,.445854,19109e-8,0,.777778,.426911,182897e-9,0,.809524,.408222,173569e-9,0,.84127,.390307,165496e-9,0,.873016,.372624,156799e-9,0,.904762,.355804,14917e-8,0,.936508,.33924,140907e-9,0,.968254,.323534,134062e-9,0,1,1,622487e-11,0,0,1,62251e-10,0,0,1,622837e-11,0,0,.999999,624259e-11,0,0,.999998,628127e-11,0,0,.999996,636451e-11,0,0,.999991,65218e-10,0,0,.999984,679782e-11,0,0,.999973,726361e-11,0,0,.999955,803644e-11,0,0,.999931,931397e-11,0,0,.999896,114299e-10,0,0,.999847,149402e-10,0,0,.999784,207461e-10,0,0,.999692,302493e-10,0,0,.999554,454957e-10,0,997275e-10,.999326,690762e-10,0,724813e-9,.998757,101605e-9,0,.0020972,.995367,958745e-10,0,.00432324,.99209,832808e-10,0,.00746347,.989517,887601e-10,0,.0115534,.987008,10564e-8,0,.0166134,.98421,133179e-9,0,.0226552,.98021,161746e-9,0,.0296838,.973676,161821e-9,0,.0377016,.967052,178635e-9,0,.0467079,.959385,206765e-9,0,.0567013,.949461,22476e-8,0,.0676796,.939578,23574e-8,0,.0796403,.932416,25893e-8,0,.0925812,.923759,271228e-9,0,.106501,.914223,289165e-9,0,.121397,.902942,301156e-9,0,.13727,.890419,313852e-9,0,.15412,.876639,324408e-9,0,.171946,.861316,33249e-8,0,.190751,.84496,338497e-9,0,.210537,.828427,345861e-9,0,.231305,.811871,347863e-9,0,.253057,.794397,350225e-9,0,.275797,.775726,349915e-9,0,.299525,.75617,347297e-9,0,.324242,.736091,344232e-9,0,.349947,.716213,340835e-9,0,.376633,.695736,332369e-9,0,.404289,.674961,327943e-9,0,.432895,.653518,318533e-9,0,.462415,.632574,310391e-9,0,.492788,.61134,300755e-9,0,.523909,.590017,290506e-9,0,.555556,.568752,280446e-9,0,.587302,.548061,269902e-9,0,.619048,.52711,258815e-9,0,.650794,.506682,248481e-9,0,.68254,.486524,237141e-9,0,.714286,.466812,226872e-9,0,.746032,.44732,216037e-9,0,.777778,.428473,205629e-9,0,.809524,.409921,195691e-9,0,.84127,.392028,185457e-9,0,.873016,.374606,176436e-9,0,.904762,.357601,166508e-9,0,.936508,.341348,158385e-9,0,.968254,.32542,149203e-9,0,1,1,103967e-10,0,0,1,10397e-9,0,0,1,104019e-10,0,0,.999999,104231e-10,0,0,.999998,104806e-10,0,0,.999995,106042e-10,0,0,.999991,108366e-10,0,0,.999982,112415e-10,0,0,.999968,119174e-10,0,0,.99995,130227e-10,0,0,.999922,148176e-10,0,0,.999884,177303e-10,0,0,.99983,224564e-10,0,0,.999758,300966e-10,0,0,.999654,423193e-10,0,549083e-11,.999503,614848e-10,0,296087e-9,.999237,903576e-10,0,.00123144,.998491,1271e-7,0,.00295954,.994594,107754e-9,0,.00555829,.99178,103025e-9,0,.00907209,.989265,11154e-8,0,.0135257,.986998,136296e-9,0,.0189327,.984137,169154e-9,0,.0252993,.979798,196671e-9,0,.0326272,.97337,196678e-9,0,.0409157,.967239,223121e-9,0,.0501623,.959543,253809e-9,0,.0603638,.949466,265972e-9,0,.0715171,.939074,288372e-9,0,.0836187,.931118,310983e-9,0,.0966657,.922525,325561e-9,0,.110656,.912983,345725e-9,0,.125588,.901617,3556e-7,0,.141461,.889487,374012e-9,0,.158275,.875787,383445e-9,0,.176031,.860654,393972e-9,0,.19473,.844417,400311e-9,0,.214374,.82741,405004e-9,0,.234967,.810545,407378e-9,0,.256512,.793312,407351e-9,0,.279011,.774847,406563e-9,0,.302468,.755621,404903e-9,0,.326887,.735511,397486e-9,0,.352266,.715435,39357e-8,0,.378605,.695403,384739e-9,0,.405897,.674681,376108e-9,0,.43413,.65359,365997e-9,0,.463277,.632471,354957e-9,0,.493295,.61151,343593e-9,0,.524106,.59064,331841e-9,0,.555561,.569386,318891e-9,0,.587302,.548785,3072e-7,0,.619048,.528146,29361e-8,0,.650794,.507872,281709e-9,0,.68254,.487805,268627e-9,0,.714286,.468196,255887e-9,0,.746032,.448922,243997e-9,0,.777778,.430093,231662e-9,0,.809524,.411845,220339e-9,0,.84127,.393808,208694e-9,0,.873016,.376615,198045e-9,0,.904762,.359655,187375e-9,0,.936508,.343452,177371e-9,0,.968254,.32765,167525e-9,0,1,1,169351e-10,0,0,1,169356e-10,0,0,1,169427e-10,0,0,.999999,169736e-10,0,0,.999998,170575e-10,0,0,.999995,172372e-10,0,0,.99999,175739e-10,0,0,.999979,181568e-10,0,0,.999966,191206e-10,0,0,.999944,20677e-9,0,0,.999912,231644e-10,0,0,.999869,271268e-10,0,0,.999811,334272e-10,0,0,.99973,433979e-10,0,0,.999617,590083e-10,0,680315e-10,.999445,829497e-10,0,612796e-9,.999138,118019e-9,0,.00187408,.998095,156712e-9,0,.00395791,.993919,125054e-9,0,.00692144,.991333,126091e-9,0,.0107962,.989226,144912e-9,0,.0155986,.986954,175737e-9,0,.0213364,.983982,213883e-9,0,.0280114,.979128,234526e-9,0,.0356226,.973327,243725e-9,0,.0441668,.967416,2773e-7,0,.0536399,.959729,308799e-9,0,.0640376,.949758,322447e-9,0,.0753554,.939173,350021e-9,0,.0875893,.9296,370089e-9,0,.100736,.921181,391365e-9,0,.114793,.91164,413636e-9,0,.129759,.900435,427068e-9,0,.145632,.888183,441046e-9,0,.162412,.874772,454968e-9,0,.180101,.859566,461882e-9,0,.1987,.843579,471556e-9,0,.218213,.826453,474335e-9,0,.238641,.809164,477078e-9,0,.259989,.792179,47755e-8,0,.282262,.773866,472573e-9,0,.305464,.754944,469765e-9,0,.329599,.735133,462371e-9,0,.35467,.714858,453674e-9,0,.380678,.694829,443888e-9,0,.407622,.674453,432052e-9,0,.435493,.653685,420315e-9,0,.464275,.632666,406829e-9,0,.493938,.611676,392234e-9,0,.524422,.591193,379208e-9,0,.555624,.570145,36319e-8,0,.587302,.549566,349111e-9,0,.619048,.529278,334166e-9,0,.650794,.509026,318456e-9,0,.68254,.489186,30449e-8,0,.714286,.469662,289051e-9,0,.746032,.450691,275494e-9,0,.777778,.431841,261437e-9,0,.809524,.413752,247846e-9,0,.84127,.395951,235085e-9,0,.873016,.378633,222245e-9,0,.904762,.36194,210533e-9,0,.936508,.345599,198494e-9,0,.968254,.329999,188133e-9,0,1,1,269663e-10,0,0,1,26967e-9,0,0,1,269772e-10,0,0,.999999,270214e-10,0,0,.999998,271415e-10,0,0,.999994,27398e-9,0,0,.999988,278771e-10,0,0,.999977,287019e-10,0,0,.999961,300544e-10,0,0,.999937,322138e-10,0,0,.999904,356163e-10,0,0,.999854,409465e-10,0,0,.99979,492651e-10,0,0,.999699,621722e-10,0,88288e-11,.999572,819715e-10,0,223369e-9,.999381,111689e-9,0,.00105414,.999016,153862e-9,0,.0026493,.997437,187667e-9,0,.00508608,.993545,155672e-9,0,.00840554,.991135,161455e-9,0,.012629,.989157,188241e-9,0,.0177661,.986874,226229e-9,0,.0238198,.983714,268668e-9,0,.0307887,.978301,277109e-9,0,.0386688,.973227,303446e-9,0,.0474554,.967317,341851e-9,0,.0571428,.959477,370885e-9,0,.0677256,.950012,392753e-9,0,.0791988,.939484,42781e-8,0,.0915576,.928135,443866e-9,0,.104798,.919819,472959e-9,0,.118918,.910049,491551e-9,0,.133915,.899181,512616e-9,0,.149788,.886881,523563e-9,0,.166537,.87359,540183e-9,0,.184164,.858613,547386e-9,0,.202669,.842809,554809e-9,0,.222056,.825727,558316e-9,0,.242329,.808086,557824e-9,0,.263492,.790728,556346e-9,0,.285551,.772987,552672e-9,0,.30851,.7541,543738e-9,0,.332376,.734669,536107e-9,0,.357153,.714411,523342e-9,0,.382845,.694196,512238e-9,0,.409454,.674252,497465e-9,0,.436977,.65357,481096e-9,0,.465404,.632999,467054e-9,0,.494713,.611994,448771e-9,0,.524864,.591604,431889e-9,0,.555779,.571134,415238e-9,0,.587302,.550528,396369e-9,0,.619048,.530292,379477e-9,0,.650794,.510364,361488e-9,0,.68254,.490749,343787e-9,0,.714286,.471266,327822e-9,0,.746032,.452462,310626e-9,0,.777778,.433907,295352e-9,0,.809524,.415659,279179e-9,0,.84127,.398138,264685e-9,0,.873016,.380833,249905e-9,0,.904762,.364247,236282e-9,0,.936508,.348041,222905e-9,0,.968254,.332389,210522e-9,0,1,1,420604e-10,0,0,1,420614e-10,0,0,1,420757e-10,0,0,.999999,42138e-9,0,0,.999997,423067e-10,0,0,.999993,426668e-10,0,0,.999986,433372e-10,0,0,.999974,444857e-10,0,0,.999956,463554e-10,0,0,.99993,493105e-10,0,0,.999892,539077e-10,0,0,.999838,610005e-10,0,0,.999767,718822e-10,0,0,.999666,884581e-10,0,365471e-10,.999525,113398e-9,0,485623e-9,.999311,150043e-9,0,.00162096,.998865,200063e-9,0,.00355319,.996278,211014e-9,0,.00633818,.992956,189672e-9,0,.0100043,.991017,210262e-9,0,.0145648,.989055,244292e-9,0,.0200237,.986741,290481e-9,0,.0263798,.983288,334303e-9,0,.033629,.977784,340307e-9,0,.0417652,.973037,377864e-9,0,.0507821,.967181,4239e-7,0,.060673,.958971,443854e-9,0,.0714314,.950093,483039e-9,0,.0830518,.939552,517934e-9,0,.0955288,.927678,539449e-9,0,.108859,.918278,568604e-9,0,.123038,.908449,588505e-9,0,.138065,.897713,612473e-9,0,.153938,.885533,625575e-9,0,.170657,.872131,63854e-8,0,.188224,.857517,647034e-9,0,.20664,.841796,65209e-8,0,.225909,.824726,6544e-7,0,.246035,.807297,655744e-9,0,.267022,.789058,646716e-9,0,.288878,.77189,643898e-9,0,.311607,.753082,629973e-9,0,.335216,.7341,621564e-9,0,.359713,.714094,605171e-9,0,.385103,.693839,588752e-9,0,.41139,.673891,573294e-9,0,.438576,.653565,552682e-9,0,.466656,.633326,533446e-9,0,.495617,.612582,514635e-9,0,.525431,.59205,49303e-8,0,.556041,.571918,471842e-9,0,.587338,.551572,451713e-9,0,.619048,.531553,430049e-9,0,.650794,.51175,410445e-9,0,.68254,.49238,390098e-9,0,.714286,.473143,370033e-9,0,.746032,.45423,351205e-9,0,.777778,.435963,332049e-9,0,.809524,.41787,315021e-9,0,.84127,.400387,297315e-9,0,.873016,.383332,281385e-9,0,.904762,.366665,265397e-9,0,.936508,.350633,250601e-9,0,.968254,.334964,23589e-8,0,1,1,643736e-10,0,0,1,64375e-9,0,0,1,643947e-10,0,0,.999999,64481e-9,0,0,.999997,647143e-10,0,0,.999994,652119e-10,0,0,.999985,661359e-10,0,0,.999972,677116e-10,0,0,.999952,702599e-10,0,0,.999922,742517e-10,0,0,.99988,803906e-10,0,0,.99982,897315e-10,0,0,.999741,103838e-9,0,0,.999629,12496e-8,0,149024e-9,.999474,156161e-9,0,861027e-9,.999229,201034e-9,0,.00231198,.998662,259069e-9,0,.00458147,.995299,245439e-9,0,.00770895,.992732,24498e-8,0,.0117126,.990847,273211e-9,0,.0165989,.988911,316492e-9,0,.0223674,.98654,37161e-8,0,.0290135,.982636,410352e-9,0,.0365309,.977346,421756e-9,0,.0449117,.972909,475578e-9,0,.0541481,.966821,522482e-9,0,.0642326,.958686,545008e-9,0,.075158,.949754,589286e-9,0,.0869181,.939184,619995e-9,0,.0995074,.927505,654266e-9,0,.112922,.916606,682362e-9,0,.127157,.906707,704286e-9,0,.142212,.895937,725909e-9,0,.158085,.883913,743939e-9,0,.174776,.870642,755157e-9,0,.192287,.856241,764387e-9,0,.210619,.84069,771032e-9,0,.229775,.823728,765906e-9,0,.249761,.806481,767604e-9,0,.270582,.787924,754385e-9,0,.292243,.770588,749668e-9,0,.314753,.751991,731613e-9,0,.338118,.733407,717655e-9,0,.362347,.713688,700604e-9,0,.387447,.693595,678765e-9,0,.413424,.673426,657042e-9,0,.440284,.65359,635892e-9,0,.468027,.633576,611569e-9,0,.496645,.613144,586011e-9,0,.526122,.592711,563111e-9,0,.556417,.572722,537699e-9,0,.587451,.552762,512556e-9,0,.619048,.532985,489757e-9,0,.650794,.513219,464139e-9,0,.68254,.493992,442193e-9,0,.714286,.47509,418629e-9,0,.746032,.456287,397045e-9,0,.777778,.438152,375504e-9,0,.809524,.420294,35492e-8,0,.84127,.402749,335327e-9,0,.873016,.385879,316422e-9,0,.904762,.369352,298333e-9,0,.936508,.353301,281417e-9,0,.968254,.337781,265203e-9,0,1,1,968267e-10,0,0,1,968284e-10,0,0,1,968556e-10,0,0,.999999,969733e-10,0,0,.999997,972913e-10,0,0,.999993,979688e-10,0,0,.999984,992239e-10,0,0,.999969,101356e-9,0,0,.999946,104784e-9,0,0,.999913,110111e-9,0,0,.999868,118217e-9,0,0,.999801,130396e-9,0,0,.999712,148523e-9,0,124907e-10,.999589,175233e-9,0,355405e-9,.999416,213999e-9,0,.0013528,.999136,268529e-9,0,.00312557,.998367,333088e-9,0,.00573045,.994701,304757e-9,0,.00919397,.992497,318031e-9,0,.0135261,.990608,353863e-9,0,.0187278,.988715,409044e-9,0,.0247947,.986241,472967e-9,0,.0317196,.981696,495104e-9,0,.039494,.977097,532873e-9,0,.0481087,.972583,594447e-9,0,.0575549,.966142,636867e-9,0,.0678242,.95823,669899e-9,0,.0789089,.949677,719499e-9,0,.0908023,.939226,750584e-9,0,.103499,.927501,793183e-9,0,.116993,.915199,81995e-8,0,.131282,.90498,847654e-9,0,.146364,.894243,868929e-9,0,.162237,.882154,884278e-9,0,.178902,.869161,898108e-9,0,.196358,.854751,901254e-9,0,.21461,.839368,90679e-8,0,.23366,.822874,901541e-9,0,.253512,.805514,897297e-9,0,.274174,.78716,881856e-9,0,.29565,.769061,870032e-9,0,.31795,.751,851719e-9,0,.341081,.732614,830671e-9,0,.365053,.713171,806569e-9,0,.389874,.693472,78338e-8,0,.415553,.673528,756404e-9,0,.442098,.653397,726872e-9,0,.469512,.633781,700494e-9,0,.497794,.613877,67105e-8,0,.526935,.593506,640361e-9,0,.556908,.573667,613502e-9,0,.587657,.553932,583177e-9,0,.61906,.534345,554375e-9,0,.650794,.515042,527811e-9,0,.68254,.495674,499367e-9,0,.714286,.477132,47429e-8,0,.746032,.458609,447726e-9,0,.777778,.440354,424205e-9,0,.809524,.422765,399549e-9,0,.84127,.405472,378315e-9,0,.873016,.388482,355327e-9,0,.904762,.372191,336122e-9,0,.936508,.356099,315247e-9,0,.968254,.340737,29794e-8,0,1,1,143327e-9,0,0,1,14333e-8,0,0,1,143366e-9,0,0,.999999,143524e-9,0,0,.999996,143952e-9,0,0,.999991,144862e-9,0,0,.999981,146544e-9,0,0,.999966,149391e-9,0,0,.999941,153946e-9,0,0,.999905,160971e-9,0,0,.999852,171562e-9,0,0,.99978,18729e-8,0,0,.999681,210386e-9,0,826239e-10,.999546,243906e-9,0,664807e-9,.999352,291739e-9,0,.00196192,.999027,357419e-9,0,.00405941,.997886,422349e-9,0,.00699664,.99419,385008e-9,0,.0107896,.99214,409775e-9,0,.0154415,.990274,456418e-9,0,.0209488,.988455,527008e-9,0,.0273037,.985804,597685e-9,0,.0344969,.98103,613124e-9,0,.0425183,.976674,668321e-9,0,.0513575,.972021,736985e-9,0,.0610046,.965274,773789e-9,0,.0714508,.958046,830852e-9,0,.0826877,.949333,875766e-9,0,.0947085,.939135,917088e-9,0,.107507,.927119,952244e-9,0,.121078,.91469,990626e-9,0,.135419,.903006,.00101304,0,.150526,.892368,.00103834,0,.166399,.880231,.00105002,0,.183038,.867432,.00106331,0,.200443,.853208,.00106783,0,.218618,.837956,.00106458,0,.237566,.821772,.00105945,0,.257291,.804328,.00104685,0,.2778,.786465,.00103178,0,.2991,.768004,.00101077,0,.321199,.74972,985504e-9,0,.344106,.731682,962893e-9,0,.36783,.712813,932146e-9,0,.392383,.693139,89871e-8,0,.417774,.673566,869678e-9,0,.444013,.653483,835525e-9,0,.471107,.633891,799853e-9,0,.49906,.614433,766838e-9,0,.527869,.594586,732227e-9,0,.557517,.574769,696442e-9,0,.587966,.555149,663935e-9,0,.61913,.535898,629826e-9,0,.650794,.516753,596486e-9,0,.68254,.497816,567078e-9,0,.714286,.479034,534399e-9,0,.746032,.460975,507013e-9,0,.777778,.442935,477421e-9,0,.809524,.425263,451101e-9,0,.84127,.408248,424964e-9,0,.873016,.391339,39993e-8,0,.904762,.37513,377619e-9,0,.936508,.359172,354418e-9,0,.968254,.343876,334823e-9,0,1,1,209042e-9,0,0,1,209045e-9,0,0,1,209093e-9,0,0,.999999,209304e-9,0,0,.999996,209871e-9,0,0,.999991,211078e-9,0,0,.999979,213304e-9,0,0,.999963,217061e-9,0,0,.999933,223042e-9,0,0,.999894,232206e-9,0,0,.999837,245901e-9,0,0,.999756,266023e-9,0,102927e-11,.999648,295204e-9,0,233468e-9,.999499,336958e-9,0,.00108237,.999283,395563e-9,0,.00268832,.998896,473785e-9,0,.00511138,.997006,520008e-9,0,.00837705,.993819,497261e-9,0,.0124928,.991632,523722e-9,0,.0174561,.989875,587258e-9,0,.0232596,.988109,676329e-9,0,.0298932,.985155,747701e-9,0,.0373453,.980479,768803e-9,0,.0456045,.976271,841054e-9,0,.0546593,.971347,911469e-9,0,.0644994,.964528,953057e-9,0,.0751152,.957632,.00102221,0,.0864981,.948681,.00106122,0,.0986407,.938716,.00111857,0,.111537,.926629,.00114762,0,.125182,.914025,.00118995,0,.139571,.901026,.00121228,0,.154703,.890358,.00123946,0,.170576,.878283,.0012527,0,.18719,.865459,.00125536,0,.204547,.851407,.00126134,0,.222648,.836276,.00124759,0,.241498,.820436,.00124443,0,.261101,.803253,.00122071,0,.281465,.785562,.00120107,0,.302595,.76718,.00117762,0,.324501,.748551,.00114289,0,.347192,.730564,.00110872,0,.370679,.712253,.00107636,0,.394973,.692867,.00103646,0,.420085,.673695,996793e-9,0,.446027,.653912,95675e-8,0,.47281,.634129,916739e-9,0,.500441,.615004,874401e-9,0,.528921,.595587,833411e-9,0,.558244,.575965,794556e-9,0,.588384,.5566,75196e-8,0,.619281,.537428,716381e-9,0,.650795,.518623,676558e-9,0,.68254,.499964,64074e-8,0,.714286,.481356,605984e-9,0,.746032,.463279,570256e-9,0,.777778,.445673,540138e-9,0,.809524,.428032,507299e-9,0,.84127,.411112,479553e-9,0,.873016,.394444,450737e-9,0,.904762,.378247,424269e-9,0,.936508,.362415,399111e-9,0,.968254,.347103,375274e-9,0,1,1,300729e-9,0,0,1,300733e-9,0,0,1,300797e-9,0,0,.999998,301072e-9,0,0,.999996,301817e-9,0,0,.999989,303398e-9,0,0,.999977,306309e-9,0,0,.999958,311209e-9,0,0,.999927,318975e-9,0,0,.999884,330804e-9,0,0,.99982,34834e-8,0,0,.999733,373854e-9,0,326995e-10,.999613,410424e-9,0,477174e-9,.999447,462047e-9,0,.00161099,.999204,533322e-9,0,.00353153,.998725,624964e-9,0,.00627965,.995871,631786e-9,0,.0098693,.993194,632017e-9,0,.0143011,.991541,68923e-8,0,.019568,.989773,766892e-9,0,.0256593,.987647,863668e-9,0,.0325625,.984193,922089e-9,0,.0402647,.980016,970749e-9,0,.0487532,.975859,.00106027,0,.058016,.970514,.00112239,0,.0680419,.963625,.00117212,0,.0788208,.956959,.00125211,0,.0903439,.947956,.00129411,0,.102604,.93809,.00135879,0,.115594,.92659,.00139309,0,.129309,.913829,.00143253,0,.143745,.90005,.00145809,0,.158901,.888129,.0014748,0,.174774,.87607,.00148756,0,.191365,.863461,.00148714,0,.208674,.849594,.00148892,0,.226705,.834531,.00146496,0,.245461,.81903,.0014579,0,.264947,.802122,.00143039,0,.28517,.78445,.00139717,0,.306137,.766434,.00136312,0,.327857,.747816,.00132597,0,.350341,.729519,.00128323,0,.373598,.711454,.00123803,0,.397642,.692699,.00119097,0,.422485,.673723,.00114565,0,.448139,.654386,.00109552,0,.474619,.634673,.00104553,0,.501933,.615554,99985e-8,0,.530089,.596462,948207e-9,0,.559087,.577385,902299e-9,0,.588913,.558257,856448e-9,0,.619525,.5392,810395e-9,0,.650826,.520543,768558e-9,0,.68254,.502206,7239e-7,0,.714286,.48402,685794e-9,0,.746032,.465779,64471e-8,0,.777778,.448455,609583e-9,0,.809524,.431091,57227e-8,0,.84127,.414147,54042e-8,0,.873016,.39765,506545e-9,0,.904762,.381576,477635e-9,0,.936508,.365881,448446e-9,0,.968254,.350582,421424e-9,0,1,1,427144e-9,0,0,1,427151e-9,0,0,1,427232e-9,0,0,.999998,42759e-8,0,0,.999995,428555e-9,0,0,.999988,430603e-9,0,0,.999976,434368e-9,0,0,.999952,440688e-9,0,0,.999919,450667e-9,0,0,.999871,46578e-8,0,0,.999801,488024e-9,0,0,.999704,520092e-9,0,129791e-9,.999572,565553e-9,0,821056e-9,.999389,628906e-9,0,.00225241,.999114,714911e-9,0,.00449109,.998488,819218e-9,0,.00756249,.995234,80415e-8,0,.0114716,.993021,830181e-9,0,.0162131,.991407,902645e-9,0,.021776,.989625,996934e-9,0,.0281471,.987064,.00109707,0,.0353118,.983265,.00114353,0,.0432562,.979535,.0012272,0,.0519665,.975224,.00132642,0,.0614298,.969574,.00138092,0,.0716348,.963021,.00145896,0,.0825709,.956046,.00152834,0,.094229,.947136,.00158217,0,.106602,.937313,.0016347,0,.119682,.926073,.00168383,0,.133465,.913121,.00171627,0,.147947,.899165,.00174229,0,.163125,.885891,.00176137,0,.178998,.873783,.00176406,0,.195566,.861331,.00176156,0,.21283,.847569,.00175346,0,.230793,.832785,.00172753,0,.249459,.817442,.00170204,0,.268832,.800613,.00166576,0,.28892,.783597,.00162909,0,.30973,.76571,.0015826,0,.331271,.747021,.00153106,0,.353554,.728593,.00148036,0,.37659,.710661,.00142808,0,.400391,.692426,.00136906,0,.424973,.673623,.00131066,0,.450347,.65494,.00125569,0,.476531,.635448,.00119517,0,.503535,.616221,.00113828,0,.531372,.597531,.0010816,0,.560047,.578795,.00102673,0,.589554,.559892,970985e-9,0,.619869,.541307,919773e-9,0,.650923,.522608,868479e-9,0,.68254,.504484,82137e-8,0,.714286,.486603,772916e-9,0,.746032,.468802,730353e-9,0,.777778,.451172,684955e-9,0,.809524,.434348,647565e-9,0,.84127,.417445,605863e-9,0,.873016,.401077,571885e-9,0,.904762,.385039,536034e-9,0,.936508,.369483,504227e-9,0,.968254,.354272,473165e-9,0,1,1,599525e-9,0,0,1,599533e-9,0,0,1,599639e-9,0,0,.999998,600097e-9,0,0,.999994,601336e-9,0,0,.999987,603958e-9,0,0,.999972,608775e-9,0,0,.999949,616842e-9,0,0,.999912,629534e-9,0,0,.999857,648658e-9,0,0,.999781,676615e-9,0,538873e-11,.999674,716574e-9,0,308602e-9,.999528,772641e-9,0,.00127003,.999326,849806e-9,0,.00300783,.999009,952682e-9,0,.00556637,.998112,.00106394,0,.00895889,.994496,.00102228,0,.0131827,.992806,.00108586,0,.0182277,.991211,.0011759,0,.0240795,.989415,.00128955,0,.030723,.986499,.00139038,0,.0381418,.982679,.00144539,0,.046321,.978839,.00153954,0,.0552459,.974295,.00164417,0,.0649034,.968784,.00171517,0,.0752814,.962324,.00180282,0,.0863693,.954956,.00186387,0,.0981578,.94624,.00193817,0,.110639,.936517,.00198156,0,.123806,.925186,.00203042,0,.137655,.91252,.0020664,0,.15218,.898441,.00207822,0,.16738,.884394,.0020992,0,.183253,.871273,.00208748,0,.199799,.859057,.00208686,0,.21702,.845243,.00205519,0,.234918,.830723,.00202868,0,.253496,.815801,.00199501,0,.272761,.79914,.00194193,0,.292719,.782372,.00188824,0,.313377,.76482,.00183695,0,.334745,.746586,.00177418,0,.356833,.7281,.00170628,0,.379654,.709842,.00164063,0,.403221,.692019,.00157355,0,.427548,.67364,.00150262,0,.452651,.655277,.00143473,0,.478545,.636438,.00136371,0,.505246,.617364,.00129911,0,.532768,.598603,.00123014,0,.561122,.580195,.00116587,0,.590309,.561786,.00110398,0,.620318,.543377,.00104148,0,.651102,.525093,983984e-9,0,.682545,.506791,92667e-8,0,.714286,.489291,874326e-9,0,.746032,.471811,821734e-9,0,.777778,.454435,774698e-9,0,.809524,.437493,727302e-9,0,.84127,.420977,684039e-9,0,.873016,.404729,64373e-8,0,.904762,.388756,60285e-8,0,.936508,.373344,56765e-8,0,.968254,.358191,531929e-9,0,1,1,832169e-9,0,0,1,832178e-9,0,0,1,83231e-8,0,0,.999998,832893e-9,0,0,.999995,834465e-9,0,0,.999985,837791e-9,0,0,.999969,843893e-9,0,0,.999944,854086e-9,0,0,.999903,870071e-9,0,0,.999843,894042e-9,0,0,.999759,928865e-9,0,531805e-10,.999643,978242e-9,0,579365e-9,.99948,.00104684,0,.00182774,.999255,.00114012,0,.00387804,.998885,.00126188,0,.00675709,.997405,.00135888,0,.010468,.99424,.00133626,0,.0150018,.992458,.00140905,0,.0203443,.990929,.00152305,0,.0264786,.989116,.00165882,0,.0333875,.985624,.00174128,0,.0410536,.982003,.00182108,0,.0494609,.978336,.00194498,0,.0585941,.973184,.00202708,0,.0684396,.9678,.00212166,0,.0789851,.961348,.00221366,0,.0902199,.953841,.00228219,0,.102134,.94534,.00235662,0,.114721,.935552,.00240572,0,.127972,.924064,.00244405,0,.141884,.911827,.00247557,0,.156451,.897731,.00248374,0,.171672,.883409,.00249863,0,.187545,.868625,.00246688,0,.20407,.856529,.00246523,0,.221249,.842999,.00242368,0,.239083,.828505,.00237354,0,.257578,.813825,.00232588,0,.276738,.797813,.00226731,0,.296569,.781097,.00219704,0,.31708,.764038,.00212394,0,.338281,.746067,.00204786,0,.360181,.727687,.00196728,0,.382794,.709571,.00188779,0,.406133,.691503,.00180532,0,.430213,.673673,.00171849,0,.45505,.655732,.00164147,0,.480662,.637399,.00155858,0,.507065,.618616,.00147641,0,.534278,.60005,.00140125,0,.562313,.581713,.00132441,0,.59118,.563546,.00125014,0,.620875,.545605,.00118249,0,.651373,.527559,.0011116,0,.682593,.509764,.00104979,0,.714286,.49193,985977e-9,0,.746032,.475011,928592e-9,0,.777778,.457878,873466e-9,0,.809524,.440979,819585e-9,0,.84127,.424613,772365e-9,0,.873016,.408549,722195e-9,0,.904762,.392771,680014e-9,0,.936508,.377317,636797e-9,0,.968254,.362352,598318e-9,0,1,1,.00114313,0,0,1,.00114314,0,0,.999999,.00114331,0,0,.999998,.00114404,0,0,.999994,.00114601,0,0,.999984,.00115019,0,0,.999967,.00115784,0,0,.999937,.0011706,0,0,.999894,.00119054,0,0,.999828,.00122031,0,0,.999735,.00126331,0,169263e-9,.999606,.00132382,0,949167e-9,.999426,.0014071,0,.00249668,.999173,.00151895,0,.00486392,.99873,.00166102,0,.00806323,.996243,.0017023,0,.0120895,.993779,.00172782,0,.0169288,.9919,.0018108,0,.0225633,.990524,.00196028,0,.028974,.98868,.00212014,0,.036142,.984663,.00217598,0,.044049,.981457,.00230563,0,.0526781,.977608,.00243966,0,.0620137,.972215,.00251336,0,.0720418,.966798,.0026285,0,.0827499,.960241,.00271409,0,.0941271,.952489,.00278381,0,.106164,.944127,.00285399,0,.118852,.934282,.00290994,0,.132185,.923271,.00294558,0,.146157,.910803,.00296269,0,.160766,.896705,.00296803,0,.176007,.88238,.00296637,0,.19188,.867116,.00293163,0,.208385,.853636,.00289418,0,.225523,.840469,.00284663,0,.243296,.82639,.00278594,0,.261709,.811759,.00271618,0,.280767,.796113,.00263187,0,.300476,.779518,.00254589,0,.320845,.763142,.00246003,0,.341883,.745464,.00236529,0,.363601,.727491,.00226536,0,.386011,.709414,.00216375,0,.409128,.691396,.00207127,0,.432967,.67368,.00197106,0,.457545,.656049,.00187022,0,.482881,.638188,.00177605,0,.508992,.620177,.00168482,0,.535899,.601506,.00158909,0,.563619,.58362,.00150583,0,.592165,.565496,.00141791,0,.621544,.54789,.00133693,0,.651743,.530323,.00126038,0,.682709,.512795,.00118556,0,.714286,.495199,.00111527,0,.746032,.478101,.0010489,0,.777778,.461511,984264e-9,0,.809524,.444879,92591e-8,0,.84127,.428424,866582e-9,0,.873016,.412495,814463e-9,0,.904762,.396975,764498e-9,0,.936508,.381614,715967e-9,0,.968254,.366732,672483e-9,0,1,1,.00155501,0,0,1,.00155503,0,0,1,.00155524,0,0,.999998,.00155615,0,0,.999994,.0015586,0,0,.999983,.00156379,0,0,.999963,.0015733,0,0,.999932,.00158911,0,0,.999882,.00161376,0,0,.99981,.00165041,0,100875e-10,.999708,.00170304,0,367658e-9,.999565,.00177658,0,.0014234,.999368,.00187688,0,.00327939,.999081,.00200989,0,.00596629,.99852,.00217177,0,.0094852,.99549,.0021745,0,.013824,.993252,.00222357,0,.0189642,.991727,.00235022,0,.0248856,.989951,.00250561,0,.0315669,.988029,.00268829,0,.0389882,.984029,.0027496,0,.0471302,.980683,.00289793,0,.0559754,.976554,.00303315,0,.0655081,.97139,.00313257,0,.0757138,.965544,.00323656,0,.08658,.95912,.00333432,0,.0980954,.951183,.0034039,0,.110251,.942974,.00347515,0,.123038,.932642,.00350381,0,.13645,.922158,.00354519,0,.150482,.909404,.00353851,0,.165129,.896071,.0035435,0,.18039,.881206,.00349936,0,.196263,.866077,.00347256,0,.212748,.85093,.003415,0,.229847,.837703,.00333367,0,.247561,.823878,.003249,0,.265895,.809449,.00316347,0,.284854,.794379,.00306351,0,.304445,.778138,.0029499,0,.324675,.761997,.00284099,0,.345555,.744938,.00272104,0,.367095,.727212,.00260715,0,.389309,.709549,.00248855,0,.41221,.691704,.00236783,0,.435814,.673689,.00225178,0,.460138,.656453,.00213765,0,.485203,.639128,.00202178,0,.511028,.621512,.00191443,0,.537634,.603598,.00180977,0,.565041,.58559,.00170456,0,.593268,.567852,.00160927,0,.622327,.5503,.00151395,0,.652217,.533033,.00142499,0,.682907,.515942,.00133955,0,.714296,.498814,.0012602,0,.746032,.481595,.00118188,0,.777778,.465117,.00111171,0,.809524,.448865,.00104091,0,.84127,.432711,976618e-9,0,.873016,.416822,91859e-8,0,.904762,.401272,857704e-9,0,.936508,.386226,807172e-9,0,.968254,.371321,75464e-8,0,1,1,.00209596,0,0,1,.00209598,0,0,1,.00209624,0,0,.999997,.00209736,0,0,.999991,.00210039,0,0,.999979,.00210678,0,0,.999959,.00211847,0,0,.999925,.0021379,0,0,.99987,.00216809,0,0,.999791,.00221281,0,681487e-10,.999677,.00227669,0,658161e-9,.999521,.00236533,0,.00200635,.999301,.00248514,0,.0041779,.998977,.00264185,0,.00718648,.998191,.00281695,0,.0110239,.994801,.00278518,0,.015672,.993091,.00288774,0,.0211091,.991571,.00303931,0,.0273123,.9897,.00321643,0,.034259,.987023,.00337332,0,.0419282,.983289,.00346146,0,.0502998,.979892,.00363704,0,.0593562,.975111,.00373601,0,.069081,.970351,.0038842,0,.0794598,.964131,.00397053,0,.0904798,.957747,.00408078,0,.10213,.949536,.00413533,0,.1144,.941372,.00420305,0,.127284,.931049,.00422815,0,.140772,.920647,.00425048,0,.154862,.908033,.0042281,0,.169548,.895028,.00422026,0,.184828,.879968,.00415042,0,.200701,.864875,.00408821,0,.217167,.84918,.00400909,0,.234227,.834934,.00391178,0,.251884,.821397,.00380066,0,.270141,.807135,.00367974,0,.289004,.792363,.00355172,0,.308479,.776661,.003411,0,.328575,.760705,.00328123,0,.349301,.744408,.00314003,0,.370668,.726994,.0029906,0,.392689,.709598,.00285034,0,.415379,.692112,.00271179,0,.438754,.674435,.00257185,0,.46283,.65676,.00243425,0,.48763,.639982,.00230351,0,.513173,.622983,.0021777,0,.539482,.605471,.00204991,0,.566579,.58796,.00193759,0,.594488,.570463,.00181976,0,.623226,.553058,.00171497,0,.6528,.535894,.00161109,0,.683198,.519089,.00151394,0,.714354,.502454,.00142122,0,.746032,.485681,.00133488,0,.777778,.468935,.00124975,0,.809524,.452951,.00117309,0,.84127,.437139,.00110155,0,.873016,.421446,.00103124,0,.904762,.405951,966387e-9,0,.936508,.391003,908119e-9,0,.968254,.376198,848057e-9,0,1,1,.00280076,0,0,1,.00280078,0,0,.999999,.00280109,0,0,.999997,.00280246,0,0,.999992,.00280616,0,0,.999979,.00281396,0,0,.999956,.00282822,0,0,.999916,.00285186,0,0,.999857,.0028885,0,0,.999768,.00294259,0,196026e-9,.999645,.00301946,0,.00104842,.99947,.00312541,0,.00270199,.999229,.00326733,0,.00519449,.998852,.00344992,0,.00852602,.997558,.00361052,0,.0126804,.994417,.0035898,0,.017635,.992824,.00372393,0,.023365,.991344,.00390695,0,.0298456,.989337,.00410392,0,.0370529,.985811,.00420987,0,.0449651,.982772,.00437488,0,.0535615,.979001,.00455069,0,.0628243,.974102,.00464462,0,.0727368,.969197,.00480577,0,.0832844,.962759,.00487818,0,.0944545,.956207,.00498176,0,.106236,.947909,.00503392,0,.118619,.939596,.00507474,0,.131595,.929642,.00509798,0,.145159,.918807,.00508476,0,.159305,.906921,.00505634,0,.174028,.893312,.00498845,0,.189327,.878933,.0049133,0,.2052,.863986,.0048259,0,.221647,.847936,.00470848,0,.23867,.832253,.00456889,0,.25627,.818619,.00442726,0,.274453,.804788,.00427677,0,.293222,.790241,.00411906,0,.312585,.775162,.00394833,0,.33255,.759463,.00377366,0,.353126,.743598,.00361026,0,.374324,.72697,.00343627,0,.396158,.709646,.00326422,0,.418641,.69277,.00309717,0,.44179,.675371,.0029356,0,.465624,.657863,.00277712,0,.490163,.640772,.00261738,0,.515429,.624441,.0024737,0,.541445,.607497,.00233125,0,.568236,.590438,.00218994,0,.595828,.573224,.0020664,0,.624242,.556168,.00193526,0,.653496,.539232,.00182463,0,.683588,.522352,.00170735,0,.714482,.506172,.00160555,0,.746032,.489842,.00150451,0,.777778,.473463,.00140938,0,.809524,.457266,.00132568,0,.84127,.441609,.0012376,0,.873016,.426348,.00116265,0,.904762,.411002,.00108935,0,.936508,.396045,.00101946,0,.968254,.381448,955665e-9,0,1,1,.0037121,0,0,1,.00371213,0,0,1,.00371251,0,0,.999997,.00371417,0,0,.99999,.00371863,0,0,.999977,.00372807,0,0,.99995,.00374529,0,0,.999908,.0037738,0,0,.999843,.00381789,0,123596e-10,.999745,.00388273,0,407442e-9,.999608,.00397443,0,.0015447,.999415,.00409998,0,.00351385,.999143,.00426662,0,.0063316,.9987,.00447625,0,.00998679,.996363,.00455323,0,.0144569,.994021,.00461052,0,.0197151,.992372,.00476359,0,.0257344,.991007,.00499101,0,.0324882,.988767,.0051972,0,.0399517,.984872,.00528407,0,.0481022,.982004,.00548926,0,.0569191,.977714,.00564385,0,.0663839,.973076,.0057693,0,.0764801,.967565,.0058924,0,.0871928,.961384,.00599629,0,.0985095,.954435,.00605998,0,.110419,.946303,.0061133,0,.122912,.937662,.00612028,0,.13598,.927867,.00612209,0,.149617,.916475,.00604813,0,.163817,.90541,.00603088,0,.178577,.891591,.00592218,0,.193894,.877573,.00578854,0,.209767,.862511,.00566648,0,.226196,.846861,.00551481,0,.243182,.83068,.00533754,0,.260728,.815725,.00515487,0,.278837,.802321,.0049655,0,.297515,.787826,.00475421,0,.316768,.773454,.00456002,0,.336605,.758224,.00434727,0,.357034,.74265,.00414444,0,.378067,.726729,.00393738,0,.399717,.710155,.00373575,0,.421998,.693312,.00353736,0,.444928,.67653,.00334368,0,.468523,.659444,.00315981,0,.492806,.642051,.00297809,0,.517798,.625758,.00280592,0,.543525,.609615,.00264254,0,.570012,.592919,.00248459,0,.597288,.576298,.00233327,0,.625379,.559489,.00219519,0,.654307,.542891,.00205441,0,.684084,.526255,.00193385,0,.714693,.509853,.00180745,0,.746044,.494131,.00169817,0,.777778,.478114,.0015913,0,.809524,.462274,.00148981,0,.84127,.446412,.00139537,0,.873016,.431274,.00130984,0,.904762,.41635,.00122403,0,.936508,.401476,.00114809,0,.968254,.386993,.00107563,0,1,1,.00488216,0,0,1,.0048822,0,0,1,.00488265,0,0,.999997,.00488463,0,0,.999988,.00488999,0,0,.999974,.00490129,0,0,.999946,.00492191,0,0,.999897,.00495598,0,0,.999825,.00500855,0,744791e-10,.999718,.00508559,0,712744e-9,.999565,.005194,0,.00215249,.999352,.00534147,0,.00444576,.999046,.00553523,0,.00759218,.998492,.00577016,0,.0115714,.995564,.00578487,0,.0163557,.993339,.00586414,0,.021915,.991834,.00606002,0,.0282201,.990496,.00633312,0,.0352433,.987826,.00651941,0,.042959,.98383,.00660842,0,.0513439,.98109,.00685523,0,.0603772,.976131,.00695778,0,.0700402,.971922,.00714236,0,.0803163,.965901,.00721437,0,.0911908,.959606,.00732017,0,.102651,.952504,.00735788,0,.114686,.944365,.00738493,0,.127286,.935652,.00737969,0,.140443,.925813,.00733612,0,.154151,.914397,.00723094,0,.168405,.903257,.00714002,0,.183201,.890015,.00700149,0,.198536,.876014,.00682813,0,.214409,.861436,.00665567,0,.23082,.845752,.00644526,0,.24777,.829169,.00621635,0,.265263,.813435,.00597789,0,.283301,.799701,.00575694,0,.301889,.785726,.00549866,0,.321035,.77152,.0052503,0,.340746,.75683,.00499619,0,.361032,.741951,.0047543,0,.381904,.726367,.0045084,0,.403374,.710537,.00426784,0,.425457,.693965,.00403487,0,.448169,.677724,.0038075,0,.47153,.66117,.00359431,0,.495561,.644274,.00338354,0,.520284,.627449,.00318163,0,.545725,.611645,.00299672,0,.571911,.595614,.00281016,0,.598873,.579426,.00264252,0,.62664,.563016,.00247509,0,.655239,.546728,.00232647,0,.684692,.530539,.00217803,0,.714999,.514164,.00204216,0,.746106,.498344,.00191403,0,.777778,.482957,.00179203,0,.809524,.467336,.00167695,0,.84127,.451994,.00157567,0,.873016,.436514,.00147113,0,.904762,.42178,.00138034,0,.936508,.407271,.00129219,0,.968254,.392822,.0012098,0,1,1,.00637427,0,0,1,.00637431,0,0,.999999,.00637485,0,0,.999996,.00637721,0,0,.999987,.00638357,0,0,.999971,.006397,0,0,.999939,.00642142,0,0,.999888,.00646177,0,0,.999807,.00652387,0,207916e-9,.999689,.00661454,0,.00112051,.99952,.00674155,0,.00287719,.999283,.00691313,0,.00550145,.998936,.00713598,0,.00897928,.998165,.00738501,0,.0132829,.994847,.00734388,0,.01838,.993182,.00749991,0,.0242381,.991665,.0077246,0,.030826,.989708,.00797579,0,.0381152,.986663,.00813011,0,.0460794,.983288,.00830365,0,.0546951,.980104,.00853496,0,.0639411,.974855,.00861045,0,.0737988,.97045,.00879133,0,.0842516,.964509,.00886377,0,.0952848,.957594,.00890346,0,.106886,.950546,.00893289,0,.119044,.942225,.00890074,0,.131749,.933365,.00886826,0,.144994,.923202,.0087316,0,.158772,.912605,.00863082,0,.173078,.901099,.00847403,0,.187908,.888177,.00825838,0,.203261,.873955,.00801834,0,.219134,.860091,.00779026,0,.235527,.84434,.00752478,0,.252443,.828517,.00724074,0,.269883,.81239,.00693769,0,.287851,.79721,.00664817,0,.306352,.783489,.00634763,0,.325393,.769514,.00604221,0,.344981,.755419,.00573568,0,.365126,.741083,.00544359,0,.385839,.726059,.00515515,0,.407132,.710809,.00487139,0,.42902,.695052,.00459846,0,.45152,.678886,.00433412,0,.474651,.663042,.00407981,0,.498433,.646634,.00384264,0,.52289,.630117,.00360897,0,.548048,.613804,.00338863,0,.573936,.598338,.00318486,0,.600584,.582687,.00298377,0,.628027,.566809,.00280082,0,.656295,.550817,.00262255,0,.685417,.534937,.00245835,0,.715406,.519151,.00230574,0,.74624,.503118,.0021549,0,.777778,.487723,.00202008,0,.809524,.472725,.00189355,0,.84127,.457599,.00177108,0,.873016,.442558,.00165843,0,.904762,.427624,.00155494,0,.936508,.413171,.00145273,0,.968254,.399122,.00136454,0,1,1,.00826496,0,0,1,.00826499,0,0,1,.00826564,0,0,.999996,.00826842,0,0,.999987,.00827589,0,0,.999967,.00829167,0,0,.999933,.00832037,0,0,.999876,.00836768,0,109338e-10,.999786,.00844031,0,427145e-9,.999655,.00854603,0,.0016384,.999468,.00869337,0,.00372392,.999203,.008891,0,.00668513,.998803,.00914387,0,.0104968,.99748,.00935838,0,.015125,.994446,.00933309,0,.0205338,.99292,.00953084,0,.0266884,.991414,.0097893,0,.0335565,.989049,.0100228,0,.0411086,.98582,.0101664,0,.0493181,.982441,.0103582,0,.0581613,.978595,.0105292,0,.0676169,.973495,.0106274,0,.0776661,.968405,.0107261,0,.0882926,.962717,.0108234,0,.0994817,.955478,.0108102,0,.111221,.948275,.0107914,0,.123499,.940006,.0107161,0,.136308,.930831,.0106309,0,.149639,.920648,.0104083,0,.163485,.910205,.0102312,0,.177843,.898445,.0100051,0,.192707,.885986,.00971928,0,.208077,.872204,.00940747,0,.22395,.858436,.0091085,0,.240326,.843454,.00876595,0,.257208,.827437,.00839794,0,.274596,.811488,.00803692,0,.292496,.796039,.00767352,0,.310911,.781083,.0073097,0,.329849,.767642,.00694032,0,.349316,.753901,.00657476,0,.369323,.740131,.00622699,0,.38988,.725845,.0058838,0,.410999,.710991,.00555586,0,.432696,.696002,.00523089,0,.454987,.680461,.00492494,0,.47789,.664875,.00463464,0,.501426,.649273,.00435422,0,.52562,.63302,.0040875,0,.550498,.61705,.00384075,0,.576089,.601154,.00359557,0,.602427,.586008,.00337636,0,.629544,.570699,.00316019,0,.657479,.555166,.00296033,0,.686264,.539645,.00277552,0,.715924,.524159,.00259499,0,.746459,.508682,.00243257,0,.777789,.493163,.00227851,0,.809524,.478004,.00213083,0,.84127,.46347,.00199502,0,.873016,.448778,.00186967,0,.904762,.434105,.00174732,0,.936508,.419576,.00163861,0,.968254,.405541,.00153341,0,1,1,.0106462,0,0,1,.0106462,0,0,.999999,.010647,0,0,.999995,.0106502,0,0,.999985,.0106589,0,0,.999964,.0106773,0,0,.999925,.0107106,0,0,.999861,.0107655,0,712986e-10,.999763,.0108497,0,743959e-9,.999616,.0109716,0,.00227361,.999408,.0111408,0,.0046983,.999112,.0113659,0,.00800158,.998637,.0116475,0,.0121493,.996223,.0117231,0,.0171023,.994006,.0118064,0,.0228218,.992444,.0120254,0,.0292711,.991028,.0123314,0,.036417,.98803,.0124954,0,.0442295,.984816,.0126538,0,.0526815,.981399,.0128537,0,.0617492,.977085,.0129694,0,.0714114,.972154,.013091,0,.0816495,.966617,.0131166,0,.0924472,.960628,.0131583,0,.10379,.953295,.0131094,0,.115665,.94575,.0129966,0,.128062,.937654,.0128796,0,.140972,.927716,.0126477,0,.154387,.917932,.0123889,0,.168301,.907719,.012131,0,.182709,.89584,.0118013,0,.197608,.883526,.0114145,0,.212994,.870301,.0110075,0,.228867,.856272,.0106019,0,.245227,.842251,.0101938,0,.262074,.826466,.00973254,0,.279412,.810859,.0092846,0,.297244,.795051,.00883304,0,.315575,.780053,.00840272,0,.334412,.76575,.00796438,0,.35376,.752298,.00752526,0,.373631,.739153,.00711486,0,.394034,.725514,.00670361,0,.414983,.711473,.00632656,0,.436491,.696936,.00595206,0,.458575,.682126,.00559191,0,.481253,.667027,.00525362,0,.504547,.651875,.00493805,0,.528481,.636463,.00462848,0,.553081,.620641,.00433936,0,.578377,.604931,.00407,0,.604404,.589549,.00380864,0,.631197,.574712,.00357049,0,.658795,.559775,.00334466,0,.687238,.544514,.00312505,0,.716559,.529555,.00293199,0,.746776,.514402,.00274204,0,.777849,.499302,.00256647,0,.809524,.484114,.00239901,0,.84127,.469308,.00225148,0,.873016,.455133,.00210178,0,.904762,.440939,.0019727,0,.936508,.426627,.00184382,0,.968254,.412509,.00172548,0,1,1,.013628,0,0,1,.0136281,0,0,.999999,.0136289,0,0,.999995,.0136327,0,0,.999983,.0136427,0,0,.99996,.0136638,0,0,.999917,.0137022,0,0,.999846,.0137652,0,204597e-9,.999736,.0138615,0,.00116837,.999573,.0140007,0,.00303325,.99934,.0141927,0,.00580613,.999004,.0144457,0,.00945626,.998407,.0147489,0,.0139421,.995464,.014731,0,.0192202,.993328,.0148283,0,.0252495,.991799,.0150797,0,.0319921,.990397,.0154316,0,.0394138,.986835,.0155005,0,.0474843,.983938,.0157308,0,.0561763,.980154,.0158753,0,.0654661,.975659,.0159581,0,.0753326,.970171,.0159832,0,.0857571,.964803,.0160084,0,.0967236,.958366,.0159484,0,.108218,.950613,.0158001,0,.120227,.942874,.0155845,0,.132741,.935005,.0154292,0,.145751,.924991,.0150742,0,.159249,.914814,.0146757,0,.17323,.904743,.0143097,0,.187687,.893216,.0138695,0,.202619,.880769,.0133706,0,.218021,.868136,.0128606,0,.233894,.85469,.0123403,0,.250238,.840593,.0118091,0,.267052,.825808,.011253,0,.284341,.81009,.0107099,0,.302106,.79504,.0101636,0,.320354,.779757,.00964041,0,.33909,.764697,.00911896,0,.358322,.750913,.00859533,0,.378059,.738175,.00811592,0,.398311,.725242,.00764504,0,.41909,.711864,.00718885,0,.440412,.698009,.00675843,0,.462292,.683841,.00634984,0,.484748,.669391,.00595502,0,.507802,.654731,.00558671,0,.531477,.639805,.00523578,0,.555802,.624789,.00490834,0,.580805,.609325,.00459448,0,.606522,.593975,.00430342,0,.63299,.578983,.00403019,0,.66025,.564442,.0037707,0,.688346,.549835,.0035316,0,.717319,.535039,.00330255,0,.7472,.520403,.00308932,0,.777982,.505687,.00289335,0,.809524,.490939,.00270818,0,.84127,.476233,.0025343,0,.873016,.461624,.00237097,0,.904762,.447833,.00222065,0,.936508,.433992,.00207561,0,.968254,.420147,.00194955,0,1,1,.0173415,0,0,1,.0173416,0,0,.999999,.0173426,0,0,.999995,.0173468,0,0,.999983,.0173582,0,0,.999954,.0173822,0,0,.999908,.0174258,0,669501e-11,.999828,.0174973,0,427399e-9,.999705,.0176063,0,.00171019,.999524,.0177631,0,.0039248,.999263,.0179781,0,.00705382,.998878,.018258,0,.0110552,.998012,.0185551,0,.0158812,.994614,.0184264,0,.0214852,.993132,.0186385,0,.0278239,.991563,.0189067,0,.0348585,.989298,.0191577,0,.0425544,.986036,.0192522,0,.050881,.982558,.0194063,0,.059811,.978531,.019486,0,.0693209,.974198,.0195847,0,.0793895,.968148,.0194749,0,.0899984,.962565,.0194277,0,.101132,.956041,.0192991,0,.112775,.947749,.0189893,0,.124917,.94018,.018704,0,.137547,.93165,.0183458,0,.150655,.921798,.0178775,0,.164236,.911573,.0173618,0,.178281,.901569,.0168482,0,.192788,.890341,.016265,0,.207752,.877835,.0156199,0,.223171,.865472,.0149516,0,.239044,.852905,.0143274,0,.255371,.838906,.0136643,0,.272153,.824888,.0129903,0,.289393,.809977,.0123218,0,.307093,.794697,.0116572,0,.325259,.780028,.0110307,0,.343896,.765124,.0104236,0,.363012,.750411,.0098219,0,.382617,.737264,.00924397,0,.402719,.724799,.00868719,0,.423332,.712253,.00816476,0,.444469,.699267,.00767262,0,.466146,.685618,.00719746,0,.488383,.671736,.00673916,0,.511199,.657777,.00631937,0,.534618,.643497,.00592411,0,.558668,.62889,.00553928,0,.58338,.614299,.0051934,0,.608787,.599197,.00485985,0,.634929,.584175,.00454357,0,.661849,.569541,.00425787,0,.689594,.555193,.00397905,0,.718211,.540947,.00372364,0,.747742,.526593,.00348599,0,.778205,.512335,.00326103,0,.80953,.498017,.00305137,0,.84127,.483609,.00285485,0,.873016,.469368,.00267472,0,.904762,.455037,.00249945,0,.936508,.441493,.00234792,0,.968254,.428147,.00219936,0,1,1,.0219422,0,0,1,.0219423,0,0,.999998,.0219434,0,0,.999993,.0219481,0,0,.999981,.021961,0,0,.999949,.0219879,0,0,.999896,.0220367,0,593194e-10,.999808,.0221167,0,75364e-8,.99967,.0222383,0,.00237884,.999466,.0224125,0,.00495612,.999174,.0226495,0,.00844887,.998725,.0229525,0,.0128058,.996979,.0231123,0,.0179742,.994317,.0230742,0,.0239047,.992781,.0232895,0,.0305526,.991191,.0235734,0,.0378786,.987787,.0236152,0,.0458475,.985092,.0237994,0,.0544287,.981121,.0238553,0,.0635952,.976924,.0238706,0,.0733233,.97218,.0238704,0,.0835922,.965956,.0236598,0,.0943839,.959998,.0234735,0,.105682,.953245,.0232277,0,.117474,.944445,.0226973,0,.129747,.937087,.0223527,0,.142491,.928341,.0218144,0,.155697,.9184,.0211516,0,.169358,.907959,.0204553,0,.183469,.89808,.0197673,0,.198024,.887047,.0189915,0,.21302,.875221,.0182082,0,.228455,.86269,.0173584,0,.244329,.850735,.0165718,0,.260639,.837545,.0157524,0,.277389,.823639,.0149482,0,.29458,.809699,.0141431,0,.312216,.794797,.0133527,0,.3303,.780578,.0126193,0,.34884,.766019,.0118914,0,.367842,.751447,.0111839,0,.387315,.737275,.010514,0,.40727,.724545,.00987277,0,.427717,.712644,.00926569,0,.448671,.700432,.00869029,0,.470149,.687664,.00814691,0,.492167,.674288,.00763012,0,.514746,.660966,.00714437,0,.537911,.647264,.00668457,0,.561688,.633431,.00626581,0,.586108,.619133,.00585593,0,.611206,.604935,.00548188,0,.637022,.590236,.00513288,0,.663599,.575473,.0047906,0,.690989,.561228,.00448895,0,.719242,.547054,.00420233,0,.748411,.533175,.00392869,0,.778531,.519163,.00367445,0,.809583,.505328,.00344097,0,.84127,.491446,.00322003,0,.873016,.477356,.00301283,0,.904762,.46356,.00282592,0,.936508,.449623,.00264956,0,.968254,.436068,.00246956,0,1,1,.0276135,0,0,1,.0276136,0,0,.999998,.0276148,0,0,.999993,.0276201,0,0,.999976,.0276342,0,0,.999945,.027664,0,0,.999884,.0277179,0,18679e-8,.999784,.027806,0,.00119607,.99963,.0279394,0,.00318407,.999401,.0281295,0,.00613601,.999066,.0283858,0,.00999963,.998524,.0287027,0,.0147164,.995702,.0286256,0,.0202295,.993593,.0286733,0,.0264876,.992067,.0288989,0,.0334452,.990548,.0292135,0,.0410621,.986775,.0291296,0,.0493032,.984054,.0293099,0,.0581381,.979481,.0291881,0,.0675397,.975297,.0291598,0,.0774848,.96981,.028954,0,.0879528,.963524,.028628,0,.0989258,.957398,.0283135,0,.110388,.950088,.0278469,0,.122327,.941538,.0271798,0,.134729,.933332,.0265388,0,.147587,.924392,.0257776,0,.160889,.914581,.024916,0,.174631,.904347,.0240242,0,.188806,.894324,.0231229,0,.203409,.883724,.022153,0,.218437,.872207,.0211355,0,.233888,.859927,.0201048,0,.249761,.848373,.0191263,0,.266056,.836023,.0181306,0,.282774,.82289,.0171718,0,.299917,.809324,.0162196,0,.317488,.795361,.0152622,0,.335493,.781253,.01439,0,.353936,.767338,.013533,0,.372825,.753156,.0127244,0,.392168,.739122,.0119454,0,.411976,.725358,.0112054,0,.432259,.712949,.010487,0,.453032,.701621,.00984032,0,.47431,.689703,.00921495,0,.496111,.677216,.00862492,0,.518456,.664217,.00806882,0,.541367,.65137,.00755922,0,.564872,.638,.00705705,0,.589001,.62453,.00661266,0,.613789,.610601,.00618432,0,.639277,.59676,.00578033,0,.66551,.582433,.00540927,0,.692539,.568026,.00506104,0,.720422,.55414,.0047353,0,.749216,.540178,.00442889,0,.778974,.526513,.00414363,0,.809711,.512954,.00388237,0,.84127,.499403,.00362875,0,.873016,.486026,.00340827,0,.904762,.472345,.00318598,0,.936508,.458828,.00297635,0,.968254,.445379,.00279447,0,1,1,.0345716,0,0,1,.0345717,0,0,.999999,.034573,0,0,.999991,.0345787,0,0,.999974,.0345941,0,0,.999937,.0346263,0,188589e-11,.999869,.0346847,0,409238e-9,.999757,.0347798,0,.0017674,.999582,.0349233,0,.00413658,.999322,.0351265,0,.00747408,.998939,.0353967,0,.0117157,.998219,.0357018,0,.0167966,.994974,.0354726,0,.0226572,.993201,.0355621,0,.0292445,.991573,.0357641,0,.0365123,.989301,.0359252,0,.0444203,.985712,.0358017,0,.0529334,.982411,.0358353,0,.0620214,.977827,.035617,0,.0716574,.973278,.0354398,0,.0818186,.967397,.0350483,0,.0924846,.960696,.0344795,0,.103638,.954349,.0339861,0,.115263,.946066,.0331323,0,.127348,.938012,.032359,0,.13988,.929413,.0314413,0,.152849,.920355,.0304103,0,.166248,.910586,.0292785,0,.18007,.900609,.0281391,0,.194308,.890093,.0269103,0,.208958,.880013,.0257269,0,.224018,.869001,.0244671,0,.239485,.85751,.0232252,0,.255359,.84582,.0220117,0,.271638,.834383,.0208274,0,.288324,.822158,.0196628,0,.305419,.809056,.0185306,0,.322927,.795832,.0174174,0,.340851,.782547,.0163758,0,.359199,.7689,.015391,0,.377975,.755526,.0144488,0,.397189,.741681,.0135372,0,.416851,.728178,.0126957,0,.436971,.714642,.0118812,0,.457564,.702756,.0111165,0,.478644,.69175,.0104145,0,.500229,.680159,.00974439,0,.522339,.668073,.00911926,0,.544997,.655405,.00851393,0,.56823,.642921,.00797637,0,.592068,.629993,.00745119,0,.616546,.616828,.00696972,0,.641705,.603305,.00652425,0,.66759,.589833,.00610188,0,.694255,.575945,.00570834,0,.72176,.561745,.00533384,0,.750168,.548277,.00500001,0,.779545,.534467,.00467582,0,.809933,.521032,.00438092,0,.841272,.507877,.00410348,0,.873016,.494654,.00383618,0,.904762,.481592,.00358699,0,.936508,.468509,.00337281,0,.968254,.455293,.00316196,0,1,1,.0430698,0,0,1,.0430699,0,0,.999998,.0430713,0,0,.999991,.0430773,0,0,.99997,.0430936,0,0,.999928,.0431277,0,406396e-10,.999852,.0431893,0,744376e-9,.999724,.0432895,0,.0024806,.999527,.0434397,0,.00524779,.99923,.0436507,0,.00898164,.998783,.0439255,0,.0136083,.997507,.0441104,0,.0190582,.994418,.0438225,0,.0252694,.992864,.0439396,0,.0321879,.991127,.0440962,0,.039767,.987331,.0438408,0,.0479667,.984819,.0438991,0,.056752,.980384,.0435906,0,.0660929,.975846,.0432543,0,.075963,.970748,.0428293,0,.0863398,.964303,.042153,0,.0972035,.95772,.0414111,0,.108537,.950747,.0405893,0,.120325,.942533,.0394887,0,.132554,.934045,.0383544,0,.145215,.924942,.037057,0,.158296,.915811,.0356993,0,.17179,.90612,.0342401,0,.185691,.896434,.0328078,0,.199993,.886021,.031288,0,.214691,.876081,.0297776,0,.229782,.865608,.0282334,0,.245265,.854924,.026749,0,.261138,.843607,.02526,0,.277401,.832456,.0238214,0,.294056,.821342,.0224682,0,.311104,.809303,.0211297,0,.328548,.796468,.0198387,0,.346394,.784046,.0186227,0,.364645,.771262,.0174561,0,.38331,.758118,.0163806,0,.402396,.745075,.0153287,0,.421912,.731926,.0143647,0,.44187,.71863,.0134363,0,.462283,.705414,.0125603,0,.483165,.693792,.0117508,0,.504535,.683108,.0110016,0,.52641,.67183,.0102757,0,.548816,.66015,.00962044,0,.571776,.647907,.00898031,0,.595323,.635734,.00840811,0,.619489,.623208,.00786211,0,.644317,.610438,.00734953,0,.669852,.597345,.00687688,0,.696148,.584138,.00643469,0,.723267,.5707,.00602236,0,.75128,.556966,.0056324,0,.780258,.543607,.00528277,0,.810268,.530213,.00493999,0,.841311,.516912,.00462265,0,.873016,.503916,.0043307,0,.904762,.491146,.00406858,0,.936508,.478439,.00381436,0,.968254,.465834,.00358003,0,1,1,.0534039,0,0,1,.053404,0,0,.999998,.0534055,0,0,.999989,.0534116,0,0,.999968,.0534283,0,0,.999918,.0534633,0,155895e-9,.99983,.0535262,0,.00120914,.999685,.0536281,0,.00334944,.999461,.0537799,0,.00653077,.999119,.0539902,0,.0106718,.998582,.0542524,0,.0156907,.995919,.0540318,0,.0215147,.993735,.0538914,0,.0280801,.992126,.0539557,0,.0353323,.990266,.0540401,0,.0432247,.986317,.0536064,0,.0517172,.983213,.0534425,0,.0607754,.978303,.0528622,0,.0703698,.973665,.0523363,0,.0804742,.968091,.0516165,0,.0910667,.961026,.0505434,0,.102128,.954333,.049523,0,.113641,.946372,.0481698,0,.125591,.938254,.0467674,0,.137965,.929516,.0452341,0,.150754,.920106,.0435083,0,.163947,.910899,.0417399,0,.177537,.901532,.0399389,0,.191516,.891919,.0380901,0,.205881,.882006,.0362341,0,.220626,.871965,.0343444,0,.235749,.862145,.0324832,0,.251248,.852058,.0306681,0,.267121,.84161,.0289097,0,.283368,.830806,.0272079,0,.299992,.820476,.0256089,0,.316992,.809514,.0240394,0,.334374,.797865,.0225379,0,.35214,.785621,.0211235,0,.370296,.773765,.0197908,0,.388849,.761629,.0185235,0,.407807,.748891,.0173358,0,.427178,.736437,.0162305,0,.446974,.723707,.0151778,0,.467207,.710606,.0141791,0,.487892,.698019,.0132592,0,.509046,.686203,.0123887,0,.530687,.675692,.0115976,0,.552839,.664826,.0108325,0,.575527,.65349,.0101348,0,.59878,.641774,.00947756,0,.622634,.629794,.00886058,0,.647128,.617647,.00828526,0,.672308,.60534,.00775312,0,.698231,.592718,.00726033,0,.724958,.579746,.00679731,0,.752563,.566763,.00636111,0,.781127,.553515,.00595228,0,.810733,.540118,.00556876,0,.841426,.527325,.00523051,0,.873016,.514265,.00490712,0,.904762,.501406,.00460297,0,.936508,.488922,.00431247,0,.968254,.476541,.0040472,0,1,1,.0659184,0,0,1,.0659185,0,0,.999998,.06592,0,0,.999988,.0659259,0,0,.999963,.0659423,0,0,.999907,.0659764,0,374198e-9,.999806,.0660376,0,.00182071,.999639,.0661361,0,.0043894,.999378,.0662814,0,.00800055,.998985,.0664779,0,.0125594,.998285,.0666914,0,.0179786,.995071,.0661989,0,.0241822,.993172,.0660454,0,.031106,.991438,.0660105,0,.0386952,.988428,.0656875,0,.0469032,.985218,.0652913,0,.0556905,.981128,.0647107,0,.065023,.976015,.0638491,0,.0748717,.97097,.062993,0,.0852112,.964582,.0617927,0,.0960199,.957383,.0603626,0,.107279,.949969,.0588128,0,.118971,.941843,.0570274,0,.131084,.933624,.0551885,0,.143604,.924543,.053122,0,.156521,.914919,.0508897,0,.169825,.905773,.0486418,0,.18351,.896434,.0463364,0,.197569,.887195,.0440623,0,.211997,.877706,.0417799,0,.226789,.867719,.03945,0,.241944,.858587,.037243,0,.257458,.849317,.0350956,0,.273331,.839585,.0329852,0,.289563,.829856,.0310028,0,.306154,.819589,.0290953,0,.323108,.809714,.0272738,0,.340426,.79934,.0255631,0,.358113,.788224,.0239175,0,.376175,.776619,.0223831,0,.394616,.76521,.0209298,0,.413445,.753716,.0195786,0,.432671,.741564,.0183001,0,.452305,.729413,.0171259,0,.472358,.717146,.0159933,0,.492845,.70436,.0149495,0,.513783,.69219,.0139681,0,.535189,.680289,.0130577,0,.557087,.669611,.0122198,0,.5795,.659113,.0114174,0,.602459,.648148,.0106729,0,.625997,.636905,.00998997,0,.650154,.625154,.00934313,0,.674976,.613481,.00874839,0,.700518,.60154,.00818265,0,.726845,.58943,.00766889,0,.754032,.576828,.00717153,0,.782167,.564194,.00672696,0,.811344,.551501,.00630863,0,.841644,.538635,.00592177,0,.873016,.525724,.00554888,0,.904762,.513209,.00520225,0,.936508,.500457,.00488231,0,.968254,.48799,.00457153,0,1,1,.0810131,0,0,1,.0810133,0,0,.999997,.0810145,0,0,.999985,.08102,0,0,.999956,.0810347,0,195026e-10,.999893,.0810656,0,719316e-9,.999777,.0811205,0,.00259774,.999583,.081208,0,.00561807,.999281,.0813343,0,.00967472,.998813,.0814969,0,.0146627,.997597,.0815217,0,.0204902,.994379,.0808502,0,.0270802,.992744,.0806792,0,.0343674,.990745,.0804589,0,.0422974,.986646,.0796107,0,.0508242,.983611,.0790913,0,.0599087,.978869,.0780746,0,.0695175,.973475,.0768218,0,.0796223,.967845,.0754926,0,.0901983,.960778,.0737063,0,.101224,.953333,.0718052,0,.112682,.945274,.0695946,0,.124555,.936955,.0672492,0,.136831,.928319,.0647732,0,.149496,.919075,.0620947,0,.162542,.909114,.0591816,0,.175958,.900137,.0563917,0,.189739,.891069,.0535392,0,.203877,.882262,.0507642,0,.218368,.873232,.0479793,0,.233208,.864042,.045226,0,.248393,.855002,.0425413,0,.263923,.846569,.0400126,0,.279796,.837714,.0375269,0,.296012,.828918,.0352027,0,.312573,.819783,.0330011,0,.329479,.810129,.0308908,0,.346734,.800866,.0289112,0,.364342,.79093,.0270255,0,.382307,.780593,.0252758,0,.400637,.769511,.0236178,0,.419337,.758558,.0220652,0,.438418,.747632,.0206289,0,.457889,.736146,.0192873,0,.477761,.724093,.0180333,0,.49805,.71234,.0168264,0,.51877,.700201,.015746,0,.53994,.687949,.0147027,0,.561581,.676163,.0137512,0,.583718,.665001,.0128655,0,.60638,.65472,.0120366,0,.629599,.644213,.0112604,0,.653415,.633382,.0105413,0,.677874,.62212,.00986498,0,.70303,.610631,.00923308,0,.728948,.599078,.00864206,0,.755706,.587519,.00811784,0,.783396,.575505,.00761237,0,.812121,.563148,.00713949,0,.841989,.550828,.00668379,0,.873035,.538458,.00627715,0,.904762,.525905,.00588336,0,.936508,.513517,.00552687,0,.968254,.501395,.00519681,0,1,1,.0991506,0,0,1,.0991504,0,0,.999996,.0991515,0,0,.999984,.0991558,0,0,.999947,.0991672,0,114389e-9,.999874,.0991912,0,.00121503,.999739,.0992331,0,.00356108,.999514,.0992983,0,.00705578,.999159,.0993877,0,.011574,.998586,.0994837,0,.017003,.995731,.0988425,0,.0232484,.993384,.098276,0,.0302318,.991615,.0979269,0,.0378884,.989029,.0973432,0,.0461641,.985373,.0963539,0,.0550136,.981278,.0952306,0,.0643988,.975777,.0936233,0,.0742868,.970526,.0920219,0,.0846501,.963755,.0898912,0,.0954644,.956676,.0876064,0,.106709,.948099,.0847751,0,.118367,.939718,.0818638,0,.130423,.931305,.078857,0,.142862,.922342,.0756127,0,.155674,.912842,.0721473,0,.168849,.903304,.0686195,0,.182378,.89411,.0650589,0,.196255,.885512,.0616022,0,.210473,.877193,.0582434,0,.225027,.86877,.0548979,0,.239915,.860267,.0516095,0,.255132,.851915,.048468,0,.270678,.843912,.0454447,0,.286551,.83604,.0425612,0,.302751,.828245,.0398752,0,.31928,.820159,.0373198,0,.336138,.81167,.034916,0,.35333,.802659,.0326402,0,.370858,.793921,.0304901,0,.388728,.784713,.0284857,0,.406944,.774946,.0266186,0,.425515,.76448,.0248593,0,.444449,.753793,.0232114,0,.463756,.743506,.0217039,0,.483447,.732555,.0202841,0,.503535,.720965,.0189648,0,.524036,.709422,.0177189,0,.544968,.697756,.0165626,0,.56635,.685565,.015483,0,.588208,.673987,.0144892,0,.610569,.66244,.0135607,0,.633466,.651675,.0126956,0,.656936,.641598,.0118788,0,.681025,.63121,.0111261,0,.705788,.620514,.010437,0,.731289,.609366,.00978747,0,.757606,.598137,.00917257,0,.784834,.586966,.00859778,0,.813085,.575549,.00806803,0,.842485,.563797,.00757294,0,.87313,.551758,.00710592,0,.904762,.539894,.0066841,0,.936508,.527901,.00627901,0,.968254,.515819,.00590506,0,1,1,.120864,0,0,1,.120864,0,0,.999996,.120864,0,0,.99998,.120867,0,0,.99994,.120872,0,323781e-9,.999852,.120884,0,.00188693,.999693,.120903,0,.00473489,.999426,.120929,0,.00872704,.999002,.120955,0,.0137237,.998235,.120918,0,.0196068,.994608,.119764,0,.0262803,.992997,.119265,0,.0336657,.990968,.11863,0,.0416987,.987002,.117261,0,.0503261,.983524,.116009,0,.0595035,.97875,.114252,0,.0691935,.972652,.11193,0,.0793645,.966613,.109555,0,.0899894,.959275,.106612,0,.101045,.951272,.103375,0,.112512,.942323,.0996594,0,.124372,.933679,.0958841,0,.136611,.924822,.0919265,0,.149216,.915742,.0878061,0,.162176,.906348,.0834894,0,.175482,.896883,.079085,0,.189125,.88774,.0746745,0,.203098,.87986,.0705773,0,.217396,.871998,.0665005,0,.232015,.864325,.0625413,0,.24695,.856685,.0586781,0,.2622,.84925,.0550063,0,.277761,.841719,.0514727,0,.293634,.834755,.0481398,0,.309819,.827853,.0450172,0,.326315,.820888,.0420969,0,.343126,.813616,.0393702,0,.360254,.805767,.0367771,0,.377701,.797338,.0343274,0,.395474,.789122,.0320529,0,.413577,.780601,.0299485,0,.432018,.771424,.0279812,0,.450804,.761502,.0261054,0,.469944,.751166,.0243942,0,.489451,.741276,.0228087,0,.509337,.730898,.0213265,0,.529617,.719878,.0199307,0,.550307,.708379,.0186574,0,.571428,.697165,.0174446,0,.593003,.685554,.0163144,0,.615059,.673631,.015276,0,.637628,.662385,.0143003,0,.660746,.651059,.0134112,0,.68446,.640451,.0125794,0,.70882,.630536,.011793,0,.733893,.620316,.0110547,0,.759756,.609722,.0103668,0,.786505,.598804,.00973009,0,.814259,.587871,.00912812,0,.843157,.577121,.00858916,0,.87334,.566019,.00807333,0,.904762,.554664,.00759687,0,.936508,.543101,.00714759,0,.968254,.531558,.00673418,0,1,1,.146767,0,0,1,.146767,0,0,.999997,.146767,0,0,.999977,.146765,0,320658e-11,.999929,.146762,0,682576e-9,.999823,.146753,0,.00276402,.999633,.146735,0,.00614771,.999314,.146699,0,.0106613,.998796,.14662,0,.0161546,.997124,.146107,0,.0225063,.994062,.144857,0,.0296198,.992154,.144011,0,.037417,.989186,.142712,0,.0458348,.985279,.140926,0,.0548211,.980826,.13885,0,.0643326,.975056,.136168,0,.074333,.969005,.133217,0,.0847917,.961554,.12959,0,.0956828,.954206,.125886,0,.106984,.945046,.121335,0,.118675,.935678,.116492,0,.130741,.926748,.111635,0,.143166,.917764,.106625,0,.155939,.908358,.101325,0,.169049,.899219,.0960249,0,.182487,.890089,.0906527,0,.196245,.881488,.0853905,0,.210317,.874031,.0804177,0,.224697,.866932,.0756005,0,.23938,.859976,.0709019,0,.254364,.853375,.0664391,0,.269646,.846971,.0622012,0,.285223,.840483,.058129,0,.301096,.833969,.0542762,0,.317265,.82806,.0507042,0,.333729,.822128,.047368,0,.350491,.815989,.044272,0,.367554,.809336,.0413444,0,.38492,.802177,.038601,0,.402594,.79441,.0360227,0,.420582,.786573,.0336383,0,.438891,.778619,.0314321,0,.457527,.77,.029362,0,.476499,.760698,.0274102,0,.49582,.750932,.0256146,0,.5155,.740993,.023974,0,.535555,.731159,.0224182,0,.556,.720836,.0209889,0,.576855,.709913,.0196411,0,.598143,.698415,.0183824,0,.619888,.68745,.0172222,0,.642123,.676154,.0161509,0,.664883,.664383,.0151397,0,.688211,.6533,.0141873,0,.71216,.642072,.0133105,0,.736792,.631412,.0124932,0,.762186,.621622,.0117408,0,.788439,.611681,.0110358,0,.815672,.60142,.0103775,0,.844034,.59083,.00975623,0,.873699,.580254,.00918084,0,.904765,.569841,.00864721,0,.936508,.559224,.00815731,0,.968254,.548315,.00767924,0,1,1,.177563,0,0,1,.177563,0,0,.999994,.177562,0,0,.999972,.177555,0,664171e-10,.999914,.177536,0,.0012276,.999787,.177496,0,.00388025,.999556,.17742,0,.00783463,.999165,.177285,0,.0128953,.9985,.177037,0,.0189053,.995388,.175634,0,.025742,.993102,.174375,0,.033309,.990992,.173121,0,.0415298,.986932,.170896,0,.0503425,.982786,.16847,0,.0596964,.977592,.165455,0,.0695498,.971075,.161676,0,.0798676,.963967,.157458,0,.0906201,.956397,.152836,0,.101783,.947489,.147467,0,.113333,.937564,.14145,0,.125254,.928182,.135383,0,.137529,.919027,.129212,0,.150144,.909618,.12276,0,.163088,.900492,.116273,0,.176351,.891671,.1098,0,.189924,.883146,.103362,0,.203799,.875151,.0970799,0,.21797,.868338,.0911732,0,.232433,.862033,.0854966,0,.247182,.856107,.0800691,0,.262216,.850644,.0749618,0,.27753,.845261,.070079,0,.293124,.839885,.0654321,0,.308997,.834609,.0610975,0,.325149,.829083,.0569741,0,.341581,.82404,.0531736,0,.358294,.818968,.049665,0,.37529,.813496,.0463856,0,.392573,.807533,.0433217,0,.410148,.80099,.0404402,0,.428019,.793891,.0377578,0,.446192,.786281,.0352616,0,.464676,.778773,.0329577,0,.483478,.770737,.030808,0,.502608,.762094,.0287964,0,.522079,.752898,.0269254,0,.541905,.743306,.0251926,0,.5621,.733416,.023595,0,.582684,.723742,.0221155,0,.603677,.713542,.0207435,0,.625106,.702755,.019434,0,.646998,.691484,.0182046,0,.66939,.680531,.0170771,0,.692324,.66953,.0160339,0,.715849,.658126,.0150677,0,.740028,.646933,.0141551,0,.764937,.636107,.0133179,0,.790673,.625271,.0125284,0,.817358,.615225,.0117937,0,.84515,.605678,.0111181,0,.874244,.59583,.0104759,0,.904828,.585704,.00986672,0,.936508,.575413,.00929712,0,.968254,.565373,.00876713,0,1,1,.214058,0,0,.999999,.214058,0,0,.999994,.214055,0,0,.999966,.214039,0,259642e-9,.999893,.213998,0,.00200075,.999737,.21391,0,.00527775,.999449,.213745,0,.00983959,.99896,.213458,0,.0154755,.9979,.212855,0,.0220249,.994278,.210779,0,.0293654,.992254,.20926,0,.0374021,.98881,.206908,0,.0460604,.984715,.204009,0,.0552802,.979738,.200471,0,.0650127,.972884,.195813,0,.0752175,.965996,.190856,0,.0858612,.957974,.185077,0,.0969155,.949155,.17868,0,.108356,.939288,.171513,0,.120163,.928996,.163838,0,.132319,.919563,.156246,0,.144808,.910004,.148359,0,.157618,.900791,.140417,0,.170737,.892135,.132569,0,.184155,.883803,.124741,0,.197866,.876034,.117091,0,.211861,.869219,.109835,0,.226134,.863062,.102859,0,.240682,.857795,.0962928,0,.255499,.853009,.0900725,0,.270583,.848603,.0842101,0,.285931,.844335,.0786527,0,.301542,.840208,.0734397,0,.317415,.836035,.0685334,0,.33355,.83172,.0639275,0,.349948,.827135,.0595909,0,.36661,.822797,.0556204,0,.383539,.818387,.0519394,0,.400738,.813565,.0485317,0,.41821,.808142,.0453138,0,.435961,.802212,.0423354,0,.453997,.79573,.0395553,0,.472324,.788741,.036988,0,.490951,.781093,.0345688,0,.509887,.773597,.0323297,0,.529144,.765622,.0302719,0,.548735,.757083,.0283477,0,.568674,.747992,.0265562,0,.588979,.738591,.0248844,0,.609671,.728719,.0233342,0,.630773,.719146,.0219081,0,.652314,.709165,.0205711,0,.674328,.69875,.0193248,0,.696854,.687884,.0181582,0,.719942,.676818,.0170746,0,.743651,.666247,.0160718,0,.768057,.655284,.0151262,0,.793253,.64401,.0142561,0,.819363,.633353,.0134327,0,.846547,.622674,.012653,0,.875017,.612265,.0119354,0,.905021,.602455,.0112533,0,.936508,.593147,.0106234,0,.968254,.583592,.0100213,0,1,1,.25717,0,0,1,.25717,0,0,.999992,.257164,0,0,.999958,.257135,0,641715e-9,.999864,.25706,0,.00305314,.999666,.256897,0,.00700975,.999302,.256596,0,.0122194,.998663,.25607,0,.0184622,.995607,.254123,0,.0255773,.993094,.252081,0,.0334439,.9907,.249867,0,.0419696,.98594,.246118,0,.0510823,.981214,.242049,0,.0607242,.974966,.236869,0,.0708486,.967589,.230724,0,.081417,.95915,.223635,0,.0923974,.950257,.21596,0,.103763,.940165,.207296,0,.115491,.929396,.197901,0,.127562,.919288,.188437,0,.13996,.909428,.178762,0,.15267,.900105,.169072,0,.165679,.891418,.159478,0,.178979,.883347,.15002,0,.192558,.875992,.140813,0,.20641,.869466,.13196,0,.220529,.863699,.123501,0,.234907,.858553,.115436,0,.249542,.854379,.107901,0,.264428,.850894,.10088,0,.279564,.847632,.0942296,0,.294947,.844571,.0879861,0,.310575,.84163,.0821534,0,.326448,.838542,.0766409,0,.342566,.835412,.0715322,0,.358929,.831899,.0666883,0,.37554,.828177,.0622175,0,.392399,.82416,.0580452,0,.409511,.820393,.054267,0,.426878,.816068,.0507172,0,.444506,.811201,.0474041,0,.4624,.805785,.0443174,0,.480566,.799878,.0414562,0,.499013,.793469,.0388147,0,.517749,.786473,.0363453,0,.536785,.778874,.0340225,0,.556134,.771277,.0318599,0,.575809,.763426,.0298859,0,.595827,.755044,.0280357,0,.616207,.746161,.0262979,0,.636973,.737124,.0247295,0,.65815,.72761,.0232514,0,.679772,.717822,.0218755,0,.701876,.708279,.0205942,0,.724509,.698333,.0193947,0,.74773,.68802,.0182717,0,.771609,.677321,.0172044,0,.79624,.666504,.0162122,0,.821743,.656184,.0152924,0,.84828,.64556,.0144326,0,.876069,.634636,.0136157,0,.905404,.624124,.0128612,0,.936508,.613914,.0121435,0,.968254,.603589,.0114887,0,1,1,.307946,0,0,.999999,.307945,0,0,.999988,.307934,0,204479e-10,.999944,.307886,0,.00127833,.999824,.307756,0,.00445047,.999565,.30748,0,.00914673,.999085,.306966,0,.0150498,.998103,.306004,0,.0219367,.994249,.303028,0,.0296485,.991807,.300435,0,.038068,.987773,.296554,0,.0471062,.982673,.2916,0,.0566942,.976623,.285641,0,.0667768,.968757,.27815,0,.0773099,.959849,.269529,0,.088257,.950663,.260248,0,.0995879,.940129,.249704,0,.111277,.92895,.238291,0,.123304,.917996,.226501,0,.13565,.907813,.214669,0,.148299,.898305,.202835,0,.161237,.889626,.191158,0,.174455,.88175,.179695,0,.187941,.874715,.168548,0,.201687,.868746,.15792,0,.215687,.863703,.147807,0,.229933,.859315,.138149,0,.24442,.855538,.128993,0,.259145,.852428,.120414,0,.274103,.850168,.112498,0,.289293,.848132,.105054,0,.304711,.846291,.0981087,0,.320357,.844431,.0915942,0,.33623,.842493,.0855056,0,.35233,.840368,.0798204,0,.368658,.83798,.0745097,0,.385214,.83523,.0695424,0,.402002,.832091,.0649092,0,.419023,.828667,.0606291,0,.436282,.824805,.0566523,0,.453782,.820988,.0530229,0,.471529,.816635,.0496364,0,.489528,.811725,.0464658,0,.507788,.806316,.0435082,0,.526317,.800469,.0407873,0,.545124,.794107,.038255,0,.564221,.787218,.0358825,0,.583621,.779872,.0336785,0,.603341,.772097,.0316379,0,.623397,.764484,.0297379,0,.643812,.756428,.0279581,0,.664611,.748022,.0263153,0,.685824,.739268,.0247799,0,.707488,.73024,.0233385,0,.729646,.720893,.0220035,0,.752354,.71119,.0207555,0,.77568,.701791,.0195843,0,.799715,.692184,.0184891,0,.824574,.682258,.0174541,0,.850417,.67206,.0164873,0,.877466,.661717,.0155959,0,.90604,.651462,.0147519,0,.936528,.641467,.0139727,0,.968254,.631229,.0132363,0,1,1,.367573,0,0,.999999,.367571,0,0,.999984,.367553,0,183382e-9,.999925,.367473,0,.00225254,.999759,.367259,0,.00628165,.99941,.366801,0,.0117858,.998739,.365946,0,.0184359,.995529,.363191,0,.0260114,.992875,.360171,0,.0343581,.989135,.355981,0,.0433637,.984166,.350401,0,.0529438,.977871,.343348,0,.0630334,.96951,.334341,0,.0735805,.959964,.323862,0,.0845437,.950162,.312521,0,.095889,.938882,.299577,0,.107588,.926992,.285573,0,.119617,.915589,.271212,0,.131957,.904791,.256611,0,.144591,.895177,.242224,0,.157503,.886403,.227952,0,.170682,.878957,.214192,0,.184117,.872418,.200795,0,.197799,.867029,.188015,0,.21172,.862835,.175975,0,.225873,.859411,.164526,0,.240253,.856655,.153693,0,.254854,.854519,.14352,0,.269673,.852828,.13397,0,.284707,.851412,.124984,0,.299953,.850609,.116748,0,.315408,.849855,.10905,0,.331073,.849017,.101839,0,.346946,.848079,.0951359,0,.363028,.846911,.0888774,0,.379318,.845445,.0830375,0,.395818,.84362,.0775844,0,.41253,.841411,.0725054,0,.429457,.838768,.0677691,0,.446602,.835801,.0634016,0,.463968,.832341,.0593095,0,.481561,.828424,.0555121,0,.499386,.824312,.052024,0,.51745,.819918,.0487865,0,.535761,.815072,.0457801,0,.554328,.809863,.0430184,0,.573162,.804164,.0404245,0,.592275,.798034,.0380146,0,.611681,.791436,.0357436,0,.631398,.784498,.0336475,0,.651445,.777125,.0316666,0,.671845,.769365,.0298122,0,.692628,.761579,.0281001,0,.713827,.753746,.0265049,0,.735484,.745573,.0250067,0,.75765,.737083,.0236026,0,.78039,.728545,.0223302,0,.803789,.719691,.0211243,0,.82796,.710569,.0199983,0,.853056,.701216,.0189569,0,.879298,.692094,.0179702,0,.907014,.682909,.0170418,0,.936691,.673509,.0161732,0,.968254,.663863,.0153406,0,1,1,.437395,0,0,.999998,.437394,0,0,.99998,.437363,0,616704e-9,.999891,.437232,0,.00367925,.999656,.436877,0,.00867446,.999148,.436121,0,.0150679,.997959,.434564,0,.022531,.993464,.430134,0,.0308507,.990606,.426077,0,.0398805,.985027,.419397,0,.0495148,.978491,.41118,0,.0596749,.969643,.40048,0,.0703001,.959189,.38769,0,.0813427,.948223,.373575,0,.0927641,.935955,.357622,0,.104533,.923237,.34043,0,.116624,.911074,.322735,0,.129015,.899724,.30479,0,.141687,.890189,.287392,0,.154626,.881796,.270248,0,.167818,.874781,.253659,0,.181252,.869166,.237786,0,.194918,.864725,.222618,0,.208807,.861565,.208356,0,.222913,.859284,.194867,0,.237229,.857677,.18212,0,.25175,.856714,.17018,0,.266473,.856155,.158969,0,.281392,.8558,.148413,0,.296505,.855672,.138578,0,.311811,.855538,.129345,0,.327306,.855689,.120861,0,.342991,.855767,.112969,0,.358864,.855618,.105593,0,.374925,.85525,.0987451,0,.391176,.854583,.0923727,0,.407616,.853534,.0864143,0,.424249,.852061,.0808338,0,.441076,.850253,.0756771,0,.4581,.848004,.0708612,0,.475324,.845333,.0663784,0,.492754,.842376,.0622631,0,.510394,.838956,.0584112,0,.528251,.835121,.0548328,0,.546331,.830842,.0514838,0,.564644,.826212,.048355,0,.583198,.821522,.0454714,0,.602005,.816551,.0428263,0,.621078,.811211,.0403612,0,.640434,.805479,.038039,0,.660089,.799409,.0358739,0,.680066,.79306,.0338727,0,.70039,.786395,.0319985,0,.721094,.779416,.030241,0,.742215,.77214,.0285951,0,.7638,.764636,.0270747,0,.785912,.756836,.0256354,0,.808628,.749315,.0243027,0,.832055,.741561,.0230497,0,.856338,.733589,.0218801,0,.88169,.725479,.020784,0,.908441,.717255,.0197702,0,.937125,.708829,.0188168,0,.968254,.700191,.0179113,0,1,1,.518937,0,0,.999998,.518933,0,0,.999967,.518883,0,.00147741,.999832,.51866,0,.00573221,.999466,.518057,0,.011826,.998644,.516752,0,.0192116,.994458,.512347,0,.027573,.991223,.507675,0,.0367099,.985515,.500188,0,.046487,.978308,.490408,0,.0568071,.968359,.477357,0,.0675984,.95682,.461752,0,.0788059,.943929,.443796,0,.090386,.930224,.423893,0,.102304,.916514,.402682,0,.114532,.903653,.380914,0,.127047,.892315,.359212,0,.139828,.882942,.338102,0,.152861,.875438,.31773,0,.16613,.869642,.298186,0,.179624,.865304,.279491,0,.193332,.862382,.261804,0,.207247,.860666,.245146,0,.22136,.859788,.229406,0,.235666,.859608,.214605,0,.250158,.859912,.200691,0,.264832,.86053,.187623,0,.279684,.861368,.17539,0,.294711,.862237,.163901,0,.309911,.863127,.153175,0,.32528,.863923,.143147,0,.340819,.864567,.133781,0,.356524,.865013,.125042,0,.372397,.86539,.116952,0,.388438,.865591,.109476,0,.404645,.865517,.102542,0,.421022,.865084,.0960688,0,.437569,.864309,.0900499,0,.454287,.863151,.0844328,0,.471181,.861649,.0792218,0,.488253,.859742,.0743482,0,.505507,.857446,.0697963,0,.522947,.854757,.0655364,0,.54058,.851783,.061608,0,.558412,.848516,.0579701,0,.576449,.844897,.0545742,0,.594701,.840956,.0514167,0,.613178,.836676,.0484598,0,.631892,.832075,.0456934,0,.650856,.827191,.0431178,0,.670088,.822295,.0407718,0,.689606,.817294,.0386032,0,.709434,.812013,.0365675,0,.7296,.806465,.0346547,0,.750138,.800691,.0328717,0,.771093,.794709,.031211,0,.792519,.788493,.0296504,0,.814488,.782049,.0281782,0,.837097,.775403,.0267965,0,.860481,.76857,.0255002,0,.884842,.761536,.0242759,0,.910494,.754303,.0231142,0,.937985,.74692,.0220305,0,.968254,.739745,.0210192,0,1,1,.613914,0,0,.999996,.613907,0,963597e-10,.999942,.613814,0,.00301247,.999704,.613407,0,.00870385,.999046,.612302,0,.0160714,.995516,.608266,0,.0245899,.991726,.602863,0,.0339681,.985157,.593956,0,.0440254,.97642,.581748,0,.0546409,.964404,.565183,0,.0657284,.950601,.545273,0,.0772246,.935158,.522129,0,.0890812,.919364,.496782,0,.10126,.904754,.470571,0,.113731,.89176,.444037,0,.126469,.881492,.418322,0,.139454,.873656,.393522,0,.15267,.868053,.369795,0,.166101,.864336,.347171,0,.179736,.862259,.325737,0,.193565,.861556,.305532,0,.207578,.861776,.286416,0,.221769,.862661,.268355,0,.23613,.864015,.251334,0,.250656,.865711,.235352,0,.265343,.867519,.220302,0,.280187,.869351,.206161,0,.295183,.871144,.192908,0,.31033,.872839,.180505,0,.325624,.874307,.168848,0,.341065,.875667,.158021,0,.35665,.876758,.147877,0,.37238,.87764,.138441,0,.388253,.878237,.129627,0,.404269,.878563,.121415,0,.42043,.878572,.113741,0,.436735,.87842,.106652,0,.453187,.878057,.100097,0,.469786,.877413,.0940128,0,.486536,.87646,.0883462,0,.503439,.875233,.0830924,0,.520498,.8737,.0781975,0,.537717,.871873,.07364,0,.555102,.86978,.0694103,0,.572657,.867405,.0654696,0,.59039,.864751,.0617914,0,.608307,.861818,.0583491,0,.626419,.858645,.0551443,0,.644733,.855307,.0521894,0,.663264,.851736,.0494334,0,.682025,.847927,.0468504,0,.701032,.843888,.0444261,0,.720308,.839629,.0421497,0,.739875,.835158,.0400082,0,.759764,.830509,.0380076,0,.780014,.825714,.0361488,0,.800673,.820729,.0343956,0,.821803,.815751,.0327781,0,.843492,.810752,.031275,0,.86586,.805587,.0298542,0,.889087,.800317,.0285397,0,.913466,.79489,.0272948,0,.93952,.789314,.0261139,0,.96835,.783593,.0249938,0,1,1,.724258,0,0,.999992,.724243,0,726889e-9,.99987,.724044,0,.00569574,.999336,.72317,0,.0131702,.996271,.719432,0,.0220738,.991159,.712576,0,.0319405,.982465,.700927,0,.0425202,.97049,.684297,0,.0536599,.953973,.661244,0,.065258,.935546,.633804,0,.0772427,.916596,.603071,0,.0895616,.899353,.57105,0,.102175,.885216,.539206,0,.11505,.875076,.508714,0,.128164,.868334,.479571,0,.141495,.864414,.451796,0,.155026,.862678,.425328,0,.168745,.862835,.400352,0,.182639,.864067,.376532,0,.196699,.866086,.35391,0,.210915,.868557,.332424,0,.225282,.871271,.312053,0,.239792,.874058,.292764,0,.25444,.8768,.27453,0,.269223,.87939,.257297,0,.284135,.8819,.24114,0,.299174,.884187,.225934,0,.314337,.886262,.211669,0,.329622,.888119,.198311,0,.345026,.889709,.185783,0,.360549,.891054,.174063,0,.376189,.892196,.163143,0,.391946,.893101,.152952,0,.407819,.893803,.143475,0,.423808,.894277,.134647,0,.439914,.894532,.126434,0,.456137,.894576,.1188,0,.472479,.894393,.111694,0,.48894,.893976,.105069,0,.505523,.893346,.0989077,0,.52223,.892502,.0931724,0,.539064,.891441,.0878276,0,.556028,.890276,.082903,0,.573125,.888972,.0783505,0,.590361,.887469,.0741083,0,.607741,.885785,.0701633,0,.62527,.883914,.0664835,0,.642957,.881872,.0630567,0,.660809,.879651,.0598527,0,.678836,.877267,.0568615,0,.69705,.874717,.05406,0,.715465,.872012,.0514378,0,.734098,.869157,.0489805,0,.752968,.866155,.0466727,0,.772101,.863014,.0445056,0,.791529,.859748,.0424733,0,.81129,.856416,.0405957,0,.831438,.852958,.0388273,0,.852044,.849382,.0371619,0,.87321,.845694,.0355959,0,.89509,.841893,.0341155,0,.917932,.837981,.0327141,0,.942204,.833963,.0313856,0,.968981,.829847,.0301275,0,1,1,.85214,0,0,.999969,.852095,0,.00279627,.999483,.851408,0,.0107635,.994545,.84579,0,.0206454,.986188,.835231,0,.0315756,.969847,.814687,0,.0432021,.945951,.783735,0,.0553396,.91917,.746074,0,.0678766,.895488,.706938,0,.0807395,.878232,.669534,0,.0938767,.868252,.635168,0,.10725,.863873,.603069,0,.120832,.863369,.572514,0,.134598,.86545,.543169,0,.148533,.868803,.514578,0,.16262,.872794,.486762,0,.176849,.87702,.459811,0,.19121,.881054,.433654,0,.205694,.884974,.408574,0,.220294,.888587,.384525,0,.235005,.891877,.36156,0,.24982,.894793,.339661,0,.264737,.89743,.318913,0,.279751,.899796,.299302,0,.294859,.901943,.280843,0,.310058,.903858,.263481,0,.325346,.905574,.247197,0,.340721,.907069,.231915,0,.356181,.908379,.217614,0,.371725,.90952,.20425,0,.387353,.910483,.191758,0,.403063,.91128,.180092,0,.418854,.911936,.169222,0,.434727,.912454,.159098,0,.450682,.912835,.149668,0,.466718,.913078,.140884,0,.482837,.913192,.132709,0,.499038,.913175,.125095,0,.515324,.91304,.118012,0,.531695,.912781,.111417,0,.548153,.91241,.105281,0,.5647,.911924,.0995691,0,.581338,.911331,.0942531,0,.59807,.910637,.0893076,0,.6149,.90984,.0846998,0,.63183,.908941,.0804044,0,.648865,.907944,.0763984,0,.666011,.906857,.0726638,0,.683273,.90568,.0691783,0,.700659,.904416,.0659222,0,.718176,.903067,.0628782,0,.735834,.901637,.0600307,0,.753646,.900128,.0573647,0,.771625,.898544,.0548668,0,.78979,.89689,.052527,0,.808162,.895165,.0503306,0,.826771,.893371,.0482668,0,.845654,.891572,.0463605,0,.864863,.889763,.0445998,0,.884472,.887894,.0429451,0,.904592,.885967,.0413884,0,.925407,.883984,.0399225,0,.947271,.881945,.0385405,0,.97105,.879854,.0372362,0,1,.999804,.995833,0,0,.938155,.933611,0,.0158731,.864755,.854311,0,.0317461,.888594,.865264,0,.0476191,.905575,.863922,0,.0634921,.915125,.850558,0,.0793651,.920665,.829254,0,.0952381,.924073,.802578,0,.111111,.926304,.772211,0,.126984,.927829,.739366,0,.142857,.928924,.705033,0,.15873,.92973,.670019,0,.174603,.930339,.634993,0,.190476,.930811,.600485,0,.206349,.931191,.566897,0,.222222,.93149,.534485,0,.238095,.931737,.503429,0,.253968,.931939,.473811,0,.269841,.932108,.445668,0,.285714,.93225,.418993,0,.301587,.932371,.393762,0,.31746,.932474,.369939,0,.333333,.932562,.347479,0,.349206,.932638,.326336,0,.365079,.932703,.306462,0,.380952,.93276,.287805,0,.396825,.932809,.270313,0,.412698,.932851,.253933,0,.428571,.932887,.23861,0,.444444,.932917,.224289,0,.460317,.932943,.210917,0,.47619,.932965,.19844,0,.492063,.932982,.186807,0,.507937,.932995,.175966,0,.52381,.933005,.165869,0,.539683,.933011,.156468,0,.555556,.933013,.147719,0,.571429,.933013,.139579,0,.587302,.93301,.132007,0,.603175,.933004,.124965,0,.619048,.932994,.118416,0,.634921,.932982,.112326,0,.650794,.932968,.106663,0,.666667,.93295,.101397,0,.68254,.932931,.0964993,0,.698413,.932908,.0919438,0,.714286,.932883,.0877057,0,.730159,.932856,.0837623,0,.746032,.932827,.0800921,0,.761905,.932796,.0766754,0,.777778,.932762,.0734936,0,.793651,.932727,.0705296,0,.809524,.932689,.0677676,0,.825397,.93265,.0651929,0,.84127,.932609,.0627917,0,.857143,.932565,.0605515,0,.873016,.932521,.0584606,0,.888889,.932474,.0565082,0,.904762,.932427,.0546841,0,.920635,.932377,.0529793,0,.936508,.932326,.0513851,0,.952381,.932274,.0498936,0,.968254,.93222,.0484975,0,.984127,.932164,.0471899,0,1],n=new Float32Array(e),s=new Float32Array(t),r=new gi(n,64,64,be,Ye,on,ye,ye,ve,me,1),a=new gi(s,64,64,be,Ye,on,ye,ye,ve,me,1);r.needsUpdate=!0,a.needsUpdate=!0;const o=new Uint16Array(e.length);e.forEach(function(h,f){o[f]=t9.toHalfFloat(h)});const l=new Uint16Array(t.length);t.forEach(function(h,f){l[f]=t9.toHalfFloat(h)});const c=new gi(o,64,64,be,Ke,on,ye,ye,ve,me,1),u=new gi(l,64,64,be,Ke,on,ye,ye,ve,me,1);return c.needsUpdate=!0,u.needsUpdate=!0,this.LTC_HALF_1=c,this.LTC_HALF_2=u,this.LTC_FLOAT_1=r,this.LTC_FLOAT_2=a,this}}vn.LTC_HALF_1=null;vn.LTC_HALF_2=null;vn.LTC_FLOAT_1=null;vn.LTC_FLOAT_2=null;class b8{static init(){vn.init();const{LTC_FLOAT_1:e,LTC_FLOAT_2:t,LTC_HALF_1:n,LTC_HALF_2:s}=vn;i0.LTC_FLOAT_1=e,i0.LTC_FLOAT_2=t,i0.LTC_HALF_1=n,i0.LTC_HALF_2=s}}const A=14,Fi=.16,w8=.08,Mt=2.2,yr=.05,R8=2.7,Nn=1.62,ys=.41,C8=.28,zn=.035,P8=2*(ys*.98+zn)+.18,Li=2*(ys+zn)+2*yr+.14,L8=4.2,D8=14,U8=60,I8=.035,N8=.04,g1=.035,I9=.0022,N9=1.18,F8=10,O8=42,Ar=1710096,br=3,Ei=3,B8=br+1,Ln=.55,z8=10524808,H8=.055,k8=6971984,V8=10130544,G8=.4,os=16775400,W8=3814952,wr=.48,As=1.15,bs=.42,X8=1.25,F9=.72,q8=16774360,Rr=16,Y8=.32,K8=.3,Z8=.85,Cr=.5,$8=.78,Pr=15788200,J8="./assets/backroom_wallpaper.webp",Oi=.76,ws=.55;function Lr(i,e=256){const t=document.createElement("canvas");t.width=t.height=e;const n=t.getContext("2d");i(n,e);const s=new L2(t);return s.wrapS=s.wrapT=zt,s.colorSpace=Ae,s.minFilter=ve,s.generateMipmaps=!1,s}function Dr(i){const e=i.image,t=(e==null?void 0:e.width)||1,n=(e==null?void 0:e.height)||1;return i.userData.tileW=Oi,i.userData.tileH=Oi*(n/t),i}const O9=new Map;function j8(i,e,t,n={}){var u,h;const s=`${e.toFixed(2)}|${t.toFixed(2)}`,r=O9.get(s);if(r)return r;const a=i.clone();a.wrapS=a.wrapT=zt;const o=((u=i.userData)==null?void 0:u.tileW)??Oi,l=((h=i.userData)==null?void 0:h.tileH)??Oi;a.repeat.set(e/o,t/l);const c=new _r({map:a,roughness:.92,metalness:0,...n});return O9.set(s,c),c}function Ur(i,e,t,n){const s=i.clone();return s.wrapS=s.wrapT=zt,s.repeat.set(t/e,n/e),s}function Ir(i,e,t,n,s,r){const a=Ur(i,e,t,n),o=l=>(l%1+1)%1;return a.offset.set(o(s/e),o(r/e)),a}function Rs(i){return new _r({map:i,color:Pr,roughness:.94,metalness:0,side:Je})}function Q8(){return Lr((i,e)=>{i.fillStyle="#e5e4ad",i.fillRect(0,0,e,e);for(let t=0;t<e;t+=3)for(let n=0;n<e;n+=3){const s=198+(n*17+t*31)%24;i.fillStyle=`rgb(${s+8},${s+4},${s-18})`,i.fillRect(n,t,2,2)}for(let t=0;t<200;t++){const n=Math.random()*e,s=Math.random()*e;i.fillStyle=`rgba(120,110,60,${.02+Math.random()*.05})`,i.fillRect(n,s,4+Math.random()*6,3+Math.random()*5)}})}function e6(i){return new Promise((e,t)=>{i.load(J8,n=>{n.wrapS=n.wrapT=zt,n.colorSpace=Ae,n.minFilter=ve,n.generateMipmaps=!1,Dr(n),e(n)},void 0,t)})}async function t6(i){try{return await e6(i)}catch{const e=Lr((t,n)=>{t.fillStyle="#e5e4ad",t.fillRect(0,0,n,n)});return Dr(e),e}}function Nr(...i){let e=i.reduce((n,s)=>(n^Math.imul(s|0,2654435761))>>>0,2654435769);const t=()=>{e+=1831565813;let n=Math.imul(e^e>>>15,1|e);return n^=n+Math.imul(n^n>>>7,61|n),((n^n>>>14)>>>0)/4294967296};return{next:t,range(n,s){return n+t()*(s-n)},int(n,s){return Math.floor(this.range(n,s+1))},pick(n){return n[Math.floor(t()*n.length)]},chance(n){return t()<n},pickWeighted(n){const s=n.reduce((a,[,o])=>a+o,0);let r=t()*s;for(const[a,o]of n)if(r-=o,r<=0)return a;return n[n.length-1][0]}}}const n6=[1.4,1.6,1.8,2,2.4,2.8,3.2,3.6,4],i6=[1.6,2,2.4,2.8,3.2,3.6,4,4.4];function s6(i){return i-Math.floor(i)}function U0(i,e){const t=e-.8;if(t<Li)return null;const n=n6.filter(o=>o<=t+.01),s=Math.max(Li,i.pick(n.length?n:[Li])),r=Math.min(s,t),a=Math.max(0,e/2-r/2-.25);return{width:r,offset:i.range(-a,a)}}function r6(i){const e=i.x1-i.x0,t=i.z1-i.z0;return Math.min(X8,e*.2,t*.2,.9)}function a6(i,e){const t=s=>s6(Math.sin(s*12.9898+e.lightSeed)*43758.5453),n=[];for(let s=0;s<e.zones.length;s++){const r=e.zones[s],a=r6(r),o=r.x0+a,l=r.x1-a,c=r.z0+a,u=r.z1-a,h=l-o,f=u-c;if(h<As||f<bs)continue;const m=Math.min(h,f)<5.2,g=m?i.pick([2.6,3,3.4]):e.lightSpacing,M=m?.14:.28;for(let p=o+g/2;p<l;p+=g)for(let d=c+g/2;d<u;d+=g)t(p*3.1+d+r.x0*.7)<M||n.push({x:p,z:d,zoneIdx:s,on:i.chance(m?F9*.92:F9),phase:i.range(0,Math.PI*2),bright:.9+t(d+r.z0)*.14})}return n}function Ti(i,e,t,n){const s=Math.min(i,t),r=Math.min(e,n),a=Math.max(i,t),o=Math.max(e,n),l=Nr(s,r,a,o,42),c=Math.max(Li,l.pick(i6)),u=Math.max(0,A/2-c/2-.5),h=c/2+.38,f=Math.min(u,h);return{width:c,offset:l.range(-f,f)}}function $n(i,e,t){return Math.max(P8+.35,i.range(e,t))}function B9(i,e=!1){const t=e||i.chance(.38),n=t?i.range(7.8,12.2):$n(i,3.4,5.8),s=i.range(.25,A-n-.25);return{kind:t?"wide-hall":"hall",zones:[{x0:0,z0:s,x1:A,z1:s+n}],innerWalls:[{axis:"z",pos:s,span0:0,span1:A,door:null},{axis:"z",pos:s+n,span0:0,span1:A,door:null}]}}function z9(i,e=!1){const t=e||i.chance(.38),n=t?i.range(7.8,12.2):$n(i,3.4,5.8),s=i.range(.25,A-n-.25);return{kind:t?"wide-hall":"hall",zones:[{x0:s,z0:0,x1:s+n,z1:A}],innerWalls:[{axis:"x",pos:s,span0:0,span1:A,door:null},{axis:"x",pos:s+n,span0:0,span1:A,door:null}]}}function o6(i,e){const t=i.range(5.5,13),n=i.range(5.5,13),r=i.chance(.45)&&i.chance(.5),a=r?Math.min(A-.4,t*i.range(1.15,1.55)):t,o=r?n:Math.min(A-.4,n*i.range(1.15,1.55));return{kind:"alcove",...{se:{zones:[{x0:A-a,z0:A-o,x1:A,z1:A}],innerWalls:[{axis:"x",pos:A-a,span0:A-o,span1:A,door:U0(i,o)},{axis:"z",pos:A-o,span0:A-a,span1:A,door:U0(i,a)}]},sw:{zones:[{x0:0,z0:A-o,x1:a,z1:A}],innerWalls:[{axis:"x",pos:a,span0:A-o,span1:A,door:U0(i,o)},{axis:"z",pos:A-o,span0:0,span1:a,door:U0(i,a)}]},ne:{zones:[{x0:A-a,z0:0,x1:A,z1:o}],innerWalls:[{axis:"x",pos:A-a,span0:0,span1:o,door:U0(i,o)},{axis:"z",pos:o,span0:A-a,span1:A,door:U0(i,a)}]},nw:{zones:[{x0:0,z0:0,x1:a,z1:o}],innerWalls:[{axis:"x",pos:a,span0:0,span1:o,door:U0(i,o)},{axis:"z",pos:o,span0:0,span1:a,door:U0(i,a)}]}}[e]}}function Fr(i,e){const t=i.range(4.8,9.2),n=i.range(4.8,9.2);return{kind:"L",...{nw:{zones:[{x0:0,z0:n,x1:A,z1:A},{x0:t,z0:0,x1:A,z1:n}],innerWalls:[{axis:"z",pos:n,span0:0,span1:t,door:null},{axis:"x",pos:t,span0:0,span1:n,door:U0(i,n)}]},ne:{zones:[{x0:0,z0:n,x1:A,z1:A},{x0:0,z0:0,x1:A-t,z1:n}],innerWalls:[{axis:"z",pos:n,span0:A-t,span1:A,door:null},{axis:"x",pos:A-t,span0:0,span1:n,door:U0(i,n)}]},sw:{zones:[{x0:0,z0:0,x1:A,z1:A-n},{x0:t,z0:A-n,x1:A,z1:A}],innerWalls:[{axis:"z",pos:A-n,span0:0,span1:t,door:null},{axis:"x",pos:t,span0:A-n,span1:A,door:U0(i,A-n)}]},se:{zones:[{x0:0,z0:0,x1:A,z1:A-n},{x0:0,z0:A-n,x1:A-t,z1:A}],innerWalls:[{axis:"z",pos:A-n,span0:A-t,span1:A,door:null},{axis:"x",pos:A-t,span0:A-n,span1:A,door:U0(i,A-n)}]}}[e]}}function l6(i){const e=i.chance(.62),t=e?i.range(9,13.2):i.range(5.5,10),n=e?i.range(4.5,7.5):i.range(7,12.5),s=e&&i.chance(.55),r=s?t:n,a=s?n:t,o=i.range(.3,A-r-.3),l=i.range(.3,A-a-.3),c=o+r,u=l+a,h=[];return o>.2&&h.push({axis:"x",pos:o,span0:l,span1:u,door:i.chance(.5)?U0(i,a):null}),c<A-.2&&h.push({axis:"x",pos:c,span0:l,span1:u,door:i.chance(.5)?U0(i,a):null}),l>.2&&h.push({axis:"z",pos:l,span0:o,span1:c,door:i.chance(.5)?U0(i,r):null}),u<A-.2&&h.push({axis:"z",pos:u,span0:o,span1:c,door:i.chance(.5)?U0(i,r):null}),{kind:e?"elongated":"slab",zones:[{x0:o,z0:l,x1:c,z1:u}],innerWalls:h}}function c6(i,e){const t=i.range(9.5,13.2),n=$n(i,3.6,6.2),s=(A-n)/2,r=s+n;i.range(9,12.5);const a=i.range(9,12.5);return{kind:"T",...{south:{zones:[{x0:0,z0:0,x1:A,z1:t},{x0:s,z0:t,x1:r,z1:A}],innerWalls:[{axis:"z",pos:t,span0:0,span1:s,door:null},{axis:"z",pos:t,span0:r,span1:A,door:null},{axis:"x",pos:s,span0:t,span1:A,door:U0(i,A-t)},{axis:"x",pos:r,span0:t,span1:A,door:U0(i,A-t)}]},north:{zones:[{x0:0,z0:A-t,x1:A,z1:A},{x0:s,z0:0,x1:r,z1:A-t}],innerWalls:[{axis:"z",pos:A-t,span0:0,span1:s,door:null},{axis:"z",pos:A-t,span0:r,span1:A,door:null},{axis:"x",pos:s,span0:0,span1:A-t,door:U0(i,A-t)},{axis:"x",pos:r,span0:0,span1:A-t,door:U0(i,A-t)}]},east:{zones:[{x0:0,z0:0,x1:a,z1:A},{x0:a,z0:s,x1:A,z1:r}],innerWalls:[{axis:"x",pos:a,span0:0,span1:s,door:null},{axis:"x",pos:a,span0:r,span1:A,door:null},{axis:"z",pos:s,span0:a,span1:A,door:U0(i,A-a)},{axis:"z",pos:r,span0:a,span1:A,door:U0(i,A-a)}]},west:{zones:[{x0:A-a,z0:0,x1:A,z1:A},{x0:0,z0:s,x1:A-a,z1:r}],innerWalls:[{axis:"x",pos:A-a,span0:0,span1:s,door:null},{axis:"x",pos:A-a,span0:r,span1:A,door:null},{axis:"z",pos:s,span0:0,span1:A-a,door:U0(i,A-a)},{axis:"z",pos:r,span0:0,span1:A-a,door:U0(i,A-a)}]}}[e]}}function u6(i){if(i.chance(.5)){const r=i.range(5.5,8.5),a=i.range(.4,2.5),o=i.range(A-2.5,A-.4);return{kind:"twin",zones:[{x0:0,z0:a,x1:r,z1:o},{x0:r,z0:a,x1:A,z1:o}],innerWalls:[{axis:"x",pos:r,span0:a,span1:o,door:U0(i,o-a)}]}}const t=i.range(5.5,8.5),n=i.range(.4,2.5),s=i.range(A-2.5,A-.4);return{kind:"twin",zones:[{x0:n,z0:0,x1:s,z1:t},{x0:n,z0:t,x1:s,z1:A}],innerWalls:[{axis:"z",pos:t,span0:n,span1:s,door:U0(i,s-n)}]}}function h6(i){if(i.chance(.5)){const n=i.range(4,5.6),s=i.range(8.4,10);return{kind:"triple",zones:[{x0:0,z0:0,x1:n,z1:A},{x0:n,z0:0,x1:s,z1:A},{x0:s,z0:0,x1:A,z1:A}],innerWalls:[{axis:"x",pos:n,span0:0,span1:A,door:U0(i,A)},{axis:"x",pos:s,span0:0,span1:A,door:U0(i,A)}]}}const e=i.range(4,5.6),t=i.range(8.4,10);return{kind:"triple",zones:[{x0:0,z0:0,x1:A,z1:e},{x0:0,z0:e,x1:A,z1:t},{x0:0,z0:t,x1:A,z1:A}],innerWalls:[{axis:"z",pos:e,span0:0,span1:A,door:U0(i,A)},{axis:"z",pos:t,span0:0,span1:A,door:U0(i,A)}]}}function f6(i){const e=i.range(3.8,5.8),t=i.range(4.8,7.2);return{kind:"U",zones:[{x0:0,z0:0,x1:e,z1:A},{x0:A-e,z0:0,x1:A,z1:A},{x0:0,z0:A-t,x1:A,z1:A}],innerWalls:[{axis:"x",pos:e,span0:0,span1:A-t,door:U0(i,A-t)},{axis:"x",pos:A-e,span0:0,span1:A-t,door:U0(i,A-t)}]}}function d6(i){const e=i.range(2.8,4.2),t=e,n=e,s=A-e,r=A-e;return{kind:"hub",zones:[{x0:0,z0:0,x1:A,z1:n},{x0:0,z0:r,x1:A,z1:A},{x0:0,z0:n,x1:t,z1:r},{x0:s,z0:n,x1:A,z1:r},{x0:t,z0:n,x1:s,z1:r}],innerWalls:[{axis:"z",pos:n,span0:t,span1:s,door:U0(i,s-t)},{axis:"z",pos:r,span0:t,span1:s,door:U0(i,s-t)},{axis:"x",pos:t,span0:n,span1:r,door:U0(i,r-n)},{axis:"x",pos:s,span0:n,span1:r,door:U0(i,r-n)}]}}function p6(i){const e=i.range(5.5,8.5),t=$n(i,3.6,5.4);return i.chance(.5)?{kind:"zigzag",zones:[{x0:0,z0:0,x1:e,z1:t},{x0:e,z0:0,x1:A,z1:A},{x0:0,z0:t,x1:e,z1:A}],innerWalls:[{axis:"z",pos:t,span0:0,span1:e,door:null},{axis:"x",pos:e,span0:t,span1:A,door:U0(i,A-t)}]}:{kind:"zigzag",zones:[{x0:0,z0:0,x1:t,z1:e},{x0:0,z0:e,x1:A,z1:A},{x0:t,z0:0,x1:A,z1:e}],innerWalls:[{axis:"x",pos:t,span0:0,span1:e,door:null},{axis:"z",pos:e,span0:t,span1:A,door:U0(i,A-t)}]}}function m6(i){const e=$n(i,3.6,5.2),t=i.range(.3,A-e-.3),n=i.range(3.2,5.2),s=i.pick(["left","right"]),r=[{x0:0,z0:t,x1:A,z1:t+e}],a=[{axis:"z",pos:t,span0:0,span1:A,door:null},{axis:"z",pos:t+e,span0:0,span1:A,door:null}];return s==="left"?(r.push({x0:0,z0:t+e,x1:n,z1:A}),a.push({axis:"x",pos:n,span0:t+e,span1:A,door:U0(i,A-t-e)})):(r.push({x0:A-n,z0:t+e,x1:A,z1:A}),a.push({axis:"x",pos:A-n,span0:t+e,span1:A,door:U0(i,A-t-e)})),{kind:"hall-pockets",zones:r,innerWalls:a}}function _6(i){const e=Fr(i,i.pick(["nw","ne","sw","se"])),t=i.range(3,4.8),n=i.pick(["nw","ne","sw","se"]),r={nw:{x0:0,z0:0,x1:t,z1:t},ne:{x0:A-t,z0:0,x1:A,z1:t},sw:{x0:0,z0:A-t,x1:t,z1:A},se:{x0:A-t,z0:A-t,x1:A,z1:A}}[n];return e.zones.push(r),r.x1<A-.2&&e.innerWalls.push({axis:"x",pos:r.x1,span0:r.z0,span1:r.z1,door:U0(i,r.z1-r.z0)}),r.z1<A-.2&&e.innerWalls.push({axis:"z",pos:r.z1,span0:r.x0,span1:r.x1,door:U0(i,r.x1-r.x0)}),e.kind="compound",e}function g6(i){switch(i.pickWeighted([["full",3],["hall-ew",10],["hall-ns",10],["wide-hall-ew",5],["wide-hall-ns",5],["alcove",12],["L",14],["elongated",8],["T",10],["twin",10],["triple",9],["U",8],["hub",9],["zigzag",8],["hall-pockets",10],["compound",9]])){case"full":return{kind:"full",zones:[{x0:0,z0:0,x1:A,z1:A}],innerWalls:[]};case"hall-ew":return B9(i);case"hall-ns":return z9(i);case"wide-hall-ew":return B9(i,!0);case"wide-hall-ns":return z9(i,!0);case"alcove":return o6(i,i.pick(["nw","ne","sw","se"]));case"L":return Fr(i,i.pick(["nw","ne","sw","se"]));case"elongated":return l6(i);case"T":return c6(i,i.pick(["north","south","east","west"]));case"twin":return u6(i);case"triple":return h6(i);case"U":return f6(i);case"hub":return d6(i);case"zigzag":return p6(i);case"hall-pockets":return m6(i);case"compound":return _6(i);default:return{kind:"full",zones:[{x0:0,z0:0,x1:A,z1:A}],innerWalls:[]}}}function yi(i,e){const t=Nr(i,e,7),n=g6(t),s={cx:i,cz:e,kind:n.kind,zones:n.zones,innerWalls:n.innerWalls,height:R8,doors:{north:Ti(i,e,i,e-1),south:Ti(i,e,i,e+1),east:Ti(i,e,i+1,e),west:Ti(i,e,i-1,e)},lightSeed:t.int(0,99999),lightSpacing:t.pick([3.4,3.8,4.2,4.6,5])};return s.panels=a6(t,s),s.litRatio=s.panels.length>0?s.panels.filter(r=>r.on).length/s.panels.length:0,s}function St(i,e,t,n,s,r,a){t-e<.02||s-n<.02||a-r<.02||i.push({minX:e,maxX:t,minZ:n,maxZ:s,minY:r,maxY:a})}function Or(i){return i.width*.5-yr}function ls(i,e,t,n,s,r,a){const o=Fi;if(!s){St(i,t,n,e-o,e+o,r,a);return}const l=(t+n)/2+s.offset,c=Or(s),u=l-c,h=l+c,f=r+Mt+.08;St(i,t,u,e-o,e+o,r,f),St(i,h,n,e-o,e+o,r,f),St(i,t,n,e-o,e+o,r+Mt,a)}function cs(i,e,t,n,s,r,a){const o=Fi;if(!s){St(i,e-o,e+o,t,n,r,a);return}const l=(t+n)/2+s.offset,c=Or(s),u=l-c,h=l+c,f=r+Mt+.08;St(i,e-o,e+o,t,u,r,f),St(i,e-o,e+o,h,n,r,f),St(i,e-o,e+o,t,n,r+Mt,a)}function x6(i,e,t,n,s,r){n.axis==="x"?cs(i,e+n.pos,t+n.span0,t+n.span1,n.door,s,r):ls(i,t+n.pos,e+n.span0,e+n.span1,n.door,s,r)}function H9(i,e){const t=e.cx*A,n=e.cz*A,s=0,r=e.height,a=t,o=t+A,l=n,c=n+A,u=[],h=(f,m)=>{if(i.has(f))return;const g=m();i.set(f,g),u.push(...g)};return h(`ex,${e.cx+1},${e.cz}`,()=>{const f=[];return cs(f,o,l,c,e.doors.east,s,r),f}),h(`ez,${e.cx},${e.cz+1}`,()=>{const f=[];return ls(f,c,a,o,e.doors.south,s,r),f}),h(`wx,${e.cx},${e.cz}`,()=>{const f=[];return cs(f,a,l,c,e.doors.west,s,r),f}),h(`nz,${e.cx},${e.cz}`,()=>{const f=[];return ls(f,l,a,o,e.doors.north,s,r),f}),e.innerWalls.forEach((f,m)=>{h(`iw,${e.cx},${e.cz},${m}`,()=>{const g=[];return x6(g,t,n,f,s,r),g})}),u}const v6=40;let qn=0;function M6(){qn=0}function S6(){return qn>=v6?!1:(qn++,!0)}function k9(i){qn=Math.max(0,qn-i)}const E6=new He(-Math.PI/2,0,0),T6=new Vt(As,bs),V9=new Vt(A,A),y6=new O0(os);function cn(i,e,t,n,s,r,a,o){const l=(r+a)/2+((o==null?void 0:o.offset)||0),c=o?o.width/2:0,u=(h,f,m,g)=>{const M=f-h;if(M<.1)return;const p=(h+f)/2,d=g<=.001?w8:0,b=m+d,y=g+m/2-d/2,S=n==="z"?new kt(M,b,Fi):new kt(Fi,b,M),I=j8(e,M,b),L=new we(S,I);n==="z"?L.position.set(p,y,s):L.position.set(s,y,p),i.add(L)};o?(u(r,l-c,Mt,0),u(l+c,a,Mt,0),u(r,a,t-Mt,Mt)):u(r,a,t,0)}function A6(i,e,t,n){n.axis==="x"?cn(i,e,t,"x",n.pos,n.span0,n.span1,n.door):cn(i,e,t,"z",n.pos,n.span0,n.span1,n.door)}function b6(i,e,t,n){cn(i,t,n,"z",0,0,A,e.doors.north),cn(i,t,n,"z",A,0,A,e.doors.south),cn(i,t,n,"x",0,0,A,e.doors.west),cn(i,t,n,"x",A,0,A,e.doors.east);for(const s of e.innerWalls)A6(i,t,n,s)}function w6(i,e){return i.panels.some(t=>(t.zoneIdx??0)===e&&t.on)}function R6(i,e,t,n){for(let s=0;s<e.zones.length;s++){if(!w6(e,s))continue;const r=e.zones[s],a=r.x1-r.x0,o=r.z1-r.z0;if(a<.1||o<.1)continue;const l=(r.x0+r.x1)/2,c=(r.z0+r.z1)/2,u=Ir(t.carpetTex,ws,a,o,n.worldX+r.x0,n.worldZ+r.z0),h=new we(new Vt(a,o),Rs(u));h.rotation.x=-Math.PI/2,h.position.set(l,.004,c),i.add(h)}}function C6(i,e,t,n,s){const r=t-.012,a=n.on&&S6(),o=new we(T6,a?e.lightPanelOn.clone():e.lightPanelOff);if(o.rotation.x=Math.PI/2,o.position.set(n.x,r,n.z),o.userData.panel=n,n.face=o,i.add(o),!a)return;o.userData.fluorescent=!0,o.material.color.copy(y6).multiplyScalar(wr*n.bright);const l=new H2(q8,Rr*n.bright,As,bs);l.position.set(n.x,r,n.z),l.rotation.copy(E6),i.add(l),n.light=l,s.push({light:l,panel:n,face:o})}function Br(i,e){const t=new Un;return t.position.set(i.cx*A,0,i.cz*A),{room:i,group:t,materials:e,panelIdx:0,shellDone:!1,fixtures:[],lightCount:0,worldX:i.cx*A,worldZ:i.cz*A}}function zr(i){if(i.shellDone)return;const{room:e,group:t,materials:n}=i,s=e.height,r=new we(V9,n.carpetBase);r.rotation.x=-Math.PI/2,t.add(r),R6(t,e,n,i);const a=Ir(n.carpetTex,ws,A,A,i.worldX,i.worldZ),o=new we(V9,Rs(a));o.rotation.x=Math.PI/2,o.position.y=s,t.add(o),b6(t,e,n.wallTex,s),i.shellDone=!0}function Hr(i,e){const{room:t,group:n,materials:s}=i,r=t.height;let a=0;for(;i.panelIdx<t.panels.length&&a<e;){const o=t.panels[i.panelIdx];C6(n,s,r,o,i.fixtures),o.light&&i.lightCount++,i.panelIdx++,a++}return i.panelIdx>=t.panels.length}function kr(i){const{group:e,room:t,fixtures:n,lightCount:s}=i;return e.userData.room=t,e.userData.fixtures=n,e.userData.lightCount=s,e}function x1(i,e){const t=Br(i,e);return zr(t),Hr(t,i.panels.length),kr(t)}const P6=2,G9=2;class L6{constructor(e,t){this.scene=e,this.materials=t,this.chunks=new Map,this.wallMap=new Map,this.colliders=[],this.collidersDirty=!1,this.pendingColliderRebuild=!1,this.time=0,this.loadQueue=[],this.pendingKeys=new Set,this.disposeQueue=[],this.fixtures=[],this.cellCx=NaN,this.cellCz=NaN,this.lastPrefetchEdge=!1,this.preloading=!1}key(e,t){return`${e},${t}`}distToPlayer(e,t,n){const s=e*A+A/2-n.x,r=t*A+A/2-n.z;return s*s+r*r}nearPrefetchEdge(e,t,n){const s=e.x-t*A,r=e.z-n*A,a=A*Ln;return s>a||s<A-a||r>a||r<A-a}ringKeys(e,t,n){const s=new Set;for(let r=t-n;r<=t+n;r++)for(let a=e-n;a<=e+n;a++)s.add(this.key(a,r));return s}computeNeed(e,t,n,s=B8){const r=this.ringKeys(e,t,s),a=n.x-e*A,o=n.z-t*A;if(a>A*Ln)for(const l of this.ringKeys(e+1,t,s))r.add(l);if(a<A*(1-Ln))for(const l of this.ringKeys(e-1,t,s))r.add(l);if(o>A*Ln)for(const l of this.ringKeys(e,t+1,s))r.add(l);if(o<A*(1-Ln))for(const l of this.ringKeys(e,t-1,s))r.add(l);return r}insertJob(e){const t=e.dist;let n=0,s=this.loadQueue.length;for(;n<s;){const r=n+s>>1;this.loadQueue[r].dist<t?n=r+1:s=r}this.loadQueue.splice(n,0,e)}addCollidersForRoom(e){const t=H9(this.wallMap,e);t.length&&(this.colliders.push(...t),this.collidersDirty=!0)}rebuildColliders(){this.wallMap.clear(),this.colliders=[];for(const{room:e}of this.chunks.values())this.colliders.push(...H9(this.wallMap,e));this.collidersDirty=!0,this.pendingColliderRebuild=!1}addFixtures(e){const t=e.userData.fixtures;t!=null&&t.length&&this.fixtures.push(...t)}removeFixtures(e){const t=e.userData.fixtures;if(!(t!=null&&t.length))return;const n=new Set(t);this.fixtures=this.fixtures.filter(s=>!n.has(s))}consumeColliderRebuild(){const e=this.collidersDirty;return this.collidersDirty=!1,e}attachChunk(e,t,n,s){const r=this.key(e,t);kr(s),this.chunks.set(r,{mesh:s.group,room:n}),this.addFixtures(s.group)}spawnComplete(e,t){const n=yi(e,t);this.addCollidersForRoom(n);const s=x1(n,this.materials);this.scene.add(s),this.chunks.set(this.key(e,t),{mesh:s,room:n}),this.addFixtures(s)}despawn(e){const t=this.chunks.get(e);if(!t)return;const{mesh:n}=t;n&&(this.removeFixtures(n),k9(n.userData.lightCount||0),this.scene.remove(n),this.disposeQueue.push(n)),this.chunks.delete(e),this.pendingColliderRebuild=!0}enqueue(e,t,n){const s=this.key(e,t);this.chunks.has(s)||this.pendingKeys.has(s)||(this.pendingKeys.add(s),this.insertJob({cx:e,cz:t,dist:this.distToPlayer(e,t,n),room:null,build:null}))}init(e){M6();const t=Math.floor(e.x/A),n=Math.floor(e.z/A);this.cellCx=t,this.cellCz=n,this.lastPrefetchEdge=this.nearPrefetchEdge(e,t,n),this.spawnComplete(t,n)}update(e){if(this.preloading)return;const t=Math.floor(e.x/A),n=Math.floor(e.z/A),s=this.nearPrefetchEdge(e,t,n);if(t===this.cellCx&&n===this.cellCz&&s===this.lastPrefetchEdge&&!this.loadQueue.length&&!this.pendingColliderRebuild)return;this.cellCx=t,this.cellCz=n,this.lastPrefetchEdge=s;const r=this.computeNeed(t,n,e),a=this.loadQueue.length;for(const o of[...this.chunks.keys()])r.has(o)||this.despawn(o);this.loadQueue=this.loadQueue.filter(o=>r.has(this.key(o.cx,o.cz))),this.loadQueue.length<a&&(this.pendingColliderRebuild=!0);for(const o of this.pendingKeys)!r.has(o)&&!this.chunks.has(o)&&this.pendingKeys.delete(o);for(const o of r)if(!this.chunks.has(o)){const[l,c]=o.split(",").map(Number);this.enqueue(l,c,e)}}_isPrefetchOnly(e,t,n){const s=Math.floor(n.x/A),r=Math.floor(n.z/A);return Math.max(Math.abs(e-s),Math.abs(t-r))>br}_finishPrefetchJob(e){var r;const t=this.key(e.cx,e.cz);(r=e.build)!=null&&r.group&&(this.removeFixtures(e.build.group),k9(e.build.group.userData.lightCount||0),this.scene.remove(e.build.group),e.build.group.traverse(a=>{var o;return(o=a.geometry)==null?void 0:o.dispose()})),this.chunks.delete(t);const n=e.room||yi(e.cx,e.cz);e.room||this.addCollidersForRoom(n);const s=x1(n,this.materials);this.scene.add(s),this.chunks.set(t,{mesh:s,room:n}),this.addFixtures(s),this.loadQueue.shift(),this.pendingKeys.delete(t),this.pendingColliderRebuild=!0}processLoadQueue(e,t=6,n={}){const s=n.panelsPerFrame??(t>=12?999:P6),r=performance.now(),a=()=>t<1e8&&performance.now()-r>=t;for(this.disposeQueue.length&&!a()&&this.disposeQueue.shift().traverse(l=>{var c;return(c=l.geometry)==null?void 0:c.dispose()}),this.pendingColliderRebuild&&!a()&&this.rebuildColliders();this.loadQueue.length&&!a();){const o=this.loadQueue[0],l=this.key(o.cx,o.cz);if(this._isPrefetchOnly(o.cx,o.cz,e)&&(!o.build||!o.build.shellDone)){this._finishPrefetchJob(o);continue}if(!o.room){o.room=yi(o.cx,o.cz),this.addCollidersForRoom(o.room),o.dist=this.distToPlayer(o.cx,o.cz,e);continue}if(o.build||(o.build=Br(o.room,this.materials)),!o.build.shellDone){zr(o.build),this.scene.add(o.build.group),this.chunks.set(l,{mesh:o.build.group,room:o.room});continue}if(Hr(o.build,s))this.attachChunk(o.cx,o.cz,o.room,o.build),this.loadQueue.shift(),this.pendingKeys.delete(l);else break}}tick(e){this.time+=e}getColliders(){return this.colliders}flushColliders(){this.pendingColliderRebuild&&this.rebuildColliders()}getFixtures(){return this.fixtures}_spawnChunkComplete(e,t){const n=this.key(e,t),s=yi(e,t);this.addCollidersForRoom(s);const r=x1(s,this.materials);this.scene.add(r),this.chunks.set(n,{mesh:r,room:s}),this.addFixtures(r),this.pendingKeys.delete(n)}async preloadAround(e,t){const n=Math.floor(e.x/A),s=Math.floor(e.z/A),r=[];for(let l=s-Ei;l<=s+Ei;l++)for(let c=n-Ei;c<=n+Ei;c++)this.chunks.has(this.key(c,l))||r.push({cx:c,cz:l});r.sort((l,c)=>this.distToPlayer(l.cx,l.cz,e)-this.distToPlayer(c.cx,c.cz,e)),this.preloading=!0,this.loadQueue.length=0,this.pendingKeys.clear();const a=r.length;let o=0;for(let l=0;l<r.length;l+=G9){const c=Math.min(l+G9,r.length);for(let u=l;u<c;u++){const{cx:h,cz:f}=r[u];this._spawnChunkComplete(h,f),o++}t==null||t(o,a||1),await new Promise(u=>requestAnimationFrame(u))}this.pendingColliderRebuild?this.rebuildColliders():this.flushColliders(),this.preloading=!1,t==null||t(a||1,a||1)}hasPendingLoads(){return!this.preloading&&(this.loadQueue.length>0||this.pendingColliderRebuild)}}const D6=3.2,U6=5.8,I6=9,N6=.035,F6=ys*.98,O6=.008,W9=new He(0,0,0,"YXZ"),v1=new O,M1=new O,rt=new O,Ut=new O,rn=new O,ne=[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]];class B6{constructor(e,t){this.camera=e,this.domElement=t,this.position=new O(A/2,Nn,A/2),this.yaw=0,this.pitch=0,this.keys={},this.locked=!1,this.colliders=[],this.bob=0,this.vy=0,this.grounded=!0,this._onKeyDown=n=>{n.code==="Space"&&(n.preventDefault(),this.locked&&this.grounded&&(this.vy=L8,this.grounded=!1)),this.keys[n.code]=!0,n.code==="KeyR"&&this._unstuck()},this._onKeyUp=n=>{this.keys[n.code]=!1},this._onMouseMove=n=>{this.locked&&(this.yaw-=n.movementX*I9,this.pitch-=n.movementY*I9,this.pitch=bn.clamp(this.pitch,-N9,N9))},this._onLockChange=()=>{this.locked=document.pointerLockElement===this.domElement}}connect(){window.addEventListener("keydown",this._onKeyDown),window.addEventListener("keyup",this._onKeyUp),document.addEventListener("mousemove",this._onMouseMove),document.addEventListener("pointerlockchange",this._onLockChange)}requestLock(){this.domElement.requestPointerLock()}setColliders(e){this.colliders=e}_unstuck(){this.position.set(A/2,Nn,A/2),this.vy=0,this.grounded=!0}_fillBodyPoints(e,t){const n=Math.cos(this.yaw),s=Math.sin(this.yaw),r=F6,a=C8;ne[0][0]=e+n*a+s*r,ne[0][1]=t+s*a-n*r,ne[1][0]=e+n*a-s*r,ne[1][1]=t+s*a+n*r,ne[2][0]=e-n*a+s*r,ne[2][1]=t-s*a-n*r,ne[3][0]=e-n*a-s*r,ne[3][1]=t-s*a+n*r,ne[4][0]=e+s*r,ne[4][1]=t-n*r,ne[5][0]=e-s*r,ne[5][1]=t+n*r,ne[6][0]=e+n*a,ne[6][1]=t+s*a,ne[7][0]=e-n*a,ne[7][1]=t-s*a;for(let o=0;o<4;o++){const l=o/4*Math.PI*2,c=Math.cos(l),u=Math.sin(l);ne[8+o][0]=e+n*(a*.55*c+.01)+s*(r*u),ne[8+o][1]=t+s*(a*.55*c+.01)-n*(r*u)}}_sampleHitsWall(e,t,n,s){for(const r of this.colliders)if(!(n<r.minY-.2||n>r.maxY+.2)&&e+s>r.minX&&e-s<r.maxX&&t+s>r.minZ&&t-s<r.maxZ)return!0;return!1}_bodyOverlaps(e,t){const n=this.position.y,s=zn;this._fillBodyPoints(e,t);for(let r=0;r<12;r++)if(this._sampleHitsWall(ne[r][0],ne[r][1],n,s))return!0;return this._sampleHitsWall(e,t,n,zn*.5)}_pushSample(e,t,n,s,r,a){let o=!1;for(const l of this.colliders){if(r<l.minY-.2||r>l.maxY+.2||e+a<=l.minX||e-a>=l.maxX||t+a<=l.minZ||t-a>=l.maxZ)continue;const c=e+a-l.minX,u=l.maxX-(e-a),h=t+a-l.minZ,f=l.maxZ-(t-a),m=Math.min(c,u,h,f);m===c?n-=c:m===u?n+=u:m===h?s-=h:s+=f,o=!0}return{px:n,pz:s,hit:o}}_pushOut(e,t){const n=this.position.y,s=zn;for(let r=0;r<48;r++){this._fillBodyPoints(e,t);let a=!1;for(let o=0;o<12;o++){const l=this._pushSample(ne[o][0],ne[o][1],e,t,n,s);e=l.px,t=l.pz,l.hit&&(a=!0)}if(!a)break}return{px:e,pz:t}}_tryMove(e,t,n,s){const r=this._pushOut(e+n,t+s);if(!this._bodyOverlaps(r.px,r.pz))return r;const a=this._pushOut(e+n,t);if(!this._bodyOverlaps(a.px,a.pz)){const l=this._pushOut(a.px,t+s);return this._bodyOverlaps(l.px,l.pz)?a:l}const o=this._pushOut(e,t+s);return this._bodyOverlaps(o.px,o.pz)?{px:e,pz:t}:o}_moveSlide(e,t,n,s){const r=Math.hypot(n,s),a=Math.max(1,Math.ceil(r/O6)),o=n/a,l=s/a;for(let c=0;c<a;c++){const u=this._tryMove(e,t,o,l);e=u.px,t=u.pz}return{px:e,pz:t}}_pointInsideCollider(e,t,n,s=0){for(const r of this.colliders)if(!(t<r.minY-s||t>r.maxY+s)&&e>=r.minX-s&&e<=r.maxX+s&&n>=r.minZ-s&&n<=r.maxZ+s)return!0;return!1}_adjustCameraForWalls(e,t,n,s,r){const a=N8;let o=e,l=t,c=n;for(let u=0;u<6;u++){let h=!1;for(const f of this.colliders){if(l<f.minY-.2||l>f.maxY+.2)continue;const m=bn.clamp(o,f.minX,f.maxX),g=bn.clamp(c,f.minZ,f.maxZ),M=o-m,p=c-g,d=M*M+p*p;if(!(d>=a*a)){if(d<1e-8){const b=o-f.minX,y=f.maxX-o,S=c-f.minZ,I=f.maxZ-c,L=Math.min(b,y,S,I);L===b?o+=a-b:L===y?o-=a-y:L===S?c+=a-S:c-=a-I}else{const b=Math.sqrt(d),y=(a-b)/b;o+=M*y,c+=p*y}h=!0}}if(!h)break}Ut.set(-Math.sin(s)*Math.cos(r),Math.sin(r),-Math.cos(s)*Math.cos(r)).normalize();for(let u=.04;u<=.45;u+=.04){const h=o+Ut.x*u,f=l+Ut.y*u,m=c+Ut.z*u;if(this._pointInsideCollider(h,f,m,.03)){o-=Ut.x*(u+.03),l-=Ut.y*(u+.03),c-=Ut.z*(u+.03);break}}this._fillBodyPoints(o,c);for(let u=0;u<12;u++){const h=ne[u][0],f=ne[u][1];for(const m of this.colliders){if(l<m.minY-.2||l>m.maxY+.2)continue;const g=bn.clamp(h,m.minX,m.maxX),M=bn.clamp(f,m.minZ,m.maxZ),p=h-g,d=f-M,b=p*p+d*d;if(b>=a*a||b<1e-8)continue;const y=Math.sqrt(b),S=(a-y)/y;o+=p*S,c+=d*S}}return rn.set(o-e,l-t,c-n),rn.lengthSq()>g1*g1&&rn.setLength(g1),{x:e+rn.x,y:t+rn.y,z:n+rn.z}}resolvePenetration(){const e=this.position.x,t=this.position.z,n=this._pushOut(this.position.x,this.position.z);if(this._bodyOverlaps(n.px,n.pz)){this.position.x=e,this.position.z=t;const s=this._pushOut(e,t);this.position.x=s.px,this.position.z=s.pz;return}this.position.x=n.px,this.position.z=n.pz}update(e){v1.set(-Math.sin(this.yaw),0,-Math.cos(this.yaw)),M1.set(Math.cos(this.yaw),0,-Math.sin(this.yaw)),rt.set(0,0,0),(this.keys.KeyW||this.keys.ArrowUp)&&rt.add(v1),(this.keys.KeyS||this.keys.ArrowDown)&&rt.sub(v1),(this.keys.KeyA||this.keys.ArrowLeft)&&rt.sub(M1),(this.keys.KeyD||this.keys.ArrowRight)&&rt.add(M1);const t=this.keys.ShiftLeft||this.keys.ShiftRight,n=t?U6:D6;if(rt.lengthSq()>0){rt.normalize().multiplyScalar(n*e);const o=this._moveSlide(this.position.x,this.position.z,rt.x,rt.z);this.position.x=o.px,this.position.z=o.pz,this.grounded&&(this.bob+=e*I6*(t?1.3:1))}else this.grounded&&(this.bob*=.85);this.vy-=D8*e,this.position.y+=this.vy*e,this.position.y<=Nn?(this.position.y=Nn,this.vy=0,this.grounded=!0):this.grounded=!1;const s=this.grounded?Math.sin(this.bob)*N6:0,r=this.position.y+s,a=this._adjustCameraForWalls(this.position.x,r,this.position.z,this.yaw,this.pitch);this.camera.position.set(a.x,a.y,a.z),this.camera.up.set(0,1,0),W9.set(this.pitch,this.yaw,0),this.camera.quaternion.setFromEuler(W9),this.resolvePenetration()}}const Di={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class Jn{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const z6=new gr(-1,1,1,-1,0,1);class H6 extends yt{constructor(){super(),this.setAttribute("position",new ht([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new ht([0,2,0,0,2,0],2))}}const k6=new H6;class Vr{constructor(e){this._mesh=new we(k6,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,z6)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class V6 extends Jn{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof Pe?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Ni.clone(e.uniforms),this.material=new Pe({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new Vr(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class X9 extends Jn{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){const s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class G6 extends Jn{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class W6{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const n=e.getSize(new B0);this._width=n.width,this._height=n.height,t=new Ze(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Ke}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new V6(Di),this.copyPass.material.blending=ct,this.clock=new xr}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let n=!1;for(let s=0,r=this.passes.length;s<r;s++){const a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),a.needsSwap){if(n){const o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}X9!==void 0&&(a instanceof X9?n=!0:a instanceof G6&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new B0);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class X6 extends Jn{constructor(e,t,n=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new O0}render(e,t,n){const s=e.autoClear;e.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=s}}const q6={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new O0(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class Mn extends Jn{constructor(e,t=1,n,s){super(),this.strength=t,this.radius=n,this.threshold=s,this.resolution=e!==void 0?new B0(e.x,e.y):new B0(256,256),this.clearColor=new O0(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new Ze(r,a,{type:Ke}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let u=0;u<this.nMips;u++){const h=new Ze(r,a,{type:Ke});h.texture.name="UnrealBloomPass.h"+u,h.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(h);const f=new Ze(r,a,{type:Ke});f.texture.name="UnrealBloomPass.v"+u,f.texture.generateMipmaps=!1,this.renderTargetsVertical.push(f),r=Math.round(r/2),a=Math.round(a/2)}const o=q6;this.highPassUniforms=Ni.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Pe({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const l=[3,5,7,9,11];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let u=0;u<this.nMips;u++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[u])),this.separableBlurMaterials[u].uniforms.invSize.value=new B0(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new O(1,1,1),new O(1,1,1),new O(1,1,1),new O(1,1,1),new O(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Ni.clone(Di.uniforms),this.blendMaterial=new Pe({uniforms:this.copyUniforms,vertexShader:Di.vertexShader,fragmentShader:Di.fragmentShader,blending:S1,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new O0,this._oldClearAlpha=1,this._basic=new dn,this._fsQuad=new Vr(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new B0(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(e,t,n,s,r){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=Mn.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=Mn.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this._fsQuad.render(e),o=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(n),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=a}_getSeparableBlurMaterial(e){const t=[];for(let n=0;n<e;n++)t.push(.39894*Math.exp(-.5*n*n/(e*e))/e);return new Pe({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new B0(.5,.5)},direction:{value:new B0(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}_getCompositeMaterial(e){return new Pe({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}Mn.BlurDirectionX=new B0(1,0);Mn.BlurDirectionY=new B0(0,1);function Y6(i,e,t){const n=new W6(i);n.setPixelRatio(i.getPixelRatio()*Cr),n.addPass(new X6(e,t));const s=new Mn(new B0(window.innerWidth,window.innerHeight),Y8,K8,Z8);return n.addPass(s),{composer:n,bloom:s}}function K6(i,e,t,n,s){i.setSize(n,s),e.setPixelRatio(i.getPixelRatio()*Cr),e.setSize(n,s),t.resolution.set(n,s)}const Dn=document.getElementById("overlay"),Z6=document.getElementById("hud"),$6=document.getElementById("vignette"),ze=new A8({antialias:!1,powerPreference:"high-performance"});b8.init();ze.setPixelRatio(Math.min(window.devicePixelRatio,1.5));ze.setSize(window.innerWidth,window.innerHeight);ze.outputColorSpace=Ae;ze.toneMapping=K9;ze.toneMappingExposure=$8;ze.domElement.style.cssText="position:fixed;inset:0;z-index:1;visibility:hidden";document.body.appendChild(ze.domElement);const Sn=new R2;Sn.background=new O0(Ar);Sn.fog=new Ms(Ar,F8,O8);const Fn=new Be(U8,window.innerWidth/window.innerHeight,I8,50);Fn.position.set(A/2,Nn,A/2);Sn.add(new z2(z8,H8));Sn.add(new B2(k8,V8,G8));async function J6(){const i=new O2,e=await t6(i),t=Q8(),n=Ur(t,ws,A,A),s={wallTex:e,carpetTex:t,carpet:Rs(n),carpetBase:new dn({map:n,color:Pr}),lightPanelOn:new dn({color:os}),lightPanelOff:new dn({color:W8})},r=new L6(Sn,s),a=new B6(Fn,ze.domElement);r.init(a.position),a.connect();const{composer:o,bloom:l}=Y6(ze,Sn,Fn);let c=!1,u=!1;const h=document.querySelector("#overlay .hint"),f="클릭하여 시작<br />WASD · 이동 &nbsp; Shift · 달리기 &nbsp; Space · 점프 &nbsp; 마우스 · 시야";h&&(h.textContent="주변 공간 생성 중… (처음 한 번만)"),Dn.style.cursor="wait",r.preloadAround(a.position,(b,y)=>{h&&!u&&(h.innerHTML=`주변 공간 생성 중… ${b}/${y}<br/>시야 거리만큼 미리 만들고 있습니다`)}).then(()=>{for(let b=0;b<5;b++)o.render();a.setColliders(r.getColliders()),u=!0,ze.domElement.style.visibility="visible",Dn.style.cursor="pointer",h&&(h.innerHTML=f)}).catch(b=>{console.error(b),u=!0,ze.domElement.style.visibility="visible",Dn.style.cursor="pointer",h&&(h.textContent="로딩 오류 — 새로고침 해주세요.")}),Dn.addEventListener("click",()=>{u&&(a.requestLock(),c||(c=!0,Dn.classList.add("hidden"),Z6.classList.add("visible"),$6.classList.add("visible")))});const m=new xr;let g=0;const M=new O0(os),p=16.7;function d(){requestAnimationFrame(d);const b=performance.now(),y=Math.min(m.getDelta(),.05);g+=y,r.tick(y),r.preloading||(r.update(a.position),r.flushColliders()),a.setColliders(r.getColliders()),r.consumeColliderRebuild()&&a.resolvePenetration(),c&&a.update(y);for(const{light:S,panel:I,face:L}of r.getFixtures()){const R=.94+Math.sin(g*8+I.phase)*.04;S.intensity=Rr*I.bright*R,L.material.color.copy(M).multiplyScalar(wr*I.bright*R)}if(o.render(),!r.preloading){const S=performance.now()-b;let I=Math.max(3,Math.min(8,p-S));r.hasPendingLoads()&&(I=Math.max(I,14)),r.processLoadQueue(a.position,I)}}d(),window.addEventListener("resize",()=>{const b=window.innerWidth,y=window.innerHeight;Fn.aspect=b/y,Fn.updateProjectionMatrix(),K6(ze,o,l,b,y)})}J6().catch(i=>{console.error(i);const e=document.querySelector("#overlay .hint");e&&(e.textContent="로딩 오류 — 새로고침 해주세요.")});
