'use client'
import React, { useState, useEffect } from 'react';
import '../styles/typewriter.css'

function Typewriter({ words, typingDelay = 150, deletingDelay = 100, delayBetweenWords = 1000 }) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    if (subIndex === words[index].length + 1 && !reverse) {
      setReverse(true);
      setTimeout(() => {}, delayBetweenWords); // Wait before start deleting
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length); // Move to next word
    }

    const timeout = setTimeout(() => {
      setText(words[index].substring(0, subIndex));
      setSubIndex(prev => prev + (reverse ? -1 : 1));
    }, reverse ? deletingDelay : typingDelay);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words, typingDelay, deletingDelay, delayBetweenWords]);

  return (
    <span className="typewriter-text">{text}</span>
  );
}

export default Typewriter;
