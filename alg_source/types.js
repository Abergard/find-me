
var INFINITY = 1/0;
var TIMEOUT = 0;

var ColorsType =
{
    WHITE: 0,
    BLACK: 1,
    GREEN: 2,
    RED: 3,
    CHOSEN: 4,
    ON_STACK: 5,
    DELETED: 6,
    PATH: 7,

    TO_WHITE: 10,
    TO_BLACK: 11,
    TO_GREEN: 12,
    TO_RED: 13,
    TO_CHOSEN: 14,
    TO_ON_STACK: 15,
    TO_DELETED: 16,
    TO_PATH: 17
};

var BorderType =
{
    CLICKED : "dashed",
    NOT_CLICKED : "outset"
};

var ColorsValue =
[
    "#fff",
    "#000",
    "#008000",
    "#ff0000",
    "#9acd32",
    "#6495ed",
    "#778899",
    "#ffff00"
];

var FSM =
{
    PLAY: 0,
    PAUSE: 1,
    EDIT: 2
};

var AlgorithmType =
{
    DFS      : 0,
    BFS      : 1,
    DIJKSTRA : 2,
    A_STAR   : 3
};

var STEP_EVENTS =
{
    NEXT_STEP       : 0,
    ONE_MORE_STEP   : 1,
    THE_SAME_STEP   : 2
};