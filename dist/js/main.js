function exportBookmarklet(){//完成したbookmarkletをクリップボードに出力する関数
    function createCode(dataArray){ // ブックマークレット内の最終的に実行するコードを文字列化したものを作成する関数
        let result = "";
        for(let value of dataArray){
            result += `fillInputInTheLabel("${encodeURIComponent(value.specify)}", "${encodeURIComponent(value.content)}");`
            result += "\n";
        }
        console.log(result)
        return result;
    }

    const formData = getInput();
    const stringCode = createCode(formData);
    const pasteTemplate=`
        function clearFormValue(element){
            const valueLength = element.value.length;
            element.focus();
            for(let i = 0; i < valueLength; i++){
                document.execCommand('delete', false);
            }
        }
        
        function addFormValue(element, value){
            element.focus();
            document.execCommand('insertText', false, value);
        }
        
        function overrideFormValue(element, value){
            clearFormValue(element);
            addFormValue(element, value);
        }
        
        function fillInputInTheLabel(labelName, text){
            const allForms = Array.from(document.querySelector("div.o3Dpx").childNodes);
            try {
                const formInput = allForms.find(value => value.querySelector("span").textContent === decodeURIComponent(labelName)).querySelector("input");
                overrideFormValue(formInput, decodeURIComponent(text));
            }catch {
            }
        }
        
        try {
            ${stringCode}
        }
        catch (exception) {
            window.alert("Google Form画面上で実行してください。");
        }
    `;
    console.log(pasteTemplate)
    const bookmarklet=convertBookmarklet(pasteTemplate);
    pasteClipboard(bookmarklet);
}

function convertBookmarklet(sourceCode){//受け取った文字列をブックマークレットの型にはめ込む関数
    const result=`javascript:(function(){${sourceCode}})()`
    return result
}

function pasteClipboard(value){//受け取った文字列をクリップボードに貼り付ける関数
    if(navigator.clipboard){//サポートしているかを確認
        navigator.clipboard.writeText(value)//クリップボードに出力
        window.alert("クリップボードに出力しました。")
    }
}

function getInput(){ //フォームの入力内容をオブジェクトで取得する関数
    const result = new Array()
    const inputForms = document.getElementById("inputArea").querySelectorAll("div.input-form")
    for(let i = 0; i < inputForms.length; i++){
        const specifyInputElm = inputForms[i].querySelector(".specify input")
        const contentInputElm = inputForms[i].querySelector(".content input")
        result[i] = new Object()
        result[i].specify = specifyInputElm.value
        result[i].content = contentInputElm.value
    }
    return result
}

function addInput(){ //input要素を追加する関数
    const resultElm = document.createElement('div');
    resultElm.classList.add("input-form")

        //指定のラベルを入力するフォームの作成
        const specify = document.createElement('div');
        specify.classList.add("specify")

            const specifyUniqueKey = Date.now().toString();

            // ラベル要素の作成
            const specifyLabelElm = document.createElement('label');
            specifyLabelElm.textContent = '指定のラベル：';
            specifyLabelElm.htmlFor = specifyUniqueKey; // for属性に一意キーを指定

            // input要素の作成
            const specifyInputElm = document.createElement('input');
            specifyInputElm.type = 'input';
            specifyInputElm.id = specifyUniqueKey;
            specifyInputElm.placeholder = '指定するラベル名を入力してください';

        specify.appendChild(specifyLabelElm);
        specify.appendChild(specifyInputElm);

        //指定されたラベルに紐付けて入力する内容の作成
        const content = document.createElement('div');
        content.classList.add("content")

            const contentUniqueKey = (Date.now() + 1).toString();

            // ラベル要素の作成
            const contentLabelElm = document.createElement('label');
            contentLabelElm.textContent = '入力する内容：';
            contentLabelElm.htmlFor = contentUniqueKey; // for属性に一意キーを指定

            // input要素の作成
            const contentInputElm = document.createElement('input');
            contentInputElm.type = 'input';
            contentInputElm.id = contentUniqueKey;
            contentInputElm.placeholder = '指定のラベルに入力する内容を入力してください';

        content.appendChild(contentLabelElm);
        content.appendChild(contentInputElm);

        //削除ボタンの作成
        const deleteButton = document.createElement('button');
        deleteButton.classList.add("deleteButton")
        deleteButton.textContent = "削除";
        deleteButton.addEventListener("click", function(){
            resultElm.parentNode.removeChild(resultElm);
        });

    resultElm.appendChild(specify);
    resultElm.appendChild(content);
    resultElm.appendChild(deleteButton);
    
    const addButton = document.getElementById('addButton');
    addButton.parentNode.insertBefore(resultElm, addButton); // 追加する要素を追加先の要素の直前に挿入する
}

addInput()