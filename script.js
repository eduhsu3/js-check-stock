let drinkData = [];

/* let drinkData = [
    { name: 'cola', unitPrice: 1200, remaind: 9 },
    { name: 'sprite', unitPrice: 1000, remaind: 8 },
    { name: 'maccol', unitPrice: 800, remaind: 0 },
]; */

const remaindCheckBtn = document.querySelector('#checkRemaindBtn'); //재고확인 버튼
const productManageBtn = document.querySelector('#productManageBtn'); //재고수정 버튼
const buyBtn = document.querySelector('#buyBtn'); //구매하기 버튼

const remaindUl = document.querySelector('#remaindUl'); //재고 출력 ul
const radioDiv = document.querySelector('#radioDiv'); //음료 타입 라디오 출력
const manageDiv = document.querySelector('#manageDiv'); //상품재고 화면 전체 div
const manageUl = document.querySelector('#manageList'); //상품재고 ul
const manageBtnGroup = document.querySelector('.manage_btn_group'); //상품재고 버튼 그룹

let initDataState = true;

function init() {
    getLocalStorage();
}
init();

//function createData() {}

//=============================================
//=============================================
//=============================================

//스토리지에서 불러오기
function getLocalStorage() {
    const storageData = localStorage.getItem('drinkData');
    if (storageData) {
        drinkData = JSON.parse(storageData);
    } else {
        alert('로컬 저장소에 데이터가 존재 하지 않습니다.');
        initDataState = false;

        // const event = new Event('click');
        // productManageBtn.dispatchEvent(event);
    }
}

//스토리지에 저장
function setLocalStorage() {
    localStorage.setItem('drinkData', JSON.stringify(drinkData));
}

//=================재고확인 버튼===========================
//=================재고확인 버튼===========================
//=================재고확인 버튼===========================
//=================재고확인 버튼===========================

//재고확인 버튼 클릭시 --> 화면에 내용출력
remaindCheckBtn.addEventListener('click', () => {
    if (initDataState === false) drinkData = [];
    //console.log(initDataState);
    //console.log(drinkData);

    //관리화면 숨기기
    manageDiv.style.display = 'none';
    manageUl.innerHTML = '';
    manageBtnGroup.style.display = 'none';

    //재고화면 초기화 및 보이기
    remaindUl.style.display = 'block';
    remaindUl.innerHTML = '';
    radioDiv.style.display = 'block';
    radioDiv.innerHTML = '';

    getLocalStorage(); //로컬스토리지 데이터 가져오기
    drawRemaindDrinkList(); //화면에 재고 출력
    drawRadioList(); //화면에 음료선택 타입 출력
    checkAllOutOfStock(); //모든 음료가 동시에 재고 0인지 확인
});

function checkAllOutOfStock() {
    if (drinkData.length) {
        //모든 음료가 재고 0인지 확인 =================
        let ableCount = 0;
        drinkData.forEach((forItem) => {
            if (forItem.remaind > 0) {
                ableCount++;
            }
        });
        if (ableCount === 0) {
            alert('음료 전체 품절입니다. 다음에 이용해주세요');
            buyBtn.style.display = 'none'; //구매버튼 숨기기
            return;
        }
        buyBtn.style.display = 'inline-block'; //구매버튼 보이기
    }
}

//=============================================

//재고 화면 출력 함수
function drawRemaindDrinkList() {
    remaindUl.innerHTML = '';
    drinkData.forEach((item) => {
        const eleLi = document.createElement('li');
        eleLi.textContent = `${item.name} : ${item.remaind}개 남음`;
        remaindUl.appendChild(eleLi);
    });
}

//========================================================

//음료선택 라디오 화면 출력 함수
function drawRadioList() {
    let tempTag = '';
    drinkData.forEach((item, idx) => {
        let commaPrice = item.unitPrice.toLocaleString('Ko-KR');
        let str = `<label ${item.remaind <= 0 ? 'class="disabled"' : ''}><input type='radio' name='DRINK_TYPE' ${item.remaind <= 0 ? 'disabled' : ''} value='${item.name}' />${item.name} (${commaPrice} 원)</label>`;
        tempTag += str;
    });
    radioDiv.innerHTML = tempTag;
}

//=========================================================

//구매하기 버튼
buyBtn.addEventListener('click', () => {
    let targetData = null;
    //체크된 라디오의 요소를 querySelector로 가져오기
    const checkedRadio = document.querySelector('input[name="DRINK_TYPE"]:checked');
    if (checkedRadio) {
        targetData = drinkData.find((dataItem) => dataItem.name === checkedRadio.value);
    } else {
        alert('음료를 선택해 주세요');
        return;
    }
    /* 
    //체크된 라디오 요소를 getElementsByName 으로 가져오기
    const radioNodeList = document.getElementsByName('DRINK_TYPE');
    radioNodeList.forEach((forItem) => {
        if (forItem.checked) {
            targetData = drinkData.find((dataItem) => dataItem.name === forItem.value);
        } else {
        }
    }); */

    // if (targetData === null) {
    //     alert('음료를 선택해 주세요');
    //     return;
    // }

    let userBuyNum = prompt(`구매하실 ${targetData.name} 개수를 입력해 주세요`, 1);
    if (userBuyNum === null) {
        return;
    }
    userBuyNum = Number(userBuyNum);

    if (userBuyNum > targetData.remaind) {
        let buyContinue = confirm(`재고량을 초과하였습니다. 
현재 재고량 ${targetData.remaind} 개로 구매 진행 하시겠습니까?`);
        if (!buyContinue) {
            return;
        }
        userBuyNum = targetData.remaind;
    }

    let totalPrice = targetData.unitPrice * userBuyNum;
    let finalConfirm = confirm(`주문 확인 : ${targetData.name} ${userBuyNum}개 맞나요? 금액은 ${totalPrice.toLocaleString('Ko-KR')} 입니다.`);

    if (finalConfirm) {
        targetData.remaind = targetData.remaind - userBuyNum; //배열 속 객체 데이터 업데이트
        setLocalStorage(); //로컬스토리지에 데이터 저장
        getLocalStorage(); //로컬스토리지에서 데이터 가져오기
        drawRemaindDrinkList(); //화면에 재고 출력
        drawRadioList(); //화면에 음료선택 타입 출력
        checkAllOutOfStock(); //모든 음료가 동시에 재고 0인지 확인
    }
});

//=======================상품/재고 관리 버튼==========================
//=======================상품/재고 관리 버튼==========================
//=======================상품/재고 관리 버튼==========================
//=======================상품/재고 관리 버튼==========================

//상품/재고 관리 버튼 클릭시 --> 로컬스토리지 초기 값 넣기
productManageBtn.addEventListener('click', () => {
    //재고화면 초기화 및 숨기기
    remaindUl.style.display = 'none';
    remaindUl.innerHTML = '';
    radioDiv.style.display = 'none';
    radioDiv.innerHTML = '';
    buyBtn.style.display = 'none';
    //관리화면 보이기
    manageDiv.style.display = 'block';
    manageUl.innerHTML = '';
    manageBtnGroup.style.display = 'block';

    //drinkData 에 의존해서 input 을 각각 개수만큼 화면에 그려줘서 수정가능하게 한다
    //최초 drinkData 개수만큼 그려주고 + 추가 할수도 있다.
    //삭제할 수도있다.
    //저장 않고 다른 메뉴 이동시 .. 체크 후 알림

    if (initDataState) {
        getLocalStorage();
        inputGenerator();
    } else {
        //drinkData.push({ name: '', unitPrice: '', remaind: '' });
        //inputGenerator();
        const newLi = document.createElement('li');
        newLi.innerHTML = `        
        <input id="name_0" value="" placeholder='상품명'/> /
        <input id="unitPrice_0" value="" placeholder='단가'/> /
        <input id="remaind_0" value="" placeholder='재고량'/>        
    `;

        manageUl.appendChild(newLi);
    }
});

//DB의 갯수만큼 li > input 생성 함수
function inputGenerator() {
    manageUl.innerHTML = '';
    drinkData.forEach((item, idx) => {
        const tempLi = document.createElement('li');
        tempLi.innerHTML = `        
        <input id="name_${idx}" value="${item.name}" placeholder='상품명'/> /
        <input id="unitPrice_${idx}" value="${item.unitPrice}" placeholder='단가'/> /
        <input id="remaind_${idx}" value="${item.remaind}" placeholder='재고량'/>        
    `;
        manageUl.appendChild(tempLi);
    });
}

//상품/재고 수정후 저장 클릭시
const manageSaveBtn = document.querySelector('#manageSaveBtn');
manageSaveBtn.addEventListener('click', updateDrinkData);
function updateDrinkData() {
    const lis = manageUl.querySelectorAll('li');
    const updateData = Array.from(lis).map((_, idx) => {
        const nameValue = document.getElementById(`name_${idx}`).value;
        const unitPriceValue = document.getElementById(`unitPrice_${idx}`).value;
        const remaindValue = document.getElementById(`remaind_${idx}`).value;
        return { name: nameValue, unitPrice: unitPriceValue, remaind: remaindValue };
    });
    console.log(updateData);

    drinkData = updateData;
    setLocalStorage();
    alert('저장 되었습니다.');
    if (drinkData.length > 0) {
        initDataState = true;
    } else {
        initDataState = false;
    }
    //저장 후 재고 확인으로 이동
    //저장 후 재고 확인으로 이동
    //저장 후 재고 확인으로 이동
    //저장 후 재고 확인으로 이동
    //저장 후 재고 확인으로 이동
    //저장 후 재고 확인으로 이동

    //저장할때... filter 를 사용해서 빈값은 날리고 최종 저장할 필요가 있다.
    //저장할때... filter 를 사용해서 빈값은 날리고 최종 저장할 필요가 있다.
    //저장할때... filter 를 사용해서 빈값은 날리고 최종 저장할 필요가 있다.
    //저장할때... filter 를 사용해서 빈값은 날리고 최종 저장할 필요가 있다.
}

//상품/재고 수정후 취소 클릭시
/* const manageCancelBtn = document.querySelector('#manageCancelBtn');
manageCancelBtn.addEventListener('click', () => {
    //취소 후 재고 확인으로 이동
    //취소 후 재고 확인으로 이동
    //취소 후 재고 확인으로 이동
    //취소 후 재고 확인으로 이동
    //취소 후 재고 확인으로 이동
    //취소 후 재고 확인으로 이동
    //취소 후 재고 확인으로 이동
}); */

//상품 추가
const addBtn = document.querySelector('#addBtn');
addBtn.addEventListener('click', () => {
    const lis = manageUl.querySelectorAll('li');
    const lastIdx = lis.length;

    const newLi = document.createElement('li');
    newLi.innerHTML = `        
    <input id="name_${lastIdx}" value="" placeholder='상품명'/> /
    <input id="unitPrice_${lastIdx}" value="" placeholder='단가'/> /
    <input id="remaind_${lastIdx}" value="" placeholder='재고량'/>        
`;
    [...lis].forEach((node) => {
        manageUl.appendChild(node);
    });
    manageUl.appendChild(newLi);

    /*     drinkData.push({ name: '', unitPrice: '', remaind: '' });
    console.log(drinkData);
    inputGenerator(); */
    //상품 입력폼 한줄 추가
    //기존 배열 데이터를 복제하고... 빈값을 한줄 추가 한 후에...그 배열 데이터로 목록을 다시 그린다.
    //기존 배열 데이터를 복제하고... 빈값을 한줄 추가 한 후에...그 배열 데이터로 목록을 다시 그린다.
    //기존 배열 데이터를 복제하고... 빈값을 한줄 추가 한 후에...그 배열 데이터로 목록을 다시 그린다.
    //기존 배열 데이터를 복제하고... 빈값을 한줄 추가 한 후에...그 배열 데이터로 목록을 다시 그린다.
    //기존 배열 데이터를 복제하고... 빈값을 한줄 추가 한 후에...그 배열 데이터로 목록을 다시 그린다.
    //기존 배열 데이터를 복제하고... 빈값을 한줄 추가 한 후에...그 배열 데이터로 목록을 다시 그린다.
});

//상품 제거
const removeBtn = document.querySelector('#removeBtn');
removeBtn.addEventListener('click', () => {
    const lis = manageUl.querySelectorAll('li');
    if (lis.length > 0) {
        lis[lis.length - 1].remove();
    }

    /*   if (drinkData.length > 0) {
        drinkData.pop();
        console.log(drinkData);
        inputGenerator();
    } */
    //상품 입력폼 한줄씩 제거
    //복제한 배열 데이터에서.. 빈값을 한줄 삭제 한 후에...그 배열 데이터로 목록을 다시 그린다.
    //복제한 배열 데이터에서.. 빈값을 한줄 삭제 한 후에...그 배열 데이터로 목록을 다시 그린다.
    //복제한 배열 데이터에서.. 빈값을 한줄 삭제 한 후에...그 배열 데이터로 목록을 다시 그린다.
    //복제한 배열 데이터에서.. 빈값을 한줄 삭제 한 후에...그 배열 데이터로 목록을 다시 그린다.
    //복제한 배열 데이터에서.. 빈값을 한줄 삭제 한 후에...그 배열 데이터로 목록을 다시 그린다.
});

//==================================================================
//==================================================================
//==================================================================

//최초 화면에 재고 출력
//drawRemaindDrinkList();

//최초 화면에 음료선택 타입 출력
//drawRadioList();
