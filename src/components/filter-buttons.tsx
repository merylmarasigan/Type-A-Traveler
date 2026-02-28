import { useState } from 'react';

import { Button } from '@/components/ui/button'

export default function FilterButtons() {
  
  const [testText, settestText] = useState("Pressed");

  // function handleClick() {
  //   settestText(testText => testText+", Pressed");
  // };

  function handleClick() {
    settestText(prev => prev+", Pressed");
  };

  return (
    <div className="">
      <Button onClick={handleClick}>Test</Button>
      <p>{testText}</p>
    </div>
  )
}
