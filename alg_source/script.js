// Visualization of Path Finding Algorithms
// Łukasz Zawistowicz
// 2015


// modules
var map;
var path_finder;

// mouse
var clicked_quad_color = -1;
var clicked_quad = null;
var is_mouse_down = false;
var is_mouse_moving = false;

// fps counter
var fps = 0;
var now = null;
var last_update = new Date;
var fps_filter = 1;

// button
var btn_play;
var btn_step;
var btn_pause;
var img_pause;

function init()
{
    var canvas = document.getElementById("main_editor");
    canvas.onmousedown = mouseDown;
    canvas.onmousemove = mouseMove;

    btn_play = document.getElementById("btn_play");
    btn_step = document.getElementById("btn_step");
    btn_pause = document.getElementById("btn_pause");
    img_pause = document.getElementById("img_pause");

    document.getElementById("main_body").onmouseup = mouseUp;

    map  = new Graphics(canvas, document.getElementById('coordinate'));
    path_finder = new PathFinding(map);

    for(var alg in path_finder.GetAlgorithm)
    {
        path_finder.GetAlgorithm[alg].setMap(map);
    }

    setInterval(function()
    {
        document.getElementById('fps').innerHTML = fps.toFixed(1) + "fps";
    }, 1000);

    setInterval(function()
    {
        //path_finder.makeStep();
    }, TIMEOUT);

    frame();
}

function Play()
{
    path_finder.clickPlay();
}

function Step()
{
    path_finder.clickStep();
}

function Pause()
{
    path_finder.clickPause();
}

function frame()
{
    path_finder.makeStep();
    map.drawFrame();

    updateFpsCounter();
    setTimeout(frame, TIMEOUT);
}

function updateFpsCounter()
{
    now = (new Date)*1;

    var diff = (now - last_update);

    var thisFrameFPS = 1000 / diff;

    if (now!=last_update)
    {
        fps += (thisFrameFPS - fps) / fps_filter;
        last_update = now;
    }
}

function mouseMove(e)
{
    var position = map.getQuadPosition(e);
    if(is_mouse_down)
    {
        is_mouse_moving = true;
        map.changeQuad(clicked_quad_color, position);
    }
}

function mouseUp()
{
    if(path_finder.GetState() == FSM.EDIT)
    {
        if(is_mouse_moving)
        {
            is_mouse_moving = false;
        }
        else
        {
            map.changeQuad(clicked_quad_color, clicked_quad);
        }
        is_mouse_down = false;
        clicked_quad_color = -1;
    }
}

function mouseDown(e)
{
    if(path_finder.GetState() == FSM.EDIT)
    {
        clicked_quad = map.getQuadPosition(e);
        if(clicked_quad < 0)
        {
            return;
        }
        clicked_quad_color = map.getColorAt(clicked_quad);
        is_mouse_down = true;
    }
}