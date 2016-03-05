
function AStar()
{
    // private variable ----------------------------

    var m_map = null;
    var nodes = null;
    var path = null;
    var smallest_node = null;
    var step_number = 0;
    var distances_from_start = {};
    var heuristic = {};
    var previous_node = {};
    var number_main_state_loop = 11;
    var size_map = 0;
    var width_map = 0;
    var top_quad = false;
    var bottom_quad = false;
    var right_quad = false;
    var left_quad = false;
    var finish = false;
    var m_is_step_finished = false;
    var stepStates =
    [
        stepPrepare,           //0

        stepGetSmallestNode,   //1
        stepUpperQuad,         //2
        stepLeftQuad,          //3
        stepBottomQuad,        //4
        stepRightQuad,         //5
        stepUpperLeftQuad,     //6
        stepBottomLeftQuad,    //7
        stepBottomRightQuad,   //8
        stepUpperRightQuad,    //9
        stepDeleteNode,        //10

        stepResultFoundPath    //11
    ];

    // public functions --------------------------------------

    this.setMap = function(map)
    {
        m_map = map;
    };

    this.reset = function(p_size_map, p_width_map)
    {
        smallest_node = null;
        step_number = 0;
        size_map = p_size_map;
        width_map = p_width_map;
        finish = false;
        top_quad = false;
        bottom_quad = false;
        right_quad = false;
        left_quad = false;
    };

    this.step = function()
    {
        var event;
        while((event = stepStates[step_number]()) == STEP_EVENTS.ONE_MORE_STEP)
        {
            nextStep();
        }
        if(event == STEP_EVENTS.NEXT_STEP && step_number < number_main_state_loop)
        {
            nextStep();
        }
    };

    this.isFinish = function()
    {
        return finish;
    };

    // private functions ----------------------------------------

    function setStepStatus(status)
    {
        m_is_step_finished = status;
    }

    function IsStepFinished()
    {
        if(m_is_step_finished)
        {
            m_is_step_finished = false;
            return true;
        }
        return false;
    }

    function stepPrepare()
    {
        prepareGraph();
        prepareQueue();
        return STEP_EVENTS.ONE_MORE_STEP;
    }

    function setUpDistancesToInfinite(i)
    {
        distances_from_start[i] = INFINITY;
        previous_node[i] = null;
    }

    function calculateHeuristic(i)
    {
        return [Math.floor(i / width_map), ( i % width_map)];
    }

    function setUpHeuristic(i, heuristic_parameter)
    {
        var i_heuristic = calculateHeuristic(i);
        heuristic[i] = Math.abs(heuristic_parameter[0] - i_heuristic[0]) + Math.abs(heuristic_parameter[1] - i_heuristic[1]);
    }

    function setUpStartPosition()
    {
        distances_from_start[m_map.getStartPosition()] = 0.0;
    }

    function prepareGraph()
    {
        var heuristic_parameter = calculateHeuristic(m_map.getEndPosition());
        for(var i = 0; i < size_map; ++i)
        {
            setUpDistancesToInfinite(i);
            setUpHeuristic(i, heuristic_parameter);
        }
        setUpStartPosition();
    }

    function prepareQueue()
    {
        nodes = new goog.structs.PriorityQueue();
        nodes.enqueue(0,m_map.getStartPosition());
    }

    function stepGetSmallestNode()
    {
        smallest_node = nodes.dequeue();
        m_map.changeQuad(ColorsType.CHOSEN, smallest_node);
        return STEP_EVENTS.NEXT_STEP;
    }

    function stepUpperQuad()
    {
        top_quad = false;
        if(checkDistanceUpperQuad(smallest_node))
        {
            top_quad = true;
        }
        if(IsStepFinished())
        {
            return STEP_EVENTS.NEXT_STEP;
        }
        return STEP_EVENTS.ONE_MORE_STEP;
    }

    function stepLeftQuad()
    {
        left_quad = false;
        if(checkDistanceLeftQuad(smallest_node))
        {
            left_quad = true;
        }
        if(IsStepFinished())
        {
            return STEP_EVENTS.NEXT_STEP;
        }
        return STEP_EVENTS.ONE_MORE_STEP;
    }

    function stepBottomQuad()
    {
        bottom_quad = false;
        if(checkDistanceBottomQuad(smallest_node))
        {
            bottom_quad = true;
        }
        if(IsStepFinished())
        {
            return STEP_EVENTS.NEXT_STEP;
        }
        return STEP_EVENTS.ONE_MORE_STEP;
    }

    function stepRightQuad()
    {
        right_quad = false;
        if(checkDistanceRightQuad(smallest_node))
        {
            right_quad = true;
        }
        if(IsStepFinished())
        {
            return STEP_EVENTS.NEXT_STEP;
        }
        return STEP_EVENTS.ONE_MORE_STEP;
    }

    function stepUpperLeftQuad()
    {
        if((top_quad || left_quad))
        {
            checkDistanceUpperLeftQuad(smallest_node)
        }
        if(IsStepFinished())
        {
            return STEP_EVENTS.NEXT_STEP;
        }
        return STEP_EVENTS.ONE_MORE_STEP;
    }

    function stepBottomLeftQuad()
    {
        if((bottom_quad || left_quad))
        {
            checkDistanceBottomLeftQuad(smallest_node)
        }
        if(IsStepFinished())
        {
            return STEP_EVENTS.NEXT_STEP;
        }
        return STEP_EVENTS.ONE_MORE_STEP;
    }

    function stepBottomRightQuad()
    {
        if((bottom_quad || right_quad))
        {
            checkDistanceBottomRightQuad(smallest_node);
        }
        if(IsStepFinished())
        {
            return STEP_EVENTS.NEXT_STEP;
        }
        return STEP_EVENTS.ONE_MORE_STEP;
    }

    function stepUpperRightQuad()
    {
        if((top_quad || right_quad))
        {
            checkDistanceUpperRightQuad(smallest_node)
        }
        if(IsStepFinished())
        {
            return STEP_EVENTS.NEXT_STEP;
        }
        return STEP_EVENTS.ONE_MORE_STEP;
    }

    function stepDeleteNode()
    {
        m_map.changeQuad(ColorsType.DELETED, smallest_node);
        if(nodes.isEmpty())
        {
            foundTheShortestPath();
        }
        return STEP_EVENTS.NEXT_STEP;
    }

    function stepResultFoundPath()
    {
        if(path != null)
        {
            m_map.changeQuad(ColorsType.PATH, path);
            var before = path;
            path = previous_node[path];

            if(path != null)
            {
                if(path == before - 1 ||
                    path == before + 1 ||
                    path == before - width_map ||
                    path == before + width_map)
                {
                    m_map.increasePathLength(1);
                }
                else
                {
                    m_map.increasePathLength(1.5);
                }
            }
        }
        else
        {
            finish = true;
        }
        return STEP_EVENTS.THE_SAME_STEP;
    }

    function nextStep()
    {
        step_number = ((step_number + 1) % number_main_state_loop);
        if(step_number == 0)
        {
            ++step_number;
        }
    }

    function foundTheShortestPath()
    {
        step_number = number_main_state_loop;
        path = m_map.getEndPosition();
    }

    function chooseShorterPath(quad, neighbour_quad, weight)
    {
        var new_distance = distances_from_start[quad] + weight;
        if(m_map.getColorAt(neighbour_quad) == ColorsType.RED)
        {
            setStepStatus(true);
            previous_node[neighbour_quad] = quad;
            foundTheShortestPath();
        }
        else if(m_map.getColorAt(neighbour_quad) != ColorsType.BLACK
            && new_distance < distances_from_start[neighbour_quad])
        {
            setStepStatus(true);
            distances_from_start[neighbour_quad] = new_distance;
            previous_node[neighbour_quad] = quad;
            nodes.enqueue(new_distance + heuristic[neighbour_quad], neighbour_quad);
            m_map.changeQuad(ColorsType.ON_STACK, neighbour_quad);
        }
        else
        {
            setStepStatus(false);
            if(m_map.getColorAt(neighbour_quad) == ColorsType.BLACK)
            {
                return false
            }
        }
        return true;
    }

    function checkDistanceUpperQuad(position_before)
    {
        var result = false;
        if(position_before >= width_map)
        {
            result = chooseShorterPath(position_before, position_before - width_map, 1.0);
        }
        return result;
    }

    function checkDistanceLeftQuad(position_before)
    {
        var result = false;
        if(position_before % width_map != 0)
        {
            result = chooseShorterPath(position_before, position_before - 1, 1.0);
        }
        return result;
    }

    function checkDistanceUpperLeftQuad(position_before)
    {
        var result = false;
        if(position_before % width_map != 0 && position_before >= width_map)
        {
            result = chooseShorterPath(position_before, position_before - 1 - width_map, 1.5);
        }
        return result;
    }

    function checkDistanceBottomLeftQuad(position_before)
    {
        var result = false;
        if(position_before % width_map != 0 && position_before < size_map - width_map)
        {
            result = chooseShorterPath(position_before, position_before - 1 + width_map, 1.5);
        }
        return result;
    }

    function checkDistanceBottomRightQuad(position_before)
    {
        var result = false;
        if((position_before + 1) % width_map != 0 && position_before < size_map - width_map)
        {
            result = chooseShorterPath(position_before, position_before + 1 + width_map, 1.5);
        }
        return result;
    }

    function checkDistanceUpperRightQuad(position_before)
    {
        var result = false;
        if((position_before + 1) % width_map != 0 && position_before >= width_map)
        {
            result = chooseShorterPath(position_before, position_before + 1 - width_map, 1.5);
        }
        return result;
    }

    function checkDistanceBottomQuad(position_before)
    {
        var result = false;
        if(position_before < size_map - width_map)
        {
            result = chooseShorterPath(position_before, position_before + width_map, 1.0);
        }
        return result;
    }

    function checkDistanceRightQuad(position_before)
    {
        var result = false;
        if((position_before + 1) % width_map != 0)
        {
            result = chooseShorterPath(position_before, position_before + 1, 1.0);
        }
        return result;
    }
}
