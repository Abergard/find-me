
function PathFinding(map)
{
    var self = this;
    var m_finite_state_machine = FSM.EDIT;
    var m_is_algorithm_running = false;
    var m_run_one_step_algorithm = false;
    var m_map = map;
    var m_chosen_algorithm = null;

    new function()
    {
        checkAlgorithmFromInput();
    };


    this.GetState = function()
    {
        return m_finite_state_machine;
    };

    this.GetAlgorithm =
    [
        dfs = new DepthFirstSearchAlgorithm(),
        bfs = new BreadthFirstSearchAlgorithm(),
        dijkstra = new DijkstraAlgorithm(),
        astar = new AStar()
    ];

    this.clickPlay = function()
    {
        switch (m_finite_state_machine)
        {
            case FSM.EDIT:
                img_pause.src="icon/pause.png";
                btn_play.style.border = BorderType.CLICKED;
                m_finite_state_machine = FSM.PLAY;
                prepareAlghoritmDefaults();
                m_is_algorithm_running = true;
                break;

            case FSM.PAUSE:
                btn_pause.style.border = BorderType.NOT_CLICKED;

            case FSM.PLAY:
                img_pause.src="icon/eraser.png";
                btn_play.style.border = BorderType.NOT_CLICKED;
                m_finite_state_machine = FSM.EDIT;
                stopAlghoritm();
                break;
        }
    };

    this.clickStep = function()
    {
        switch (m_finite_state_machine)
        {
            case FSM.EDIT:
                img_pause.src="icon/pause.png";
                btn_play.style.border = BorderType.CLICKED;
                prepareAlghoritmDefaults();

            case FSM.PLAY:
                btn_pause.style.border = BorderType.CLICKED;
                m_finite_state_machine = FSM.PAUSE;
                m_is_algorithm_running = false;

            case FSM.PAUSE:
                m_run_one_step_algorithm = true;
                break;
        }
    };

    this.clickPause = function()
    {
        switch (m_finite_state_machine)
        {
            case FSM.PLAY:
                btn_pause.style.border = BorderType.CLICKED;
                m_finite_state_machine = FSM.PAUSE;
                m_is_algorithm_running = false;
                break;

            case FSM.PAUSE:
                btn_pause.style.border = BorderType.NOT_CLICKED;
                m_finite_state_machine = FSM.PLAY;
                m_is_algorithm_running = true;
                break;

            case FSM.EDIT:
                m_map.ClearMap();
                break;

        }
    };

    this.makeStep = function()
    {
        if((m_is_algorithm_running || m_run_one_step_algorithm) && (self.GetAlgorithm[m_chosen_algorithm].isFinish() == false))
        {
            m_run_one_step_algorithm = false;
            self.GetAlgorithm[m_chosen_algorithm].step();
        }
    };

    function checkAlgorithmFromInput()
    {
        var algorithm = document.getElementsByName('alg');

        for (var i = 0, length = algorithm.length; i < length; i++)
        {
            if (algorithm[i].checked)
            {
                SetAlgorithm(algorithm[i].value);
                break;
            }
        }
    }

    function prepareAlghoritmDefaults()
    {
        checkAlgorithmFromInput();
        self.GetAlgorithm[m_chosen_algorithm].reset(m_map.getMapSize(), m_map.getMapWidth());
    }

    function SetAlgorithm(algorithm)
    {
        m_chosen_algorithm = algorithm;
    }

    function stopAlghoritm()
    {
        m_is_algorithm_running = false;
        m_map.ClearAlghoritm();
    }
}


