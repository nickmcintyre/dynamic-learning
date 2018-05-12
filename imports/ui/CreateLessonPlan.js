import React from 'react'
import DrawingBoardCmp from './DrawingBoardCmp'
import { LessonPlans } from '../api/lessonplans'

export default class CreateLessonPlan extends React.Component {

    componentDidMount() {

        Tracker.autorun(()=>{

            /*
                    If this refs.d is undefined, the code inside should not run
            */

            if(this.refs.d) {
                this.refs.d.b.ev.bind('board:reset',this.changeArray.bind(this));
                this.refs.d.b.ev.bind('board:stopDrawing', this.changeArray.bind(this));
            }

            if(LessonPlans.find(this.state.lessonplan_id).fetch()[0])
            {
                const slides = LessonPlans.find(this.state.lessonplan_id).fetch()[0].slides
                console.log(slides)
                this.setState({slides}, ()=>{
                    if(this.state.currSlide == 0)
                        this.refs.d.b.setImg(this.state.slides[0])
                })
            }
        })
    }

    constructor(props) {
        super(props)
        this.state = {
            currSlide:0,
            slides: [],
            lessonplan_id: this.props.location.state.lessonplan_id
        }
    }

    changeArray() {

        /*
            If either board:reset or boardLstopDrawing occur, the change should be saved to the
            state. For that, the current slide no. and the slides array are retrieved from the
            states. The note is made into an object with key note. It is then added to the slides
            array with index as the current slide no.
        */

        const currSlide = this.state.currSlide;
        const slides = [...this.state.slides];

        const note = {
            note: this.refs.d.b.getImg()
        }

        slides[currSlide]= note
        this.setState({slides,currSlide});
    }

    next() {

        /*
            The history is initialised because we do not want to get the drawings of other 
            slides to this slide. The current slide no. is retrieved from states and incremented.
            The slides array is retrieved.

            If the current slide is the last slide or no slide has yet been made, board is
            cleared and the empty board is pushed to the slides array. The value being pushed
            is an object which contain note. The changes are saved back to the state.

            Otherwise, the current slide is set to state and the notes of that particular slide
            is set to the board in the call back.
        */

        this.refs.d.b.initHistory();

        let currSlide = this.state.currSlide;
        currSlide++;

        const slides = [...this.state.slides];

        if(currSlide === slides.length || slides.length === 0) {            
            this.refs.d.b.reset({ webStorage: false, history: true, background: true }); 
            slides.push({note:this.refs.d.b.getImg()});
            this.setState({
                slides,
                currSlide
            });
        }
        else if(currSlide<slides.length) {
            this.setState({
                currSlide
            },()=>{
                this.refs.d.b.setImg(this.state.slides[this.state.currSlide].note);
            });            
        }        
    }

    previous() { 

        /*
            The current slide no. is retrieved and if its 0, initHistory should not be called
            because the history need not be cleared since the slide is not changed when previous
            is pressed.

            The slides are retrieved. If the current slide no. is greater than 0, it is decremented.
            The current slide is set and in the call back, the notes are set to the board.
         */

        let currSlide = this.state.currSlide;
        if(currSlide!=0)
        {
            this.refs.d.b.initHistory()
        }
        const slides = [...this.state.slides];
        if(currSlide>0) {
            currSlide--;
        }
        this.setState({
            currSlide
        },()=>{
            this.refs.d.b.setImg(this.state.slides[this.state.currSlide].note)
        });
    }

    save() {
        LessonPlans.update(this.state.lessonplan_id, {$set:{slides:this.state.slides}})
    }
    reset() {

        /* For resetting, the drawing board is cleared and the slides array is cleared.
           The slides array is emptied and current slide no is set to 0    
        */

        this.refs.d.b.reset({ webStorage: false, history: true, background: true }); 
        this.setState({
            slides:[],
            currSlide: 0
        })
    }

    render() {
        return (
            <div>
                <DrawingBoardCmp ref = 'd'/>
                <button onClick = {this.next.bind(this)}>Next</button>
                <button onClick = {this.previous.bind(this)}>Previous</button>
                <button onClick = {this.save.bind(this)}>save</button>
                <button onClick = {this.reset.bind(this)}>reset</button>
                <h1>{this.state.currSlide}</h1>
            </div>
        )
    }
}