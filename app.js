//used for resize debouncing
var resizeTimer;
var chapters;
var chapter
var menuOffset = 100
var roundingOffset = 5


$(document).on('ready', function(){
  mapChapterPositions()

  $(document).on('scroll', getScrollChapter)
  $(window).resize(mapChapterPositions)
  $(document).on('chapter-changed', chapterChanged )

  $('#menu a').on('click', function(){
    var cl = $(this).attr('class')
    var obj = getChapterOnString(cl)
    scrollToChapter(obj)
  })
})

/* ~~~~~~~~~~
   HELPERS
~~~~~~~~~~~ */
function mapChapterPositions(){
  //debouces window resizing
  clearTimeout(resizeTimer);
  if(!resizeTimer){
    indexChapters()
  }
  else{
    resizeTimer = setTimeout(indexChapters, 250)//end setTimeout
  }
  getScrollChapter()
  $(document).trigger('chapter-changed')
}

function indexChapters(){
  console.log('resize')
  var results = [{key:'root', top:0, index:0}]
  //gets all elements with the class starting with 'chapter-'
  var $chapters = $("[class^=chapter-]")
  var l = $chapters.length
  for(var i = 0; i < l; i++){
    var $el = $($chapters[i])
    var temp = {}

    //gets the word after 'chapter-'
    var cl = $el.attr("class").split("-")[1]
    temp.key = cl
    temp.top = $el.position().top
    temp.index = i+1

    /*
      {
        index: 0,
        key:'classname',
        top: 190px
      }
    */

    results.push(temp)
  }
  chapters = results
  getScrollChapter()
}

function getScrollChapter(){
  var sp = window.scrollY + menuOffset
  var maxIndex = 0
  for(var i=0; i < chapters.length; i++){
    var el = chapters[i]
    if(sp >= el.top){ maxIndex = i }
  }

  if(!chapter || maxIndex != chapter.index){
    chapter = chapters[maxIndex]
    $(document).trigger('chapter-changed')
  }
}

function chapterChanged(){
  var ch = chapter
  console.log(ch)
  updateMenu(ch)
}

function updateMenu(ch){
  $('#menu').find('.active').removeClass('active')
  $('#menu').find('.'+ch.key).addClass('active')
}

function scrollToChapter(ch){
  chapter = ch

  $('html, body').stop().animate({
     scrollTop: ch.top - menuOffset + roundingOffset
   }, 600);

  // $(document).trigger('chapter-changed')
}

function getChapterOnString(target){
  if(target == '') target = 'root'
  return chapters.filter(function(v){return v.key == target})[0]
}


