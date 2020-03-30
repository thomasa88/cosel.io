import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

const styles = {
  root: {
    width: '100%',
    color: '#000',
    backgroundColor: '#fff',
    position: 'fixed',
    left: 0,
    top: 0,
    textAlign: 'center',
    boxShadow: '0px 0px 0px',
    transition: '250ms ease',
    display: 'flex',
    justifyContent: 'center',
    zIndex: 1000,
  },
  rootMinimized: {
    boxShadow: '0px 1px 10px',
  },
  title: {
    margin: '0.5rem',
    fontSize: '4rem',
    fontWeight: 400,
    color: '#000',
    transition: 'all 250ms ease',
    '@media (min-height: 600px)': {
      fontSize: '6rem',
    },
    '@media (min-width: 960px)': {
      fontSize: '10rem',
    },
  },
  link: {
    textDecoration: 'none',
  },
  titleSmall: {
    '@media (min-height: 600px)': {
      fontSize: '5rem',
    },
    '@media (min-width: 960px)': {
      fontSize: '7rem',
    },
  },
  titleMinimized: {
    fontSize: '2rem',
    '@media (min-height: 600px)': {
      fontSize: '3rem',
    },
    '@media (min-width: 960px)': {
      fontSize: '5rem',
    },
  },
  headerWrapper: {
    color: 'transparent',
  },
};

const SCROLL_TOP_THRESHOLD = 25;
const TITLE = 'cosel.io';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      minimized: false,
    };
    window.addEventListener('scroll', this.onScroll);
  }

  onScroll = () => {
    const { minimizable } = this.props;
    if (!minimizable) return;
    if (window.scrollY < SCROLL_TOP_THRESHOLD) {
      this.setState({ minimized: false });
    } else {
      this.setState({ minimized: true });
    }
  }

  render() {
    const { classes, small } = this.props;
    const { minimized } = this.state;
    return (
      <div className={classNames(
        classes.title,
        small ? classes.titleSmall : '',
        minimized ? classes.titleMinimized : '',
        classes.headerWrapper,
      )}
      >
        {TITLE}
        <header className={classNames(
          classes.root,
          small ? classes.rootSmall : '',
          minimized ? classes.rootMinimized : '',
        )}
        >
          <NavLink className={classes.link} to="/">
            <div
              className={classNames(
                classes.title,
                small ? classes.titleSmall : '',
                minimized ? classes.titleMinimized : '',
              )}
            >
              {TITLE}
            </div>
          </NavLink>
        </header>
      </div>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object,
  small: PropTypes.bool,
  minimizable: PropTypes.bool,
};

export default withStyles(styles)(Header);
