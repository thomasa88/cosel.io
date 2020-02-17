import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// import Fade from 'react-reveal/Fade';
// import Flip from 'react-reveal/Flip';
import { withStyles } from '@material-ui/core/styles';

import GameArea from '../components/DrawArea/GameArea';
import Header from '../components/Header';
import WaitingToStart from '../components/Game/WaitingToStart';
import GameStep from '../components/Game/GameStep';
import { findGame } from '../actions/gameActions';

const styles = {
  main: {
    fontSize: '22px',
  },
};

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    window.scrollTo(0, 0);
  }

  componentDidMount() {
    const { match, dispatch } = this.props;
    const { hash } = match.params;
    dispatch(findGame(hash));
  }

  render() {
    const {
      classes,
      loaded,
      error,
      game,
      userId,
    } = this.props;
    let gameStep;
    if (game.state === 'IN_PROGRESS') {
      // find gameStep
      if (game.gameChains && game.gameChains.length) {
        game.gameChains.forEach(gameChain => {
          if (gameChain.gameSteps && gameChain.gameSteps.length) {
            if (gameChain.gameSteps[gameChain.gameSteps.length - 1].user === userId) {
              gameStep = gameChain.gameSteps[gameChain.gameSteps.length - 1];
            }
          }
        });
      }
    }
    // LOADING
    if (!loaded) {
      return (
        <div>
          <Header />
          <div>
            Loading...
          </div>
        </div>
      );
    }

    // ERROR
    if (error) {
      return (
        <div>
          <Header />
          <div>
            Error finding this game
          </div>
        </div>
      );
    }

    // LOADED
    return (
      <div>
        <Header />
        <main className={classes.main}>
          <div>Round: {game.round} / {game.rounds}</div>
          {game.state === 'PRE_START' && <WaitingToStart />}
          {game.state === 'IN_PROGRESS' && gameStep && <GameStep gameStep={gameStep} />}
          <GameArea />
        </main>
      </div>
    );
  }
}

Game.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object,
  game: PropTypes.object,
  dispatch: PropTypes.func,
  loaded: PropTypes.bool,
  error: PropTypes.bool,
  userId: PropTypes.string,
};

function mapStateToProps(state) {
  return {
    loaded: state.game.loaded && state.user.loaded,
    error: state.game.error,
    game: state.game.game,
    userId: state.user.user._id,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(Game));
