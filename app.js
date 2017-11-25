'use strict';
(function ($, window, document) {

  let cities = [];
  let currentPage = 0;
  let offset = 0;
  let limit = 101;
  let loadBtnOffset;
  let isWaiting = false;

  $(function () {
    getNewItems(); // load

    $(window).on('scroll', $.throttle(infinityScroll, 300));

    $('#load').on('click', function () {
      createListItem(); //async
    });
  });

  function initPagination() {
    changeCurrentPage();
    changeLimitPage();
    $('.pagination').show();
  }

  function changeCurrentPage() {
    $('.current-page').html(currentPage);
  }

  function changeLimitPage() {
    $('.limit-page').html(Math.round(cities.length / limit));
  }

  function infinityScroll() {
     let windowBottom = window.pageYOffset + window.innerHeight;
     if (windowBottom >= loadBtnOffset + 20) {
       createListItem();
     }
  }

  function findBtnPos() {
    loadBtnOffset = $('#load').offset().top;
  }

  function getNewItems() {
    $.ajax({
      type: 'GET',
      url: 'data.json',
      success: function (data) {
        createItems(data)
      },
      error: function () {
        console.log('WRONG');
      }
    });
  }

  function createItems(data) {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const element = data[key];
        cities.push(element['city']);
      }
    }
    initPagination();
    createListItem();
  }

  function createListItem() {
    if (offset >= cities.length) return;

    // $('#load').html('LOADING').attr('disabled', 'true');
    // if (isWaiting) return;
    
    let item = $('<div>').addClass('list__item'); // <div class="list__item"></div>
    let items;

    for (let index = 0; index < limit; index++) {
      //@todo push once after for 
      if (index+offset >= cities.length) break;
      item
        .clone()
        .html(`<h2>${cities[index+offset]}</h2>`)
        //.addClass('loading') //scale 0
        .appendTo('.list')
    }
    offset += limit;
    findBtnPos();
    changeCurrentPage(currentPage++)

    // isWaiting = true;
    // setTimeout(()=>{
    //   isWaiting = false;
    //   $('#load').html('LOAD MORE').removeAttr('disabled');
    // },2000);

  }

}(window.jQuery, window, document));