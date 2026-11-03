/* Pure game rules. Shared by the browser and automated tests. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.EchoGarden=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const LIMIT=8;
const LEVELS=[
 {name:'First steps',subtitle:'Wake the first water terminal.',echo:false,map:['#########','#...#...#','#P..#..T#','#.......#','#########'],hint:'Go below the stone divider, then return to the terminal.'},
 {name:'A helping echo',subtitle:'Let your Echo hold the sun plate.',echo:true,map:['#########','#..S.#..#','#P...G.T#','#....#..#','#########'],hint:'Record Up, Right, Right. Finish recording. Move Right six times, then activate the terminal.'},
 {name:'The long way round',subtitle:'Take separate routes to restore the terrace.',echo:true,map:['###########','#...S.#...#','#..#..#...#','#..#..G...#','#P....#..T#','#.....#...#','###########'],hint:'Record Up, Up, Up, Right, Right, Right. Replay with six waits, then Right ×4, Up, Right ×4, Down. Activate the terminal.'},
 {name:'The rooftop reservoir',subtitle:'Restore two pumps, then bring the rooftop back to life.',echo:true,checkpointed:true,map:["#####################", "#......#.....#...#..#", "#.##...#.....#.c.#.T#", "#...#..#...b.#...3..#", "#...#..#.....2..L#..#", "#...#..#..#..#.B.#..#", "#.L.a..#..#..#...#..#", "#......1..L..#.###..#", "#.P....#.A...#...#..#", "#......#.....#...#..#", "#####################"],hint:'Phase A: record Right ×2, Up ×2. Replay Right ×4, Up, Right ×2, Down, Right, then activate pump A. Phase B: record Right ×2, Up ×5. Replay Up ×4, Right ×6, Down, then activate pump B. Phase C: record Up ×3. Replay Right, Up ×2, Right ×3, Up, then activate the final terminal.'}
];
const DELTA={up:[0,-1],right:[1,0],down:[0,1],left:[-1,0],wait:[0,0]};
const copy=x=>JSON.parse(JSON.stringify(x));
const same=(a,b)=>a&&b&&a.x===b.x&&a.y===b.y;
class Game{
 constructor(level=0){this.load(level);}
 load(level){if(!Number.isInteger(level)||!LEVELS[level])throw Error('Invalid level');this.level=level;this.resets=0;this.checkpoint=null;this.activated={};this.reset(false);}
 reset(count=true){if(count)this.resets++;const l=LEVELS[this.level];this.map=l.map;this.player=this.checkpoint?copy(this.checkpoint.player):this.find('P');this.activated=this.checkpoint?copy(this.checkpoint.activated):{};this.echo=null;this.commands=[];this.index=0;this.turns=this.checkpoint?this.checkpoint.turns:0;this.mode='planning';this.complete=false;this.snapshot=null;this.recordBaseTurns=this.turns;this.note=this.checkpoint?'Checkpoint restored. Record a fresh route for the next area.':'Explore the room. '+(l.echo?'Record a route to make an Echo.':'Find the water terminal.');}
 restart(){this.checkpoint=null;this.activated={};this.resets=0;this.reset(false);this.note='Level restarted from the beginning.';}
 stage(){return this.activated.B?3:this.activated.A?2:1;}

 find(ch){for(let y=0;y<this.map.length;y++){const x=this.map[y].indexOf(ch);if(x>=0)return{x,y};}return null;}
 tile(p){return this.map[p.y]?.[p.x]||'#';}
 gateOpen(gate='G'){
  if(gate==='G'){const s=this.find('S');return !!s&&(same(s,this.player)||same(s,this.echo));}
  const link={'1':['a','A',null],'2':['b','B','A'],'3':['c',null,'B']}[gate];if(!link)return false;
  if(link[1]&&this.activated[link[1]])return true;
  if(link[2]&&!this.activated[link[2]])return false;
  const plate=this.find(link[0]);return !!plate&&(same(plate,this.player)||same(plate,this.echo));
 }
 gateState(){return Object.fromEntries(['G','1','2','3'].map(g=>[g,this.gateOpen(g)]));}
 move(pos,command,open){const [dx,dy]=DELTA[command];const n={x:pos.x+dx,y:pos.y+dy};const t=this.tile(n);const isGate=['G','1','2','3'].includes(t);const pass=typeof open==='object'?open[t]:open;return t==='#'||(isGate&&!pass&&!same(n,pos))?copy(pos):n;}

 record(){if(this.complete)return false;if(!LEVELS[this.level].echo){this.note='This room teaches movement. Echo recording starts in room 2.';return false;}
  if(this.mode==='planning'){this.snapshot=copy(this.player);this.recordBaseTurns=this.turns;this.commands=[];this.mode='recording';this.note='Recording. Use up to eight moves or waits, then finish.';return true;}
  if(this.mode==='recording'){if(!this.commands.length){this.note='Record at least one command first.';return false;}this.player=copy(this.snapshot);this.echo=copy(this.snapshot);this.index=0;this.turns=this.recordBaseTurns;this.mode='replay';this.note='Rewound. Each move also advances your Echo.';return true;}
  this.note='Reset the room before making a new recording.';return false;
 }
 step(command){if(!DELTA[command]||this.complete)return false;const open=this.gateState();this.player=this.move(this.player,command,open);
  if(this.mode==='recording'){this.commands.push(command);this.note='Recorded '+this.commands.length+' / '+LIMIT+' commands.';if(this.commands.length===LIMIT)this.record();}
  else{if(this.mode==='replay'&&this.index<this.commands.length){this.echo=this.move(this.echo,this.commands[this.index],open);this.index++;}this.turns++;this.note=this.gateOpen()?'Sun gate open. Reach the terminal.':(this.mode==='replay'?'Echo step '+this.index+' / '+this.commands.length+'.':'Find a route to the terminal.');}return true;
 }
 interact(){if(this.complete)return false;if(this.mode==='recording'){this.note='Finish recording before using a terminal.';return false;}
  const tile=this.tile(this.player);
  if(tile==='L'){this.note=this.player.x<7?'Moss: The intake is dry. An Echo on sun plate 1 can hold the gate.':this.player.x<13?'Moss: Pump A feeds this terrace. Restore B to reach the reservoir.':'Moss: One last Echo can open the reservoir gate. Water will reach every planter.';return false;}
  if(['A','B'].includes(tile)){
   if(this.activated[tile]){this.note='This pump is already restored.';return false;}
   if(tile==='B'&&!this.activated.A){this.note='Restore pump A first.';return false;}
   this.activated[tile]=true;this.echo=null;this.commands=[];this.index=0;this.snapshot=null;this.mode='planning';
   this.checkpoint={player:copy(this.player),activated:copy(this.activated),turns:this.turns};
   this.note='Pump '+tile+' restored. Gate latched open and checkpoint saved for this session. Record a new route.';return false;
  }
  if(same(this.player,this.find('T'))){if(LEVELS[this.level].checkpointed&&(!this.activated.A||!this.activated.B)){this.note='Restore pumps A and B before the reservoir.';return false;}this.complete=true;this.note='Water restored. This terrace is growing again.';return true;}
  this.note='Stand on a pump, sign or water terminal, then activate it.';return false;
 }

 score(){return Math.max(100,1000-this.turns*10-this.resets*20);}
}
return {Game,LEVELS,LIMIT};
});
