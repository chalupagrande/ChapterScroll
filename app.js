//used for resize debouncing
var resizeTimer;
var chapters;
var chapter
var menuOffset = 100
var roundingOffset = 5
var animationTime = 600


$(document).on('ready', function(){
  mapChapterPositions()

  $(document).on('scroll', getScrollChapter)
  $(window).resize(mapChapterPositions)
  $(document).on('chapter-changed', chapterChanged )

  $('#menu a').on('click', function(){
    var cl = $(this).data('chapter-target')
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
  var results = [];
  //gets all elements with the class starting with 'chapter-'
  var $chapters = $("[data-chapter]")
  var l = $chapters.length
  for(var i = 0; i < l; i++){
    var $el = $($chapters[i])
    var temp = {}

    //get what the chapter is set to
    var cl = $el.data('chapter')
    temp.key = cl
    temp.top = $el.position().top
    temp.index = i

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
  updateMenu(ch)
}

function updateMenu(ch){
  $('#menu').find('.active').removeClass('active')
  $('#menu').find('[data-chapter-target$='+ch.key+']').addClass('active')
}

function scrollToChapter(ch){
  chapter = ch
  $('html, body').stop().animate({
     scrollTop: ch.top - menuOffset + roundingOffset
   }, animationTime);

}

function getChapterOnString(target){
  if(target == '') target = 'root'
  return chapters.filter(function(v){return v.key == target})[0]
}


