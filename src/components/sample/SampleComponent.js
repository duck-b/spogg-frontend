import React from 'react';

const SampleComponent = ({ name, age, birth }) => {
  return (
    <div>
      <div>{name}</div>
      <div>{age}</div>
      <div>{birth}</div>
    </div>
  );
};

export default SampleComponent;
