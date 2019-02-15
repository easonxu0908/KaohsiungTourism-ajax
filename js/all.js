
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
    let pagination = document.querySelector('.pagination');

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

    let dataFilter = [];
    // 將查詢區域的資料放入到新的陣列
    function queryArea(areaName) {
        // 清空
        dataFilter = [];
        for (let i = 0; i < dataRecords.length; i++) {
            // console.log(dataFilter[i].Zone);
            if (dataRecords[i].Zone == areaName) {
                dataFilter.push(dataRecords[i]);
            }
        }
        // console.log(dataFilter)
    }


    //"區域"選項
    function updateList(e) {
        let objValue = e.target.value;
        if (objValue != "") {
            queryArea(objValue);
            renderContent(1);
        }
    }

    //"熱門行政區"選項
    function popularArea(e) {
        // 點選button標籤在執行
        if (e.target.nodeName == 'BUTTON') {
            queryArea(e.target.textContent);
            renderContent(1);
        }
    }

    // 目前頁數、總頁數、總資料筆數
    let currentPage, totoalPage, totalItem;
    // 一頁6筆資料
    let perPage = 6;

    //分頁選項
    function paginationJS(e) {
        e.preventDefault();
        if (e.target.nodeName == 'A') {
            // 要前往哪一頁的變數
            let goPage;
            // 當上一頁或下一頁的變數
            let pervNext = Number(e.target.dataset.num);
            // 當點選上一頁或下一頁
            if (pervNext == -1 || pervNext == 1) {
                //上一頁
                if (pervNext == -1) {
                    if (currentPage + pervNext < 1) {
                        return false;
                    }
                    goPage = currentPage - 1;
                    //下一頁
                } else if (pervNext == 1) {
                    if (currentPage + pervNext > totoalPage) {
                        return false;
                    }
                    goPage = currentPage + 1;
                }
            } else {
                //直接點選分頁頁數
                goPage = Number(e.target.dataset.page);
                if (currentPage == goPage) {
                    return false;
                }
            }
            renderContent(goPage);
        }
    }




    // 渲染有幾頁用
    function renderPage() {
        // 沒有資料或資料小於6筆的時候，不顯示頁數
        if (dataFilter.length <= 0 || dataFilter.length <= 6) {
            pagination.style.display = 'none';
        } else {
            pagination.style.display = '';
            // 模板
            let prevPage = `<li><a href="#" data-num="-1">«</a> </li>`;
            let nexPage = ` <li><a href="#" data-num="1">»</a></li>`;
            if (totoalPage > 0) {
                let nbrHtml = '';
                for (let i = 0; i < totoalPage; i++) {
                    let tempNbr = `<li ><a  href="#" data-page="${(i + 1)}" class="pages">${(i + 1)}</a> </li>`;
                    nbrHtml += tempNbr;
                }
                pagination.innerHTML = prevPage + nbrHtml + nexPage;
            }
        }
        let pages = document.querySelectorAll('.pages');
        console.log(pages);
        console.log(currentPage);
        let page;
        for (let index = 0; index < pages.length; index++) {
            page = pages[index];
            // console.log(page.dataset.page);
            if (currentPage == page.dataset.page) {
                // console.log('yes');
                console.log(page);
                page.style.backgroundColor = "green";
                return page;
            }
            // 當目前的頁面與 pata-page 相同時，就將該按鈕上色
        }
    }



    // 渲染內容(第一次call api跟換頁功能共用方法 )
    //goPage 要前往的頁數
    function renderContent(goPage) {

        // document.querySelector('.fotter').style.display = '';

        //總資料筆數
        totalItem = dataFilter.length;

        // 當沒有查詢到資料的時候
        if (totalItem == 0) {
            zoneTitleJS.textContent = '查無資料';
            list.innerHTML = '';
            pagination.style.display = 'none';
            return false;
        }
        // 有資料的時候只要取第一筆的name即可
        zoneTitleJS.textContent = dataFilter[0].Zone;

        // 計算總共有幾頁(使用無條件進位)
        totoalPage = Math.ceil(totalItem / perPage);
        // 起始資料變數,結束資料變數
        let startItem;
        let endItem;

        //要前往的頁數是最後一頁
        if (goPage == totoalPage) {
            //剩餘資料 = 總資料筆數-(總頁數* 每頁資料6筆)
            let minusItem = totalItem - (totoalPage * perPage);

            if (minusItem == 0) { //判斷最後一頁是幾筆用,0就是6筆
                startItem = ((totoalPage - 1) * perPage);
                endItem = totalItem;
            } else { // 小於6筆
                startItem = ((totoalPage - 1) * perPage);
                endItem = totalItem;
            }
        } else {
            startItem = perPage * (goPage - 1);
            endItem = (goPage * 6);
        }
        // 渲染頁面
        let strHtml = '';

        for (let i = startItem; i < endItem; i++) {
            let name = dataFilter[i].Name;
            let zone = dataFilter[i].Zone;
            let opentime = dataFilter[i].Opentime;
            let add = dataFilter[i].Add;
            let tel = dataFilter[i].Tel;
            let ticket = dataFilter[i].Ticketinfo;
            let picture = dataFilter[i].Picture1;
            let tempHtml =
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


            strHtml += tempHtml;
        }

        list.innerHTML = strHtml;

        // 紀錄目前頁數用來點選上下頁用
        currentPage = goPage;

        // 渲染頁碼
        renderPage(totoalPage);
    }

    //監聽"區域"選項
    area.addEventListener('change', updateList, false);
    //監聽"熱門行政區"選項
    popular.addEventListener('click', popularArea, false);
    //監聽"分頁"選項
    pagination.addEventListener('click', paginationJS, false);

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

    $('a').on('click', function () {
        console.log('click')
    });
})