 (function() {
      const canvas = document.getElementById('drawing-canvas');
      const ctx = canvas.getContext('2d');
      const colorPicker = document.getElementById('color-picker');
      const brushSizeInput = document.getElementById('brush-size');
      const clearBtn = document.getElementById('clear-btn');
      const saveBtn = document.getElementById('save-btn');

      // Resize canvas to fit container
      function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight - (container.querySelector('.toolbar').offsetHeight + container.querySelector('header').offsetHeight);
      }

      window.addEventListener('resize', () => {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        resizeCanvas();
        ctx.putImageData(imgData, 0, 0);
      });

      resizeCanvas();

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = colorPicker.value;
      ctx.lineWidth = brushSizeInput.value;

      let drawing = false;
      let lastX = 0;
      let lastY = 0;

      function startDrawing(x,y){
        drawing = true;
        lastX = x;
        lastY = y;
      }

      function drawLine(x,y){
        if(!drawing) return;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        lastX = x;
        lastY = y;
      }

      function stopDrawing() {
        drawing = false;
      }

      // Mouse events
      canvas.addEventListener('mousedown', e => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        startDrawing(e.clientX - rect.left, e.clientY - rect.top);
      });
      canvas.addEventListener('mousemove', e => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        drawLine(e.clientX - rect.left, e.clientY - rect.top);
      });
      canvas.addEventListener('mouseup', e => {
        e.preventDefault();
        stopDrawing();
      });
      canvas.addEventListener('mouseout', e => {
        e.preventDefault();
        stopDrawing();
      });

      // Touch events
      canvas.addEventListener('touchstart', e => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        if(e.touches.length > 0){
          const touch = e.touches[0];
          startDrawing(touch.clientX - rect.left, touch.clientY - rect.top);
        }
      }, {passive: false});
      canvas.addEventListener('touchmove', e => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        if(e.touches.length > 0){
          const touch = e.touches[0];
          drawLine(touch.clientX - rect.left, touch.clientY - rect.top);
        }
      }, {passive: false});
      canvas.addEventListener('touchend', e => {
        e.preventDefault();
        stopDrawing();
      }, {passive: false});

      // Controls
      colorPicker.addEventListener('input', e => {
        ctx.strokeStyle = e.target.value;
      });
      brushSizeInput.addEventListener('input', e => {
        ctx.lineWidth = e.target.value;
      });

      clearBtn.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      });

      saveBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'drawing.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    })();
