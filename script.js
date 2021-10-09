let max_particles = 25;
let particles = [];
let frequency = 200;

// Popolate particle
popolate(max_particles);

var tela = document.createElement('canvas');
tela.width = $(window).width();
tela.height = $(window).height();
$("body").append(tela);

var canvas = tela.getContext('2d');

class Particle {
  constructor(canvas) {
    let colors = ["#E5493F", "#55C1FF", "#26B9A0", "#5A52FF"];
    // let colors = ["#feea00","#a9df85","#5dc0ad", "#ff9a00","#fa3f20"]
    let types = ["full", "fill", "empty", "square", "square-in-circle"];
    this.random = Math.random();
    this.canvas = canvas;

    this.lineWidth = 0.2 + 2.8 * this.random;

    this.speed = 2 + Math.random() * 3;

    this.progress = 0;
    this.progress_inc = this.random > 0.5 ? this.random * (this.speed * 1.5) : this.random * -(this.speed * 1.5);

    this.vx = Math.random() * this.speed - Math.random() * this.speed;
    this.vy = Math.random() * this.speed - Math.random() * this.speed;
    this.radius = 10 + Math.round(Math.random() * 50);
    this.w = $(window).width();
    this.h = $(window).height();
    this.x = (this.w - this.radius) / 2;
    this.y = (this.h - this.radius) / 2;


    this.radius = 1 + 8 * this.random;
    this.type = types[this.randomIntFromInterval(0, types.length - 1)];
    this.color = colors[this.randomIntFromInterval(0, colors.length - 1)];
  }

  getCoordinates() {
    return {
      x: this.x,
      y: this.y };

  }

  randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  render() {
    // Create arc
    let color = this.color;
    switch (this.type) {
      case "square":
        this.drawRotatedRect(this.x, this.y, this.radius * 2, this.radius * 2, this.progress, color);
        break;
      case "square-in-circle":
        this.drawRotatedRect(this.x, this.y, this.radius * 2, this.radius * 2, this.progress, color);
        this.createArcEmpty(this.radius + this.lineWidth * 3, this.lineWidth, color);
        break;
      case "full":
        this.createArcFill(this.radius, color);
        this.createArcEmpty(this.radius + this.lineWidth, this.lineWidth / 2, color);
        break;
      case "fill":
        this.createArcFill(this.radius, color);
        break;
      case "empty":
        this.createArcEmpty(this.radius, this.lineWidth, color);
        break;}

  }

  createArcFill(radius, color) {
    this.canvas.beginPath();
    this.canvas.arc(this.x, this.y, radius / 1.5, 0, 2 * Math.PI);
    this.canvas.fillStyle = color;
    this.canvas.fill();
    this.canvas.closePath();
  }

  createArcEmpty(radius, lineWidth, color) {
    this.canvas.beginPath();
    this.canvas.arc(this.x, this.y, radius, 0, 2 * Math.PI);
    this.canvas.lineWidth = lineWidth;
    this.canvas.strokeStyle = color;
    this.canvas.stroke();
    this.canvas.closePath();
  }

  drawRotatedRect(x, y, width, height, degrees, color) {
    this.canvas.save();
    this.canvas.beginPath();
    this.canvas.translate(x - this.radius + width / 2, y - this.radius + height / 2);
    this.canvas.rotate(degrees * Math.PI / 180);
    this.canvas.rect(-(width / 2), -(height / 2), width, height);
    this.canvas.fillStyle = color;
    this.canvas.fill();
    this.canvas.restore();
  }

  move() {
    this.progress += this.progress_inc;
    let diff = this.radius;
    switch (this.type) {
      case "full":
        diff = this.radius + this.lineWidth * 2;
        break;
      case "square-in-circle":
        diff = this.radius + this.lineWidth * 3;
        break;
      case "empty":
        diff = this.radius + this.lineWidth;
        break;}

    this.x = this.x + this.vx;
    this.y = this.y + this.vy;

    if (this.x < diff || this.x > this.w - diff) {
      this.vx = -this.vx;
    }
    if (this.y < diff || this.y > this.h - diff) {
      this.vy = -this.vy;
    }
    this.render();
    return true;
  }

  calculateDistance(v1, v2) {
    let x = Math.abs(v1.x - v2.x);
    let y = Math.abs(v1.y - v2.y);
    return Math.sqrt(x * x + y * y);
  }}

/*
 * Function to clear layer canvas
 * @num:number number of particles
 */
function popolate(num) {
  for (var i = 0; i < num; i++) {
    setTimeout(
    function (x) {
      return function () {
        // Add particle
        particles.push(new Particle(canvas));
      };
    }(i),
    frequency * i);
  }
  return particles.length;
}

function clear() {
  canvas.fillStyle = '#101018';
  canvas.fillRect(0, 0, tela.width, tela.height);
}

function calculateDistance(v1, v2) {
  let x = Math.abs(v1.x - v2.x);
  let y = Math.abs(v1.y - v2.y);
  return Math.sqrt(x * x + y * y);
}

function connection() {
  let old_element = null;
  $.each(particles, function (i, element) {
    if (i > 0 && (i % 3 == 0 || i % 7 == 0)) {
      let box1 = old_element.getCoordinates();
      let box2 = element.getCoordinates();
      canvas.beginPath();
      canvas.moveTo(box1.x, box1.y);
      canvas.lineTo(box2.x, box2.y);
      canvas.lineWidth = 0.8;
      canvas.strokeStyle = "#32323C";
      if (i % 7 == 0) {
        //canvas.strokeStyle="#3f47ff";
      }
      canvas.stroke();
      canvas.closePath();
    }

    old_element = element;
  });
}

/*
 * Function to update particles in canvas
 */
function update() {
  clear();
  connection();
  particles = particles.filter(function (p) {return p.move();});
  requestAnimationFrame(update.bind(this));
}

update();

(function($) { "use strict";

	//Page cursors

    document.getElementsByTagName("body")[0].addEventListener("mousemove", function(n) {
        t.style.left = n.clientX + "px",
		t.style.top = n.clientY + "px",
		e.style.left = n.clientX + "px",
		e.style.top = n.clientY + "px",
		i.style.left = n.clientX + "px",
		i.style.top = n.clientY + "px"
    });
    var t = document.getElementById("cursor"),
        e = document.getElementById("cursor2"),
        i = document.getElementById("cursor3");
    function n(t) {
        e.classList.add("hover"), i.classList.add("hover")
    }
    function s(t) {
        e.classList.remove("hover"), i.classList.remove("hover")
    }
    s();
    for (var r = document.querySelectorAll(".hover-target"), a = r.length - 1; a >= 0; a--) {
        o(r[a])
    }
    function o(t) {
        t.addEventListener("mouseover", n), t.addEventListener("mouseout", s)
    }

	//Navigation

	var app = function () {
		var body = undefined;
		var menu = undefined;
		var menuItems = undefined;
		var init = function init() {
			body = document.querySelector('body');
			menu = document.querySelector('.menu-icon');
			menuItems = document.querySelectorAll('.nav__list-item');
			applyListeners();
		};
		var applyListeners = function applyListeners() {
			menu.addEventListener('click', function () {
				return toggleClass(body, 'nav-active');
			});
		};
		var toggleClass = function toggleClass(element, stringClass) {
			if (element.classList.contains(stringClass)) element.classList.remove(stringClass);else element.classList.add(stringClass);
		};
		init();
	}();

	//Switch light/dark

	$("#switch").on('click', function () {
		if ($("body").hasClass("light")) {
			$("body").removeClass("light");
			$("#switch").removeClass("switched");
		}
		else {
			$("body").addClass("light");
			$("#switch").addClass("switched");
		}
	});
	      
})(jQuery);
