var modalEl = $("#modal-js");

let menuItem;
let title;
let start = 0;
let end = 10;

let watchmodeData = {
    id: '',
    title: '',
    plot_overiew: '',
    release_date: '',
    trailer: '',
    trailer_thumbnail: '',
}

const min = 0
const max = 250

$(document).ready(function() {

            // fetch movies
            function fetchMoviesList(category) {

                const apiUrl = `https://imdb-api.com/en/API/${category}/${apiKeys.imdb}`

                fetch(apiUrl).then(function(response) {
                        if (response.ok) {
                            response.json().then(function(data) {
                                // console.log(data);


                                if (category === "Top250Movies") {
                                    displayTopTen(data)
                                } else {
                                    displayMostPopular(data, start, end)
                                }
                            });
                        }
                    })
                    .catch(function(error) {
                        openModal(modalEl);
                        $('#modal-js').on('click', function(event) {
                            closeModal(modalEl);
                        });

                    });
            }

            // get Top 10 Tv Shows
            function fetchTvList(category) {

                const apiUrl = `https://imdb-api.com/en/API/${category}/${apiKeys.imdb}`

                $.ajax({
                    method: 'GET',
                    url: apiUrl,
                    dataType: 'json',
                    error: function(error) {
                        console.log(error)
                    },
                    success: function(response) {
                        // if successful
                        // console.log(response)
                        if (category === "Top250TVs") {
                            displayTopTen(response)
                        } else {
                            displayMostPopular(response, start, end)
                        }
                    }
                });
            }

            // display 10 random list
            function displayTopTen(response) {

                if ($('.show-list-header').length) {
                    $('.p-title').empty()
                }

                $('.p-title').append(`${menuItem}`)
                $('.p-title').append(`<div class="column show-list"></div>`)

                for (let i = 0; i < 10; i++) {
                    let random = Math.floor(Math.random() * (max - min)) + min
                    $('.show-list').append(`
        <div class="column has-text-dark has-background-light show-posters mt-3 mb-3 is-size-5 is-inline-block">
        <img class="poster" src="${response.items[random].image}" data-id="${response.items[random].id}" data-value="${random}"width="120px" height="120px">
    <p>${response.items[random].fullTitle}</p>
    </div>
    `)
                }

                // // show more info when user click on poster
                $('.poster').on('click', function(event) {
                    event.stopPropagation();

                    let id = event.target.dataset.value
                    let watchModeId = event.target.dataset.id
                    moreInfoModal(response, id, watchModeId)
                })

            }

            // modal
            function moreInfoModal(response, id, watchModeId) {

                watchFetch(watchModeId)
                let rating = Math.floor(response.items[id].imDbRating);
                console.log(watchmodeData.trailer)

                // open the modal
                $('#modal-js').addClass('is-active')

                $('.box-info').append(`
        <div class="more-info">
        <div class="modal-items">
        <img src="${response.items[id].image}" width="200px" height="200px">
        <p>Title: ${response.items[id].fullTitle}</p>
        <p>Actors/Actresses: ${response.items[id].crew}</p>
        <p>Year: ${response.items[id].year}</p>
        <div class="rating">
        <p>Rank:  ${response.items[id].rank}
        <p>Rating:
        ${Array(rating).fill().map((item, i) => `
          <img src="./assets/img/rating.png" width="20px" heigh=20px"></img>`).join('')}
      </div>

     <p>Trailer:</p><a href="${watchmodeData.trailer}" target="_blank">${watchmodeData.trailer}</a>
      </p>
        `)
     
//   

        // close the modal
        $('#modal-js').on('click', function(event) {
            if (!$(event.target).closest('.modal-content, modal').length) {
                $('body').find('.modal').removeClass('is-active');
                $('.box-info').html('')
            }
        });
    } // end of modal()

    function displayMostPopular(response, start, end) {

        if ($('.show-list-header').length) {
            $('.p-title').empty()
        }

        $('.p-title').append(`${menuItem}`)
        $('.p-title').append(`<div class="column show-list"></div>`)

        // $.each(response, function(index) {
        for (let i = start; i < end; i++) {
            $('.show-list').append(`
            <div class="column has-text-dark has-background-light show-posters mt-3 mb-3 is-size-5 is-inline-block">
            <img class="poster" src="${response.items[i].image}" data-value="${i}" width="120px" height="120px" >
            <p>${response.items[i].fullTitle}</p>
            <p><strong># ${response.items[i].rank}</p>
        </div>
        `)
        };

        $('.p-title').append(`<div class="column more-icon">
        <span class="material-icons icon-left">keyboard_double_arrow_left</span>
        <span class="material-icons icon-right">keyboard_double_arrow_right</span>
        </div>`)

        $('.icon-left').on('click', function() {

            if (end == 10) {
                $('.show-list').append(`<1>No more result!`)
                return;
            }

            if (start != 0) {
                start -= 10;
                end -= 10;

            } else if ($('.show-list').length) {
                $('.show-listing').empty()
                $('.material-icons').empty();
            }

            displayMostPopular(response, start, end)
        });

        $('.icon-right').on('click', function() {
            start += 10;
            end += 10;

            if (end > 100) {
                $('.show-listingt]').append(`<1>No more result!`)
                return;
            }

            if ($('.show-list').length) {
                $('.show-listing').empty()
                $('.material-icons').empty();
            }
            displayMostPopular(response, start, end)
        });

                       // // show more info when user click on poster
                       $('.poster').on('click', function(event) {
                        event.stopPropagation();
    
                        let id = event.target.dataset.value
                            // showMoreInfoTv(response, tvInfo)
                        moreInfoModal(response, id)
                    })
    } // end of displayMostPopTv

    /*
    * modal for fetch error
    */
    function openModal(el) {
        console.log(modalEl)
        modalEl[0].classList.add('is-active');
        document.querySelector('.box-info').textContent = 'Unable to connect to Movies API'
     
    }

    function closeModal(el) {
        modalEl[0].classList.remove('is-active');
    }

    /*
    * Search fetch
    */
    function search(category, title) {

        const apiUrl = `https://imdb-api.com/en/API/${category}/${apiKeys.imdb}/${title}`

        $.ajax({
            method: 'GET',
            url: apiUrl,
            dataType: 'json',
            error: function(error) {
                console.log(error)
            },
            success: function(response) {
                // if successful
                // console.log(response)
                    searchResult(response)
            }
        });

    } // end of search()

    /*
    * Search Result
    */
    function searchResult(response) {

        if ($('.show-list-header').length) {
            $('.p-title').empty()
        }

        var length = response.results.length

        $('.p-title').append(`${menuItem}`)
        $('.p-title').append(`<div class="column show-list"></div>`)
        for (let i = 0; i < length; i++){
            $('.show-list').append(`
    <div class="column has-text-dark has-background-light show-posters mt-3 mb-3 is-size-5 is-inline-block">
     <img class="poster" src="${response.results[i].image}" data-value="${i}"width="120px" height="120px">
     <div class="text">
     <p>${response.results[i].title}</p>
     <p>${response.results[i].description}</p>
    </div>
    </div>
        `)}

        $('.poster').on('click', function(event) {
            event.stopPropagation();
            let id = event.target.dataset.value
            
            $('#modal-js').addClass('is-active')
            $('.box-info').append(`
            <div class="more-info">
            <div class="modal-items">
            <img src="${response.results[id].image}" has-text-centered width="280px" height="280px">
            <p>Title: ${response.results[id].title}</p>
            <p>Description: ${response.results[id].description}</p>
            `);

            });

       
              // close the modal
        $('#modal-js').on('click', function(event) {
            if (!$(event.target).closest('.modal-content, modal').length) {
                $('body').find('.modal').removeClass('is-active');
                $('.box-info').html('')
            }
        });
                
        } // end of poster event

    /*
    * event listeners
    */
    $('.tv-show-btn').on('click', function(event) {
        event.stopPropagation();

        if ($('.show-list-header').length) {
            $('.p-title').empty()
        }


        let category = event.target.dataset.tv

        if (category === "Top250TVs") {
            menuItem = $('#1').text()
        } else {
            menuItem = $('#2').text()
        }
        console.log(category)
        fetchTvList(category)
    });

    /*
    * Where to watch 
    */

    function watchFetch(id){

        const apiUrl = `https://api.watchmode.com/v1/title/${id}/details/?apiKey=${apiKeys.watchmode}&append_to_response=sources'`
        
        $.ajax({
            method: 'GET',
            url: apiUrl,
            dataType: 'json',
            error: function(error) {
                console.log(error)
            },
            success: function(response) {
                // if successful
                watchmodeData.id = response.id
                watchmodeData.title = response.title
                  watchmodeData.plot_overiew = response.plot_overiew
                  watchmodeData.release_date = response.release_date
                  watchmodeData.year = response.year
                  watchmodeData.trailer = response.trailer
                  watchmodeData.trailer_thumbnail = response.trailer_thumbnail
             
            }
        });
    
    } // end of watchFetch()


    $('.movies-btn').on('click', function(event) {
        event.stopPropagation();

        if ($('.show-list-header').length) {
            $('.p-title').empty()
        }

        var category = event.target.dataset.movie;
       
        if (category === "Top250Movies") {
            menuItem = $('#1').text();
        } else {
            menuItem = $('#2').text();
        }
        fetchMoviesList(category);
        // event.stopPropagation();
    })


    $('#search-btn').on('click', function() {
        let e = document.getElementById("search-type")
        let category = e.value;
        title = $('.input').val()
     
    if (category === "SearchMovie") {
        menuItem = 'Movies';
    } 

    if (category === "SearchSeries"){
        menuItem = 'TV Series';
        console.log(category)
        console.log(title)
    }
        search(category, title)
    });

});