// 배경 웨이브 애니메이션 (캔버스)
(function () {
  const c = document.getElementById('wc'), ctx = c.getContext('2d');
  let W, H, t = 0;

  function r() {
    W = c.width = window.innerWidth;
    H = c.height = window.innerHeight;
  }
  r();
  window.addEventListener('resize', r);

  const ws = [
    { a: 28, f: .008, s: .016, y: .25, cl: 'rgba(94,207,186,0.17)', o: 0 },
    { a: 20, f: .012, s: .022, y: .45, cl: 'rgba(42,174,160,0.11)', o: Math.PI },
    { a: 34, f: .006, s: .013, y: .65, cl: 'rgba(94,207,186,0.1)', o: 1.1 },
    { a: 22, f: .01, s: .019, y: .8, cl: 'rgba(163,220,232,0.18)', o: 2 },
  ];

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ws.forEach(w => {
      ctx.beginPath();
      ctx.moveTo(0, H * w.y);
      for (let x = 0; x <= W; x += 4) {
        ctx.lineTo(x, H * w.y + Math.sin(x * w.f + t * w.s + w.o) * w.a);
      }
      ctx.lineTo(W, H);
      ctx.lineTo(0, H);
      ctx.closePath();
      ctx.fillStyle = w.cl;
      ctx.fill();
    });
    t++;
    requestAnimationFrame(draw);
  }
  draw();
})();

// 챗봇 응답 데이터
const QA = {
  '작업 스타일이 어때요?': '파란/민트 계열 색감과 화려한 보정 베이스의 디자인을 주로 작업합니다! 깔끔한 디자인도 가능합니다 🎨',
  '의뢰는 어떻게 해요?': 'Discord 또는 이메일로 연락 주세요! 작업 내용·일정·예산을 알려주시면 견적을 드려요.',
  '주로 어떤 작업을 해요?': '썸네일 디자인, 포스터, 로고 등 다양한 그래픽 디자인을 해요 ✨',
  '작업 기간이 어떻게 돼요?': '보통 1일~2주 소요됩니다. 급한 작업은 상담 후 조율 가능해요.',
  '소프트웨어는 뭐 써요?': 'Photoshop, Illustrator, After Effects, Figma, CLIP STUDIO PAINT를 주로 사용해요 💻',
  '그 외 문의가 있어요': '연락처 중 편하신 곳으로 문의주세요!',
};
const FB = '좋은 질문이에요! 자세한 내용은 Discord나 이메일로 문의해 주시면 빠르게 답변 드릴게요 🌊';

function addMsg(t, u) {
  const b = document.getElementById('cp-msgs');
  const d = document.createElement('div');
  d.className = 'msg ' + (u ? 'msg-u' : 'msg-b');
  d.innerHTML = t;
  b.appendChild(d);
  b.scrollTop = b.scrollHeight;
}

function sq(q) {
  addMsg(q, true);
  setTimeout(() => addMsg(QA[q] || FB, false), 360);
}

function sc() {
  const inp = document.getElementById('cp-input');
  const v = inp.value.trim();
  if (!v) return;
  addMsg(v, true);
  inp.value = '';
  const k = Object.keys(QA).find(k => v.includes(k.slice(0, 4)));
  setTimeout(() => addMsg(k ? QA[k] : FB, false), 360);
}

let chatOpen = false;
function toggleChat() {
  chatOpen = !chatOpen;
  const p = document.getElementById('chat-popup');
  const btn = document.getElementById('float-btn');
  if (chatOpen) {
    p.classList.add('open');
    btn.textContent = '✕';
    btn.style.background = '#e05555';
  } else {
    p.classList.remove('open');
    btn.textContent = '💬';
    btn.style.background = '';
  }
}

// 갤러리 업로드 / 드래그 / 라이트박스
const fi = document.getElementById('fi');
const gs = document.getElementById('gs');
const addEl = gs.querySelector('.gc-add');

function addCard(url) {
  const d = document.createElement('div');
  d.className = 'gc';
  const img = document.createElement('img');
  img.src = url;
  img.alt = '작업물';
  img.addEventListener('click', () => openLb(url));
  d.appendChild(img);
  addEl.insertAdjacentElement('afterend', d);
}

fi.addEventListener('change', function () {
  Array.from(this.files).forEach(f => {
    if (f.type.startsWith('image/')) addCard(URL.createObjectURL(f));
  });
});

const garea = document.getElementById('gallery');
garea.addEventListener('dragover', e => e.preventDefault());
garea.addEventListener('drop', e => {
  e.preventDefault();
  Array.from(e.dataTransfer.files).forEach(f => {
    if (f.type.startsWith('image/')) addCard(URL.createObjectURL(f));
  });
});

function openLb(url) {
  document.getElementById('lb-img').src = url;
  document.getElementById('lb').classList.add('open');
}

function closeLb() {
  document.getElementById('lb').classList.remove('open');
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeLb();
    if (chatOpen) toggleChat();
  }
});

// 연락처 클릭 복사
const toast = document.getElementById('toast');

function doCopy(t, v) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(v).catch(() => fbCopy(v));
  } else {
    fbCopy(v);
  }
  toast.textContent = v + ' 버블봇이 대신 복사해드렸어요! 연락을 기다릴게요>< ✓';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

function fbCopy(tx) {
  const el = document.createElement('textarea');
  el.value = tx;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}
