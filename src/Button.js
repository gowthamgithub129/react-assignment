import React from 'react';

function Button({ onClick }) {
    return (
      <button className="save-button" onClick={onClick}>
        Save
      </button>
    );
  }

export default Button;
