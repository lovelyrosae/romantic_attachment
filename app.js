// 성인 애착유형 진단 앱 메인 로직

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const questionsList = document.getElementById('questionsList');
  const answeredCountEl = document.getElementById('answeredCount');
  const progressPercentEl = document.getElementById('progressPercent');
  const progressBarFill = document.getElementById('progressBarFill');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const pageIndicator = document.getElementById('pageIndicator');
  const navControls = document.getElementById('navControls');
  const btnSubmit = document.getElementById('btnSubmit');
  const submitHint = document.getElementById('submitHint');
  const checklistForm = document.getElementById('checklistForm');
  const resultSection = document.getElementById('resultSection');
  const progressSection = document.getElementById('progressSection');
  const btnResetAnswers = document.getElementById('btnResetAnswers');

  const btnModePage = document.getElementById('btnModePage');
  const btnModeAll = document.getElementById('btnModeAll');

  const btnReviewAnswers = document.getElementById('btnReviewAnswers');
  const btnPrint = document.getElementById('btnPrint');
  const btnRetake = document.getElementById('btnRetake');

  // State
  const userAnswers = {}; // { 1: 1, 2: 0, ... } (1: 예, 0: 아니오)
  let currentMode = 'page'; // 'page' | 'all'
  let currentPage = 1;
  const pageSize = 5;
  const totalQuestions = ATTACHMENT_QUESTIONS.length; // 42
  const totalPages = Math.ceil(totalQuestions / pageSize); // 9

  // Initialize
  initApp();

  function initApp() {
    renderQuestions();
    updateProgress();
    bindEvents();
  }

  function bindEvents() {
    // Mode toggle
    btnModePage.addEventListener('click', () => setMode('page'));
    btnModeAll.addEventListener('click', () => setMode('all'));

    // Pagination
    btnPrev.addEventListener('click', () => changePage(-1));
    btnNext.addEventListener('click', () => changePage(1));

    // Reset
    btnResetAnswers.addEventListener('click', () => {
      if (confirm('모든 답변을 초기화하시겠습니까?')) {
        resetAnswers();
      }
    });

    // Form Submit
    checklistForm.addEventListener('submit', (e) => {
      e.preventDefault();
      calculateAndShowResult();
    });

    // Result Actions
    btnRetake.addEventListener('click', () => {
      resetAnswers();
      resultSection.classList.add('hidden');
      checklistForm.classList.remove('hidden');
      progressSection.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    btnReviewAnswers.addEventListener('click', () => {
      setMode('all');
      resultSection.classList.add('hidden');
      checklistForm.classList.remove('hidden');
      progressSection.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    btnPrint.addEventListener('click', () => {
      window.print();
    });
  }

  function setMode(mode) {
    currentMode = mode;
    if (mode === 'page') {
      btnModePage.classList.add('active');
      btnModeAll.classList.remove('active');
      navControls.classList.remove('hidden');
    } else {
      btnModeAll.classList.add('active');
      btnModePage.classList.remove('active');
      navControls.classList.add('hidden');
    }
    renderQuestions();
  }

  function showAlert(msg) {
    const modal = document.getElementById('customAlertModal');
    const msgEl = document.getElementById('modalMessage');
    const confirmBtn = document.getElementById('btnModalConfirm');

    if (!modal || !msgEl || !confirmBtn) return;

    msgEl.textContent = msg;
    modal.classList.remove('hidden');

    const closeModal = () => {
      modal.classList.add('hidden');
    };

    confirmBtn.onclick = closeModal;
  }

  function changePage(delta) {
    if (delta > 0 && currentMode === 'page') {
      const startIdx = (currentPage - 1) * pageSize;
      const endIdx = startIdx + pageSize;
      const currentQuestions = ATTACHMENT_QUESTIONS.slice(startIdx, endIdx);

      const hasUnanswered = currentQuestions.some(q => userAnswers[q.id] === undefined);
      if (hasUnanswered) {
        showAlert('해당 페이지의 측정을 완료해주세요');

        // Highlight unanswered cards on current page
        currentQuestions.forEach(q => {
          if (userAnswers[q.id] === undefined) {
            const card = document.getElementById(`qCard_${q.id}`);
            if (card) {
              card.classList.add('unanswered-warning');
              setTimeout(() => card.classList.remove('unanswered-warning'), 2500);
            }
          }
        });
        return;
      }
    }

    const newPage = currentPage + delta;
    if (newPage >= 1 && newPage <= totalPages) {
      currentPage = newPage;
      renderQuestions();
      window.scrollTo({ top: progressSection.offsetTop - 20, behavior: 'smooth' });
    }
  }

  function renderQuestions() {
    questionsList.innerHTML = '';

    let questionsToRender = ATTACHMENT_QUESTIONS;

    if (currentMode === 'page') {
      const startIdx = (currentPage - 1) * pageSize;
      const endIdx = startIdx + pageSize;
      questionsToRender = ATTACHMENT_QUESTIONS.slice(startIdx, endIdx);
      
      pageIndicator.textContent = `${currentPage} / ${totalPages} 페이지`;
      btnPrev.disabled = currentPage === 1;
      btnNext.disabled = currentPage === totalPages;
    }

    questionsToRender.forEach((q) => {
      const qCard = document.createElement('div');
      const isAnswered = userAnswers[q.id] !== undefined;
      const currentVal = userAnswers[q.id];

      qCard.className = `question-card ${isAnswered ? 'answered' : ''}`;
      qCard.id = `qCard_${q.id}`;

      qCard.innerHTML = `
        <div class="question-header">
          <span class="q-num">Q${q.id}</span>
          <p class="q-text">${q.text}</p>
        </div>
        <div class="options-group">
          <label class="option-label ${currentVal === 1 ? 'selected-yes' : ''}">
            <input type="radio" name="q_${q.id}" value="1" ${currentVal === 1 ? 'checked' : ''}>
            <span>예 (그렇다)</span>
          </label>
          <label class="option-label ${currentVal === 0 ? 'selected-no' : ''}">
            <input type="radio" name="q_${q.id}" value="0" ${currentVal === 0 ? 'checked' : ''}>
            <span>아니오 (그렇지 않다)</span>
          </label>
        </div>
      `;

      // Event listener for radio change
      const radios = qCard.querySelectorAll(`input[name="q_${q.id}"]`);
      radios.forEach((radio) => {
        radio.addEventListener('change', (e) => {
          const val = parseInt(e.target.value, 10);
          userAnswers[q.id] = val;
          qCard.classList.add('answered');

          // Highlight selected label
          const labels = qCard.querySelectorAll('.option-label');
          labels.forEach(l => l.classList.remove('selected-yes', 'selected-no'));
          if (val === 1) {
            labels[0].classList.add('selected-yes');
          } else {
            labels[1].classList.add('selected-no');
          }

          updateProgress();
        });
      });

      questionsList.appendChild(qCard);
    });
  }

  function updateProgress() {
    const answeredCount = Object.keys(userAnswers).length;
    const percent = Math.round((answeredCount / totalQuestions) * 100);

    answeredCountEl.textContent = answeredCount;
    progressPercentEl.textContent = `${percent}%`;
    progressBarFill.style.width = `${percent}%`;

    if (answeredCount === totalQuestions) {
      btnSubmit.disabled = false;
      submitHint.textContent = '모든 문항 작성 완료! 아래 버튼을 눌러 결과를 확인하세요.';
      submitHint.style.color = 'var(--primary)';
      submitHint.style.fontWeight = '700';
    } else {
      btnSubmit.disabled = true;
      submitHint.textContent = `모든 질문(42문항)에 답변하시면 결과 버튼이 활성화됩니다. (${totalQuestions - answeredCount}문항 남음)`;
      submitHint.style.color = 'var(--text-muted)';
      submitHint.style.fontWeight = '400';
    }
  }

  function resetAnswers() {
    for (const key in userAnswers) {
      delete userAnswers[key];
    }
    currentPage = 1;
    updateProgress();
    renderQuestions();
  }

  // Calculate scores and display result according to Sheet 1 & Sheet 2 criteria
  function calculateAndShowResult() {
    let scoreA = 0; // 불안형
    let scoreB = 0; // 안정형
    let scoreC = 0; // 회피형

    ATTACHMENT_QUESTIONS.forEach((q) => {
      const val = userAnswers[q.id] || 0;
      if (val === 1) {
        if (q.category === 'A') scoreA++;
        else if (q.category === 'B') scoreB++;
        else if (q.category === 'C') scoreC++;
      }
    });

    const levelInfoA = getScoreLevel(scoreA);
    const levelInfoB = getScoreLevel(scoreB);
    const levelInfoC = getScoreLevel(scoreC);

    // Update Scores & Badges
    document.getElementById('scoreA').textContent = scoreA;
    document.getElementById('scoreB').textContent = scoreB;
    document.getElementById('scoreC').textContent = scoreC;

    const badgeA = document.getElementById('badgeA');
    const badgeB = document.getElementById('badgeB');
    const badgeC = document.getElementById('badgeC');

    badgeA.textContent = levelInfoA.level;
    badgeA.className = `level-badge ${levelInfoA.badgeClass}`;

    badgeB.textContent = levelInfoB.level;
    badgeB.className = `level-badge ${levelInfoB.badgeClass}`;

    badgeC.textContent = levelInfoC.level;
    badgeC.className = `level-badge ${levelInfoC.badgeClass}`;

    // Gauges (0~14 max)
    document.getElementById('gaugeA').style.width = `${(scoreA / 14) * 100}%`;
    document.getElementById('gaugeB').style.width = `${(scoreB / 14) * 100}%`;
    document.getElementById('gaugeC').style.width = `${(scoreC / 14) * 100}%`;

    // Sheet 2 Table Mapping
    document.getElementById('tableScoreA').textContent = `${scoreA}점`;
    document.getElementById('tableScoreB').textContent = `${scoreB}점`;
    document.getElementById('tableScoreC').textContent = `${scoreC}점`;

    const tableLevelA = document.getElementById('tableLevelA');
    const tableLevelB = document.getElementById('tableLevelB');
    const tableLevelC = document.getElementById('tableLevelC');

    tableLevelA.textContent = levelInfoA.level;
    tableLevelA.className = `level-pill ${levelInfoA.badgeClass}`;

    tableLevelB.textContent = levelInfoB.level;
    tableLevelB.className = `level-pill ${levelInfoB.badgeClass}`;

    tableLevelC.textContent = levelInfoC.level;
    tableLevelC.className = `level-pill ${levelInfoC.badgeClass}`;

    // Dominant Type Determination & Detailed Guidance
    const dominantDiagnosis = determineDominantType(scoreA, scoreB, scoreC, levelInfoA.level, levelInfoB.level, levelInfoC.level);

    document.getElementById('dominantTypeName').textContent = dominantDiagnosis.typeName;
    document.getElementById('dominantTypeSummary').textContent = dominantDiagnosis.summary;
    document.getElementById('analysisContent').innerHTML = dominantDiagnosis.detailHtml;

    // Show Result View
    checklistForm.classList.add('hidden');
    progressSection.classList.add('hidden');
    resultSection.classList.remove('hidden');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function determineDominantType(a, b, c, levelA, levelB, levelC) {
    let typeName = '';
    let summary = '';
    let detailHtml = '';

    // Standard psychological classification logic based on score patterns
    if (b >= 10 || (b > a && b > c && levelB !== '낮음')) {
      // 안정형 우세
      typeName = '안정형 애착 (Secure Attachment)';
      summary = '친밀함에 대해 솔직하고 편안하게 느끼며, 파트너와의 신뢰감 형성에 뛰어납니다.';
    } else if (a >= 8 && c >= 8) {
      // 불안-회피형 / 혼란형
      typeName = '공포-회피형 / 혼란형 애착 (Fearful-Avoidant Attachment)';
      summary = '친밀해지고 싶은 갈망과 거절당하거나 상처받을 것에 대한 두려움이 공존합니다.';
    } else if (a > c) {
      // 불안형 우세
      typeName = '불안형 애착 (Anxious Attachment)';
      summary = '관계에 대한 관심과 친밀감 갈망이 높으나, 거절 및 이별에 대한 불안감을 비교적 크게 느낍니다.';
    } else if (c > a) {
      // 회피형 우세
      typeName = '회피형 애착 (Avoidant Attachment)';
      summary = '독립성과 개인적 자유를 최우선으로 여기며, 친밀감이 지나치게 깊어지면 부담을 느낍니다.';
    } else {
      // 고른 분포 / 균등형
      typeName = '복합/균등형 애착 (Balanced/Mixed Attachment)';
      summary = '세 가지 성향의 요소들이 상황에 따라 고르게 드러나는 복합적인 성향입니다.';
    }

    // Detailed Guide HTML for all 3 types based on their specific levels (Sheet 2)
    detailHtml = `
      <div class="analysis-card type-b-card">
        <h4>💚 Type B. 안정형 성향 진단: ${b}점 (${levelB})</h4>
        <p>${getAnalysisTextB(levelB, b)}</p>
        <ul class="advice-list">
          <li><strong>관계 팁:</strong> 자신의 감정을 정직하게 나누고 상대방의 기분도 너그럽게 배려할 수 있는 강점이 있습니다.</li>
          <li>파트너가 불안해하거나 회피할 때 경청과 경계 설정으로 건강한 관계 기준을 제시해주세요.</li>
        </ul>
      </div>

      <div class="analysis-card type-a-card">
        <h4>🧡 Type A. 불안형 성향 진단: ${a}점 (${levelA})</h4>
        <p>${getAnalysisTextA(levelA, a)}</p>
        <ul class="advice-list">
          <li><strong>관계 팁:</strong> 파트너의 미세한 신호나 차가운 태도를 자의적으로 확대해석하지 않는 연습이 필요합니다.</li>
          <li>불안이 밀려올 때 파트너에게 비난 대신 "지금 안심받고 싶어"라는 직접적 언어로 표현해보세요.</li>
        </ul>
      </div>

      <div class="analysis-card type-c-card">
        <h4>💙 Type C. 회피형 성향 진단: ${c}점 (${levelC})</h4>
        <p>${getAnalysisTextC(levelC, c)}</p>
        <ul class="advice-list">
          <li><strong>관계 팁:</strong> 자신만의 동굴로 도망치고 싶을 때 파트너에게 닫힌 문이 아닌 "혼자만의 시간이 조금 필요해"라고 미리 양해를 구하세요.</li>
          <li>친밀함이 자율성을 앗아가는 것이 아니라 서로를 지탱해주는 울타리가 될 수 있음을 조금씩 경험해보세요.</li>
        </ul>
      </div>
    `;

    return { typeName, summary, detailHtml };
  }

  function getAnalysisTextA(level, score) {
    if (level === '높음') {
      return `불안형 성향 점수가 ${score}점으로 높은 수준입니다. 파트너에게 과도하게 몰입하거나 상대의 감정 변화에 민감하게 반응하여 거절에 대한 두려움을 크게 경험할 수 있습니다.`;
    } else if (level === '보통') {
      return `불안형 성향 점수가 ${score}점으로 보통 수준입니다. 스트레스가 높아지거나 상대방이 멀어지게 느껴질 때 순간적으로 관계에 대한 불안감을 느낄 수 있습니다.`;
    }
    return `불안형 성향 점수가 ${score}점으로 낮은 수준입니다. 거절이나 이별에 대해 지나친 걱정 없이 편안한 태도를 유지합니다.`;
  }

  function getAnalysisTextB(level, score) {
    if (level === '높음') {
      return `안정형 성향 점수가 ${score}점으로 높은 수준입니다! 관계에서 안정감과 신뢰를 바탕으로 파트너와 원활하게 소통하고 감정을 솔직하게 공유하는 능력이 뛰어납니다.`;
    } else if (level === '보통') {
      return `안정형 성향 점수가 ${score}점으로 보통 수준입니다. 대체로 안정적인 대인관계를 유지하지만, 상황에 따라 불안이나 회피적 반응이 가끔 나타날 수 있습니다.`;
    }
    return `안정형 성향 점수가 ${score}점으로 낮은 수준입니다. 친밀감을 형성하거나 타인에게 의지하고 신뢰하는 부분에 있어서 다소 도전과제가 있을 수 있습니다.`;
  }

  function getAnalysisTextC(level, score) {
    if (level === '높음') {
      return `회피형 성향 점수가 ${score}점으로 높은 수준입니다. 속마음을 털어놓거나 상대방에게 의지하는 것에 강한 거부감을 느낄 수 있으며, 자신만의 자율성과 공간을 침해받는 것에 예민할 수 있습니다.`;
    } else if (level === '보통') {
      return `회피형 성향 점수가 ${score}점으로 보통 수준입니다. 자신만의 시간이 필요하다는 생각을 자주 하며, 지나친 밀착 관계에 가끔 부자연스러움을 느낄 수 있습니다.`;
    }
    return `회피형 성향 점수가 ${score}점으로 낮은 수준입니다. 친밀감이 깊어지는 것에 부담이 적으며, 상대방과의 깊은 유대감을 자연스럽게 받아들입니다.`;
  }
});
