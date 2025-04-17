pc.script.createLoadingScreen(function (app) {
    var showSplash = function () {
        var wrapper = document.createElement('div');
        wrapper.id = 'application-splash-wrapper';
        document.body.appendChild(wrapper);
    
        var splash = document.createElement('div');
        splash.id = 'application-splash';
        wrapper.appendChild(splash);
    
        var logo = document.createElement('img');
        logo.src = ASSET_PREFIX + 'casinoicon.png'; 
        splash.appendChild(logo);
    
        var title = document.createElement('h1');
        title.innerHTML = '🎰 Lucky <span style="color:#f59e0b;">LIMITS</span>';
        splash.appendChild(title);
    
        var container = document.createElement('div');
        container.id = 'progress-bar-container';
        splash.appendChild(container);
    
        var bar = document.createElement('div');
        bar.id = 'progress-bar';
        container.appendChild(bar);
    };
    
    

    var hideSplash = function () {
        var splash = document.getElementById('application-splash-wrapper');
        splash.parentElement.removeChild(splash);
    };

    var setProgress = function (value) {
        var bar = document.getElementById('progress-bar');
        if (bar) {
            value = Math.min(1, Math.max(0, value));
            bar.style.width = value * 100 + '%';
        }
    };

    var createCss = function () {
        var css = `
            @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
    
            body {
                margin: 0;
                font-family: 'Press Start 2P', cursive;
            }
    
            #application-splash-wrapper {
                position: absolute;
                inset: 0;
                background: url('${ASSET_PREFIX}bgimage.png') repeat center center;
                background-size: cover;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: #fff;
                text-align: center;
            }
    
            #application-splash h1 {
                font-size: 14px;
                margin: 0 0 10px 0;
                color: #facc15;
                text-shadow: 2px 2px 4px #000;
                animation: flicker 1.5s infinite alternate;
            }
    
            #application-splash img {
                width: 64px;
                height: 64px;
                margin-bottom: 16px;
            }
    
            #progress-bar-container {
                width: 300px;
                height: 12px;
                background: rgba(255, 255, 255, 0.1);
                border: 2px solid #fff;
                border-radius: 8px;
                overflow: hidden;
            }
    
            #progress-bar {
                width: 0%;
                height: 100%;
                background: linear-gradient(90deg, #facc15, #f59e0b);
                transition: width 0.25s ease-in-out;
            }
    
            @keyframes flicker {
                from { opacity: 0.8; text-shadow: 0 0 5px #facc15; }
                to { opacity: 1; text-shadow: 0 0 20px #facc15, 0 0 30px #f59e0b; }
            }
    
            @media (max-width: 480px) {
                #progress-bar-container {
                    width: 200px;
                }
            }
        `;
    
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    };
    
    


    createCss();

    showSplash();

    app.on('preload:end', function () {
        app.off('preload:progress');
    });
    app.on('preload:progress', setProgress);
    app.on('start', hideSplash);
});
