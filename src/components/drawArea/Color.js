import React, {Component} from 'react';

export class Color extends Component {

    state = {
        border: "",
        selected: false
    }

    glow = (c) => {
        let canvas = this.refs.canv;
        let ctx = canvas.getContext('2d');
        if(c === "onHover"){
            ctx.strokeStyle = "#DEF2F1";
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.rect(0,0,20,20);
            ctx.stroke();
            
        } else if (c === "onClick"){
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.fillRect(0,0,20,20);
            ctx.rect(1,1,18,18);
            ctx.stroke();
        }
        
    }

    unGlow = () => {
        let canvas = this.refs.canv;
        let ctx = canvas.getContext('2d');

        ctx.strokeStyle = this.props.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.fillRect(0,0,20,20);
        ctx.stroke();
    }

    componentDidMount() {
        let canvas = this.refs.canv;
        let ctx = canvas.getContext('2d');

        canvas.width = 20;
        canvas.height = 20;

        ctx.fillStyle = this.props.color;
        ctx.fillRect(0,0,20,20);

        canvas.addEventListener('mousedown', (e) => {
            this.props.changeColor(this.props.color);
        }, false);
        canvas.addEventListener('mouseover', (e) => {
            if(!this.state.selected){
                this.glow("onHover");
            }
        }, false);
        canvas.addEventListener('mouseout', (e) => {
            if(!this.state.selected){
                this.unGlow();
            }
        }, false);
    }

  

    render(){
        return (
        <div>
            <canvas ref="canv" style={{border: this.state.border}}/>
        </div>
        );
    }
  
}
export default Color;
