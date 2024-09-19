/* JRPG Stellar Engine v0.5.2.build.184 */
class Sprite{constructor(t={}){if(this.name="name"in t?t.name:null,this.transform={x:"transform"in t&&"x"in t.transform?t.transform.x:0,y:"transform"in t&&"y"in t.transform?t.transform.y:0},this.atlas={width:t.width,height:t.height,cols:"cell"in t?t.width/t.cell:t.cols||1,rows:"cell"in t?t.height/t.cell:t.rows||1,cell:"cell"in t?t.cell:t.width/t.cols,image:null},"string"==typeof t.resource&&t.resource.startsWith("#"))this.atlas.image=document.querySelector(t.resource);else if("string"==typeof t.resource){const s=new Image;s.src=t.resource,this.atlas.image=s}else"object"==typeof t.resource&&(this.atlas.image=t.resource);this.tile={current:0,width:this.atlas.width/this.atlas.cols,height:this.atlas.height/this.atlas.rows,scaled:{factor:t.scale||1,width:this.atlas.width/this.atlas.cols*(t.scale||1),height:this.atlas.height/this.atlas.rows*(t.scale||1),halfWidth:this.atlas.width/this.atlas.cols*(t.scale||1)/2,halfHeight:this.atlas.height/this.atlas.rows*(t.scale||1)/2}}}position(t,s){this.transform.x=t,this.transform.y=s}cell(t){this.tile.current=t}getCollider(t){return{left:this.transform.x-this.tile.scaled.halfWidth,top:this.transform.y-this.tile.scaled.halfHeight,right:this.transform.x+this.tile.scaled.halfWidth,bottom:this.transform.y+this.tile.scaled.halfHeight}}render(t){const s=this.tile.width*(this.tile.current%this.atlas.cols),e=this.tile.height*Math.floor(this.tile.current/this.atlas.cols),i=t.world2Screen({x:this.transform.x-this.tile.scaled.halfWidth,y:this.transform.y-this.tile.scaled.halfHeight});i.x>-this.tile.scaled.width&&i.x<t.canvas.width&&i.y>-this.tile.scaled.height&&i.y<t.canvas.height&&t.ctx.drawImage(this.atlas.image,s,e,this.tile.width,this.tile.height,Math.round(i.x),Math.round(i.y),this.tile.scaled.width,this.tile.scaled.height)}debug(t){t.ctx.fillStyle="rgba(225,0,0,0.5)";const s=this.getCollider(t);t.ctx.fillRect(s.left+t.center.x+t.offset.x,s.top+t.center.y+t.offset.y,s.right+t.center.x+t.offset.x-(s.left+t.center.x+t.offset.x),s.bottom+t.center.y+t.offset.y-(s.top+t.center.y+t.offset.y))}}
class TileSet extends Sprite{constructor(t){super(t),this.anim={},"anim"in t&&Object.entries(t.anim).forEach((([t,e])=>{this.anim[t]={nr:0,timer:e[0][1],sequence:e}}))}getColliders(t,e,i=0,s=0,h=0){const l=[];let a=-i*this.tile.scaled.factor,c=-s*this.tile.scaled.factor;return e.forEach((t=>{t.forEach((t=>{t-h>-1&&l.push({left:a,top:c,right:a+this.tile.scaled.width,bottom:c+this.tile.scaled.height}),a+=this.tile.scaled.width})),a=-i*this.tile.scaled.factor,c+=this.tile.scaled.height})),l}frame(t){return t in this.anim?this.anim[t].sequence[this.anim[t].nr][0]:t}update(t){Object.values(this.anim).forEach((e=>{e.timer>0?e.timer-=1e3*t:(e.nr<e.sequence.length-1?e.nr++:e.nr=0,e.timer=e.sequence[e.nr][1])}))}render(t,e,i=0,s=0,h=0){let l=-i*this.tile.scaled.factor+this.tile.scaled.halfWidth,a=-s*this.tile.scaled.factor+this.tile.scaled.halfHeight;e.forEach((e=>{e.forEach((e=>{const i=e-h;i>-1&&(this.position(l,a),this.cell(this.frame(i)),super.render(t)),l+=this.tile.scaled.width})),l=-i*this.tile.scaled.factor+this.tile.scaled.halfWidth,a+=this.tile.scaled.height}))}debug(t,e,i=0,s=0,h=0){let l=-i*this.tile.scaled.factor+this.tile.scaled.halfWidth,a=-s*this.tile.scaled.factor+this.tile.scaled.halfHeight;e.forEach((e=>{e.forEach((e=>{e-h>-1&&(this.position(l,a),super.debug(t)),l+=this.tile.scaled.width})),l=-i*this.tile.scaled.factor+this.tile.scaled.halfWidth,a+=this.tile.scaled.height}))}}
class Actor extends Sprite{constructor(t){super(t),this.stats={speed:t.speed},this.transform.v="",this.transform.h="",this.collider="collider"in t?t.collider:{x:0,y:0,width:this.tile.scaled.width,height:this.tile.scaled.height},this.animations="animations"in t?t.animations:{},this.anim={name:null,frames:null,index:0,time:0,start:function(t,i){this.name=t,this.frames=i,this.index=0,this.time=0},advance:function(t){this.time+=t,1e3*this.time>=this.frames[this.index].duration&&(this.time=0,this.index++,this.index==this.frames.length&&(this.index=0))},frame:function(){return this.frames?this.frames[this.index].frame:0}}}animate(t,i=0){this.anim.name!=t&&this.anim.start(t,this.animations[t]),this.anim.advance(i)}idle(){"idle"in this.animations?this.animate("idle"):"idleLeft"in this.animations&&"w"==this.transform.h?this.animate("idleLeft"):"idleRight"in this.animations&&"e"==this.transform.h?this.animate("idleRight"):"idleUp"in this.animations&&"n"==this.transform.v?this.animate("idleUp"):!("idleDown"in this.animations)||"s"!=this.transform.v&&""!=this.transform.v||this.animate("idleDown"),this.transform.v="",this.transform.h=""}getCollider(t){return{left:this.transform.x-this.tile.scaled.halfWidth+this.collider.x,top:this.transform.y-this.tile.scaled.halfHeight+this.collider.y,right:this.transform.x-this.tile.scaled.halfWidth+this.collider.x+this.collider.width,bottom:this.transform.y-this.tile.scaled.halfHeight+this.collider.y+this.collider.height}}collideUp(t){let i=0,e=this.stats.speed*t.deltaTime,o=0;const s=this.getCollider(t.view);for(const h of t.with)s.top-e<h.bottom&&s.top-e>h.top&&s.right>=h.left&&s.left<=h.right&&(t.view.debugEnabled&&t.view.debugBox.push({x:h.left,y:h.top,w:h.right-h.left,h:h.bottom-h.top}),s.right>h.right?(o=.7*this.stats.speed*t.deltaTime,i++):s.left<h.left?(o=-.7*this.stats.speed*t.deltaTime,i++):(o=0,i++));return[i>1?0:o,i>0?0:e]}moveUp(t){this.transform.v="n",this.transform.y-=t}collideDown(t){let i=0,e=this.stats.speed*t.deltaTime,o=0;const s=this.getCollider(t.view);for(const h of t.with)s.bottom+e>h.top&&s.bottom+e<h.bottom&&s.right>=h.left&&s.left<=h.right&&(t.view.debugEnabled&&t.view.debugBox.push({x:h.left,y:h.top,w:h.right-h.left,h:h.bottom-h.top}),s.right>h.right?(o=.7*this.stats.speed*t.deltaTime,i++):s.left<h.left?(o=-.7*this.stats.speed*t.deltaTime,i++):(o=0,i++));return[i>1?0:o,i>0?0:e]}moveDown(t){this.transform.v="s",this.transform.y+=t}collideRight(t){let i=0,e=this.stats.speed*t.deltaTime,o=0;const s=this.getCollider(t.view);for(const h of t.with)s.right+e>h.left&&s.right+e<h.right&&s.top<=h.bottom&&s.bottom>=h.top&&(t.view.debugEnabled&&t.view.debugBox.push({x:h.left,y:h.top,w:h.right-h.left,h:h.bottom-h.top}),s.top<h.top?(o=-.7*this.stats.speed*t.deltaTime,i++):s.bottom>h.bottom?(o=.7*this.stats.speed*t.deltaTime,i++):(o=0,i++));return[i>0?0:e,i>1?0:o]}stairsRight(t){const i=this.stats.speed*t.deltaTime,e=this.getCollider(t.view);for(const o of t.with)if(e.right-this.collider.width/2+i>o.left&&e.right-this.collider.width/2+i<o.right&&e.top<=o.bottom&&e.bottom>=o.top)return[0,o.angle>0?-.7*i:.7*i];return[0,0]}moveRight(t){this.transform.h="e",this.transform.x+=t}collideLeft(t){let i=0,e=this.stats.speed*t.deltaTime,o=0;const s=this.getCollider(t.view);for(const h of t.with)s.left-e<h.right&&s.left-e>h.left&&s.top<=h.bottom&&s.bottom>=h.top&&(t.view.debugEnabled&&t.view.debugBox.push({x:h.left,y:h.top,w:h.right-h.left,h:h.bottom-h.top}),s.top<h.top?(o=-.7*this.stats.speed*t.deltaTime,i++):s.bottom>h.bottom?(o=.7*this.stats.speed*t.deltaTime,i++):(o=0,i++));return[i>0?0:e,i>1?0:o]}stairsLeft(t){const i=this.stats.speed*t.deltaTime,e=this.getCollider(t.view);for(const o of t.with)if(e.left-i<o.right&&e.left-i>o.left&&e.top<=o.bottom&&e.bottom>=o.top)return[0,o.angle<0?-.7*i:.7*i];return[0,0]}moveLeft(t){this.transform.h="w",this.transform.x-=t}collideWithSprite(t){const i=this.getCollider(t.view),e=t.with.getCollider(t.view);return i.left>e.left&&i.left<e.right&&i.top>e.top&&i.top<e.bottom||(i.right>e.left&&i.right<e.right&&i.top>e.top&&i.top<e.bottom||(i.left>e.left&&i.left<e.right&&i.bottom>e.top&&i.bottom<e.bottom||i.right>e.left&&i.right<e.right&&i.bottom>e.top&&i.bottom<e.bottom))}collideWithBox(t){const i=this.getCollider(t.view);return i.left>t.with.left&&i.left<t.with.right&&i.top>t.with.top&&i.top<t.with.bottom||(i.right>t.with.left&&i.right<t.with.right&&i.top>t.with.top&&i.top<t.with.bottom||(i.left>t.with.left&&i.left<t.with.right&&i.bottom>t.with.top&&i.bottom<t.with.bottom||i.right>t.with.left&&i.right<t.with.right&&i.bottom>t.with.top&&i.bottom<t.with.bottom))}render(t){super.position(this.transform.x,this.transform.y),super.cell(this.anim.frame()),super.render(t)}update(){}debug(t){t.ctx.fillStyle="rgba(225,225,0,0.5)";const i=this.getCollider(t);t.ctx.fillRect(i.left+t.center.x+t.offset.x,i.top+t.center.y+t.offset.y,i.right+t.center.x+t.offset.x-(i.left+t.center.x+t.offset.x),i.bottom+t.center.y+t.offset.y-(i.top+t.center.y+t.offset.y))}}
class MOB extends Actor{constructor(i){super(i),this.action="idle",this.direction="",this.duration=0,this.bounced="",this.wander()}wander(){this.duration=randomRangeFloat(.5,2);const i=["L","U","R","D","I"].filter((i=>i!==this.bounced));this.direction=i[randomRangeInt(0,i.length-1)],"I"==this.direction?this.action="idle":(this.action="wander",this.bounced="")}update(i){if(this.duration>0){if(this.duration-=i.deltaTime,"idle"==this.action)"I"==this.direction&&(this.action="idle",this.animate("idle",i.deltaTime),this.transform.v="",this.transform.h="");else if("wander"==this.action){if("U"==this.direction){const[t,e]=this.collideUp({view:i.view,deltaTime:i.deltaTime,with:i.colliders});e<.001&&(this.wander(),this.bounced="U"),this.animate("moveUp",i.deltaTime),this.moveUp(Math.round(e))}else if("D"==this.direction){const[t,e]=this.collideDown({view:i.view,deltaTime:i.deltaTime,with:i.colliders});e<.001&&(this.wander(),this.bounced="D"),this.animate("moveDown",i.deltaTime),this.moveDown(Math.round(e))}if("L"==this.direction){const[t,e]=this.collideLeft({view:i.view,deltaTime:i.deltaTime,with:i.colliders});t<.001&&(this.wander(),this.bounced="L"),this.animate("moveLeft",i.deltaTime),this.moveLeft(Math.round(t))}else if("R"==this.direction){const[t,e]=this.collideRight({view:i.view,deltaTime:i.deltaTime,with:i.colliders});t<.001&&(this.wander(),this.bounced="R"),this.animate("moveRight",i.deltaTime),this.moveRight(Math.round(t))}}}else this.wander()}}
class Player extends Actor{constructor(t){super(t),this.bounds="bounds"in t?t.bounds:{top:0,bottom:0,left:0,right:0}}moveUp(t,s){return this.transform.v="n",this.transform.y+s.offset.y<this.bounds.top&&(s.offset.y+=t),super.moveUp(t)}moveDown(t,s){return this.transform.v="s",this.transform.y+s.offset.y>this.bounds.bottom&&(s.offset.y-=t),super.moveDown(t)}moveRight(t,s){return this.transform.h="e",this.transform.x+s.offset.x>this.bounds.right&&(s.offset.x-=t),super.moveRight(t)}moveLeft(t,s){return this.transform.h="w",this.transform.x+s.offset.x<this.bounds.left&&(s.offset.x+=t),super.moveLeft(t)}}
class Level{constructor(){this.offset={x:0,y:0},this.scale=1,this.tilesets={},this.layers=[],this.actors={},this.spawnpoints={},this.stairs=[],this.portals=[]}getColliders(t){const s=[],e=Object.values(this.tilesets).length?Object.values(this.tilesets)[0]:null;return e&&this.layers.forEach((i=>{"colliders"==i.class&&s.push(...e.ref.getColliders(t,i.map,this.offset.x,this.offset.y,e.first))})),s}precalcStairs(t){for(let t=0;t<this.stairs.length;t++)this.stairs[t].left=Math.min(this.stairs[t].x1,this.stairs[t].x2,this.stairs[t].x3,this.stairs[t].x4),this.stairs[t].top=Math.min(this.stairs[t].y1,this.stairs[t].y2,this.stairs[t].y3,this.stairs[t].y4),this.stairs[t].right=Math.max(this.stairs[t].x1,this.stairs[t].x2,this.stairs[t].x3,this.stairs[t].x4),this.stairs[t].bottom=Math.max(this.stairs[t].y1,this.stairs[t].y2,this.stairs[t].y3,this.stairs[t].y4),this.stairs[t].angle=this.calculateTopEdgeAngle(this.stairs[t])}calculateTopEdgeAngle(t){const s=[{x:t.x1,y:-t.y1},{x:t.x2,y:-t.y2},{x:t.x3,y:-t.y3},{x:t.x4,y:-t.y4}];s.sort(((t,s)=>t.y!==s.y?t.y-s.y:t.x-s.x));const[e,i]=s.slice(0,2);let a,r;e.x<i.x?(a=e,r=i):(a=i,r=e);const l=r.x-a.x,h=r.y-a.y;return Math.atan2(h,l)*(180/Math.PI)}getStairs(t){return this.stairs}getSpawnPoint(t,s={x:0,y:0}){if(t in this.spawnpoints&&this.spawnpoints[t].length>0){const s=this.spawnpoints[t][randomRangeInt(0,this.spawnpoints[t].length-1)];return{x:s.x,y:s.y}}return s}getSpawnPoints(t,s=[{x:0,y:0}]){return t in this.spawnpoints&&this.spawnpoints[t].length>0?this.spawnpoints[t]:s}getPortals(t){return this.portals}getLayer(t){for(const s of this.layers)if(s.name==t)return s;return null}getLayers(){return this.layers}update(t,s){for(const t of Object.values(this.tilesets))t.ref.update(s);const e=this.getColliders(t);Object.values(this.actors).forEach((i=>{Object.values(i).forEach((i=>{i.update({view:t,deltaTime:s,colliders:e})}))}))}render(t){this.layers.forEach((s=>{if("image"==s.class)t.background(s.src,{x:s.x*this.scale,y:s.y*this.scale},{w:s.w*this.scale,h:s.h*this.scale},s.repeat,s.parallax,s.coordinates);else if("objects"==s.class){const e=[];Object.values(this.actors).forEach((i=>{Object.entries(i).forEach((([i,a])=>{s.actors.forEach((s=>{if(s==i){const s=t.world2Screen({x:a.transform.x-a.tile.scaled.halfWidth,y:a.transform.y-a.tile.scaled.halfHeight});s.x>-a.tile.scaled.width&&s.x<t.canvas.width+a.tile.scaled.width&&s.y>-a.tile.scaled.height&&s.y<t.canvas.height+a.tile.scaled.height&&e.push(a)}}))}))})),e.sort((function(t,s){return t.transform.y+t.tile.scaled.halfHeight-(s.transform.y+s.tile.scaled.halfHeight)})),e.forEach((s=>{s.render(t)}))}else for(const e of Object.values(this.tilesets))e.ref.render(t,s.map,this.offset.x-s.offset.x,this.offset.y-s.offset.y,e.first)}))}debug(t){this.layers.forEach((s=>{for(const e of Object.values(this.tilesets))"colliders"==s.class&&e.ref.debug(t,s.map,this.offset.x,this.offset.y,e.first)}));const s=t.center.x+t.offset.x,e=t.center.y+t.offset.y;Object.entries(this.spawnpoints).forEach((([i,a])=>{a.forEach((a=>{t.ctx.fillStyle="rgba(0,255,0,0.8)",t.ctx.beginPath();const r=a.x+s,l=a.y+e;t.ctx.moveTo(0+r,0+l),t.ctx.lineTo(-8+r,-16+l),t.ctx.lineTo(8+r,-16+l),t.ctx.fill(),t.ctx.font="14px sans-serif";const h=t.ctx.measureText(i).width/2;t.ctx.fillText(i,r-h,l+16)}))})),t.ctx.fillStyle="rgba(0,255,255,0.5)",this.stairs.forEach((i=>{t.ctx.beginPath(),t.ctx.moveTo(i.x1+s,i.y1+e),t.ctx.lineTo(i.x2+s,i.y2+e),t.ctx.lineTo(i.x3+s,i.y3+e),t.ctx.lineTo(i.x4+s,i.y4+e),t.ctx.fill()})),t.ctx.fillStyle="rgba(50,0,50,0.5)",this.portals.forEach((i=>{t.ctx.fillRect(i.left+s,i.top+e,i.right-i.left,i.bottom-i.top)})),Object.values(this.actors).forEach((s=>{Object.values(s).forEach((s=>{s.debug(t)}))})),t.debugEnabled&&t.debug()}}
class LoaderACX{parseActor(t){const{scale:e=1,transform:r={x:0,y:0}}=t;if("xml"in t){const n=(new DOMParser).parseFromString(t.xml,"application/xml").querySelector("actor");if(n){const t=n.getAttribute("version");if(t&&"0.2"==t){const t=n.getAttribute("name"),i=n.getAttribute("type"),o=n.getAttribute("resource"),s=n.getAttribute("width"),a=n.getAttribute("height"),c=n.getAttribute("cols"),u=n.getAttribute("rows");if(t&&i&&o&&s&&a&&c&&u){const l={name:t,resource:o,width:parseInt(s),height:parseInt(a),cols:parseInt(c),rows:parseInt(u),scale:e,transform:r},g=n.querySelector("movement");if(g){const t=g.getAttribute("speed");l.speed=parseInt(t)*e}const A=n.querySelector("collider");if(A){const t=A.getAttribute("x"),r=A.getAttribute("y"),n=A.getAttribute("width"),i=A.getAttribute("height");t&&r&&n&&i&&(l.collider={x:parseInt(t)*e,y:parseInt(r)*e,width:parseInt(n)*e,height:parseInt(i)*e})}const p=n.querySelectorAll("animation");if(p){const t={};p.forEach((e=>{const r=e.getAttribute("name");t[r]=[];e.querySelectorAll("frame").forEach((e=>{const n=e.getAttribute("tileid"),i=e.getAttribute("duration");t[r].push({frame:n,duration:i})}))})),l.animations=t}const b=new Function(`return ${i}`)();return b?new b(l):new window[i]}}else console.error("Unreckognized ACX format")}}return null}}
class LoaderTSX{async loadTileSet(e){const t=await fetch(e.url),r=await t.text();return await this.parseTileSet({xml:r,url:e.url,resource:e?.resource,scale:e.scale})}async parseTileSet(e){const{xml:t=null,url:r=null,resource:l=null,scale:a=1,preload:c=!1}=e,s=(new DOMParser).parseFromString(t,"application/xml").querySelector("tileset");if(s){const e=s.querySelector("image");if(e){const t={resource:r&&!l?resolvePath(r,e.getAttribute("source")):l,width:parseInt(e.getAttribute("width")),height:parseInt(e.getAttribute("height")),cell:parseInt(s.getAttribute("tilewidth")),scale:a};c&&(t.resource=await this.fetchImage(t.resource));const i={};return s.querySelectorAll("tile").forEach((e=>{const t=e.querySelector("animation");if(t){const r=e.getAttribute("id");i[r]=[],t.querySelectorAll("frame").forEach((e=>{const t=parseInt(e.getAttribute("tileid")),l=parseInt(e.getAttribute("duration"));i[r].push([t,l])}))}})),Object.keys(i).length>0&&(t.anim=i),new TileSet(t)}}return null}async fetchImage(e){const t=await fetch(e),r=await t.blob(),l=URL.createObjectURL(r),a=new Image;a.src=l;let c=document.querySelector("#resources");return c||(c=document.createElement("div"),c.id="resources",c.style.display="none",document.body.appendChild(c)),c.appendChild(a),a.onload=()=>{URL.revokeObjectURL(l)},a}}
class LoaderTMX{constructor(t={}){this.tilesets="tilesets"in t?t.tilesets:null,this.loader={tsx:new LoaderTSX,acx:new LoaderACX}}async loadLevel(t){const{url:e=null,scale:s=1,prefetch:a=!0}=t,r=await fetch(e),o=await r.text();return await this.parseLevel({xml:o,url:e,scale:s,prefetch:a})}async parseLevel(t){const{xml:e=null,url:s=null,scale:a=1,prefetch:r=!0}=t,o=(new DOMParser).parseFromString(e,"application/xml"),l=new Level;l.scale=a;const i={tsx:{},acx:{}};if(r){for(const t of o.querySelector("map").childNodes)if(t.nodeType===Node.ELEMENT_NODE)if("tileset"==t.nodeName){const e=t.getAttribute("source");i.tsx[e]={url:resolvePath(s,e),buffer:null,tileset:null}}else"objectgroup"==t.nodeName&&t.querySelectorAll("object").forEach((t=>{const e=t.getAttribute("name").toLowerCase(),s=t.getAttribute("type").toLowerCase();parseFloat(t.getAttribute("x")),parseFloat(t.getAttribute("y"));if("spawn"==s&&-1!=e.search(":")){const[t,s]=e.split(":");t&&s&&(i.acx[s]=null)}}));const t=Object.keys(i.tsx).map((async t=>{const e=await fetch(i.tsx[t].url),s=await e.text();i.tsx[t].buffer=s,i.tsx[t].tileset=await this.loader.tsx.parseTileSet({xml:i.tsx[t].buffer,url:i.tsx[t].url,preload:!0,scale:a})}));await Promise.all(t);const e=Object.keys(i.acx).map((async t=>{const e=await fetch(t),s=await e.text();i.acx[t]=s}));await Promise.all(e)}for(const t of o.querySelector("map").childNodes)if(t.nodeType===Node.ELEMENT_NODE)switch(t.nodeName){case"tileset":const e=t.getAttribute("source"),r=parseInt(t.getAttribute("firstgid"));e&&r&&(this.tilesets?l.tilesets[e]={ref:this.tilesets[e],first:r}:l.tilesets[e]={ref:i.tsx[e].tileset,first:r});break;case"imagelayer":const o=t.getAttribute("name"),c=t.hasAttribute("offsetx")?parseInt(t.getAttribute("offsetx")):0,n=t.hasAttribute("offsety")?parseInt(t.getAttribute("offsety")):0,p=t.hasAttribute("repeatx")?parseInt(t.getAttribute("repeatx")):0,u=t.hasAttribute("repeaty")?parseInt(t.getAttribute("repeaty")):0,f=t.hasAttribute("parallaxx")?parseFloat(t.getAttribute("parallaxx")):0,b=t.hasAttribute("parallaxy")?parseFloat(t.getAttribute("parallaxy")):0,h=t.querySelector("image"),x=h.getAttribute("source"),g=parseInt(h.getAttribute("width")),A=parseInt(h.getAttribute("height"));if(o&&x){const t={name:o,class:"image",src:null,x:c,y:n,w:g,h:A,repeat:{x:p,y:u},parallax:{x:f,y:b},coordinates:"world"};if(x.startsWith("#"))t.src=document.querySelector(x);else{const e=new Image;e.src=s?resolvePath(s,x):x,t.src=e}t.src&&l.layers.push(t)}break;case"layer":const y=t.getAttribute("name").toLowerCase(),m=t.hasAttribute("class")?t.getAttribute("class").toLowerCase():"",w=t.querySelector("data"),d=t.hasAttribute("offsetx")?t.getAttribute("offsetx").toLowerCase():null,F=t.hasAttribute("offsety")?t.getAttribute("offsety").toLowerCase():null;if(w&&!y.trim().startsWith(".")){const e=w.textContent.split(",").map(Number),s={name:y,class:m,offset:{x:0,y:0},map:this.create2DArray(e,parseInt(t.getAttribute("width")))};null!==d&&(s.offset.x=d),null!==F&&(s.offset.y=F),l.layers.push(s)}break;case"objectgroup":const L={name:t.getAttribute("name").toLowerCase(),class:"objects",actors:[]};l.layers.push(L),t.querySelectorAll("object").forEach((t=>{const e=t.getAttribute("name").toLowerCase(),s=t.getAttribute("type").toLowerCase(),r=parseFloat(t.getAttribute("x"))*a,o=parseFloat(t.getAttribute("y"))*a,c=t.hasAttribute("width")?parseFloat(t.getAttribute("width"))*a:0,n=t.hasAttribute("height")?parseFloat(t.getAttribute("height"))*a:0;if("spawn"==s){if(e in l.spawnpoints||(l.spawnpoints[e]=[]),l.spawnpoints[e].push({x:r,y:o}),-1!=e.search(":")){const[t,s]=e.split(":"),p=t.toLowerCase(),u=`${s}.${p in l.actors?Object.keys(l.actors[p]).length+1:1}`;L.actors.includes(u)||L.actors.push(u),p in l.actors||(l.actors[p]={}),l.actors[p][u]=this.loader.acx.parseActor({xml:s in i.acx?i.acx[s]:document.getElementById(s).innerText,transform:{x:r+c/2,y:o-n/2},scale:a})}}else if("stairs"==s){const e=t.querySelector("polygon")?.getAttribute("points")?.split(" "),[s,i]=e[0].split(","),[c,n]=e[1].split(","),[p,u]=e[2].split(","),[f,b]=e[3].split(",");l.stairs.push({x1:r+parseFloat(s)*a,y1:o+parseFloat(i)*a,x2:r+parseFloat(c)*a,y2:o+parseFloat(n)*a,x3:r+parseFloat(p)*a,y3:o+parseFloat(u)*a,x4:r+parseFloat(f)*a,y4:o+parseFloat(b)*a})}else if("portal"==s){const e=t.getAttribute("name");if(-1!=e.search(":")){const[s,r]=e.split(":"),o=parseFloat(t.getAttribute("x"))*a,i=parseFloat(t.getAttribute("y"))*a,c=parseFloat(t.getAttribute("width"))*a,n=parseFloat(t.getAttribute("height"))*a;l.portals.push({map:s.trim(),spawn:r.trim(),left:o,top:i,right:o+c,bottom:i+n})}else console.error("Bad name formatting for portal! Use: map.spawn")}}))}return l.precalcStairs(),l}create2DArray(t,e){let s=[];for(let a=0;a<t.length;a+=e)s.push(t.slice(a,a+e));return s}}
class View{constructor(t){this.canvas=t.canvas,this.ctx=this.canvas.getContext("2d"),this.center={x:0,y:0},this.offset={x:0,y:0},this.debugEnabled="debug"in t&&t.debug,this.debugBox=[],window.addEventListener("resize",(()=>{this.fitCanvas()})),this.fitCanvas()}cls(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)}fill(t){this.ctx.fillStyle=t,this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height)}background(t,e,s,i,h,a="world"){let n={x:0,y:0};if("world"==a?(n.x=(e.x+this.center.x+this.offset.x)*h.x%s.w,n.y=e.y+this.center.y+this.offset.y):"screen"!=a&&"cover"!=a||(n.x=(e.x+this.offset.x)*h.x%s.w,n.y=(e.y+this.offset.y)*h.y%s.h),0!=i.x||0!=i.y||"world"!=a&&"screen"!=a||this.ctx.drawImage(t,n.x,n.y,s.w,s.h),0==i.x&&0==i.y&&"cover"==a){const e=this.coverCanvas(s.w,s.h);e[0]=e[0]+n.x,e[1]=e[1]+n.y,this.ctx.drawImage(t,...e)}else if(1==i.x&&0==i.y)for(let e=n.x-s.w;e<this.canvas.width;e+=s.w)this.ctx.drawImage(t,e,n.y,s.w,s.h);else if(0==i.x&&1==i.y)for(let e=n.y-s.h;e<this.canvas.height;e+=s.h)this.ctx.drawImage(t,n.x,e,s.w,s.h);else if(1==i.x&&1==i.y)for(let e=n.y-s.h;e<this.canvas.height;e+=s.h)for(let i=n.x-s.w;i<this.canvas.width;i+=s.w)this.ctx.drawImage(t,i,e,s.w,s.h)}coverCanvas(t,e){const s=t/e;let i=0,h=0,a=0,n=0;return this.canvas.width/this.canvas.height>s?(i=this.canvas.width,h=this.canvas.width/s,a=0,n=(this.canvas.height-h)/2):(i=this.canvas.height*s,h=this.canvas.height,a=(this.canvas.width-i)/2,n=0),[a,n,i,h]}roundToNearestEven(t){let e=Math.round(t);return e%2!=0&&(e+=1),e}fitCanvas(){this.canvas.width=this.roundToNearestEven(window.innerWidth),this.canvas.height=this.roundToNearestEven(window.innerHeight),this.center.x=this.canvas.width/2,this.center.y=this.canvas.height/2,this.ctx.imageSmoothingEnabled=!1,this.ctx.webkitImageSmoothingEnabled=!1,this.ctx.mozImageSmoothingEnabled=!1}centre(t){this.offset.x=-t.x,this.offset.y=-t.y}world2Screen(t){return{x:t.x+this.center.x+this.offset.x,y:t.y+this.center.y+this.offset.y}}screenshot(t=!1){const e=this.canvas.toDataURL("image/png"),s=new Image;if(s.src=e,t){const t=document.createElement("a");t.href=e,t.download="canvas-screenshot.png",t.click()}return s}debug(){this.ctx.fillStyle="rgba(0,255,0,0.8)",this.ctx.beginPath(),this.ctx.moveTo(...Object.values(this.world2Screen({x:0,y:0}))),this.ctx.lineTo(...Object.values(this.world2Screen({x:-8,y:-16}))),this.ctx.lineTo(...Object.values(this.world2Screen({x:8,y:-16}))),this.ctx.fill(),this.ctx.font="14px sans-serif";const t=this.ctx.measureText("0,0").width/2;this.ctx.fillText("0,0",this.center.x+this.offset.x-t,this.center.y+this.offset.y+16),this.ctx.fillStyle="rgba(255,255,0,0.3)",this.debugBox.forEach((t=>{this.ctx.fillRect(t.x+view.center.x+view.offset.x,t.y+view.center.y+view.offset.y,t.w,t.h)})),this.debugBox.length&&(this.debugBox=[])}}
function randomRangeInt(n,t){return n=Math.ceil(n),t=Math.floor(t),Math.floor(Math.random()*(t-n+1))+n}function randomRangeFloat(n,t){return Math.random()*(t-n)+n}function resolvePath(n,t){const a=new URL(n,"http://example.com");return new URL(t,a).pathname}