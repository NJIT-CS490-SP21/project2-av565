import React from 'react';
import PropTypes from 'prop-types';

export function Square(props) {
  const { func } = props;
  const { arr } = props;
  const { pos } = props;
  return (
    <button className="box" onClick={func} type="button">
      {arr[pos]}
    </button>
  );
}

Square.propTypes = {
  arr: PropTypes.arrayOf(PropTypes.string).isRequired,
  pos: PropTypes.number.isRequired,
  func: PropTypes.func.isRequired,
};

export default Square;
