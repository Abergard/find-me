function Graphics(canvas, coordinateDiv)
{
    var self = this;
    var m_need_full_redraw = true;
    var m_need_redraw = false;
    var m_canvas = canvas;
    var m_context = canvas.getContext("2d");
    var canvas_width;
    var canvas_height;
    var editor_width;
    var editor_height;
    var quad_size;
    var grid_color = "#ccc";
    var size_of_map;
    var editor_x;
    var editor_y;
    var m_coordinateDiv = coordinateDiv;

    var path_length = 0.0;
    var path_length_area = document.getElementById('counter');

    var m_editor_color_array = [];
    var m_start_end_position = [0, 1];

    this.drawFrame = function()
    {
        if(m_need_full_redraw)
        {
            m_need_full_redraw = false;
            RecalculateAndRedraw()
        }
        else if(m_need_redraw)
        {
            m_need_redraw = false;
            DrawQuads();
        }
    };

    this.increasePathLength = function(value)
    {
        path_length = path_length + value;
        path_length_area.innerHTML = "długość ścieżki: " + path_length.toString();
    };

    this.getMapSize = function()
    {
        return size_of_map;
    };

    this.getMapWidth = function()
    {
        return editor_x;
    };

    this.getColorAt = function(position)
    {
        return m_editor_color_array[position];
    };

    this.getStartPosition = function()
    {
        return m_start_end_position[0];
    };

    this.getEndPosition = function()
    {
        path_length = 0.0;
        return m_start_end_position[1];
    };

    this.getQuadPosition = function(mouse_position)
    {
        var rect = m_canvas.getBoundingClientRect();
        var x = mouse_position.clientX - rect.left;
        var y = mouse_position.clientY - rect.top;

        if(x >= editor_width || y >= editor_height || x < 0 || y < 0)
        {
            return -1;
        }
        x = Math.floor(x/quad_size);
        y = Math.floor(y/quad_size);
        m_coordinateDiv.innerHTML = "(" + x.toString() + ", " + y.toString() + ")";
        return editor_x * y + x;
    };

    this.ClearAlghoritm = function()
    {
        for(var i = 0; i < size_of_map; ++i)
        {
            if(m_editor_color_array[i] != ColorsType.WHITE &&
                m_editor_color_array[i] != ColorsType.BLACK &&
                m_editor_color_array[i] != ColorsType.GREEN &&
                m_editor_color_array[i] != ColorsType.RED )
            {
                m_editor_color_array[i] = ColorsType.TO_WHITE;
            }
        }
        m_need_redraw = true;
    };

    this.ClearMap = function()
    {
        for(var i = 0; i < size_of_map; ++i)
        {
            m_editor_color_array[i] = ColorsType.TO_WHITE;
        }

        m_editor_color_array[m_start_end_position[0]] = ColorsType.TO_GREEN;
        m_editor_color_array[m_start_end_position[1]] = ColorsType.TO_RED;
    };



    this.changeQuad = function(quadColor, position)
    {
        if(position != null)
        {
            switch (quadColor)
            {
                case ColorsType.WHITE:
                case ColorsType.BLACK:
                    if(quadColor == m_editor_color_array[position])
                    {
                        m_editor_color_array[position] = !m_editor_color_array[position] + 10;
                    }
                    break;

                case ColorsType.RED:
                    if(m_editor_color_array[position] == ColorsType.WHITE)
                    {
                        m_editor_color_array[m_start_end_position[1]] = ColorsType.TO_WHITE;
                        m_editor_color_array[position] = ColorsType.TO_RED;
                        m_start_end_position[1] = position;
                    }
                    break;

                case ColorsType.GREEN:
                    if(m_editor_color_array[position] == ColorsType.WHITE)
                    {
                        m_editor_color_array[m_start_end_position[0]] = ColorsType.TO_WHITE;
                        m_editor_color_array[position] = ColorsType.TO_GREEN;
                        m_start_end_position[0] = position;
                    }
                    break;

                case ColorsType.CHOSEN:
                    if(m_editor_color_array[position] == ColorsType.ON_STACK)
                    {

                        m_editor_color_array[position] = ColorsType.TO_CHOSEN;
                    }
                    break;

                case ColorsType.DELETED:
                    if(m_editor_color_array[position] == ColorsType.CHOSEN ||
                        m_editor_color_array[position] == ColorsType.TO_CHOSEN)
                    {
                        m_editor_color_array[position] = ColorsType.TO_DELETED;
                    }
                    break;

                case ColorsType.ON_STACK:
                    m_editor_color_array[position] = ColorsType.TO_ON_STACK;

                    break;

                case ColorsType.PATH:
                    if(m_editor_color_array[position] != ColorsType.GREEN &&
                        m_editor_color_array[position] != ColorsType.RED)
                    {
                        m_editor_color_array[position] = ColorsType.TO_PATH;
                    }
                    break;

                default :
            }

            m_need_redraw = true;
        }
    };

    function RecalculateAndRedraw()
    {
        RecalculateEditorSize();
        self.ClearMap();
        DrawGrid();
        DrawQuads();
    }

    function RecalculateEditorSize()
    {
        canvas_width = 1000;
        canvas_height = 600;

        quad_size = 10;

        m_canvas.width = canvas_width - (canvas_width % quad_size);
        m_canvas.height = canvas_height - (canvas_height % quad_size);

        m_canvas.style.marginTop = -(canvas_height/2);
        m_canvas.style.marginLeft = -(canvas_width/2);

        editor_width = m_canvas.width ;
        editor_height = m_canvas.height;

        editor_x = editor_width / quad_size;
        editor_y = editor_height / quad_size;

        size_of_map = editor_x * editor_y;
    }

    function DrawGrid()
    {
        m_context.beginPath();

        var x = 0.5;
        for (; x <= editor_width+0.5; x += quad_size)
        {
            m_context.moveTo(0, x);
            m_context.lineTo(editor_width, x);
            m_context.moveTo(x, 0);
            m_context.lineTo(x, editor_height);
        }

        m_context.strokeStyle = grid_color;
        m_context.stroke();
    }

    function DrawQuads()
    {
        var quadColor;
        var x;
        var y;

        for(var i = 0; i < size_of_map; ++i)
        {
            if(m_editor_color_array[i] >= 10)
            {
                m_editor_color_array[i] -= 10;
                y = Math.floor(i / editor_x);
                x = i - (y * editor_x);
                quadColor = ColorsValue[m_editor_color_array[i]];
                m_context.fillStyle = quadColor;
                m_context.fillRect(x*quad_size + 1, y*quad_size+ 1, quad_size-1, quad_size-1);
            }
        }
    }
}