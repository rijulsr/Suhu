import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './App.css'

// Import photos
import photo1 from './assets/d127737c-624a-4b54-baa6-372290663285.jpeg'
import photo2 from './assets/1d49852b-596e-40e9-ab91-82d3a9e3e458.jpeg'
import photo3 from './assets/0fa2eabb-4cf4-43aa-b941-3c9d3bbacdd9.jpeg'
import photo4 from './assets/577779e9-2595-4b25-b612-147baf4230a2.jpeg'
import photo5 from './assets/4cd05f0b-c746-4eaa-bda5-109ec89c68fe.jpeg'

function ProceduralStars() {
  // Generate hundreds of stars procedurally
  const generateStars = (count) => {
    const stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.2, // 0.2px to 2.2px
        opacity: Math.random() * 0.8 + 0.2, // 0.2 to 1.0 opacity
        twinkleDelay: Math.random() * 10,
        brightness: Math.random() * 0.5 + 0.5 // 0.5 to 1.0 brightness
      });
    }
    return stars;
  };

  const stars = generateStars(300); // 300 procedural stars

  return (
    <div className="procedural-stars">
      {stars.map(star => (
        <div
          key={star.id}
          className="procedural-star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            filter: `brightness(${star.brightness})`,
            animationDelay: `${star.twinkleDelay}s`
          }}
        />
      ))}
    </div>
  );
}

function CancerConstellation() {
  const [hoveredStar, setHoveredStar] = useState(null);
  const [clickedStars, setClickedStars] = useState(new Set());

  const handleStarClick = (starId) => {
    setClickedStars(prev => {
      const newSet = new Set(prev);
      if (newSet.has(starId)) {
        newSet.delete(starId);
      } else {
        newSet.add(starId);
      }
      return newSet;
    });
  };

  const stars = [
    { id: 1, cx: 200, cy: 300, r: 3 },
    { id: 2, cx: 350, cy: 250, r: 4 },
    { id: 3, cx: 450, cy: 350, r: 3 },
    { id: 4, cx: 500, cy: 200, r: 3.5 },
    { id: 5, cx: 550, cy: 300, r: 2.5 }
  ];

  const connections = [
    { from: { x: 200, y: 300 }, to: { x: 350, y: 250 } },
    { from: { x: 350, y: 250 }, to: { x: 450, y: 350 } },
    { from: { x: 350, y: 250 }, to: { x: 500, y: 200 } },
    { from: { x: 500, y: 200 }, to: { x: 550, y: 300 } }
  ];

  return (
    <motion.svg 
      className="constellation" 
      width="100%" 
      height="100%" 
      viewBox="0 0 800 600"
      animate={{
        x: [0, 15, -10, 20, 0],
        y: [0, -20, 10, -15, 0],
        rotate: [0, 1, -0.5, 1.5, 0]
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="super-glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      {/* Connection lines */}
      {connections.map((conn, i) => (
        <motion.line
          key={i}
          x1={conn.from.x}
          y1={conn.from.y}
          x2={conn.to.x}
          y2={conn.to.y}
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.5"
          className="constellation-line"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, delay: i * 0.5 }}
        />
      ))}
      
      {/* Interactive stars */}
      {stars.map((star) => (
        <motion.circle
          key={star.id}
          cx={star.cx}
          cy={star.cy}
          r={star.r}
          fill="white"
          filter={hoveredStar === star.id || clickedStars.has(star.id) ? "url(#super-glow)" : "url(#glow)"}
          className="constellation-star"
          style={{ cursor: 'pointer' }}
          onMouseEnter={() => setHoveredStar(star.id)}
          onMouseLeave={() => setHoveredStar(null)}
          onClick={() => handleStarClick(star.id)}
          animate={{
            scale: clickedStars.has(star.id) ? [1, 1.5, 1] : hoveredStar === star.id ? 1.3 : 1,
            opacity: clickedStars.has(star.id) ? [1, 0.7, 1] : 1
          }}
          transition={{
            scale: { duration: clickedStars.has(star.id) ? 1 : 0.3 },
            opacity: { duration: 1, repeat: clickedStars.has(star.id) ? Infinity : 0 }
          }}
          whileHover={{ scale: 1.5 }}
          whileTap={{ scale: 2 }}
        />
      ))}
    </motion.svg>
  );
}

function App() {
  const [titleClicked, setTitleClicked] = useState(false);
  const [buttonsRevealed, setButtonsRevealed] = useState(false);
  const [modalStep, setModalStep] = useState(0); // 0: no modal, 1: first warning, 2: second warning, 3: final warning, 4: countdown, 5: final message
  const [likeListStep, setLikeListStep] = useState(0); // 0: not started, 1: showing list, 2: continue prompt, 3: second list, 4: naughty list
  const [visibleItems, setVisibleItems] = useState(0);
  const [firstListScrolledToEnd, setFirstListScrolledToEnd] = useState(false);
  const [secondListScrolledToEnd, setSecondListScrolledToEnd] = useState(false);
  const [naughtyListScrolledToEnd, setNaughtyListScrolledToEnd] = useState(false);
  const [showLoveLetter, setShowLoveLetter] = useState(false);

  const likesList = [
    "Your hugs that feels like home",
    "Your kindness",
    "Your laugh", 
    "Your sleepy voice",
    "The way you look at me when you think I'm not noticing",
    "The way you care about people",
    "Your love for dogs",
    "The way you hold my hand",
    "Your random bursts of affection",
    "Your patience with me",
    "Your silly impressions",
    "Your confidence",
    "Your boldness",
    "The way you smell",
    "The way you call me Sharma Ji",
    "The way you fit perfectly in my arms"
  ];

  const secondList = [
    "Your big shiny eyes",
    "Your Smile",
    "Your Bunny teeth",
    "Your Cheeks",
    "Your Nose",
    "Your Lips",
    "Your Hair",
    "Your Hair Smell",
    "Your Hands",
    "Your fingers",
    "Your Feet",
    "Every mole on your Body"
  ];

  const naughtyList = [
    "The Way you lock your eyes in my eyes",
    "Your irresistible neck",
    "The way you bite your lips",
    "When I get lost in your kiss",
    "Your skin to skin cuddles",
    "When you be my little spoon",
    "When you are breathing close to my ear",
    "Your Gasp when I kiss your neck",
    "The way you hug me close to your chest",
    "When I can hear your heartbeat",
    "Your whispering",
    "The warmth of your body",
    "Your curves",
    "The way you taste"
  ];

  const honorableMentions = [
    "Your Boobs",
    "Your ass",
    "Your thigh"
  ];

  const handleFirstListScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isScrolledToEnd = scrollTop + clientHeight >= scrollHeight - 5; // 5px tolerance
    setFirstListScrolledToEnd(isScrolledToEnd);
  };

  const handleSecondListScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isScrolledToEnd = scrollTop + clientHeight >= scrollHeight - 5; // 5px tolerance
    setSecondListScrolledToEnd(isScrolledToEnd);
  };

  const handleNaughtyListScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isScrolledToEnd = scrollTop + clientHeight >= scrollHeight - 5; // 5px tolerance
    setNaughtyListScrolledToEnd(isScrolledToEnd);
  };

  const handleTitleClick = () => {
    setTitleClicked(true);
    setTimeout(() => setTitleClicked(false), 2000);
  };

  const handleMainButtonClick = () => {
    setButtonsRevealed(true);
  };

  const handleDontLikeClick = () => {
    setModalStep(1);
  };

  const handleDoLikeClick = () => {
    setLikeListStep(1);
    setVisibleItems(0);
    setFirstListScrolledToEnd(false);
    // Show list instantly - no more slow animation
  };

  const handleHellYeah = () => {
    setLikeListStep(3); // Show second list instantly
    setSecondListScrolledToEnd(false);
  };

  const handleCantWait = () => {
    setLikeListStep(4); // Show naughty list
    setNaughtyListScrolledToEnd(false);
  };

  const handleButClick = () => {
    setShowLoveLetter(true);
    setLikeListStep(0); // Close the naughty list
  };

  const closeLoveLetter = () => {
    setShowLoveLetter(false);
  };

  const closeLikeList = () => {
    setLikeListStep(0);
    setVisibleItems(0);
    setFirstListScrolledToEnd(false);
    setSecondListScrolledToEnd(false);
    setNaughtyListScrolledToEnd(false);
  };

  const handleModalYes = () => {
    if (modalStep === 1) {
      setModalStep(2);
    } else if (modalStep === 2) {
      setModalStep(3);
    }
  };

  const handleModalNo = () => {
    setModalStep(0);
  };

  const handleJustTellMe = () => {
    setModalStep(4);
    // Start countdown
    setTimeout(() => setModalStep(5), 3000);
  };

  const handleDontWannaKnow = () => {
    setModalStep(0);
  };

  const closeModal = () => {
    setModalStep(0);
  };

  const getModalContent = () => {
    switch (modalStep) {
      case 1:
        return {
          title: "Are you sure?",
          message: "Are you sure you wanna know?",
          buttons: [
            { text: "Yes", onClick: handleModalYes, type: "yes" },
            { text: "No", onClick: handleModalNo, type: "no" }
          ]
        };
      case 2:
        return {
          title: "Really?",
          message: "Really you wanna know? I mean you don't wanna ruin your day...",
          buttons: [
            { text: "Yes", onClick: handleModalYes, type: "yes" },
            { text: "No", onClick: handleModalNo, type: "no" }
          ]
        };
      case 3:
        return {
          title: "Final Warning!",
          message: "Final warning: do not blame me later.",
          buttons: [
            { text: "Just tell me", onClick: handleJustTellMe, type: "yes" },
            { text: "Fine I don't wanna know", onClick: handleDontWannaKnow, type: "no" }
          ]
        };
      case 4:
        return {
          title: "Here we go...",
          message: "Okay here we go... 1... 2... 3...",
          buttons: []
        };
      case 5:
        return {
          title: "The Truth",
          message: "The only thing I don't like about you is there's NOTHING to not like about you. Told ya you really didn't have to come this far. 💕",
          buttons: [
            { text: "hehe", onClick: closeModal, type: "close" }
          ]
        };
      default:
        return null;
    }
  };

  return (
    <div className="stargazing-container">
      <div className="star-field"></div>
      <div className="distant-stars"></div>
      <div className="extra-stars"></div>
      <div className="micro-stars"></div>
      <ProceduralStars />
      <div className="dense-star-layer-1"></div>
      <div className="dense-star-layer-2"></div>
      <div className="milky-way"></div>
      <CancerConstellation />
      
      <div className="main-content">
        <motion.h1 
          className="star-cluster-title"
          onClick={handleTitleClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={titleClicked ? {
            scale: [1, 1.1, 1],
            rotateZ: [0, 2, -2, 0]
          } : {}}
          transition={{ duration: 0.6 }}
        >
          {"Meri Suhu Darling".split("").map((char, i) => (
            <motion.span 
              key={i} 
              initial={{ opacity: 0, y: -50 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.1, duration: 0.8 }}
              whileHover={{ 
                scale: 1.2,
                textShadow: "0 0 8px #fff, 0 0 16px #fff, 0 0 32px #FFDAB9"
              }}
              className="title-letter"
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>

        <div className="button-container">
          {!buttonsRevealed ? (
            <motion.button
              className="romantic-button main-love-button"
              onClick={handleMainButtonClick}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 25px rgba(255, 218, 185, 0.8)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              Reasons I love you
            </motion.button>
          ) : (
            <>
              <motion.button
                className="romantic-button dont-like-button"
                onClick={handleDontLikeClick}
                initial={{ opacity: 0, x: 50, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 200 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(255, 182, 193, 0.6)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                Things I don't like about you
              </motion.button>

              <motion.button
                className="romantic-button do-like-button"
                onClick={handleDoLikeClick}
                initial={{ opacity: 0, x: 50, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.6, type: "spring", stiffness: 200 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(255, 218, 185, 0.6)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                Things I like about you
              </motion.button>
            </>
          )}
        </div>
      </div>

      {/* Modal System for Don't Like */}
      {modalStep > 0 && (
        <motion.div 
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
        >
          <motion.div 
            className="modal-content"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>{getModalContent().title}</h3>
            </div>
            <div className="modal-body">
              <p>{getModalContent().message}</p>
            </div>
            {getModalContent().buttons.length > 0 && (
              <div className="modal-buttons">
                {getModalContent().buttons.map((button, index) => (
                  <motion.button
                    key={index}
                    className={`modal-button ${button.type}`}
                    onClick={button.onClick}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {button.text}
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Like List Modal */}
      {likeListStep > 0 && (
        <motion.div 
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeLikeList}
        >
          <motion.div 
            className="like-list-content"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {likeListStep === 1 && (
              <>
                <div className="like-list-header">
                  <h3>Things I love about you</h3>
                </div>
                <div className="like-list-items scrollable-list" onScroll={handleFirstListScroll}>
                  {likesList.map((item, index) => (
                    <motion.div
                      key={index}
                      className="like-item"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        delay: index * 0.05, 
                        duration: 0.4,
                        type: "spring",
                        stiffness: 300 
                      }}
                    >
                      💕 {item}
                    </motion.div>
                  ))}
                </div>
                {firstListScrolledToEnd && (
                  <div className="modal-buttons">
                    <motion.button
                      className="modal-button hell-yeah"
                      onClick={() => setLikeListStep(2)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
                    >
                      There's more! 😍
                    </motion.button>
                  </div>
                )}
              </>
            )}

            {likeListStep === 2 && (
              <>
                <div className="like-list-header">
                  <h3>Wait...</h3>
                </div>
                <div className="modal-body">
                  <p>Are you sure you wanna continue? Cuz it's a looooong list... 😏</p>
                </div>
                <div className="modal-buttons">
                  <motion.button
                    className="modal-button hell-yeah"
                    onClick={handleHellYeah}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Hell yeah!
                  </motion.button>
                </div>
              </>
            )}

            {likeListStep === 3 && (
              <>
                <div className="like-list-header">
                  <h3>More things I love about you</h3>
                </div>
                <div className="like-list-items scrollable-list" onScroll={handleSecondListScroll}>
                  {secondList.map((item, index) => (
                    <motion.div
                      key={index}
                      className="like-item"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        delay: index * 0.05, 
                        duration: 0.4,
                        type: "spring",
                        stiffness: 300 
                      }}
                    >
                      💕 {item}
                    </motion.div>
                  ))}
                  <motion.div
                    className="naughty-warning"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      delay: secondList.length * 0.05 + 0.5, 
                      duration: 0.6,
                      type: "spring",
                      stiffness: 200 
                    }}
                  >
                    <p>Wait... things are about to get naughty 😈</p>
                    <p>You ready to go ahead? 🔥</p>
                  </motion.div>
                </div>
                {secondListScrolledToEnd && (
                  <div className="modal-buttons">
                    <motion.button
                      className="modal-button cant-wait"
                      onClick={handleCantWait}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
                    >
                      Can't wait 🔥
                    </motion.button>
                  </div>
                )}
              </>
            )}

            {likeListStep === 4 && (
              <>
                <div className="like-list-header">
                  <h3>The naughty list 😈</h3>
                </div>
                <div className="like-list-items scrollable-list" onScroll={handleNaughtyListScroll}>
                  {naughtyList.map((item, index) => (
                    <motion.div
                      key={index}
                      className="like-item naughty-item"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        delay: index * 0.05, 
                        duration: 0.4,
                        type: "spring",
                        stiffness: 300 
                      }}
                    >
                      🔥 {item}
                    </motion.div>
                  ))}
                  
                  <motion.div
                    className="honorable-mentions"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      delay: naughtyList.length * 0.05 + 0.3, 
                      duration: 0.6,
                      type: "spring",
                      stiffness: 200 
                    }}
                  >
                    <h4>Honorable mentions:</h4>
                    {honorableMentions.map((item, index) => (
                      <motion.div
                        key={index}
                        className="honorable-item"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          delay: naughtyList.length * 0.05 + 0.5 + (index * 0.1), 
                          duration: 0.4,
                          type: "spring",
                          stiffness: 300 
                        }}
                      >
                        💋 {item}
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
                {naughtyListScrolledToEnd && (
                  <div className="modal-buttons">
                    <motion.button
                      className="modal-button but-button"
                      onClick={handleButClick}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
                    >
                      But...
                    </motion.button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Love Letter Modal */}
      {showLoveLetter && (
        <motion.div 
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeLoveLetter}
        >
          {/* Scattered Polaroids */}
          <motion.div 
            className="polaroid polaroid-1"
            initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: -15 }}
            transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
          >
            <div className="polaroid-photo" style={{ backgroundImage: `url(${photo1})` }}></div>
            <div className="polaroid-label">My Pumpkin</div>
          </motion.div>

          <motion.div 
            className="polaroid polaroid-2"
            initial={{ opacity: 0, scale: 0.5, rotate: 45 }}
            animate={{ opacity: 1, scale: 1, rotate: 25 }}
            transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
          >
            <div className="polaroid-photo" style={{ backgroundImage: `url(${photo2})` }}></div>
            <div className="polaroid-label">My Booboo</div>
          </motion.div>

          <motion.div 
            className="polaroid polaroid-3"
            initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
            animate={{ opacity: 1, scale: 1, rotate: 12 }}
            transition={{ delay: 0.7, duration: 0.8, type: "spring" }}
          >
            <div className="polaroid-photo" style={{ backgroundImage: `url(${photo3})` }}></div>
            <div className="polaroid-label">My Bear</div>
          </motion.div>

          <motion.div 
            className="polaroid polaroid-4"
            initial={{ opacity: 0, scale: 0.5, rotate: 60 }}
            animate={{ opacity: 1, scale: 1, rotate: -8 }}
            transition={{ delay: 0.9, duration: 0.8, type: "spring" }}
          >
            <div className="polaroid-photo" style={{ backgroundImage: `url(${photo4})` }}></div>
            <div className="polaroid-label">Meri pyari shimla mirch</div>
          </motion.div>

          <motion.div 
            className="polaroid polaroid-5"
            initial={{ opacity: 0, scale: 0.5, rotate: -60 }}
            animate={{ opacity: 1, scale: 1, rotate: 18 }}
            transition={{ delay: 1.1, duration: 0.8, type: "spring" }}
          >
            <div className="polaroid-photo" style={{ backgroundImage: `url(${photo5})` }}></div>
            <div className="polaroid-label">Meri Chintu ki mummy</div>
          </motion.div>

          <motion.div 
            className="love-letter-container"
            initial={{ scale: 0.3, rotateX: 90, opacity: 0 }}
            animate={{ scale: 1, rotateX: 0, opacity: 1 }}
            exit={{ scale: 0.3, rotateX: -90, opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 20,
              duration: 1.2 
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="love-letter-paper">
              <div className="letter-content">
                <p><strong>Dearest and Loveliest Dange saab,</strong></p>
                
                <p>The letters in the english lexicon could end, the words, then sentences could end but, this list could never end, it goes beyond everything. I want to tell you a little story...</p>
                
                <p>Maine pehle bhi kafi baar batayi hai shayad but ek baar aur sun le, jab I met you for the first time. For a long time you seem very unapproachable, I liked you from the very first instance but I was scared of your boldness, like why would you wanna date a silent introvert geek who sits at the last bench. While you were this free, bubbly, happy go lucky person.</p>
                
                <p>But god had some other plans, I always wondered hum agar sath aa gaye toh kya hoga, bahut sapne dekhe maine humare liye. But ab pta nahi humari timing kharab rahi ya kya huya things went quite opposite. We were through some really dark times by now. I get scared when i think about it.</p>
                
                <p>But yeh sab matter nahi karta...matter karta hai toh bas humari foundation jo hume khud build ki hai, trust, friendship and unlimited understanding pe. You brought some true colours in my life, made me learn to live, to love, to care about someone, to be affectionate about some one, to give up on insecurities, to not give up....Yes to not give up. I have learned it from you. So how can we give up.</p>
                
                <p>We are in this together and always has been, people say we look good together there is a reason. It US, You and Me, Dange Saab and Sharma Ji, han hum ladte hain, gussa karte hai, ego hurt ho jati hai, ek dusre ka dhyan rakhna bhul jate hain, magar ek dusre ko yaad karna kabhi nahi bhulte, ek dusre ke baare mein sochna kabhi nahi bhulte...that's Us against all odds.</p>
                
                <p>Baki I dont know isse jyada kya kahun...baki yaad aya toh mail kardunga. But yeah I really lucky to have you in my life, You have become inseparable part of my life, I Love you so much.</p>
                
                <p className="signature">
                  <a 
                    href="https://open.spotify.com/track/7uNnlVit5qDvfOje0pqICF?si=5bca290dcad04b71" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="spotify-link"
                  >
                    Kyunki Tum Ho 🎵
                  </a>
                  <br/>
                  <strong>yours<br/>Sharma Ji</strong>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default App;
