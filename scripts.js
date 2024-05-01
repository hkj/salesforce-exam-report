// 共通設定を保存するオブジェクト
const commonSettings = {
  admin: {
    title: "Salesforce認定アドミニストレーター",
    description: "正答率解析 合格点 65%",
    placeholder: "ここにメールやWebで得た試験結果を貼り付けて、解析ボタンを押してください。\n以下貼り付ける例：\n\nConfiguration and Setup（設定とセットアップ）: 70%\nObject Manager and Lightning App Builder（オブジェクトマネージャとLightning アプリケーションビルダー）	70%\nSales and Marketing Applications（セールス&マーケティングアプリケーション）	70%\nService and Support Applications（サービス&サポートアプリケーション）	70%\nProductivity and Collaboration（生産性向上とコラボレーション）	70%\nData and Analytics Management（データ管理&分析）	70%\nWorkflow/Process Automation（ワークフロー/プロセスの自動化）&#20;70%",
    settings: {
      "Configuration and Setup": 20,
      "Object Manager and Lightning App Builder": 20,
      "Sales and Marketing Applications": 12,
      "Service and Support Applications": 11,
      "Productivity and Collaboration": 7,
      "Data and Analytics Management": 14,
      "Workflow/Process Automation": 16
    },
    totalQuestions: 60,
    passingScore: 65
  },
  advAdmin: {
    title: "Salesforce認定上級アドミニストレーター",
    description: "正答率解析 合格点 65%",
    placeholder: "ここにメールやWebで得た結果を貼り付けて、解析ボタンを押してください。\n以下貼り付ける例：\n\nSecurity and Access（セキュリティとアクセス）:	70%\nObject and Applications（オブジェクトとアプリケーション）	70%\nAuditing and Monitoring（監査と監視）	70%\nCloud Applications（CLOUD アプリケーション）	70%\nData and Analysis Management（データと分析管理）	70%\nEnvironment Management and Deployment（変更管理とリリース）	70%\nProcess Automation（プロセスの自動化） 70%",
    settings: {
      "Security and Access": 20,
      "Object and Applications": 19,
      "Auditing and Monitoring": 10,
      "Cloud Applications": 11,
      "Data and Analytics Management": 13,
      "Environment Management and Deployment": 7,
      "Process Automation": 20
    },
    totalQuestions: 60,
    passingScore: 65
  },
  appBuilder: {
    title: "Salesforcel認定 Platform アプリケーションビルダー",
    description: "正答率解析 合格点 63%",
    placeholder: "ここにメールやWebで得た結果を貼り付けて、解析ボタンを押してください。\n以下貼り付ける例：\n\nSalesforce Fundamentals（SALESFORCE の基本）: 70%\nData Modeling and Management（データモデリングおよび管理）	70%\nBusiness Logic and Process Automation（ビジネスロジックとプロセスの自動化）	70%\nUser Interface（ユーザインターフェース）70%\nApp Deployment（アプリケーションのリリース）70%",
    settings: {
      "Salesforce Fundamentals": 23,
      "Data Modeling and Management": 22,
      "Business Logic and Process Automation": 28,
      "User Interface": 17,
      "App Deployment": 10
    },
    totalQuestions: 60,
    passingScore: 63

  }
}

//現在のページの設定を選択
let currentSettings = commonSettings.admin; // アドミンを選択してみる

// HTML要素に設定を適用
document.getElementsByClassName('title')[0].textContent = currentSettings.title;
document.getElementsByClassName('description')[0].textContent = currentSettings.description;
document.getElementById('score-input').placeholder = currentSettings.placeholder;

//Parse User Input
function parseUserInput(input) {
  const scores = {};
  let match;
  let pattern = /^(.+?)(?:\（.+?\）)?[\s:]*\s+(\d+)%/gm; // コロンの有無に関わらず対応するパターン

  while ((match = pattern.exec(input)) !== null) {
    let category = match[1].trim();
    category = category.replace(/（.+?）/g, '').trim(); // 日本語名を削除
    const score = parseInt(match[2], 10);

    Object.keys(currentSettings.settings).forEach((setting) => {
      // 設定名が入力されたカテゴリ名に部分的に含まれているか確認
      if (setting.toLowerCase() === category.toLowerCase()) {
        scores[setting] = score;
      }
    });
  }

return scores;
}

// caluclateScores
function calculateScores(userScores) {
  const totalQuestions = currentSettings.totalQuestions; // 総問題数
  const passingScore = currentSettings.passingScore; //合格ライン(%)
  const results = {};
  let totalCorrectAnswers = 0;

  // 要変更
  Object.keys(currentSettings.settings).forEach((category) => {
    const weight = currentSettings.settings[category];
    const scorePercentage = userScores[category] || 0;
    const questions = (totalQuestions * weight) / 100;
    const correctAnswers = (scorePercentage * questions) / 100;
    const incorrectAnswers = questions - correctAnswers;
    totalCorrectAnswers += correctAnswers; // 総正解数を更新

    results[category] = {
      '出題割合': weight,
      '出題数': questions,
      '正解率': scorePercentage,
      '正解数': correctAnswers,
      '不正解数': incorrectAnswers
    };
  });

  // 合格ラインに関連する計算
  const totalPercentage = (totalCorrectAnswers / totalQuestions) * 100;
  const questionsToPass = totalQuestions * (passingScore / 100);
  const differenceToPass = totalCorrectAnswers - questionsToPass;

  // 総合結果の追加
  results['総合結果'] = {
    '総問題数': totalQuestions,
    '合格ライン': passingScore,
    '必要正解数': questionsToPass,
    '総正解数': totalCorrectAnswers,
    '総合正解率': totalPercentage,
    '合格ラインとの差': differenceToPass
  };

  return results;
}



// display Results
function displayResults(results) {
  const resultsBody = document.getElementById('results-body');
  resultsBody.innerHTML = ''; // 既存の結果をクリア

  // カテゴリ毎の結果をテーブルに表示
  Object.keys(results).forEach((category) => {
    if (category !== '総合結果') {
      const tr = resultsBody.insertRow();
      tr.insertCell().textContent = category;
      tr.insertCell().textContent = results[category]['出題割合'] + '%';
      tr.insertCell().textContent = results[category]['出題数'].toFixed(3);
      tr.insertCell().textContent = results[category]['正解率'] + '%';
      tr.insertCell().textContent = results[category]['正解数'].toFixed(3);
      tr.insertCell().textContent = results[category]['不正解数'].toFixed(3);
    }
  });

  // 総合結果の行をテーブルに表示
  const totalResults = results['総合結果'];
  const trTotal = resultsBody.insertRow();
  trTotal.classList.add('highlight'); // スタイルの適用
  trTotal.insertCell().textContent = '総合結果';
  trTotal.insertCell().textContent = '100%'; // 出題割合は表示不要
  trTotal.insertCell().textContent = totalResults['総問題数'] + '問'; // 総問題数
  trTotal.insertCell().textContent = totalResults['総合正解率'].toFixed(3) + '%'; // 総合正解率
  // trTotal.insertCell().textContent = totalResults['必要正解数']; // 必要正解数
  trTotal.insertCell().textContent =  totalResults['総正解数'].toFixed(3) + '問'; // 総正解数
  trTotal.insertCell().textContent = (totalResults['総問題数'] - totalResults['総正解数']).toFixed(3) + '問'; // 総不正解数
  const differenceToPass = totalResults['合格ラインとの差'];
  trTotal.insertCell().textContent = (differenceToPass >= 0 ? '+' + differenceToPass.toFixed(3) : differenceToPass.toFixed(3)) + '問'; // 合格ラインとの差
}

// 選択されたオプションに基づいて、設定を適用する関数
function applySettings(choice) {
  if (!commonSettings[choice]) {
    console.error('Settings for the selected choice are undefined.');
    return;
  }
  const settings = commonSettings[choice];
  currentSettings = commonSettings[choice];
  document.getElementsByClassName('title')[0].textContent = settings.title;
  document.getElementsByClassName('description')[0].textContent = settings.description;
  document.getElementById('score-input').placeholder = settings.placeholder;

  // テキストエリアとテーブルの内容をクリア
  document.getElementById('score-input').value = '';
  const resultsBody = document.getElementById('results-body');
  resultsBody.innerHTML = '';
}

// Event Listner for clear-button
document.getElementById('clear-button').addEventListener('click', () => {
  document.getElementById('score-input').value = ''; // テキストエリアをクリア
  const resultsBody = document.getElementById('results-body');
  resultsBody.innerHTML = ''; // テーブルの内容をクリア
})

// Event Listner for analyze-button
document.getElementById('analyze-button').addEventListener('click', () => {
  const input = document.getElementById('score-input').value;
  const userScores = parseUserInput(input);
  if (Object.keys(userScores).length === 0) {
    // パースに失敗した場合のエラーメッセージを表示
    alert("テキストの形式が正しくありません。");
  } else {
    const results = calculateScores(userScores);
    displayResults(results);
  }
});

// Event Listner for Drop Down Select
document.getElementById('exam-select').addEventListener('change', function() {
  applySettings(this.value);
});
