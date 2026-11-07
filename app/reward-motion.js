/* Standalone approval-preview animation. No lesson, wallet or storage writes. */
(function (global) {
  'use strict';
  let active = null;

  const amount = value => Number.isFinite(Number(value)) ? Math.max(0, Math.round(Number(value))) : 0;
  const number = value => String(value);
  const query = (root, selector) => root.matches(selector) ? root : root.querySelector(selector);
  const live = session => active === session && !session.closed;

  function setValues(session, rep, coins, balance) {
    if (session.repNode) session.repNode.textContent = '+' + number(rep) + ' REP';
    if (session.coinNode) session.coinNode.textContent = '+' + number(coins) + ' C';
    if (session.balanceNode) session.balanceNode.textContent = number(balance);
  }

  function settle(session, status) {
    if (!session || session.closed) return;
    session.closed = true;
    session.timers.forEach(id => global.clearTimeout(id));
    session.frames.forEach(id => global.cancelAnimationFrame(id));
    session.animations.forEach(animation => {
      animation.onfinish = null;
      animation.cancel();
    });
    session.timers.clear();
    session.frames.clear();
    session.animations.clear();
    session.layer?.remove();
    session.statusNode?.remove();
    session.balanceNode?.classList.remove('city-reward-wallet-active');
    session.root.dataset.rewardState = status;
    if (active === session) active = null;
    session.resolve({ status, rep: session.rep, coins: session.coins, balance: session.balanceStart + session.coins });
  }

  /** Cancel pending counters, particles and animations before leaving a screen. */
  function stop() {
    settle(active, 'cancelled');
  }

  function ensureLive(session) {
    if (!live(session)) return false;
    if (!session.root.isConnected) {
      settle(session, 'cancelled');
      return false;
    }
    return true;
  }

  function later(session, callback, delay) {
    const id = global.setTimeout(() => {
      session.timers.delete(id);
      if (ensureLive(session)) callback();
    }, delay);
    session.timers.add(id);
  }

  function frame(session, callback) {
    const id = global.requestAnimationFrame(time => {
      session.frames.delete(id);
      if (ensureLive(session)) callback(time);
    });
    session.frames.add(id);
  }

  function animate(session, element, keyframes, options) {
    if (!element || typeof element.animate !== 'function') return null;
    const animation = element.animate(keyframes, { fill: 'both', ...options });
    session.animations.add(animation);
    animation.onfinish = () => {
      session.animations.delete(animation);
      animation.cancel();
    };
    return animation;
  }

  function counter(session, node, from, to, duration, format) {
    if (!node) return;
    let started;
    function tick(time) {
      if (started === undefined) started = time;
      const progress = Math.min(1, (time - started) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      node.textContent = format(Math.round(from + (to - from) * eased));
      if (progress < 1) frame(session, tick);
    }
    frame(session, tick);
  }

  function center(element) {
    const rect = element.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }

  function curve(start, end, spread, t) {
    const u = 1 - t;
    const c1 = { x: start.x + spread, y: start.y - 96 };
    const c2 = { x: end.x + spread * 0.35, y: end.y + 62 };
    return {
      x: u*u*u*start.x + 3*u*u*t*c1.x + 3*u*t*t*c2.x + t*t*t*end.x,
      y: u*u*u*start.y + 3*u*u*t*c1.y + 3*u*t*t*c2.y + t*t*t*end.y
    };
  }

  function coinFlight(session, index, count) {
    const origin = query(session.root, '.reward-flight-origin') || session.coinNode;
    const destination = session.balanceNode;
    if (!origin || !destination || typeof origin.animate !== 'function') return;
    if (!session.layer) {
      session.layer = session.root.ownerDocument.createElement('div');
      session.layer.className = 'city-reward-particles';
      session.layer.setAttribute('aria-hidden', 'true');
      session.root.ownerDocument.body.appendChild(session.layer);
    }
    const start = center(origin);
    const end = center(destination);
    const spread = (index - (count - 1) / 2) * 21;
    start.x += (index % 3 - 1) * 7;
    start.y += (index % 2) * 5;
    const coin = session.root.ownerDocument.createElement('i');
    coin.className = 'city-reward-coin';
    session.layer.appendChild(coin);
    const keys = [];
    for (let step = 0; step <= 14; step++) {
      const t = step / 14;
      const point = curve(start, end, spread, t);
      const scale = t < 0.12 ? 0.4 + t * 5 : t > 0.82 ? 1 - (t - 0.82) * 3.8 : 1;
      keys.push({
        offset: t,
        transform: 'translate3d(' + (point.x - 11) + 'px,' + (point.y - 11) + 'px,0) rotate(' + (index * 17 + t * 300) + 'deg) scale(' + scale + ')',
        opacity: t === 0 || t === 1 ? 0 : t < 0.14 ? t / 0.14 : 1
      });
    }
    const animation = animate(session, coin, keys, { duration: 980 + index * 12, easing: 'linear' });
    if (animation) animation.onfinish = () => {
      session.animations.delete(animation);
      animation.cancel();
      coin.remove();
    };
  }

  function completed(session) {
    if (!ensureLive(session)) return;
    setValues(session, session.rep, session.coins, session.balanceStart + session.coins);
    if (session.statusNode) {
      session.statusNode.textContent = 'Миссия выполнена. Репутация: плюс ' + session.rep + '. Монеты: плюс ' + session.coins + '. Баланс: ' + (session.balanceStart + session.coins) + '.';
    }
    // Leave the single accessible completion announcement until navigation/next play.
    const announcement = session.statusNode;
    session.statusNode = null;
    settle(session, 'complete');
    if (announcement) {
      session.root.querySelectorAll('.city-reward-announcement').forEach(node => {
        if (node !== announcement) node.remove();
      });
    }
  }

  /**
   * play({root, rep:50, coins:10, balanceStart:180}) -> Promise<{status,...}>.
   * The root supplies .reward-title, optional .reward-badge / .completed-mark,
   * [data-reward-rep], [data-reward-coins], [data-reward-balance], and
   * .reward-flight-origin. Text counters must have their own dedicated elements.
   * Runs for ~2.8 s. Reduced motion shows final values synchronously.
   * Only presentation is updated; the caller owns reward accounting.
   */
  function play(options = {}) {
    const root = options.root;
    if (!root || root.nodeType !== 1 || typeof root.querySelector !== 'function') {
      throw new TypeError('CityRewards.play requires a root Element.');
    }
    stop();
    root.querySelectorAll('.city-reward-announcement').forEach(node => node.remove());
    let resolve;
    const finished = new Promise(done => { resolve = done; });
    const session = {
      root, rep: amount(options.rep ?? 50), coins: amount(options.coins ?? 10),
      balanceStart: amount(options.balanceStart ?? 180),
      repNode: query(root, '[data-reward-rep]'), coinNode: query(root, '[data-reward-coins]'),
      balanceNode: query(root, '[data-reward-balance]'),
      timers: new Set(), frames: new Set(), animations: new Set(),
      layer: null, closed: false, resolve, statusNode: null
    };
    active = session;
    root.classList.add('city-reward-scene');
    root.dataset.rewardState = 'playing';
    session.statusNode = root.ownerDocument.createElement('span');
    session.statusNode.className = 'city-reward-announcement';
    session.statusNode.setAttribute('role', 'status');
    session.statusNode.setAttribute('aria-live', 'polite');
    session.statusNode.setAttribute('aria-atomic', 'true');
    root.appendChild(session.statusNode);

    const reduced = typeof global.matchMedia === 'function' && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      completed(session);
      return finished;
    }
    if (!ensureLive(session)) return finished;
    setValues(session, 0, 0, session.balanceStart);
    animate(session, query(root, '.reward-title'), [
      { opacity: 0, transform: 'translate3d(0,20px,0) scale(.94)' },
      { opacity: 1, transform: 'translate3d(0,-3px,0) scale(1.025)', offset: 0.72 },
      { opacity: 1, transform: 'translate3d(0,0,0) scale(1)' }
    ], { duration: 590, easing: 'cubic-bezier(.2,.75,.25,1)' });
    animate(session, query(root, '.reward-badge, .completed-mark'), [
      { opacity: 0, transform: 'translate3d(0,8px,0) scale(.8) rotate(-7deg)' },
      { opacity: 1, transform: 'translate3d(0,0,0) scale(1.06) rotate(2deg)', offset: 0.75 },
      { opacity: 1, transform: 'translate3d(0,0,0) scale(1) rotate(0)' }
    ], { duration: 650, delay: 100, easing: 'cubic-bezier(.2,.75,.25,1)' });
    later(session, () => counter(session, session.repNode, 0, session.rep, 750, value => '+' + value + ' REP'), 260);
    later(session, () => counter(session, session.coinNode, 0, session.coins, 520, value => '+' + value + ' C'), 550);
    const count = session.coins ? Math.min(8, Math.max(3, session.coins)) : 0;
    for (let i = 0; i < count; i++) later(session, () => coinFlight(session, i, count), 850 + i * 62);
    later(session, () => {
      session.balanceNode?.classList.add('city-reward-wallet-active');
      counter(session, session.balanceNode, session.balanceStart, session.balanceStart + session.coins, 650, number);
      animate(session, session.balanceNode, [
        { transform: 'scale(1)' }, { transform: 'scale(1.08)', offset: 0.4 }, { transform: 'scale(1)' }
      ], { duration: 580, easing: 'ease-out' });
    }, 1780);
    later(session, () => completed(session), 2800);
    return finished;
  }

  global.CityRewards = Object.freeze({ play, stop });
  global.addEventListener('pagehide', stop);
})(window);
