// 本js用于各种浏览器监听窗口关闭事件

/* IE */
function onclose() {
    if (event.clentX > document.body.clientWidth && event.clientY < 0 || event.altKey) {
        return '您要离开吗？';
    }
}
window.onbeforeunload = onclose;

/* IE，FF  不区分刷新和关闭 */
window.onbeforeunload = onbeforeunload_handler;
window.onunload = onunload_handler;
function onbeforeunload_handler() {
    var warning = "确认退出?";
    return warning;
}
function onunload_handler() {
    var warning = "谢谢光临";
    alert(warning);
}

/* IE,FF ，最简单的 */
window.onbeforeunload = onclose;
function onclose(){
    return '您确定要退出吗？';
}