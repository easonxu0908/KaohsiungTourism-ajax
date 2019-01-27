
//使用AJAX下載資料
let xhr = new XMLHttpRequest();
xhr.open('get', 'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97', true);
xhr.send(null);
// console.log(xhr);
xhr.onload = function () {
    let data = JSON.parse(xhr.responseText);
    // console.log(data);
    dataRecords = data.result.records;
    // console.log(dataRecords);
    let len = dataRecords.length;

    // 指定DOM
    let area = document.getElementById('areaId');
    let list = document.querySelector('.list');
    let popular = document.querySelector('.popularZone');
    let zoneTitleJS = document.querySelector('.zoneTitle');

    //撈出dataRecords裡區域的值
    let zoneName = [];
    for (let i = 0; i < len; i++) {
        let recordsZoneName = dataRecords[i].Zone;
        // console.log(recordsZonName);
        zoneName.push(recordsZoneName);
        // console.log(zonName);
    }

    // //將撈出的records的"區域"的值過濾重複的之後塞進select裡面
    let iterativeZoneName = new Set(zoneName);
    // console.log(iterativeZoneName);
    for (let value of iterativeZoneName) {
        let newNode = document.createElement('option');
        // console.log(newNode);
        let placeText = document.createTextNode(value);
        // console.log(placeText);
        newNode.appendChild(placeText);
        area.appendChild(newNode);
    }

    //儲存每1頁景點字串的變數
    let pageStr = '';
    let pageStr2 = '';
    let pageStr3 = '';
    let pageStr4 = '';

    //區域的選項功能
    function updateList(e) {
        let select = e.target.value;
        //儲存被選取區域名稱的變數
        let strTitle = '';
        let str = '';
        //儲存被選取區域所有景點的陣列
        let selectedRecords = [];
        let len2 = selectedRecords.length;
        for (let i = 0; i < len; i++) {
            const name = dataRecords[i].Name;
            const zone = dataRecords[i].Zone;
            const opentime = dataRecords[i].Opentime;
            const add = dataRecords[i].Add;
            const tel = dataRecords[i].Tel;
            const ticket = dataRecords[i].Ticketinfo;
            const picture = dataRecords[i].Picture1;
            if (select == zone) {
                strTitle = `${zone}`
                str =
                    `<li class="card">
                <div class="cardHead">
                    <img src=${picture} alt="">
                    <h2>${name}</h2>
                    <h3>${zone}</h3>
                    <div class="clearFix"></div>
                </div>
                <div class="cardBody">
                    <p title="${opentime}"><img src="./images/icons_clock.png" alt="">${opentime}</p>
                    <p title="${add}"><img src="./images/icons_pin.png" alt="">${add}</p>
                    <div>
                        <p class="phone" title="${tel}"><img src="./images/icons_phone.png" alt="">${tel}</p>
                        <p class="ticket" title="${ticket}"><img src="./images/icons_tag.png" alt="">${ticket}</p>
                        <div class="clearFix"></div>
                    </div>
                </div>
            </li>`
                selectedRecords.push(str);
            }
        }
        //清空變數與設定變數值
        len2 = selectedRecords.length;
        pageStr = '';
        pageStr2 = '';
        pageStr3 = '';
        pageStr4 = '';
        //每頁pageStr最多只存取6個景點
        if (len2 <= 6) {
            //儲存0~6個景點景點字串
            for (let i = 0; i < len2; i++) {
                pageStr += selectedRecords[i];
            }
        } else if (len2 > 6 && len2 <= (6 * 2)) {
            for (let i = 0; i < 6; i++) {
                pageStr += selectedRecords[i];
            }//儲存7~12個景點景點字串
            for (let i = 6; i < len2; i++) {
                pageStr2 += selectedRecords[i];
            }
        } else if (len2 >= (6 * 2) && len2 <= (6 * 3)) {
            for (let i = 0; i < 6; i++) {
                str2 += selectedRecords[i];
            }
            for (let i = 6; i < (6 * 2); i++) {
                pageStr2 += selectedRecords[i];
            }//儲存13~18個景點景點字串(目前1區最多12個景點)
            for (let i = (6 * 2); i < len2; i++) {
                pageStr3 += selectedRecords[i];
            }
        } else if (len2 >= (6 * 3) && len2 <= (6 * 4)) {
            for (let i = 0; i < 6; i++) {
                str2 += selectedRecords[i];
            }
            for (let i = 6; i < (6 * 2); i++) {
                pageStr2 += selectedRecords[i];
            }
            for (let i = (6 * 2); i < (6 * 3); i++) {
                pageStr3 += selectedRecords[i];
            }//儲存19~24個景點景點字串(目前1區最多12個景點)
            for (let i = (6 * 3); i < len2; i++) {
                pageStr4 += selectedRecords[i];
            }
        }
        //標題區域名稱
        zoneTitleJS.innerHTML = strTitle;
        //預設被選取區域景點為第1頁
        list.innerHTML = pageStr;

        //設定分頁按鈕變數
        let paginationStr = '';
        //當景點在6個以下時，不顯示分頁按鈕
        if (len2 <= 6) {
            pagination.innerHTML = '';
            //當景點在7~12個時，顯示2個分頁按鈕
        } else if (len2 > 6 && len2 <= (6 * 2)) {
            paginationStr = ` <li><a class="active" href="#">1</a></li>
            <li><a href="#">2</a></li>`
            pagination.innerHTML = paginationStr;
            //當景點在13~18個時，顯示3個分頁按鈕(目前1區最多12個景點)
        } else if (len2 >= (6 * 2) && len2 <= (6 * 3)) {
            paginationStr = ` <li><a class="active" href="#">1</a></li>
            <li><a href="#">2</a></li>
            <li><a href="#">3</a></li>`
            pagination.innerHTML = paginationStr;
            //當景點在19~24個時，顯示3個分頁按鈕(目前1區最多12個景點)
        } else if (len2 >= (6 * 3) && len2 <= (6 * 4)) {
            paginationStr = ` <li><a class="active" href="#">1</a></li>
            <li><a href="#">2</a></li>
            <li><a href="#">3</a></li>
            <li><a href="#">4</a></li>`
            pagination.innerHTML = paginationStr;
        }
    }

    // 分頁按鈕功能
    function paginationJS(e) {
        //取消該元素預設功能
        e.preventDefault();
        //點擊非a元素則跳出函數
        if (e.target.nodeName !== "A") { return };
        // console.log(e.target.text);
        //設定變數取得該按鈕的值
        let pageText = e.target.text;
        //第1頁顯示第0~6個景點
        if (pageText == '1') {
            list.innerHTML = pageStr;
        } //第2頁顯示第7~12個景點
        else if (pageText == '2') {
            list.innerHTML = pageStr2;
        } //第3頁顯示第13~18個景點
        else if (pageText == '3') {
            list.innerHTML = pageStr3;
        } //第4頁顯示第18~24個景點
        else if (pageText == '4') {
            list.innerHTML = pageStr4;
        }
    }
    //熱門行政區的選項功能
    function popularArea(e) {
        //點擊非botton元素則跳出函數
        if (e.target.nodeName !== "BUTTON") { return };
        //將熱門行政區的名稱導入函數updateList()。這太強大了，立刻省去後續相同的程式碼。
        updateList(e);
    }
    //監聽"區域"選項
    area.addEventListener('change', updateList, false)
    //監聽"熱門行政區"選項
    popular.addEventListener('click', popularArea, false)
}

$(document).ready(function () {
    // 滑動回頁首 start
    $('.JQbackHomeIcon').click(function (event) {
        event.preventDefault();
        $('html,body').animate({
            scrollTop: 0
        }, 500);
    });
    // 滑動回頁首 end
})