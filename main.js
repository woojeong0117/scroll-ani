(() => {
  let yOffset = 0; // window.yOffset 대신 쓸 변수
  let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
  let currentScene = 0; // 현재 활성화된(눈 앞에 보고있는) 씬(scroll-section)
  let enterNewScene = false; // 새로운 scene이 시작된 순간 true
  let acc = 0.1;
  let delayedYOffset = 0;
  let rafId;
  let rafState;
  const sceneInfo = [
    {
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector(".section1"),
        messageA: document.querySelector(".section1 .a"),
        messageB: document.querySelector(".section1 .b"),
        messageC: document.querySelector(".section1 .c"),
        messageD: document.querySelector(".section1 .d"),
        canvas: document.querySelector("#video-canvas-0"),
        context: document.querySelector("#video-canvas-0").getContext("2d"),
        videoImages: [],
      },
      values: {
        videoImageCount: 600,
        imageSequence: [0, 599],
        messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
        messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
        messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
        messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
        messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
        messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
        messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
        messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
        messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
        messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
        messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
        messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
        messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
        messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
        messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
        messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
        canvas_opacity: [1, 0, { start: 0.9, end: 1 }],
      },
    },
    {
      type: "normal",
      heightNum: 5, // type normal에서는 필요 없음
      scrollHeight: 0,
      objs: {
        container: document.querySelector(".section2"),
      },
    },
    {
      type: "normal",
      heightNum: 5, // type normal에서는 필요 없음
      scrollHeight: 0,
      objs: {
        container: document.querySelector(".section3"),
      },
    },
    {
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector(".section4"),
        messageA: document.querySelector(".section4 .a"),
        messageB: document.querySelector(".section4 .b"),
        messageC: document.querySelector(".section4 .c"),
        messageD: document.querySelector(".section4 .d"),
        canvas: document.querySelector("#video-canvas-1"),
        context: document.querySelector("#video-canvas-1").getContext("2d"),
        videoImages: [],
      },
      values: {
        videoImageCount: 929,
        imageSequence: [0, 928],
        messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
        messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
        messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
        messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
        messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
        messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
        messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
        messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
        messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
        messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
        messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
        messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
        messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
        messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
        messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
        messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
        canvas_opacity_in: [0, 1, { start: 0, end: 0.1 }],
        canvas_opacity_out: [1, 0, { start: 0.95, end: 1 }],
      },
    },
    {
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector(".section5"),
        canvas: document.querySelector(".image-blend-canvas"),
        context: document.querySelector(".image-blend-canvas").getContext("2d"),
        imagesPath: [
          "./images/20201121_233611.jpg",
          "./images/1661683848884.jpg",
        ],
        images: [],
      },
      values: {
        rect1X: [0, 0, { start: 0, end: 0 }],
        rect2X: [0, 0, { start: 0, end: 0 }],
        blendHeight: [0, 0, { start: 0, end: 0 }],
        canvas_scale: [0, 0, { start: 0, end: 0 }],
        rectStartY: 0,
      },
    },
  ];

  function setCanvasImages() {
    let imgElem;
    for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
      imgElem = new Image();
      imgElem.src = `./images/video1/${1 + i}.jpg`;
      sceneInfo[0].objs.videoImages.push(imgElem);
    }

    let imgElem2;
    for (let i = 0; i < sceneInfo[3].values.videoImageCount; i++) {
      imgElem2 = new Image();
      imgElem2.src = `./images/video2/${1 + i}.jpg`;
      sceneInfo[3].objs.videoImages.push(imgElem2);
    }

    let imgElem3;
    for (let i = 0; i < sceneInfo[4].objs.imagesPath.length; i++) {
      imgElem3 = new Image();
      imgElem3.src = sceneInfo[4].objs.imagesPath[i];
      sceneInfo[4].objs.images.push(imgElem3);
    }
  }

  function setLayout() {
    // 각 스크롤 섹션 높이 세팅
    for (let i = 0; i < sceneInfo.length; i++) {
      if (sceneInfo[i].type === "sticky") {
        sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      } else if (sceneInfo[i].type === "normal") {
        sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
      }
      sceneInfo[
        i
      ].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }

    yOffset = window.pageYOffset;
    let totalScrollHeight = 0;
    for (let i = 0; i < sceneInfo.length; i++) {
      totalScrollHeight += sceneInfo[i].scrollHeight;
      if (totalScrollHeight >= yOffset) {
        currentScene = i;
        break;
      }
    }

    document.body.setAttribute("id", `show-scene-${currentScene}`);
    const heightRatio = window.innerHeight / 900;
    sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50% ,0) scale(${heightRatio})`;
    sceneInfo[3].objs.canvas.style.transform = `translate3d(-50%, -50% ,0) scale(${heightRatio})`;
  }

  function calcValues(values, currentYOffset) {
    let rv;
    // 현재 씬에서 스크롤 된 범위 구하기
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;
    if (values.length === 3) {
      const partScrollStart = values[2].start * scrollHeight;
      const partScrollEnd = values[2].end * scrollHeight;
      const partScrollHeight = partScrollEnd - partScrollStart;

      if (
        currentYOffset >= partScrollStart &&
        currentYOffset <= partScrollEnd
      ) {
        rv =
          ((currentYOffset - partScrollStart) / partScrollHeight) *
            (values[1] - values[0]) +
          values[0];
      } else if (currentYOffset < partScrollStart) {
        rv = values[0];
      } else if (currentYOffset > partScrollEnd) {
        rv = values[1];
      }
    } else {
      rv = scrollRatio * (values[1] - values[0]) + values[0];
    }
    return rv;
  }

  function playAnimation() {
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    const currentYOffset = yOffset - prevScrollHeight;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;

    switch (currentScene) {
      case 0:
        objs.canvas.style.opacity = calcValues(
          values.canvas_opacity,
          currentYOffset
        );

        if (scrollRatio <= 0.22) {
          objs.messageA.style.opacity = calcValues(
            values.messageA_opacity_in,
            currentYOffset
          );
          objs.messageA.style.transform = `translate3d(0, ${calcValues(
            values.messageA_translateY_in,
            currentYOffset
          )}%, 0)`;
        } else {
          objs.messageA.style.opacity = calcValues(
            values.messageA_opacity_out,
            currentYOffset
          );
          objs.messageA.style.transform = `translate3d(0, ${calcValues(
            values.messageA_translateY_out,
            currentYOffset
          )}%, 0)`;
        }

        if (scrollRatio <= 0.42) {
          objs.messageB.style.opacity = calcValues(
            values.messageB_opacity_in,
            currentYOffset
          );
          objs.messageB.style.transform = `translate3d(0, ${calcValues(
            values.messageB_translateY_in,
            currentYOffset
          )}%, 0)`;
        } else {
          objs.messageB.style.opacity = calcValues(
            values.messageB_opacity_out,
            currentYOffset
          );
          objs.messageB.style.transform = `translate3d(0, ${calcValues(
            values.messageB_translateY_out,
            currentYOffset
          )}%, 0)`;
        }

        if (scrollRatio <= 0.62) {
          objs.messageC.style.opacity = calcValues(
            values.messageC_opacity_in,
            currentYOffset
          );
          objs.messageC.style.transform = `translate3d(0, ${calcValues(
            values.messageC_translateY_in,
            currentYOffset
          )}%, 0)`;
        } else {
          objs.messageC.style.opacity = calcValues(
            values.messageC_opacity_out,
            currentYOffset
          );
          objs.messageC.style.transform = `translate3d(0, ${calcValues(
            values.messageC_translateY_out,
            currentYOffset
          )}%, 0)`;
        }

        if (scrollRatio <= 0.82) {
          objs.messageD.style.opacity = calcValues(
            values.messageD_opacity_in,
            currentYOffset
          );
          objs.messageD.style.transform = `translate3d(0, ${calcValues(
            values.messageD_translateY_in,
            currentYOffset
          )}%, 0)`;
        } else {
          objs.messageD.style.opacity = calcValues(
            values.messageD_opacity_out,
            currentYOffset
          );
          objs.messageD.style.transform = `translate3d(0, ${calcValues(
            values.messageD_translateY_out,
            currentYOffset
          )}%, 0)`;
        }
        break;

      case 3:
        if (scrollRatio <= 0.5) {
          // in
          objs.canvas.style.opacity = calcValues(
            values.canvas_opacity_in,
            currentYOffset
          );
        } else {
          // out
          objs.canvas.style.opacity = calcValues(
            values.canvas_opacity_out,
            currentYOffset
          );
        }

        if (scrollRatio <= 0.22) {
          objs.messageA.style.opacity = calcValues(
            values.messageA_opacity_in,
            currentYOffset
          );
          objs.messageA.style.transform = `translate3d(0, ${calcValues(
            values.messageA_translateY_in,
            currentYOffset
          )}%, 0)`;
        } else {
          objs.messageA.style.opacity = calcValues(
            values.messageA_opacity_out,
            currentYOffset
          );
          objs.messageA.style.transform = `translate3d(0, ${calcValues(
            values.messageA_translateY_out,
            currentYOffset
          )}%, 0)`;
        }

        if (scrollRatio <= 0.42) {
          objs.messageB.style.opacity = calcValues(
            values.messageB_opacity_in,
            currentYOffset
          );
          objs.messageB.style.transform = `translate3d(0, ${calcValues(
            values.messageB_translateY_in,
            currentYOffset
          )}%, 0)`;
        } else {
          objs.messageB.style.opacity = calcValues(
            values.messageB_opacity_out,
            currentYOffset
          );
          objs.messageB.style.transform = `translate3d(0, ${calcValues(
            values.messageB_translateY_out,
            currentYOffset
          )}%, 0)`;
        }

        if (scrollRatio <= 0.62) {
          objs.messageC.style.opacity = calcValues(
            values.messageC_opacity_in,
            currentYOffset
          );
          objs.messageC.style.transform = `translate3d(0, ${calcValues(
            values.messageC_translateY_in,
            currentYOffset
          )}%, 0)`;
        } else {
          objs.messageC.style.opacity = calcValues(
            values.messageC_opacity_out,
            currentYOffset
          );
          objs.messageC.style.transform = `translate3d(0, ${calcValues(
            values.messageC_translateY_out,
            currentYOffset
          )}%, 0)`;
        }

        if (scrollRatio <= 0.82) {
          objs.messageD.style.opacity = calcValues(
            values.messageD_opacity_in,
            currentYOffset
          );
          objs.messageD.style.transform = `translate3d(0, ${calcValues(
            values.messageD_translateY_in,
            currentYOffset
          )}%, 0)`;
        } else {
          objs.messageD.style.opacity = calcValues(
            values.messageD_opacity_out,
            currentYOffset
          );
          objs.messageD.style.transform = `translate3d(0, ${calcValues(
            values.messageD_translateY_out,
            currentYOffset
          )}%, 0)`;
        }

        if (scrollRatio > 0.9) {
          const objs = sceneInfo[4].objs;
          const values = sceneInfo[4].values;
          const widthRatio = window.innerWidth / objs.canvas.width;
          const heightRatio = window.innerHeight / objs.canvas.height;
          let canvasScaleRatio;

          if (widthRatio <= heightRatio) {
            canvasScaleRatio = heightRatio;
          } else {
            canvasScaleRatio = widthRatio;
          }
          objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
          objs.context.fillStyle = "white";
          objs.context.drawImage(objs.images[0], 0, 0);

          const recalculatedInnerWidth =
            document.body.offsetWidth / canvasScaleRatio;
          const recalculatedInnerHeight =
            document.body.offsetHeight / canvasScaleRatio;

          const whiteRectWidth = recalculatedInnerWidth * 0.15;
          values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
          values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
          values.rect2X[0] =
            values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth + 10;
          values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

          // 좌우 흰색 박스 그리기
          objs.context.fillRect(
            parseInt(values.rect1X[0]),
            0,
            parseInt(whiteRectWidth),
            objs.canvas.height
          );
          objs.context.fillRect(
            parseInt(values.rect2X[0]),
            0,
            parseInt(whiteRectWidth),
            objs.canvas.height
          );
        }
        break;

      case 4:
        // 가로 세로 모두 꽉차게하기 위해 세팅
        let step = 0;
        const widthRatio = window.innerWidth / objs.canvas.width;
        const heightRatio = window.innerHeight / objs.canvas.height;
        let canvasScaleRatio;

        if (widthRatio <= heightRatio) {
          canvasScaleRatio = heightRatio;
        } else {
          canvasScaleRatio = widthRatio;
        }
        objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
        objs.context.fillStyle = "white";
        objs.context.drawImage(objs.images[0], 0, 0);

        const recalculatedInnerWidth =
          document.body.offsetWidth / canvasScaleRatio;
        const recalculatedInnerHeight =
          document.body.offsetHeight / canvasScaleRatio;

        const whiteRectWidth = recalculatedInnerWidth * 0.15;
        values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
        values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
        values.rect2X[0] =
          values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth + 10;
        values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

        if (!values.rectStartY) {
          // values.rectStartY = objs.canvas.getBoundingClientRect().top;
          values.rectStartY =
            objs.canvas.offsetTop +
            (objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2;
          values.rect1X[2].start = window.innerHeight / 2 / scrollHeight;
          values.rect2X[2].start = window.innerHeight / 2 / scrollHeight;
          values.rect1X[2].end = values.rectStartY / scrollHeight;
          values.rect2X[2].end = values.rectStartY / scrollHeight;
        }

        // 좌우 흰색 박스 그리기
        objs.context.fillRect(
          parseInt(calcValues(values.rect1X, currentYOffset)),
          0,
          parseInt(whiteRectWidth),
          objs.canvas.height
        );
        objs.context.fillRect(
          parseInt(calcValues(values.rect2X, currentYOffset)),
          0,
          parseInt(whiteRectWidth),
          objs.canvas.height
        );

        if (scrollRatio < values.rect1X[2].end) {
          step = 1;
          objs.canvas.classList.remove("sticky");
        } else {
          step = 2;
          // 이미지 블렌드
          // imageBlendY : [0, 0, { start: 0, end: 0 }]
          values.blendHeight[0] = 0;
          values.blendHeight[1] = objs.canvas.height;
          values.blendHeight[2].start = values.rect1X[2].end;
          values.blendHeight[2].end = values.blendHeight[2].start + 0.2;
          // objs.context.drawImage(img, x, y, width, height)
          // objs.context.drawImage(objs.images[1], 0, 200) 이렇게하면 원래 이미지 크기로 그림

          const blendHeight = calcValues(values.blendHeight, currentYOffset);
          objs.context.drawImage(
            objs.images[1],
            0,
            objs.canvas.height - blendHeight,
            objs.canvas.width,
            blendHeight,
            0,
            objs.canvas.height - blendHeight,
            objs.canvas.width,
            blendHeight
          );
          objs.canvas.classList.add("sticky");
          objs.canvas.style.top = `${
            -(objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2
          }px`;

          if (scrollRatio > values.blendHeight[2].end) {
            values.canvas_scale[0] = canvasScaleRatio;
            values.canvas_scale[1] =
              document.body.offsetWidth / (1.5 * objs.canvas.width);
            values.canvas_scale[2].start = values.blendHeight[2].end;
            values.canvas_scale[2].end = values.canvas_scale[2].start + 0.2;

            objs.canvas.style.transform = `scale(${calcValues(
              values.canvas_scale,
              currentYOffset
            )})`;
            objs.canvas.style.marginTop = `0`;
          }

          if (
            scrollRatio > values.canvas_scale[2].end &&
            values.canvas_scale[2].end > 0
          ) {
            objs.canvas.classList.remove("sticky");
            objs.canvas.style.marginTop = `${scrollHeight * 0.4}px`;
          }
        }

        break;
    }
  }

  function scrollLoop() {
    enterNewScene = false;
    prevScrollHeight = 0;
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }
    if (
      delayedYOffset <
      prevScrollHeight + sceneInfo[currentScene].scrollHeight
    ) {
      document.body.classList.remove("scroll-effect-end");
    }
    if (
      delayedYOffset >
      prevScrollHeight + sceneInfo[currentScene].scrollHeight
    ) {
      enterNewScene = true;
      if (currentScene === sceneInfo.length - 1) {
        document.body.classList.add("scroll-effect-end");
      }
      if (currentScene < sceneInfo.length - 1) {
        currentScene++;
      }
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }

    if (delayedYOffset < prevScrollHeight) {
      enterNewScene = true;

      if (currentScene === 0) return;
      currentScene--;
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }

    if (enterNewScene) return;

    playAnimation();
  }

  function loop() {
    delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;

    if (!enterNewScene) {
      if (currentScene === 0 || currentScene === 3) {
        const currentYOffset = delayedYOffset - prevScrollHeight;
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        let sequence = Math.round(
          calcValues(values.imageSequence, currentYOffset)
        );

        if (objs.videoImages[sequence]) {
          objs.context.drawImage(objs.videoImages[sequence], 0, 0);
        }
      }
    }

    rafId = requestAnimationFrame(loop);

    if (Math.abs(yOffset - delayedYOffset) < 1) {
      cancelAnimationFrame(rafId);
      rafState = false;
    }
  }

  window.addEventListener("load", () => {
    setLayout();
    sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);
    document.body.classList.remove("before-load");

    if (yOffset > 0) {
      let tempYOffset = yOffset;
      let tempScrollCount = 0;
      let siId = setInterval(() => {
        window.scrollTo(0, tempYOffset);
        tempYOffset += 5;
        if (tempScrollCount > 20) {
          clearInterval(siId);
        }
        tempScrollCount++;
      }, 20);
    }

    window.addEventListener("scroll", () => {
      yOffset = window.pageYOffset;
      scrollLoop();
      if (!rafState) {
        rafId = requestAnimationFrame(loop);
        rafState = true;
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        window.location.reload();
      }
    });

    window.addEventListener("orientationchange", () => {
      scrollTo(0, 0);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    });
    // onratechange는 모바일에서 화면 돌릴때 일어나는 이벤트

    document
      .querySelector(".loading")
      .addEventListener("transitionend", (e) => {
        document.body.removeChild(e.currentTarget);
      });
  });

  setCanvasImages();
})();
