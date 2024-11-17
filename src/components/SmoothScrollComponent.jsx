// app/components/SmoothScrollComponent.jsx
'use client';

import { useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

const protectedRoutes = [
  "/profile",
  "/cart",
  "/checkout",
];

const SmoothScrollComponent = ({ children }) => {
  // Initialize Intersection Observer for detecting when sections are in view
  const { ref: sectionRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.01, // Trigger animation when 1% of the section is visible
  });

  // Set up a spring animation for smooth fading and translating
  const springProps = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0px)' : 'translateY(50px)',
    // make a animation slower and more bouncy
    config: { mass: 1, tension: 120, friction: 14 },
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token && protectedRoutes.includes(window.location.pathname)) {
      window.location.href = "/auth";
    }
  }, []);

  return (
    <div style={{ overflow: 'auto', height: '100vh' }}>
      <animated.div ref={sectionRef} style={springProps}>
        {children}
      </animated.div>
    </div>
  );
};

export default SmoothScrollComponent;
