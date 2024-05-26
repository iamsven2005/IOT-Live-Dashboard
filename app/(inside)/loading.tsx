"use client"
import React, { useEffect, useState } from 'react';

const carJokes = [
  "Why don't cars ever get lost? They always take the right turn.",
  "Why did the car get a ticket? Because it couldn’t stop 'braking' the law.",
  "Why did the scarecrow become a car mechanic? He was outstanding in his field.",
  "What kind of car does a Jedi drive? A Toy-Yoda.",
  "Why do taxis make good politicians? They’re always taking you for a ride.",
  "Why did the old car get kicked out of the band? Because it couldn't keep up with the 'tune-ups'.",
  "Why did the bicycle fall over? Because it was two-tired!",
  "What do you call a Ford Fiesta that ran out of gas? A Ford Siesta.",
  "Why do elephants never use computers? Because they are afraid of the mouse, but they love the 'trunk' space in cars."
];

const getRandomJoke = () => {
  const randomIndex = Math.floor(Math.random() * carJokes.length);
  return carJokes[randomIndex];
};

const Loading = () => {
  const [joke, setJoke] = useState('');

  useEffect(() => {
    setJoke(getRandomJoke());
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-center text-lg font-semibold mb-4">Loading...</div>
      <div className="text-center text-sm italic">{joke}</div>
    </div>
  );
};

export default Loading;
