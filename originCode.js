function clearFormValue(element){ // フォームのinput要素等の既存の入力内容を削除する関数
    const valueLength = element.value.length
    element.focus()
    for(let i = 0; i < valueLength; i++){
        document.execCommand('delete', false);
    }
}

function addFormValue(element, value){ // フォームのinput要素等に内容を入力する関数
    element.focus()
    document.execCommand('insertText', false, value);
}

function overrideFormValue(element, value){ // フォームのinput要素等の内容を上書きする関数
    clearFormValue(element)
    addFormValue(element, value)
}

function fillInputInTheLabel(labelName, text){ // 特定のラベルを持つmicrosoftフォームのinput要素に内容を入力する関数
    const allForms = Array.from(document.querySelector("div.o3Dpx").childNodes) // フォームの要素を配列型で取得する
    const formInput = allForms.find(value => value.querySelector("span").textContent === labelName).querySelector("input") // 指定されたラベルと合致するラベルを持ったinput要素を取得する
    overrideFormValue(formInput, text)
}

fillInputInTheLabel("メールアドレス", "hoge@hogemail.com")
fillInputInTheLabel("氏名", "山田 太郎")