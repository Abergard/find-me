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
var no_frame = 0
var frame_sum = 0
var fps = 0;
var last_update = Date.now()
var last_draw = last_update
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
        no_frame = frame_sum = 0;

    }, 1000);

    setTimeout(frame);
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

function calculate_delta_time()
{
    var now = Date.now()
    var diff = (now - last_update);
    last_update = now;
    return diff;
}

function make_steps()
{
    var now = Date.now();
    var time_from_last_draw = (now - last_draw);

    var step_per_second = document.getElementById("animation_speed").value;
    var step_per_ms = step_per_second / 1000;
    var step_per_frame = Math.floor(step_per_ms * time_from_last_draw);
    var unused_time = time_from_last_draw - step_per_frame / step_per_ms;
    last_draw = now - unused_time;

    while(step_per_frame > 0){
        path_finder.makeStep();
        --step_per_frame;
        map.drawFrame();
    }
}

function frame()
{
    var dt = calculate_delta_time();

    make_steps();

    map.drawFrame();
    updateFpsCounter(dt);
    setTimeout(frame);
}

function updateFpsCounter(delta_time)
{
    if (delta_time > 0)
    {
        ++no_frame;
        var current_fps = 1000 / delta_time;
        frame_sum += 1 / current_fps;
        fps = no_frame / frame_sum;
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
