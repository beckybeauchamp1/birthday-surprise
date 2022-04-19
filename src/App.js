import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function App() {

    const [showMakeAWish, setShowMakeAWish] = useState(false);
    const [showFlame, setShowFlame] = useState(true);
    const [animateScreen, setAnimateScreen] = useState(false);
    const [showDisney, setShowDisney] = useState(false);
    const [showDisneyTitle, setShowDisneyTitle] = useState(false);

    const toggleCandle = () => {
        setShowFlame(!showFlame);
        setAnimateScreen(true);
        const timeoutID = setTimeout(() => {
            setShowDisney(true);
            setAnimateScreen(false);
        }, 1500);
    }


    const renderDisney = () => {

        let canvas, ctx, w, h, particles = [], probability = 0.04,
            xPoint, yPoint = undefined;

        function onLoad() {
            canvas = document.getElementById("canvas");
            ctx = canvas.getContext("2d");
            resizeCanvas();

            window.requestAnimationFrame(updateWorld);
        }

        function resizeCanvas() {
            if (!!canvas) {
                w = canvas.width = window.innerWidth;
                h = canvas.height = window.innerHeight;
            }
        }

        function updateWorld() {
            update();
            paint();
            window.requestAnimationFrame(updateWorld);
        }

        function update() {
            if (particles.length < 500 && Math.random() < probability) {
                createFirework();
            }
            var alive = [];
            for (var i=0; i<particles.length; i++) {
                if (particles[i].move()) {
                    alive.push(particles[i]);
                }
            }
            particles = alive;
        }

        function paint() {
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = "rgba(0,0,0,0.2)";
            ctx.fillRect(0, 0, w, h);
            ctx.globalCompositeOperation = 'lighter';
            for (var i=0; i<particles.length; i++) {
                particles[i].draw(ctx);
            }
        }

        function createFirework() {
            xPoint = Math.random()*(w-200)+100;
            yPoint = Math.random()*(h-200)+100;
            var nFire = Math.random()*50+100;
            var c = "rgb("+(~~(Math.random()*200+55))+","
                 +(~~(Math.random()*200+55))+","+(~~(Math.random()*200+55))+")";
            for (var i=0; i<nFire; i++) {
                var particle = new Particle();
                particle.color = c;
                var vy = Math.sqrt(25-particle.vx*particle.vx);
                if (Math.abs(particle.vy) > vy) {
                    particle.vy = particle.vy>0 ? vy: -vy;
                }
                particles.push(particle);
            }
        }

        function Particle() {
            this.w = this.h = Math.random()*4+1;

            this.x = xPoint-this.w/2;
            this.y = yPoint-this.h/2;

            this.vx = (Math.random()-0.5)*10;
            this.vy = (Math.random()-0.5)*10;

            this.alpha = Math.random()*.5+.5;
        }

        Particle.prototype = {
            gravity: 0.05,
            move: function () {
                this.x += this.vx;
                this.vy += this.gravity;
                this.y += this.vy;
                this.alpha -= 0.01;
                if (this.x <= -this.w || this.x >= window.innerWidth ||
                    this.y >= window.innerHeight ||
                    this.alpha <= 0) {
                        return false;
                }
                return true;
            },
            draw: function (c) {
                c.save();
                c.beginPath();

                c.translate(this.x+this.w/2, this.y+this.h/2);
                c.arc(0, 0, this.w, 0, Math.PI*2);
                c.fillStyle = this.color;
                c.globalAlpha = this.alpha;

                c.closePath();
                c.fill();
                c.restore();
            }
        }

        window.addEventListener("resize", resizeCanvas, false);
        onLoad();

        window.requestAnimationFrame =
            window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function (callback) {
                window.setTimeout(callback, 1000/60);
            };

        const timeoutID = setTimeout(() => {
            setShowDisneyTitle(true);
        }, 1500);

        return (
           <div className='disney-container'>
            { showDisneyTitle && (
                <div className="disney-title">I'm going to Disney World! <br/>
                    <span className="disney-sub-title">Beach Club Resort (05/04 - 05/08)</span>
                </div>
              )
            }
           </div>
        )
    }

    const renderCake = () => (
      <div onClick={() => setShowMakeAWish(!showMakeAWish)} className='card'>
          <div className="title">
              <b>h<span>a</span>pp<span>y</span></b> <br/>
              <b>b<span>ir</span>th<span>d</span>ay</b>
          </div>
          <div onMouseOver={() => setShowMakeAWish(true)} onMouseLeave={() => setShowMakeAWish(false)} className="cake-container">
              <div className="cake">
                <div className="plate"></div>
                <div className="layer layer-bottom"></div>
                <div className="layer layer-middle"></div>
                <div className="layer layer-top"></div>
                <div className="icing"></div>
                <div className="drip drip1"></div>
                <div className="drip drip2"></div>
                <div className="drip drip3"></div>
                <div onClick={toggleCandle} className="candle">
                  { showFlame && <div className="flame"></div> }
                </div>
              </div>

              { showMakeAWish &&
                  (
                      <div className="make-a-wish">
                          <span className="text">Make a wish!</span>
                          <span className="text">Click the candle to blow it out</span>
                      </div>
                  )
              }
          </div>
      </div>
    )

  return (
    <div className="App">
        <canvas className={`${showDisney ? 'show' : 'hide'}`} id="canvas"></canvas>
        { animateScreen && <div className="overlay"></div> }
        { showDisney ? renderDisney() : renderCake() }
    </div>
  );
}

export default App;
