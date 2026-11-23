import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Styled from './styles';
import Right from './right/component';

const Header = ({
  leftButtonProps,
  rightButtonProps,
  customRightButton,
  customTitle,
  isPlain,
  title,
  className,
  'data-test': dataTest,
  ...rest
}) => (
  <Styled.Header
    className={cx('bbb-panel-header', className)}
    data-test={dataTest || ''}
    {...rest}
  >
    {customTitle || (
      <Styled.Title className="bbb-panel-header__title" $plain={isPlain}>{title}</Styled.Title>
    )}
    {customRightButton && (
      <Styled.RightWrapper>
        {customRightButton}
      </Styled.RightWrapper>
    )}
    {rightButtonProps && (
      <Styled.RightWrapper>
        <Right {...rightButtonProps} />
      </Styled.RightWrapper>
    )}
  </Styled.Header>
);

Header.propTypes = {
  leftButtonProps: PropTypes.shape({}),
  rightButtonProps: PropTypes.shape({}),
  customRightButton: PropTypes.element,
  customTitle: PropTypes.element,
  isPlain: PropTypes.bool,
  className: PropTypes.string,
};

export default Header;
