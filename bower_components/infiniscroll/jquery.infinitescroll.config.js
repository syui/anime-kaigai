$(function(){
    $('.container').infinitescroll({
        navSelector  : ".pagination",
        nextSelector : ".pagination a.next",
        itemSelector : ".activity-stream"
    });
});
