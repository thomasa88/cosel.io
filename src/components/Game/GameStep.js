import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { TextField, Button } from '@material-ui/core';
import { connect } from 'react-redux';
import { submitStep } from '../../actions/gameActions';
import DrawingPage from '../DrawingPage/DrawingPage';
import Replay from '../Replay';
import { getDrawing } from '../../api';

const styles = {
  root: {
  },
};

class GameStep extends Component {
  constructor(props) {
    super(props);
    this.state = {
      guess: '',
      submitted: false,
      loadingDrawData: true,
      drawData: null,
      timeRemaining: 0,
    };
    this.timeout = null;
  }

  async componentDidMount() {
    const {
      gameStep,
      previousGameStep,
      guessTimeLimit,
      drawingTimeLimit,
    } = this.props;
    if (gameStep.type === 'GUESS') {
      // get drawing
      if (previousGameStep && previousGameStep.drawing) {
        const drawData = await getDrawing(previousGameStep.drawing);
        this.setState({ drawData, loadingDrawData: false });
      } else {
        console.error('PREVIOUS GAME STEP DOESNT HAVE DRAWING');
      }
      this.timeout = setTimeout(this.submitGameStep, guessTimeLimit);
      this.setState({ timeRemaining: guessTimeLimit });
    } else if (gameStep.type === 'DRAWING') {
      this.timeout = setTimeout(this.submitGameStep, drawingTimeLimit);
      this.setState({ timeRemaining: drawingTimeLimit });
    }
    const interval = setInterval(() => {
      this.setState(prevState => ({ timeRemaining: prevState.timeRemaining - 1 })).then(() => {
        const { timeRemaining } = this.state;
        if (timeRemaining <= 0) {
          clearInterval(interval);
        }
      });
    }, 1000);
  }

  submitGameStep = () => {
    const { gameStep } = this.props;
    if (this.timeout) clearTimeout(this.timeout);
    if (gameStep.type === 'GUESS') {
      this.onSubmitGuess();
    } else if (gameStep.type === 'DRAWING') {
      this.onSubmitDrawing();
    }
  }

  onSubmitGuess = () => {
    const { dispatch, gameStep } = this.props;
    const { guess } = this.state;
    gameStep.guess = guess;
    dispatch(submitStep(gameStep));
    this.setState({ submitted: true });
  }

  onSubmitDrawing = () => {
    const { dispatch, gameStep } = this.props;
    gameStep.drawData = window.drawData;
    dispatch(submitStep(gameStep));
    this.setState({ submitted: true });
  }

  render() {
    const {
      gameStep,
      previousGameStep,
      classes,
      gameChain,
    } = this.props;
    const {
      guess,
      submitted,
      loadingDrawData,
      drawData,
      timeRemaining,
    } = this.state;
    if (submitted) {
      return (
        <div>waiting for other players to submit</div>
      );
    }
    if (gameStep.type === 'GUESS') {
      return (
        <div className={classes.root}>
          <div>Guess what {previousGameStep.user.username} drew</div>
          <div>Time: {timeRemaining}</div>
          {loadingDrawData && <div>Loading...</div>}
          {!loadingDrawData && <Replay width={300} drawData={drawData} />}
          <TextField label="guess" value={guess} onChange={e => this.setState({ guess: e.target.value })} />
          <Button onClick={this.submitGameStep}>Submit</Button>
        </div>
      );
    }

    if (gameStep.type === 'DRAWING') {
      return (
        <div className={classes.root}>
          <DrawingPage onSubmitDrawing={this.submitGameStep} word={previousGameStep ? previousGameStep.guess : gameChain.originalWord} />
        </div>
      );
    }
    return <div />;
  }
}

GameStep.propTypes = {
  gameStep: PropTypes.object,
  previousGameStep: PropTypes.object,
  classes: PropTypes.object,
  dispatch: PropTypes.func,
  gameChain: PropTypes.object,
  guessTimeLimit: PropTypes.number,
  drawingTimeLimit: PropTypes.number,
};

function mapStateToProps(state) {
  return {
    drawTimeLimit: state.game.game.drawTimeLimit,
    guessTimeLimit: state.game.game.guessTimeLimit,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(GameStep));
