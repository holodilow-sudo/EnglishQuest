/* Small synthesized game sounds: fully local, no files or network. */
(function(){
 'use strict';let env={},context=null,rewardTimers=[],lastTap=0,nodes=new Set();
 const enabled=()=>env.enabled?.()!==false;
 function audio(){if(!enabled())return null;try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;context||=new C();if(context.state==='suspended')context.resume().catch(()=>{});return context}catch{return null}}
 function synth(c,frequency,duration,volume=.04,delay=0,type='sine'){
  const oscillator=c.createOscillator(),gain=c.createGain(),start=c.currentTime+delay;
  oscillator.type=type;oscillator.frequency.setValueAtTime(frequency,start);gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(volume,start+.009);gain.gain.exponentialRampToValueAtTime(.0001,start+duration);oscillator.connect(gain);gain.connect(c.destination);oscillator.start(start);oscillator.stop(start+duration+.015);nodes.add(oscillator);oscillator.onended=()=>{nodes.delete(oscillator);oscillator.disconnect();gain.disconnect()};
 }
 function note(...args){const c=audio();if(c)synth(c,...args)}
 function tap(){if(!enabled()||performance.now()-lastTap<65)return;lastTap=performance.now();note(920,.045,.022);note(1380,.035,.008,.015)}
 function correct(){note(523.25,.13,.035);note(659.25,.16,.035,.075);note(783.99,.22,.025,.15)}
 function stopRewards(){rewardTimers.forEach(clearTimeout);rewardTimers=[]}
 function later(fn,delay){rewardTimers.push(setTimeout(()=>{if(enabled())fn()},delay))}
 function reward(coins=0){stopRewards();if(!enabled())return;[523.25,659.25,783.99,1046.5].forEach((f,i)=>note(f,.33,.03,i*.105,'triangle'));if(coins>0)for(let i=0;i<5;i++)later(()=>{note(1318.5+i*45,.09,.018);note(1975.5,.065,.007,.025)},900+i*130)}
 function stop(){stopRewards();for(const n of nodes){try{n.stop()}catch{}}nodes.clear()}
 function preview(){stop();tap();later(correct,450);later(()=>reward(10),1000)}
 document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.disabled||b.dataset.action==='sound'||b.dataset.city==='sound-test')return;if(enabled()){audio();setTimeout(()=>{if(!document.hidden)tap()},0)}},true);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});window.addEventListener('pagehide',stop);
 async function renderDemo(){const c=new OfflineAudioContext(1,48000*3.5,48000);synth(c,920,.045,.022);synth(c,1380,.035,.008,.015);[523.25,659.25,783.99].forEach((f,i)=>synth(c,f,[.13,.16,.22][i],[.035,.035,.025][i],.45+i*.075));[523.25,659.25,783.99,1046.5].forEach((f,i)=>synth(c,f,.33,.03,1+i*.105,'triangle'));for(let i=0;i<5;i++){synth(c,1318.5+i*45,.09,.018,1.9+i*.13);synth(c,1975.5,.065,.007,1.925+i*.13)}return c.startRendering()}
 window.CitySFX={configure(options){env=options||{}},tap,correct,reward,preview,stop,stopRewards,renderDemo};
})();
