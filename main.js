'use strict';
{
  //output
  let result = '';
  const textarea = document.getElementById('result');
  const error = document.getElementById('error-message');
  const copyBtn = document.getElementById('copy-btn');
  const readme = document.getElementById('readme');
  const history = document.getElementById('history-ul');

  //input
  let url = document.getElementById('url');
  let name = document.getElementById('name');

  function audio(url, name) {
    if (name === '') {
      result = `youtube-dl -x -f 'bestaudio' --audio-format mp3 --audio-quality 0 ${url}`;
      return false;
    }
   
    result = "youtube-dl -x -f 'bestaudio' --audio-format mp3 --audio-quality 0 -o, --output "+'"'+name+".%(ext)s"+'" '+url;

    //例：youtube-dl -x -f 'bestaudio' --audio-format mp3 --audio-quality 0 -o, --output "test1.%(ext)s" https://youtu.be/IGInsosP0Ac
  }
  function video(url, name) {
    if (name === '') {
      result = `youtube-dl --merge-output-format mp4 -f 'bestvideo+bestaudio[ext=m4a]' ${url}`;
      return false;
    }
    result = `youtube-dl --merge-output-format mp4 -f 'bestvideo+bestaudio[ext=m4a]' -o, --output "${name}" ${url}`;

    //例：youtube-dl --merge-output-format mp4 -f 'bestvideo+bestaudio[ext=m4a]' -o, --output test3video https://youtu.be/IGInsosP0Ac
  }



  function main() {
    copyBtnReset(); //コピーボタンの文字列をリセット

    //input内容を更新する意味も兼ねて
    const urlV = url.value;
    const nameV = name.value;

    if (!(urlV)) {
      error.textContent = 'リンクを入力してください';
      error.style.display = 'block';
      textarea.value = '';
      return false;
    }

    const types = document.querySelectorAll('.type input')
    let selectedType = '';
    types.forEach(type => {
      if (type.checked === true) {selectedType = type.value}
      //選択されたtypeのvalue取得
    });
    if (selectedType === 'audio') {
      audio(urlV, nameV);
    } else if (selectedType === 'video') {
      video(urlV, nameV);
    } else {
      error.textContent = 'ダウンロードタイプを選択してください';
      error.style.display = 'block';
      return false;
    }

    const rmBestSetBtn = document.getElementById('remove-best-settings');
    if (rmBestSetBtn.checked === true) {
      result = result.split('--audio-quality 0').join('')
      result = result.split("-x -f 'bestaudio'").join('')
      //videoの場合はコマンド再生成して応急処置
      if (selectedType === 'audio') {
        result = result + ' --extract-audio';
      } else if (selectedType === 'video') {
        if (nameV === '') {
          result = `youtube-dl -f mp4 ${urlV}`
        } else {
          result = `youtube-dl -f mp4 -o "${nameV}.%(ext)s" ${urlV}`;
        }
      }
    }

    //ここまできたら、正常にコマンド作成完了
    textarea.value = result;
    error.style.display = 'none'; //いままでのエラー消去
    copyBtn.style.display = 'inline-block'; //コピーボタン表示
    //以下で履歴追加関数を実行
    addHistory(result);
    console.log('main()を正常に実行完了')
  }



  function copy() {
    textarea.select();
    //textareaを選択状態にする
    document.execCommand('Copy');
    // 選択してるものをコピーできる
    console.log(`コピー：${textarea.value}`);
    copyBtn.textContent = 'コピー完了';
    copyBtn.style.opacity = 0.5;
  }
  function copyBtnReset() {
    copyBtn.textContent = 'コピー';
    copyBtn.style.opacity = 1;
  }

  let historyNum = 0;
  function addHistory(result) {
    const li = document.createElement('li');
    li.setAttribute('id', `history-${historyNum}`); //新しいリストにインデックスidを付与
    li.textContent = result;
    history.insertBefore(li, document.getElementById(`history-${historyNum-1}`)); //一つ前のインデックスidを取得して、beforeのリファレンスとする
    
    historyNum++;
  }


  document.getElementById('initiate').addEventListener('click', () => {main()});
  copyBtn.addEventListener('click', () => {copy()});

  document.addEventListener('keydown', e => {
    if (e.key === 'd' && e.ctrlKey) {
      url.value = '';
      name.value = '';
    }
    if (e.key === 'Enter') {main()}
    if (e.key === 'c' && e.ctrlKey) {copy()}
  });

  document.getElementById('readme-btn').addEventListener('click', () => {
    readme.classList.remove('hide');
  });

  document.getElementById('close-icon').addEventListener('click', () => {
    readme.classList.add('hide');
  });
  
}